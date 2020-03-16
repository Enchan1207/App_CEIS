/*
 * オーバーレイ用js
*/

document.addEventListener('DOMContentLoaded', function () {
    //--オーバーレイ初期化
    const overLay = document.getElementById("overlay");

    //--コントロールボタンにイベントを充てる
    const ctrlCells = document.querySelectorAll("#overlay #control .btn");
    ctrlCells.forEach((ctrlCell) => {
        ctrlCell.addEventListener('click', function (e) {
            e.stopPropagation();
            switchOverlay([1, -1][Number(ctrlCell.id == "left")]);
        });
    });

    //--範囲外クリックでオーバーレイ非表示
    let clicked = false;
    overLay.querySelector("#image").addEventListener('click', function () {
        discardOverlay();
    });
    overLay.querySelector("#image img").addEventListener('click', function (e) {
        e.stopPropagation();
    });
});

//--キー押下時
document.addEventListener('keydown', function (event) {
    const overLay = document.getElementById("overlay");
    const code = event.keyCode;

    //--Escで捨てる
    if (code == 27) {
        discardOverlay();
        return;
    }

    //--左右キーで移動
    if (code == 37 || code == 39 && overLay.getAttribute("data-status") != "hide") {
        switchOverlay([1, -1][Number(code == 37)]);
    }
    return;
});

//--オーバーレイ表示
function showOverlay(at = -1, srcs = "") {
    const overLay = document.getElementById("overlay");
    //--表示位置や画像ソースが変わっていれば都度更新
    if (at >= 0) {
        overLay.setAttribute("data-index", at);
    }
    if (srcs != "") {
        overLay.setAttribute("data-srcs", srcs);
    }

    //--オーバーレイを表示
    overLay.setAttribute("data-status", "show");
    updateOverlay();
}

//--オーバーレイを移動
function switchOverlay(step = 1) {
    //--overlayに渡されたdata-srcsからsrcsを作る
    const overLay = document.getElementById("overlay");
    const srcs = overLay.getAttribute("data-srcs").split(",");
    let index = Number(overLay.getAttribute("data-index"));

    //--stepで加減算しつつ上限チェック
    index += step;
    if (index < 0) {
        index = 0;
    }
    if (index >= srcs.length) {
        index = srcs.length - 1;
    }
    overLay.setAttribute("data-index", index);

    updateOverlay();
}

//--オーバーレイの表示を更新
function updateOverlay() {
    //--overlayに渡されたdata-srcsからsrcsを作る
    const overLay = document.getElementById("overlay");
    const srcs = overLay.getAttribute("data-srcs").split(",");
    const index = Number(overLay.getAttribute("data-index"));

    //--imageにindex番目の画像を当てる
    const image = overLay.querySelector("img");
    image.src = srcs[index].replace("thumb_", "");
}

//--オーバーレイを捨てる
function discardOverlay() {
    const overLay = document.getElementById("overlay");
    overLay.setAttribute("data-status", "hide");
    overLay.querySelector("#image img").src = "/APP_CEIS/images/loading.gif";
}