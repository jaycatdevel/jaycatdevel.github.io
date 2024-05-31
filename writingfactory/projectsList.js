var wf = wf || {};

wf.projectsList = (function(){
    "use strict";  

    let _projectsList;
    let _currentProject;
    const _listName = "projectsList";
    const _projectPrefix = "Project_";    

    async function _init(){
        await _loadProjects();
        await _drawProjects();  
    }

    async function _loadProjects(){
        _projectsList = await wf.projects.getAllProjects();        
    }

    async function _drawProjects(){
        wf.lists.draw(_projectsList,_listName,_drawProject);
        _currentProject = undefined;
        _selectProject(wf.projects.getCurrentProject());
    }

    function _drawProject(project){        
        const newDiv = document.createElement("div");
        newDiv.classList.add("project_tab");
        newDiv.id = _projectPrefix + project.key.toFixed(0);
        newDiv.onclick = _projectClick;
        newDiv.ondblclick = wf.project.projectEdit;
        let vText = project.name;
        
        const newContent = document.createTextNode(vText);
        newDiv.appendChild(newContent);

        const currentDiv = document.getElementById(_listName);
        currentDiv.appendChild(newDiv);        
    }

    async function _addProject(){
        await wf.projects.addProject("Untitled Project");                
        await wf.projects.getLastProject();
        await _loadProjects();
        _drawProjects();
    }

    function _selectProject(project){                
        if(project){
            _highlightProject(project);
            wf.project.loadProject(project);            
        }                
    }

    function _highlightProject(project){      
        if(project){  
            if(_currentProject){
                _currentProject.classList.remove("highlight");
            }                    
            const currentDiv = document.getElementById(_projectPrefix + project.key.toFixed(0));
            if(currentDiv){
                currentDiv.classList.add("highlight");
            }
            _currentProject = currentDiv;            
            wf.entriesList.init();
            wf.notesList.init();
        }
    }

    async function _projectClick(){
        if(this && this.id){
            let _newId = this.id;
            let vKey = parseInt(_newId.replace(_projectPrefix,""));            
            _selectProject(await wf.projects.getSingleProject(vKey));            
        }        
    }

    return {
        init: _init,
        addProject: _addProject
    };
})();