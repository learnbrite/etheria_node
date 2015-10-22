var size = 10; // length of one tile segment
var EXTRUSION_FACTOR = size/75;

var tileheight = size * 2;
var tilevert = tileheight * 3/4;
var tilewidth = Math.sqrt(3)/2 * tileheight;
var blocksize = size/100; // length of one block segment
var blockheight = blocksize * 2;
var blockvert = blockheight * 3/4;
var blockwidth = Math.sqrt(3)/2 * blockheight;
var blockextrude = blocksize;

var GRASSLAND_COLOR = 0x1b9100;
var MOUNTAINS_COLOR = 0x7b736a;
var HILLS_COLOR = 0xbaac80;
var WATER_COLOR = 0x4873ff;
var TUNDRA_COLOR = 0xc9c9c9;
var ICE_COLOR = 0x58ceff;
var SAND_COLOR = 0xffe1b5;//d7cf77;

var SEA_LEVEL = 125;
var SAND_LEVEL = 135;
var GRASSLAND_LEVEL = 170;
var HILLS_LEVEL = 200;
var TUNDRA_PERCENTAGE = 0.08;
var ICE_PERCENTAGE = 0.04;

var offset = 0;

var blockdefs = [{
	'which':0,
	'description': 'column',
	'occupies': [0,0,0,0,0,1,0,0,2,0,0,3,0,0,4,0,0,5,0,0,6,0,0,7],
	'attachesto':  [0,0,-1,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':1,
	'description': 'SW-NE diagonal beam',
	'occupies': [0,0,0,0,1,0,1,2,0,1,3,0,2,4,0,2,5,0,3,6,0,3,7,0],
	'attachesto':  [0,0,-1,0,1,-1,1,2,-1,1,3,-1,2,4,-1,2,5,-1,3,6,-1,3,7,-1,0,0,1,0,1,1,1,2,1,1,3,1,2,4,1,2,5,1,3,6,1,3,7,1]
},
{
	'which':2,
	'description': 'W-E horizontal beam',
	'occupies': [0,0,0,1,0,0,2,0,0,3,0,0,4,0,0,5,0,0,6,0,0,7,0,0],
	'attachesto':  [0,0,-1,1,0,-1,2,0,-1,3,0,-1,4,0,-1,5,0,-1,6,0,-1,7,0,-1,0,0,1,1,0,1,2,0,1,3,0,1,4,0,1,5,0,1,6,0,1,7,0,1],
},
{
	'which':3,
	'description': 'SE-NW diagonal beam',
	'occupies': [0,0,0,-1,1,0,-1,2,0,-2,3,0,-2,4,0,-3,5,0,-3,6,0,-4,7,0],
	'attachesto':  [0,0,-1,-1,1,-1,-1,2,-1,-2,3,-1,-2,4,-1,-3,5,-1,-3,6,-1,-4,7,-1,0,0,1,-1,1,1,-1,2,1,-2,3,1,-2,4,1,-3,5,1,-3,6,1,-4,7,1]
},
{
	'which':4,
	'description': 'SW-NE diagonal snake',
	'occupies': [0,0,0,1,0,0,1,1,0,2,1,0,3,2,0,4,2,0,4,3,0,5,3,0],
	'attachesto':  [0,0,-1,1,0,-1,1,1,-1,2,1,-1,3,2,-1,4,2,-1,4,3,-1,5,3,-1,0,0,1,1,0,1,1,1,1,2,1,1,3,2,1,4,2,1,4,3,1,5,3,1]
},
{
	'which':5,
	'description': 'SE-NW diagonal snake',
	'occupies': [0,0,0,-1,0,0,-2,1,0,-3,1,0,-3,2,0,-4,2,0,-5,3,0,-6,3,0],
	'attachesto':  [0,0,-1,-1,0,-1,-2,1,-1,-3,1,-1,-3,2,-1,-4,2,-1,-5,3,-1,-6,3,-1,0,0,1,-1,0,1,-2,1,1,-3,1,1,-3,2,1,-4,2,1,-5,3,1,-6,3,1]
},
{
	'which':6,
	'description': 'W-E quadruple-decker',
	'occupies': [0,0,0,1,0,0,0,0,1,1,0,1,0,0,2,1,0,2,0,0,3,1,0,3],
	'attachesto':  [0,0,-1,1,0,-1,0,0,4,1,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':7,
	'description': 'SW-NE quadruple-decker',
	'occupies': [0,0,0,0,1,0,0,0,1,0,1,1,0,0,2,0,1,2,0,0,3,0,1,3],
	'attachesto':  [0,0,-1,0,1,-1,0,0,4,0,1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':8,
	'description': 'SE-NW quadruple-decker',
	'occupies': [0,0,0,-1,1,0,0,0,1,-1,1,1,0,0,2,-1,1,2,0,0,3,-1,1,3],
	'attachesto':  [0,0,-1,-1,1,-1,0,0,4,-1,1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':9,
	'description': 'SW-NE double-decker',
	'occupies': [0,0,0,0,1,0,1,2,0,1,3,0,0,0,1,0,1,1,1,2,1,1,3,1],
	'attachesto':  [0,0,-1,0,1,-1,1,2,-1,1,3,-1,0,0,2,0,1,2,1,2,2,1,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':10,
	'description': 'W-E double-decker',
	'occupies': [0,0,0,1,0,0,2,0,0,3,0,0,0,0,1,1,0,1,2,0,1,3,0,1],
	'attachesto':  [0,0,-1,1,0,-1,2,0,-1,3,0,-1,0,0,2,1,0,2,2,0,2,3,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':11,
	'description': 'SE-NW double-decker',
	'occupies': [0,0,0,-1,1,0,-1,2,0,-2,3,0,0,0,1,-1,1,1,-1,2,1,-2,3,1],
	'attachesto':  [0,0,-1,-1,1,-1,-1,2,-1,-2,3,-1,0,0,2,-1,1,2,-1,2,2,-2,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':12,
	'description': 'SW-NE double-decker diagonal snake',
	'occupies': [0,0,0,1,0,0,1,1,0,2,1,0,0,0,1,1,0,1,1,1,1,2,1,1],
	'attachesto':  [0,0,-1,1,0,-1,1,1,-1,2,1,-1,0,0,2,1,0,2,1,1,2,2,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':13,
	'description': 'SE-NW double-decker diagonal snake',
	'occupies': [0,0,0,-1,0,0,-2,1,0,-3,1,0,0,0,1,-1,0,1,-2,1,1,-3,1,1],
	'attachesto':  [0,0,-1,-1,0,-1,-2,1,-1,-3,1,-1,0,0,2,-1,0,2,-2,1,2,-3,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':14,
	'description': 'S-N snake',
	'occupies': [0,0,0,0,1,0,0,2,0,0,3,0,0,4,0,0,5,0,0,6,0,0,7,0],
	'attachesto':  [0,0,-1,0,1,-1,0,2,-1,0,3,-1,0,4,-1,0,5,-1,0,6,-1,0,7,-1,0,0,1,0,1,1,0,2,1,0,3,1,0,4,1,0,5,1,0,6,1,0,7,1]
},
{
	'which':15,
	'description': 'S-N snake flipped',
	'occupies': [0,0,0,-1,1,0,0,2,0,-1,3,0,0,4,0,-1,5,0,0,6,0,-1,7,0],
	'attachesto':  [0,0,-1,-1,1,-1,0,2,-1,-1,3,-1,0,4,-1,-1,5,-1,0,6,-1,-1,7,-1,0,0,1,-1,1,1,0,2,1,-1,3,1,0,4,1,-1,5,1,0,6,1,-1,7,1]
},
{
	'which':16,
	'description': 'S-N double-decker snake',
	'occupies': [0,0,0,0,1,0,0,2,0,0,3,0,0,0,1,0,1,1,0,2,1,0,3,1],
	'attachesto':  [0,0,-1,0,1,-1,0,2,-1,0,3,-1,0,0,2,0,1,2,0,2,2,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':17,
	'description': 'S-N double-decker snake flipped',
	'occupies': [0,0,0,-1,1,0,0,2,0,-1,3,0,0,0,1,-1,1,1,0,2,1,-1,3,1],
	'attachesto':  [0,0,-1,-1,1,-1,0,2,-1,-1,3,-1,0,0,2,-1,1,2,0,2,2,-1,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':18,
	'description': 'SW-NE stairstep',
	'occupies': [0,0,0,0,1,0,0,1,1,1,2,1,1,2,2,1,3,2,1,3,3,2,4,3],
	'attachesto': [0,0,-1,0,1,-1,1,2,0,1,3,1,2,4,2,0,0,1,0,1,2,1,2,3,1,3,4,2,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':19,
	'description': 'W-E stairstep',
	'occupies': [0,0,0,1,0,0,1,0,1,2,0,1,2,0,2,3,0,2,3,0,3,4,0,3],
	'attachesto': [0,0,-1,1,0,-1,2,0,0,3,0,1,4,0,2,0,0,1,1,0,2,2,0,3,3,0,4,4,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':20,
	'description': 'NW-SE stairstep',
	'occupies': [0,0,0,0,-1,0,0,-1,1,1,-2,1,1,-2,2,1,-3,2,1,-3,3,2,-4,3],
	'attachesto': [0,0,-1,0,-1,-1,1,-2,0,1,-3,1,2,-4,2,0,0,1,0,-1,2,1,-2,3,1,-3,4,2,-4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':21,
	'description': 'NE-SW stairstep',
	'occupies': [0,0,0,-1,-1,0,-1,-1,1,-1,-2,1,-1,-2,2,-2,-3,2,-2,-3,3,-2,-4,3],
	'attachesto': [0,0,-1,-1,-1,-1,-1,-2,0,-2,-3,1,-2,-4,2,0,0,1,-1,-1,2,-1,-2,3,-2,-3,4,-2,-4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':22,
	'description': 'E-W stairstep',
	'occupies': [0,0,0,-1,0,0,-1,0,1,-2,0,1,-2,0,2,-3,0,2,-3,0,3,-4,0,3],
	'attachesto': [0,0,-1,-1,0,-1,-2,0,0,-3,0,1,-4,0,2,0,0,1,-1,0,2,-2,0,3,-3,0,4,-4,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':23,
	'description': 'SE-NW stairstep',
	'occupies': [0,0,0,-1,1,0,-1,1,1,-1,2,1,-1,2,2,-2,3,2,-2,3,3,-2,4,3],
	'attachesto': [0,0,-1,-1,1,-1,-1,2,0,-2,3,1,-2,4,2,0,0,1,-1,1,2,-1,2,3,-2,3,4,-2,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':24,
	'description': 'SW-NE arch',
	'occupies': [0,0,0,0,0,1,0,0,2,0,1,2,1,2,2,1,3,2,1,3,1,1,3,0],
	'attachesto': [0,0,-1,0,1,1,1,2,1,1,3,-1,0,0,3,0,1,3,1,2,3,1,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':25,
	'description': 'W-E arch',
	'occupies': [0,0,0,0,0,1,0,0,2,1,0,2,2,0,2,3,0,2,3,0,1,3,0,0],
	'attachesto': [0,0,-1,1,0,1,2,0,1,3,0,-1,0,0,3,1,0,3,2,0,3,3,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':26,
	'description': 'NW-SE arch',
	'occupies': [0,0,0,0,0,1,0,0,2,0,-1,2,1,-2,2,1,-3,2,1,-3,1,1,-3,0],
	'attachesto': [0,0,-1,0,-1,1,1,-2,1,1,-3,-1,0,0,3,0,-1,3,1,-2,3,1,-3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':27,
	'description': 'SW-NE curved arch',
	'occupies': [0,0,0,0,0,1,0,0,2,1,0,2,1,1,2,1,2,2,1,2,1,1,2,0],
	'attachesto': [0,0,-1,1,0,1,1,1,1,1,2,-1,0,0,3,1,0,3,1,1,3,1,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':28,
	'description': 'NW-SE curved arch',
	'occupies': [0,0,0,0,0,1,0,0,2,-1,-1,2,0,-2,2,1,-2,2,1,-2,1,1,-2,0],
	'attachesto': [0,0,-1,-1,-1,1,0,-2,1,1,-2,-1,0,0,3,-1,-1,3,0,-2,3,1,-2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':29,
	'description': 'NE-SW curved arch',
	'occupies': [0,0,0,0,0,1,0,0,2,-1,0,2,-2,-1,2,-1,-2,2,-1,-2,1,-1,-2,0],
	'attachesto': [0,0,-1,-1,0,1,-2,-1,1,-1,-2,-1,0,0,3,-1,0,3,-2,-1,3,-1,-2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':30,
	'description': 'SE-NW curved arch',
	'occupies': [0,0,0,0,0,1,0,0,2,0,1,2,0,2,2,-1,2,2,-1,2,1,-1,2,0],
	'attachesto': [0,0,-1,0,1,1,0,2,1,-1,2,-1,0,0,3,0,1,3,0,2,3,-1,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
},
{
	'which':31,
	'description': 'stand',
	'occupies': [0,0,0,0,0,1,0,0,2,0,0,3,0,0,4,-1,1,0,-1,-1,0,1,0,0],
	'attachesto': [0,0,-1,-1,1,-1,-1,-1,-1,1,0,-1,0,0,5,-1,1,1,-1,-1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
}
]

//var str1 = "";
//var str2 = "";
//var tempattachesto = [];
//for(var b = 0; b < blockdefs.length; b++)
//{
//	str1 = str1 + "blockdefstorage.initOccupies.sendTransaction(";
//	str2 = str2 + "blockdefstorage.initAttachesto.sendTransaction(";
//	str1 = str1 + (blockdefs[b].which*1) + ", ";
//	str2 = str2 + (blockdefs[b].which*1) + ", ";
//	str1 = str1 + JSON.stringify(blockdefs[b].occupies);
//	str2 = str2  + "["
//	for(var a = 0; a < 16; a++)
//	{
//		if(a < blockdefs[b].attachesto.length)
//			str2 = str2 + JSON.stringify(blockdefs[b].attachesto[a]) + ",";
//		else
//			str2 = str2 + "[0,0,0],";
//	}	
//	str2 = str2.substring(0,str2.length-1) + "]"
//	str1 = str1 + ",{from:eth.coinbase, gas:500000});\n";
//	str2 = str2 + ",{from:eth.coinbase, gas:500000});\n";
//}	
//console.log(str1 + "\n" + str2);

var tundratexture = THREE.ImageUtils.loadTexture( "images/tundra.jpg" );
var icetexture = THREE.ImageUtils.loadTexture( "images/ice.jpg" );
var watertexture = THREE.ImageUtils.loadTexture( "images/water.jpg" );
var grasslandtexture = THREE.ImageUtils.loadTexture( "images/grassland.jpg" );
var sandtexture = THREE.ImageUtils.loadTexture( "images/sand.jpg" );
var hillstexture = THREE.ImageUtils.loadTexture( "images/hills.jpg" );
var mountainstexture = THREE.ImageUtils.loadTexture( "images/mountains.jpg" );
var texture;

function drawMapHex(col, row)
{
	var color = null;
	var texturefile = "";
	var log_color_choice = false;
	var tiletype = "";
	if(tiles.length === 1) // special case of the single island hex on the blockref (otherwise, it woudl be ice)
	{
		color = GRASSLAND_COLOR;
		texture = grasslandtexture;
		tiletype = "grassland";
	}
	else if(tiles[col][row].elevation >= SEA_LEVEL && 						// higher than ocean level AND
			(row < (TUNDRA_PERCENTAGE * mapsize) || 			// (south of tundra threshold OR
					row > ((1-TUNDRA_PERCENTAGE) * (mapsize-1)))) //  north of tundra threshold)
	{
		color = TUNDRA_COLOR;
		texture = tundratexture;
		tiletype = "tundra";
		if(row < (ICE_PERCENTAGE * mapsize) || row > ((1-ICE_PERCENTAGE) * (mapsize - 1)))
		{
			color = ICE_COLOR;
			texture = icetexture;
			tiletype = "ice";
		}
	}
	else if(tiles[col][row].elevation < SEA_LEVEL)
	{
		color = WATER_COLOR;
		texture = watertexture;
		tiletype = "water";
	}
	else if(tiles[col][row].elevation < SAND_LEVEL)
	{
		color = SAND_COLOR;
		texture = sandtexture;
		tiletype = "sand";
	}
	else if(tiles[col][row].elevation < GRASSLAND_LEVEL)
	{
		color = GRASSLAND_COLOR;
		texture = grasslandtexture;
		tiletype = "grassland";
	}
	else if(tiles[col][row].elevation < HILLS_LEVEL)
	{
		color = HILLS_COLOR;
		texture = hillstexture;
		tiletype = "hills";
	}
	else if(tiles[col][row].elevation <= 256)
	{
		if(tiles[col][row].elevation > 255)
		{
			//tiles[col][row].elevation = 255; // sometimes multiplicative factors put the very top over 255, if so, chop it off
			console.log('WARNING elevationg greater than 255');
		}
		color = MOUNTAINS_COLOR;
		texture = mountainstexture;
		tiletype = "mountains";
	}
	
	if(color !== SAND_COLOR)
	{	
		var components = {
			    r: (color & 0xff0000) >> 16, 
			    g: (color & 0x00ff00) >> 8, 
			    b: (color & 0x0000ff)
			};
			// convert hex to hsl, set the lightness to elevation / 255, convert back to hex.
			var color_hsv = RGBtoHSV(components.r, components.g, components.b);
			var color_hsl = HSVtoHSL(color_hsv.h, color_hsv.s, color_hsv.v);
			//color_hsl.l = color_hsl.l * tiles[col][row].elevation / 255; 											// this is the original, but the light/dark was too drastic.
			color_hsl.l = color_hsl.l * ((255 - tiles[col][row].elevation)*2/5 + tiles[col][row].elevation) / 255;  // this version softens. 128/255 = ~.5 becomes (((255-128)*2/3) + 128) / 255 = .8333 (repeating, of course)
			if(color_hsl.l === 0) // when lightness is all the way zero, it draws a white hex for some reason (maybe the hue is set to something that can't be brightness zero?). w/e This shouldn't happen. Force a black hex.
				color = 0x000000;
			else
			{
				color_hsv = HSLtoHSV(color_hsl.h, color_hsl.s, color_hsl.l);
				var color_rgb = HSVtoRGB(color_hsv.h, color_hsv.s, color_hsv.v);
				color = color_rgb.r * Math.pow(16,4) + color_rgb.g * Math.pow(16,2) + color_rgb.b;
			}
	}
	// (col - (mapsize-1)/2) and (row - (mapsize-1)/2) adjust the coords to center in the camera's view
	var xpoint = (col - (mapsize-1)/2) * tilewidth;
	if(row%2 !== 0)
		xpoint = xpoint + tilewidth/2;
	var ypoint = (row - (mapsize-1)/2) * tilevert;
	
	var extrudeamount;
	
	if(tiles.length === 1) // special case of the single island hex on the blockref (otherwise, it woudl be ice)
		extrudeamount = 1;
	else if(tiles[col][row].elevation < SEA_LEVEL)
		extrudeamount = SEA_LEVEL * EXTRUSION_FACTOR;
	else
		extrudeamount = tiles[col][row].elevation * EXTRUSION_FACTOR;
	
	var extrudeSettings = {
			amount			: extrudeamount,
			steps			: 1,
			material		: 1,
			extrudeMaterial : 0,
			bevelEnabled	: false,
//			bevelThickness  : 2,
//			bevelSize       : 4,
//			bevelSegments   : 1,
		};

//	var hextex; 
//	var material;
//	if(texturefile !== "")
//	{
		var material = new THREE.MeshPhongMaterial( { color: color, map: texture } );
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( .1, .1 );
//	}
//	else
//	{
//		material = new THREE.MeshBasicMaterial( { color: color } );
//	}	
	
	var hexShape = new THREE.Shape();
	var centerPoint = new Point(xpoint, ypoint);
	
	var point0 = hex_corner(centerPoint, size, 0);
	var point1 = hex_corner(centerPoint, size, 1);
	var point2 = hex_corner(centerPoint, size, 2);
	var point3 = hex_corner(centerPoint, size, 3);
	var point4 = hex_corner(centerPoint, size, 4);
	var point5 = hex_corner(centerPoint, size, 5);
	
	hexShape.moveTo( point0.x , point0.y );
	hexShape.lineTo( point1.x, point1.y );
	hexShape.lineTo( point2.x, point2.y );
	hexShape.lineTo( point3.x, point3.y );
	hexShape.lineTo( point4.x, point4.y );
	hexShape.lineTo( point5.x, point5.y );
	hexShape.lineTo( point0.x, point0.y );
	
	var hexGeom = new THREE.ExtrudeGeometry( hexShape, extrudeSettings );

	var mesh = new THREE.Mesh( hexGeom, material );
	
//	jo.col = col; // these are reversed on purpose. I don't fully understand, but fuck it. I had a rough night.
//	jo.row = row;
//	jo.elevation = elevations[col][row] * 1;
//	jo.owner = owners[col][row];
//	jo.status = statuses[col][row];
//	jo.name = names[col][row];
//	jo.offerers = offerers[col][row];
//	jo.offers = offers[col][row];
//	jo.blocks = blocks[col][row];
	
	mesh.userData.elevation = tiles[col][row].elevation;
	mesh.userData.tiletype = tiletype;
	
	mesh.userData.col = col;
	mesh.userData.row = row;
	mesh.userData.owner = tiles[col][row].owner;
	mesh.userData.name = tiles[col][row].name;
	mesh.userData.status = tiles[col][row].status;
	mesh.userData.offers = tiles[col][row].offers; // offerers will be combined soon
	mesh.userData.blocks = tiles[col][row].blocks;

	scene.add( mesh );
	
	return;
}

function hex_corner(center, size, i){
    var angle_deg = 60 * i   + 30
    var angle_rad = Math.PI / 180 * angle_deg
    return new Point(center.x + size * Math.cos(angle_rad),
                 center.y + size * Math.sin(angle_rad))
} 


var	hextexprime = THREE.ImageUtils.loadTexture( "images/concrete.jpg" );
var hextexes = [];
var tex;
for(var h = 0; h < 32; h++)
{
	tex = THREE.ImageUtils.loadTexture( "images/concrete"+ h + ".jpg");
	hextexes.push(tex);
}	

function drawBlockHex(col, row, which, x, y, z, color, extrusion_multiple, sequencenum)
{
	//console.log('drawBlockHex ' + col + ", "+ row + " " + x + ", "+ y + ", "+ z + ", " + color);
	if(extrusion_multiple === null || extrusion_multiple === 0)
		extrusion_multiple = 1;
	
	//console.log("drawBlockHex " + coordx + "," + coordy);
	var xpoint = (col - (mapsize-1)/2) * tilewidth;
	if(row%2 !== 0)
		xpoint = xpoint + tilewidth/2;
	var ypoint = (row - (mapsize-1)/2) * tilevert;
	
	xpoint = xpoint + x * blockwidth;
	if(y%2 !== 0)
		xpoint = xpoint + blockwidth/2;
	ypoint = ypoint + y * blockvert;
	
	var extrudeSettings = {
			amount			: blockextrude * extrusion_multiple,
			steps			: 1,
			material		: 1,
			extrudeMaterial : 0,
			bevelEnabled	: false,
		};
	
	var hextex;
	if(typeof useblocknumbertextures !== "undefined" && useblocknumbertextures !== null)
		hextex = hextexes[which];
	else
		hextex = hextexprime;
	var	material = new THREE.MeshPhongMaterial( { color: color, map: hextex } );
	hextex.wrapS = hextex.wrapT = THREE.RepeatWrapping;
	hextex.repeat.set( 3,3 );
	var hexShape = new THREE.Shape();
	var centerPoint = new Point(xpoint, ypoint);
	var points = [];
	points.push(hex_corner(centerPoint, blocksize, 0));
	points.push(hex_corner(centerPoint, blocksize, 1));
	points.push(hex_corner(centerPoint, blocksize, 2));
	points.push(hex_corner(centerPoint, blocksize, 3));
	points.push(hex_corner(centerPoint, blocksize, 4));
	points.push(hex_corner(centerPoint, blocksize, 5));
	
	for(var p = 0; p < points.length; p++)
	{
		if(p === 0)
			hexShape.moveTo( points[p].x , points[p].y );
		else
			hexShape.lineTo( points[p].x, points[p].y );
	}
	hexShape.moveTo( points[0].x , points[0].y );
	
	var hexGeom = new THREE.ExtrudeGeometry( hexShape, extrudeSettings );

	var mesh = new THREE.Mesh( hexGeom, material );
	var tileextrusion;
	if(tiles[col][row].elevation < SEA_LEVEL)
	{
		tileextrusion = SEA_LEVEL * EXTRUSION_FACTOR;
	}	
	else
	{
		tileextrusion = tiles[col][row].elevation * EXTRUSION_FACTOR;
	}	
	//console.log("LOWER " + coordx + "," + coordy + " extrudeamount=" + tileextrusion  + " tiles[coordx][coordy].elevation=" + tiles[coordx][coordy].elevation + " EXTRUSION_FACTOR=" + EXTRUSION_FACTOR);
	if(tiles.length === 1) // special case of the single island hex on the blockref (otherwise, it woudl be ice)
		mesh.position.set( 0, 0, 1 + z * blockextrude);
	else
		mesh.position.set( 0, 0, tileextrusion + z * blockextrude);
	
	mesh.userData.which = which;
	mesh.userData.x = blockdefs[which].occupies[sequencenum][0];
	mesh.userData.y = blockdefs[which].occupies[sequencenum][1];
	mesh.userData.z = blockdefs[which].occupies[sequencenum][2];
	mesh.userData.color = color;
	mesh.userData.sequencenum = sequencenum;
	mesh.userData.description = blockdefs[which].description;
	mesh.userData.occupies = blockdefs[which].occupies;
	
	scene.add( mesh );
}






/***
 *     _____ _____ ___  ______ _____   _____ _____ _   _  ___________ _____  ___    _____  _____ _     
 *    /  ___|_   _/ _ \ | ___ \_   _| |  ___|_   _| | | ||  ___| ___ \_   _|/ _ \  /  ___||  _  | |    
 *    \ `--.  | |/ /_\ \| |_/ / | |   | |__   | | | |_| || |__ | |_/ / | | / /_\ \ \ `--. | | | | |    
 *     `--. \ | ||  _  ||    /  | |   |  __|  | | |  _  ||  __||    /  | | |  _  |  `--. \| | | | |    
 *    /\__/ / | || | | || |\ \  | |   | |___  | | | | | || |___| |\ \ _| |_| | | |_/\__/ /\ \_/ / |____
 *    \____/  \_/\_| |_/\_| \_| \_/   \____/  \_/ \_| |_/\____/\_| \_|\___/\_| |_(_)____/  \___/\_____/
 *                                                                                                     
 *                                                                                                     
 */

function editBlock(col, row, index, _block)
{
	var wouldoccupy = new Array(24);
	var didoccupy = new Array(24);
	for(var b = 0; b < 24; b++) // gotta create a new object and move all the values over. Otherwise, we'd be writing into blockdefs.
    {	
		wouldoccupy[b] = blockdefs[_block[0]].occupies[b];
		didoccupy[b] = blockdefs[_block[0]].occupies[b];
    }

	var tile = tiles[col][row];
	for(var b = 0; b < 24; b+=3) // always 8 hexes, calculate the didoccupy
    {	
    	wouldoccupy[b] = wouldoccupy[b]+_block[1];
    	wouldoccupy[b+1] = wouldoccupy[b+1]+_block[2];
    	if(wouldoccupy[1] % 2 != 0 && wouldoccupy[b+1] % 2 == 0) // if anchor y is odd and this hex y is even, (SW NE beam goes 11,`2`2,23,`3`4,35,`4`6,47,`5`8  ` = x value incremented by 1. Same applies to SW NE beam from 01,12,13,24,25,36,37,48)
    		wouldoccupy[b] = wouldoccupy[b]+1;  			     // then offset x by +1
    	wouldoccupy[b+2] = wouldoccupy[b+2]+_block[3];
		//console.log("before " + wouldoccupy[b] + "," + wouldoccupy[b+1] + "," + wouldoccupy[b+2]);
    	didoccupy[b] = didoccupy[b]+tile.blocks[index][1];
    	didoccupy[b+1] = didoccupy[b+1]+tile.blocks[index][2];
    	if(didoccupy[1] % 2 != 0 && didoccupy[b+1] % 2 == 0) // if anchor y and this hex y are both odd,
    		didoccupy[b] = didoccupy[b]+1; 					 // then offset x by +1
    	didoccupy[b+2] = didoccupy[b+2]+tile.blocks[index][3];
    }
	if(!isValidLocation(col, row, _block, wouldoccupy)) // have not sent offset to these functions. Must take care of inside them.
	{
		return false;
	}
	for(var b = 0; b < 24; b+=3) // always 8 hexes, calculate the didoccupy
    {
		if(b === 0 && (typeof highlightkeyhex !== "undefined" && highlightkeyhex !== null && highlightkeyhex === true))
			drawBlockHex(col, row, _block[0], wouldoccupy[b], wouldoccupy[b+1], wouldoccupy[b+2], 0xFFFFFF, 1, b);
		else
			drawBlockHex(col, row, _block[0], wouldoccupy[b], wouldoccupy[b+1], wouldoccupy[b+2], _block[4], 1, b);
    }
	
	if(tile.blocks[index][3] >= 0) // If the previous z was greater than 0 (i.e. not hidden) ...
 	{
     	for(var l = 0; l < 24; l+=3) // loop 8 times,find the previous occupado entries and overwrite them
     	{
     		if(tile.occupado)
     		{	
     			for(var o = 0; o < tile.occupado.length; o++)
         		{
         			if(didoccupy[l] == tile.occupado[o][0] && didoccupy[l+1] == tile.occupado[o][1] && didoccupy[l+2] == tile.occupado[o][2]) // x,y,z equal?
         			{
         				tile.occupado[o][0] = wouldoccupy[l]; // found it. Overwrite it
         				tile.occupado[o][1] = wouldoccupy[l+1];
         				tile.occupado[o][2] = wouldoccupy[l+2];
         			}
         		}
     		}
     	}
 	}
 	else // previous block was hidden
 	{
 		var newtriplet = [];
 		for(var ll = 0; ll < 24; ll+=3) // add the 8 new hexes to occupado
     	{
 			newtriplet = new Array(3);
 			newtriplet[0] = wouldoccupy[ll];
 			newtriplet[1] = wouldoccupy[ll+1];
 			newtriplet[2] = wouldoccupy[ll+2];
 			tile.occupado.push(newtriplet);
     	}
 	}
	tile.blocks[index] = _block;
}


function blockHexCoordsValid(x, y)
{
	var absx = Math.abs(x);
	var absy = Math.abs(y);
	
	if(absy <= 33) // middle rectangle
	{
		if(y % 2 != 0 ) // odd
		{
			if(-50 <= x && x <= 49)
				return true;
		}
		else // even
		{
			if(absx <= 49)
				return true;
		}	
	}	
	else
	{	
		if((y >= 0 && x >= 0) || (y < 0 && x > 0)) // first or 4th quadrants
		{
			if(y % 2 != 0 ) // odd
			{
				if (((absx*2) + (absy*3)) <= 198)
					return true;
			}	
			else	// even
			{
				if ((((absx+1)*2) + ((absy-1)*3)) <= 198)
					return true;
			}
		}
		else
		{	
			if(y % 2 == 0 ) // even
			{
				if (((absx*2) + (absy*3)) <= 198)
					return true;
			}	
			else	// odd
			{
				if ((((absx+1)*2) + ((absy-1)*3)) <= 198)
					return true;
			}
		}
	}
}

var whathappened = 0;

function isValidLocation(col, row, _block, wouldoccupy)
{
    	var touches = false;
    	var tile = tiles[col][row];
    	//console.log("inside isValidLoc " + JSON.stringify(tile));
        for(var b = 0; b < 24; b+=3) // always 8 hexes, calculate the wouldoccupy and the didoccupy
       	{
       		if(!blockHexCoordsValid(wouldoccupy[b], wouldoccupy[b+1])) // 3. DO ANY OF THE PROPOSED HEXES FALL OUTSIDE OF THE TILE? 
      		{
       			whathappened = 10; 
       			//console.log('OOB for ' + wouldoccupy[b] + "," + wouldoccupy[b+1]);
      			return false;
      		}
       		console.log('checking wouldoccupy x,y,z against tile.occupado for ' + wouldoccupy[b] + "," + wouldoccupy[b+1] + "," + wouldoccupy[b+2]);
       		console.log(JSON.stringify(tile.occupado));
       		if(tile.occupado)
     		{	
	       		for(var o = 0; o < tile.occupado.length; o++)  // 4. DO ANY OF THE PROPOSED HEXES CONFLICT WITH ENTRIES IN OCCUPADO? 
	          	{
	//       			console.log("occupado " + o + " " + tile.occupado[o][0] + "," + tile.occupado[o][1] + "," + tile.occupado[o][2]);
	       			if(wouldoccupy[b] == tile.occupado[o][0] && wouldoccupy[b+1] == tile.occupado[o][1] && wouldoccupy[b+2] == tile.occupado[o][2]) // do the x,y,z entries of each match?
	      			{
	      				whathappened = 11;
	//      				console.log('conflict at ' + wouldoccupy[b] + "," + wouldoccupy[b+1] + "," + wouldoccupy[b+2]);
	      				return false; // this hex conflicts. The proposed block does not avoid overlap. Return false immediately.
	      			}
	          	}
     		}
      		if(touches == false && wouldoccupy[b+2] == 0)  // 5. DO ANY OF THE BLOCKS TOUCH ANOTHER? (GROUND ONLY FOR NOW)
      		{
      			touches = true; // once true, always true til the end of this method. We must keep looping to check all the hexes for conflicts and tile boundaries, though, so we can't return true here.
      		}	
       	}
        
        // now if we're out of the loop and here, there were no conflicts and the block was found to be in the tile boundary.
        // touches may be true or false, so we need to check 
          
        if(touches == false)  // 6. NONE OF THE OCCUPY BLOCKS TOUCHED THE GROUND. BUT MAYBE THEY TOUCH ANOTHER BLOCK?
  		{
        	console.log('inside touches==false')
          	var attachesto = new Array(48);
        	for(var i = 0; i < 48; i++)
        	{	
        		attachesto[i] = blockdefs[_block[0]].attachesto[i];
        	}
          	for(var a = 0; a < 48 && !touches; a+=3) // always 8 hexes, calculate the wouldoccupy and the didoccupy
          	{
          		if(attachesto[a] == 0 && attachesto[a+1] == 0 && attachesto[a+2] == 0) // there are no more attachestos available, break (0,0,0 signifies end)
          			break;
          		//attachesto[a] = attachesto[a]+_block[1];
          		attachesto[a+1] = attachesto[a+1]+_block[2];
          		if(attachesto[1] % 2 != 0 && attachesto[a+1] % 2 == 0) //  (for attachesto, anchory is the same as for occupies, but the z is different. Nothing to worry about)
           			attachesto[a] = attachesto[a]+1;  			       // then offset x by +1
           		//attachesto[a+2] = attachesto[a+2]+_block[3];
           		for(o = 0; o < tile.occupado.length && !touches; o++)
           		{
           			if((attachesto[a]+_block[1]) == tile.occupado[o][0] && attachesto[a+1] == tile.occupado[o][1] && (attachesto[a+2]+_block[3]) == tile.occupado[o][2]) // a valid attachesto found in occupado?
           			{
           				whathappened = 12; 
           				console.log('touches');
           				return true; // in bounds, didn't conflict and now touches is true. All good. Return.
           			}
           		}
          	}
          	whathappened = 13; 
          	console.log('no touch');
          	return false; 
  		}
        else // touches was true by virtue of a z = 0 above (touching the ground). Return true;
        {
        	whathappened = 14; 
        	console.log('touches ground');
        	return true;
        }	
}
