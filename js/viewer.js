var allData = []
var singleResult = {}
var activationList = {}
var regNo;
var examId;

$('#registration-number').keypress("keypress", function(e) {
    if (e.which == 13) {
    	calculate();
    }
})

$("#calculate-button").click(function(){
	calculate();
});

var calculate = () => {
	regNo = $("#registration-number").val();
	examId = $("#exam-id option:selected").val();

	if(regNo && examId != "non"){

		getResult(examId)
		.then(() => {
			return updateTable(regNo);
		})
		.then(() => {
			return calculateGpa(regNo);
		})
		.then((gpa) => {
			$("#show-gpa").html('GPA : ' + gpa);
		})
		.catch((err) => {
			alert('Registration number not found');
		})

	}else{
		alert('Please fill the form')
	}
}

// Fetch result from json file
var getResult = (examId) => {
	return new Promise((resolve, reject) => {
		// Show loader
		$('.loader').css('display', 'flex');
		$.getJSON('results/' + examId + '.json')
		.then((res) => {
			allData = res;
			singleResult = allData.results[regNo];
			createActivationList();
			return resolve();
		})
		.catch((err) => {
			return reject(err);
		})
		.then(() => {
			// Remove loader
			$('.loader').css('display', 'none');
		})
	});
}


// Initialize all subject activations to true
var createActivationList = () => {
	activationList = {};
	var result = singleResult;
	var subs = Object.keys(result);
	for(var i=0;i<subs.length;i++){
		activationList[subs[i]] = true;
	}
}

// Update result table
var updateTable = (regNo) => {
	return new Promise((resolve, reject) => {

		markup = '';
		if(!singleResult)
			return reject('Registration number not found');
		subs = Object.keys(singleResult);
		createMarkup(markup, singleResult, subs, 0)
		.then((markup) => {
			// Clear table
			$('#subject-table tbody').html('');
			// Update table
			$('#subject-table tbody').append(markup);
			// Show table
			$('#result').show();
			return resolve();
		})
		.catch((err) => {
			return reject(err);
		});

	});
}

// Activate / disable  subjects while calculating gpa
var toggleActivation = (sid) => {
	activationList[sid] = !activationList[sid];
	if(regNo && examId != "non"){

		updateTable(regNo)
		.then(() => {
			return calculateGpa(regNo);
		})
		.then((gpa) => {
			$("#show-gpa").html('GPA : ' + gpa);
			subs = Object.keys(activationList);
			for(var i=0;i<subs.length;i++){	
				var checkBox = $('#' + subs[i]);
				checkBox.prop('checked', activationList[subs[i]]);
			}
			
			// Alert and scroll to gpa section
			alert('Your GPA has been updated.');
			$('html, body').animate({
		        scrollTop: $("#show-gpa").offset().top
		    }, 500);
		})
		.catch((err) => {
			alert(err);
		})

	}else{
		alert('Please fill the form')
	}

}

// Create markup of rows
var createMarkup = (markup, result, subs, counter) => {
	return new Promise((resolve, reject) => {
		if(counter < subs.length){
			var subjectId = subs[counter];
			var subjectGrade = result[subs[counter]];
			var subjectName = allData['subjects'][subs[counter]]['name'];
			markup += `<tr>
					<td>
						<label class="checkbox-container">
							<input type="checkbox" checked="true" id="${subjectId}" onchange="toggleActivation('${subjectId}')">
							<span class="checkmark"></span>
						</label>
					</td>
					<td>
                        <div class="subject-title">${subjectName}</div>
                    </td>
                    <td>
                        <div class="subject-grade">${subjectGrade}</div>
                    </td>
                </tr>`;
			return resolve(createMarkup(markup, result, subs, counter+1))
		}else{
			return resolve(markup);
		}
	});
}

// Calculate GPA
var calculateGpa = (regNo) => {
	return new Promise((resolve, reject) => {
		var result = singleResult;
		var subs = Object.keys(result);
		var totalCredit = 0.0;
		var pointSum = 0.0;
		for(var i=0; i<subs.length; i++){
			if(activationList[subs[i]]){

			var subjectGrade = result[subs[i]];
			var subjectCredit = allData['subjects'][subs[i]]['credit'];
			pointSum += (gradeToPoint(subjectGrade) * subjectCredit);
			totalCredit += subjectCredit;
			}
		}
		var gpa = pointSum / totalCredit
		gpa = Math.round((gpa) * 100) / 100
		return resolve(gpa);
	});
}

// Convert grade to point
var gradeToPoint = (grade) => {
	if(grade == 'S')
		return 10;
	else if(grade == 'A')
		return 9;
	else if(grade == 'B')
		return 8;
	else if(grade == 'C')
		return 7;
	else if(grade == 'D')
		return 6;
	else if(grade == 'E')
		return 5;
	else
		return 0;
}

var goBack = () => {
    window.history.back();
}