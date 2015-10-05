var container;
var seglen = 160;
var camera, controls, scene, renderer;
var mesh;

var MAP_WIDTH = 65;
var MAP_HEIGHT = 65;

document.addEventListener("DOMContentLoaded", function(event) {
	init();
	render();
});

function animate() {

	requestAnimationFrame(animate);
	controls.update();

}

function init() {

	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 40000);
	camera.position.z = 20000;

	controls = new THREE.OrbitControls(camera);
	controls.damping = 0.2;
	controls.addEventListener('change', render);

	scene = new THREE.Scene();
//	scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

	var m = .6; // modifier. Ex 10 becomes 6
	var basey = 0;
	var basex = 0;
	var basez = 0;

	basex = m * -50;
	// column
	basey = m * 0;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xFFCC00); //0
	drawHex2(basex + 0, basey + 0, basez + 1, 0xE6B800);
	drawHex2(basex + 0, basey + 0, basez + 2, 0xCCA300);
	drawHex2(basex + 0, basey + 0, basez + 3, 0xB28F00);
	
	//  /
	basey = m * 0;
	basex = m * -40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000); //1
	drawHex2(basex + 0, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + 2, basez + 0, 0xaa0000);
	drawHex2(basex + 1, basey + 3, basez + 0, 0x880000);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000); //2
	drawHex2(basex + 1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + 2, basey + 0, basez + 0, 0xaa0000);
	drawHex2(basex + 3, basey + 0, basez + 0, 0x880000);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000); //3
	drawHex2(basex + 0, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + -2, basez + 0, 0xaa0000);
	drawHex2(basex + 1, basey + -3, basez + 0, 0x880000);
	
	// honeycomb
	basey = m * 0;
	basex = m * -30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xffff00); //4
	drawHex2(basex + 0, basey + 1, basez + 0, 0xcccc00);
	drawHex2(basex + 0, basey + 2, basez + 0, 0xaaaa00);
	drawHex2(basex + -1, basey + 1, basez + 0, 0x888800);

	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xffff00); //5
	drawHex2(basex + 1, basey + 0, basez + 0, 0xcccc00);
	drawHex2(basex + 0, basey + 1, basez + 0, 0xaaaa00);
	drawHex2(basex + 1, basey + 1, basez + 0, 0x888800);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xffff00); //6
	drawHex2(basex + 0, basey + -1, basez + 0, 0xcccc00);
	drawHex2(basex + 1, basey + 0, basez + 0, 0xaaaa00);
	drawHex2(basex + 1, basey + -1, basez + 0, 0x888800);
	
	//  1
	basey = m * 0;
	basex = m * -20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ff00); //7
	drawHex2(basex + 0, basey + 1, basez + 0, 0x00cc00);
	drawHex2(basex + 0, basey + 2, basez + 0, 0x00aa00);
	drawHex2(basex + 0, basey + 3, basez + 0, 0x008800);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ff00); //8
	drawHex2(basex + 1, basey + 0, basez + 0, 0x00cc00);
	drawHex2(basex + 1, basey + 1, basez + 0, 0x00aa00);
	drawHex2(basex + 2, basey + 1, basez + 0, 0x008800);	
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ff00); //9
	drawHex2(basex + 0, basey + -1, basez + 0, 0x00cc00);
	drawHex2(basex + 1, basey + -1, basez + 0, 0x00aa00);
	drawHex2(basex + 2, basey + -2, basez + 0, 0x008800);
	
	// 2
	basex = m * -10;
	basey = m * 0;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ff00); //10
	drawHex2(basex + 0, basey + 1, basez + 0, 0x00cc00);
	drawHex2(basex + 1, basey + 1, basez + 0, 0x00aa00);
	drawHex2(basex + 2, basey + 2, basez + 0, 0x008800);	
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ff00); //11
	drawHex2(basex + 1, basey + 0, basez + 0, 0x00cc00);
	drawHex2(basex + 1, basey + -1, basez + 0, 0x00aa00);
	drawHex2(basex + 2, basey + -1, basez + 0, 0x008800);	
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ff00); //12
	drawHex2(basex + 0, basey + -1, basez + 0, 0x00cc00);
	drawHex2(basex + 0, basey + -2, basez + 0, 0x00aa00);
	drawHex2(basex + 0, basey + -3, basez + 0, 0x008800);
	
	// brick
	basey = m * 0;
	basex = m * 0;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000); //13
	drawHex2(basex + 0, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 1, basez + 1, 0x880000);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000); //14
	drawHex2(basex + 1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + 1, basey + 0, basez + 1, 0x880000);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000); //15
	drawHex2(basex + 0, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + -1, basez + 1, 0x880000);
	
	// JL
	basey = m * 0;
	basex = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x0000ff); //16
	drawHex2(basex + 0, basey + 1, basez + 0, 0x0000cc);
	drawHex2(basex + 0, basey + 2, basez + 0, 0x0000aa);
	drawHex2(basex + -1, basey + 3, basez + 0, 0x000088);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x0000ff); //17
	drawHex2(basex + 1, basey + 0, basez + 0, 0x0000cc);
	drawHex2(basex + 1, basey + 1, basez + 0, 0x0000aa);
	drawHex2(basex + 2, basey + 2, basez + 0, 0x000088);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x0000ff); //18
	drawHex2(basex + 0, basey + -1, basez + 0, 0x0000cc);
	drawHex2(basex + 1, basey + -1, basez + 0, 0x0000aa);
	drawHex2(basex + 2, basey + -1, basez + 0, 0x000088);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x0000ff); //19
	drawHex2(basex + -1, basey + -1, basez + 0, 0x0000cc);
	drawHex2(basex + 0, basey + -2, basez + 0, 0x0000aa);
	drawHex2(basex + 0, basey + -3, basez + 0, 0x000088);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x0000ff); //20
	drawHex2(basex + -1, basey + 0, basez + 0, 0x0000cc);
	drawHex2(basex + -2, basey + -1, basez + 0, 0x0000aa);
	drawHex2(basex + -2, basey + -2, basez + 0, 0x000088);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x0000ff); //21
	drawHex2(basex + -1, basey + 1, basez + 0, 0x0000cc);
	drawHex2(basex + -2, basey + 1, basez + 0, 0x0000aa);
	drawHex2(basex + -3, basey + 1, basez + 0, 0x000088);
	
	// JR
	basey = m * 0;
	basex = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x0000ff); //22
	drawHex2(basex + 0, basey + 1, basez + 0, 0x0000cc);
	drawHex2(basex + 1, basey + 1, basez + 0, 0x0000aa);
	drawHex2(basex + 2, basey + 1, basez + 0, 0x000088);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x0000ff); //23
	drawHex2(basex + 1, basey + 0, basez + 0, 0x0000cc);
	drawHex2(basex + 1, basey + -1, basez + 0, 0x0000aa);
	drawHex2(basex + 2, basey + -2, basez + 0, 0x000088);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x0000ff); //24
	drawHex2(basex + 0, basey + -1, basez + 0, 0x0000cc);
	drawHex2(basex + 0, basey + -2, basez + 0, 0x0000aa);
	drawHex2(basex + -1, basey + -3, basez + 0, 0x000088);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x0000ff); //25
	drawHex2(basex + -1, basey + -1, basez + 0, 0x0000cc);
	drawHex2(basex + -2, basey + -1, basez + 0, 0x0000aa);
	drawHex2(basex + -3, basey + -1, basez + 0, 0x000088);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x0000ff); //26
	drawHex2(basex + -1, basey + 0, basez + 0, 0x0000cc);
	drawHex2(basex + -2, basey + 1, basez + 0, 0x0000aa);
	drawHex2(basex + -2, basey + 2, basez + 0, 0x000088);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x0000ff); //27
	drawHex2(basex + -1, basey + 1, basez + 0, 0x0000cc);
	drawHex2(basex + 0, basey + 2, basez + 0, 0x0000aa);
	drawHex2(basex + 0, basey + 3, basez + 0, 0x000088);
	
	// c
	basey = m * 0;
	basex = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff00ff); //28
	drawHex2(basex + 0, basey + 1, basez + 0, 0xcc00cc); 
	drawHex2(basex + 0, basey + 2, basez + 0, 0xaa00aa); 
	drawHex2(basex + -1, basey + 2, basez + 0, 0x880088);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff00ff); //29
	drawHex2(basex + 1, basey + 0, basez + 0, 0xcc00cc);
	drawHex2(basex + 1, basey + 1, basez + 0, 0xaa00aa);
	drawHex2(basex + 1, basey + 2, basez + 0, 0x880088);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff00ff); //30
	drawHex2(basex + 0, basey + -1, basez + 0, 0xcc00cc);
	drawHex2(basex + 1, basey + -1, basez + 0, 0xaa00aa);
	drawHex2(basex + 2, basey + 0, basez + 0, 0x880088);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff00ff); //31
	drawHex2(basex + -1, basey + -1, basez + 0, 0xcc00cc);
	drawHex2(basex + 0, basey + -2, basez + 0, 0xaa00aa);
	drawHex2(basex + 1, basey + -2, basez + 0, 0x880088);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff00ff); //32
	drawHex2(basex + -1, basey + 0, basez + 0, 0xcc00cc);
	drawHex2(basex + -2, basey + -1, basez + 0, 0xaa00aa);
	drawHex2(basex + -1, basey + -2, basez + 0, 0x880088);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff00ff); //33
	drawHex2(basex + -1, basey + 1, basez + 0, 0xcc00cc);
	drawHex2(basex + -2, basey + 1, basez + 0, 0xaa00aa);
	drawHex2(basex + -2, basey + 0, basez + 0, 0x880088);
	
	// gun
	basey = m * 0;
	basex = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xffff00); //34
	drawHex2(basex + 0, basey + 1, basez + 0, 0xcccc00);
	drawHex2(basex + 1, basey + 0, basez + 0, 0xaaaa00);
	drawHex2(basex + 1, basey + 2, basez + 0, 0x888800);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xffff00); //35
	drawHex2(basex + 1, basey + 0, basez + 0, 0xcccc00);
	drawHex2(basex + 0, basey + -1, basez + 0, 0xaaaa00);
	drawHex2(basex + 2, basey + 0, basez + 0, 0x888800);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xffff00); //36
	drawHex2(basex + 0, basey + -1, basez + 0, 0xcccc00);
	drawHex2(basex + -1, basey + -1, basez + 0, 0xaaaa00);
	drawHex2(basex + 1, basey + -2, basez + 0, 0x888800);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xffff00); //37
	drawHex2(basex + -1, basey + -1, basez + 0, 0xcccc00);
	drawHex2(basex + -1, basey + 0, basez + 0, 0xaaaa00);
	drawHex2(basex + -1, basey + -2, basez + 0, 0x888800);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xffff00); //38
	drawHex2(basex + -1, basey + 0, basez + 0, 0xcccc00);
	drawHex2(basex + -1, basey + 1, basez + 0, 0xaaaa00);
	drawHex2(basex + -2, basey + 0, basez + 0, 0x888800);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xffff00); //39
	drawHex2(basex + -1, basey + 1, basez + 0, 0xcccc00);
	drawHex2(basex + 0, basey + 1, basez + 0, 0xaaaa00);
	drawHex2(basex + -1, basey + 2, basez + 0, 0x888800);
	
	// P
	basex = m * 50;
	basey = m * 0;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xffff00);
	drawHex2(basex + 0, basey + 1, basez + 0, 0xcccc00);
	drawHex2(basex + -1, basey + 1, basez + 0, 0xaaaa00);
	drawHex2(basex + 1, basey + 2, basez + 0, 0x888800);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xffff00);
	drawHex2(basex + 1, basey + 0, basez + 0, 0xcccc00);
	drawHex2(basex + 0, basey + 1, basez + 0, 0xaaaa00);
	drawHex2(basex + 2, basey + 0, basez + 0, 0x888800);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xffff00);
	drawHex2(basex + 0, basey + -1, basez + 0, 0xcccc00);
	drawHex2(basex + 1, basey + 0, basez + 0, 0xaaaa00);
	drawHex2(basex + 1, basey + -2, basez + 0, 0x888800);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xffff00);
	drawHex2(basex + -1, basey + -1, basez + 0, 0xcccc00);
	drawHex2(basex + 0, basey + -1, basez + 0, 0xaaaa00);
	drawHex2(basex + -1, basey + -2, basez + 0, 0x888800);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xffff00);
	drawHex2(basex + -1, basey + 0, basez + 0, 0xcccc00);
	drawHex2(basex + -1, basey + -1, basez + 0, 0xaaaa00);
	drawHex2(basex + -2, basey + 0, basez + 0, 0x888800);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xffff00);
	drawHex2(basex + -1, basey + 1, basez + 0, 0xcccc00);
	drawHex2(basex + -1, basey + 0, basez + 0, 0xaaaa00);
	drawHex2(basex + -1, basey + 2, basez + 0, 0x888800);
	
	
	// inverted T
	basex = m * 60;
	basey = m * 0;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + 2, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 1, basez + 1, 0x880000);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + 2, basey + 0, basez + 0, 0xaa0000);
	drawHex2(basex + 1, basey + 0, basez + 1, 0x880000);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + -2, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + -1, basez + 1, 0x880000);
	
	
	// T
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 0, basey + 1, basez + 1, 0xcc0000);
	drawHex2(basex + 1, basey + 2, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 1, basez + 0, 0x880000);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 1, basey + 0, basez + 1, 0xcc0000);
	drawHex2(basex + 2, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + 1, basey + 0, basez + 0, 0x880000);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 0, basey + -1, basez + 1, 0xcc0000);
	drawHex2(basex + 1, basey + -2, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + -1, basez + 0, 0x880000);
	
	// left very crooked stairstep
	basex = m * 70
	basey = m * 0;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + -1, basey + 1, basez + 1, 0x880000);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 1, basez + 1, 0x880000);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + 1, basey + 0, basez + 1, 0x880000);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + -1, basez + 1, 0x880000);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + -1, basey + -1, basez + 1, 0x880000);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + -1, basey + 0, basez + 1, 0x880000);
	
	// left crooked stairstep
	basex = m * 80
	basey = m * 0;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 2, basez + 1, 0x880000);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + 1, basey + 1, basez + 1, 0x880000);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + 1, basey + -1, basez + 1, 0x880000);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + -2, basez + 1, 0x880000);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + -2, basey + -1, basez + 1, 0x880000);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + -2, basey + 1, basez + 1, 0x880000);
	
	// tetris stairstep
	basex = m * 90
	basey = m * 0;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + 1, basey + 2, basez + 1, 0x880000);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + 2, basey + 0, basez + 1, 0x880000);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + 1, basey + -2, basez + 1, 0x880000);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + -1, basey + -2, basez + 1, 0x880000);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + -2, basey + 0, basez + 1, 0x880000);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + -1, basey + 2, basez + 1, 0x880000);
	
	// right crooked stairstep
	basex = m * 100
	basey = m * 0;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + 1, basey + 1, basez + 1, 0x880000);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + 1, basey + -1, basez + 1, 0x880000);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + -2, basez + 1, 0x880000);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + -2, basey + -1, basez + 1, 0x880000);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + -2, basey + 1, basez + 1, 0x880000);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 2, basez + 1, 0x880000);
	
	// right very crooked stairstep
	basex = m * 110
	basey = m * 0;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + 1, basey + 0, basez + 1, 0x880000);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + -1, basez + 1, 0x880000);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + -1, basey + -1, basez + 1, 0x880000);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + -1, basey + 0, basez + 1, 0x880000);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + -1, basey + 1, basez + 1, 0x880000);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 1, basez + 1, 0x880000);
	
	// L
	basey = m * 0;
	basex = m * 120;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + 0, basey + 1, basez + 0, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + 1, basey + 0, basez + 0, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + 0, basey + -1, basez + 0, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + -1, basey + -1, basez + 0, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + -1, basey + 0, basez + 0, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + -1, basey + 1, basez + 0, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	// middle L
	basey = m * 0;
	basex = m * 130;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + 0, basey + 1, basez + 1, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + 1, basey + 0, basez + 1, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + 0, basey + -1, basez + 1, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + -1, basey + -1, basez + 1, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + -1, basey + 0, basez + 1, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + -1, basey + 1, basez + 1, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	// inverted L
	basey = m * 0;
	basex = m * 140;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + 0, basey + 1, basez + 2, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + 1, basey + 0, basez + 2, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + 0, basey + -1, basez + 2, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + -1, basey + -1, basez + 2, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + -1, basey + 0, basez + 2, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0x00ffff);
	drawHex2(basex + -1, basey + 1, basez + 2, 0x00cccc);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x00aaaa);
	drawHex2(basex + 0, basey + 0, basez + 2, 0x008888);
	
	// Side L
	basex = m * 150;
	basey = m * 0;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + 2, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + 2, basey + 0, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + -2, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + -2, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + -2, basey + 0, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + 2, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	// inverted side L
	basey = m * 60;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 0, basey + 1, basez + 1, 0xcc0000);
	drawHex2(basex + 1, basey + 2, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 70;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 1, basey + 0, basez + 1, 0xcc0000);
	drawHex2(basex + 2, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 80;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 0, basey + -1, basez + 1, 0xcc0000);
	drawHex2(basex + 1, basey + -2, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 90;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + -1, basey + -1, basez + 1, 0xcc0000);
	drawHex2(basex + -1, basey + -2, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 100;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + -1, basey + 0, basez + 1, 0xcc0000);
	drawHex2(basex + -2, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 110;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + -1, basey + 1, basez + 1, 0xcc0000);
	drawHex2(basex + -1, basey + 2, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	// clockwise curve with offset peg
	basex = m * 160;
	basey = m * 0;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + 1, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + -1, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + -2, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + -2, basey + -1, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + -2, basey + 1, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + 2, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	// inverted clockwise curve with offset peg
	basey = m * 60;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 0, basey + 1, basez + 1, 0xcc0000);
	drawHex2(basex + 1, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 70;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 1, basey + 0, basez + 1, 0xcc0000);
	drawHex2(basex + 1, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 80;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 0, basey + -1, basez + 1, 0xcc0000);
	drawHex2(basex + 0, basey + -2, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 90;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + -1, basey + -1, basez + 1, 0xcc0000);
	drawHex2(basex + -2, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 100;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + -1, basey + 0, basez + 1, 0xcc0000);
	drawHex2(basex + -2, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 110;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + -1, basey + 1, basez + 1, 0xcc0000);
	drawHex2(basex + 0, basey + 2, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	// counter-clockwise curve with offset peg
	basex = m * 170;
	basey = m * 0;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + 2, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + 1, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + -1, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + -2, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + -2, basey + -1, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + -2, basey + 1, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	// inverted counter-clockwise curve with offset peg
	basey = m * 60;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 0, basey + 1, basez + 1, 0xcc0000);
	drawHex2(basex + 0, basey + 2, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 70;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 1, basey + 0, basez + 1, 0xcc0000);
	drawHex2(basex + 1, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 80;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 0, basey + -1, basez + 1, 0xcc0000);
	drawHex2(basex + 1, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 90;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + -1, basey + -1, basez + 1, 0xcc0000);
	drawHex2(basex + 0, basey + -2, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 100;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + -1, basey + 0, basez + 1, 0xcc0000);
	drawHex2(basex + -2, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 110;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + -1, basey + 1, basez + 1, 0xcc0000);
	drawHex2(basex + -2, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	

	// noisemaker
	basey = m * 0;
	basex = m * 180;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + 0, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + -1, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + -1, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + 0, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + -1, basey + 1, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + 1, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 1, 0x880000);
	
	// inverted noisemaker
	basey = m * 60;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 0, basey + 1, basez + 1, 0xcc0000);
	drawHex2(basex + 1, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 70;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 1, basey + 0, basez + 1, 0xcc0000);
	drawHex2(basex + 0, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 80;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 0, basey + -1, basez + 1, 0xcc0000);
	drawHex2(basex + -1, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 90;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + -1, basey + -1, basez + 1, 0xcc0000);
	drawHex2(basex + -1, basey + 0, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 100;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + -1, basey + 0, basez + 1, 0xcc0000);
	drawHex2(basex + -1, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	basey = m * 110;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + -1, basey + 1, basez + 1, 0xcc0000);
	drawHex2(basex + 0, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 0, basez + 0, 0x880000);
	
	// clockwise curve with center peg
	basey = m * 0;
	basex = m * 190;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + 1, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + 1, basez + 1, 0x880000);
	
	basey = m * 10;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + 1, basey + -1, basez + 0, 0xaa0000);
	drawHex2(basex + 1, basey + 0, basez + 1, 0x880000);
	
	basey = m * 20;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + 0, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + -2, basez + 0, 0xaa0000);
	drawHex2(basex + 0, basey + -1, basez + 1, 0x880000);
	
	basey = m * 30;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + -1, basez + 0, 0xcc0000);
	drawHex2(basex + -2, basey + -1, basez + 0, 0xaa0000);
	drawHex2(basex + -1, basey + -1, basez + 1, 0x880000);
	
	basey = m * 40;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 0, basez + 0, 0xcc0000);
	drawHex2(basex + -2, basey + 1, basez + 0, 0xaa0000);
	drawHex2(basex + -1, basey + 0, basez + 1, 0x880000);
	
	basey = m * 50;
	drawHex2(basex + 0, basey + 0, basez + 0, 0xff0000);
	drawHex2(basex + -1, basey + 1, basez + 0, 0xcc0000);
	drawHex2(basex + 0, basey + 2, basez + 0, 0xaa0000);
	drawHex2(basex + -1, basey + 1, basez + 1, 0x880000);
	
	// inverted clockwise curve with center peg	
	basey = m * 60;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 0, basey + 1, basez + 1, 0xcc0000);
	drawHex2(basex + 1, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + 1, basez + 0, 0x880000);
	
	basey = m * 70;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 1, basey + 0, basez + 1, 0xcc0000);
	drawHex2(basex + 1, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + 1, basey + 0, basez + 0, 0x880000);
	
	basey = m * 80;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + 0, basey + -1, basez + 1, 0xcc0000);
	drawHex2(basex + 0, basey + -2, basez + 1, 0xaa0000);
	drawHex2(basex + 0, basey + -1, basez + 0, 0x880000);
	
	basey = m * 90;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + -1, basey + -1, basez + 1, 0xcc0000);
	drawHex2(basex + -2, basey + -1, basez + 1, 0xaa0000);
	drawHex2(basex + -1, basey + -1, basez + 0, 0x880000);
	
	basey = m * 100;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + -1, basey + 0, basez + 1, 0xcc0000);
	drawHex2(basex + -2, basey + 1, basez + 1, 0xaa0000);
	drawHex2(basex + -1, basey + 0, basez + 0, 0x880000);
	
	basey = m * 110;
	drawHex2(basex + 0, basey + 0, basez + 1, 0xff0000);
	drawHex2(basex + -1, basey + 1, basez + 1, 0xcc0000);
	drawHex2(basex + 0, basey + 2, basez + 1, 0xaa0000);
	drawHex2(basex + -1, basey + 1, basez + 0, 0x880000);
	
	
	
	
	
	// lights

	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(1, 1, 1);
	scene.add(light);

	light = new THREE.DirectionalLight(0x002288);
	light.position.set(-1, -1, -1);
	scene.add(light);

	light = new THREE.AmbientLight(0x222222);
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

	animate();

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

	render();

}

function render() {
	renderer.render(scene, camera);
}

function drawHex2(coordx, coordy, coordz, color)
{
	// (coordx - (MAP_WIDTH-1)/2) and (coordy - (MAP_HEIGHT-1)/2) adjust the coords to center in the camera's view
	var xpoint = (coordx - (MAP_WIDTH-1)/2) * Math.sqrt(3) * seglen;
	if(coordy%2 !== 0)
		xpoint = xpoint + Math.sqrt(3)/2 * seglen;
	var ypoint = (coordy - (MAP_HEIGHT-1)/2) * seglen * 2 * 3/4;
	
//	var xpoint = coordx * Math.sqrt(3) * seglen;
//	if(coordy%2 !== 0)
//		xpoint = xpoint + Math.sqrt(3)/2 * seglen;
//	var ypoint = coordy * seglen * 2 * 3/4;
	
	var extrudeSettings = {
			amount			: 160,
			steps			: 1,
			material		: 1,
			extrudeMaterial : 0,
			bevelEnabled	: false,
//			bevelThickness  : 20,
//			bevelSize       : 40,
//			bevelSegments   : 1,
		};

	var material = new THREE.MeshBasicMaterial( { color: color } );
	var hexShape = new THREE.Shape();
	var centerPoint = new Point(xpoint, ypoint);

	
	var point0 = hex_corner(centerPoint, seglen, 0);
	var point1 = hex_corner(centerPoint, seglen, 1);
	var point2 = hex_corner(centerPoint, seglen, 2);
	var point3 = hex_corner(centerPoint, seglen, 3);
	var point4 = hex_corner(centerPoint, seglen, 4);
	var point5 = hex_corner(centerPoint, seglen, 5);
	
	hexShape.moveTo( point0.x , point0.y );
	hexShape.lineTo( point1.x, point1.y );
	hexShape.lineTo( point2.x, point2.y );
	hexShape.lineTo( point3.x, point3.y );
	hexShape.lineTo( point4.x, point4.y );
	hexShape.lineTo( point5.x, point5.y );
	hexShape.lineTo( point0.x, point0.y );
	
	var hexGeom = new THREE.ExtrudeGeometry( hexShape, extrudeSettings );

	var mesh = new THREE.Mesh( hexGeom, material );
	if(coordz !== 0 )
		mesh.position.set(0,0,160*coordz);
	scene.add( mesh );
	
	return;
}

function hex_corner(center, size, i){
    var angle_deg = 60 * i   + 30
    var angle_rad = Math.PI / 180 * angle_deg
    return new Point(center.x + size * Math.cos(angle_rad),
                 center.y + size * Math.sin(angle_rad))
} 
