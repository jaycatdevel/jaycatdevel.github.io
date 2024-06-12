var wf = wf || {};

wf.entry = (function(){
    "use strict";

    let _currentEntry;
    let _textModified = false;
    let _wordCountTimeout = undefined;

    let _flagSave = false;
    let _flagNew = false;

    const _entryPrefix = "Entry_"; // DUPE!!!

    async function _loadEntry(entry){
        _currentEntry = entry;
        _loadEntryText();
        await wf.notesList.init();
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
            _wordCount();
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
            _currentEntry.wordcount = _wordCount();
            await wf.entries.save(_currentEntry);
        }
    }

    function _wordCount(){
		var vText = document.getElementById("entryText").textContent.trim();
		var vLength = _getWords(vText);		
		if(_currentEntry){
            let vEntry = _entryPrefix + "_wordcount" + _currentEntry.key.toFixed(0);            
            document.getElementById(vEntry).textContent = vLength.toFixed(0);			
        }
        return vLength;
	}
	
	function _getWords(o){
		var vLength = 0;
		if(o){
			var vSplit = o.split(/[\s,]+/);			
			for(var i = 0, j = vSplit.length; i < j; i++){
				if(vSplit.length > 0){
					vLength++;
				}
			}
		}
		return vLength;
	}

    async function _keyUp(){
        _textModified = true;
        clearTimeout(_wordCountTimeout);
        _wordCountTimeout = setTimeout(_wordCount,1000);	
        if(_flagSave){
            await _saveText();
            _flagSave = false;
        }
        if(_flagNew){
            _flagNew = false;
            await _saveText();
            await wf.entriesList.addEntry();
        }
    }

    function _keyDown(e){                
        if(e && e.ctrlKey){
            switch(e.key){
                case "s": 
                    _flagSave = true;
                    return false;            
                case "Enter":
                    _flagNew = true;
                    return false;            
            }
            
        }
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

    function _clipboard(){
        const cliptext = document.getElementById("entryText");
        let vText = cliptext.innerText;
        
        navigator.clipboard.writeText(_prepareNewLines(vText));
    }

    function _prepareNewLines(vText){
        if(vText){
            while(vText.indexOf("\n\n")>=0){
                vText = vText.replace("\n\n","\\u0A");
            }

            while(vText.indexOf("\\u0A")>=0){
                vText = vText.replace("\\u0A","\n");
            }
        }
        return vText;
    }

    function _resetEntry(){
        clearTimeout(_wordCountTimeout);
        _currentEntry = null;
    }

    function _exportNote(){
        const cliptext = document.getElementById("entryText");
        let vText = cliptext.innerText;
        
        navigator.clipboard.writeText(_prepareNewLines(vText));
    }

    function _getCurrentEntry(){        
        return _currentEntry;
    }

    function _getCurrentEntryKey(){        
        if(_currentEntry && _currentEntry.key){
            return _currentEntry.key;
        }
    }

    return {
        loadEntry: _loadEntry,
        saveText: _saveText,
        keyUp: _keyUp,
        keyDown: _keyDown,
        focusText: _focusText,
        editEntry: _editEntry,
        clipboard: _clipboard,
        resetEntry: _resetEntry,
        exportNote: _exportNote,
        getCurrentEntry: _getCurrentEntry,
        getCurrentEntryKey: _getCurrentEntryKey,
        prepareNewLines: _prepareNewLines
    };
})();