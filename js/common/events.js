/* 
 * カスタムイベント
*/

const UIPChangeEvent = new Event('onUserImgpaneChange', {bubbles:true});

//--任意タイプのイベントに対して待機
const awaitForLoad = (target, type) => {
    return new Promise(resolve => {
        target.addEventListener(type, resolve, { once: true });
    });
};