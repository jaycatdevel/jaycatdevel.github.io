var wf = wf || {};

wf.entry = (function(){
    "use strict";

    let _currentEntry;
    let _textModified = false;
    function _loadEntry(entry){
        _currentEntry = entry;
        _loadEntryText();
        wf.notesList.init();
    }

    function _loadEntryText(){
        if(_currentEntry){
            let div = document.getElementById("entryText");
            let textContent = _currentEntry.text;
            if(!textContent){
                textContent = "";
            }             
            try{
                div.innerHTML = JSON.parse(textContent);
            } catch{
                div.innerHTML = textContent;
            }
            _textModified = false;
        }
    }

    async function _saveText(){
        if(_currentEntry && _textModified){
            let div = document.getElementById("entryText");
            let vText;
            try{
                vText = JSON.stringify(div.innerHTML);
            } catch{
                vText = div.innerHTML;
            }            
            _currentEntry.text = vText;
            await wf.entries.save(_currentEntry);
        }
    }

    function _keyUp(){
        _textModified = true;
    }

    function _focusText(){
        let element = document.getElementById("entryText");
        let eventType = "onfocusin" in element ? "focusin" : "focus";
        let bubbles = "onfocusin" in element;
        let event;

        if ("createEvent" in document) {
            event = document.createEvent("Event");
            event.initEvent(eventType, bubbles, true);
        }
        else if ("Event" in window) {
            event = new Event(eventType, { bubbles: bubbles, cancelable: true });
        }

        element.focus();
        element.dispatchEvent(event);
    }

    function _editEntry(){
        if(this){
            _textModified = false;
            this.contentEditable = "true";
            this.focus();
            this.onblur = _saveEntry;
            this.onkeyup = _keyUp;
        }
    }

    async function _saveEntry(){
        if(_currentEntry && _textModified && this){
            _currentEntry.name = this.textContent;
            await wf.entries.save(_currentEntry);            
        }
    }

    return {
        loadEntry: _loadEntry,
        saveText: _saveText,
        keyUp: _keyUp,
        focusText: _focusText,
        editEntry: _editEntry
    };
})();