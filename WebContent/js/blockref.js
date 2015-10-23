var container;

var camera, controls, scene, renderer;
var mesh;

var mapsize = 1;
var tiles;
tiles = new Array(mapsize);
for (i = 0; i < mapsize; i++) {
	  tiles[i] = new Array(mapsize);
}	

var LEVELS =  Math.cbrt(mapsize - 1) + 1;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var useblocknumbertextures = true;
var highlightkeyhex = true;

document.addEventListener("DOMContentLoaded", function(event) {
	init();
	animate();
});

function getRandomIntInclusive(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function init() {
	tiles[0][0] ={};
	tiles[0][0].elevation = 195;
	tiles[0][0].owner = 'nobody';
	 tiles[0][0].owner = '0x0000000000000000000000000000000000000000';
	  tiles[0][0].name = "Not set";
	  tiles[0][0].status = "Not set";
	  tiles[0][0].offerers = [];
	  tiles[0][0].offers = [];
	  tiles[0][0].blocks = [
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],
	                        [0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20],[0,0,0,-1,20]
	                        
	                       
	                        ]; 
	  tiles[0][0].lastfarm = 0;
	  tiles[0][0].occupado = []; // will contain arrays of 3
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 40000);
	camera.position.z = 18;

	controls = new THREE.OrbitControls(camera);
	controls.damping = 0.2;
	controls.addEventListener('change', render);

	scene = new THREE.Scene();
	// world
	
	drawMapHex(0,0);
	
	// -50 && y even == out of bounds
	// -50 && y odd == OK
	//editBlock(0,0,0,0,0,0, 0xFFCC00); // 8 high column
	
	editBlock(0,0,0,[0,-40,-28,0, 82]); 
	editBlock(0,0,1,[1,-28,-28,0, 82]); 
	editBlock(0,0,2,[2,-16,-28,0, 82]); 
	editBlock(0,0,3,[3,-4,-28,0, 82]); 
	editBlock(0,0,4,[4,7,-28,0, 82]); 
	editBlock(0,0,5,[5,21,-28,0, 82]); // CYAN double tower horizontal
	editBlock(0,0,6,[6,32,-28,0, 82]);
	editBlock(0,0,7,[7,44,-28,0, 82]);

	editBlock(0,0,8,[8,-40,-10,0, 82]); 
	editBlock(0,0,9,[9,-28,-10,0, 82]); 
	editBlock(0,0,10,[10,-16,-10,0, 82]); 
	editBlock(0,0,11,[11,-4,-10,0, 82]); 
	editBlock(0,0,12,[12,8,-10,0, 82]); 
	editBlock(0,0,13,[13,20,-10,0, 82]); // CYAN double tower horizontal
	editBlock(0,0,14,[14,32,-10,0, 82]);
	editBlock(0,0,15,[15,44,-10,0, 82]);
	
	editBlock(0,0,16,[16,-40,10,0, 82]); 
	editBlock(0,0,17,[17,-28,10,0, 82]); 
	editBlock(0,0,18,[18,-16,10,0, 82]); 
	editBlock(0,0,19,[19,-4,10,0, 82]); 
	editBlock(0,0,20,[20,8,10,0, 82]); 
	editBlock(0,0,21,[21,20,10,0, 82]); // CYAN double tower horizontal
	editBlock(0,0,22,[22,32,10,0, 82]);
	editBlock(0,0,23,[23,44,10,0, 82]);
	
	editBlock(0,0,24,[24,-40,28,0, 82]); 
	editBlock(0,0,25,[25,-28,28,0, 82]); 
	editBlock(0,0,26,[26,-16,28,0, 82]); 
	editBlock(0,0,27,[27,-4,28,0, 82]); 
	editBlock(0,0,28,[28,8,28,0, 82]); 
	editBlock(0,0,29,[29,20,28,0, 82]); // CYAN double tower horizontal
	editBlock(0,0,30,[30,32,28,0, 82]);
	editBlock(0,0,31,[31,44,28,0, 82]);
	
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
	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children, true);

	if(intersects.length > 0)
	{
		if(typeof intersects[ 0 ].object.userData.which !== "undefined")
		{
			var occ = intersects[ 0 ].object.userData.occupies;
			var outer = [];
			var arr;
			for(var x = 0; x < occ.length; x+=3)
			{
				arr = [];
				arr[0] = occ[x];
				arr[1] = occ[x+1];
				arr[2] = occ[x+2];
				outer.push(arr);
			}	
			D
			$("#blockinfobodydiv").html(
					"<b>block type:</b> " + intersects[ 0 ].object.userData.which + "<br>" +
					"<b>block description:</b> " + intersects[ 0 ].object.userData.description + "<br>" +
					"<b>block occupies:</b> " + JSON.stringify(outer)
					);
		}
		else
			$("#blockinfobodydiv").html("Mouse over a block to see more info.");
		
		if(typeof intersects[ 0 ].object.userData.x !== "undefined")
		{	
			$("#hexinfobodydiv").html(
					"<b>x:</b> " + intersects[ 0 ].object.userData.x + "<br>" +
					"<b>y:</b> " + intersects[ 0 ].object.userData.y + "<br>" + 
					"<b>z:</b> " + intersects[ 0 ].object.userData.z + "<br>" +
					"<b>color:</b> " + intersects[ 0 ].object.userData.color.toString(16) + "<br>" +
					"<b>sequencenum:</b> " + intersects[ 0 ].object.userData.sequencenum + "<br><br>" + 
					"<span style='font-size:11px;font-style:italic'>Note: If a key hex is on an odd row, then other hexes in the same block on odd rows will be offset by x+1.</span>"
			);
		}
		else
		{
			$("#hexinfobodydiv").html("Mouse over a hex to see more info. (Key hexes are white.)")
		}	
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



function hex_corner(center, size, i){
    var angle_deg = 60 * i   + 30
    var angle_rad = Math.PI / 180 * angle_deg
    return new Point(center.x + size * Math.cos(angle_rad),
                 center.y + size * Math.sin(angle_rad))
} 

