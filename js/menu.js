/*
 * メニューバー用CSS 
*/

document.addEventListener('DOMContentLoaded', function(){
    //--メニュー閉じたり開いたり
    let menubtn = document.querySelector("#navbtn");
    let menubar = document.querySelector("#menu");
    let mode = 0;
    menubtn.addEventListener('click', function(){
        this.className = ["open", "close"][mode = mode ^ 1];
    });
});