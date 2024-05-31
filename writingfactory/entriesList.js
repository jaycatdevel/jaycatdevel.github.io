var wf = wf || {};

wf.entriesList = (function(){
    "use strict";  

    let _entriesList;
    let _currentEntry;
    const _listName = "entriesList";
    const _entryPrefix = "Entry_";

    async function _init(){        
        await _loadEntries();
        await _drawEntries();        
    }

    async function _loadEntries(){
        _entriesList = await wf.entries.getAllProjectEntries(wf.projects.getCurrentProjectKey());        
    }

    async function _drawEntries(){                
        wf.lists.draw(_entriesList,_listName,_drawEntry);
        _currentEntry = undefined;
        _selectEntry(wf.entries.getCurrentEntry());
    }

    function _drawEntry(entry){        
        const newDiv = document.createElement("div");
        newDiv.classList.add("note");
        newDiv.classList.add("entry");
        newDiv.id = _entryPrefix + entry.key.toFixed(0);
        newDiv.onclick = _entryClick;
        newDiv.ondblclick = wf.entry.editEntry;
        let vText = entry.name;        
        const newContent = document.createTextNode(vText);
        newDiv.appendChild(newContent);

        const currentDiv = document.getElementById(_listName);
        currentDiv.appendChild(newDiv);        
    }

    async function _addEntry(){
        await wf.entries.addEntry("Untitled");                
        await wf.entries.getLastEntry();
        await _loadEntries();
        _drawEntries();
    }

    function _highlightEntry(entry){        
        if(_currentEntry){
            _currentEntry.classList.remove("highlight");
        }        
        
        const currentDiv = document.getElementById(_entryPrefix + entry.key.toFixed(0));
        if(currentDiv){
            currentDiv.classList.add("highlight");
        }
        _currentEntry = currentDiv;
    }

    async function _entryClick(){
        if(this && this.id){
            let _newId = this.id;
            let vKey = parseInt(_newId.replace(_entryPrefix,""));            
            _selectEntry(await wf.entries.getSingleEntry(vKey));            
        }        
    }
    
    function _selectEntry(entry){        
        if(entry){
            if(!Array.isArray(entry)){
                entry = [entry];
            }
            if(entry.length > 0){            
                _highlightEntry(entry[0]);
                wf.entry.loadEntry(entry[0]);
            }
        }                
    }

    return {
        init: _init,
        addEntry: _addEntry
    };
})();