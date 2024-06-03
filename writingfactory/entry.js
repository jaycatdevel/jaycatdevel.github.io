var wf = wf || {};

wf.entry = (function(){
    "use strict";

    let _currentEntry;
    let _textModified = false;
    let _wordCountTimeout = undefined;

    const _entryPrefix = "Entry_"; // DUPE!!!

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
		document.getElementById("wordCount").textContent = vLength.toFixed(0);			
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

    function _keyUp(){
        _textModified = true;
        clearTimeout(_wordCountTimeout);
        _wordCountTimeout = setTimeout(_wordCount,1000);	
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