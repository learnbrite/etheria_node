var container;
var size = 1; // length of one tile segment
var tileheight = size * 2;
var tilevert = tileheight * 3/4;
var tilewidth = Math.sqrt(3)/2 * tileheight;
var blocksize = size/100; // length of one block segment
var blockheight = blocksize * 2;
var blockvert = blockheight * 3/4;
var blockwidth = Math.sqrt(3)/2 * blockheight;
var blockextrude = blocksize;

var camera, controls, scene, renderer;
var mesh;

var MAP_WIDTH = 33;
var MAP_HEIGHT = 33;

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

var originalmap = createArray(33,33);

var EXTRUSION_FACTOR = size/75;

var LEVELS =  Math.cbrt(MAP_WIDTH - 1) + 1;

var GRASSLAND_COLOR = 0x1b9100;
var MOUNTAINS_COLOR = 0x7b736a;
var HILLS_COLOR = 0xbaac80;
var WATER_COLOR = 0x4873ff;
var TUNDRA_COLOR = 0xc9c9c9;
var ICE_COLOR = 0x58ceff;
var SAND_COLOR = 0xffe1b5;//d7cf77;

var SEA_LEVEL = 115;
var SAND_LEVEL = 130;
var GRASSLAND_LEVEL = 180;
var HILLS_LEVEL = 200;
var TUNDRA_PERCENTAGE = 0.08;
var ICE_PERCENTAGE = 0.04;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

document.addEventListener("DOMContentLoaded", function(event) {
	init();
	animate();
});



function init() {

	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 40000);
	camera.position.z = 50;

	controls = new THREE.OrbitControls(camera);
	controls.damping = 0.2;
	controls.addEventListener('change', render);

	scene = new THREE.Scene();
//	scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

	// world

	var j = 0;
	var r = 0;
	//var c = '#00FF00';

	var existingPoints = [];
	var newpoint = null;
	var i = 0;
	var ep = "";
	
	var ur = false;
	var r = false;
	var lr = false;
	var ll = false;
	var l = false;
	var ul = false;
	
	/* 
	 We want the map in this format:
	 {
	 	"map":[
	 		[tile0, ... tile32], [tile33...tile65]...
	 	]
	 }
	 where each tile is 
	 {
	 	"elevation": 134,
	 	"owner": 0xabc123...,
	 	"price": 7000000000
	 	"blocks": [
	 		[which0,blockx0,blocky0,blockz0,r0,g0,b0,which1,blockx1,blocky1,blockz1,r1,g1,b1,...]
	 	]
	 }
	 */
	
	generateMap(MAP_WIDTH, MAP_HEIGHT);
	
	var x = 0;
	var y = 0;
	
	var elevations;
	$.ajax({ 
		type: 'GET', 
		url: 'http://localhost:1337/map', 
        dataType: 'json',
        timeout: 10000,
        async: false, // same origin, so this is ok 
        success: function (data, status) {
        	elevations = data;
        	y=0;
        	while(y < elevations[0].length)
        	{
        		x=0;
        		while(x < elevations.length)
        		{
        			mymap[x][y].e = elevations[x][y];
        			originalmap[x][y] = {};
        			originalmap[x][y].e = elevations[x][y];
        			x++;
        		}	
        		y++;
        	}	
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	console.log("elevations ajax error");
        }
	});
	
	//originalmap = mymap; // saves original elevations
	
//	var elevationarraystring = "[";
//	y=0;
//	while(y < MAP_WIDTH)
//	{
//		x=0;
//		elevationarraystring = "[";
//		while(x < MAP_HEIGHT)
//		{
//			if(x === MAP_WIDTH-1 && y === MAP_HEIGHT-1) // very last one. Omit comma.
//				elevationarraystring = elevationarraystring + mymap[x][y].e;
//			else if(y === MAP_HEIGHT-1)
//				elevationarraystring = elevationarraystring + mymap[x][y].e + "],[";
//			else
//				elevationarraystring = elevationarraystring + mymap[x][y].e + ",";
//			x++;
//		}	
//		elevationarraystring = elevationarraystring  + "]";
//		console.log("etheria.initializeTiles.sendTransaction(" + y + ", " + elevationarraystring + ", {from:eth.coinbase,gas:3000000});");
//		y++;
//	}	
	//console.log(elevationarraystring);
	
	x = 0;
	y = 0;
	var min = 1000000;
	var max = 0;
	while(x < MAP_WIDTH)
	{
		y=0;
		while(y < MAP_HEIGHT)
		{
			if(mymap[x][y].e > max)
				max = mymap[x][y].e;
			if(mymap[x][y].e < min)
				min = mymap[x][y].e;
			y++;
		}	
		x++;
	}	
	
	var ceiling = max - min; 
	var normalization_factor = 255/ceiling;
	x=0;
	y=0;
	
	while(x < MAP_WIDTH)
	{
		y=0;
		while(y < MAP_HEIGHT)
		{
			mymap[x][y].e = (mymap[x][y].e - min) * normalization_factor;
			drawMapHex(x,y);
			y++;
		}	
		x++;
	}	
	
	// -50 && y even == out of bounds
	// -50 && y odd == OK
	drawBlock(0,0,0,0,0,0, 0xFFCC00); // 8 high column
	drawBlock(0,0,1,0,0,0, 0xFF0000); // 8 high column
	drawBlock(0,0,2,0,0,0, 0x0000FF); // 8 high column
	drawBlock(0,1,0,0,0,0, 0x00FF00); // 8 high column
	drawBlock(0,2,0,0,0,0, 0x00FFFF); // 8 high column
	
//	
	drawBlock(1,0,1,-46,0,0, 0xFF0000); 
	drawBlock(1,0,1,-44,1,0, 0xFF0000); 
	
	drawBlock(2,0,2,-49,-4,0, 0x00FF00); 
	drawBlock(2,0,2,-38,-3,0, 0x00FF00); 
	
	drawBlock(3,1,0,-46,8,0, 0x0000FF); 
	drawBlock(3,1,0,-44,12,0, 0x0000FF); 
	
	drawBlock(4,2,0,-40,0,0, 0xFFFF00); 
	drawBlock(4,2,0,-35,1,0, 0xFFFF00); 
	
	drawBlock(5,1,1,-20,0,0, 0xFF00FF); 
	drawBlock(5,1,1,-15,1,0, 0xFF00FF); 
	
	drawBlock(6,2,2,0,0,0, 0x00FFFF); // CYAN double tower horizontal
	drawBlock(6,1,2,-6,1,0, 0x00FFFF); 
	
	drawBlock(7,2,1,-2,0,0, 0xFF0000); 
	drawBlock(7,2,1,2,1,0, 0xFF0000); 
	
	drawBlock(8,2,2,6,0,0, 0x00FF00); // GREEN double tower se/nw
	drawBlock(8,2,2,10,1,0, 0x00FF00);
	
	drawBlock(9,0,0,14,0,0, 0x0000FF); 
	drawBlock(9,0,0,18,1,0, 0x0000FF);
	
	drawBlock(10,0,0,22,0,0, 0xFF0000); 
	drawBlock(10,0,0,26,1,0, 0xFF0000); 
	
	drawBlock(11,0,0,32,0,0, 0x00FF00); 
	drawBlock(11,0,0,36,1,0, 0x00FF00);
	
	drawBlock(12,0,0,-32,20,0, 0xFF0000); 
	drawBlock(12,0,0,-32,27,0, 0xFF0000); 
	
	drawBlock(13,0,0,-25,20,0, 0x00FF00); 
	drawBlock(13,0,0,-25,27,0, 0x00FF00);
	
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

	if(intersects.length > 0)
	{
		$("#hexinfobodydiv").html(
				"x: " + intersects[ 0 ].object.userData.x + "<br>" +
				"y: " + intersects[ 0 ].object.userData.y + "<br>" +
				"elevation: " + intersects[ 0 ].object.userData.e + "<br>" +
				"owner: " + intersects[ 0 ].object.userData.o
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
	if(mymap[coordx][coordy].e >= SEA_LEVEL && 						// higher than ocean level AND
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
	else if(mymap[coordx][coordy].e < SEA_LEVEL)
	{
		color = WATER_COLOR;
		//texturefile = "images/coast.jpg";
		tiletype = "water";
	}
	else if(mymap[coordx][coordy].e < SAND_LEVEL)
	{
		color = SAND_COLOR;
		texturefile = "images/sand.jpg";
		tiletype = "sand";
	}
	else if(mymap[coordx][coordy].e < GRASSLAND_LEVEL)
	{
		color = GRASSLAND_COLOR;
		texturefile = "images/grass3.jpg";
		tiletype = "grassland";
	}
	else if(mymap[coordx][coordy].e < HILLS_LEVEL)
	{
		color = HILLS_COLOR;
		texturefile = "images/hills.jpg";
		tiletype = "hills";
	}
	else if(mymap[coordx][coordy].e <= 256)
	{
		if(mymap[coordx][coordy].e > 255)
		{
			//mymap[coordx][coordy].e = 255; // sometimes multiplicative factors put the very top over 255, if so, chop it off
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
			//color_hsl.l = color_hsl.l * mymap[coordx][coordy].e / 255; 											// this is the original, but the light/dark was too drastic.
			color_hsl.l = color_hsl.l * ((255 - mymap[coordx][coordy].e)*2/5 + mymap[coordx][coordy].e) / 255;  // this version softens. 128/255 = ~.5 becomes (((255-128)*2/3) + 128) / 255 = .8333 (repeating, of course)
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
	
	var extrudeamount = mymap[coordx][coordy].e;
	if(mymap[coordx][coordy].e < SEA_LEVEL)
	{
		extrudeamount = SEA_LEVEL * EXTRUSION_FACTOR;
	}	
	else
	{
		extrudeamount = mymap[coordx][coordy].e * EXTRUSION_FACTOR;
	}	
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
		texture1.repeat.set( 1, 1 );
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
	
	mesh.userData.e = originalmap[coordx][coordy].e;
	mesh.userData.o = mymap[coordx][coordy].o;
	mesh.userData.x = coordx;
	mesh.userData.y = coordy;

	scene.add( mesh );
	
	return;
}

function drawBlock(which, coordx, coordy, x, y, z, color)
{
	// This seems more complicated than it should be, but I don't think it is. 
	// The issue is that a block of a certain configuration,
	// is actually a different configuration depending on whether its rows are odd or even
	// e.g. a straight line to the NE, starting at 0,0 the other 3 blocks are 0,1, 1,2 and 1,3 (x,y+1, x+1,y+2 and x+1,y+3)
	// but starting at 0,1 the other 3 blocks are 1,2, 1,3 and 1, 3 (x+1,y+1, x+1,y+2 and x+2,y+3)
	// See? Kinda weird.
	var offset = 0;
	if(y % 2 !== 0) // if the starting y is odd
		offset = 1;
	
	if(which === 0) // 8 high column
	{
		drawBlockHex(coordx, coordy, x, y, z, color);
		drawBlockHex(coordx, coordy, x, y, z+1, darkenColor(color, .98));
		drawBlockHex(coordx, coordy, x, y, z+2, darkenColor(color, .96));
		drawBlockHex(coordx, coordy, x, y, z+3, darkenColor(color, .94));
		drawBlockHex(coordx, coordy, x, y, z+4, darkenColor(color, .92));
		drawBlockHex(coordx, coordy, x, y, z+5, darkenColor(color, .90));
		drawBlockHex(coordx, coordy, x, y, z+6, darkenColor(color, .88));
		drawBlockHex(coordx, coordy, x, y, z+7, darkenColor(color, .86));
	}	
	else if(which === 1) // diagonal beam ne/sw
	{
		drawBlockHex(coordx, coordy, x, y, z, color);
		drawBlockHex(coordx, coordy, x+offset, y+1, z, darkenColor(color, .98));
		drawBlockHex(coordx, coordy, x+1, y+2, z, darkenColor(color, .96));
		drawBlockHex(coordx, coordy, x+1+offset, y+3, z, darkenColor(color, .94));
		drawBlockHex(coordx, coordy, x+2, y+4, z, darkenColor(color, .92));
		drawBlockHex(coordx, coordy, x+2+offset, y+5, z, darkenColor(color, .90));
		drawBlockHex(coordx, coordy, x+3, y+6, z, darkenColor(color, .88));
		drawBlockHex(coordx, coordy, x+3+offset, y+7, z, darkenColor(color, .86));
	}
	else if(which === 2) // horizontal beam
	{
		drawBlockHex(coordx, coordy, x, y, z, color);
		drawBlockHex(coordx, coordy, x+1, y, z, darkenColor(color, .98));
		drawBlockHex(coordx, coordy, x+2, y, z, darkenColor(color, .96));
		drawBlockHex(coordx, coordy, x+3, y, z, darkenColor(color, .94));
		drawBlockHex(coordx, coordy, x+4, y, z, darkenColor(color, .92));
		drawBlockHex(coordx, coordy, x+5, y, z, darkenColor(color, .90));
		drawBlockHex(coordx, coordy, x+6, y, z, darkenColor(color, .88));
		drawBlockHex(coordx, coordy, x+7, y, z, darkenColor(color, .86));
	}
	else if(which === 3) // diagonal beam nw/se
	{
		drawBlockHex(coordx, coordy, x, y, z, color);
		drawBlockHex(coordx, coordy, x-1+offset, y+1, z, darkenColor(color, .98));
		drawBlockHex(coordx, coordy, x-1, y+2, z, darkenColor(color, .96));
		drawBlockHex(coordx, coordy, x-2+offset, y+3, z, darkenColor(color, .94));
		drawBlockHex(coordx, coordy, x-2, y+4, z, darkenColor(color, .92));
		drawBlockHex(coordx, coordy, x-3+offset, y+5, z, darkenColor(color, .90));
		drawBlockHex(coordx, coordy, x-3, y+6, z, darkenColor(color, .88));
		drawBlockHex(coordx, coordy, x-4+offset, y+7, z, darkenColor(color, .86));
	}
	else if(which === 4) // diagonal snake sw/ne
	{
		drawBlockHex(coordx, coordy, x, y, z, color);
		drawBlockHex(coordx, coordy, x+1, y, z, darkenColor(color, .98));
		drawBlockHex(coordx, coordy, x+1+offset, y+1, z, darkenColor(color, .96));
		drawBlockHex(coordx, coordy, x+2+offset, y+1, z, darkenColor(color, .94));
		drawBlockHex(coordx, coordy, x+3, y+2, z, darkenColor(color, .92));
		drawBlockHex(coordx, coordy, x+4, y+2, z, darkenColor(color, .90));
		drawBlockHex(coordx, coordy, x+4+offset, y+3, z, darkenColor(color, .88));
		drawBlockHex(coordx, coordy, x+5+offset, y+3, z, darkenColor(color, .86));
	}
	else if(which === 5) // diagonal snake se/nw
	{
		drawBlockHex(coordx, coordy, x, y, z, color);
		drawBlockHex(coordx, coordy, x-1, y, z, darkenColor(color, .98));
		drawBlockHex(coordx, coordy, x-2+offset, y+1, z, darkenColor(color, .96));
		drawBlockHex(coordx, coordy, x-3+offset, y+1, z, darkenColor(color, .94));
		drawBlockHex(coordx, coordy, x-3, y+2, z, darkenColor(color, .92));
		drawBlockHex(coordx, coordy, x-4, y+2, z, darkenColor(color, .90));
		drawBlockHex(coordx, coordy, x-5+offset, y+3, z, darkenColor(color, .88));
		drawBlockHex(coordx, coordy, x-6+offset, y+3, z, darkenColor(color, .86));
	}
	else if(which === 6) // quadruple-decker double-tower horizontal
	{
		drawBlockHex(coordx, coordy, x, y, z, color);
		drawBlockHex(coordx, coordy, x+1, y, z, darkenColor(color, .98));
		drawBlockHex(coordx, coordy, x, y, z+1, darkenColor(color, .96));
		drawBlockHex(coordx, coordy, x+1, y, z+1, darkenColor(color, .94));
		drawBlockHex(coordx, coordy, x, y, z+2, darkenColor(color, .92));
		drawBlockHex(coordx, coordy, x+1, y, z+2, darkenColor(color, .90));
		drawBlockHex(coordx, coordy, x, y, z+3, darkenColor(color, .88));
		drawBlockHex(coordx, coordy, x+1, y, z+3, darkenColor(color, .86));
	}
	else if(which === 7) // quadruple-decker double-tower diagonal sw/ne
	{
		drawBlockHex(coordx, coordy, x, y, z, color);
		drawBlockHex(coordx, coordy, x+offset, y+1, z, darkenColor(color, .98));
		drawBlockHex(coordx, coordy, x, y, z+1, darkenColor(color, .96));
		drawBlockHex(coordx, coordy, x+offset, y+1, z+1, darkenColor(color, .94));
		drawBlockHex(coordx, coordy, x, y, z+2, darkenColor(color, .92));
		drawBlockHex(coordx, coordy, x+offset, y+1, z+2, darkenColor(color, .90));
		drawBlockHex(coordx, coordy, x, y, z+3, darkenColor(color, .88));
		drawBlockHex(coordx, coordy, x+offset, y+1, z+3, darkenColor(color, .86));
	}
	else if(which === 8) // quadruple-decker double-tower diagonal se/nw
	{
		drawBlockHex(coordx, coordy, x, y, z, color);
		drawBlockHex(coordx, coordy, x-1+offset, y+1, z, darkenColor(color, .98));
		drawBlockHex(coordx, coordy, x, y, z+1, darkenColor(color, .96));
		drawBlockHex(coordx, coordy, x-1+offset, y+1, z+1, darkenColor(color, .94));
		drawBlockHex(coordx, coordy, x, y, z+2, darkenColor(color, .92));
		drawBlockHex(coordx, coordy, x-1+offset, y+1, z+2, darkenColor(color, .90));
		drawBlockHex(coordx, coordy, x, y, z+3, darkenColor(color, .88));
		drawBlockHex(coordx, coordy, x-1+offset, y+1, z+3, darkenColor(color, .86));
	}
	else if(which === 9) // double-decker diagonal beam ne/sw
	{
		drawBlockHex(coordx, coordy, x, y, z, color);
		drawBlockHex(coordx, coordy, x+offset, y+1, z, darkenColor(color, .98));
		drawBlockHex(coordx, coordy, x+1, y+2, z, darkenColor(color, .96));
		drawBlockHex(coordx, coordy, x+1+offset, y+3, z, darkenColor(color, .94));
		drawBlockHex(coordx, coordy, x, y, z+1, darkenColor(color, .92));
		drawBlockHex(coordx, coordy, x+offset, y+1, z+1, darkenColor(color, .90));
		drawBlockHex(coordx, coordy, x+1, y+2, z+1, darkenColor(color, .88));
		drawBlockHex(coordx, coordy, x+1+offset, y+3, z+1, darkenColor(color, .86));
	}
	else if(which === 10) // double-decker horizontal beam
	{
		drawBlockHex(coordx, coordy, x, y, z, color);
		drawBlockHex(coordx, coordy, x+1, y, z, darkenColor(color, .98));
		drawBlockHex(coordx, coordy, x+2, y, z, darkenColor(color, .96));
		drawBlockHex(coordx, coordy, x+3, y, z, darkenColor(color, .94));
		drawBlockHex(coordx, coordy, x+0, y, z+1, darkenColor(color, .92));
		drawBlockHex(coordx, coordy, x+1, y, z+1, darkenColor(color, .90));
		drawBlockHex(coordx, coordy, x+2, y, z+1, darkenColor(color, .88));
		drawBlockHex(coordx, coordy, x+3, y, z+1, darkenColor(color, .86));
	}
	else if(which === 11) // double-decker diagonal beam nw/se
	{
		drawBlockHex(coordx, coordy, x, y, z, darkenColor(color, 1));
		drawBlockHex(coordx, coordy, x-1+offset, y+1, z, darkenColor(color, .98));
		drawBlockHex(coordx, coordy, x-1, y+2, z, darkenColor(color, .96));
		drawBlockHex(coordx, coordy, x-2+offset, y+3, z, darkenColor(color, .94));
		drawBlockHex(coordx, coordy, x, y, z+1, darkenColor(color, .92));
		drawBlockHex(coordx, coordy, x-1+offset, y+1, z+1, darkenColor(color, .90));
		drawBlockHex(coordx, coordy, x-1, y+2, z+1, darkenColor(color, .88));
		drawBlockHex(coordx, coordy, x-2+offset, y+3, z+1, darkenColor(color, .86));
	}
	else if(which === 12) // diagonal snake sw/ne
	{
		drawBlockHex(coordx, coordy, x, y, z, darkenColor(color, 1));
		drawBlockHex(coordx, coordy, x+1, y, z, darkenColor(color, .98));
		drawBlockHex(coordx, coordy, x+1+offset, y+1, z, darkenColor(color, .96));
		drawBlockHex(coordx, coordy, x+2+offset, y+1, z, darkenColor(color, .94));
		drawBlockHex(coordx, coordy, x, y, z+1, darkenColor(color, .92));
		drawBlockHex(coordx, coordy, x+1, y, z+1, darkenColor(color, .90));
		drawBlockHex(coordx, coordy, x+1+offset, y+1, z+1, darkenColor(color, .88));
		drawBlockHex(coordx, coordy, x+2+offset, y+1, z+1, darkenColor(color, .86));
	}
	else if(which === 13) // diagonal snake se/nw
	{
		drawBlockHex(coordx, coordy, x, y, z, darkenColor(color, 1));
		drawBlockHex(coordx, coordy, x-1, y, z, darkenColor(color, .98));
		drawBlockHex(coordx, coordy, x-2+offset, y+1, z, darkenColor(color, .96));
		drawBlockHex(coordx, coordy, x-3+offset, y+1, z, darkenColor(color, .94));
		drawBlockHex(coordx, coordy, x, y, z+1, darkenColor(color, .92));
		drawBlockHex(coordx, coordy, x-1, y, z+1, darkenColor(color, .90));
		drawBlockHex(coordx, coordy, x-2+offset, y+1, z+1, darkenColor(color, .88));
		drawBlockHex(coordx, coordy, x-3+offset, y+1, z+1, darkenColor(color, .86));
	}
}

function drawBlockHex(coordx, coordy, x, y, z, color)
{
	var xpoint = (coordx - (MAP_WIDTH-1)/2) * tilewidth;
	if(coordy%2 !== 0)
		xpoint = xpoint + tilewidth/2;
	var ypoint = (coordy - (MAP_HEIGHT-1)/2) * tilevert;
	
	xpoint = xpoint + x * blockwidth;
	if(y%2 !== 0)
		xpoint = xpoint + blockwidth/2;
	ypoint = ypoint + y * blockvert;
	
	var extrudeSettings = {
			amount			: blockextrude,
			steps			: 1,
			material		: 1,
			extrudeMaterial : 0,
			bevelEnabled	: false,
		};
	
	var material = new THREE.MeshBasicMaterial( { color: color } );
	var hexShape = new THREE.Shape();
	var centerPoint = new Point(xpoint, ypoint);
	
	var point0 = hex_corner(centerPoint, blocksize, 0);
	var point1 = hex_corner(centerPoint, blocksize, 1);
	var point2 = hex_corner(centerPoint, blocksize, 2);
	var point3 = hex_corner(centerPoint, blocksize, 3);
	var point4 = hex_corner(centerPoint, blocksize, 4);
	var point5 = hex_corner(centerPoint, blocksize, 5);
	
	hexShape.moveTo( point0.x , point0.y );
	hexShape.lineTo( point1.x, point1.y );
	hexShape.lineTo( point2.x, point2.y );
	hexShape.lineTo( point3.x, point3.y );
	hexShape.lineTo( point4.x, point4.y );
	hexShape.lineTo( point5.x, point5.y );
	hexShape.lineTo( point0.x, point0.y );
	
	var hexGeom = new THREE.ExtrudeGeometry( hexShape, extrudeSettings );

	var mesh = new THREE.Mesh( hexGeom, material );
	var tileextrusion;
	if(mymap[coordx][coordy].e < SEA_LEVEL)
	{
		tileextrusion = SEA_LEVEL * EXTRUSION_FACTOR;
	}	
	else
	{
		tileextrusion = mymap[coordx][coordy].e * EXTRUSION_FACTOR;
	}	
	mesh.position.set( 0, 0, tileextrusion + z * blockextrude);
	scene.add( mesh );
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