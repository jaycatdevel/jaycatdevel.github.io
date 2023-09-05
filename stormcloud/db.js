var stormcloud = stormcloud || {};

stormcloud.db = (function(){
    "use strict";

    const dbName = "stormCloudDB";
    const dbVer = 1;
    let db;
    let bDirec = undefined;
    let bRainDirec = undefined;

    async function _init(){
        return new Promise(function(resolve,reject){
            // Let us open our database
            
            const request = window.indexedDB.open(dbName, dbVer);
            request.onerror = async function(event) {
                let vError = "This app needs access to IndexedDB. Please turn it on.";
                alert(vError);
                return reject(vError)
            };
            request.onsuccess = async function(event) {                            
                db = event.target.result;            
                return resolve(true);
            };
            // This event is only implemented in recent browsers
            request.onupgradeneeded = async function(event) {                
                db = event.target.result;
                const objectStore = db.createObjectStore("rainList", { keyPath: "id", autoIncrement:true });
                objectStore.createIndex("date", "date", { unique: false });            
                objectStore.createIndex("year", "year", { unique: false });            
                objectStore.createIndex("month", "month", { unique: false });            
                objectStore.oncomplete = async function(){
                    return resolve (true);                
                };
            };
        });
        
    }

    async function _addRain(vItem){        
        return new Promise(function(resolve,reject){
            let objectStore = db.transaction(['rainList'],'readwrite').objectStore('rainList');
        
            objectStore.transaction.oncomplete = async function(event) {
                // Store values in the newly created objectStore.                
                const rainStore = db.transaction(["rainList"], "readwrite").objectStore("rainList");                
                
                if(vItem){                    
                    let vArray = vItem;
                    if(!Array.isArray(vArray)){
                        vArray = [vArray];
                    }
                    for(let i =0, j = vArray.length; i<j;i++){                        
                        rainStore.add(vArray[i]);                                                                
                }   
                }
                return resolve(true);
            };
            objectStore.transaction.onerror = async function(e){
                return reject(e);
            };
        });
        
    }
    
    async function _getRainID(vID){
        return new Promise(function(resolve,reject){
            if(vID){
                if(typeof vID === "string"){
                    vID = parseInt(vID);
                }                
                const objectStore = db.transaction(["rainList"], "readonly").objectStore("rainList");    
                
                const getRequest = objectStore.get(vID);
                getRequest.onsuccess = async function() {
                    return resolve([getRequest.result]);                    
                };                
            } else{
                return reject(false);
            }
        });        
    }

    async function _deleteRain(vID){
        return new Promise(function(resolve,reject){
            if(vID){                
                if(typeof vID === "string"){
                    vID = parseInt(vID);
                }
                let transaction = db.transaction(['rainList'],'readwrite')
                let objectStore = transaction.objectStore('rainList');
                objectStore.delete(vID);

                transaction.oncomplete = async function() {                    
                    return resolve(true);
                    
                };
                transaction.onerror = async function(e){                          
                    return reject(false);
                }

            } else{
                return reject(false);
            }
        });
    }

    async function _filterRain(from,to, bOptions){
        let vArray = await _filterRainInternal(from,to,bOptions);

        let vRainDirec = bRainDirec;
        if(bOptions && bOptions.rainDirec !== undefined){
            vRainDirec = bOptions.rainDirec;
        }
        if(bRainDirec){
            vArray.sort(_sortRain)
        }
        return vArray;
    }

    function _sortRain(a,b){
        let i = 0;
        if(parseFloat(a.rain) < parseFloat(b.rain)){
            i = -1;
        } else if (parseFloat(a.rain) > parseFloat(b.rain)){
            i = 1;
        }
        if(bRainDirec === "rain asc"){
            i*= -1;
        }
        return i;
    }

    async function _filterRainInternal(from,to,bOptions){
        return new Promise(function(resolve,reject){            
            let vList = [];
            let keyRangeValue = null;
            let bDirec = _getDataDirection();
            if(bOptions && bOptions.dateSort !== undefined){ // for reports
                bDirec = undefined;
            }
            if(from && to){                
                keyRangeValue = IDBKeyRange.bound(from, to);
            }
            let transaction = db.transaction(['rainList'],'readonly')
            let objectStore = transaction.objectStore('rainList');
            const myIndex = objectStore.index("date");
            
            const myCursor = myIndex.openCursor(keyRangeValue, bDirec);
            myCursor.onsuccess = async function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    vList.push(cursor.value);
                    cursor.continue();
                } else {
                    return resolve(vList);
                }
            };

            myCursor.onerror = async function(event) {                    
                return reject(false);
            };
        });          
    }

    async function _deleteDatabase(){
        return new Promise(function(resolve,reject){            
            db.close();
            let DBDeleteRequest = window.indexedDB.deleteDatabase(dbName);

            DBDeleteRequest.onerror = async function(e) {                
                return reject(false);
            };
            
            DBDeleteRequest.onsuccess = async function(e) {                                
                return resolve(true);
            };
        });
    }

    function _getDataDirection(){
        return bDirec;
    }

    function _setDataDirection(vDirec){
        bDirec = undefined;
        if(vDirec.toLowerCase() === "date asc"){
            bDirec = "prev";
        }        
        bRainDirec = undefined;
    }

    function _setRainDirection(vDirec){
        bRainDirec = vDirec.toLowerCase();        
    }

    return{
        init: _init,
        addRain: _addRain,
        getRainID: _getRainID,
        deleteRain: _deleteRain,
        filterRain: _filterRain,
        deleteDatabase: _deleteDatabase,
        setDataDirection: _setDataDirection,
        setRainDirection: _setRainDirection
    };
})();