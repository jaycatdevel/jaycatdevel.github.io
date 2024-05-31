var wf = wf || {};

wf.screen = (function(){
    "use strict";  

    async function _init(){
        await wf.projectsList.init();        
    }    

    return {
        init: _init
    };
})();