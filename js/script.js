/*
 * メインjs 
*/

document.addEventListener('DOMContentLoaded', function () {


});

//--ペイン内の最大セル配置数を取得
function getCellmax(pane, cellname){
    let rst = {status:-1, count: 0};
    try {
        rst.status = 0;
        let imgCell = pane.querySelector(cellname);
        let cellYmax = pane.clientHeight / imgCell.clientHeight;
        let cellXmax = pane.clientWidth / imgCell.clientWidth;
        rst.count = cellXmax * cellYmax;
    } catch (error) {
    }
    return rst;
}