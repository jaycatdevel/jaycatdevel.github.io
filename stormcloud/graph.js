var stormcloud = stormcloud || {};

stormcloud.graph = (function(){
    "use strict";

    var _page = undefined;
	var _width = 320;
	var _height = 260;
    let vWidth = 20;
    let vHeight;
    let vXMargin	
    let _ratio = 1;
    let _vHeightOffset = 52;
    let _vHeightOffsetDefault = 52;

    function _init(){
        _initCanvas();
    }

    function _initCanvas(){		
		var c = document.getElementById("mainGraph");
		var ctx = c.getContext("2d");	
        
        //_ratio  = window.devicePixelRatio || 1;

        _width = _width;
        _height = _height;
        _page = ctx;
        c.width = _width;
		c.height = _height;	        
    
	}

    function _getPage(){
		if(_page === undefined){
			_init();
		}
		return _page;
	}

    function _clear(){
		_getPage();
		_page.clearRect(0, 0, _width, _height);
		_page.fillStyle = "#FFFFFF";
		_page.fillRect(0, 0, _width, _height);
		_page.fillStyle = "#000000";
        
	}

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

	function _draw(vItems,vOptions){       
        let vDrawLabels = true;
        
        _vHeightOffset = _vHeightOffsetDefault;
        if(vOptions){
            if(vOptions.labels !== undefined){
                vDrawLabels = vOptions.labels;                        
            }
            if(vOptions.fullText === true){
                _vHeightOffset = _vHeightOffsetDefault + 30;
            }
        }        
        
		_clear();		
		
        let vMaxHeight = 0;
        for(let i =0, j = vItems.length;i<j;i++){
            if(parseFloat(vItems[i].rain) > parseFloat(vMaxHeight)){
                vMaxHeight = vItems[i].rain;
            }
        }                
        vHeight =  (_height - (_vHeightOffset + 48)) / vMaxHeight;
                 
        _width = vWidth * (vItems.length + 3);
        if(_width <320){
            _width = 320;
        }        

        document.getElementById("mainGraph").width = _width;
        _page.width = _width;
        
        _drawGrid(vMaxHeight, vHeight);
        let vGroup = "";
        let vFirstLabel = true;
		for(let i = 0, j = vItems.length;i<j;i++){                        
            let vTemp = {
                data: vItems[i],
                text: vItems[i].label,
                groupLabel: vItems[i].groupLabel,
                height: vItems[i].rain * vHeight * -1,
                width: vWidth / 2,
                x: i * vWidth + (vWidth/4),
                y: _height - (vWidth/4)};

            if(vGroup !== vTemp.groupLabel && vDrawLabels){                
                _writeLabel(vTemp,vFirstLabel);
                vGroup = vTemp.groupLabel;
                vFirstLabel = false;

            }
            if(vItems[i].rain >0){    
                _drawRectangle(vTemp);			
                _writeText(vTemp);	
            }
            		
            _writeDateLabel(vTemp);
		}
	}    

    
			

    function _drawGrid(vMax, vHeight){
        let vY =_height -_vHeightOffset;
        let vPage = _page;			
        
        vPage.textAlign = "left";
        vPage.font = "15px Georgia";		                                
        
        // Draw 0
        vPage.fillText("0", 3, vY);
        // Draw vMax        
        let vMaxHeight = _height - (vWidth/4) - (_vHeightOffset - 2) + (vMax * vHeight * -1)
        vPage.fillText(vMax, 3, vMaxHeight);

        vXMargin = vPage.measureText(vMax).width + 6;	
        
        // Draw Grid Major Lines
        vPage.strokeStyle = "#00000055";			
        vPage.beginPath();
        
        vPage.moveTo(vXMargin,vY);
        vPage.lineTo(_width - 6,vY);                
        vPage.moveTo(vXMargin,vY);
        vPage.lineTo(vXMargin,6);                
        vPage.stroke();			
        
    }

    function _drawRectangle(o){
		if(o){
			let vPage = _page;			


            const gradient = vPage.createLinearGradient(0, 0, 0, _height);
            const lineGradient = vPage.createLinearGradient(0, _height, 0, 0);

            // Add three color stops
            gradient.addColorStop(0, "#2C3D55");            
            gradient.addColorStop(0.5, "#2C3D55");            
            gradient.addColorStop(1, "white");

            lineGradient.addColorStop(0, "#2C3D55");            
            lineGradient.addColorStop(0.5, "white");            
            lineGradient.addColorStop(1, "white");

            // Set the fill style and draw a rectangle
            vPage.fillStyle = gradient;
            vPage.fillRect(o.x + vXMargin, o.y - (_vHeightOffset - 2),o.width, o.height);
            vPage.strokeStyle = lineGradient;			
			vPage.beginPath();
			vPage.rect(o.x + vXMargin, o.y - (_vHeightOffset - 2),o.width, o.height);
			vPage.stroke();	
            vPage.fillStyle = "#000000";;		
		}		
	}

    function _writeText(o){
		if(o){
			var vPage = _page;            
            vPage.textAlign = "center";
			vPage.font = "15px bebaskai";		            
            			
            var vText = vPage.fillText(o.data.rain, o.x + (vWidth / 4) + vXMargin,o.y + o.height - (_vHeightOffset +3));	            
            
		}		
	}

    function _writeLabel(o,bHideLabel){
		if(o){
			var vPage = _page;
            vPage.textAlign = "left";
			vPage.font = "15px bebaskai";		            
            			
            var vText = vPage.fillText(o.groupLabel, o.x + 5 + vXMargin,20 );	                        

            if(!bHideLabel){
                let x= 3 + vWidth;
                let vY =_height - _vHeightOffset;
                vPage.beginPath();
                vPage.setLineDash([5]);
                vPage.strokeStyle = "#00000055";		        
                vPage.moveTo(o.x + vXMargin,3);
                vPage.lineTo(o.x+ vXMargin,vY);                
                vPage.stroke();			
                vPage.setLineDash([]);
            }
		}		
	}

    function _writeDateLabel(o){
		if(o){
            var vPage = _page;
            vPage.textAlign = "left";
			vPage.font = "15px roboto";		            
            			
            
            vPage.save();				
            vPage.translate(_width,0);
            vPage.rotate(90 * (Math.PI / 180));
            
            var vText = vPage.fillText(o.text, o.y - (_vHeightOffset - 7), _width - (o.x) - vXMargin);	                        
            vPage.restore();				
		}		
	}

    return {
        init: _init,
        draw: _draw,
        clear: _clear
    };
})();
