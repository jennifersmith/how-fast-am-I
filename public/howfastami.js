var howFastAmI = {

	data: {
		userValue: 10,
		comparisonType: "speed",
		thingRatios: [],
		urls:
		{
			speed : 
						[
						{
							name: "animals",
							url: "http://query.yahooapis.com/v1/public/yql?q=select%20thing%2Cvalue%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0Athg3tLfif75dFhmNlBxS0RGTlFSaUxIUFZ3ckZaNGc%26hl%3Den_GB%26single%3Dtrue%26gid%3D0%26output%3Dcsv%22%20and%20columns%3D%22thing%2Cvalue%22%20%7C%20sort(field%3D%22value%22)&format=json&diagnostics=true&callback=?"
						},
						{
							name: "escapes",
							url: "home/getthings?dataset=escapes"
						}
						]
					,
			distance: [
							{
							    name: "trainlines",
							    url: "home/getthings?dataset=lines"
							}
					   ]
		} ,
		resultFinders : 
		{
			animals:  function(data) {return data.query.results.row;},
			trainlines:  function(data) {return data.results.bindings;},
			escapes:  function(data) {return data.results.bindings;}
		} ,
		nameFinders : 
		{
			animals:  function(row) { return "a " +row.thing;},
			trainlines:  function(row) {return row.name.value  + " (railway line)";},
			escapes:  function(row) {  return "the escape velocity of " + row.name.value;}
		} ,
		valueFinders : 
		{
			animals:  function(row) {return row.value;},
			trainlines:  function(row) {return row.value.value;},
			escapes:  function(row) {
				return parseFloat(row.value.value) * 1000;
				}
		}
	},

	userMessages: {
		speed: {
			greater: " times faster than ",
			lesser: " times slower than ",
			same: " EXACTLY as fast as "
		},
		storage: {
			greater: "bigger",
			lesser: "smaller",
			same: " just write "
		},
		distance: {
			greater: " times longer than the ",
			lesser: " times shorter than the ",
			same: " exactly as long as a "
		}
		
	},
	
	initVisualisation: function() {
		var html = {
            lesser: "<ul>",
            greater: "<ul>",
            same: "<ul>"
        };

        //var resultString = "<ul>";
		var ratios = howFastAmI.data.thingRatios;
		var comparisonType = howFastAmI.data.comparisonType;
		for (var i = 0; i < ratios.length; i++) {
			if (ratios[i].ratio < 1) {
			  html.greater += howFastAmI.getResultString(1/ratios[i].ratio, comparisonType, "greater", ratios[i].name);
			} else if (ratios[i].ratio > 1) {
				html.lesser += howFastAmI.getResultString(ratios[i].ratio, comparisonType, "lesser", ratios[i].name);
			} else {
				html.same += howFastAmI.getResultString("", comparisonType, "same", ratios[i].name);
			}
		}
		html.greater += "</ul>";
        html.lesser += "</ul>";
        html.same += "</ul>";


		$("#greater").html(html.greater);
        $("#lesser").html(html.lesser);
        $("#same").html(html.same);
		
	},
	
	getResultString: function(val, comparisonType, direction, name) {
		var rounded = Math.round(val*100)/100;
		return "<li>" + rounded + howFastAmI.userMessages[comparisonType][direction] + name + "</li>";
	},
	
	processUrl : function(currentUrl){
			var nameFinder = howFastAmI.data.nameFinders[currentUrl.name];
			var valueFinder = howFastAmI.data.valueFinders[currentUrl.name];
			var rowFinder = howFastAmI.data.resultFinders[currentUrl.name];
			$.getJSON(currentUrl.url,
				function(data){
				  var rows = rowFinder(data);
				  for (var i = 0; i < rows.length; i++){
					var currentValue = parseFloat(valueFinder(rows[i]));
					if(!currentValue){
						continue;
					}
					howFastAmI.data.thingRatios.push({
						name: nameFinder(rows[i]),
						ratio: currentValue/howFastAmI.data.userValue
					});
				  }
				  howFastAmI.initVisualisation();
				}
			);
	}
};


$(document).ready(function() {
	
	$("#how-fast-am-i-form").submit(function(){
		howFastAmI.data.userValue = $("input[name=comparisonValue]").val();
		howFastAmI.data.comparisonType = $("input[name=comparisonType]:checked").val();
		howFastAmI.data.thingRatios = []; // need to make non static!
		var urls = howFastAmI.data.urls[howFastAmI.data.comparisonType];
		for(var k = 0; k < urls.length; k++)
		{
			var currentUrl = urls[k];
			howFastAmI.processUrl(currentUrl);
		}
		return false;
	})
	.find("input[name=comparisonType]").click(function() {
		var $this = $(this);
		$("#how-fast-am-i-form input[name=comparisonValue]").next("span").text($this.attr("unit"));
	});
});
