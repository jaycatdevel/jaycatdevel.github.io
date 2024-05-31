var wf = wf || {};

wf.lists = (function(){
    "use strict";

    function _clear(listName){
        let div = document.getElementById(listName);
        while(div.firstChild){
            div.removeChild(div.firstChild);
        }
    }

    function _draw(_itemList,listName,callBack){
        if(_itemList && listName && callBack){        
            _clear(listName);
            for(let item in _itemList){
                let tempItem = _itemList[item];
                callBack(tempItem);            
            }
        }
    }
    
    return {
        clear: _clear,
        draw: _draw
    };
})();