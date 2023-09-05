var stormcloud = stormcloud || {};

stormcloud.messages = (function(){
    "use strict";

    let _vCallback = undefined;
    function _open(o){
        if(o){
            if(o.title){
                let vHeader = document.getElementById("modalHeader");    
                vHeader.innerText = o.title;
            }
            if(o.message){
                let vMessage = document.getElementById("modalText");    
                vMessage.innerText = o.message;
            }
            if(o.success){
                _vCallback = o.success;
            }
        }
        let vDialog = document.getElementById("modalDialog");
        vDialog.setAttribute("class","modalOverlay");
    }

    function _close(){
        let vDialog = document.getElementById("modalDialog");
        vDialog.setAttribute("class","modalOverlay none");
    }

    function _okay(){
        if(_vCallback){
            _vCallback();
        }
        _close();
    }

    return {
        open: _open,
        okay: _okay,
        close: _close
    };
})();
