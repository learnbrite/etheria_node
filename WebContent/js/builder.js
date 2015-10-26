var container;
var camera, controls, scene, renderer;
var mesh;
var mapsize = 33;
var LEVELS =  Math.cbrt(mapsize - 1) + 1;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var useblocknumbertextures = true;
var highlightkeyhex = true;
var tilecol = 15;
var tilerow = 9;
//this tiles setup won't be used if getting map from blockchain
var tiles;
var tile;

document.addEventListener("DOMContentLoaded", function(event) {
	$.ajax({ 
		type: 'GET', 
		url: '/map', 
	    dataType: 'json',
	    timeout: 100000,
	    async: true, // same origin, so this is ok 
	    success: function (data, status) {
	    	tiles = data;
	    	tile = tiles[tilecol][tilerow];
	    	
	    	init();
	    	animate();
	    },
	    error: function (XMLHttpRequest, textStatus, errorThrown) {
	    	console.log("elevations ajax error");
	    }
	});
	
});

function init() {
	
	var xpoint = (tilecol - (mapsize-1)/2) * tilewidth;
	if(tilerow%2 !== 0)
		xpoint = xpoint + tilewidth/2;
	var ypoint = (tilerow - (mapsize-1)/2) * tilevert;
	
	xpoint = xpoint + tilecol * blockwidth;
	if(tilerow%2 !== 0)
		xpoint = xpoint + blockwidth/2;
	ypoint = ypoint + tilerow * blockvert;
	
	//camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 40000);
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 40000);
	//camera.position.set(0,0,500);
	camera.position.x = xpoint;
	camera.position.y = ypoint;
	camera.position.z = 150;

	controls = new THREE.OrbitControls(camera);
	controls.damping = 0.2;
	controls.addEventListener('change', render);
	
	controls.target.set(xpoint,ypoint,0);

	scene = new THREE.Scene();
	// world
	
	for(var col = 0; col < mapsize; col++)
	{
		for(var row = 0; row < mapsize; row++)
		{
		
//			if(NORMALIZE_ELEVATIONS)
//				tiles[x][y].elevation = (tiles[x][y].elevation - min) * tiles[x][y].normalization_factor;
			drawMapHex(col,row);
			
			if(tiles[col][row].blocks)
			{
				for(var b = 0; b < tiles[col][row].blocks.length; b++)
				{
					if(tiles[col][row].blocks[b][3] >= 0) // z below 0 doesn't get drawn
					{	
						//console.log("drawing block col=" + col + " row=" + row + " " + JSON.stringify(tiles[col][row].blocks[b]));
						//editBlock(16,16,t,c,r,z, getRandomIntInclusive(0,16777214));
						editBlock(col,row,b,
								[tiles[col][row].blocks[b][0], // which
								tiles[col][row].blocks[b][1], // x
								tiles[col][row].blocks[b][2],  // y
								tiles[col][row].blocks[b][3],  // z
								tiles[col][row].blocks[b][4]] // 256 color possibilities (0-255) each times 65536 will produce numbers in the range hex color range 0-16777216
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

