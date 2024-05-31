var wf = wf || {};

wf.notesList = (function(){
    "use strict";  

    let _notesList;
    let _currentNote;
    const _listName = "notesList";
    const _notePrefix = "Note_";

    async function _init(){        
        await _loadNotes();
        await _drawNotes();        
    }

    async function _loadNotes(){
        let _temp = await wf.notes.getAllProjectNotes(wf.projects.getCurrentProjectKey());        
        _notesList = [];        
        for(let key in _temp ){
            let vTemp = _temp[key];
            if(vTemp.entry === "" || vTemp.entry === wf.entries.getCurrentEntryKey()){
                _notesList.push(vTemp);
            }
        }
    }

    async function _drawNotes(){               
        wf.lists.draw(_notesList,_listName,_drawNote);        
    }

    function _drawNote(note){        
        const newDiv = document.createElement("div");
        newDiv.id = _notePrefix + note.key.toFixed(0);
        newDiv.onclick = _noteClick;
        newDiv.ondblclick = wf.note.editNote;        
        newDiv.classList.add("note");
        if(note.entry === ""){
            newDiv.classList.add("projectNote");
        } else{
            newDiv.classList.add("entryNote");
        }
        let textContent = note.name; 
        if(!textContent){
            textContent = "";
        }             
        try{
            newDiv.innerHTML = JSON.parse(textContent);
        } catch{
            newDiv.innerHTML = textContent;
        }
        
        const currentDiv = document.getElementById(_listName);
        currentDiv.appendChild(newDiv);        
    }

    async function _addNote(entryNote){
        await wf.notes.addNote(entryNote);
        await _init();
    }

    async function _noteClick(){
        if(this && this.id){
            let _newId = this.id;
            let vKey = parseInt(_newId.replace(_notePrefix,""));            
            _selectNote(await wf.notes.getSingleNote(vKey));            
        }        
    }

    function _highlightNote(note){        
        if(_currentNote){
            _currentNote.classList.remove("highlight");
        }        
        
        const currentDiv = document.getElementById(_notePrefix + note.key.toFixed(0));
        if(currentDiv){
            currentDiv.classList.add("highlight");
        }
        _currentNote = currentDiv;
    }

    function _selectNote(note){        
        if(note){
            if(!Array.isArray(note)){
                note = [note];
            }
            if(note.length > 0){            
                _highlightNote(note[0]); 
                wf.note.loadNote(note[0]);               
            }
        }                
    }

    

    return {
        init: _init,
        addNote: _addNote
    };
})();
