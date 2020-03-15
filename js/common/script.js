/*
 * メインjs 
*/

document.addEventListener('DOMContentLoaded', function () {
});

//--ペイン内の最大セル配置数を取得
function getCellmax(pane, cellname) {
    const rst = { status: -1, count: 0 };
    try {
        rst.status = 0;
        const imgCell = pane.querySelector(cellname);
        const cellYmax = pane.clientHeight / imgCell.clientHeight;
        const cellXmax = pane.clientWidth / imgCell.clientWidth;
        rst.count = cellXmax * cellYmax;
    } catch (error) {
    }
    return rst;
}