var wf = wf || {};

wf.db = (function(){
    "use strict";
    let db;
    let _dbVersion = 1;

    let _vStores = [{store: "projects", v: 1},
                    {store: "notes", v: 1, indices: wf.entries.createIndices},
                    {store: "entries", v: 1, indices: wf.notes.createIndices},
                    {store: "settings", v: 1},
                    {store: "codes", v: 1},
                    {store: "authors", v: 1}]
                    ;

    
    async function _open(){
        return new Promise(function(resolve,reject){
            const request = window.indexedDB.open("WritingFactory", _dbVersion);
            request.onerror = (event) => {
                alert("There was an error opening the database");
                console.log(event);
                return reject(false);
            };
            request.onsuccess = (event) => {                
                db = event.target.result;
                db.onerror = (event) => {
                    // Generic error handler for all errors targeted at this database's
                    // requests!
                    console.error(`Database error: ${event.target.errorCode}`);
                };
                db.onversionchange = (event) => {
                    alert("The version of this app has changed. Please reload the browser");              
                };  
                return resolve(true);
            };
            // This event is only implemented in recent browsers
            request.onupgradeneeded = async (event) => {            
                if(event){
                    // Save the IDBDatabase interface
                    db = event.target.result;
                    return _upgradeDB(event.oldVersion);                        
                }
                return false;
            };  

                      
        });        
    }

    function _upgradeDB(oldVersion){
        if(db){
            // Create an objectStore for this database
            for(let key in _vStores){
                if(_vStores[key].v > oldVersion){
                    _createStore(_vStores[key].store,_vStores[key].indices);                    
                }
            }            
        }        
        return true;
    }

    function _createStore(storeName, indices){
        if(db){
            const objStore = db.createObjectStore(storeName, {keyPath: "key", autoIncrement: true });
            objStore.createIndex("key", "key", { unique: true });
            if(indices){
                indices(objStore);
            }
        }
    }

    async function _add(osName, data){
        return new Promise(function(resolve,reject){
            const transaction = db.transaction([osName], "readwrite");
            // Do something when all the data is added to the database.
            transaction.oncomplete = (event) => {
                // All done                     
                return resolve(true);        
            };
      
            transaction.onerror = (event) => {
                // Don't forget to handle errors!
                return reject(false);
            };
      
            const objectStore = transaction.objectStore(osName);
            data.forEach(function (key) {
                const request = objectStore.add(key);
                request.onsuccess = (event) => {                    
                // event.target.result === customer.ssn;
                };
            });
        });
        
    }

    function _delete(osName,dataKey){
        const transaction = db.transaction([osName], "readwrite");
        const objectStore = transaction.objectStore(osName);
        const request = objectStore.delete(dataKey);  
        request.onsuccess = (event) => {
            // It's gone!
        };
    }

    let _vFailCount = 0;
    async function _initDataTable(tableName,callBack){
        let vData;        
        if(_vFailCount < 2){
            vData = await _getAll(tableName);
            if(!vData || vData.length === 0){
                _vFailCount++;                
                return await callBack();
            } else{
                _vFailCount = 0;                
                return vData[0];
            }
        } else{
            alert("There was an error opening the data. Cannot continue");
        }
    }

    async function _getAll(osName, index, keyRange){        
        return new Promise(function(resolve,reject){
            const transaction = db.transaction([osName]);
            const objectStore = transaction.objectStore(osName);

            let objIndex;

            if(index){
                objIndex = objectStore.index(index);                
            }             

            let request;
            let keyRangeValue;
            let prev = undefined;
            if(keyRange){
                if(keyRange.only){
                    keyRangeValue = IDBKeyRange.only(keyRange.only)
                }          
                if(keyRange.prev){
                    prev = "prev";
                }                                              
            }

            if(objIndex){                
                request = objIndex.openCursor(keyRangeValue,prev);               
            } else{
                request = objectStore.openCursor();   
            }
             
            let vResult = [];
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if(cursor){                    
                    let _keys = {key: cursor.key, primaryKey: cursor.primaryKey};                    
                    let _vResult = cursor.value;
                    _vResult.keys = _keys;
                    vResult.push(_vResult);
                    cursor.continue();
                }
                else{
                    return resolve(vResult);                
                }                
            };
            request.onerror = (event) => {
                return reject(false);
            };

        });        
    }

    async function _save(osName,data){
        return new Promise(function(resolve,reject){
            const transaction = db.transaction([osName], "readwrite");
            // Do something when all the data is added to the database.
            transaction.oncomplete = (event) => {
                // All done                     
                return resolve(true);        
            };
      
            transaction.onerror = (event) => {
                // Don't forget to handle errors!
                return reject(false);
            };
      
            const objectStore = transaction.objectStore(osName);
            data.forEach(function (key) {
                const request = objectStore.put(key);
                request.onsuccess = (event) => {                    
                // event.target.result === customer.ssn;
                };
            });
        });
    }

    async function _getSingleItem(tableName,keyID){
        let _currentSet = await wf.db.getAll(tableName,"key",{only: keyID});                
        return _currentSet[0];
    }

    async function _getLastItem(tableName){        
        let _currentSet = await wf.db.getAll(tableName,"key",{prev: true});
        return _currentSet[0];
    }

    return {
        open: _open,
        add: _add,
        delete: _delete,
        initDataTable: _initDataTable,
        getAll: _getAll,
        save: _save,
        getSingleItem: _getSingleItem,
        getLastItem: _getLastItem
    };
})();