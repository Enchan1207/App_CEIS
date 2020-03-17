/*
 * 指定ユーザの情報を取得し投げる 
*/

async function getinfo(userID) {
    const infoSpan = document.getElementById("userinfo");
    infoSpan.setAttribute("data-loaded", 0);

    //--userinfo
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://192.168.11.13/API_CEIS/userinfo.php?mode=1&id=" + userID);
    xhr.send();
    await awaitForLoad(xhr, "load");

    //--#userinfoに情報を書き込んでいく
    const response = JSON.parse(xhr.responseText);
    const anchor = document.createElement("a");
    const name = document.createTextNode(response.user.AccountName);
    anchor.href = "https://twitter.com/" + response.user.TwitterID;
    anchor.target = "_blank";
    anchor.innerHTML = "@" + response.user.TwitterID;
    infoSpan.innerHTML = "";
    infoSpan.appendChild(name);
    infoSpan.appendChild(anchor);

    infoSpan.setAttribute("data-loaded", 1);
}