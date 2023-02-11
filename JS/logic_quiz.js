const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"))
const questionCounterText = document.getElementById('questionCounter');
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progress-bar-full");
const all_Species_api = "https://apps.des.qld.gov.au/species/?op=getspecieslist&pagecount=300&kingdom=animals";
const picture_api = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=5&format=json&search=panda&namespace=0";
const picture = document.getElementsByClassName("picture");
const casetext = document.getElementById("try");
const questionsbase_num = 100;
const speciesnames = [];
var chozenspe = null;
let currentQuestions = {};
let acceptiongAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
var questions = [];
const Correct_Bonus = 10;
const MAX_Questions = 5;



function getquestiontype(typeName) {
    all_Species_api += "https://apps.des.qld.gov.au/species/?op=getspecieslist&pagecount=300" + "&kindom=" + typeName;
}


async function startGame() {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...await main(all_Species_api)];
    getNewQuestion();
};

getNewQuestion = () => {
    if (availableQuestions.length == 0 || questionCounter >= MAX_Questions) {
        to();
    };
    questionCounter++;
    questionCounterText.innerText = `${questionCounter} / ${MAX_Questions}`;
    progressBarFull.style.width = `${(questionCounter / MAX_Questions) * 100}%`;


    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestions = availableQuestions[questionIndex];
    question.innerText = currentQuestions.question;

    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestions["choice" + number];

    })
    availableQuestions.splice(questionIndex, 1);
    acceptiongAnswers = true;
};

choices.forEach(choice => {

    choice.addEventListener('click', e => {
        if (!acceptiongAnswers) return;

        acceptiongAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
        const classToApply =
            selectedAnswer == currentQuestions.answer ? "correct" : "incorrect";
        if (classToApply == 'correct') {
            incrementScore(Correct_Bonus);
        };
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);

    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};




to = () => {
    var finalScore = score;
    window.location.href = "gameend_quiz.html?value=" + finalScore;
};

// for the all quizz make parts
async function main(a1) {
    const response = await fetch(a1);
    const data = await response.json();
    setTimeout(function() {
        $("body").addClass("loaded");
    }, 1000);
    var info = null;
    for (i = 0; i < questionsbase_num; i++) {
        //if (data.SpeciesSightingSummariesContainer.SpeciesSightingSummary[i].Species.ConservationStatus.ConservationSignificant == true) {
        speciesnames.push(data.SpeciesSightingSummariesContainer.SpeciesSightingSummary[i]);

    };
    info = chooseSpecies(speciesnames);
    var namemm = info.get_science_name;
    //picture_api.lastIndexOf("panda", 10) = namemm;
    //const picture_reponse = await fetch(picture_api);
    //const picture_data = await picture_reponse.xml();
    //picture = picture_data.getElementByTagName("Section")[0].getElementByTagName('Image');
    const questions = question_builder(info, speciesnames);
    console.log(questions);
    return questions;
}

function chooseSpecies(info_list) {
    index1 = Math.floor(Math.random() * questionsbase_num);
    chozenspe = info_list[index1];
    if (get_common_name(chozenspe) == "Unknown or Code Pending") { chooseSpecies(info_list); };
    return chozenspe;
}

// to build the final quizz
function question_builder(info, info_list) {
    let S_name = get_science_name(info);
    let C_name = get_common_name(info);
    let className = get_class(info);
    let environment = get_environment(info);
    let data = get_lastSeenDate(info);
    let conservation = get_conservation(info);
    let quizz1 = buildQizz1(S_name, C_name, info_list);
    let quizz2 = buildQizz2(C_name, className, info_list);
    let quizz3 = buildQizz3(C_name, environment, info_list);
    let quizz4 = buildQizz4(C_name, data, info_list);
    let quizz5 = buildQizz5(C_name, conservation, info_list);
    var question_list = [];
    question_list.push(quizz1);
    question_list.push(quizz2);
    question_list.push(quizz3);
    question_list.push(quizz4);
    question_list.push(quizz5);
    return question_list;
};

function get_science_name(info) {
    const name = info.Species.ScientificName;
    return name;
};

function get_common_name(info) {
    const name = info.Species.AcceptedCommonName;
    return name;
};
// have chaged to family name
function get_class(info) {
    const className = info.Species.FamilyName;
    return className;
};

function get_environment(info) {
    const environment = info.Species.SpeciesEnvironment;
    return environment;
}

function get_conservation(info) {
    const cons = info.Species.ConservationStatus.ConservationSignificant;
    var a = null;
    if (cons) {
        a = info.Species.ConservationStatus.NCAStatus;
    } else {
        a = "safe";
    }
    return a;
}

function get_lastSeenDate(info) {
    const date = info.LastSeenDate;
    return date;
}


// Name quizz
function buildQizz1(S_name, C_name, info_list) {
    var a = {
        question: "Which followed animals are more endangered ? ",
        choice1: "Giant Panda",
        choice2: "Saola",
        choice3: "Thylacine",
        choice4: "Red Panda",
        answer: 2
    };
    // to hold the choices
    var b = [];
    const fools = ["colins banwson maritimum", "cumilus dromedarius", "Elephas maximus", "Ursus maritimus", "Douglas bear", "my family", "Phalia do pia"];
    if (S_name == null) {
        b.push("No name records about this animal.");
    } else {
        b.push(S_name);
    }
    for (i = 0; i < 3; i++) {
        fakename = get_science_name(chooseSpecies(info_list));
        if (fakename == null || fakename == S_name) {
            var aindex = Math.floor(Math.random() * 6);
            fakename = fools[aindex];
            b.push(fakename);
        }
        b.push(fakename);
    }
    a.question = "what is the scientific name of " + C_name;
    for (i = 0; i < 4; i++) {
        var index = Math.floor(Math.random() * (5 - i - 1));
        a["choice" + (i + 1)] = b[index];
        if (b[index] == S_name) {
            a.answer = i + 1;
        }
        b.splice(index, 1);
    }
    return a;
}
// Family Quizz
function buildQizz2(C_name, className, info_list) {
    var a = {
        question: "Which followed animals are more endangered ? ",
        choice1: "Giant Panda",
        choice2: "Saola",
        choice3: "Thylacine",
        choice4: "Red Panda",
        answer: 2
    };
    // hold choices
    var b = [];
    const fools = ["Plants", "fungi", "only in the trees", "eubacteria", "do not know", "my family", "Phalia"];
    a.question = "What is the family name of " + C_name;
    if (className == null) {
        b.push("No family records about this animal.");
    } else {
        b.push(className);
    }
    for (i = 0; i < 3; i++) {
        fakename = get_class(chooseSpecies(info_list));
        if (fakename == null || fakename == className) {
            var aindex = Math.floor(Math.random() * 6);
            fakename = fools[aindex];
            b.push(fakename);
        }
        b.push(fakename);
    }
    for (i = 0; i < 4; i++) {
        var index = Math.floor(Math.random() * (5 - i - 1));
        a["choice" + (i + 1)] = b[index];
        if (b[index] == className) {
            a.answer = i + 1;
        }
        b.splice(index, 1);
    }
    return a;
}

//environment Quizz
function buildQizz3(C_name, environment, info_list) {
    var a = {
        question: "Which followed animals are more endangered ? ",
        choice1: "Giant Panda",
        choice2: "Saola",
        choice3: "Thylacine",
        choice4: "Red Panda",
        answer: 2
    };
    // hold choices
    var b = [];
    const fools = ["underground", "only in sky", "only in the trees", "no answer is right", "only in the shallow water"];
    a.question = "What is the acceptable living environment of " + C_name;
    if (environment == null) {
        b.push("No environment records about this animal.");
    } else {
        b.push(environment);
    }
    for (i = 0; i < 3; i++) {
        fakename = get_environment(chooseSpecies(info_list));
        if (fakename == null || fakename == environment) {
            var aindex = Math.floor(Math.random() * 6);
            fakename = fools[aindex];
            b.push(fakename);
            fools.splice(aindex, 1);
        } else { b.push(fakename); }
    }
    for (i = 0; i < 4; i++) {
        var index = Math.floor(Math.random() * (5 - i - 1));
        a["choice" + (i + 1)] = b[index];
        if (b[index] == environment) {
            a.answer = i + 1;
        }
        b.splice(index, 1);
    }
    return a;
}

// last seen Date Quizz
function buildQizz4(C_name, date, info_list) {
    var a = {
        question: "Which followed animals are more endangered ? ",
        choice1: "Giant Panda",
        choice2: "Saola",
        choice3: "Thylacine",
        choice4: "Red Panda",
        answer: 2
    };
    // hold choices
    var b = [];
    a.question = "When is the last time we saw " + C_name;
    if (date == null) {
        b.push("No date records about this animal.");
    } else {
        b.push(date);
    }
    for (i = 0; i < 3; i++) {
        fakename = get_lastSeenDate(chooseSpecies(info_list));
        if (fakename == null || fakename == date) {
            fakename = "1999-03-10";
            b.push(fakename);
        }
        b.push(fakename);
    }
    for (i = 0; i < 4; i++) {
        var index = Math.floor(Math.random() * (5 - i - 1));
        a["choice" + (i + 1)] = b[index];
        if (b[index] == date) {
            a.answer = i + 1;
        }
        b.splice(index, 1);
    }
    return a;
}

// conservation quizz
function buildQizz5(C_name, conservation, info_list) {
    var a = {
        question: "Which followed animals are more endangered ? ",
        choice1: "Giant Panda",
        choice2: "Saola",
        choice3: "Thylacine",
        choice4: "Red Panda",
        answer: 2
    };
    // hold choices
    var b = [];
    const fools = ["extinct", "no answer is right", "all answers are right", "no wild " + C_name + " is living", "only in zoo we can see"];
    a.question = "What's the endangered status(NCAstatus) of " + C_name;
    if (conservation == null) {
        b.push("No status records about this animal.");
    } else {
        b.push(conservation);
    }
    for (i = 0; i < 3; i++) {
        fakename = get_conservation(chooseSpecies(info_list));
        if (fakename == null || fakename == conservation) {
            var aindex = Math.floor(Math.random() * 6);
            fakename = fools[aindex];
            b.push(fakename);
            fools.splice(aindex, 1);
        } else { b.push(fakename); }
    }
    for (i = 0; i < 4; i++) {
        var index = Math.floor(Math.random() * (5 - i - 1));
        a["choice" + (i + 1)] = b[index];
        if (b[index] == conservation) {
            a.answer = i + 1;
        }
        b.splice(index, 1);
    }
    return a;
}

//picture api part
function getMammals(data, signal) {
    var numberOfItems = data.result.records.length;

    var randAnimal = Math.floor(Math.random() * (2171 - 1897 + 1) + 1897);​
    var animalKingdom = data.result.records[randAnimal].Kingdom;
    var animalClass = data.result.records[randAnimal].Class;
    var commonName = data.result.records[randAnimal].Common_name;
    var family = data.result.records[randAnimal].Family;
    var scientificName = data.result.records[randAnimal].Scientific_name;
    var NCAStatus = data.result.records[randAnimal].NCA_status;
    var endemicity = data.result.records[randAnimal].Endemicity;

    if (signal == "SN") { return scientificName; }
    if (signal == "CN") { return commonName; }
    if (signal == "CLN") { return className; }
    if (signal == "NCA") { return NCAStatus; }

    let quizz1 = buildQizz1(scientificName, commonName, info_list);
    let quizz2 = buildQizz2(C_name, className, info_list);
    let quizz3 = buildQizz3(C_name, environment, info_list);
    let quizz4 = buildQizz4(C_name, data, info_list);
    let quizz5 = buildQizz5(C_name, conservation, info_list);​​
    //   if (animalClass==="mammals" && commonName && family && scientificName && NCAStatus && endemicity){
    //  $("#mammal-modal-body").append(
    //   $('<section class="record">').append(
    //   $('<h2>').text(commonName),
    //   $('<h3>').text(scientificName),
    //   $('<p>').text(animalClass),
    //   $('<p>').text(family),
    //   $('<p>').text(NCAStatus)
    //   )
    //   );
    //   }
}​
function getAmphibians(data) {
    var numberOfItems = data.result.records.length;

    var randAnimal = Math.floor(Math.random() * (135 - 0 + 1) + 0);​
    var animalKingdom = data.result.records[randAnimal].Kingdom;
    var animalClass = data.result.records[randAnimal].Class;
    var commonName = data.result.records[randAnimal].Common_name;
    var family = data.result.records[randAnimal].Family;
    var scientificName = data.result.records[randAnimal].Scientific_name;
    var NCAStatus = data.result.records[randAnimal].NCA_status;
    var endemicity = data.result.records[randAnimal].Endemicity;​​
    if (animalClass === "amphibians" && commonName && family && scientificName && NCAStatus && endemicity) {
        $("#amphibian-modal-body").append(
            $('<section class="record">').append(
                $('<h2>').text(commonName),
                $('<h3>').text(scientificName),
                $('<p>').text(animalClass),
                $('<p>').text(family),
                $('<p>').text(NCAStatus)
            )
        );
    }
}​
function getReptiles(data) {
    var numberOfItems = data.result.records.length;

    var randAnimal = Math.floor(Math.random() * (3082 - 2543 + 1) + 2543);​
    var animalKingdom = data.result.records[randAnimal].Kingdom;
    var animalClass = data.result.records[randAnimal].Class;
    var commonName = data.result.records[randAnimal].Common_name;
    var family = data.result.records[randAnimal].Family;
    var scientificName = data.result.records[randAnimal].Scientific_name;
    var NCAStatus = data.result.records[randAnimal].NCA_status;
    var endemicity = data.result.records[randAnimal].Endemicity;​​
    if (animalClass === "reptiles" && commonName && family && scientificName && NCAStatus && endemicity) {
        $("#reptile-modal-body").append(
            $('<section class="record">').append(
                $('<h2>').text(commonName),
                $('<h3>').text(scientificName),
                $('<p>').text(animalClass),
                $('<p>').text(family),
                $('<p>').text(NCAStatus)
            )
        );
    }
}​
function getSnails(data) {
    var numberOfItems = data.result.records.length;

    var randAnimal = Math.floor(Math.random() * (3145 - 3083 + 1) + 3083);​
    var animalKingdom = data.result.records[randAnimal].Kingdom;
    var animalClass = data.result.records[randAnimal].Class;
    var commonName = data.result.records[randAnimal].Common_name;
    var family = data.result.records[randAnimal].Family;
    var scientificName = data.result.records[randAnimal].Scientific_name;
    var NCAStatus = data.result.records[randAnimal].NCA_status;
    var endemicity = data.result.records[randAnimal].Endemicity;​​
    if (animalClass === "snails" && family && scientificName && endemicity) {
        $("#snail-modal-body").append(
            $('<section class="record">').append(
                $('<h2>').text(commonName),
                $('<h3>').text(scientificName),
                $('<p>').text(animalClass),
                $('<p>').text(family),
                $('<p>').text(NCAStatus)
            )
        );
    }
}​
function getInsects(data) {
    var numberOfItems = data.result.records.length;

    var randAnimal = Math.floor(Math.random() * (1838 - 1072 + 1) + 1072);​
    var animalKingdom = data.result.records[randAnimal].Kingdom;
    var animalClass = data.result.records[randAnimal].Class;
    var commonName = data.result.records[randAnimal].Common_name;
    var family = data.result.records[randAnimal].Family;
    var scientificName = data.result.records[randAnimal].Scientific_name;
    var NCAStatus = data.result.records[randAnimal].NCA_status;
    var endemicity = data.result.records[randAnimal].Endemicity;​​
    if (animalClass === "insects" && family && scientificName && endemicity) {
        $("#insect-modal-body").append(
            $('<section class="record">').append(
                $('<h2>').text(commonName),
                $('<h3>').text(scientificName),
                $('<p>').text(animalClass),
                $('<p>').text(family),
                $('<p>').text(NCAStatus)
            )
        );
    }
}​
function getBirds(data) {
    var numberOfItems = data.result.records.length;

    var randAnimal = Math.floor(Math.random() * (892 - 147 + 1) + 147);​
    var animalKingdom = data.result.records[randAnimal].Kingdom;
    var animalClass = data.result.records[randAnimal].Class;
    var commonName = data.result.records[randAnimal].Common_name;
    var family = data.result.records[randAnimal].Family;
    var scientificName = data.result.records[randAnimal].Scientific_name;
    var NCAStatus = data.result.records[randAnimal].NCA_status;
    var endemicity = data.result.records[randAnimal].Endemicity;​​
    if (animalClass === "birds" && family && scientificName && endemicity) {
        $("#bird-modal-body").append(
            $('<section class="record">').append(
                $('<h2>').text(commonName),
                $('<h3>').text(scientificName),
                $('<p>').text(animalClass),
                $('<p>').text(family),
                $('<p>').text(NCAStatus)
            )
        );
    }
}​
$(document).ready(function() {​
    var data = {
        resource_id: "1c8b4859-31a4-42e7-8e63-b7cf125d4321",
        limit: 3145
    }​
    $.ajax({
        url: "https://www.data.qld.gov.au/api/3/action/datastore_search",
        data: data,
        dataType: "jsonp", // We use "jsonp" to ensure AJAX works correctly locally (otherwise XSS).
        cache: true,
        success: function(data) {
            getMammals(data);
            getAmphibians(data);
            getReptiles(data);
            getSnails(data);
            getInsects(data);
            getBirds(data);​
        }
    });
});

startGame();