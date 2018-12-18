var goBack = () => {
    window.history.back();
}

$('select').on('change', () => {
    var totalCredits = 0.0;
    var totalPoints = 0.0;
    var selects = document.getElementsByTagName('select');
    for (var i in [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
        point = selects[i].options[selects[i].selectedIndex].value;
        if (point != -1) {
            credit = selects[i].getAttribute('credit');
            floatedCredit = parseFloat(credit);
            floatedPoint = parseFloat(point);
            totalPoints += (floatedPoint * floatedCredit);
            totalCredits += floatedCredit;
        }
    }
    var gpa = totalPoints / totalCredits;
    roundedGpa = gpa.toFixed(2);
    updateGpa(roundedGpa);
    updateMessage(roundedGpa);
});

var updateGpa = (gpa) => {
    var previousGpa = document.getElementById("gpa-header-display").innerHTML;
    var demo = { score: parseFloat(previousGpa) };
    scoreDisplay = document.getElementById("gpa-header-display");
    var tween = TweenLite.to(demo, 1, { score: gpa, onUpdate: showScore })

    function showScore() {
        scoreDisplay.innerHTML = demo.score.toFixed(2);
    }
}

var getMessage = (gpa) => {
    if (gpa >= 10)
        return "Ultra ultra legend 🤯"
    else if (gpa >= 9)
        return "Ultra legend 🙏"
    else if (gpa >= 8)
        return "Legend 🤘"
    else if (gpa >= 7)
        return "Not bad 😎"
    else if (gpa >= 6)
        return "Needs more work 😅"
    else if (gpa >= 5)
        return "Must be good at something else 🏀"
    else
        return "Tumse na ho payega 😂"
}

var updateMessage = (gpa) => {
    msg = getMessage(gpa);
    $('#gpa-message').text(msg);
}