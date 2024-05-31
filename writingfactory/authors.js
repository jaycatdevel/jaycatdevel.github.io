var wf = wf || {};

wf.authors = (function(){
    "use strict";    

    let _tableName = "authors";    
    let _currentAuthor;

    async function _init(){        
        return _currentAuthor = await wf.db.initDataTable(_tableName,_addAuthor.curry("Anonymous"));                
    }

    async function _addAuthor(authorName){
        let tempAuthor = {name: authorName};
        await wf.db.add(_tableName,[tempAuthor]);
        return await _init();
    }

    function _getCurrentAuthorKey(){        
        if(_currentAuthor && _currentAuthor.key){
            return _currentAuthor.key;
        }
    }

    return {
        init: _init,
        getCurrentAuthorKey: _getCurrentAuthorKey
    };
})();