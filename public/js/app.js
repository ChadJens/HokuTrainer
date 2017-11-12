// Initialize Firebase
var config = {
    apiKey: "AIzaSyB3qG3NMRYLUbwmEhj5qO-whasQGBkef4U",
    authDomain: "hoku-trainer.firebaseapp.com",
    databaseURL: "https://hoku-trainer.firebaseio.com",
    projectId: "hoku-trainer",
    storageBucket: "hoku-trainer.appspot.com",
    messagingSenderId: "522971976849"
  };
 firebase.initializeApp(config);

let runAppReference = firebase.database();
let latLon = [];

// Get location data
let getLocation = function() {
	if(navigator.geolocation) {
  	navigator.geolocation.getCurrentPosition(function(position) {
  		let lat = position.coords.latitude;
  		let lon = position.coords.longitude;
  		latLon.push(lat);
  		latLon.push(lon);
    });
  };
}();

$(document).ready(function() {
	// Onclick, add to firebase database
  $('#addRunBtn').on('click', function grabInputs(event) {
  	event.preventDefault();
	  console.log('inside grabInputs ' + latLon);
	  // Q: How would I set this up as a promise with getWeather?
	  let runDate = $('#runDate').val();
	  let runDistance = $('#runDistance').val();
	  let runTime = $('#runTime').val();
	  let runPace = (runTime / runDistance).toFixed(1);
	  $('#runDate').val('');
	  $('#runDistance').val('');
	  $('#runTime').val('');
	  let runWeather = getWeather(latLon);
	  let runReference = runAppReference.ref('runs');
    setTimeout(function() {
    	let runTemp = runWeather[0];
	    let runHumid = runWeather[1];
	    runReference.push({
	  	  runDate: runDate,
	  	  runDistance: runDistance,
	  	  runPace: runPace,
	  	  rR: Math.floor(Math.random()*100)+155,
	  	  rG: Math.floor(Math.random()*100)+155,
	  	  rB: Math.floor(Math.random()*100)+155,
	  	  runTemp: runTemp,
	  	  runHumid: runHumid
	    })
	  }, 1000)
  });
  // On DOM ready, load page with database content
  runBoard.displayRuns();
});

// Get weather data
let getWeather = function(latLon) {
	console.log('latLon is ' + latLon);
	let weatherUnUrl = 'https://accesscontrolalloworiginall.herokuapp.com/http://api.weatherunlocked.com/api/current/' + latLon[0] + ',' + latLon[1];
  let weatherUnAppId = '2de6b603';
  let weatherUnApiKey = '5ec1411fdfce5111e583d28f5de69981';
  let getUrl = weatherUnUrl + '?app_id=' + weatherUnAppId + '&app_key=' + weatherUnApiKey;
	let weather = [];
	$.get(getUrl, function(response) {
		console.log(response);
		let runTemp = response.temp_f.toFixed(0);
		let runHumid = response.humid_pct;
		weather.push(runTemp);
		weather.push(runHumid);
	});
	setTimeout(function() {
		console.log('weather is ' + weather);
	}, 1000);
	return weather
};

// Display runs
let runBoard = function() {
  function getPosts() {
    runAppReference.ref('runs').on('value', function (results) {
      let $runBoard = $('.listRun');
      let runs = [];
      let totalDistance = 0;

      let allRuns = results.val();
      for (let i in allRuns) {
        let runDate = allRuns[i].runDate;
        let runDistance = allRuns[i].runDistance;
        let runPace = allRuns[i].runPace;
        let rR = allRuns[i].rR;
        let rG = allRuns[i].rG;
        let rB = allRuns[i].rB;
        let runTemp = allRuns[i].runTemp;
        let runHumid = allRuns[i].runHumid;
        totalDistance = totalDistance + Number(runDistance);

        let newRun = createRun(runDate, runDistance, runPace, rR, rG, rB, runTemp, runHumid, i);
        runs.push(newRun);

      };

      $runBoard.empty();
      for (let k in runs) {
        $runBoard.append(runs[k]);
      };
      $('#totalMiles').html(totalDistance);
      $('#totalLegs').html((totalDistance / 5).toFixed(1));
      let hiTemp = getWeather([21.44,-158]);
      setTimeout(function() {
      	$('#hiTemp').html(hiTemp[0]);
      }, 3000);
    });
  };

/*
Why did I need to put this in the index file?
Why doesn't it work similar to Class 16, exercise 1?

  function deleteRun(id) {
    console.log('delete run ran');
    let runReference = runAppReference.ref('runs').child(id);
    runReference.remove();
  };
  */

  return {
    displayRuns: getPosts
  }
}();


function createRun(runDate, runDistance, runPace, rR, rG, rB, runTemp, runHumid, i) {
  let $newRun = $('<div>');
  $newRun.addClass('listRun').attr('data-id',i);
  let $runFtImg = $('<section>');
  $runFtImg.addClass('featuredImage').attr('style','background-color: rgb('+rR+','+rG+','+rB+')');
  let $runImg = $('<img>');
  $runImg.attr('src','images/test.png');
  let $runContent = $('<section>');
  $runContent.addClass('runContent');
  let $runTitle = $('<h3>');
  $runTitle.html(runDistance + ' Mile Run<br>');
  let $runDate = $('<h6>');
  $runDate.html(runDate + ' // ');
  let $runPace = $('<h6>');
  $runPace.html(runPace + 'min/mi pace // ');
  let $runTemp = $('<h6>');
  $runTemp.html(runTemp + '°F // ');
  let $runHumid = $('<h6>');
  $runHumid.html(runHumid + ' humidity');
  let $runBreak = $('<h6>');
  let $clearfix = $('<div>');
  $clearfix.addClass('clearfix');
  let $deleteElement = $('<i class="fa fa-trash pull-right delete"></i>');
  $deleteElement.on('click', function (e) {
    console.log(e);
    console.log(e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
    let id = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.attributes[1].nodeValue;
    deleteRun(id);
  });


  //$runTemp.append($runBreak);
  $runHumid.append($deleteElement);
  $runTemp.append($runHumid);
  //$runPace.append($runBreak);
  $runPace.append($runTemp);
  //$runDate.append($runBreak);
  $runDate.append($runPace);
  $runTitle.append($runDate);
  $runContent.append($runTitle);
  $runFtImg.append($runImg);
  $newRun.append($runFtImg);
  $newRun.append($runContent);
  $newRun.append($clearfix);



  ;
  return $newRun;  
};

/*
Would there be any way to include the onclick event in a template literal?

function createRun(runDate, runDistance, runPace, rR, rG, rB, runTemp, runHumid, i) {
	let newRun = `
	  <div class="listRun">
      <section class="featuredImage" style="background-color: rgb(${rR}, ${rG}, ${rB})" data-id=${i}>
        <img src="images/test.png" alt="shoe"/>
      </section>
      <section class="runContent">
        <h3>${runDistance} Mile Run<i onclick="deleteRun(e)" class="fa fa-trash pull-right delete"></i></h3>
        <h6>${runDate}</h6><h6>/</h6><h6>${runPace} min/mi pace</h6><h6>/</h6><h6>${runTemp}°F</h6><h6>/</h6><h6>${runHumid}% humidity</h6>
      </section>
      <div class="clearfix"></div>
    </div>
	`;
	return newRun;	
};
*/

/* TO DO
- Add update
- Setup promises instead of setTimeout

FUTURE
- Add background Hawaii photo
- Add countdown until race (just days, called on initial load)
- Add user accounts
- Training competition

KNOWN FLAWS
- Grabs current weather, not date entered (historical data required upgrade account)
- Line breaks can be awkward
*/


