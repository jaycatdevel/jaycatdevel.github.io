var wf = wf || {};

wf.note = (function(){
    "use strict";
    let _currentNote;
    let _textModified = false;


    function _loadNote(note){
        _currentNote = note;        
    }

    function _keyUp(){
        _textModified = true;
    }

    function _editNote(){
        if(this){
            _textModified = false;
            this.contentEditable = "true";
            this.focus();
            this.onblur = _saveNote;
            this.onkeyup = _keyUp;
            this.classList.remove("mouseover"); 
            this.classList.add("editable"); 
        }
    }

    async function _saveNote(){
        if(_currentNote && _textModified && this){
            let vText;
            try{
                vText = JSON.stringify(this.innerHTML);
            } catch{
                vText = this.innerHTML;
            }        

            _currentNote.name = vText;
            await wf.notes.save(_currentNote);            
        }
    }    

    return {
        editNote: _editNote,
        loadNote: _loadNote
    };
})();