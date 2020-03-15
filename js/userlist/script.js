/*
 * ユーザリスト用JS
*/

document.addEventListener('DOMContentLoaded', function () {
    loadUser();

    //--userPaneの最下端に達したことを検知してloadUser
    const userPane = document.getElementById("user");
    let loaded = false;
    userPane.addEventListener('scroll', () => {
        const rawHeight = userPane.scrollHeight;
        const position = Math.ceil(userPane.scrollTop); //なんかガバいので1足す
        const elementHeight = userPane.clientHeight;

        let isscrolled = (rawHeight - position - 1) <= elementHeight; //全体高-位置<=要素高なら下端
        if (isscrolled && !loaded) {
            //--「さらに読み込む」ボタンを消す
            userPane.querySelectorAll(".userCell").forEach(item => {
                if (item.querySelector("img.loadmore") != null) {
                    userPane.removeChild(item);
                }
            });
            loadUser();
            loaded = true;
        }

        if(!isscrolled){
            loaded = false;
        }
    });

});
