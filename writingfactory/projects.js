var wf = wf || {};

wf.projects = (function(){
    "use strict";

    let _tableName = "projects";    
    let _currentProject;

    async function _init(){        
        return _currentProject = await wf.db.initDataTable(_tableName,_addProject.curry("Untitled Project"));                        
    }    

    async function _addProject(projectName){        
        let tempProject = {name: projectName, author: wf.authors.getCurrentAuthorKey()};
        await wf.db.add(_tableName,[tempProject]);
        return await _init();
    }

    function _getCurrentProjectKey(){        
        if(_currentProject && _currentProject.key){
            return _currentProject.key;
        }
    }

    async function _getAllProjects(){
        return await wf.db.getAll(_tableName,"key");
    }

    async function _getLastProject(){
        _currentProject = await wf.db.getLastItem(_tableName);
        return _currentProject;
    }

    function _getCurrentProject(){
        return _currentProject;
    }

    async function _getSingleProject(projectID){
        _currentProject = await wf.db.getSingleItem(_tableName,projectID);                
        return _currentProject;
    }

    async function _save(project){
        if(project){
            await wf.db.save(_tableName,[project]);
        }
    }

    return {
        init: _init,
        getCurrentProjectKey: _getCurrentProjectKey,
        getAllProjects: _getAllProjects,
        getLastProject: _getLastProject,
        addProject: _addProject,
        getCurrentProject: _getCurrentProject,
        getSingleProject: _getSingleProject,
        save: _save
    };
})();