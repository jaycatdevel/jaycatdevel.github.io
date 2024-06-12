var wf = wf || {};

wf.notes = (function(){
    "use strict";   
    let _tableName = "notes";    
    let _currentNote;

    async function _init(){                
    }

    function _createIndices(objectStore){        
        if(objectStore){
            objectStore.createIndex("project", "project", { unique: false });
            objectStore.createIndex("entry", "entry", { unique: false });
        }        
    }

    async function _addNote(entryNote){
        let tempEntry ="";
        let vNoteText = "New Project Note";
        if(entryNote){
            tempEntry = wf.entry.getCurrentEntryKey();
            vNoteText = "New Entry Note";
        }
        let tempNote = {name: vNoteText, entry: tempEntry,project: wf.projects.getCurrentProjectKey()};
        await wf.db.add(_tableName,[tempNote]);
        await _init();        
    }

    async function _getAllProjectNotes(projectKey){
        return  await wf.db.getAll(_tableName,"project",{only: projectKey});
    }

    async function _save(note){
        if(note){
            await wf.db.save(_tableName,[note]);
        }
    }

    async function _getSingleNote(noteID){
        _currentNote = await wf.db.getSingleItem(_tableName,noteID);                
        return _currentNote;        
    }
    
    return {
        init: _init,
        addNote: _addNote,
        getAllProjectNotes: _getAllProjectNotes,
        createIndices: _createIndices,
        save: _save,
        getSingleNote: _getSingleNote
    };
})();