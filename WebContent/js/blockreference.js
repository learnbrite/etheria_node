var container;
var size = 4; // length of one tile segment
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

var HILLS_COLOR = 0xbaac80;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

document.addEventListener("DOMContentLoaded", function(event) {
	init();
	animate();
});

function init() {

	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 40000);
	camera.position.z = 10;

	controls = new THREE.OrbitControls(camera);
	controls.damping = 0.2;
	controls.addEventListener('change', render);

	scene = new THREE.Scene();
	// world
	
	//drawMapHex(0,0);
	
	// -50 && y even == out of bounds
	// -50 && y odd == OK
	drawBlock(0,0,0,0,0,0, 0xFFCC00); // 8 high column
	
	drawBlock(0,0,1,-20,0,0, 0xFF0000); 
	drawBlock(0,0,2,-49,-4,0, 0x00FF00); 
	drawBlock(0,0,3,-46,8,0, 0x0000FF); 
	drawBlock(0,0,4,-40,0,0, 0xFFFF00); 
	drawBlock(0,0,5,-20,0,0, 0xFF00FF); 
	drawBlock(0,0,6,0,0,0, 0x00FFFF); // CYAN double tower horizontal
	drawBlock(0,0,7,-2,0,0, 0xFF0000); 
	drawBlock(0,0,8,6,0,0, 0x00FF00); // GREEN double tower se/nw
	drawBlock(0,0,9,14,0,0, 0x0000FF); 
	drawBlock(0,0,10,22,0,0, 0xFF0000); 
	drawBlock(0,0,11,32,0,0, 0x00FF00); 
	drawBlock(0,0,12,-32,20,0, 0xFF0000); 
	drawBlock(0,0,13,-25,20,0, 0x00FF00); 
	
	// lights
	light = new THREE.DirectionalLight(0xaaaaaa);
	light.position.set(1, 1, 1);
	scene.add(light);

	light = new THREE.AmbientLight(0xdddddd);
	scene.add(light);

	// renderer
	renderer = new THREE.WebGLRenderer({
		antialias : false
	});
	
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.sortObjects = false;
	
	container = document.getElementById('container');
	container.appendChild(renderer.domElement);

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
	var intersects = raycaster.intersectObjects( scene.children, true);
	if(intersects.length > 0)
	{
		$("#hexinfobodydiv").html("Intersection " + guid);
	}	
	renderer.render(scene, camera);
}

function animate() {

	requestAnimationFrame(animate);
	controls.update();

}

function drawMapHex(coordx, coordy)
{
	var color = HILLS_COLOR;
	var texturefile = "images/hills.jpg";
	var tiletype = "";

	// (coordx - (MAP_WIDTH-1)/2) and (coordy - (MAP_HEIGHT-1)/2) adjust the coords to center in the camera's view
	var xpoint = coordx * tilewidth;
	if(coordy%2 !== 0)
		xpoint = xpoint + tilewidth/2;
	var ypoint = coordy * tilevert;
	
	var extrudeSettings = {
			amount			: 0.2,
			steps			: 1,
			material		: 1,
			extrudeMaterial : 0,
			bevelEnabled	: false,
		};

	var	texture1 = THREE.ImageUtils.loadTexture( texturefile );
	var	material = new THREE.MeshPhongMaterial( { color: color, map: texture1 } );
	texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
	texture1.repeat.set( 1, 1 );
	
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
	
	scene.add( mesh );
	
	return;
}

function drawBlock(coordx, coordy, which, x, y, z, color)
{
	// This seems more complicated than it should be, but I don't think it is. 
	// The issue is that a block of a certain configuration,
	// is actually a different configuration depending on whether its rows are odd or even
	// e.g. a straight line to the NE, starting at 0,0 the other 3 blocks are 0,1, 1,2 and 1,3 (x,y+1, x+1,y+2 and x+1,y+3)
	// but starting at 0,1 the other 3 blocks are 1,2, 1,3 and 1, 3 (x+1,y+1, x+1,y+2 and x+2,y+3)
	// See? Kinda weird.
	console.log("drawblock(" + coordx + ", "+ coordy + ", " + which + "," + x + ", "+ y + ", "+ z + ", " + color);
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

var	texture1 = THREE.ImageUtils.loadTexture( "images/concrete.jpg" );

function drawBlockHex(coordx, coordy, x, y, z, color)
{
	var xpoint = coordx * tilewidth;
	if(coordy%2 !== 0)
		xpoint = xpoint + tilewidth/2;
	var ypoint = coordy * tilevert;
	
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
	
	
	var	material = new THREE.MeshPhongMaterial( { color: color, map: texture1 } );
	texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
	texture1.repeat.set( 10, 10 );
	
//	var material = new THREE.MeshBasicMaterial( { color: color } );
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
	var tileextrusion = 0;
	mesh.position.set( 0, 0, 0.2);
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
	  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
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