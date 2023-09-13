var stormcloud = stormcloud || {};

stormcloud.app = (function(){
    "use strict";
    
    let vSelected = undefined;
    let file = undefined;
    let vGraphType = undefined;

    async function _init(){
        document.getElementById('file').addEventListener('change', _readFile, false);        
        _initInputs();        
        await stormcloud.db.init();        
        _filterRain();
        stormcloud.graph.init();
    }

    function _initInputs(){
        document.getElementById("iDate").valueAsDate = new Date();
        document.getElementById("iRain").value="";
    }

    async function _addRain(bAddOnly, AddedRain){
        let vDate = stormcloud.dates.getDate(document.getElementsByName("iDate")[0]);
        let vRain = document.getElementsByName("iRain")[0].value;        
        if(vRain === "" || parseFloat(vRain)<=0 || vDate.date === ""){
            stormcloud.messages.open({
                title: "No Rain Added",
                message: "Please add a valid rain entry"                
            });            
        }
        else{
            if(AddedRain){
                vDate = stormcloud.dates.getDate(AddedRain.date);
                vRain = AddedRain.rain;            
            }

            let vRainObj ={
                date: vDate.date,
                year: vDate.year,
                month: vDate.month,
                day: vDate.day,
                rain: vRain
            };

            await stormcloud.db.addRain(vRainObj);
            if(!bAddOnly){
                _filterRain();
                _initInputs();
            }
        }
    }
    
    async function _editRain(i){        
        let vRainItem = await stormcloud.db.getRainID(i);        
        if(vRainItem && vRainItem.length > 0){
            document.getElementsByName("iDate")[0].value = vRainItem[0].date;
            document.getElementsByName("iRain")[0].value = vRainItem[0].rain;
        }
    }

    async function _deleteRain(e){
        if(this && this.dataset && this.dataset.id){            
            let vId = this.dataset.id;
            async function _deleteCallback(){                
                await _editRain(vId);
                await stormcloud.db.deleteRain(vId);            
                _filterRain();
            }

            stormcloud.messages.open({
                title: "Delete Rain",
                message: "Are you sure you want to delete this entry?",
                success: _deleteCallback
            });            
        }
    }

    function _selectRain(e){
        let vSelectedId = undefined;
        if(vSelected){            
            vSelectedId = vSelected.id;
            vSelected.removeChild(vSelected.lastElementChild);
            vSelected.lastChild.setAttribute("class","buttonPadding");
            vSelected = undefined;            
        }
        if(this && this.id && this.id !== vSelectedId){                        
            const parentDiv = document.getElementById(this.id);
            parentDiv.lastChild.setAttribute("class","hidden");
            if(parentDiv){
                var button = document.createElement('button');
                var image = document.createElement('img');                
                image.src="images/trash-can.svg";
                image.alt="Delete Button";
                image.height = 20;
                image.width = 20;
                //image.alt
                button.setAttribute('type', 'button');                                
                button.setAttribute('class', "buttonIconOnly");                                                            

                button.dataset.id = this.dataset.id;
                button.onclick = _deleteRain;
                button.appendChild(image);
                parentDiv.appendChild(button);        
                vSelected = parentDiv;
            }
        }
    }

    function _buildMonthLine(vItem){
        if(vItem){
            const parentDiv = document.createElement("div");            
            const monthDiv = document.createElement("div");            
            const monthContent = document.createTextNode(stormcloud.dates.getMonthText(vItem.date));                                          
            
            monthDiv.appendChild(monthContent);
            monthDiv.setAttribute('class', "monthLine");                                                            
            parentDiv.appendChild(monthDiv);            

            // add the newly created element and its content into the DOM
            const currentDiv = document.getElementById("rainList");
            currentDiv.appendChild(parentDiv);
        }
    }

    function _buildRain(vItem){
        if(vItem){
            const parentDiv = document.createElement("div");            
            const dateDiv = document.createElement("div");            
            parentDiv.id = "Rain" + vItem.id.toFixed(0);
            const dateContent = document.createTextNode(vItem.date);                      
            parentDiv.dataset.id = vItem.id;
            parentDiv.onclick = _selectRain;
            const rainDiv = document.createElement("div");            
            const rainContent = document.createTextNode(vItem.rain);                      
            rainDiv.appendChild(rainContent);            
            dateDiv.appendChild(dateContent);
            dateDiv.setAttribute('class', "date");                                                            



            const padLeft = document.createElement("div");            
            const padRight = document.createElement("div");            
            const padContentLeft = document.createTextNode("\u00A0");                      
            const padContentRight = document.createTextNode("\u00A0");                      
            padLeft.setAttribute('class', "buttonPadding");                                                            
            padRight.setAttribute('class', "buttonPadding");                                                            
            padLeft.appendChild(padContentLeft);
            padRight.appendChild(padContentRight);


            parentDiv.appendChild(padLeft);
            parentDiv.appendChild(dateDiv);
            parentDiv.appendChild(rainDiv);
            parentDiv.appendChild(padRight);
          

            let vRain = parseFloat(vItem.rain);
            if(vRain < 20){
                rainDiv.setAttribute('class', "rain rainLow");                                                            
            } else if(vRain < 40){
                rainDiv.setAttribute('class', "rain rainMedium");                                                            
            } else{
                rainDiv.setAttribute('class', "rain rainHigh");                                                            
            }
            // add the newly created element and its content into the DOM
            const currentDiv = document.getElementById("rainList");
            currentDiv.appendChild(parentDiv);
        }
    }

    function _clearRain(){
        _initInputs();
    }

    async function _exportRain(){
        let vRainList = await stormcloud.db.filterRain();
        let vFinal = "";
        vFinal = "Date,Rain\n";
        for(let i =0, j = vRainList.length; i < j; i++){            
            vFinal += vRainList[i].date.toString() + "," + vRainList[i].rain.toString() + "\n";
        }

        var blob = new Blob([vFinal], {type: "text/plain"});
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "Stormcloud.csv";
        a.click();
    }

    function _readFile(evt){
        if(evt && evt.target && evt.target.files && evt.target.files.length > 0)
        var files = evt.target.files;
        file = files[0];
    }
    
    function _importRain(){
        if(file){
            var reader = new FileReader();
            reader.onload = function(event) {
                _addBulkRain(event.target.result);                
                let vFile = document.getElementById('file');
                vFile.value = null;
            }
            reader.readAsText(file);
        }
    }

    async function _addBulkRain(bulkRain){
        if(bulkRain){
            let vArray = bulkRain.split(/\r?\n/);
            if(vArray && vArray.length >0){
                let vFinal = [];
                for(let i = 0, j = vArray.length; i<j; i++){
                    let vTemp =vArray[i];
                    if(vTemp.toLowerCase() !== "date,rain"){
                        let vSplit = vTemp.split(",");
                        if(vSplit.length > 1){                            
                            let vDate = stormcloud.dates.getDate(vSplit[0]);
                            let vRain = vSplit[1];                                        
                    
                            let vRainObj ={
                                date: vDate.date,
                                year: vDate.year,
                                month: vDate.month,
                                day: vDate.day,
                                rain: vRain
                            };    
                            vFinal.push(vRainObj);                                       
                        }
                    }
                }
                await stormcloud.db.addRain(vFinal);                            
            }            
            await _filterRain();
            _initInputs();
        }
    }

    function _changeDateRange(e){
        let vRange = stormcloud.dates.getDateRange(document.getElementById("dateRange").value);        
        if(vRange){
            document.getElementById("fromDate").value = vRange.from.date;
            document.getElementById("toDate").value = vRange.to.date;         
        }        
    }

    async function _filterRain(){
        let vFromDate = stormcloud.dates.getDate(document.getElementById("fromDate"));
        let vToDate = stormcloud.dates.getDate(document.getElementById("toDate"));                
        
        if (vFromDate.date ==="" && vToDate.date ===""){
            vFromDate = stormcloud.dates.getMinDate();
            vToDate = stormcloud.dates.getMaxDate();
        } else{            
            let testTo = new Date(document.getElementById("toDate").valueAsNumber);
            let testFrom = new Date(document.getElementById("fromDate").valueAsNumber);
            if(testTo < testFrom) {
                document.getElementById("fromDate").valueAsNumber = testTo;
                document.getElementById("toDate").valueAsNumber = testFrom;
                return _filterRain(); // Start again
            }
        }        

        if(vFromDate.date !=="" && vToDate.date !==""){            
            let vRainList = await stormcloud.db.filterRain(vFromDate.date,vToDate.date);                    
            document.getElementById("rainList").innerHTML = "";        
            if(vRainList && vRainList.length > 0){
                let vCurrentMonth = undefined;
                for(let i = vRainList.length-1, j = 0; i>=j;i--){
                    let vTemp = vRainList[i]; 
                    let vMonthCode = vTemp.month+vTemp.year;
                    if(vCurrentMonth != vMonthCode){
                        _buildMonthLine(vTemp);
                        vCurrentMonth = vMonthCode;
                    }                    
                    _buildRain(vTemp);
                }                            
            }        
            stormcloud.reports.runReport(vFromDate.date,vToDate.date,vGraphType);                
        }
    }

    async function _deleteDatabase(){
        async function _deleteCallback(){
            await stormcloud.db.deleteDatabase();
            await stormcloud.db.init();        
            _filterRain();
        }

        stormcloud.messages.open({
            title: "Delete All Data",
            message: "Are you sure you want to delete all data from the app?",
            success: _deleteCallback
        });
        
    }

    function _changeSortMode(){
        let vSort = document.getElementById("sortMode").value;                        
        if(vSort.toLowerCase().indexOf("date")>=0){            
            stormcloud.db.setDataDirection(vSort);        
        }        
        else if(vSort.toLowerCase().indexOf("rain")>=0){            
            stormcloud.db.setRainDirection(vSort);            
        }        
        _filterRain();                
    }

    function _changeGraphType(){
        vGraphType = document.getElementById("graphType").value;                        
        _filterRain();
    }

    function _openTools(){
        let vTools = document.getElementById("modalTools");
        vTools.setAttribute("class","modalOverlay");
    }

    function _closeTools(){
        let vTools = document.getElementById("modalTools");
        vTools.setAttribute("class","modalOverlay none");
    }

    return {
        init: _init,
        addRain: _addRain,
        clearRain: _clearRain,
        exportRain: _exportRain,
        importRain: _importRain,
        changeDateRange: _changeDateRange,
        filterRain: _filterRain,
        deleteDatabase: _deleteDatabase,
        changeSortMode: _changeSortMode,
        changeGraphType: _changeGraphType,
        openTools: _openTools,
        closeTools: _closeTools
    };
})();

window.onload = stormcloud.app.init;
