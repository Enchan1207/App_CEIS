/*
 * 最新画像ペイン用JS` 
*/

document.addEventListener('DOMContentLoaded', function () {
    loadImages();

    //--listPaneの最下端に達したことを検知してloadImage
    const listPane = document.getElementById("list");
    let loaded = false;
    listPane.addEventListener('scroll', () => {
        const rawHeight = listPane.scrollHeight;
        const position = Math.ceil(listPane.scrollTop); //なんかガバいので1足す
        const elementHeight = listPane.clientHeight;

        let isscrolled = (rawHeight - position - 1) <= elementHeight; //全体高-位置<=要素高なら下端
        if (isscrolled && !loaded) {
            //--「さらに読み込む」ボタンを消す
            listPane.querySelectorAll(".imgCell").forEach(item=>{
                if(item.querySelector("img").className == "loadmore"){
                    listPane.removeChild(item);
                }
            });
            loadImages().then(function(){
                
            });
            loaded = true;
        }

        if(!isscrolled){
            loaded = false;
        }
    });
});
