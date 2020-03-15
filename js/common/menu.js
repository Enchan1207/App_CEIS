/*
 * メニューバー用CSS 
*/

document.addEventListener('DOMContentLoaded', function(){
    //--メニュー閉じたり開いたり
    const menubtn = document.querySelector("#navbtn");
    const menubar = document.querySelector("#menu");
    let mode = 0;
    menubtn.addEventListener('click', function(){
        this.className = ["open", "close"][mode ^= 1];
    });
});