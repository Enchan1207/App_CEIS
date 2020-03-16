/*
 * ユーザ別画像リスト用JS 
*/
document.addEventListener('DOMContentLoaded', function () {
    //--uimgPaneの最下端に達したことを検知してloadImage
    const uimgPane = document.getElementById("userimages");
    let loaded = false;
    uimgPane.addEventListener('scroll', () => {
        const rawHeight = uimgPane.scrollHeight;
        const position = Math.ceil(uimgPane.scrollTop); //なんかガバいので1足す
        const elementHeight = uimgPane.clientHeight;

        //全体高-位置<=要素高なら下端 rawHeight>20 は要素が削除された際に発火するscrollイベントを無視するため
        let isscrolled = (rawHeight - position - 1) <= elementHeight;
        if (isscrolled && rawHeight > 20 && !loaded) {
            //--「さらに読み込む」ボタンを消す
            uimgPane.querySelectorAll(".imgCell").forEach(item => {
                if (item.querySelector("img").className == "loadmore") {
                    uimgPane.removeChild(item);
                }
            });
            loadUserImages(uimgPane.getAttribute("data-userid"));
            loaded = true;
        }

        if (!isscrolled) {
            loaded = false;
        }
    });
});

document.addEventListener('onUserImgpaneChange', function (event) {
    const uimgPane = document.getElementById("userimages");
    const preUID = uimgPane.getAttribute("data-userid");
    const targetID = event.target.getAttribute("data-userid");

    //--呼び出し元のIDと現在表示中のIDが違えばinnerHTMLを空っぽにしてからload
    if (preUID != targetID) {
        uimgPane.setAttribute("data-offset", 0);
        uimgPane.setAttribute("data-count", 0);
        uimgPane.querySelectorAll(".imgCell").forEach((item)=>{
            uimgPane.removeChild(item);
        })
    }

    loadUserImages(targetID);

    document.getElementById("userimg").checked = true;
});
