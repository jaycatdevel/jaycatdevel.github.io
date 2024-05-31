var wf = wf || {};

wf.project = (function(){
    "use strict";

    let _currentProject;
    let _textModified = false;

    function _loadProject(project){
        _currentProject = project;        
        wf.notesList.init();
    }

    function _projectEdit(){
        if(this){
            _textModified = false;
            this.contentEditable = "true";
            this.focus();
            this.onblur = _saveProject;
            this.onkeyup = _keyup;
        }
    }

    async function _saveProject(){
        if(_currentProject && _textModified && this){
            _currentProject.name = this.textContent;
            await wf.projects.save(_currentProject);            
        }
    }

    function _keyup() {
        _textModified = true;
    }

    return {
        loadProject: _loadProject,
        projectEdit: _projectEdit
    }
})();