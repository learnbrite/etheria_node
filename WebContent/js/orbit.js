/* 
	 We want the map in this format:
	 {
	 	"map":[
	 		[tile0, ... tile32], [tile17...tile65]...
	 	]
	 }
	 where each tile is 
	 {
	 	"elevation": 134,
	 	"owner": 0xabc123...,
	 	"blocks": [
	 		{ 
	 			which: 0,
	 			x: 0,
	 			y: 1
	 			z: 0,
	 			r: 55,
	 			g: 120,
	 			b: 4
	 		}...
	 	]
	 }
	 */

var container;
var size = 10; // length of one tile segment
var tileheight = size * 2;
var tilevert = tileheight * 3/4;
var tilewidth = Math.sqrt(3)/2 * tileheight;
var blocksize = size/100; // length of one block segment
var blockheight = blocksize * 2;
var blockvert = blockheight * 3/4;
var blockwidth = Math.sqrt(3)/2 * blockheight;
var blockextrude = blocksize;

var NORMALIZE_ELEVATIONS = false;
var GENERATE_NEW_MAP = true;
var EXTRUSION_FACTOR = size/75;

var camera, controls, scene, renderer;
var mesh;

var MAP_WIDTH = 17;
var MAP_HEIGHT = 17;

var map;

map = new Array(MAP_WIDTH);
for (i = 0; i < MAP_WIDTH; i++) {
	  map[i] = new Array(MAP_HEIGHT);
}	

var LEVELS =  Math.cbrt(MAP_WIDTH - 1) + 1;

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

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

document.addEventListener("DOMContentLoaded", function(event) {
	init();
	animate();
});

//Returns a random integer between min (included) and max (included)
//Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function blockHexCoordsValid(x, y)
{
	if(-33 <= y && y <= 33)
	{
		if(y % 2 !== 0 ) // odd
		{
			if(-50 <= x && x <= 49)
				return true;
		}
		else // even
		{
			if(-49 <= x && x <= 49)
				return true;
		}	
	}	
	else
	{	
		if((y >= 0 && x >= 0) || (y < 0 && x > 0)) // first or 4th quadrants
		{
			if(y % 2 !== 0 ) // odd
			{
				if (((Math.abs(x)/3) + (Math.abs(y)/2)) <= 33)
					return true;
			}	
			else	// even
			{
				if ((((Math.abs(x)+1)/3) + ((Math.abs(y)-1)/2)) <= 33)
					return true;
			}
		}
		else
		{	
			if(y % 2 === 0 ) // even
			{
				if (((Math.abs(x)/3) + (Math.abs(y)/2)) <= 33)
					return true;
			}	
			else	// odd
			{
				if ((((Math.abs(x)+1)/3) + ((Math.abs(y)-1)/2)) <= 33)
					return true;
			}
		}
	}
	return false;
}


function init() {

	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 40000);
	camera.position.z = 80;

	controls = new THREE.OrbitControls(camera);
	controls.damping = 0.2;
	controls.addEventListener('change', render);

	scene = new THREE.Scene();
	// world
	
	if(GENERATE_NEW_MAP)
	{	
		generateMap(MAP_WIDTH, MAP_HEIGHT);
		
		drawBlock(8,8,0,-50,33,0, 0xFF0000); // 8 high column
		drawBlock(8,8,0,0,66,0, 0xFF0000); // 8 high column
		drawBlock(8,8,0,49,33,0, 0xFF0000); // 8 high column
		drawBlock(8,8,0,49,-33,0, 0xFF0000); // 8 high column
		drawBlock(8,8,0,0,-66,0, 0xFF0000); // 8 high column
		drawBlock(8,8,0,-50,-33,0, 0xFF0000); // 8 high column
		
		var c = 0;
		var r = 0;
		var created = 0;
		while(created < 300)
		{
//			c = getRandomIntInclusive(-48,47);
//			r = getRandomIntInclusive(-66,66);
			c = getRandomIntInclusive(-90,90);
			r = getRandomIntInclusive(-90,90);
			while(!blockHexCoordsValid(c,r) || (Math.abs(c) < 48 && Math.abs(r) < 32))
			{
//				c = getRandomIntInclusive(-48,47);
//				r = getRandomIntInclusive(-66,66);
				c = getRandomIntInclusive(-90,90);
				r = getRandomIntInclusive(-90,90);
			}	
			drawBlock(8,8,0,c,r,0, getRandomIntInclusive(0,16777214));
			created++;
		}	
		
		// 2nd quadrant		
		// where y is even, diags valid if (Math.abs(x)/3 + Math.abs(y)/2) <= 33)
//		drawBlock(8,8,0,-48,34,0, 0xFF0000); // 8 high column = 82, 16 + 17 = 33 
//		drawBlock(8,8,0,-45,36,0, 0xFF0000); // 8 high column = 81, 15 + 18 = 33
//		drawBlock(8,8,0,-42,38,0, 0xFF0000); // 8 high column = 80, 14 + 19 = 33
//		drawBlock(8,8,0,-39,40,0, 0xFF0000); // 8 high column = 79
//		drawBlock(8,8,0,-36,42,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-33,44,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-30,46,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-27,48,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-24,50,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-21,52,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-18,54,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-15,56,0, 0xFF0000); // 8 high column
////		
////		// where y is odd (Math.abs(x+1)/3 + Math.abs(y-1)/2) <= 33)
//		drawBlock(8,8,0,-47,35,0, 0xFF0000); // 8 high column = 82
//		drawBlock(8,8,0,-44,37,0, 0xFF0000); // 8 high column = 81
//		drawBlock(8,8,0,-41,39,0, 0xFF0000); // 8 high column = 80
//		drawBlock(8,8,0,-38,41,0, 0xFF0000); // 8 high column = 79
//		drawBlock(8,8,0,-35,43,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-32,45,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-29,47,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-26,49,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-23,51,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-20,53,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-17,55,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-14,57,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-11,59,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-8,61,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-5,63,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-2,65,0, 0xFF0000); // 8 high column
//		
//		// 1st quadrant
//		// where y is even, diags valid if (Math.abs(x)/3 + Math.abs(y)/2) <= 33)
//		drawBlock(8,8,0,48,34,0, 0x00FFFF); // 8 high column = 82, 16 + 17 = 33 
//		drawBlock(8,8,0,45,36,0, 0x00FFFF); // 8 high column = 81, 15 + 18 = 33
//		drawBlock(8,8,0,42,38,0, 0x00FFFF); // 8 high column = 80, 14 + 19 = 33
//		drawBlock(8,8,0,39,40,0, 0x00FFFF); // 8 high column = 79
//		drawBlock(8,8,0,36,42,0, 0x00FFFF); // 8 high column
//		drawBlock(8,8,0,33,44,0, 0x00FFFF); // 8 high column
//		drawBlock(8,8,0,30,46,0, 0x00FFFF); // 8 high column
//		drawBlock(8,8,0,27,48,0, 0x00FFFF); // 8 high column
//		drawBlock(8,8,0,24,50,0, 0x00FFFF); // 8 high column
//		drawBlock(8,8,0,21,52,0, 0x00FFFF); // 8 high column
//		drawBlock(8,8,0,18,54,0, 0x00FFFF); // 8 high column
//		drawBlock(8,8,0,15,56,0, 0x00FFFF); // 8 high column
//		drawBlock(8,8,0,12,58,0, 0x00FFFF); // 8 high column
//		drawBlock(8,8,0,9,60,0, 0x00FFFF); // 8 high column
//		drawBlock(8,8,0,6,62,0, 0x00FFFF); // 8 high column
//		drawBlock(8,8,0,3,64,0, 0x00FFFF); // 8 high column
//		drawBlock(8,8,0,0,66,0, 0x00FFFF); // 8 high column
		
//		drawBlock(8,8,0,-5,-5,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-5,-5,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-5,-5,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-5,-5,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-5,-5,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-5,-5,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-5,-5,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-5,-5,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-5,-5,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-5,-5,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-5,-5,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,0,-5,-5,0, 0xFF0000); // 8 high column
//		drawBlock(8,8,1,-20,0,0, 0xFF0000); 
//		drawBlock(8,8,2,-49,-4,0, 0x00FF00); 
//		drawBlock(8,8,3,-46,8,0, 0x0000FF); 
//		drawBlock(8,8,4,-40,0,0, 0xFFFF00); 
//		drawBlock(8,8,5,-20,0,0, 0xFF00FF); 
//		drawBlock(8,8,6,0,0,0, 0x00FFFF); // CYAN double tower horizontal
//		drawBlock(8,8,7,-2,0,0, 0xFF0000); 
//		drawBlock(8,8,8,6,0,0, 0x00FF00); // GREEN double tower se/nw
//		drawBlock(8,8,9,14,0,0, 0x0000FF); 
//		drawBlock(8,8,10,22,0,0, 0xFF0000); 
//		drawBlock(8,8,11,32,0,0, 0x00FF00); 
//		drawBlock(8,8,12,-32,20,0, 0xFF0000); 
//		drawBlock(8,8,13,-25,20,0, 0x00FF00); 
		console.log(JSON.stringify(map));
	}
	else
	{	
		$.ajax({ 
			type: 'GET', 
			url: 'http://localhost:1337/map', 
	        dataType: 'json',
	        timeout: 10000,
	        async: false, // same origin, so this is ok 
	        success: function (data, status) {
	        	map = data;
	        },
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	        	console.log("elevations ajax error");
	        }
		});
	}
	
	var min = 1000000;
	var max = 0;
	var ceiling;
	var normalization_factor;
	if(NORMALIZE_ELEVATIONS)
	{	
		var x = 0;
		var y = 0;
		x = 0; y = 0;
		while(x < MAP_WIDTH)
		{
			y=0;
			while(y < MAP_HEIGHT)
			{
				if(map[x][y].elevation > max)
					max = map[x][y].elevation;
				if(map[x][y].elevation < min)
					min = map[x][y].elevation;
				y++;
			}	
			x++;
		}	
		ceiling = max - min; 
		normalization_factor = 255/ceiling;
		map[x][y].normalization_factor = normalization_factor;
	}
	
	for(var row = 0; row < MAP_HEIGHT; row++)
	{
		for(var col = 0; col < MAP_WIDTH; col++)
		{
//			if(NORMALIZE_ELEVATIONS)
//				map[x][y].elevation = (map[x][y].elevation - min) * map[x][y].normalization_factor;
			drawMapHex(col,row);
			
			if(map[col][row].blocks)
			{
				for(var b = 0; b < map[col][row].blocks.length; b++)
				{
					if(map[col][row].blocks[b].z >= 0) // z below 0 doesn't get drawn
					{	
						console.log("drawing block col=" + col + " row=" + row + " " + JSON.stringify(map[col][row].blocks[b]));
						drawBlock(col,row,
								map[col][row].blocks[b].which,
								map[col][row].blocks[b].x,
								map[col][row].blocks[b].y,
								map[col][row].blocks[b].z,
								//0x0000FF
								(map[col][row].blocks[b].r+128) * Math.pow(16,4) + (map[col][row].blocks[b].g+128) * Math.pow(16,2) + (map[col][row].blocks[b].b+128)
								);
					}
				}	
			}
		}
	}
	
	
	
	// lights
	light = new THREE.DirectionalLight(0xaaaaaa);
	light.position.set(1, 1, 1);
	scene.add(light);

//	light = new THREE.DirectionalLight(0x002288);
//	light.position.set(-1, -1, -1);
//	scene.add(light);

	light = new THREE.AmbientLight(0xdddddd);
	scene.add(light);

	// renderer
	renderer = new THREE.WebGLRenderer({
		antialias : false
	});
	
	//renderer.setClearColor(scene.fog.color);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.sortObjects = false;
	
	container = document.getElementById('container');
	container.appendChild(renderer.domElement);

	//

	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('mousemove', onMouseMove, false );

}

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;		

	render();
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

	render();

}

function render() {
	
	// update the picking ray with the camera and mouse position	
	raycaster.setFromCamera(mouse, camera );	
	//console.log('setting raycaster');

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children, true);

//	var forsale = "no";
	if(intersects.length > 0)
	{
//		if(intersects[ 0 ].object.userData.p > 0)
//			forsale = "yes";
		$("#hexinfobodydiv").html(
				"x: " + intersects[ 0 ].object.userData.x + "<br>" +
				"y: " + intersects[ 0 ].object.userData.y + "<br>" +
				"type: " + intersects[ 0 ].object.userData.tiletype + "<br>" + 
				"elevation: " + intersects[ 0 ].object.userData.elevation + "<br>" +
				"owner: " + intersects[ 0 ].object.userData.owner + "<br>" +
				"tiles: " + JSON.stringify(intersects[ 0 ].object.userData.blocks)
//				"for sale? " + forsale + "<br>" + 
//				"price: " + intersects[ 0 ].object.userData.p
		);
	}	
	renderer.render(scene, camera);
}

function animate() {

	requestAnimationFrame(animate);
	controls.update();

}

function drawMapHex(coordx, coordy)
{
	var color = null;
	var texturefile = "";
	var log_color_choice = false;
	var tiletype = "";
	if(map[coordx][coordy].elevation >= SEA_LEVEL && 						// higher than ocean level AND
			(coordy < (TUNDRA_PERCENTAGE * MAP_HEIGHT) || 			// (south of tundra threshold OR
					coordy > ((1-TUNDRA_PERCENTAGE) * (MAP_HEIGHT-1)))) //  north of tundra threshold)
	{
		color = TUNDRA_COLOR;
		texturefile = "images/tundra.jpg";
		tiletype = "tundra";
		if(coordy < (ICE_PERCENTAGE * MAP_HEIGHT) || coordy > ((1-ICE_PERCENTAGE) * (MAP_HEIGHT - 1)))
		{
			color = ICE_COLOR;
			texturefile = "images/ice.jpg";
			tiletype = "ice";
		}
	}
	else if(map[coordx][coordy].elevation < SEA_LEVEL)
	{
		color = WATER_COLOR;
		//texturefile = "images/coast.jpg";
		tiletype = "water";
	}
	else if(map[coordx][coordy].elevation < SAND_LEVEL)
	{
		color = SAND_COLOR;
		texturefile = "images/sand.jpg";
		tiletype = "sand";
	}
	else if(map[coordx][coordy].elevation < GRASSLAND_LEVEL)
	{
		color = GRASSLAND_COLOR;
		texturefile = "images/grass3.jpg";
		tiletype = "grassland";
	}
	else if(map[coordx][coordy].elevation < HILLS_LEVEL)
	{
		color = HILLS_COLOR;
		texturefile = "images/hills.jpg";
		tiletype = "hills";
	}
	else if(map[coordx][coordy].elevation <= 256)
	{
		if(map[coordx][coordy].elevation > 255)
		{
			//map[coordx][coordy].elevation = 255; // sometimes multiplicative factors put the very top over 255, if so, chop it off
			console.log('WARNING elevationg greater than 255');
		}
		color = MOUNTAINS_COLOR;
		texturefile = "images/mountains.jpg";
		tiletype = "mountains";
		//color = 0xff0000;
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
			//color_hsl.l = color_hsl.l * map[coordx][coordy].elevation / 255; 											// this is the original, but the light/dark was too drastic.
			color_hsl.l = color_hsl.l * ((255 - map[coordx][coordy].elevation)*2/5 + map[coordx][coordy].elevation) / 255;  // this version softens. 128/255 = ~.5 becomes (((255-128)*2/3) + 128) / 255 = .8333 (repeating, of course)
			if(color_hsl.l === 0) // when lightness is all the way zero, it draws a white hex for some reason (maybe the hue is set to something that can't be brightness zero?). w/e This shouldn't happen. Force a black hex.
				color = 0x000000;
			else
			{
				color_hsv = HSLtoHSV(color_hsl.h, color_hsl.s, color_hsl.l);
				var color_rgb = HSVtoRGB(color_hsv.h, color_hsv.s, color_hsv.v);
				color = color_rgb.r * Math.pow(16,4) + color_rgb.g * Math.pow(16,2) + color_rgb.b;
			}
	}
	// (coordx - (MAP_WIDTH-1)/2) and (coordy - (MAP_HEIGHT-1)/2) adjust the coords to center in the camera's view
	var xpoint = (coordx - (MAP_WIDTH-1)/2) * tilewidth;
	if(coordy%2 !== 0)
		xpoint = xpoint + tilewidth/2;
	var ypoint = (coordy - (MAP_HEIGHT-1)/2) * tilevert;
	
	var extrudeamount;
	
	if(map[coordx][coordy].elevation < SEA_LEVEL)
		extrudeamount = SEA_LEVEL * EXTRUSION_FACTOR;
	else
		extrudeamount = map[coordx][coordy].elevation * EXTRUSION_FACTOR;
	
	if(coordx === 9 && coordy ===9)
		console.log("9,9 extrudeamount=" + extrudeamount  + " map[coordx][coordy].elevation=" + map[coordx][coordy].elevation + " EXTRUSION_FACTOR=" + EXTRUSION_FACTOR);
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

	var texture1; 
	var material;
	if(texturefile !== "")
	{
		texture1 = THREE.ImageUtils.loadTexture( texturefile );
		material = new THREE.MeshPhongMaterial( { color: color, map: texture1 } );
		texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
		texture1.repeat.set( .1, .1 );
	}
	else
	{
		material = new THREE.MeshBasicMaterial( { color: color } );
	}	
	
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
	
	mesh.userData.elevation = map[coordx][coordy].elevation;
	mesh.userData.owner = map[coordx][coordy].owner;
	mesh.userData.blocks = map[coordx][coordy].blocks;
	mesh.userData.tiletype = tiletype;
	mesh.userData.x = coordx;
	mesh.userData.y = coordy;

	scene.add( mesh );
	
	return;
}

function hex_corner(center, size, i){
    var angle_deg = 60 * i   + 30
    var angle_rad = Math.PI / 180 * angle_deg
    return new Point(center.x + size * Math.cos(angle_rad),
                 center.y + size * Math.sin(angle_rad))
} 

function guid() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return s4() + s4() + s4() + s4() + s4() + + s4() + s4() + s4();
	}

/* accepts parameters
 * r  Object = {r:x, g:y, b:z}
 * OR 
 * r, g, b
*/
function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}

function HSVtoHSL(h, s, v) {
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    var _h = h,
        _s = s * v,
        _l = (2 - s) * v;
    _s /= (_l <= 1) ? _l : 2 - _l;
    _l /= 2;

    return {
        h: _h,
        s: _s,
        l: _l
    };
}

function HSLtoHSV(h, s, l) {
    if (arguments.length === 1) {
        s = h.s, l = h.l, h = h.h;
    }
    var _h = h,
        _s,
        _v;

    l *= 2;
    s *= (l <= 1) ? l : 2 - l;
    _v = (l + s) / 2;
    _s = (2 * s) / (l + s);

    return {
        h: _h,
        s: _s,
        v: _v
    };
}

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function darkenColor(color, percentage)
{
	var components = {
		    r: (color & 0xff0000) >> 16, 
		    g: (color & 0x00ff00) >> 8, 
		    b: (color & 0x0000ff)
		};
	var color_hsv = RGBtoHSV(components.r, components.g, components.b);
	var color_hsl = HSVtoHSL(color_hsv.h, color_hsv.s, color_hsv.v);
	color_hsl.l = color_hsl.l * percentage;  
	if(color_hsl.l === 0) // when lightness is all the way zero, it draws a white hex for some reason (maybe the hue is set to something that can't be brightness zero?). w/e This shouldn't happen. Force a black hex.
		color = 0x000000;
	else
	{
		color_hsv = HSLtoHSV(color_hsl.h, color_hsl.s, color_hsl.l);
		var color_rgb = HSVtoRGB(color_hsv.h, color_hsv.s, color_hsv.v);
		color = color_rgb.r * Math.pow(16,4) + color_rgb.g * Math.pow(16,2) + color_rgb.b;
	}
	return color;
}