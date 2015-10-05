var mymap;
var DEPTH_VARIANCE_DECAY = 0.65; // higher = less variance
var CORNER_VARIANCE = 0.25;

function generateMap(width, height)
{
	mymap = new Array(MAP_WIDTH);
	for (i = 0; i < MAP_WIDTH; i++) {
		  mymap[i] = new Array(MAP_HEIGHT);
	}
	
	// ex: CORNER_VARIANCE of +-25% ->  .25 * 2 = .5  --> minus .25 is +- .25. Randomize it by 0-1, then multiply it by 128, then subtract from 128 
	mymap[0][0] = {};
	mymap[0][0].e = 116; //Math.floor(128 - 128 * ((Math.random() * CORNER_VARIANCE * 2) - CORNER_VARIANCE));
	mymap[0][0].o = guid();
	
	mymap[0][MAP_HEIGHT-1] = {};
	mymap[0][MAP_HEIGHT-1].e = 116; //Math.floor(128 - 128 * ((Math.random() * CORNER_VARIANCE * 2) - CORNER_VARIANCE));
	mymap[0][MAP_HEIGHT-1].o = guid();
	
	mymap[MAP_WIDTH-1][0] = {};
	mymap[MAP_WIDTH-1][0].e = 116; //Math.floor(128 - 128 * ((Math.random() * CORNER_VARIANCE * 2) - CORNER_VARIANCE));
	mymap[MAP_WIDTH-1][0].o = guid();
	
	mymap[MAP_WIDTH-1][MAP_HEIGHT-1] = {};
	mymap[MAP_WIDTH-1][MAP_HEIGHT-1].e = 116; //Math.floor(128 - 128 * ((Math.random() * CORNER_VARIANCE * 2) - CORNER_VARIANCE));
	mymap[MAP_WIDTH-1][MAP_HEIGHT-1].o = guid();
	
	generateMidpoints(0, 0, MAP_WIDTH-1, MAP_HEIGHT-1, 1);
	//console.log(JSON.stringify(mymap));
}

function generateMidpoints(sw_x, sw_y, ne_x, ne_y, depth)
{
//	console.log("number of total levels=" + LEVELS + " currentdepth=" + depth);
	var ne_elevation = mymap[ne_x][ne_y].e;
	var se_elevation = mymap[ne_x][sw_y].e;
	var sw_elevation = mymap[sw_x][sw_y].e;
	var nw_elevation = mymap[sw_x][ne_y].e;
//	console.log('generateMidpoint received square ' + sw_x + ', ' + sw_y + ' ' + ne_x + ', ' + ne_y);
//	console.log('with elevations ne=' + ne_elevation);
//	console.log('with elevations se=' + se_elevation);
//	console.log('with elevations sw=' + sw_elevation);
//	console.log('with elevations nw=' + nw_elevation);
	
	var newelevation = 0;  // if the span is, say, 50, generate number between 0-50 and then add the min elevation
//	console.log('*** new elevation=' + newelevation);
	var centerpointx = (ne_x - sw_x)/2 + sw_x;
	var centerpointy = (ne_y - sw_y)/2 + sw_y;
	mymap[centerpointx][centerpointy] = {};
	
	var northx = centerpointx;
	var northy = ne_y;
	mymap[northx][northy] = {};
	
	var eastx = ne_x;
	var easty = centerpointy;
	mymap[eastx][easty] = {};
	
	var southx = centerpointx;
	var southy = sw_y;
	mymap[southx][southy] = {};
	
	var westx = sw_x;
	var westy = centerpointy;
	mymap[westx][westy] = {};
	
	var color = '#ffffff';
	
//	console.log('*** north x,y=' + northx + ', ' + northy);
//	console.log('*** east x,y=' + eastx + ', ' + easty);
//	console.log('*** south x,y=' + southx + ', ' + southy);
//	console.log('*** west x,y=' + westx + ', ' + westy);
	if(depth === 1)
	{
		newelevation = 190;
		mymap[centerpointx][centerpointy].e = newelevation;
	}	
	else
	{	
		newelevation = (ne_elevation + se_elevation + sw_elevation + nw_elevation) / 4; // average of the 4 corners
		var perturbation = Math.random() * 1/(1+depth*DEPTH_VARIANCE_DECAY); // 1/1.2, 1/1.4, 1/1.6...
		if(Math.random() >= .5)
			perturbation = perturbation * -1; // half the time, flip it negative so we go below the average
//		console.log('*** perturbation=' + perturbation);
		mymap[centerpointx][centerpointy].e = Math.floor(newelevation - newelevation * perturbation); 
		mymap[centerpointx][centerpointy].o = guid();
	}
	//drawHex2(centerpointx,centerpointy);
	
	mymap[northx][northy].e = Math.floor((nw_elevation + ne_elevation) / 2); 
	mymap[northx][northy].o = guid();
	//drawHex2(northx,northy);
	
	mymap[eastx][easty].e = Math.floor((ne_elevation + se_elevation) / 2); 
	mymap[eastx][easty].o = guid();
	//drawHex2(eastx,easty);
	
	mymap[southx][southy].e = Math.floor((se_elevation + sw_elevation) / 2); 
	mymap[southx][southy].o = guid();
	//drawHex2(southx,southy);
	
	mymap[westx][westy].e = Math.floor((sw_elevation + nw_elevation) / 2); 
	mymap[westx][westy].o = guid();
	//drawHex2(westx,westy);
	
	//alert('just drew 5 points');
	
	if((ne_x - sw_x) < 3 || (ne_y - sw_y) < 3) 
	{
		// STOP CASE if width of grid is only 2 spaces, then stop. This is the last one.
	}
	else
	{
//		console.log('else recurse 4 times');
		
		generateMidpoints(sw_x, sw_y, centerpointx, centerpointy, depth+1);
		generateMidpoints(centerpointx, sw_y, ne_x, centerpointy, depth+1);
		generateMidpoints(centerpointx, centerpointy, ne_x, ne_y, depth+1);
		generateMidpoints(sw_x, centerpointy, centerpointx, ne_y, depth+1);
	}	
	return;
}