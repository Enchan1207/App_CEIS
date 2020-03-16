/*
 * いいねした画像以外表示しない
*/
document.addEventListener('DOMContentLoaded', function () {
    initOFavCB();
});

//-- initOnlyFavCheckBoxの略
function initOFavCB() {
    const target = document.getElementById("fav");
    target.addEventListener('click', function () {
        document.querySelectorAll("input.onlyfav").forEach((item) => {
            item.checked = !item.checked;
        });
    });
}