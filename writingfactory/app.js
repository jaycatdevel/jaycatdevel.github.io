var wf = wf || {};

wf.app = (function(){
    "use strict";

    async function _init(){        
        await wf.db.open();    
        await wf.authors.init();    
        await wf.projects.init();            
        await wf.entries.init();    
        await wf.notes.init();    
        await wf.screen.init();
    };

    return {
        init: _init
    };
})();

if (document.readyState === "loading") {
    // Loading hasn't finished yet
    document.addEventListener("DOMContentLoaded", wf.app.init);
} else {
// `DOMContentLoaded` has already fired
    wf.app.init();
}