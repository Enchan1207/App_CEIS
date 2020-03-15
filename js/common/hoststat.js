/*
 * ホスト状態JS
*/

document.addEventListener('DOMContentLoaded', function(){
    setInterval(() => {
        updateHostStat();
    },5000);
});

//--
function updateHostStat(){
    const target = document.querySelector("#status");
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function(){
        let response = JSON.parse(this.responseText);
        let code = this.status;
        
        if(code!=200){
            return;
        }
        if(response.power=="0x50005"){
            target.className = "undervoltage";
        }else{
            target.className = "normal";
        }
        target.innerHTML = response.temp + "℃";
    });
    xhr.open("GET", "/HostStat/");
    xhr.send();
}