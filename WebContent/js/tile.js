

$(document).ready(function(){
	var infotable = "<table style='width:100%'>";
	
	var x = 0;
	for(var row = 0; x < colors.length; row++)
	{
		infotable = infotable + "<tr>";
		for(var col = 0; col < 6; col++)
		{
			infotable = infotable + "	<td style='background-color:#" + colors[x] + ";text-align:center'>";
			infotable = infotable + "		<span style='color:white;padding-right:10px'>" + (x-128) + "</span> " + "		<span style='color:black'>" + (x-128) + "</span> "
			infotable = infotable + "	</td>"
			x++;
		}	
		infotable = infotable + "</tr>";
	}	
	
	infotable = infotable + "</table>";
	$('#colorsfromarraydiv').html(infotable);
});