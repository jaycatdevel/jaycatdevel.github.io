var stormcloud = stormcloud || {};

stormcloud.reports = (function(){
    "use strict";

    async function _runReport(from,to, pMode){     
        if(!pMode){
            pMode = "";
        }
        switch(pMode.toLowerCase()){
            case "yearly":
                return _generateDateRangeReport(from,to,pMode);
                break;
            case "monthly":
                return _generateDateRangeReport(from,to,pMode);
                break;
            case "seasonal":
                return _generateDateRangeReport(from,to,pMode);
                break;
            case "seasonal compare":
                return _generateComparisonReport(from,to,pMode);                
                break;
            case "monthly compare":
                return _generateComparisonReport(from,to,pMode);                
                break;
            default:
                return _generateDateRangeReport(from,to,pMode);
                break;
        }           
        
    }

    async function _generateDateRangeReport(from,to,pMode){
        let vRainList = await stormcloud.db.filterRain(from,to,{rainDirec: false});                        
        let vFullLabels = stormcloud.db.getRainDirection() !== undefined;        
        let vItems;
        if(vRainList && vRainList.length > 0){
            let vFirst = vRainList[0].date;
            let vlast = vRainList[vRainList.length - 1].date;
            if(!pMode){
                pMode = "";
            }
            switch(pMode.toLowerCase()){
                case "yearly":
                    vItems = stormcloud.dates.getEmptyYears(vFirst,vlast);            
                    break;
                case "monthly":
                    vItems = stormcloud.dates.getEmptyMonths(vFirst,vlast);            
                    break;
                case "seasonal":
                    vItems = stormcloud.dates.getEmptySeasons(vFirst,vlast);            
                    break;
                default:
                    vItems = stormcloud.dates.getEmptyDates(vFirst,vlast);            
                    break;
            }  
            
            function _testDate(from,to){
                switch(pMode.toLowerCase()){
                    case "yearly":
                        return from.year === to;                        
                    case "monthly":
                        return from.month === to;                        
                    case "seasonal":
                        return stormcloud.dates.getSeasonText(from.date) === to;
                    default:
                        return from.date === to;                        
                }                
            }

            if(vItems && vRainList && vItems.length > 0){
                let vRainIndex = 0;
                let vRainLength = vRainList.length;
                let vBreak = false;
                for(let i =0, j = vItems.length; i<j;i++){
                    let vTempRain = 0;
                    let vTempDate;
                    switch(pMode.toLowerCase()){
                        case "yearly":
                            vTempDate = vItems[i].year;  
                            break;
                        case "monthly":
                            vTempDate = vItems[i].month;  
                            break;
                        case "seasonal":
                            vTempDate = stormcloud.dates.getSeasonText(vItems[i].date);                            
                            break;
                        default:
                            vTempDate = vItems[i].date;                    
                            break;
                    }                    
                    
                    while(vRainIndex < vRainList.length && _testDate(vRainList[vRainIndex],vTempDate)){
                        vTempRain += parseFloat(vRainList[vRainIndex].rain);
                        vRainIndex++;
                        if(vRainIndex.length >= (vRainLength -1)){
                            vBreak = true;
                            break;
                        }                        
                    }
                    vItems[i].rain = vTempRain;                     
                    switch(pMode.toLowerCase()){
                        case "yearly":
                            vItems[i].label= vItems[i].year;
                            vItems[i].groupLabel= "";
                            break;
                        case "monthly":
                            vItems[i].label= stormcloud.dates.getMonthText(vItems[i].date).substring(0,3);
                            if(vFullLabels){
                                vItems[i].label += " " + vItems[i].year;
                            }
                            vItems[i].groupLabel= vItems[i].year;;
                            break;
                        case "seasonal":
                            vItems[i].label= stormcloud.dates.getSeasonText(vItems[i].date).substring(0,3);
                            if(vFullLabels){
                                vItems[i].label += " " + vItems[i].year;
                            }
                            vItems[i].groupLabel= vItems[i].year;;
                            break;
                        default:
                            vItems[i].label= stormcloud.dates.getShortText(vItems[i].date);
                            if(vFullLabels){
                                vItems[i].label += "/" + vItems[i].year;
                            }
                            vItems[i].groupLabel= stormcloud.dates.getMonthText(vItems[i].date);
                            break;
                    }     
                    

                    if(vBreak){                        
                        break;
                    }
                }                  
                                
                let vOptions = {};
                if(stormcloud.db.getRainDirection()){
                    vItems.sort(stormcloud.db.sortRain);                    
                    vItems = vItems.filter((o) => { return o.rain !== 0;});
                    vOptions.labels = false;
                    vOptions.fullText = true;
                }
                vItems.reverse(); //Graph runs in reverse mode to the list.
                stormcloud.graph.draw(vItems,vOptions);            
            }
        } else{            
            stormcloud.graph.clear();
        }   
    }

    async function _generateComparisonReport(from,to,pMode){
        let vRainList = await stormcloud.db.filterRain(from,to,{rainDirec: false});        
        let vFullLabels = stormcloud.db.getRainDirection() !== undefined;        
        let vItems;
        if(vRainList && vRainList.length > 0){
            let vFirst = vRainList[0].date;
            let vlast = vRainList[vRainList.length - 1].date;

            if(!pMode){
                pMode = "";
            }
            let vYears = stormcloud.dates.getEmptyYears(vFirst,vlast);            

            vItems = [];
            for(let i = 0, j = vYears.length; i <j;i++){                
                switch(pMode.toLowerCase()){
                    case "seasonal compare":                        
                        vItems = stormcloud.dates.getEmptySeasons(vFirst,vlast);                                    
                        break;                
                    case "monthly compare":                        
                        vItems = stormcloud.dates.getEmptyMonths(vFirst,vlast);            
                        break;                
                }           
            } 
            
            function sortSeasons( a, b ) {
                if ( a.season < b.season){
                  return -1;
                }
                if ( a.season > b.season){
                  return 1;
                }
                return 0;
            }

            function sortMonths( a, b ) {
                if ( a.month < b.month){
                  return -1;
                }
                if ( a.month > b.month){
                  return 1;
                }
                return 0;
            }
              
            switch(pMode.toLowerCase()){
                case "seasonal compare":                        
                    vItems.sort( sortSeasons );
                    break;                
                case "monthly compare":                        
                    vItems.sort( sortMonths );
                    break;                
            }             
            
            function _testDate(from,to, year){
                switch(pMode.toLowerCase()){                    
                    case "seasonal compare":
                        return stormcloud.dates.getSeasonText(from.date) === to && from.year === year;
                    case "monthly compare":
                        return from.month === to && from.year === year;
                }                
            }
            
            if(vItems && vRainList && vItems.length > 0){
                let vBreak = false;
                for(let i =0, j = vItems.length; i<j;i++){
                    let vTempRain = 0;
                    let vTempDate;
                    let vTempYear;
                    switch(pMode.toLowerCase()){
                        case "seasonal compare":
                            vTempDate = stormcloud.dates.getSeasonText(vItems[i].date);                            
                            vTempYear = vItems[i].year;                            
                            break;                        
                        case "monthly compare":
                            vTempDate = vItems[i].month;                            
                            vTempYear = vItems[i].year;                            
                            break;                        
                    }
                    for(let x =0, y = vRainList.length; x<y;x++){
                        if(_testDate(vRainList[x],vTempDate,vTempYear)){
                            vTempRain += parseFloat(vRainList[x].rain);    
                        }
                    }              
                    
                    vItems[i].rain = vTempRain;                     
                    switch(pMode.toLowerCase()){
                        case "seasonal compare":
                            vItems[i].label= vItems[i].year;
                            if(vFullLabels){
                                vItems[i].label = stormcloud.dates.getSeasonText(vItems[i].date).substring(0,3) +  " " + vItems[i].year;
                            }
                            vItems[i].groupLabel= stormcloud.dates.getSeasonText(vItems[i].date);
                            break;                        
                        case "monthly compare":
                            vItems[i].label= vItems[i].year;
                            if(vFullLabels){
                                vItems[i].label = stormcloud.dates.getMonthText(vItems[i].date).substring(0,3) +  " " + vItems[i].year;
                            }
                            vItems[i].groupLabel= stormcloud.dates.getMonthText(vItems[i].date).substring(0,3);
                            break;       
                    }
                    

                    if(vBreak){                        
                        break;
                    }
                }                

                let vOptions = {};
                if(stormcloud.db.getRainDirection()){
                    vItems.sort(stormcloud.db.sortRain);                    
                    vItems = vItems.filter((o) => { return o.rain !== 0;});
                    vOptions.labels = false;
                    vOptions.fullText = true;
                }
                vItems.reverse(); //Graph runs in reverse mode to the list.
                stormcloud.graph.draw(vItems,vOptions);            
            }
        } else{            
            stormcloud.graph.clear();
        }   
    }

    return {
        runReport: _runReport
    };
})();


