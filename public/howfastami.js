var howFastAmI = {

	data: {
		userValue: 10,
		comparisonType: "speed",
		thingRatios: [],
		urls:
		{
			speed : "http://query.yahooapis.com/v1/public/yql?q=select%20thing%2Cvalue%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0Athg3tLfif75dFhmNlBxS0RGTlFSaUxIUFZ3ckZaNGc%26hl%3Den_GB%26single%3Dtrue%26gid%3D0%26output%3Dcsv%22%20and%20columns%3D%22thing%2Cvalue%22%20%7C%20sort(field%3D%22value%22)&format=json&diagnostics=true&callback=?",
			storage: "",
			distance: ""
		} 
	},

	userMessages: {
		speed: {
			greater: " times faster than a ",
			lesser: " times slower than a ",
			same: " EXACTLY as fast as a "
		},
		storage: {
			greater: "bigger",
			lesser: "smaller",
			same: " just write "
		},
		distance: {
			greater: "",
			lesser: "",
			same: ""
		}
		
	},
	
	initVisualisation: function() {
		var resultString = "<ul>";
		var ratios = howFastAmI.data.thingRatios;
		var comparisonType = howFastAmI.data.comparisonType;
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
		return "<li>" + val + howFastAmI.userMessages[comparisonType][direction] + name + "</li>";
	}
};


$(document).ready(function() {
	
	$("#how-fast-am-i-form").submit(function(){
		howFastAmI.data.userValue = $("input[name=comparisonValue]").val();
		howFastAmI.data.comparisonType = $("input[name=comparisonType]:checked").val();
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
			  
			  howFastAmI.initVisualisation();
			}
		);
		return false;
	})
	.find("input[name=comparisonType]").click(function() {
		var $this = $(this);
		$("#how-fast-am-i-form input[name=comparisonValue]").next("span").text($this.attr("unit"));
	});
});
