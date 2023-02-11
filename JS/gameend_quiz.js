const lastScore = document.getElementById("show");
const scoreTitil = document.getElementById("title");
const button = document.getElementById("showButton");


oneValues = () => {
    var result = 'sdsds';
    var url = location.search;
    console.log(url.substring(url.indexOf("=") + 1));
    if (url.indexOf("?") != null) {
        result = url.substring(url.indexOf("=") + 1);
    };

    lastScore.innerText = result + ' ' + "scores";
    scoreTitil.innerText = "Your score is: \n ";
    button.remove();

};

returnToQuizz = () => {
    location.href = "/HTML/html_quiz.html";
}

returnToHomepage = () => {
    location.href = "index_quiz.html"
}