/*
 * 最新画像ペイン用JS` 
*/

document.addEventListener('DOMContentLoaded', function () {
    loadImages();
    detectBottomScroll(); //最下端スクロールを検知してloadImagesする
});

//--下端スクロール検知
function detectBottomScroll(){
    const listPane = document.getElementById("list");
    listPane.addEventListener('scroll', () => {
        const rawHeight = listPane.scrollHeight;
        const position = Math.ceil(listPane.scrollTop); //なんかガバいので1足す
        const elementHeight = listPane.clientHeight

        let isscrolled = (rawHeight - position - 1) <= elementHeight; //全体高-位置<=要素高なら下端
        if (isscrolled) {
            //--「さらに読み込む」ボタンを消す
            listPane.querySelectorAll(".imgCell").forEach(item=>{
                if(item.querySelector("img").className == "loadmore"){
                    listPane.removeChild(item);
                }
            });
            loadImages();
            isscrolled = false;
        }
    });
}