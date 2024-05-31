var app = app || {};

app.fontScroll = (function(){

    let _idCounter = 0;
    let _vFolderList;
    function _loadFiles(){
        document.getElementById("filepicker").addEventListener(
            "change", function(event){
                if(event && event.target && event.target.files){
                    _vFolderList = event.target.files;
                    _loadFontFiles();
                }
            },
            false,
          );
    }

    async function _loadFont(o,vText, vSize){
        if(o){
            let vName = o.name.replace(".","");            
            let vFontName = o.name;
            let vFontPath = o.webkitRelativePath;
            const data = await o.arrayBuffer();                                                
            const font = new FontFace(vName, data);            
            await font.load();
            document.fonts.add(font);            

            let output = document.getElementById("listing");            
            let item = document.createElement("div");

            item.classList.add("fontHolder");
            let divText = document.createElement("div");
            let divFontHolder = document.createElement("div");
            let divName = document.createElement("div");
            let divPath = document.createElement("div");
            
            divFontHolder.classList.add("fontDisplay");
            divText.classList.add("textDisplay");
            item.appendChild(divText);
            item.appendChild(divFontHolder);
            divFontHolder.appendChild(divName);
            divFontHolder.appendChild(divPath);
            divText.textContent = vText;
            divText.addEventListener("dblclick",_editItem)
            divName.textContent = vFontName;
            divPath.textContent = vFontPath;
            let divButtons = document.createElement("div");
            
            let buttonAdd = document.createElement("button");                        
            buttonAdd.addEventListener("click",_addShortList);
            var imageAdd = document.createElement('img');                
            imageAdd.src="images/circle-right-regular.svg";
            imageAdd.alt="Add Button";
            imageAdd.height = 20;
            imageAdd.width = 20;                                
            buttonAdd.appendChild(imageAdd);

            let buttonRemove = document.createElement("button");            
            buttonRemove.addEventListener("click",_removeItem);
            var imageRemove = document.createElement('img');                
            imageRemove.src="images/circle-left-regular.svg";
            imageRemove.alt="Remove Button";
            imageRemove.height = 20;
            imageRemove.width = 20;                                
            buttonRemove.appendChild(imageRemove);

            let buttonPlus = document.createElement("button");            
            buttonPlus.addEventListener("click",_plusFontSize);
            var imageTextPlus = document.createElement('img');                
            imageTextPlus.src="images/text-height-solid.svg";
            imageTextPlus.alt="Plus Button";
            imageTextPlus.height = 20;
            imageTextPlus.width = 20;                                
            buttonPlus.appendChild(imageTextPlus);

            var imagePlus = document.createElement('img');                
            imagePlus.src="images/circle-plus-solid.svg";
            imagePlus.alt="Plus Button";
            imagePlus.height = 20;
            imagePlus.width = 20;                                
            buttonPlus.appendChild(imagePlus);
            
            let buttonMinus = document.createElement("button");            
            buttonMinus.addEventListener("click",_minusFontSize);
            var imageTextMinus = document.createElement('img');                
            imageTextMinus.src="images/text-height-solid.svg";
            imageTextMinus.alt="Plus Button";
            imageTextMinus.height = 20;
            imageTextMinus.width = 20;                                
            buttonMinus.appendChild(imageTextMinus);

            var imageMinus = document.createElement('img');                
            imageMinus.src="images/circle-minus-solid.svg";
            imageMinus.alt="Plus Button";
            imageMinus.height = 20;
            imageMinus.width = 20;                                
            buttonMinus.appendChild(imageMinus);

            divButtons.appendChild(buttonAdd);
            divButtons.appendChild(buttonRemove);
            divButtons.appendChild(buttonPlus);
            divButtons.appendChild(buttonMinus);

            item.appendChild(divButtons);
            divText.style.fontFamily = vName;
            divText.style.fontSize = vSize + "pt";
            
            output.appendChild(item);
        }
    }

    function _addShortList(){        
        if(this){
            const vItem = this;            
            const vOrigItem = vItem.parentNode.parentNode;
            const output = document.getElementById("shortlist");
            output.appendChild(vOrigItem);
        }
    }

    function _editItem(){
        if(this){
            this.setAttribute("contenteditable", true);            
        }
    }

    function _removeItem(){
        if(this){
            const vItem = this;            
            const vOrigItem = vItem.parentNode.parentNode;
            const output = document.getElementById("listing");
            output.appendChild(vOrigItem);
        }        
    }

    function _plusFontSize(){
        if(this){
            const vItem = this;            
            const vOrigItem = vItem.parentNode.parentNode.firstChild;
            let vSize = vOrigItem.style.fontSize;
            vSize = vSize.replace("pt","");
            vSize = parseInt(vSize);
            vSize += 2;
            vOrigItem.style.fontSize = vSize.toFixed(0) + "pt";
        }

    }

    function _minusFontSize(){
        if(this){
            const vItem = this;            
            const vOrigItem = vItem.parentNode.parentNode.firstChild;
            let vSize = vOrigItem.style.fontSize;
            vSize = vSize.replace("pt","");
            vSize = parseInt(vSize);
            vSize -= 2;
            if(vSize < 2){
                vSize = 2;
            }
            vOrigItem.style.fontSize = vSize.toFixed(0) + "pt";
        }
    }

    function _loadFontFiles(){
        let vDoc = document.getElementById("listing");
        vDoc.replaceChildren();
        let vText = document.getElementById("textEntry");
        let vSize = document.getElementById("fontSize");

        if(_vFolderList && _vFolderList.length > 0){
            for (const file of _vFolderList) {
                let vFileName =file.webkitRelativePath;
                if(vFileName.toLowerCase().endsWith(".ttf") || vFileName.toLowerCase().endsWith(".otf")){                
                    _loadFont(file, vText.value, vSize.value);                    
                }
            }
        }
    }

    function _refresh(){
        _loadFontFiles();
    }

    return {
        loadFiles: _loadFiles,
        refresh: _refresh
    };
})();