/* 
 * ズームボタン用CSS
*/

let size = 150;
document.addEventListener('DOMContentLoaded', function () {
    //--現在のサイズを取得
    size = Number(document.documentElement.style.getPropertyValue("--size"));
    if(size == 0){
        size  =150;
    }
    document.documentElement.style.setProperty('--size', size);
    
    //--ボタンにイベントを貼る
    const buttons = document.querySelectorAll("#scalebtn .btn");
    buttons.forEach((elem) => {
        elem.addEventListener('click', function () {
            if (this.id == "up") {
                size += 10;
            } else {
                size -= 10;
            }
            if (size < 50) {
                size = 50;
            }
            if (size > 400) {
                size = 400;
            }
            document.documentElement.style.setProperty('--size', size);
        });
    });
});