/*
 * サムネイル用js
*/

document.addEventListener('DOMContentLoaded', function(){
    //--サムネイルセル初期化
    initThumbnail();

});

//--サムネ画像が4枚なければspanを足す
function initThumbnail(){
    let thumnails = document.querySelectorAll(".thumbCell");
    thumnails.forEach((thumb) => {
        let elements = thumb.querySelectorAll("img");
        if(elements.length != 4){
            for (let i = 0; i < 4-elements.length; i++) {
                thumb.appendChild(document.createElement("span"));
            }
        }
    });
}