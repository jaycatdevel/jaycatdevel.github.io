var wf = wf || {};

wf.project = (function(){
    "use strict";

    let _currentProject;
    let _textModified = false;
    const _projectPrefix = "Project_";    

    async function _loadProject(project){        
        _currentProject = project;     
        await wf.entriesList.init();           
        await wf.entriesList.selectFirstEntry();        
    }

    function _projectEdit(){
        if(this){
            _textModified = false;
            this.contentEditable = "true";
            this.focus();
            this.onblur = _saveProject;
            this.onkeyup = _keyup;
            this.classList.remove("mouseover");
            this.classList.add("editable");
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

    async function _exportProject(){
        if(_currentProject){
            let vFileName = _currentProject.name + ".md";
            let _entriesList = await wf.entries.getAllProjectEntries(wf.projects.getCurrentProjectKey());        
            let vFinal = [];

            let tempDiv = document.createElement("div");
            document.body.appendChild(tempDiv);
            for(let i in _entriesList){
                let entry = _entriesList[i];
                let vTextContent = entry.text;            
                if(!vTextContent){
                    vTextContent = "";
                }             
                try{
                    vTextContent = JSON.parse(vTextContent);
                } catch{                
                }
                
                tempDiv.innerHTML = vTextContent;
                let vText = tempDiv.innerText;            
                if(vText && vText.length > 0){
                    vFinal.push(wf.entry.prepareNewLines(vText));
                }
            }   
            tempDiv.remove();             
            let vFinalString = vFinal.join("\n\n");        
            navigator.clipboard.writeText(vFinalString);
            wf.entry.download(vFileName,vFinalString);      
        }

    }

    async function _projectOverview(bMode){
        let textEntry = document.getElementById("textEntry");
        let projectOverview = document.getElementById("projectOverview");
        if(bMode){            
            textEntry.classList.add("detailsHide");                        
            projectOverview.classList.remove("detailsHide");
            wf.entriesList.overrideListName("projectEntriesList");   
            await wf.entriesList.init();     
        } else{
            textEntry.classList.remove("detailsHide");                        
            projectOverview.classList.add("detailsHide");
            wf.entriesList.overrideListName();   
        }
    }

    async function _wordCount(){
        let vEntries = wf.entriesList.getAllCurrentEntries();
        let vWordCount = 0;
        if(vEntries && vEntries.length > 0 && _currentProject){            
            for(let i = 0, j = vEntries.length; i <j;i++){
                if(vEntries[i].wordcount){
                    vWordCount += vEntries[i].wordcount;                    
                }
            }
            _currentProject.wordcount = vWordCount;            
            let vWordSpan = document.getElementById(_projectPrefix + "_wordcount_" + _currentProject.key.toFixed(0));            
            if(vWordSpan){
                vWordSpan.textContent = vWordCount;
            }            
            await wf.projects.save(_currentProject);            
        }
    }

    return {
        loadProject: _loadProject,
        projectEdit: _projectEdit,
        exportProject: _exportProject,
        projectOverview: _projectOverview,
        wordCount: _wordCount
    }
})();