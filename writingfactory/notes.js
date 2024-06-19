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

    async function _addNote(entryNote, pNoteText){
        let tempEntry ="";
        let vNoteText = "New Project Note";
        if(entryNote){
            tempEntry = wf.entry.getCurrentEntryKey();
            vNoteText = "New Entry Note";
        }

        if(pNoteText){
            vNoteText = pNoteText;
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

    async function _convertToProjectNote(){
        if(_currentNote){
            _currentNote.entry = "";
            await _save(_currentNote);
            wf.notesList.init();
        }        
    }

    async function _convertToEntryNote(){
        if(_currentNote){
            let tempEntry = wf.entry.getCurrentEntryKey();
            _currentNote.entry = tempEntry;
            await _save(_currentNote);
            wf.notesList.init();
        }        
    }
    
    async function _textToProjectNotes(){
        let vEntries = wf.entry.getEntryLines();        
        if(vEntries && vEntries.length > 0){
            for(let key in vEntries){
                let tempEntry = vEntries[key];
                if(tempEntry !== ""){
                    await _addNote(false,tempEntry);
                }
            }
            wf.notesList.init();
        }
    }

    async function _deleteNote(){
        if(_currentNote){
            await wf.db.delete(_tableName,_currentNote.key);        
            wf.notesList.init();
        }
    }

    return {
        init: _init,
        addNote: _addNote,
        getAllProjectNotes: _getAllProjectNotes,
        createIndices: _createIndices,
        save: _save,
        getSingleNote: _getSingleNote,
        convertToProjectNote: _convertToProjectNote,
        convertToEntryNote: _convertToEntryNote,
        textToProjectNotes: _textToProjectNotes,
        deleteNote: _deleteNote
    };
})();