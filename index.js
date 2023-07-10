const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
const CHECK_URL = "https://words.dev-apis.com/validate-word";

var letterString = "Letter-";
var letterNumber = 0;
var currentGuess = "";
var counter = 0;

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function isQwerty(letter) {
    return /\d/.test(letter);
}

async function checkWord(word) {
    console.log(word);
    const response = await fetch(WORD_URL);
    //await the response being processed as JSON
    const processedResponse = await response.json();
    //log the processed response
    console.log(processedResponse);
    //return the validWord property of the processed response
    const result = processedResponse.word === word;

    return result;
}

async function wordCorrect() {
    counter = 0;
    await checkCorrections();
    currentGuess = "";
    const elem = document.getElementById("winner");
    //elem.style.borderColor = "pink";
    //elem.style.borderWidth = "5px";
    elem.style.boxShadow = "0 0 50px 15px #48abe0";
    elem.innerHTML = "CORRECT!";
    elem.style.fontWeight = "600";
    return;
}

function colorCorrection1(i) {
    i = i + 1;
    letterNumber = letterNumber;

    const elemen = document.getElementById(
        letterString + (letterNumber - (5 - i)).toString()
    );
    const elemenP = elemen.parentNode;
    elemenP.style.borderWidth = "2px";
    elemenP.style.borderColor = "green";
    i = i - 1;
}

async function colorCorrection2(i) {
    const currentLetter = currentGuess[i];
    i = i + 1;
    const todaysWord = await fetch(WORD_URL);
    const processedResponseOfTodaysWord = await todaysWord.json();
    const wordString = processedResponseOfTodaysWord.word;
    if (wordString.includes(currentLetter)) {
        console.log(
            i + " " + currentLetter + " " + letterNumber + " " + wordString
        );
        const elemen = document.getElementById(
            letterString + (letterNumber - (5 - i)).toString()
        );
        const elemenP = elemen.parentNode;
        elemenP.style.borderWidth = "2px";
        elemenP.style.borderColor = "yellow";
    }
    i = i - 1;
}

async function checkCorrections() {
    const todaysWord = await fetch(WORD_URL);
    const processedResponseOfTodaysWord = await todaysWord.json();
    const wordString = processedResponseOfTodaysWord.word;

    for (var i = 0; i < 5; i++) {
        if (wordString[i] === currentGuess[i]) {
            colorCorrection1(i);
        }

        if (!(wordString[i] === currentGuess[i])) {
            console.log(i);
            await colorCorrection2(i);
        }
    }

    currentGuess = "";
    letterString = "Letter-";
    return;
}

async function wordNotCorrectGuessTrying() {
    const response = await fetch(WORD_URL);
    const processedResponse = await response.json();

    counter = 0;
    const elem = document.getElementById("winner");
    elem.style.borderColor = "red";
    elem.style.borderWidth = "0px";
    //elem.style.borderWidth = "5px";
    elem.style.boxShadow = "0 0 50px 15px red";
    elem.innerHTML = "INCORRECT!";
    elem.style.fontWeight = "600";
    checkCorrections();
    return;
    return;
}

window.addEventListener("keydown", async function (event) {
    // uses the isLetter function from above
    if (counter === 5) {
        const result = await checkWord(currentGuess);
        console.log(result);

        if (result == true) {
            await wordCorrect();
            //remove the event listener, its an anonymouse eventlistener so we cant just remove it by name
            window.removeEventListener("keydown", arguments.callee);
        } else {
            await wordNotCorrectGuessTrying();
        }
    } else if (!isLetter(event.key)) {
        event.preventDefault();
    } else if (isQwerty(event.key)) {
        event.preventDefault();
    } else {
        letterNumber++;
        letterString = letterString + letterNumber.toString();

        currentGuess = currentGuess + event.key;

        counter = counter + 1;

        document.getElementById(letterString).innerHTML = event.key;
        letterString = "Letter-";
    }
});
