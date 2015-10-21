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
	 	"blocks": [[0,1,2,3,4]...]  // where [which,x,y,z,color]
	 	]
	 }
*/

var container;

var GENERATE_NEW_MAP = false;
var camera, controls, scene, renderer;
var mesh;

var mapsize = 33;
var map;
map = new Array(mapsize);
for (i = 0; i < mapsize; i++) {
	  map[i] = new Array(mapsize);
}	

var LEVELS =  Math.cbrt(mapsize - 1) + 1;

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

function init() {

	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 40000);
	//camera.position.set(0,-200,150);
	camera.position.z = 200;

	controls = new THREE.OrbitControls(camera);
	controls.damping = 0.2;
	controls.addEventListener('change', render);

	scene = new THREE.Scene();
	// world
	
	if(GENERATE_NEW_MAP)
	{	
		generateMap(mapsize, mapsize);
		
//		var c = 0;
//		var r = 0;
//		var t = 0;
//		var z = 0;
//		var created = 0;
//		var drewblock = false;
//		
//		while(created < 30)
//		{
//			t = getRandomIntInclusive(0,31);
//			c = getRandomIntInclusive(-50,50);
//			r = getRandomIntInclusive(-66,66);
//			z = getRandomIntInclusive(0,0);
//			drewblock = false;
//			while(drewblock == false)
//			{
//				t = getRandomIntInclusive(0,31);
//				c = getRandomIntInclusive(-50,50);
//				r = getRandomIntInclusive(-66,66);
//				z =  getRandomIntInclusive(0,0);
//				drewblock = drawBlock(16,16,t,c,r,z, getRandomIntInclusive(0,16777214));
//			}	
//			created++;
//		}	
//		
		// TESTS // DO NOT DELETE
		drawBlock(16,16,0,0,0,0, getRandomIntInclusive(0,16777214)); // succeed
		drawBlock(16,16,0,0,66,0, getRandomIntInclusive(0,16777214)); // succeed
//		drawBlock(16,16,0,49,33,0, getRandomIntInclusive(0,16777214)); // succeed
//		drawBlock(16,16,0,49,-33,0, getRandomIntInclusive(0,16777214)); // succeed
//		drawBlock(16,16,0,0,-66,0, getRandomIntInclusive(0,16777214)); // succeed
//		drawBlock(16,16,0,-50,33,0, getRandomIntInclusive(0,16777214)); // succeed
//		drawBlock(16,16,0,-50,-33,0, getRandomIntInclusive(0,16777214)); // succeed
//		drawBlock(8,8,0,0,67,0, getRandomIntInclusive(0,16777214)); // fail
//		drawBlock(8,8,0,1,66,0, getRandomIntInclusive(0,16777214)); // fail
//		drawBlock(8,8,0,-1,66,0, getRandomIntInclusive(0,16777214)); // fail
//		drawBlock(8,8,0,50,33,0, getRandomIntInclusive(0,16777214)); // fail
//		drawBlock(8,8,0,50,-33,0, getRandomIntInclusive(0,16777214)); // fail
//		drawBlock(8,8,0,-67,0,0, getRandomIntInclusive(0,16777214)); // fail
//		drawBlock(8,8,0,-51,33,0, getRandomIntInclusive(0,16777214)); // fail
//		drawBlock(8,8,0,-51,-33,0, getRandomIntInclusive(0,16777214)); // fail
//		drawBlock(8,8,0,0,0,0, getRandomIntInclusive(0,16777214));
//		drawBlock(8,8,0,0,0,-1, getRandomIntInclusive(0,16777214));  // fail
//		drawBlock(8,8,0,0,0,5, getRandomIntInclusive(0,16777214));	 // fail
//		drawBlock(8,8,0,0,0,8, getRandomIntInclusive(0,16777214));	 // succeed
//		
//		drawBlock(8,8,1,0,2,0, getRandomIntInclusive(0,16777214));	// succeed (flat on ground)
//		drawBlock(8,8,1,4,2,1, getRandomIntInclusive(0,16777214));  // fail (doesn't rest on anything)
//		drawBlock(8,8,1,0,3,0, getRandomIntInclusive(0,16777214));	// fail (overlaps)
//		drawBlock(8,8,1,0,3,1, getRandomIntInclusive(0,16777214));	// succeeds (rests on first, offset by 1)
//		drawBlock(8,8,1,4,10,2, getRandomIntInclusive(0,16777214));	// succeeds (rests on previous, at the very end)
		
//		drawBlock(8,8,1,-4,-4,0, getRandomIntInclusive(0,16777214));
//		drawBlock(8,8,1,5,5,0, getRandomIntInclusive(0,16777214));
//		drawBlock(8,8,2,15,15,10, getRandomIntInclusive(0,16777214));
//		drawBlock(8,8,3,25,25,10, getRandomIntInclusive(0,16777214));
		//drawBlock(8,8,0,5,5,0, getRandomIntInclusive(0,16777214));
		
		//drawBlock(8,8,0,0,0,8, getRandomIntInclusive(0,16777214));
//		drawBlock(8,8,0,0,0,8, getRandomIntInclusive(0,16777214));
//		drawBlock(8,8,1,5,5,0, getRandomIntInclusive(0,16777214));
//		
//		drawBlock(8,8,2,6,5,0, getRandomIntInclusive(0,16777214));
//		
//		drawBlock(8,8,3,-5,-5,0, getRandomIntInclusive(0,16777214));

//		console.log(JSON.stringify(map));
	}
	else
	{	
		$.ajax({ 
			type: 'GET', 
			url: 'http://localhost:1337/map', 
	        dataType: 'json',
	        timeout: 100000,
	        async: false, // same origin, so this is ok 
	        success: function (data, status) {
	        	//console.log('back from /map');
	        	//console.log(JSON.stringify(data));
	        	map = data;
	        },
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	        	console.log("elevations ajax error");
	        }
		});
	}
	
	
	for(var col = 0; col < mapsize; col++)
	{
		for(var row = 0; row < mapsize; row++)
		{
		
//			if(NORMALIZE_ELEVATIONS)
//				map[x][y].elevation = (map[x][y].elevation - min) * map[x][y].normalization_factor;
			drawMapHex(col,row);
			
			if(map[col][row].blocks)
			{
				for(var b = 0; b < map[col][row].blocks.length; b++)
				{
					if(map[col][row].blocks[b][3] >= 0) // z below 0 doesn't get drawn
					{	
						console.log("drawing block col=" + col + " row=" + row + " " + JSON.stringify(map[col][row].blocks[b]));
						//drawBlock(16,16,t,c,r,z, getRandomIntInclusive(0,16777214));
						drawBlock(col,row,
								map[col][row].blocks[b][0], // which
								map[col][row].blocks[b][1], // x
								map[col][row].blocks[b][2],  // y
								map[col][row].blocks[b][3],  // z
								(map[col][row].blocks[b][4]+128) * 65536 // 256 color possibilities (0-255) each times 65536 will produce numbers in the range hex color range 0-16777216
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

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children, true);

	if(intersects.length > 0)
	{
		if(typeof intersects[ 0 ].object.userData.col !== "undefined")
		{
			$("#tileinfobodydiv").html(
					"<b>col:</b> " + intersects[ 0 ].object.userData.col + " " +
					"<b>row:</b> " + intersects[ 0 ].object.userData.row + "<br>" +
					"<b>type:</b> " + intersects[ 0 ].object.userData.tiletype + "<br>" + 
					"<b>elevation:</b> " + intersects[ 0 ].object.userData.elevation + "<br>" +
					"<b>owner:</b> " + intersects[ 0 ].object.userData.owner + "<br>" +
					"<b>name:</b> " + intersects[ 0 ].object.userData.name + "<br>" +
					"<b>status:</b> " + intersects[ 0 ].object.userData.name + "<br>" +
					"<b>offers:</b> " + JSON.stringify(intersects[ 0 ].object.userData.offers) + "<br>" + // offerers/offers will be combined soon.
					"<b>blocks:</b> " + JSON.stringify(intersects[ 0 ].object.userData.blocks)
			);
		}
		else
			$("#tileinfobodydiv").html("Mouse over a tile to see more info.");
		
		if(typeof intersects[ 0 ].object.userData.which !== "undefined")
		{
			$("#blockinfobodydiv").html(
					"<b>block type:</b> " + intersects[ 0 ].object.userData.which + "<br>" +
					"<b>block description:</b> " + intersects[ 0 ].object.userData.description + "<br>" +
					"<b>block occupies:</b> " + JSON.stringify(intersects[ 0 ].object.userData.occupies)
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
			$("#hexinfobodydiv").html("Mouse over a hex to see more info.")
		}	
	}	
	renderer.render(scene, camera);
}

function animate() {

	requestAnimationFrame(animate);
	controls.update();
}

