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
		// -50 && y even == out of bounds
		// -50 && y odd == OK
		if(blockHexCoordsValid(x,y))
		{
			drawBlockHex(coordx, coordy, x, y, z, color,8);
			return true;
		}
		else
			return false;
//		drawBlockHex(coordx, coordy, x, y, z+1, darkenColor(color, .98),1);
//		drawBlockHex(coordx, coordy, x, y, z+2, darkenColor(color, .96),1);
//		drawBlockHex(coordx, coordy, x, y, z+3, darkenColor(color, .94),1);
//		drawBlockHex(coordx, coordy, x, y, z+4, darkenColor(color, .92),1);
//		drawBlockHex(coordx, coordy, x, y, z+5, darkenColor(color, .90),1);
//		drawBlockHex(coordx, coordy, x, y, z+6, darkenColor(color, .88),1);
//		drawBlockHex(coordx, coordy, x, y, z+7, darkenColor(color, .86),1);
	}	
	else if(which === 1) // diagonal beam ne/sw
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x+offset, y+1) && blockHexCoordsValid(x+1, y+2) && blockHexCoordsValid(x+1+offset, y+3) &&
				blockHexCoordsValid(x+2, y+4) && blockHexCoordsValid(x+2+offset, y+5) && blockHexCoordsValid(x+3, y+6) && blockHexCoordsValid(x+3+offset, y+7))
		{	
			drawBlockHex(coordx, coordy, x, y, z, color,1);
			drawBlockHex(coordx, coordy, x+offset, y+1, z, darkenColor(color, .98),1);
			drawBlockHex(coordx, coordy, x+1, y+2, z, darkenColor(color, .96),1);
			drawBlockHex(coordx, coordy, x+1+offset, y+3, z, darkenColor(color, .94),1);
			drawBlockHex(coordx, coordy, x+2, y+4, z, darkenColor(color, .92),1);
			drawBlockHex(coordx, coordy, x+2+offset, y+5, z, darkenColor(color, .90),1);
			drawBlockHex(coordx, coordy, x+3, y+6, z, darkenColor(color, .88),1);
			drawBlockHex(coordx, coordy, x+3+offset, y+7, z, darkenColor(color, .86),1);
			return true;
		}
		else
			return false;
	}
	else if(which === 2) // horizontal beam
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x+1, y) && blockHexCoordsValid(x+2, y) && blockHexCoordsValid(x+3, y) &&
				blockHexCoordsValid(x+4, y) && blockHexCoordsValid(x+5, y) && blockHexCoordsValid(x+6, y) && blockHexCoordsValid(x+7, y))
		{	
			drawBlockHex(coordx, coordy, x, y, z, color,1);
			drawBlockHex(coordx, coordy, x+1, y, z, darkenColor(color, .98),1);
			drawBlockHex(coordx, coordy, x+2, y, z, darkenColor(color, .96),1);
			drawBlockHex(coordx, coordy, x+3, y, z, darkenColor(color, .94),1);
			drawBlockHex(coordx, coordy, x+4, y, z, darkenColor(color, .92),1);
			drawBlockHex(coordx, coordy, x+5, y, z, darkenColor(color, .90),1);
			drawBlockHex(coordx, coordy, x+6, y, z, darkenColor(color, .88),1);
			drawBlockHex(coordx, coordy, x+7, y, z, darkenColor(color, .86),1);
			return true;
		}
		else
			return false;
	}
	else if(which === 3) // diagonal beam nw/se
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x-1+offset, y+1) && blockHexCoordsValid(x-1, y+2) && blockHexCoordsValid(x-2+offset, y+3) &&
				blockHexCoordsValid(x-2, y+4) && blockHexCoordsValid(x-3+offset, y+5) && blockHexCoordsValid(x-3, y+6) && blockHexCoordsValid(x-4+offset, y+7))
		{	
			drawBlockHex(coordx, coordy, x, y, z, color,1);
			drawBlockHex(coordx, coordy, x-1+offset, y+1, z, darkenColor(color, .98),1);
			drawBlockHex(coordx, coordy, x-1, y+2, z, darkenColor(color, .96),1);
			drawBlockHex(coordx, coordy, x-2+offset, y+3, z, darkenColor(color, .94),1);
			drawBlockHex(coordx, coordy, x-2, y+4, z, darkenColor(color, .92),1);
			drawBlockHex(coordx, coordy, x-3+offset, y+5, z, darkenColor(color, .90),1);
			drawBlockHex(coordx, coordy, x-3, y+6, z, darkenColor(color, .88),1);
			drawBlockHex(coordx, coordy, x-4+offset, y+7, z, darkenColor(color, .86),1);
			return true;
		}
		else
			return false;
	}
	else if(which === 4) // diagonal snake sw/ne
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x+1, y) && blockHexCoordsValid(x+1+offset, y+1) && blockHexCoordsValid(x+2+offset, y+1) &&
				blockHexCoordsValid(x+3, y+2) && blockHexCoordsValid(x+4, y+2) && blockHexCoordsValid(x+4+offset, y+3) && blockHexCoordsValid(x+5+offset, y+3))
		{	
			drawBlockHex(coordx, coordy, x, y, z, color,1);
			drawBlockHex(coordx, coordy, x+1, y, z, darkenColor(color, .98),1);
			drawBlockHex(coordx, coordy, x+1+offset, y+1, z, darkenColor(color, .96),1);
			drawBlockHex(coordx, coordy, x+2+offset, y+1, z, darkenColor(color, .94),1);
			drawBlockHex(coordx, coordy, x+3, y+2, z, darkenColor(color, .92),1);
			drawBlockHex(coordx, coordy, x+4, y+2, z, darkenColor(color, .90),1);
			drawBlockHex(coordx, coordy, x+4+offset, y+3, z, darkenColor(color, .88),1);
			drawBlockHex(coordx, coordy, x+5+offset, y+3, z, darkenColor(color, .86),1);
			return true;
		}
		else
			return false;
	}
	else if(which === 5) // diagonal snake se/nw
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x-1, y) && blockHexCoordsValid(x-2+offset, y+1) && blockHexCoordsValid(x-3+offset, y+1) &&
				blockHexCoordsValid(x-3, y+2) && blockHexCoordsValid(x-4, y+2) && blockHexCoordsValid(x-5+offset, y+3) && blockHexCoordsValid(x-6+offset, y+3))
		{
			drawBlockHex(coordx, coordy, x, y, z, color,1);
			drawBlockHex(coordx, coordy, x-1, y, z, darkenColor(color, .98),1);
			drawBlockHex(coordx, coordy, x-2+offset, y+1, z, darkenColor(color, .96),1);
			drawBlockHex(coordx, coordy, x-3+offset, y+1, z, darkenColor(color, .94),1);
			drawBlockHex(coordx, coordy, x-3, y+2, z, darkenColor(color, .92),1);
			drawBlockHex(coordx, coordy, x-4, y+2, z, darkenColor(color, .90),1);
			drawBlockHex(coordx, coordy, x-5+offset, y+3, z, darkenColor(color, .88),1);
			drawBlockHex(coordx, coordy, x-6+offset, y+3, z, darkenColor(color, .86),1);
			return true;
		}
		else
			return false;
	}
	else if(which === 6) // quadruple-decker double-tower horizontal
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x+1, y))
		{
			drawBlockHex(coordx, coordy, x, y, z, color,4);
			drawBlockHex(coordx, coordy, x+1, y, z, darkenColor(color, .98),4);
			return true;
		}
		else
			return false;
//		drawBlockHex(coordx, coordy, x, y, z+1, darkenColor(color, .96),1);
//		drawBlockHex(coordx, coordy, x+1, y, z+1, darkenColor(color, .94),1);
//		drawBlockHex(coordx, coordy, x, y, z+2, darkenColor(color, .92),1);
//		drawBlockHex(coordx, coordy, x+1, y, z+2, darkenColor(color, .90),1);
//		drawBlockHex(coordx, coordy, x, y, z+3, darkenColor(color, .88),1);
//		drawBlockHex(coordx, coordy, x+1, y, z+3, darkenColor(color, .86),1);
	}
	else if(which === 7) // quadruple-decker double-tower diagonal sw/ne
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x+offset, y+1))
		{
			drawBlockHex(coordx, coordy, x, y, z, color,4);
			drawBlockHex(coordx, coordy, x+offset, y+1, z, darkenColor(color, .98),4);
			return true;
		}
		else
			return false;
//		drawBlockHex(coordx, coordy, x, y, z+1, darkenColor(color, .96),1);
//		drawBlockHex(coordx, coordy, x+offset, y+1, z+1, darkenColor(color, .94),1);
//		drawBlockHex(coordx, coordy, x, y, z+2, darkenColor(color, .92),1);
//		drawBlockHex(coordx, coordy, x+offset, y+1, z+2, darkenColor(color, .90),1);
//		drawBlockHex(coordx, coordy, x, y, z+3, darkenColor(color, .88),1);
//		drawBlockHex(coordx, coordy, x+offset, y+1, z+3, darkenColor(color, .86),1);
	}
	else if(which === 8) // quadruple-decker double-tower diagonal se/nw
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x-1+offset, y+1))
		{
			drawBlockHex(coordx, coordy, x, y, z, color,4);
			drawBlockHex(coordx, coordy, x-1+offset, y+1, z, darkenColor(color, .98),4);
			return true;
		}
		else
			return false;
//		drawBlockHex(coordx, coordy, x, y, z+1, darkenColor(color, .96),1);
//		drawBlockHex(coordx, coordy, x-1+offset, y+1, z+1, darkenColor(color, .94),1);
//		drawBlockHex(coordx, coordy, x, y, z+2, darkenColor(color, .92),1);
//		drawBlockHex(coordx, coordy, x-1+offset, y+1, z+2, darkenColor(color, .90),1);
//		drawBlockHex(coordx, coordy, x, y, z+3, darkenColor(color, .88),1);
//		drawBlockHex(coordx, coordy, x-1+offset, y+1, z+3, darkenColor(color, .86),1);
	}
	else if(which === 9) // double-decker diagonal beam ne/sw
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x+offset, y+1) && blockHexCoordsValid(x+1,y+2) && blockHexCoordsValid(x+1+offset, y+3))
		{
			drawBlockHex(coordx, coordy, x, y, z, color,2);
			drawBlockHex(coordx, coordy, x+offset, y+1, z, darkenColor(color, .98),2);
			drawBlockHex(coordx, coordy, x+1, y+2, z, darkenColor(color, .96),2);
			drawBlockHex(coordx, coordy, x+1+offset, y+3, z, darkenColor(color, .94),2);
			return true;
		}
		else
			return false;
//		drawBlockHex(coordx, coordy, x, y, z+1, darkenColor(color, .92),1);
//		drawBlockHex(coordx, coordy, x+offset, y+1, z+1, darkenColor(color, .90),1);
//		drawBlockHex(coordx, coordy, x+1, y+2, z+1, darkenColor(color, .88),1);
//		drawBlockHex(coordx, coordy, x+1+offset, y+3, z+1, darkenColor(color, .86),1);
	}
	else if(which === 10) // double-decker horizontal beam
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x+1, y) && blockHexCoordsValid(x+2,y) && blockHexCoordsValid(x+3, y))
		{
			drawBlockHex(coordx, coordy, x, y, z, color,2);
			drawBlockHex(coordx, coordy, x+1, y, z, darkenColor(color, .98),2);
			drawBlockHex(coordx, coordy, x+2, y, z, darkenColor(color, .96),2);
			drawBlockHex(coordx, coordy, x+3, y, z, darkenColor(color, .94),2);
			return true;
		}
		else
			return false;
//		drawBlockHex(coordx, coordy, x+0, y, z+1, darkenColor(color, .92),1);
//		drawBlockHex(coordx, coordy, x+1, y, z+1, darkenColor(color, .90),1);
//		drawBlockHex(coordx, coordy, x+2, y, z+1, darkenColor(color, .88),1);
//		drawBlockHex(coordx, coordy, x+3, y, z+1, darkenColor(color, .86),1);
	}
	else if(which === 11) // double-decker diagonal beam nw/se
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x-1+offset, y+1) && blockHexCoordsValid(x-1,y+2) && blockHexCoordsValid(x-2+offset, y+3))
		{
			drawBlockHex(coordx, coordy, x, y, z, darkenColor(color, 1),2);
			drawBlockHex(coordx, coordy, x-1+offset, y+1, z, darkenColor(color, .98),2);
			drawBlockHex(coordx, coordy, x-1, y+2, z, darkenColor(color, .96),2);
			drawBlockHex(coordx, coordy, x-2+offset, y+3, z, darkenColor(color, .94),2);
			return true;
		}
		else
			return false;
//		drawBlockHex(coordx, coordy, x, y, z+1, darkenColor(color, .92),1);
//		drawBlockHex(coordx, coordy, x-1+offset, y+1, z+1, darkenColor(color, .90),1);
//		drawBlockHex(coordx, coordy, x-1, y+2, z+1, darkenColor(color, .88),1);
//		drawBlockHex(coordx, coordy, x-2+offset, y+3, z+1, darkenColor(color, .86),1);
	}
	else if(which === 12) // diagonal snake sw/ne
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x+1, y) && blockHexCoordsValid(x+1+offset, y+1) && blockHexCoordsValid(x+2+offset, y+1))
		{
			drawBlockHex(coordx, coordy, x, y, z, darkenColor(color, 1),2);
			drawBlockHex(coordx, coordy, x+1, y, z, darkenColor(color, .98),2);
			drawBlockHex(coordx, coordy, x+1+offset, y+1, z, darkenColor(color, .96),2);
			drawBlockHex(coordx, coordy, x+2+offset, y+1, z, darkenColor(color, .94),2);
//			drawBlockHex(coordx, coordy, x, y, z+1, darkenColor(color, .92),1);
//			drawBlockHex(coordx, coordy, x+1, y, z+1, darkenColor(color, .90),1);
//			drawBlockHex(coordx, coordy, x+1+offset, y+1, z+1, darkenColor(color, .88),1);
//			drawBlockHex(coordx, coordy, x+2+offset, y+1, z+1, darkenColor(color, .86),1);
			return true;
		}
		else
			return false;
	}
	else if(which === 13) // diagonal snake se/nw
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x-1, y) && blockHexCoordsValid(x-2+offset, y+1) && blockHexCoordsValid(x-3+offset, y+1))
		{
			drawBlockHex(coordx, coordy, x, y, z, darkenColor(color, 1),2);
			drawBlockHex(coordx, coordy, x-1, y, z, darkenColor(color, .98),2);
			drawBlockHex(coordx, coordy, x-2+offset, y+1, z, darkenColor(color, .96),2);
			drawBlockHex(coordx, coordy, x-3+offset, y+1, z, darkenColor(color, .94),2);
//			drawBlockHex(coordx, coordy, x, y, z+1, darkenColor(color, .92),1);
//			drawBlockHex(coordx, coordy, x-1, y, z+1, darkenColor(color, .90),1);
//			drawBlockHex(coordx, coordy, x-2+offset, y+1, z+1, darkenColor(color, .88),1);
//			drawBlockHex(coordx, coordy, x-3+offset, y+1, z+1, darkenColor(color, .86),1);
			return true;
		}
		else
			return false;
	}
}

var	texture1 = THREE.ImageUtils.loadTexture( "images/concrete.jpg" );

function drawBlockHex(coordx, coordy, x, y, z, color, extrusion_multiple)
{
	if(extrusion_multiple === null || extrusion_multiple === 0)
		extrusion_multiple = 1;
	
	console.log("drawBlockHex " + coordx + "," + coordy);
	var xpoint = (coordx - (MAP_WIDTH-1)/2) * tilewidth;
	if(coordy%2 !== 0)
		xpoint = xpoint + tilewidth/2;
	var ypoint = (coordy - (MAP_HEIGHT-1)/2) * tilevert;
	
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
	
	
	var	material = new THREE.MeshPhongMaterial( { color: color, map: texture1 } );
	texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
	texture1.repeat.set( 1.3,1.3 );
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
	if(map[coordx][coordy].elevation < SEA_LEVEL)
	{
		tileextrusion = SEA_LEVEL * EXTRUSION_FACTOR;
	}	
	else
	{
		tileextrusion = map[coordx][coordy].elevation * EXTRUSION_FACTOR;
	}	
	console.log("LOWER " + coordx + "," + coordy + " extrudeamount=" + tileextrusion  + " map[coordx][coordy].elevation=" + map[coordx][coordy].elevation + " EXTRUSION_FACTOR=" + EXTRUSION_FACTOR);
	mesh.position.set( 0, 0, tileextrusion + z * blockextrude);
	scene.add( mesh );
}