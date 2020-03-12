/*
 * 最新画像ペイン用CSS
*/

let pane;
let images = [];
let img_offset = 0;
let img_limit = 100;
let ovl_id = 0; //オーバーレイ用画像id

document.addEventListener('DOMContentLoaded', function () {
    //--対象のペインに画像を渡す
    pane = document.querySelector("#list");
    loadImages(pane, img_limit, img_offset);
    img_offset += img_limit;
});

//--指定ペインに対し、範囲とユーザIDを指定して画像を読み込む
function loadImages(pane, limit, offset, userID = "") {
    //--getimagesで画像を取得しimgCellを追加していく
    let xhr_img = new XMLHttpRequest();
    xhr_img.addEventListener("load", function () {
        let data = JSON.parse(this.responseText);
        let images = data.images
        let code = this.status;

        //--正しく取得できていなければreturn
        if (code != 200) {
            return 1;
        } else if (data.status == -1) {
            return 1;
        }

        //--imgCellを足す
        images.forEach(image => {
            //--imgCellの外観を作る
            let imgCell = document.createElement("span");
            imgCell.className = "imgCell";
            let img = document.createElement("img");
            img.src = image.thumburl;
            imgCell.setAttribute("data-id", "overLay[" + ovl_id + "]");
            ovl_id++;

            //--イベントを貼る
            imgCell.addEventListener('click', function () {
                //--親要素のimgを全部取ってきてoverlayに投げる
                let id = imgCell.getAttribute("data-id");
                let images = imgCell.parentElement.querySelectorAll(".imgCell");

                srcs = [];
                images.forEach((image, imgIndex) => {
                    if (image.getAttribute("data-id") == id) {
                        index = imgIndex;
                    }
                    srcs.push(image.querySelector("img").src);
                });

                //画像一覧と今自分が見ている画像のインデックスを渡して、オーバーレイ表示
                showOverlay();
            });
            imgCell.appendChild(img);
            pane.appendChild(imgCell);
        });
        return 0;
    });
    let url = "/API_CEIS/getimages.php?limit=" + limit + "&offset=" + offset + "&id=" + userID + "&mode=" + [1, 2][Number(userID == "")];
    xhr_img.open("GET", url);
    xhr_img.send();
}