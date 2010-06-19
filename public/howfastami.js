var howFastAmI = {

	data: {
		userValue: 10,
		comparisonType: "speed",
		thingRatios: [],
		urls:
		{
			speed : "http://query.yahooapis.com/v1/public/yql?q=select%20thing%2Cvalue%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0Athg3tLfif75dFhmNlBxS0RGTlFSaUxIUFZ3ckZaNGc%26hl%3Den_GB%26single%3Dtrue%26gid%3D0%26output%3Dcsv%22%20and%20columns%3D%22thing%2Cvalue%22%20%7C%20sort(field%3D%22value%22)&format=json&diagnostics=true&callback=?"
		} 
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
			  // greater
			 // resultString += "<li>" + 1/ratios[i].ratio + howFastAmI.userMessages[comparisonType].greater + ratios[i].name + "</li>";
			  resultString += howFastAmI.getResultString(1/ratios[i].ratio, comparisonType, "greater", ratios[i].name);
			} else if (ratios[i].ratio > 1) {
				// lesser
				resultString += howFastAmI.getResultString(ratios[i].ratio, comparisonType, "lesser", ratios[i].name);
			} else {
				resultString += howFastAmI.getResultString("", comparisonType, "same", ratios[i].name);
			}
		
		}
		resultString += "</ul>";
		$("#result").html(resultString);
		
	},
	
	getResultString: function(val, comparisonType, direction, name) {
		var rounded = Math.round(val*100)/100;
		return "<li>" + rounded + howFastAmI.userMessages[comparisonType][direction] + name + "</li>";
	}
};


$(document).ready(function() {
	
	$("#how_fast_am_i_form").submit(function(){
		//var mySpeed = $("input[name=my_speed]").val();
		howFastAmI.data.userValue = $("input[name=my_speed]").val();
		howFastAmI.data.comparisonType = "speed";
		howFastAmI.data.thingRatios = []; 
		$.getJSON(howFastAmI.data.urls[howFastAmI.data.comparisonType],
			function(data){
			  var rows = data.query.results.row;
			  for (var i = 0; i < rows.length; i++){
				var currentValue = parseFloat(rows[i].value);

				howFastAmI.data.thingRatios.push({
					name: rows[i].thing,
					ratio: currentValue/howFastAmI.data.userValue
				});
			  }
			  
			  howFastAmI.initVisualisation(howFastAmI.data.comparisonType);
			}
		);
		return false;
	});
});
