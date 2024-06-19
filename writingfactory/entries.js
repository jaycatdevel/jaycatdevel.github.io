var wf = wf || {};

wf.entries = (function(){
    "use strict";    

    let _tableName = "entries";    
    let _currentEntry;

    async function _init(){        
        await wf.db.initDataTable(_tableName,_addEntry.curry("Untitled"));                
        _currentEntry = await _getSingleEntry();
        return _currentEntry;
    }
    
    function _createIndices(objectStore){        
        if(objectStore){
            objectStore.createIndex("project", "project", { unique: false });
        }        
    }

    async function _addEntry(entryName){
        let tempEntry = {name: entryName, project: wf.projects.getCurrentProjectKey()};
        let vResult = await wf.db.add(_tableName,[tempEntry]);
        await _init();        
    }

    async function _getAllProjectEntries(projectName){
        return  await wf.db.getAll(_tableName,"project",{only: projectName});
    }

    

    async function _getSingleEntry(entryID){
        _currentEntry = await wf.db.getSingleItem(_tableName,entryID);                
        return _currentEntry;        
    }

    async function _getLastEntry(){
        _currentEntry = await wf.db.getLastItem(_tableName);
        return _currentEntry;
    }
    
    async function _save(entry){
        if(entry){
            await wf.db.save(_tableName,[entry]);
        }
    }

    function _getCurrentEntry(){
        return _currentEntry;
    }

    return {
        init: _init,
        getAllProjectEntries: _getAllProjectEntries,
        createIndices: _createIndices,
        addEntry: _addEntry,        
        getSingleEntry: _getSingleEntry,
        getLastEntry: _getLastEntry,
        save: _save,
        getCurrentEntry: _getCurrentEntry     
    };
})();