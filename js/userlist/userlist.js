/*
 * ユーザリスト用JS
*/

//--APIを叩き、ユーザリストを取得してセルを追加
async function loadUser() {
    //--ペインとlimitとoffsetを取得
    const listPane = document.getElementById("user");
    const limit = Number(listPane.getAttribute("data-limit"));
    const offset = Number(listPane.getAttribute("data-offset"));
    listPane.setAttribute("data-offset", offset + limit);

    //--APIを叩く
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/API_CEIS/userlist.php?limit=" + limit + "&offset=" + offset);
    xhr.send();
    await awaitForLoad(xhr, "load");

    const response = JSON.parse(xhr.responseText);
    const code = xhr.status;
    const users = response.users;

    //--
    if (code != 200 || response.status != 0) {
        return;
    }

    //--userCellを配置
    users.forEach(user => {
        const userCell = createUserCell(user.id, user.userID, user.TwitterID, user.AccountName);
        //--クリック時隠しpaneを必要に応じて再構成し切り替える
        userCell.addEventListener('click', function () {
            //userIDを渡したカスタムイベントを叩きつける
            this.dispatchEvent(UIPChangeEvent);
        });
        listPane.appendChild(userCell);
    });

    //--status==0 && length!=0 →さらに読み込むボタンを追加
    if (users.length != 0) {
        const loadMore = document.createElement("span");
        loadMore.className = "userCell";
        loadMore.setAttribute("data-checked", 1); //こいつはupdateUserInfoから外す
        const navImg = document.createElement("img");
        navImg.className = "loadmore";
        navImg.src = "/APP_CEIS/images/loadmore.png";
        loadMore.appendChild(navImg);
        listPane.appendChild(loadMore);
        loadMore.addEventListener('click', function () {
            loadMore.querySelector("img").src="/APP_CEIS/images/loading.gif";
            loadUser().then(function(){
                listPane.removeChild(loadMore);
            });
        });
    }

    //--追加処理が終わったタイミングでupdateUserInfo
    const intvId = setInterval(() => {
        const target = listPane.querySelector(".userCell[data-checked=\"0\"]");
        if (target != null) {
            updateUserInfo(target);
        } else {
            clearInterval(intvId);
        }
    }, 200);
}

//--userCellを作る
function createUserCell(id, userid, twitterid, accountname) {
    //--外観を構成
    let userCell = document.createElement("span");
    userCell.className = "userCell";
    userCell.setAttribute("data-checked", 0); //後でサムネイルやらなんやらを更新する時のためのフラグ
    userCell.setAttribute("data-userid", userid);
    userCell.setAttribute("data-empty", 0);
    let thumbCell = document.createElement("span");
    thumbCell.className = "thumbCell";
    let nameCell = document.createElement("span");
    nameCell.className = "nameCell";
    nameCell.setAttribute("data-type", ["untracked", "tracking", "finished"][id]);
    nameCell.innerHTML = accountname;
    let idCell = document.createElement("span");
    idCell.className = "idCell";
    let idAnchor = document.createElement("a");
    idAnchor.target = "_blank";
    idAnchor.href = "https://twitter.com/" + twitterid;
    idAnchor.innerHTML = "(@" + twitterid + ")";
    let infoCell = document.createElement("span");
    infoCell.className = "infoCell";

    idCell.appendChild(idAnchor);
    userCell.appendChild(thumbCell);
    userCell.appendChild(nameCell);
    userCell.appendChild(idCell);
    userCell.appendChild(infoCell);
    return userCell;
}

//--ユーザの画像保存情報を取得、設定
async function updateUserInfo(userCell) {
    userCell.setAttribute("data-checked", 1);

    //--保存画像枚数
    let xhr_info = new XMLHttpRequest();
    xhr_info.addEventListener("load", function () {
        let data = JSON.parse(this.responseText);
        let imgInfo = data.user.images;

        //--正しく取得できていなければreturn
        if (this.status != 200) {
            return 1;
        } else if (data.result == -1) {
            return 1;
        }

        //--userCellに値を突っ込む
        let infoCell = userCell.querySelector(".infoCell");
        let percent = (Math.round((imgInfo.saved / imgInfo.target) * 10) / 10 * 100);
        if (isNaN(percent)) {
            percent = 0;
        }
        if(percent == 0){
            userCell.setAttribute("data-empty", 1);
        }
        let content = imgInfo.saved + "(" + percent + "%)";
        infoCell.innerHTML = content;
    });
    xhr_info.open("GET", "/API_CEIS/userinfo.php?mode=1&id=" + userCell.getAttribute("data-userid"));
    xhr_info.send();

    //--サムネ
    let xhr_thumb = new XMLHttpRequest();
    xhr_thumb.addEventListener("load", function () {
        let data = JSON.parse(this.responseText);
        let images = data.images;

        //--正しく取得できていなければreturn
        if (this.status != 200) {
            return 1;
        } else if (data.result == -1) {
            return 1;
        }

        //--thumbCellに値を突っ込む
        let thumbCell = userCell.querySelector(".thumbCell");
        images.forEach((image) => {
            let img = document.createElement("img");
            img.src = image.thumburl;
            thumbCell.appendChild(img);
        });

        //--ここでサムネイルの余りを埋める
        paddingThumb(userCell);
    });
    xhr_thumb.open("GET", "/API_CEIS/getimages.php?mode=1&limit=4&id=" + userCell.getAttribute("data-userid"));
    xhr_thumb.send();
}

//--サムネ画像が4枚なければspanを足す
function paddingThumb(userCell) {
    let thumb = userCell.querySelector(".thumbCell");
    let elements = thumb.querySelectorAll("img");
    if (elements.length != 4) {
        for (let i = 0; i < 4 - elements.length; i++) {
            thumb.appendChild(document.createElement("span"));
        }
    }
}