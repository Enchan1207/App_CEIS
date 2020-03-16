/*
 * 最新画像ペイン用JS`
*/

//--APIを叩き、保存順に画像を取得していく
async function loadImages() {
    //--ペインとlimitとoffsetを取得
    const imgPane = document.getElementById("list");
    const limit = Number(imgPane.getAttribute("data-limit"));
    const offset = Number(imgPane.getAttribute("data-offset"));
    imgPane.setAttribute("data-offset", offset + limit);

    //--APIを叩く
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/API_CEIS/getimages.php?id=&mode=2&limit=" + limit + "&offset=" + offset);
    xhr.setRequestHeader('Pragma', 'no-cache');
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');
    xhr.send();
    await awaitForLoad(xhr, "load");

    const response = JSON.parse(xhr.responseText);
    const code = xhr.status;
    const images = response.images;

    //--
    if (code != 200 || response.status != 0) {
        return;
    }

    //--imgCellを配置
    images.forEach(image => {
        const imgCell = document.createElement("span");
        const img = document.createElement("img");
        const favBtn = document.createElement("span");
        favBtn.className = "fav";
        favBtn.setAttribute("data-faved", image.faved);
        imgCell.setAttribute("data-faved", image.faved); //CSSがhasセレクタを持たないのでimgCellにも書く
        imgCell.setAttribute("data-userid", image.userID);
        favBtn.setAttribute("data-path", image.url.replace("/kig/", ""));
        imgCell.appendChild(img);
        imgCell.appendChild(favBtn);
        imgCell.className = "imgCell";
        img.src = image.thumburl;
        imgPane.appendChild(imgCell);
        initImageCell(imgCell);
    });

    //--status==0 && length!=0 →さらに読み込むボタンを追加
    if (images.length != 0) {
        const loadMore = document.createElement("span");
        loadMore.className = "imgCell";
        const navImg = document.createElement("img");
        navImg.className = "loadmore";
        navImg.src = "/APP_CEIS/images/loadmore.png";
        loadMore.appendChild(navImg);
        imgPane.appendChild(loadMore);
        loadMore.addEventListener('click', function () {
            loadMore.querySelector("img").src = "/APP_CEIS/images/loading.gif";
            loadImages().then(function () {
                imgPane.removeChild(loadMore);
            });
        });
    }
}

//--imgCellを初期化
function initImageCell(imgCell) {
    //--次に振るべきIDを計算する
    const id = Number(imgCell.parentElement.getAttribute("data-count")) + 1;
    imgCell.parentElement.setAttribute("data-count", id);

    //--自身にIDを振る
    imgCell.setAttribute("data-id", "overLay[" + id + "]");

    //--クリック時オーバーレイに表示
    imgCell.addEventListener('click', function () {
        //--自分と同じ階層にいる画像を取得し、indexとsrcsを作成
        const myId = imgCell.getAttribute("data-id");
        const images = imgCell.parentElement.querySelectorAll(".imgCell");
        let index = 0;

        srcArray = [];
        images.forEach((image, imgIndex) => {
            if (image.getAttribute("data-id") == myId) {
                index = imgIndex;
            }
            const img = image.querySelector("img");
            if (img.className != "loadmore") {
                srcArray.push(img.src);
            }
        });
        const srcs = srcArray.join(",");
        showOverlay(index, srcs);
    });

    //--favボタンをクリックしたらfavる
    imgCell.querySelector(".fav").addEventListener('click', function (e) {
        e.stopPropagation();
        //--attrに設定
        const isFaved = Number(this.getAttribute("data-faved"));
        this.setAttribute("data-faved", Number(!isFaved));
        this.parentElement.setAttribute("data-faved", Number(!isFaved));

        //--xhrで送り付ける
        const path = this.getAttribute("data-path");
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/API_CEIS/setFavorite.php?faved=" + Number(!isFaved) + "&path=" + path);
        xhr.send();
    });
}