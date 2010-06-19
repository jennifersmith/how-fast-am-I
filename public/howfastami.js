tempUrl = "http://query.yahooapis.com/v1/public/yql?q=select%20thing%2Cspeed%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0Athg3tLfif75dFhmNlBxS0RGTlFSaUxIUFZ3ckZaNGc%26hl%3Den_GB%26single%3Dtrue%26gid%3D0%26output%3Dcsv%22%20and%20columns%3D%22thing%2Cspeed%22%20%7C%20sort(field%3D%22speed%22)&format=json&callback=?";

/*
function getComparison(mySpeed, currentSpeed){
	var ratio = currentSpeed/mySpeed;
	if(currentSpeed > mySpeed){
		return currentSpeed/mySpeed + " times slower than a ";
	}
	else if(ratio==1){
		return " EXACTLY as fast as a ";
	}
	return mySpeed/currentSpeed + " times faster than a ";
}
*/
var howFastAmI = {

	data: {
		userValue: 10,
		thingRatios: [],
		url: "http://query.yahooapis.com/v1/public/yql?q=select%20thing%2Cspeed%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0Athg3tLfif75dFhmNlBxS0RGTlFSaUxIUFZ3ckZaNGc%26hl%3Den_GB%26single%3Dtrue%26gid%3D0%26output%3Dcsv%22%20and%20columns%3D%22thing%2Cspeed%22%20%7C%20sort(field%3D%22speed%22)&format=json&callback=?"
	},

	userMessages: {
		speed: {
			greater: " times faster than a ",
			lesser: " times slower than a ",
			same: " EXACTLY as fast as a "
		},
		storage: {
			greater: "",
			lesser: "",
			same: ""
		}
		
	},
	
	initVisualisation: function(comparisonType) {
		var resultString = "<ul>";
		var ratios = howFastAmI.data.thingRatios;
		for (var i = 0; i < ratios.length; i++) {
			if (ratios[i].ratio < 1) {
			  // lesser
			  resultString += "<li>" + howFastAmI.userMessages[comparisonType].lesser + ratios[i].name + "</li>";
			  
			} else if (ratios[i].ratio > 1) {
				// greater
			} else {
				
			}
		
		}
		resultString += "</ul>";
		$("#result").html(resultString);
		
	}
};


$(document).ready(function() {
	
	$("#how_fast_am_i_form").submit(function(){
		//var mySpeed = $("input[name=my_speed]").val();
		howFastAmI.data.userValue = $("input[name=my_speed]").val();

		$.getJSON(howFastAmI.data.url,
			function(data){
			  var rows = data.query.results.row;
			  for (var i = 0; i < rows.length; i++){
				var currentValue = parseFloat(rows[i].speed);

				howFastAmI.data.thingRatios.push({
					name: rows[i].thing,
					ratio: currentValue/howFastAmI.data.userValue
				});
			  }
			  
			  howFastAmI.initVisualisation("speed");
			}
		);
		return false;
	});
});
