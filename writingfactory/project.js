var wf = wf || {};

wf.project = (function(){
    "use strict";

    let _currentProject;
    let _textModified = false;

    async function _loadProject(project){
        _currentProject = project;        
        await wf.notesList.init();
        await wf.entriesList.selectFirstEntry();
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

    function _exportProject(){

    }

    return {
        loadProject: _loadProject,
        projectEdit: _projectEdit,
        exportProject: _exportProject
    }
})();