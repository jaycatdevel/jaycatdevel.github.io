
let _guessIndex = 0;
let _charIndex = 0;
let _word = "";
let _guess = "";
let _previousGuess = [];
const CHARCOUNT = 5;
const MAXGUESSES = 5;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const startDate = new Date(2025, 5, 1); // Month is 0-indexed, so June is 5

function init(pID){    
    _guessIndex = 0;
    _charIndex = 0;
    _word = "";
    _guess = "";
    _previousGuess = [];
    _resetGrid();
    _loadWord(pID);
    _showLetters();
    document.addEventListener('keydown', _keyPress);
    createAlphabetDivs('A'); // This will center the letter 'M'
}

function keyTap(e){
    _processLetter(e);
}

function _keyPress(event){
    let vChar = String.fromCharCode(event.keyCode).toUpperCase();
    if (event.key.toUpperCase() === 'DELETE' || event.key.toUpperCase() === 'ENTER' || event.key.toUpperCase() === 'BACKSPACE') {
        vChar = event.key;
    }
    _processLetter(vChar);    
}

function _processLetter(vChar){
    let vDelete = false;
    
    // Add your logic here to handle the key press
    if (vChar.toUpperCase() === 'ENTER') {
        if(_charIndex > 4){
            makeGuess();
        }
        return;
    }            
    else if(vChar.toUpperCase() === "DELETE" || vChar.toUpperCase() === "BACKSPACE"){
        vDelete = true;
        vChar = "";
        _guess = _guess.substring(0,_guess.length - 1);
        _charIndex--;        
        if(_charIndex < 0){
            _charIndex = 0;
        }
    }
    else if(alphabet.indexOf(vChar.toUpperCase())<0){
        return;
    }
    if(_charIndex > 4 && !vDelete){
        _angryShake(4);
        return;
    }
    _guess += vChar;
    const vRow = document.getElementById("row" + _guessIndex.toFixed(0));
    const vCells = vRow.children;
    if(vCells && vCells.length === 5){
        const letterDiv = document.createElement('div');
        letterDiv.classList.add("cell-front");                    
        letterDiv.textContent = vChar;                
        if(vDelete){
            vCells[_charIndex].children[0].innerHTML = "";
        } else{
            vCells[_charIndex].children[0].appendChild(letterDiv);
        }        
        _happyDance(_charIndex,true);
    }

    if(!vDelete){
        _charIndex++;        
        if(_charIndex > 5){
            _charIndex = 5;
        }    
    }
    _showLetters();
}

function _loadWord(pID){
    let vIndex = "";
    if(pID){
        vIndex = pID;
    } else{
        const today = new Date(); // Get today's date
        
        // Calculate the difference in milliseconds
        const differenceInTime = today.getTime() - startDate.getTime();

        // Convert milliseconds to days
        let differenceInDays = parseInt(differenceInTime / (1000 * 3600 * 24));

        if(differenceInDays >= (WordList.length - 1)){
            differenceInDays = (WordList.length - 1);
        }    
        vIndex = differenceInDays;
    }
    _word = WordList[vIndex].toUpperCase();        
}

function makeGuess(){
    if(WordList.indexOf(_guess.toLowerCase()) < 0){
        _showToast("You did not enter a valid word");
        _angryShake();
        return;
    }    
    let vCorrect = _checkGuess(_guess.toUpperCase());        
    if(!vCorrect){
        _guessIndex++;
        _charIndex = 0;
        _guess = "";
        _showLetters();
        if(_guessIndex > MAXGUESSES){
            document.removeEventListener('keydown', _keyPress);
            setTimeout(() => {
            alert("You did not guess the word: " + _word);                
            }, (2300));
            
            setTimeout(() => {
                _angryShake();
            }, 1800);            
        }
    }
}

function _checkGuess(vGuess){    
    let vResult = "";
    let vCalcResult = 0;
    const vRow = document.getElementById("row" + _guessIndex.toFixed(0));
    const vCells = vRow.children;
    
    _previousGuess = [];
    for(let i =0; i < CHARCOUNT; i++){	
        let vDist = closestLetterDistance(_word[i],vGuess[i]);        
        if(vCells && vCells.length === 5){
            const letterDiv = document.createElement('div');
            letterDiv.classList.add("cell-back");                    
            letterDiv.textContent = vGuess[i];       
            if(vDist === 0){
                letterDiv.classList.add("exact");                    
            }
            else if(vDist < 3){
                letterDiv.classList.add("close");                    
            } else if (vDist < 6){
                letterDiv.classList.add("reasonable");                    
            } else if (vDist < 10){
                letterDiv.classList.add("far");                    
            } else{
                letterDiv.classList.add("out-of-bounds");                    
            }
            vCells[i].children[0].appendChild(letterDiv);
            setTimeout(() => {
                vCells[i].classList.toggle("cell-flip"); // Toggle the flip effect    
            }, (300 * (i)));
            
            _previousGuess[i] = {
                letter: vGuess[i],
                distance: vDist
                };
        }
        vCalcResult += vDist;
        vResult += vDist.toFixed() + " ";
    }
    // Create the new div element
    const insertedDiv = document.createElement('div');
    // Add text content to the new div
    insertedDiv.textContent = vResult;
    // Append the new div to the parent div
    //document.getElementById("answer").appendChild(insertedDiv);
    if(vCalcResult === 0){
        alert("You guessed the word");
        document.removeEventListener('keydown', _keyPress);
        _happyDance();
        return true;
    }
    return false;
}

function closestLetterDistance(letter1, letter2) {
    // Convert letters to their corresponding ASCII values
    const code1 = letter1.charCodeAt(0);
    const code2 = letter2.charCodeAt(0);

    // Calculate the direct distance
    let directDistance = Math.abs(code1 - code2);

    // Since the alphabet loops, calculate the wrap-around distance
    let wrapAroundDistance = 26 - directDistance;

    // Return the minimum of the two distances
    let vRawDistance = Math.min(directDistance, wrapAroundDistance);
    let vFinalDistance = 26;
    if(vRawDistance === 0){
        vFinalDistance = 0;
    }
    else if(vRawDistance < 3){
        vFinalDistance = 2;
    } else if (vRawDistance < 6){
        vFinalDistance = 5;
    } else if (vRawDistance < 10){
        vFinalDistance = 9;
    }

    return vFinalDistance;
}

function _showLetters(){    
    const vGuessLetters = _previousGuess[_charIndex];
    if(vGuessLetters){
        createAlphabetDivs(vGuessLetters.letter, vGuessLetters.distance); // This will center the letter 'M'
    }
}

function createAlphabetDivs(centerLetter, distance) {  
    const letterIndex = alphabet.indexOf(centerLetter.toUpperCase());
    let letters = [];
    if(centerLetter && distance !== undefined){
        letters = getWrappedLetterIndexes(centerLetter, distance);
    }

    if (letterIndex === -1) {
        console.error('Invalid letter provided. Please provide a single letter from A to Z.');
        return;
    }

    const totalLetters = alphabet.length;
    // Calculate the start index to center the letter
    const startIndex = (letterIndex - Math.floor(totalLetters / 2) + totalLetters) % totalLetters;    
    
    for (let i = 0; i < totalLetters; i++) {
        const currentIndex = (startIndex + i) % totalLetters;        
        const letterDiv = document.getElementById("lb" +alphabet[currentIndex]);
        letterDiv.classList.remove("exact");
        letterDiv.classList.remove("close");            
        letterDiv.classList.remove("reasonable");            
        letterDiv.classList.remove("far");            
        letterDiv.classList.remove("out-of-bounds");  
        letterDiv.classList.remove("highlighted");             
        if(letters.indexOf(alphabet[currentIndex]) <0){
            letterDiv.classList.add("hidden");                        
        } else{
            letterDiv.classList.add("highlighted");            
            letterDiv.classList.remove("hidden");         
            if(alphabet[currentIndex] === centerLetter){
                if(distance === 0){
                    letterDiv.classList.add("exact");                    
                }
                else if(distance < 3){
                    letterDiv.classList.add("close");                    
                } else if (distance < 6){
                    letterDiv.classList.add("reasonable");                    
                } else if (distance < 10){
                    letterDiv.classList.add("far");                    
                } else{
                    letterDiv.classList.add("out-of-bounds");                    
                }
            }   
        }
        letterDiv.textContent = alphabet[currentIndex];        
    }
    
}

function createAlphabetDivs_old(centerLetter, distance) {  
    const letterIndex = alphabet.indexOf(centerLetter.toUpperCase());
    let letters = [];
    if(centerLetter && distance !== undefined){
        letters = getWrappedLetterIndexes(centerLetter, distance);
    }

    if (letterIndex === -1) {
        console.error('Invalid letter provided. Please provide a single letter from A to Z.');
        return;
    }

    const totalLetters = alphabet.length;
    const divs = [];

    // Calculate the start index to center the letter
    const startIndex = (letterIndex - Math.floor(totalLetters / 2) + totalLetters) % totalLetters;
    
    for (let i = 0; i < totalLetters; i++) {
        const currentIndex = (startIndex + i) % totalLetters;        
        const letterDiv = document.createElement('div');
        letterDiv.className = 'letterBox';        
        if(letters.indexOf(alphabet[currentIndex]) <0){
            letterDiv.classList.add("hidden");            
        } else{
            letterDiv.classList.add("highlighted");            
        }
        letterDiv.textContent = alphabet[currentIndex];
        divs.push(letterDiv);
    }

    // Append the divs to a container (you can change 'container' to your desired element)
    const container = document.getElementById("letterRange");    
    container.innerHTML = ''; // Clear previous content
    divs.forEach(div => container.appendChild(div));
}

function getWrappedLetterIndexes(centerLetter, offset) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const startIndex = alphabet.indexOf(centerLetter.toUpperCase());

    if (startIndex === -1) {
        console.error('Invalid center letter provided. Please provide a single letter from A to Z.');
        return [];
    }

    const totalLetters = alphabet.length;
    const result = [];

    // Calculate the range of indexes to include
    for (let i = -offset; i <= offset; i++) {
        const wrappedIndex = (startIndex + i + totalLetters) % totalLetters; // Ensure positive index
        result.push(alphabet[wrappedIndex]);
    }
    if(centerLetter && result.indexOf(centerLetter)<0){
        result.push(centerLetter);
    }
    
    return result;
}

function _hideAllPages(){
    const pages = document.getElementsByClassName("page");
    for(let i = 0, j = pages.length; i<j;i++){
        pages[i].classList.add("hiddenPage");
        pages[i].classList.remove("shownPage");
    }
}
function play(pID){
    _hideAllPages();
    document.getElementById("gamePage").classList.remove("hiddenPage");
    document.getElementById("gamePage").classList.add("shownPage");
    init(pID);
}

function howto(){
    _hideAllPages();
    document.getElementById("howToPage").classList.remove("hiddenPage");
    document.getElementById("howToPage").classList.add("shownPage");
}

function goHome(){
    _hideAllPages();
    document.getElementById("homePage").classList.remove("hiddenPage");
    document.getElementById("homePage").classList.add("shownPage");    
}

function archive(){
    _hideAllPages();
    document.getElementById("archivePage").classList.remove("hiddenPage");
    document.getElementById("archivePage").classList.add("shownPage");    
    loadArchive();
}

function _angryShake(pIndex){
    let vGuess = _guessIndex;
    if(vGuess > 5){
        vGuess = 5;
    }
    const vRow = document.getElementById("row" + vGuess.toFixed(0));
    const vCells = vRow.children;    

    function _shakeCell(_index){
        if(_index !== undefined){
            const box = vCells[_index];        
            box.classList.add('angry-shake');
            // Remove the class after animation ends to allow re-triggering
            box.addEventListener('animationend', 
                () => {
                        box.classList.remove('angry-shake');
                    }, { once: true });                
        }    
    }
    if(pIndex){
        _shakeCell(pIndex);        
    } else{
        for(let i = 0, j = vCells.length;i<j;i++){
        _shakeCell(i);        
        }
    }
}

function _happyDance(pIndex,pFast) {
    const vRow = document.getElementById("row" + _guessIndex.toFixed(0));
    const vCells = vRow.children;    

    function _danceCell(_index){
        if(_index !== undefined){
            const box = vCells[_index];        
            let vDance = 'happy-dance';
            if(pFast){
                vDance = 'happy-dance-fast';
            }
            box.classList.add(vDance);
            // Remove the class after animation ends to allow re-triggering
            box.addEventListener('animationend', 
                () => {
                        box.classList.remove(vDance);
                    }, { once: true });                
        }    
    }
    if(pIndex !== undefined){
        _danceCell(pIndex);
    } else{
        for(let i = 0, j = vCells.length;i<j;i++){
            _danceCell(i);        
        }    
    }
}

function _showToast(sMessage){
    const toast = document.getElementById('toast');
    toast.textContent = sMessage;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('invisible');
        toast.classList.remove('show');
            toast.classList.add('fade-out');
        }, 3000); // Start fading out after 3 seconds

    setTimeout(() => {
        toast.classList.add('invisible');
            toast.classList.remove('fade-out');
        }, 3500); // reset after 3.5 seconds    
}

function loadArchive(){
    const today = new Date(); // Get today's date
    const yesterday = new Date(today); // Create a new date object for yesterday
    yesterday.setDate(today.getDate() - 1); // Subtract one day
    
    // Calculate the difference in milliseconds
    const differenceInTime = yesterday.getTime() - startDate.getTime();

    // Convert milliseconds to days
    let differenceInDays = parseInt(differenceInTime / (1000 * 3600 * 24));

    if(differenceInDays >= (WordList.length - 1)){
        differenceInDays = (WordList.length - 1);
    }    
    const vRow = document.getElementById("archiveGrid");
    for(let i = 0; i <= differenceInDays; i++){
        const pastDate = new Date(startDate);
        pastDate.setDate(startDate.getDate() + i);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = pastDate.toLocaleDateString('en-US', options);
        const archiveDiv = document.createElement('div');
        archiveDiv.classList.add("guessRow");
        const textDiv = document.createElement('div');
        textDiv.textContent = formattedDate;
        textDiv.classList.add("archiveText");
        const buttonDiv = document.createElement('button');
        buttonDiv.innerHTML = "&#9654;";        
        buttonDiv.classList.add("key");
        buttonDiv.setAttribute('data-id', i.toFixed());
        buttonDiv.onclick = _selectWord;
        archiveDiv.appendChild(textDiv);                        
        archiveDiv.appendChild(buttonDiv);                        
        vRow.prepend(archiveDiv);                        
    }
}

function _selectWord(){
    if(this){
        const data = this.dataset;
        if(data && data.id){            
            play(data.id);
        }        
    }
}

function _resetGrid(){
    const theGrid = document.getElementById("guessGrid");
    const theCellsInner = theGrid.getElementsByClassName("cell-inner");
    for(let i = 0, j = theCellsInner.length;i < j; i++){
        theCellsInner[i].innerHTML = "";
    }    
    const theCells = theGrid.getElementsByClassName("cell");
    for(let i = 0, j = theCells.length;i < j; i++){
        theCells[i].classList.remove("cell-flip");
    }    
}
    