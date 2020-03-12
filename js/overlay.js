/*
 * オーバーレイ用js
*/

let index = 0;
let srcs = ["/APP_CEIS/images/loading.gif"];
let overLay;
let id = 0;

//--
document.addEventListener('DOMContentLoaded', function () {
    //--オーバーレイ初期化
    overLay = document.querySelector("#overlay");
    initOverlay();

    //--範囲外クリックでオーバーレイ非表示
    let clicked = false;
    overLay.querySelector("#image").addEventListener('click', function () {
        if (!clicked) {
            discardOverlay();
        }
        clicked = false;
    });
    overLay.querySelector("img").addEventListener('click', function () {
        clicked = true;
    });


});

//--キー押下時
document.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        //--左右キーでオーバーレイ画像移動
        case 39:
            index++;
            updateOverlay();
            break;
        case 37:
            index--;
            updateOverlay();
            break;

        //--escで潰す
        case 27:
            discardOverlay();
            break;

        default:
            break;
    }
});

//--オーバーレイ初期化
function initOverlay() {
    //--
    let imgCells = document.querySelectorAll(".pane .imgCell");
    imgCells.forEach((imgCell) => {
        //--IDを振る
        imgCell.setAttribute("data-id", "overLay[" + id + "]");
        id++;

        //--クリック時オーバーレイ表示
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
    });

    //--コントロールボタンにイベントを充てる
    let ctrlCells = document.querySelectorAll("#overlay #control .btn");
    ctrlCells.forEach((ctrlCell) => {
        if (ctrlCell.id == "right") {
            ctrlCell.addEventListener('click', function () {
                index++;
                updateOverlay();
            });
        }
        if (ctrlCell.id == "left") {
            ctrlCell.addEventListener('click', function () {
                index--;
                updateOverlay();
            });
        }
    });
}

//--オーバーレイ表示
function showOverlay() {
    //--オーバーレイに属性を割り当て、imgにsrcをセット
    overLay.setAttribute("data-status", "show");
    updateOverlay();
}
//--オーバーレイ更新
function updateOverlay() {
    let image = overLay.querySelector("img");
    if (index < 0) {
        index = 0;
    }
    if (index >= srcs.length) {
        index = srcs.length - 1;
    }
    image.src = srcs[index].replace("thumb_", "");
}

//--オーバーレイを捨てる
function discardOverlay() {
    overLay.setAttribute("data-status", "hide");
    overLay.querySelector("#image img").src = "/APP_CEIS/images/loading.gif";
}