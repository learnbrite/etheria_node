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

var colors = ["000000","000033","000066","000099","0000CC","0000FF","003300","003333","003366","003399","0033CC","0033FF","006600","006633","006666","006699","0066CC","0066FF","009900","009933","009966","009999",
 "0099CC","0099FF","00CC00","00CC33","00CC66","00CC99","00CCCC","00CCFF","00FF00","00FF33","00FF66","00FF99","00FFCC","00FFFF","330000","330033","330066","330099","3300CC","3300FF","333300","333333",
 "333366","333399","3333CC","3333FF","336600","336633","336666","336699","3366CC","3366FF","339900","339933","339966","339999","3399CC","3399FF","33CC00","33CC33","33CC66","33CC99","33CCCC","33CCFF",
 "33FF00","33FF33","33FF66","33FF99","33FFCC","33FFFF","660000","660033","660066","660099","6600CC","6600FF","663300","663333","663366","663399","6633CC","6633FF","666600","666633","666666","666699",
 "6666CC","6666FF","669900","669933","669966","669999","6699CC","6699FF","66CC00","66CC33","66CC66","66CC99","66CCCC","66CCFF","66FF00","66FF33","66FF66","66FF99","66FFCC","66FFFF","990000","990033",
 "990066","990099","9900CC","9900FF","993300","993333","993366","993399","9933CC","9933FF","996600","996633","996666","996699","9966CC","9966FF","999900","999933","999966","999999","9999CC","9999FF",
 "99CC00","99CC33","99CC66","99CC99","99CCCC","99CCFF","99FF00","99FF33","99FF66","99FF99","99FFCC","99FFFF","CC0000","CC0033","CC0066","CC0099","CC00CC","CC00FF","CC3300","CC3333","CC3366","CC3399",
 "CC33CC","CC33FF","CC6600","CC6633","CC6666","CC6699","CC66CC","CC66FF","CC9900","CC9933","CC9966","CC9999","CC99CC","CC99FF","CCCC00","CCCC33","CCCC66","CCCC99","CCCCCC","CCCCFF","CCFF00","CCFF33",
 "CCFF66","CCFF99","CCFFCC","CCFFFF","FF0000","FF0033","FF0066","FF0099","FF00CC","FF00FF","FF3300","FF3333","FF3366","FF3399","FF33CC","FF33FF","FF6600","FF6633","FF6666","FF6699","FF66CC","FF66FF",
 "FF9900","FF9933","FF9966","FF9999","FF99CC","FF99FF","FFCC00","FFCC33","FFCC66","FFCC99","FFCCCC","FFCCFF","FFFF00","FFFF33","FFFF66","FFFF99","FFFFCC","FFFFFF"];

var container;

var GENERATE_NEW_MAP = false;
var camera, controls, scene, renderer;
var mesh;

var mapsize = 33;

// this tiles setup won't be used if getting map from blockchain
var tiles;
tiles = new Array(mapsize);
for (var i = 0; i < mapsize; i++) {
	  tiles[i] = new Array(mapsize);
	  for(var j = 0; j < mapsize; j++)
	  {
		  tiles[i][j] = {};
		  tiles[i][j].owner = '0x0000000000000000000000000000000000000000';
		  tiles[i][j].name = "Not set";
		  tiles[i][j].status = "Not set";
		  tiles[i][j].offerers = [];
		  tiles[i][j].offers = [];
		  tiles[i][j].blocks = [
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
		  tiles[i][j].lastfarm = 0;
		  tiles[i][j].occupado = []; // will contain arrays of 3
	  }  
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
		
		for(var col = 0; col < mapsize; col++)
		{
			for(var row = 0; row < mapsize; row++)
			{
			
//				if(NORMALIZE_ELEVATIONS)
//					tiles[x][y].elevation = (tiles[x][y].elevation - min) * tiles[x][y].normalization_factor;
				drawMapHex(col,row);
				
				if(col === 16 && row === 16)
				{	
					var c = 0;
					var r = 0;
					var t = 0;
					var z = 0;
					var created = 0;
					var editedblock = false;
					
					while(created < 300)
					{
						t = getRandomIntInclusive(0,31);
						c = getRandomIntInclusive(0,7);
						r = getRandomIntInclusive(0,7);
						z = getRandomIntInclusive(0,100);
						editedblock = false;
						while(editedblock == false)
						{
							t = getRandomIntInclusive(0,31);
							c = getRandomIntInclusive(0,7);
							r = getRandomIntInclusive(0,7);
							z = getRandomIntInclusive(0,100);
							editedblock = editBlock(16,16,created,[t,c,r,z, getRandomIntInclusive(0,16777214)]);
						}	
						created++;
					}	
				}
			}
		}
		
		// TESTS // DO NOT DELETE
//		console.log('drawing 7 columns 0,0');
//		editBlock(16,16,0,[0,0,0,0, getRandomIntInclusive(0,16777214)]); // succeed
//		console.log('drawing 7 columns 0,66');
//		editBlock(16,16,1,[0,0,66,0, getRandomIntInclusive(0,16777214)]); // succeed
//		console.log('drawing 7 columns 49,33');
//		editBlock(16,16,2,[0,49,33,0, getRandomIntInclusive(0,16777214)]); // succeed
//		console.log('drawing 7 columns 49,-33');
//		editBlock(16,16,3,[0,49,-33,0, getRandomIntInclusive(0,16777214)]); // succeed
//		console.log('drawing 7 columns 0,-66');
//		editBlock(16,16,4,[0,0,-66,0, getRandomIntInclusive(0,16777214)]); // succeed
//		console.log('drawing 7 columns -50,-33');
//		editBlock(16,16,5,[0,-50,-33,0, getRandomIntInclusive(0,16777214)]); // succeed
//		console.log('drawing 7 columns -50,33');
//		editBlock(16,16,6,[0,-50,33,0, getRandomIntInclusive(0,16777214)]); // succeed

		
//		editBlock(16,16,0,[1,0,0,0, getRandomIntInclusive(0,16777214)]); // succeed
//		editBlock(16,16,1,[2,0,3,0, getRandomIntInclusive(0,16777214)]); // conflict
		
		
		
	
//		editBlock(8,8,0,0,67,0, getRandomIntInclusive(0,16777214)); // fail
//		editBlock(8,8,0,1,66,0, getRandomIntInclusive(0,16777214)); // fail
//		editBlock(8,8,0,-1,66,0, getRandomIntInclusive(0,16777214)); // fail
//		editBlock(8,8,0,50,33,0, getRandomIntInclusive(0,16777214)); // fail
//		editBlock(8,8,0,50,-33,0, getRandomIntInclusive(0,16777214)); // fail
//		editBlock(8,8,0,-67,0,0, getRandomIntInclusive(0,16777214)); // fail
//		editBlock(8,8,0,-51,33,0, getRandomIntInclusive(0,16777214)); // fail
//		editBlock(8,8,0,-51,-33,0, getRandomIntInclusive(0,16777214)); // fail
//		editBlock(8,8,0,0,0,0, getRandomIntInclusive(0,16777214));
//		editBlock(8,8,0,0,0,-1, getRandomIntInclusive(0,16777214));  // fail
//		editBlock(8,8,0,0,0,5, getRandomIntInclusive(0,16777214));	 // fail
//		editBlock(8,8,0,0,0,8, getRandomIntInclusive(0,16777214));	 // succeed
//		
//		editBlock(8,8,1,0,2,0, getRandomIntInclusive(0,16777214));	// succeed (flat on ground)
//		editBlock(8,8,1,4,2,1, getRandomIntInclusive(0,16777214));  // fail (doesn't rest on anything)
//		editBlock(8,8,1,0,3,0, getRandomIntInclusive(0,16777214));	// fail (overlaps)
//		editBlock(8,8,1,0,3,1, getRandomIntInclusive(0,16777214));	// succeeds (rests on first, offset by 1)
//		editBlock(8,8,1,4,10,2, getRandomIntInclusive(0,16777214));	// succeeds (rests on previous, at the very end)
		
//		editBlock(8,8,1,-4,-4,0, getRandomIntInclusive(0,16777214));
//		editBlock(8,8,1,5,5,0, getRandomIntInclusive(0,16777214));
//		editBlock(8,8,2,15,15,10, getRandomIntInclusive(0,16777214));
//		editBlock(8,8,3,25,25,10, getRandomIntInclusive(0,16777214));
		//editBlock(8,8,0,5,5,0, getRandomIntInclusive(0,16777214));
		
		//editBlock(8,8,0,0,0,8, getRandomIntInclusive(0,16777214));
//		editBlock(8,8,0,0,0,8, getRandomIntInclusive(0,16777214));
//		editBlock(8,8,1,5,5,0, getRandomIntInclusive(0,16777214));
//		
//		editBlock(8,8,2,6,5,0, getRandomIntInclusive(0,16777214));
//		
//		editBlock(8,8,3,-5,-5,0, getRandomIntInclusive(0,16777214));

//		console.log(JSON.stringify(map));
	}
	else
	{	
		$.ajax({ 
			type: 'GET', 
			url: 'http://localhost/map', 
	        dataType: 'json',
	        timeout: 100000,
	        async: false, // same origin, so this is ok 
	        success: function (data, status) {
	        	//console.log('back from /map');
	        	//console.log(JSON.stringify(data));
	        	tiles = data;
	        },
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	        	console.log("elevations ajax error");
	        }
		});
		
		for(var col = 0; col < mapsize; col++)
		{
			for(var row = 0; row < mapsize; row++)
			{
			
//				if(NORMALIZE_ELEVATIONS)
//					tiles[x][y].elevation = (tiles[x][y].elevation - min) * tiles[x][y].normalization_factor;
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
									parseInt("0x" + colors[tiles[col][row].blocks[b][4]+128])] // 256 color possibilities (0-255) each times 65536 will produce numbers in the range hex color range 0-16777216
									);
						}
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

