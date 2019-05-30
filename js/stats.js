'use strict';

var examId;
var subjectCode;

$(() => {
    loadSubjects();
});

$('#exam-id').change(() => {
    loadSubjects();
});

$('#submit-button').click(() => {

    examId = $('#exam-id').val();
    if(!examId || examId == 'non'){
        alert('Please select examination');
        return;
    }

    subjectCode = $('#subject-code').val();
    if(!subjectCode || subjectCode == 'non'){
        alert('Please select subject');
        return;
    }

    displayStats();

});

/* Function to display stats */

var displayStats = () => {

    $.getJSON('results/' + examId + '.json')
        .then((res) => {

            if(!res.subjects[subjectCode]){
                alert('Subject not present in the selected exam. Please try again.');
                return;
            }

            res = res.results;
            var preparedData = prepareData(res);
            createGraph(preparedData);
            displayData(preparedData);
        })
        .catch((err) => {
            console.log(err);
    
        })
}


/* Function to prepare data for graph */

var prepareData = (res) => {

    var allResults = []
    var regs = Object.keys(res);
    for (var i = 0; i < regs.length; i++) {
        var result = res[regs[i]];
        if (result[subjectCode]) {
            allResults.push(result[subjectCode]);
        }
    }

    allResults = countGrades(allResults);
    return allResults;

}

/* Function to count grades */

var countGrades = (grades) => {

    var count = {};

    grades = grades.sort();

    for (var i = 0; i < grades.length; i++) {
        var grade = grades[i];
        if (!count[grade]) {
            count[grade] = 1;
        } else {
            count[grade] += 1;
        }
    }

    var aGrade = count['A'];
    var bGrade = count['B'];
    var cGrade = count['C'];
    var dGrade = count['D'];
    var eGrade = count['E'];
    var fGrade = count['F'];
    var gGrade = count['H'];
    var hGrade = count['I'];
    var iGrade = count['J'];
    var sGrade = count['S'];
    var mpGrade = count['MP'];
    var dtGrade = count['DT'];
    var passGrade = count['PASS'];

    count = {};

    if(sGrade) count['S'] = sGrade;
    if(aGrade) count['A'] = aGrade;
    if(bGrade) count['B'] = bGrade;
    if(cGrade) count['C'] = cGrade;
    if(dGrade) count['D'] = dGrade;
    if(eGrade) count['E'] = eGrade;
    if(fGrade) count['F'] = fGrade;
    if(gGrade) count['G'] = gGrade;
    if(hGrade) count['H'] = hGrade;
    if(iGrade) count['I'] = iGrade;
    if(mpGrade) count['MP'] = mpGrade;
    if(dtGrade) count['DT'] = dtGrade;
    if(passGrade) count['PASS'] = passGrade;

    return count;

}

/* Function to create and display graph */

var createGraph = (preparedData) => {

    var grades = Object.keys(preparedData);
    var count = [];
    for(var i=0;i<grades.length;i++)
        count.push(preparedData[grades[i]]);

    var ctx = document.getElementById('myChart').getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: grades,
            datasets: [{
                label: '# of students',
                data: count,
                borderWidth: 2,
                backgroundColor: 'rgba(63, 106, 230, 0.7)',
				borderColor: 'black',
                fill: true
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

/* Function to display function */

var displayData = (preparedData) => {

    var grades = Object.keys(preparedData);

    var markup = ``;
    for(var i=0;i<grades.length;i++){
        markup += `<tr><td>${grades[i]}</td><td>${preparedData[grades[i]]}</td></tr>`;
    }
    $('#stats-data-table tbody').html(markup);

    $('.first-container').show();
    $('.second-container').show();

}

/* Function to go back in history (WARNING: not a time machine :p)*/

var goBack = () => {
	window.history.back();
}

/* Function to load subjects in dropdown */

var loadSubjects = () => {

    showLoader();

    examId = $('#exam-id').val();
    $.getJSON('results/' + examId + '.json')
    .then((res) => {

        var orig = res;
        res = res.subjects;
        var subjects = Object.keys(res);
        
        var markup = ``;
        markup += '<option value="non">Select subject</option>';
        for(var i=0;i<subjects.length;i++){
            var subjectId = subjects[i];
            if(orig.subjects[subjectId])
                markup += `<option value="${subjects[i]}">${subjects[i]} - ${res[subjects[i]].name}</option>`
        }

        $('#subject-code').html(markup);

        hideLoader();

    })
    .catch((err) => {
        console.log(err);

    })

}

var showLoader = () => {
    $('.loader').css('display', 'flex');
}

var hideLoader = () => {
    $('.loader').css('display', 'none');
}