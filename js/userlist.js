/* 
 * ユーザリスト用js
*/

let usr_offset = 0;
let usr_limit = 20;
let userimg_offset = 0;
let userimg_limit = 20;
let userlist = [];
let userList;

document.addEventListener('DOMContentLoaded', function () {
    //--userTableを叩いてユーザリストを追加する
    loadUser();
});

//--ユーザリスト読み込み
function loadUser(pattern = ".*") {
    userList = document.querySelector("#user");

    //--とりあえずuserlist.phpを叩いて取得し
    let xhr_user = new XMLHttpRequest();
    xhr_user.addEventListener("load", function () {
        //--JSONに変換して
        let data = JSON.parse(this.responseText);
        userlist = userlist.concat(data.users);

        //--正しく取得できていなければreturn
        if (this.status != 200) {
            return 1;
        } else if (data.status == -1) {
            return 1;
        }
        usr_offset += usr_limit;

        //--各ユーザについて
        let i = 0;
        let users = data.users;
        let id = setInterval(() => {

            if (i >= users.length - 1) {
                clearInterval(id);
            }

            //--データからuserCellを作り追加
            let user = users[i];
            let userCell = createUserCell(user.id, user.userID, user.TwitterID, user.AccountName);
            userList.appendChild(userCell);
            updateUserInfo(userCell);

            //--インデックスを進める
            i++;
        }, 100);
    });
    xhr_user.open("GET", "/API_CEIS/userlist.php?limit=" + usr_limit + "&offset=" + usr_offset + "&pattern=" + pattern);
    xhr_user.send();
}

//--userCellを作る
function createUserCell(id, userid, twitterid, accountname) {
    //--外観を構成
    let userCell = document.createElement("span");
    userCell.className = "userCell";
    userCell.setAttribute("data-checked", 0); //後でサムネイルやらなんやらを更新する時のためのフラグ
    userCell.setAttribute("data-userid", userid);
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

    //--イベントを貼る
    userCell.addEventListener('click', function () {
        //--userIDを渡して隠しペインに画像を読み込ませて切り替える
        let pane = document.querySelector("#userimages");
        let preuID = pane.getAttribute("data-userid");
        let userID = userCell.getAttribute("data-userid");

        if (preuID != userID) {
            //paneを作り直す
            let clone = pane.cloneNode(false);
            pane.parentNode.replaceChild(clone, pane);
            pane = clone;
            pane.setAttribute("data-userid", userID);
        }
        userimg_offset = 0;
        loadImages(pane, userimg_limit, userimg_offset, userID);
        userimg_offset += userimg_limit;

        document.querySelector("input#userimg").checked = true;
    });

    return userCell;
}

//--ユーザの画像保存情報を取得、設定
function updateUserInfo(userCell) {
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