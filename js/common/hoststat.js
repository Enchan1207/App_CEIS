/*
 * ホスト状態JS
*/

document.addEventListener('DOMContentLoaded', function () {
    setInterval(() => {
        updateHostStat();
    }, 10000);
});

//--
async function updateHostStat() {
    const target = document.querySelector("#status");
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/HostStat/");
    xhr.send();
    await awaitForLoad(xhr, "load");

    let response = JSON.parse(xhr.responseText);
    let code = xhr.status;
    if (code != 200) {
        return;
    }
    if (response.power == "0x50005") {
        target.className = "undervoltage";
    } else {
        target.className = "normal";
    }
    target.innerHTML = response.temp + "℃";
}