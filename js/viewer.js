var allData = []
var singleResult = {}
var activationList = {}
var studentInfo = {}
var regNo;
var examId;

$('#registration-number').keypress("keypress", function (e) {
	if (e.which == 13) {
		calculate();
	}
})

$("#calculate-button").click(function () {
	calculate();
});

var calculate = async () => {

	regNo = $("#registration-number").val();
	regNo = await getRegNo(regNo);

	examId = $("#exam-id option:selected").val();

	if (regNo && examId != "non") {

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
				console.log(err);
				alert('Registration number or name not found. Try clearing cache or using incognito window if this error persists.');
			})

	} else {
		alert('Please fill the form')
	}
}

// Function to get reg no from name if given

var getRegNo = async (input) => {

	return new Promise((resolve, reject) => {

		$.getJSON('results/studentInfo.json')
		.then((res) => {
			if(input in res){
				return resolve(input);
			}else{
				var keys = Object.keys(res);
				for(var i=0;i<keys.length;i++){
					var name = res[keys[i]].name;
					input = input.toLowerCase();
					if(name.toLowerCase().includes(input)){
						return resolve(keys[i]);
					}
				}
				return resolve(input);
			}
		})
		.catch((err) => {
			// Hide
			return reject(err);
		})

	});


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
	for (var i = 0; i < subs.length; i++) {
		activationList[subs[i]] = true;
	}
}

// Update result table
var updateTable = (regNo) => {
	return new Promise((resolve, reject) => {

		markup = '';

		if (!singleResult) {
			return reject('Registration number or name not found. Try clearing cache or using incognito window if this error persists.');
		}
		subs = Object.keys(singleResult);
		createMarkup(markup, singleResult, subs, 0)
			.then((markup) => {
				// Show student info
				showStudentInfo(regNo);
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

// Show student info

var showStudentInfo = async (regNo) => {

	$.getJSON('results/studentInfo.json')
		.then((res) => {
			if (res[regNo]) {
				// Update
				$('#student-name').html(`${res[regNo].name} (${[regNo]})`);
				$('#student-course').html(res[regNo].prog)
				// Show
				$('.student-info-container').show();
				$('#student-info').addClass('first-container');
				$('#result').addClass('second-container');
				$('.grade-container').removeClass('first-container');
			} else {
				// Hide
				$('.student-info-container').hide();
				$('#result').addClass('first-container');
				$('#student-info').addClass('second-container');
				$('.student-info-container').removeClass('first-container');
			}
		})
		.catch((err) => {
			// Hide


			return reject(err);
		})

}

// Activate / disable  subjects while calculating gpa
var toggleActivation = (sid) => {
	activationList[sid] = !activationList[sid];
	if (regNo && examId != "non") {

		updateTable(regNo)
			.then(() => {
				return calculateGpa(regNo);
			})
			.then((gpa) => {
				$("#show-gpa").html('GPA : ' + gpa);
				subs = Object.keys(activationList);
				for (var i = 0; i < subs.length; i++) {
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

	} else {
		alert('Please fill the form')
	}

}

// Create markup of rows
var createMarkup = (markup, result, subs, counter) => {
	return new Promise((resolve, reject) => {
		var key = subs[counter];
		if (counter < subs.length) {
			var subjectId = subs[counter];
			var subjectGrade = result[subs[counter]];

			if (!key.includes('_INT') && !key.includes('_EXT') && !key.includes('_TOT')) {

				var subjectName = allData['subjects'][subs[counter]]['name'];
				var internalMarks = result[subs[counter] + '_INT'];
				var externalMarks = result[subs[counter] + '_EXT'];
				var totalMarks = result[subs[counter] + '_TOT'];

				if (internalMarks && externalMarks && totalMarks) {
					var marks = `<span class="badge badge-secondary marks-badge">I: ${internalMarks}</span> \
					<span class="badge badge-secondary marks-badge">E: ${externalMarks}</span> \
					<span class="badge badge-secondary marks-badge">T: ${totalMarks}</span>`;
				} else {
					marks = '';
				}

				markup += `<tr>
					<td>
						<label class="checkbox-container">
							<input type="checkbox" checked="true" id="${subjectId}" onchange="toggleActivation('${subjectId}')">
							<span class="checkmark"></span>
						</label>
					</td>
					<td>
						<div class="subject-title">${subjectName}</div>
						${marks}
                    </td>
                    <td>
                        <div class="subject-grade">${subjectGrade}</div>
                    </td>
                </tr>`;
			}
			return resolve(createMarkup(markup, result, subs, counter + 1))
		} else {
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
		for (var i = 0; i < subs.length; i++) {
			var key = subs[i];
			if (activationList[subs[i]] && !key.includes('_INT') && !key.includes('_EXT') && !key.includes('_TOT')) {
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
	if (grade == 'S')
		return 10;
	else if (grade == 'A')
		return 9;
	else if (grade == 'B')
		return 8;
	else if (grade == 'C')
		return 7;
	else if (grade == 'D')
		return 6;
	else if (grade == 'E')
		return 5;
	else
		return 0;
}

var goBack = () => {
	window.history.back();
}