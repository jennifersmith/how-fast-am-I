var howFastAmI = {

	dom: {
        greater: $("#greater ul"),
        lesser: $("#lesser ul"),
        same: $("#same ul")
    },

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
						}
						//,
						//{
						//	name: "escapes",
						//	url: "http://how-fast-am-i.heroku.com/home/getthings?dataset=escapes&callback=?"
						//}
						]
					,
			distance: [
							{
							    name: "trainlines",
							    url: "http://how-fast-am-i.heroku.com/home/getthings?dataset=lines&callback=?"
							}
					   ],
			time :[
							{
							    name: "telly",
							    url: "http://how-fast-am-i.heroku.com/home/getthings?dataset=telly&callback=?"
							},
							],
			height :[
							{
							    name: "mountains",
							    url: "http://how-fast-am-i.heroku.com/home/getthings?dataset=mountains&callback=?"
							}
			]
		} ,
		resultFinders : 
		{
			animals:  function(data) {return data.query.results.row;},
			trainlines:  function(data) {return data.results.bindings;},
			escapes:  function(data) {return data.results.bindings;},
			telly:  function(data) {return data.results.bindings;},
			mountains:  function(data) {return data.results.bindings;}
		} ,
		nameFinders : 
		{
			animals:  function(row) { return "a " +row.thing;},
			trainlines:  function(row) {return row.name.value  + " (railway line)";},
			escapes:  function(row) {  return "the escape velocity of " + row.name.value;},
			telly:  function(row) {  return "the entire runtime of " + row.name.value;},
			mountains:  function(row) {  return  row.name.value;}
		} ,
		valueFinders : 
		{
			animals:  function(row) {return row.value;},
			trainlines:  function(row) {
				return parseFloat(row.value.value) * 1000;},
			escapes:  function(row) {
				return parseFloat(row.value.value) * 1000;
				},
			telly:  function(row) {  
					return parseFloat(row.episodes.value) * parseFloat(row.runtime.value) /60/60;},
			mountains:  function(row) {  return row.value.value;}
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
			same: " exactly as long as "
		},
		time: {
			greater: " times longer than ",
			lesser: " times shorter than ",
			same: " exactly as long as "
		},
		height: {
			greater: " times taller than ",
			lesser: " times shorter than ",
			same: " exactly as high as "
		}
		
	},
	
	initVisualisation: function(clear) {
		var ratios = howFastAmI.data.thingRatios;
		var comparisonType = howFastAmI.data.comparisonType;
		var html = {
            greater: "",
            lesser: "",
            same: ""
        };
        for (var i = 0; i < ratios.length; i++) {
			if (ratios[i].ratio < 1) {
              //howFastAmI.dom.greater.append(howFastAmI.getResultString(1/ratios[i].ratio, comparisonType, "greater", ratios[i].name));
               html.greater += howFastAmI.getResultString(1/ratios[i].ratio, comparisonType, "greater", ratios[i].name, ratios[i].link);
			} else if (ratios[i].ratio > 1) {
                //howFastAmI.dom.lesser.append(howFastAmI.getResultString(ratios[i].ratio, comparisonType, "lesser", ratios[i].name));
                html.lesser += howFastAmI.getResultString(ratios[i].ratio, comparisonType, "lesser", ratios[i].name, ratios[i].link);
			} else {
                //howFastAmI.dom.same.append(howFastAmI.getResultString("", comparisonType, "same", ratios[i].name));
                html.same += howFastAmI.getResultString("", comparisonType, "same", ratios[i].name, ratios[i].link);
			}
		}

        howFastAmI.dom.greater.html(html.greater);
        howFastAmI.dom.lesser.html(html.lesser);
        howFastAmI.dom.same.html(html.same);

        howFastAmI.renderRandomResult();

	},

    renderRandomResult: function() {
        var comparators = ["greater", "lesser"];
        var comparator = comparators[rand(2)-1];
        var $results = howFastAmI.dom[comparator];
        var numberOfResults = $results.find("li").length;
        if (numberOfResults === 0) {
            return;
        }

        var resultToDisplay = $results.find("li").eq(rand(numberOfResults) - 1).html();
        $("#loading").slideUp(function() {
            $("#single-result").html("<p>" + resultToDisplay + "</p>").fadeIn();
        });


    },

	getResultString: function(val, comparisonType, direction, name, link) {
		var rounded = Math.round(val*100)/100;
		namedisp = name;
		if(link){
			namedisp = "<a href='" + link + "' target='stuff'>" + namedisp + "</a>";
		}
		return "<li>" + rounded + howFastAmI.userMessages[comparisonType][direction] + namedisp + "</li>";
	},

	processUrl : function(urls, index){
			currentUrl = urls[index];
			if(currentUrl==null){
				  howFastAmI.initVisualisation();
				  return;
			}
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
					var link = "";
					if(rows[i].page){
						link = rows[i].page.value;
					}
					howFastAmI.data.thingRatios.push({
						name: nameFinder(rows[i]),
						link: link,
						ratio: currentValue/howFastAmI.data.userValue
					});
				  }
				  howFastAmI.processUrl(urls,index+1);
				}
			);
	}
};


$(document).ready(function() {
	
	$("#how-fast-am-i-form").submit(function(){
		$("#loading").slideDown();
        howFastAmI.data.userValue = $("input[name=comparisonValue]").val();
		howFastAmI.data.comparisonType = $("input[name=comparisonType]:checked").val();

        // set up
        $("#single-result").fadeOut();
        howFastAmI.data.thingRatios = []; // need to make non static!
        howFastAmI.dom.greater.add(howFastAmI.dom.lesser).add(howFastAmI.dom.same).empty();

		var urls = howFastAmI.data.urls[howFastAmI.data.comparisonType];
		
		howFastAmI.processUrl(urls, 0);
		return false;
	})
	.find("input[name=comparisonType]").click(function() {
		var $this = $(this);
		$("#how-fast-am-i-form input[name=comparisonValue]").next("span").text($this.attr("unit"));
	});
});
