var stormcloud = stormcloud || {};

stormcloud.dates = (function(){
    "use strict";

    let vMonths = ["January","February","March","April","May","June",
                    "July","August","September","October","November","December"];

    const theSeasons = ["Summer","Summer","Autumn","Autumn","Autumn","Winter","Winter","Winter","Spring","Spring","Spring","Summer"];
    function _getDate(vDate){                
        if(vDate && !Number.isNaN(vDate.valueAsNumber)){
            let vNewDate;
            if(vDate.valueAsNumber){
                vNewDate = new Date(vDate.valueAsNumber);        
            } else{
                vNewDate = new Date(vDate);        
            }            
            var vFormatted = new Date(vNewDate.getTime() - (vNewDate.getTimezoneOffset() * 60000 ))
                        .toISOString()
                        .split("T")[0];
                
            return {
                date: vFormatted,
                year: vNewDate.getFullYear(),
                month: vNewDate.getMonth() + 1,
                day: vNewDate.getDate()
            };
        }                
        return {
            date:""
        };        
    }

    function _getDateRange(vRange){
        if(vRange){
            switch(vRange.toLowerCase()){
                case "this week":
                    return _getThisWeek();
                case "this month":
                    return _getThisMonth();
                case "this year":
                    return _getThisYear();
                case "last week":
                    return _getLastWeek();
                case "last month":
                    return _getLastMonth();
                case "last year":
                    return _getLastYear();
                case "last 7 days":
                    return _getLastX(7);
                case "last 30 days":
                    return _getLastX(30);
                case "last 365 days":
                    return _getLastX(365);
                default:
                    return {from:{ date: ""}, to:{date: ""}}; 
            }
            
        }
    }

    function _getThisWeek(){
        var curr = new Date; // get current date
        var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6

        var firstday = _getDate(curr.setDate(first));
        var lastday = _getDate(curr.setDate(last));

        return {from: firstday,to: lastday};

    }

    function _getLastWeek(){
        var curr = new Date; // get current date
        var first = curr.getDate() - curr.getDay() - 7 + 1; // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6

        var firstday = _getDate(curr.setDate(first));
        var lastday = _getDate(curr.setDate(last));

        return {from: firstday,to: lastday};

    }

    function _getThisMonth(){        
        var curr = new Date; // get current date
        var first = new Date(curr.getFullYear(), curr.getMonth(), 1);
        var last = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);

        var firstday = _getDate(first);
        var lastday = _getDate(last);        
        return {from: firstday,to: lastday};
    }

    function _getLastMonth(){        
        var curr = new Date; // get current date
        var first = new Date(curr.getFullYear(), curr.getMonth() - 1, 1);
        var last = new Date(curr.getFullYear(), curr.getMonth(), 0);

        var firstday = _getDate(first);
        var lastday = _getDate(last);        
        return {from: firstday,to: lastday};
    }

    function _getThisYear(){        
        var curr = new Date; // get current date
        var first = new Date(curr.getFullYear(), 0, 1);
        var last = new Date(curr.getFullYear(), 12, 0);

        var firstday = _getDate(first);
        var lastday = _getDate(last);        
        return {from: firstday,to: lastday};
    }

    function _getLastYear(){        
        var curr = new Date; // get current date
        var first = new Date(curr.getFullYear() - 1, 0, 1);
        var last = new Date(curr.getFullYear() - 1, 12, 0);

        var firstday = _getDate(first);
        var lastday = _getDate(last);        
        return {from: firstday,to: lastday};
    }

    function _getLastX(vAmount){        
        var curr = new Date; // get current date
        var first = new Date; // get current        
        var last = curr.setDate(curr.getDate() - vAmount); // get current date - vAmount; // last day is the first day + 6

        var firstday = _getDate(last); // REVERSE
        var lastday = _getDate(first);

        return {from: firstday,to: lastday};

    }

    function _getMonthText(o){
        if(o){
            let vNewDate = new Date(o);                 
            let vText = vMonths[vNewDate.getMonth()] + " " + vNewDate.getFullYear().toFixed(o);
            return vText;            
        }
    }

    function _getSeasonText(o){
        if(o){
            let vNewDate = new Date(o);                 
            let vText = theSeasons[vNewDate.getMonth()];
            return vText;            
        }
    }

    function _padDate(o){
        let vFinal = o.toFixed(0);
        if(vFinal.length === 1){
            vFinal = "0" + vFinal;
        }
        return vFinal;
    }

    function _getShortText(o){
        if(o){
            let vNewDate = new Date(o);                 
            let vText = _padDate(vNewDate.getDate()) + "/" +  _padDate((vNewDate.getMonth() + 1));
            return vText;            
        }
    }

    function _getEmptyDates(from,to){
        if(from && to){
            let dates = [];
            let currentDate = new Date(from);
            let vTo = new Date(to);            
            vTo.setDate(vTo.getDate() + 1);
            while (currentDate  < vTo) {
                dates.push(_getDate(new Date(currentDate)));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return dates;  
        }        
    }

    function _getEmptyYears(from,to){
        if(from && to){
            let dates = [];
            var first = new Date(new Date(from).getFullYear(), 0, 1);
            let currentDate = new Date(first);
            let vTo = new Date(new Date(to).getFullYear(), 0, 1);
            vTo.setFullYear(vTo.getFullYear() + 1);
            while (currentDate  < vTo){
                dates.push(_getDate(new Date(currentDate)));
                currentDate.setFullYear(currentDate.getFullYear() + 1);
            }            
            return dates;  
        }        
    }

    function _getEmptyMonths(from,to){
        if(from && to){
            let dates = [];
            let currentDate = new Date(from);
            let vTo = new Date(to);                        
            vTo.setMonth(vTo.getMonth() + 1);            
            while (currentDate  < vTo) {
                dates.push(_getDate(new Date(currentDate)));
                currentDate.setMonth(currentDate.getMonth() + 1);                
            }
            return dates;  
        }        
    }

    function _getEmptySeasons(from,to){        
        if(from && to){
            let dates = [];
            let currentDate = new Date(from);
            let vTo = new Date(to);            
            vTo.setMonth(vTo.getMonth() + 1);
            let currentSeason = "";
            while (currentDate  < vTo) {
                if(currentSeason !==theSeasons[currentDate.getMonth()]){
                    let vDate =_getDate(new Date(currentDate)); 
                    currentSeason = theSeasons[currentDate.getMonth()];
                    vDate.season = currentSeason;
                    dates.push(vDate);
                    
                }
                currentDate.setMonth(currentDate.getMonth() + 1);                
            }            
            return dates;  
        }
    }

    function _getMinDate(){
        return _getDate(-82400000000000);
    }

    function _getMaxDate(){        
        return _getDate(82400000000000);                                
    }

    return {
        getDate: _getDate,
        getDateRange: _getDateRange,
        getMonthText: _getMonthText,
        getSeasonText: _getSeasonText,
        getEmptyDates: _getEmptyDates,
        getEmptyYears: _getEmptyYears,
        getEmptyMonths: _getEmptyMonths,
        getEmptySeasons: _getEmptySeasons,
        getShortText: _getShortText,
        getMinDate: _getMinDate,
        getMaxDate: _getMaxDate
    };
})();
