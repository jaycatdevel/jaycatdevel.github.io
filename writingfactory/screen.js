var wf = wf || {};

wf.screen = (function(){
    "use strict";  

    async function _init(){
        let vTextEditor = document.getElementById("entryText")
        vTextEditor.onkeydown = wf.entry.keyDown;
        vTextEditor.onkeyup = wf.entry.keyUp;
        vTextEditor.onblur = wf.entry.saveText;
        await wf.projectsList.init();        
    }    

    return {
        init: _init
    };
})();