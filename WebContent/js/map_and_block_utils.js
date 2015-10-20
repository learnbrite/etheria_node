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

var occupado; // occupado[coordx][coordy] contains the set of occupied x,y,z spaces in this tile

occupado = new Array(mapsize);
for (i = 0; i < mapsize; i++) {
	occupado[i] = new Array(mapsize);
	for(j = 0; j < mapsize; j++)
		occupado[i][j] = [];  // each x,y is also an array of [x,y,z] values, so occupado[0][1] might contain [[2,3,4],[5,6,7]...]
}

//initialize occupado with the floor (all the z=-1 for the tile) 

for (row = 0; row < mapsize; row++) {
	for(col = 0; col < mapsize; col++) {
		for(var y = -66; y <= 66; y++)
		{
			if(y % 2 !== 0 ) // odd
				x = -50;
			else
				x = -49;
			
			if(y >= -33 && y <= 33)
			{
				for(x; x <= 49; x++)
				{
					occupado[col][row].push([x,y,-1]);
				}
			}	
			else
			{	
				for(x; x <= 49; x++)
				{
					if((y >= 0 && x >= 0) || (y < 0 && x > 0)) // first or 4th quadrants
					{
						if(y % 2 !== 0 ) // odd
						{
							if (((Math.abs(x)/3) + (Math.abs(y)/2)) <= 33)
								occupado[col][row].push([x,y,-1]);
						}	
						else	// even
						{
							if ((((Math.abs(x)+1)/3) + ((Math.abs(y)-1)/2)) <= 33)
								occupado[col][row].push([x,y,-1]);
						}
					}
					else
					{	
						if(y % 2 === 0 ) // even
						{
							if (((Math.abs(x)/3) + (Math.abs(y)/2)) <= 33)
								occupado[col][row].push([x,y,-1]);
						}	
						else	// odd
						{
							if ((((Math.abs(x)+1)/3) + ((Math.abs(y)-1)/2)) <= 33)
								occupado[col][row].push([x,y,-1]);
						}
					}
				}
			}
		}	
	}
}


var blockdefs = [{
	'which':0,
	'description': 'column',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[0,0,3],[0,0,4],[0,0,5],[0,0,6],[0,0,7]],
	'attachesto':  [[0,0,-1],[0,0,8]]
},
{
	'which':1,
	'description': 'SW-NE diagonal beam',
	'occupies': [[0,0,0],[0,1,0],[1,2,0],[1,3,0],[2,4,0],[2,5,0],[3,6,0],[3,7,0]],
	'attachesto':  [[0,0,-1],[0,1,-1],[1,2,-1],[1,3,-1],[2,4,-1],[2,5,-1],[3,6,-1],[3,7,-1],
	                  [0,0,1],[0,1,1],[1,2,1],[1,3,1],[2,4,1],[2,5,1],[3,6,1],[3,7,1]]
},
{
	'which':2,
	'description': 'W-E horizontal beam',
	'occupies': [[0,0,0],[1,0,0],[2,0,0],[3,0,0],[4,0,0],[5,0,0],[6,0,0],[7,0,0]],
	'attachesto':  [[0,0,-1],[1,0,-1],[2,0,-1],[3,0,-1],[4,0,-1],[5,0,-1],[6,0,-1],[7,0,-1],
	                  [0,0,1],[1,0,1],[2,0,1],[3,0,1],[4,0,1],[5,0,1],[6,0,1],[7,0,1]],
},
{
	'which':3,
	'description': 'SE-NW diagonal beam',
	'occupies': [[0,0,0],[-1,1,0],[-1,2,0],[-2,3,0],[-2,4,0],[-3,5,0],[-3,6,0],[-4,7,0]],
	'attachesto':  [[0,0,-1],[-1,1,-1],[-1,2,-1],[-2,3,-1],[-2,4,-1],[-3,5,-1],[-3,6,-1],[-4,7,-1],
	                  [0,0,1],[-1,1,1],[-1,2,1],[-2,3,1],[-2,4,1],[-3,5,1],[-3,6,1],[-4,7,1]]
},
{
	'which':4,
	'description': 'SW-NE diagonal snake',
	'occupies': [[0,0,0],[1,0,0],[1,1,0],[2,1,0],[3,2,0],[4,2,0],[4,3,0],[5,3,0]],
	'attachesto':  [[0,0,-1],[1,0,-1],[1,1,-1],[2,1,-1],[3,2,-1],[4,2,-1],[4,3,-1],[5,3,-1],
	                  [0,0,1],[1,0,1],[1,1,1],[2,1,1],[3,2,1],[4,2,1],[4,3,1],[5,3,1]]
},
{
	'which':5,
	'description': 'SE-NW diagonal snake',
	'occupies': [[0,0,0],[-1,0,0],[-2,1,0],[-3,1,0],[-3,2,0],[-4,2,0],[-5,3,0],[-6,3,0]],
	'attachesto':  [[0,0,-1],[-1,0,-1],[-2,1,-1],[-3,1,-1],[-3,2,-1],[-4,2,-1],[-5,3,-1],[-6,3,-1],
	                  [0,0,1],[-1,0,1],[-2,1,1],[-3,1,1],[-3,2,1],[-4,2,1],[-5,3,1],[-6,3,1]]
},
{
	'which':6,
	'description': 'W-E quadruple-decker',
	'occupies': [[0,0,0],[1,0,0],[0,0,1],[1,0,1],[0,0,2],[1,0,2],[0,0,3],[1,0,3]],
	'attachesto':  [[0,0,-1],[1,0,-1],
	                  [0,0,4],[1,0,4]]
},
{
	'which':7,
	'description': 'SW-NE quadruple-decker',
	'occupies': [[0,0,0],[0,1,0],[0,0,1],[0,1,1],[0,0,2],[0,1,2],[0,0,3],[0,1,3]],
	'attachesto':  [[0,0,-1],[0,1,-1],
	                  [0,0,4],[0,1,4]]
},
{
	'which':8,
	'description': 'SE-NW quadruple-decker',
	'occupies': [[0,0,0],[-1,1,0],[0,0,1],[-1,1,1],[0,0,2],[-1,1,2],[0,0,3],[-1,1,3]],
	'attachesto':  [[0,0,-1],[-1,1,-1],
	                  [0,0,4],[-1,1,4]]
},
{
	'which':9,
	'description': 'SW-NE double-decker',
	'occupies': [[0,0,0],[0,1,0],[1,2,0],[1,3,0],[0,0,1],[0,1,1],[1,2,1],[1,3,1]],
	'attachesto':  [[0,0,-1],[0,1,-1],[1,2,-1],[1,3,-1],
	                  [0,0,2],[0,1,2],[1,2,2],[1,3,2]]
},
{
	'which':10,
	'description': 'W-E double-decker',
	'occupies': [[0,0,0],[1,0,0],[2,0,0],[3,0,0],[0,0,1],[1,0,1],[2,0,1],[3,0,1]],
	'attachesto':  [[0,0,-1],[1,0,-1],[2,0,-1],[3,0,-1],
	                  [0,0,2],[1,0,2],[2,0,2],[3,0,2]]
},
{
	'which':11,
	'description': 'SE-NW double-decker',
	'occupies': [[0,0,0],[-1,1,0],[-1,2,0],[-2,3,0],[0,0,1],[-1,1,1],[-1,2,1],[-2,3,1]],
	'attachesto':  [[0,0,-1],[-1,1,-1],[-1,2,-1],[-2,3,-1],
	                  [0,0,2],[-1,1,2],[-1,2,2],[-2,3,2]]
},
{
	'which':12,
	'description': 'SW-NE double-decker diagonal snake',
	'occupies': [[0,0,0],[1,0,0],[1,1,0],[2,1,0],[0,0,1],[1,0,1],[1,1,1],[2,1,1]],
	'attachesto':  [[0,0,-1],[1,0,-1],[1,1,-1],[2,1,-1],
	                  [0,0,2],[1,0,2],[1,1,2],[2,1,2]]
},
{
	'which':13,
	'description': 'SE-NW double-decker diagonal snake',
	'occupies': [[0,0,0],[-1,0,0],[-2,1,0],[-3,1,0],[0,0,1],[-1,0,1],[-2,1,1],[-3,1,1]],
	'attachesto':  [[0,0,-1],[-1,0,-1],[-2,1,-1],[-3,1,-1],
	                  [0,0,2],[-1,0,2],[-2,1,2],[-3,1,2]]
},
{
	'which':14,
	'description': 'S-N snake',
	'occupies': [[0,0,0],[0,1,0],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0]],
	'attachesto':  [[0,0,-1],[0,1,-1],[0,2,-1],[0,3,-1],[0,4,-1],[0,5,-1],[0,6,-1],[0,7,-1],
	                  [0,0,1],[0,1,1],[0,2,1],[0,3,1],[0,4,1],[0,5,1],[0,6,1],[0,7,1]]
},
{
	'which':15,
	'description': 'S-N snake flipped',
	'occupies': [[0,0,0],[-1,1,0],[0,2,0],[-1,3,0],[0,4,0],[-1,5,0],[0,6,0],[-1,7,0]],
	'attachesto':  [[0,0,-1],[-1,1,-1],[0,2,-1],[-1,3,-1],[0,4,-1],[-1,5,-1],[0,6,-1],[-1,7,-1],
	                  [0,0,1],[-1,1,1],[0,2,1],[-1,3,1],[0,4,1],[-1,5,1],[0,6,1],[-1,7,1]]
},
{
	'which':16,
	'description': 'S-N double-decker snake',
	'occupies': [[0,0,0],[0,1,0],[0,2,0],[0,3,0],[0,0,1],[0,1,1],[0,2,1],[0,3,1]],
	'attachesto':  [[0,0,-1],[0,1,-1],[0,2,-1],[0,3,-1],
	                  [0,0,2],[0,1,2],[0,2,2],[0,3,2]]
},
{
	'which':17,
	'description': 'S-N double-decker snake flipped',
	'occupies': [[0,0,0],[-1,1,0],[0,2,0],[-1,3,0],[0,0,1],[-1,1,1],[0,2,1],[-1,3,1]],
	'attachesto':  [[0,0,-1],[-1,1,-1],[0,2,-1],[-1,3,-1],
	                  [0,0,2],[-1,1,2],[0,2,2],[-1,3,1]]
},
{
	'which':18,
	'description': 'SW-NE stairstep',
	'occupies': [[0,0,0],[0,1,0],[0,1,1],[1,2,1],[1,2,2],[1,3,2],[1,3,3],[2,4,3]],
	'attachesto': [[0,0,-1],[0,1,-1],[1,2,0],[1,3,1],[2,4,2],
	                 [0,0,1] ,[0,1,2],[1,2,3],[1,3,4],[2,4,4]]
},
{
	'which':19,
	'description': 'W-E stairstep',
	'occupies': [[0,0,0],[1,0,0],[1,0,1],[2,0,1],[2,0,2],[3,0,2],[3,0,3],[4,0,3]],
	'attachesto': [[0,0,-1],[1,0,-1],[2,0,0],[3,0,1],[4,0,2],
	                 [0,0,1] ,[1,0,2],[2,0,3],[3,0,4],[4,0,4]]
},
{
	'which':20,
	'description': 'NW-SE stairstep',
	'occupies': [[0,0,0],[0,-1,0],[0,-1,1],[1,-2,1],[1,-2,2],[1,-3,2],[1,-3,3],[2,-4,3]],
	'attachesto': [[0,0,-1],[0,-1,-1],[1,-2,0],[1,-3,1],[2,-4,2],
	                 [0,0,1] ,[0,-1,2],[1,-2,3],[1,-3,4],[2,-4,4]]
},
{
	'which':21,
	'description': 'NE-SW stairstep',
	'occupies': [[0,0,0],[-1,-1,0],[-1,-1,1],[-1,-2,1],[-1,-2,2],[-2,-3,2],[-2,-3,3],[-2,-4,3]],
	'attachesto': [[0,0,-1],[-1,-1,-1],[-1,-2,0],[-2,-3,1],[-2,-4,2],
	                 [0,0,1] ,[-1,-1,2],[-1,-2,3],[-2,-3,4],[-2,-4,4]]
},
{
	'which':22,
	'description': 'E-W stairstep',
	'occupies': [[0,0,0],[-1,0,0],[-1,0,1],[-2,0,1],[-2,0,2],[-3,0,2],[-3,0,3],[-4,0,3]],
	'attachesto': [[0,0,-1],[-1,0,-1],[-2,0,0],[-3,0,1],[-4,0,2],
	                 [0,0,1] ,[-1,0,2],[-2,0,3],[-3,0,4],[-4,0,4]]
},
{
	'which':23,
	'description': 'SE-NW stairstep',
	'occupies': [[0,0,0],[-1,1,0],[-1,1,1],[-1,2,1],[-1,2,2],[-2,3,2],[-2,3,3],[-2,4,3]],
	'attachesto': [[0,0,-1],[-1,1,-1],[-1,2,0],[-2,3,1],[-2,4,2],
	                 [0,0,1] ,[-1,1,2],[-1,2,3],[-2,3,4],[-2,4,4]]
},
{
	'which':24,
	'description': 'SW-NE arch',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[0,1,2],[1,2,2],[1,3,2],[1,3,1],[1,3,0]],
	'attachesto': [[0,0,-1],[0,1,1],[1,2,1],[1,3,-1],
	                 [0,0,3] ,[0,1,3],[1,2,3],[1,3,3]]
},
{
	'which':25,
	'description': 'W-E arch',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[1,0,2],[2,0,2],[3,0,2],[3,0,1],[3,0,0]],
	'attachesto': [[0,0,-1],[1,0,1],[2,0,1],[3,0,-1],
	                 [0,0,3] ,[1,0,3],[2,0,3],[3,0,3]]
},
{
	'which':26,
	'description': 'NW-SE arch',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[0,-1,2],[1,-2,2],[1,-3,2],[1,-3,1],[1,-3,0]],
	'attachesto': [[0,0,-1],[0,-1,1],[1,-2,1],[1,-3,-1],
	                 [0,0,3] ,[0,-1,3],[1,-2,3],[1,-3,3]]
},
{
	'which':27,
	'description': 'SW-NE curved arch',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[1,0,2],[1,1,2],[1,2,2],[1,2,1],[1,2,0]],
	'attachesto': [[0,0,-1],[1,0,1],[1,1,1],[1,2,-1],
	                 [0,0,3] ,[1,0,3],[1,1,3],[1,2,3]]
},
{
	'which':28,
	'description': 'NW-SE curved arch',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[-1,-1,2],[0,-2,2],[1,-2,2],[1,-2,1],[1,-2,0]],
	'attachesto': [[0,0,-1],[-1,-1,1],[0,-2,1],[1,-2,-1],
	                 [0,0,3] ,[-1,-1,3],[0,-2,3],[1,-2,3]]
},
{
	'which':29,
	'description': 'NE-SW curved arch',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[-1,0,2],[-2,-1,2],[-1,-2,2],[-1,-2,1],[-1,-2,0]],
	'attachesto': [[0,0,-1],[-1,0,1],[-2,-1,1],[-1,-2,-1],
	                 [0,0,3] ,[-1,0,3],[-2,-1,3],[-1,-2,3]]
},
{
	'which':30,
	'description': 'SE-NW curved arch',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[0,1,2],[0,2,2],[-1,2,2],[-1,2,1],[-1,2,0]],
	'attachesto': [[0,0,-1],[0,1,1],[0,2,1],[-1,2,-1],
	                 [0,0,3] ,[0,1,3],[0,2,3],[-1,2,3]]
},
{
	'which':31,
	'description': 'stand',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[0,0,3],[0,0,4],[-1,1,0],[-1,-1,0],[1,0,0]],
	'attachesto': [[0,0,-1],[-1,1,-1],[-1,-1,-1],[1,0,-1],
	                 [0,0,5],[-1,1,1],[-1,-1,1],[1,0,1]]
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
	if(map.length === 1) // special case of the single island hex on the blockref (otherwise, it woudl be ice)
	{
		color = GRASSLAND_COLOR;
		texture = grasslandtexture;
		tiletype = "grassland";
	}
	else if(map[col][row].elevation >= SEA_LEVEL && 						// higher than ocean level AND
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
	else if(map[col][row].elevation < SEA_LEVEL)
	{
		color = WATER_COLOR;
		texture = watertexture;
		tiletype = "water";
	}
	else if(map[col][row].elevation < SAND_LEVEL)
	{
		color = SAND_COLOR;
		texture = sandtexture;
		tiletype = "sand";
	}
	else if(map[col][row].elevation < GRASSLAND_LEVEL)
	{
		color = GRASSLAND_COLOR;
		texture = grasslandtexture;
		tiletype = "grassland";
	}
	else if(map[col][row].elevation < HILLS_LEVEL)
	{
		color = HILLS_COLOR;
		texture = hillstexture;
		tiletype = "hills";
	}
	else if(map[col][row].elevation <= 256)
	{
		if(map[col][row].elevation > 255)
		{
			//map[col][row].elevation = 255; // sometimes multiplicative factors put the very top over 255, if so, chop it off
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
			//color_hsl.l = color_hsl.l * map[col][row].elevation / 255; 											// this is the original, but the light/dark was too drastic.
			color_hsl.l = color_hsl.l * ((255 - map[col][row].elevation)*2/5 + map[col][row].elevation) / 255;  // this version softens. 128/255 = ~.5 becomes (((255-128)*2/3) + 128) / 255 = .8333 (repeating, of course)
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
	
	if(map[col][row].elevation < SEA_LEVEL)
		extrudeamount = SEA_LEVEL * EXTRUSION_FACTOR;
	else
		extrudeamount = map[col][row].elevation * EXTRUSION_FACTOR;
	
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
	
	mesh.userData.elevation = map[col][row].elevation;
	mesh.userData.tiletype = tiletype;
	
	mesh.userData.col = col;
	mesh.userData.row = row;
	mesh.userData.owner = map[col][row].owner;
	mesh.userData.name = map[col][row].name;
	mesh.userData.status = map[col][row].status;
	mesh.userData.offers = map[col][row].offers; // offerers will be combined soon
	mesh.userData.blocks = map[col][row].blocks;

	scene.add( mesh );
	
	return;
}

function hex_corner(center, size, i){
    var angle_deg = 60 * i   + 30
    var angle_rad = Math.PI / 180 * angle_deg
    return new Point(center.x + size * Math.cos(angle_rad),
                 center.y + size * Math.sin(angle_rad))
} 



function blockHexCoordsValid(x, y)
{
	if(-33 <= y && y <= 33)
	{
		if(y % 2 !== 0 ) // odd
		{
			if(-50 <= x && x <= 49)
				return true;
			else
			{
				//console.log('returning false! ' + x + ',' + y);
				return false;
			}	
		}
		else // even
		{
			if(-49 <= x && x <= 49)
				return true;
			else
			{
				//console.log('returning false! ' + x + ',' + y);
				return false;
			}	
		}	
	}	
	else
	{	
		var absx;
		var absy;
		if(x < 0)
			absx = (x*-1);
		else
			absx = (x);
		if(y < 0)
			absy = (y*-1);
		else
			absy = (y);
		if((y >= 0 && x >= 0) || (y < 0 && x > 0)) // first or 4th quadrants
		{
			if(y % 2 != 0 ) // odd
			{
				if (((absx*2) + (absy*3)) <= 198)
					return true;
				else
				{
					//console.log('returning false! ' + x + ',' + y);
					return false;
				}	
			}	
			else	// even
			{
				if ((((absx+1)*2) + ((absy-1)*3)) <= 198)
				{
					return true;
				}
				else
				{
					//console.log('returning false! ' + x + ',' + y);
					return false;
				}	
			}
		}
		else
		{	
			if(y % 2 == 0 ) // even
			{
				if (((absx*2) + (absy*3)) <= 198)
					return true;
				else
				{
					//console.log('returning false! ' + x + ',' + y);
					return false;
				}	
			}	
			else	// odd
			{
				if ((((absx+1)*2) + ((absy-1)*3)) <= 198)
					return true;
				else
				{
					//console.log('returning false! ' + x + ',' + y);
					return false;
				}	
			}
		}
	}
	//console.log('END returning false! ' + x + ',' + y);
	return false;
}

function isValidLocation(col, row, which, x, y, z)
{
	// var uint8[3][8] wouldoccupy;
	var wouldoccupy = []; 
	wouldoccupy = new Array(8);
	for (i = 0; i < 8; i++) {
		wouldoccupy[i] = new Array(3);
	}
	
	for(var j = 0; j < 8; j++)
	{
		for(var k = 0; k < 8; k++)
		{
			wouldoccupy[k][j] = blockdefs[which].occupies[k][j];
		}
	}	
	
	var touches = false;
	for(var b = 0; b < 8; b++) // always 8 hexes
	{
		console.log('checking ' +wouldoccupy[b][0] + "," + wouldoccupy[b][1] + "," + wouldoccupy[b][2]);
		wouldoccupy[b][0] = wouldoccupy[b][0]+x;
		wouldoccupy[b][1] = wouldoccupy[b][1]+y;
		if(y % 2 != 0 && wouldoccupy[b][1]%2 != 0)
			wouldoccupy[b][0] = wouldoccupy[b][0]+1; // anchor y and this hex y are both odd, offset by +1
		wouldoccupy[b][2] = wouldoccupy[b][2]+z;
		console.log('now ' +wouldoccupy[b][0] + "," + wouldoccupy[b][1] + "," + wouldoccupy[b][2]);
		if(!blockHexCoordsValid(wouldoccupy[b][0], wouldoccupy[b][1])) // this is the out-of-bounds check
		{
			console.log('returning false. blockHexCoordsInvalid for ' +  wouldoccupy[b][0] + ", " +  wouldoccupy[b][1]);
			return false;
		}
//		for(var o = 0; o < tiles[col][row].occupado.length; o++)
//    	{
//			if(wouldoccupy[b][0] == tiles[col][row].occupado[o][0] && wouldoccupy[b][1] == tiles[col][row].occupado[o][1] && wouldoccupy[b][2] == tiles[col][row].occupado[o][2]) // are the arrays equal?
//			{
//				whathappened = 2;
//				return false; // this hex conflicts. The proposed block does not avoid overlap. Return false immediately.
//			}
//    	}
//		if(touches == false && wouldoccupy[b][2] == 0) // if on the ground, touches is always true, only check if touches is not yet true
//		{
//			touches = true;
//		}	
	}
	return true;
}

function drawBlock(col, row, which, x, y, z, color)
{
	// This seems more complicated than it should be, but I don't think it is. 
	// The issue is that a block of a certain configuration,
	// is actually a different configuration depending on whether its rows are odd or even
	// e.g. a straight line to the NE, starting at 0,0 the other 3 blocks are 0,1, 1,2 and 1,3 (x,y+1, x+1,y+2 and x+1,y+3)
	// but starting at 0,1 the other 3 blocks are 1,2, 1,3 and 1, 3 (x+1,y+1, x+1,y+2 and x+2,y+3)
	// See? Kinda weird.
	//console.log("drawblock(" + coordx + ", "+ coordy + ", " + which + "," + x + ", "+ y + ", "+ z + ", " + color);
	var occupiesx = 0;
	var occupiesy = 0;
	var occupiesz = 0;
	
	if(isValidLocation(col, row, which, x, y, z)) // have not sent offset to these functions. Must take care of inside them.
	{
		for(var b = 0; b < 8; b++)
		{
			occupiesx = blockdefs[which].occupies[b][0];
			occupiesy = blockdefs[which].occupies[b][1];
			occupiesz = blockdefs[which].occupies[b][2];
			if(y % 2 !== 0 && occupiesy%2 !== 0) // if y is odd, offset the x by 1
			{ occupiesx = occupiesx + 1; }
			//console.log('drawing ' + (occupiesx+x) + " " + (occupiesy+y) + " " + occupiesz+z);
			drawBlockHex(col, row, occupiesx+x, occupiesy+y, occupiesz+z, color,1);
			occupado[col][row].push([occupiesx+x, occupiesy+y, occupiesz+z]);
		}
		return true;
	}
	else
		return false;
}

var	hextex = THREE.ImageUtils.loadTexture( "images/concrete3.jpg" );

function drawBlockHex(col, row, x, y, z, color, extrusion_multiple)
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
	if(map[col][row].elevation < SEA_LEVEL)
	{
		tileextrusion = SEA_LEVEL * EXTRUSION_FACTOR;
	}	
	else
	{
		tileextrusion = map[col][row].elevation * EXTRUSION_FACTOR;
	}	
	//console.log("LOWER " + coordx + "," + coordy + " extrudeamount=" + tileextrusion  + " map[coordx][coordy].elevation=" + map[coordx][coordy].elevation + " EXTRUSION_FACTOR=" + EXTRUSION_FACTOR);
	mesh.position.set( 0, 0, tileextrusion + z * blockextrude);
	scene.add( mesh );
}
