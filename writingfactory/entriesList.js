var wf = wf || {};

wf.entriesList = (function(){
    "use strict";  

    let _entriesList;
    let _currentEntry;
    const _defaultName = "entriesList";
    const _entryPrefix = "Entry_";
    let _overrideName = undefined;

    async function _init(){        
        await _loadEntries();
        await _drawEntries();        
    }

    async function _loadEntries(){
        _entriesList = await wf.entries.getAllProjectEntries(wf.projects.getCurrentProjectKey());        
    }

    async function _drawEntries(){                
        wf.lists.draw(_entriesList,_listName(),_drawEntry);
        _currentEntry = undefined;        
    }

    function _drawEntry(entry){        
        const parentDiv = document.createElement("div");
        const entryDiv = document.createElement("div");
        const wordcountDiv = document.createElement("div");
        parentDiv.classList.add("note");
        parentDiv.classList.add("entry");
        entryDiv.classList.add("entryDisp");
        entryDiv.classList.add("mouseover");
        entryDiv.id = _entryPrefix + entry.key.toFixed(0);
        parentDiv.onclick = _entryClick;
        parentDiv.id = _entryPrefix + "Parent" + entry.key.toFixed(0);
        entryDiv.ondblclick = wf.entry.editEntry;
        let vText = entry.name;        
        const entryContent = document.createTextNode(vText);
        entryDiv.appendChild(entryContent);
        let vwordcount = entry.wordcount;
        if(!vwordcount){
            vwordcount = "";
        }
        const wordcountContent = document.createTextNode(vwordcount);
        wordcountDiv.appendChild(wordcountContent);        
        wordcountDiv.classList.add("wordCountDisp");
        wordcountDiv.id = _entryPrefix + "_wordcount" + entry.key.toFixed(0);
        const currentDiv = document.getElementById(_listName());
        parentDiv.appendChild(entryDiv);        
        parentDiv.appendChild(wordcountDiv);        
        currentDiv.appendChild(parentDiv);        
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
            let vKey = parseInt(_newId.replace(_entryPrefix + "Parent",""));            
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

    function _selectFirstEntry(){
        if(_entriesList && _entriesList.length >0){            
            _selectEntry(_entriesList[0]);
        }
    }

    function _overrideListName(o){
        _overrideName = o;
    }

    function _listName(){        
        return _overrideName || _defaultName;
    }

    return {
        init: _init,
        addEntry: _addEntry,
        selectFirstEntry: _selectFirstEntry,
        overrideListName: _overrideListName
    };
})();