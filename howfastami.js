tempUrl = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%20%3D%20%22https%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0Athg3tLfif75dFhmNlBxS0RGTlFSaUxIUFZ3ckZaNGc%26hl%3Den_GB%26single%3Dtrue%26gid%3D0%26output%3Dcsv%22%20and%20columns%3D%22thing%2Cspeed%22%20&format=json&diagnostics=true&callback=?";


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
$(document).ready(function() {
	
	$("#how_fast_am_i_form").submit(function(){
		var mySpeed = $("input[name=my_speed]").val();
		$.getJSON(tempUrl,
        function(data){
          var rows = data.query.results.row;
          var resultString = "";
          for (var i = 0; i < rows.length; i++){
            var currentSpeed = parseFloat(rows[i].speed);
          	resultString += "<li>You are " + getComparison(mySpeed, currentSpeed) + rows[i].thing + "</li>";
          	
          }
          $("#result").html(resultString);
        });
		return false;
	});
});
