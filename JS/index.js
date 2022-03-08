// number object
const num = {
    "1": "One",
    "2": "Two",
    "3": "Three",
    "4": "Four",
    "5": "Five",
    "6": "Six",
    "7": "Seven",
    "8": "Eight",
    "9": "Nine",
    "10": "Ten",
    "11": "Eleven",
    "12": "Twelve",
    "13": "Thirteen",
    "14": "Fourteen",
    "15": "Fifteen",
    "16": "Sixteen",
    "17": "Seventeen",
    "18": "Eighteen",
    "19": "Nineteen",
    "20": "Twenty",
}

// function to display start message when input tag is empty
function displayStartMsg(){
    document.getElementById('phoneticsDiv').style.display = 'none';
        document.getElementById('accordionPanelsStayOpenExample').innerHTML = `<div id="msgWhenEmpty">
                                                                                    <div class="typewriter">
                                                                                        <h2 class="typewriter-text1">Waiting for your word!</h2>
                                                                                    </div>
                                                                                    <div class="typewriter">
                                                                                        <h2 class="typewriter-text2"> My Friend...</h2>
                                                                                    </div>
                                                                                </div>`;
}


// function to scroll smoothly to the Result section when we click on search button
function smoothScroll(){
    let pageNavbar = document.getElementById('pageNavbar');
    let querySection = document.getElementById('querySection');
    window.scroll({
        top: pageNavbar.offsetHeight + querySection.offsetHeight,
        left: 0,
        behavior: 'smooth'
    });
}


// function for searching word from the server
function wordSearchHandler() {
    // word for search
    let wordInput = document.getElementById('wordInput');
    let word = wordInput.value;

    if (word === ""){
        displayStartMsg();
    }
    else{

        // creating a xhr object
        const xhr = new XMLHttpRequest();
    
        // xhr.onreadystatechange = function (){
        //     console.log(this.readyState,this.status,this);
        // }
    
        // open xhr object
        xhr.open('GET', `https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`, true);
    
        // send xhr  request object
        xhr.send();
    
        // on progress
        xhr.onprogress = function () {
            document.getElementById('accordionPanelsStayOpenExample').innerHTML = `<div style="display: flex;justify-content: center;align-items: center;">
                <div class="spinner-border text-info" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>`;
        }
    
        // when the response is ready
        xhr.onload = function () {
            if (this.status === 200) {
                let wordArray = JSON.parse(this.responseText);
                let meaningsArray = wordArray[0].meanings;
    
                document.getElementById('phoneticsDiv').style.display = 'flex';
                
                // to display audio button and to give the source of audio and the word and phonetics text
                if (wordArray[0].phonetics[0].text !== undefined){
                    // phonetics audio
                    document.getElementById('audioBtn').innerHTML = `<audio src="${wordArray[0].phonetics[0].audio}" id="wordAudio"></audio>
                    <i class="bi bi-volume-up-fill"></i>`;
                    // phonetics text
                    document.getElementById('WordPronounciation').innerHTML = `<h1>${wordArray[0].word}</h1>
                    <p><small class="text-muted">${wordArray[0].phonetics[0].text}</small></p>`;
                }
                else{
                    // phonetics audio not available
                    document.getElementById('audioBtn').innerHTML = `<audio src="./appaudio/phoneticsAudioNotAvailable.mp3" id="wordAudio"></audio>
                    <i class="bi bi-volume-up-fill"></i>`;
                    // phonetics text not available
                    document.getElementById('WordPronounciation').innerHTML = `<h1>${wordArray[0].word}</h1>
                    <p><small class="text-muted">/phonetics text not available/</small></p>`;
                }
    
                let mainStr = "";
    
                meaningsArray.forEach(function (element,index) {
                    let subStr = "";
    
                    element.definitions.forEach(function (description){
                        // to display definition
                        if (description.definition !== undefined){
                            subStr += `<li>${description.definition}</li>`;
                        }
                        
                        // to display example
                        if(description.example !== undefined){
                            subStr += `<p class="exmclass"><small class="text-muted">"${description.example}"</small></p>`;
                        }
                        else{
                            subStr += `<p class="exmclass"></p>`;
                        }
    
                        // to display synonyms
                        if (description.synonyms !== undefined){
                            subStr += `<p class="lastp"><span class="synonymClass">synonyms: </span><em>${description.synonyms.join(", ")}</em></p>`;
                        }
                    });
    
                    // to display part of speech and the (definition+example+synonyms)
                    if ((index+1) === 1){
                        mainStr += `<div class="accordion-item">
                                        <h2 class="accordion-header" id="panelsStayOpen-heading${num[String(index+1)]}">
                                            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                                data-bs-target="#panelsStayOpen-collapse${num[String(index+1)]}" aria-expanded="true"
                                                aria-controls="panelsStayOpen-collapse${num[String(index+1)]}">
                                                ${element.partOfSpeech}
                                            </button>
                                        </h2>
                                        <div id="panelsStayOpen-collapse${num[String(index+1)]}" class="accordion-collapse collapse show"
                                            aria-labelledby="panelsStayOpen-heading${num[String(index+1)]}">
                                            <div class="accordion-body">
                                                <ul id="definationsList">
                                                    ${subStr}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>`;
                    }
                    else{
                        mainStr += `<div class="accordion-item">
                                        <h2 class="accordion-header" id="panelsStayOpen-heading${num[String(index+1)]}">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                data-bs-target="#panelsStayOpen-collapse${num[String(index+1)]}" aria-expanded="false"
                                                aria-controls="panelsStayOpen-collapse${num[String(index+1)]}">
                                                ${element.partOfSpeech}
                                            </button>
                                        </h2>
                                        <div id="panelsStayOpen-collapse${num[String(index+1)]}" class="accordion-collapse collapse"
                                            aria-labelledby="panelsStayOpen-heading${num[String(index+1)]}">
                                            <div class="accordion-body">
                                                <ul id="definationsList">
                                                    ${subStr}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>`;
                    }
                });
                document.getElementById('accordionPanelsStayOpenExample').innerHTML = mainStr;

                // to scroll the window to the result section when the meaning is loaded
                smoothScroll();
            }
            else if (this.status === 404) {
                document.getElementById('phoneticsDiv').style.display = 'none';
                document.getElementById('accordionPanelsStayOpenExample').innerHTML = `<p style="margin-bottom: 0;text-align: center;font-family: 'Aleo', serif;color: #b30000;font-size: 1.3rem;">Sorry! We couldn't find definitions for the word you were looking for.</p>`;

                // to scroll the window to the result section when the meaning is loaded
                smoothScroll();
            }
            else {
                console.log("some error occured");
            }
        }
    }
}



// When we click on search button
let searchButton = document.getElementById('button-addon2');
searchButton.addEventListener('click', wordSearchHandler);

// when we click on audio button
let audioBtn = document.getElementById('audioBtn');
audioBtn.addEventListener('click', function (){
    let wordAudio = document.getElementById('wordAudio');
    wordAudio.play();     // to play the pronounciatio of that word
});
