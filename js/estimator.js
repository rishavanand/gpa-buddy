var goBack = () => {
    window.history.back();
}

const startUpdate = () => {
    var totalCredits = 0.0;
    var totalPoints = 0.0;
    var selects = document.getElementsByClassName('grade');
    for (let i=0;i<selects.length;i++) {
        point = selects[i].value;
        if (point != -1) {
            credit = document.getElementById('credit' + (i+1)).value;
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
}

$('.grade').on('change', startUpdate);
$('.credit').on('change', startUpdate);

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