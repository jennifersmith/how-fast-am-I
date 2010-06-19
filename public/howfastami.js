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
		userSpeed: 10,
		thingRatios: [],
		url: "http://query.yahooapis.com/v1/public/yql?q=select%20thing%2Cspeed%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0Athg3tLfif75dFhmNlBxS0RGTlFSaUxIUFZ3ckZaNGc%26hl%3Den_GB%26single%3Dtrue%26gid%3D0%26output%3Dcsv%22%20and%20columns%3D%22thing%2Cspeed%22%20%7C%20sort(field%3D%22speed%22)&format=json&callback=howFastAmI.mungeData"
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
	
	getComparison: function (currentSpeed) {
		var mySpeed = howFastAmI.data.userSpeed;
		var ratio = currentSpeed/mySpeed;
		
		if(currentSpeed > mySpeed){
			return currentSpeed/mySpeed + howFastAmI.userMessages.slower;
		}
		else if(ratio==1){
			return howFastAmI.userMessages.exactly;
		}
		return mySpeed/currentSpeed + howFastAmI.userMessages.faster;
	},
	
	getResultHtml: function(currentSpeed, nameOfThing) {
		return "<li>You are " + howFastAmI.getComparison(currentSpeed) + nameOfThing + "</li>";
	},
	
	mungeData: function(data) {
		console.log("muinged");
		return false;
	}
	
};


$(document).ready(function() {
	
	$("#how_fast_am_i_form").submit(function(){
		//var mySpeed = $("input[name=my_speed]").val();
		howFastAmI.data.userSpeed = $("input[name=my_speed]").val();
		
		$.getJSON(howFastAmI.data.url,
			function(data){
			  var rows = data.query.results.row;
			  var resultString = "";
			  for (var i = 0; i < rows.length; i++){
				var currentSpeed = parseFloat(rows[i].speed);

				howFastAmI.data.thingRatios.push({
					name: rows[i].thing,
					ratio: currentSpeed/howFastAmI.data.userSpeed
				});
				//resultString += howFastAmI.getResultHtml(currentSpeed, rows[i].thing);
				//resultString += "<li>You are " + howFastAmI.getComparison(currentSpeed) + rows[i].thing + "</li>";
			  }
			  howFastAmI.initVisualisation();
			  
			  //console.info(howFastAmI.data.thingRatios);
			  //$("#result").html(resultString);
			}
		);
		return false;
	});
});
