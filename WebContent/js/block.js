var offset = 0;

var occupado; // occupado[coordx][coordy] contains the set of occupied x,y,z spaces in this tile

occupado = new Array(mapsize);
for (i = 0; i < mapsize; i++) {
	occupado[i] = new Array(mapsize);
	for(j = 0; j < mapsize; j++)
		occupado[i][j] = [];  // each x,y is also an array of [x,y,z] values, so occupado[0][1] might contain [[2,3,4],[5,6,7]...]
}

//initialize occupado with the floor (all the z=-1 for the tile) 
for (i = 0; i < mapsize; i++) {
	for(j = 0; j < mapsize; j++) {
		for(var row = -66; row <= 66; row++)
		{
			if(row % 2 !== 0 ) // odd
				col = -50;
			else
				col = -49;
			
			if(row >= -33 && row <= 33)
			{
				for(col; col <= 49; col++)
				{
					occupado[i][j].push([col,row,-1]);
				}
			}	
			else
			{	
				for(col; col <= 49; col++)
				{
					if((row >= 0 && col >= 0) || (row < 0 && col > 0)) // first or 4th quadrants
					{
						if(row % 2 !== 0 ) // odd
						{
							if (((Math.abs(col)/3) + (Math.abs(row)/2)) <= 33)
								occupado[i][j].push([col,row,-1]);
						}	
						else	// even
						{
							if ((((Math.abs(col)+1)/3) + ((Math.abs(row)-1)/2)) <= 33)
								occupado[i][j].push([col,row,-1]);
						}
					}
					else
					{	
						if(row % 2 === 0 ) // even
						{
							if (((Math.abs(col)/3) + (Math.abs(row)/2)) <= 33)
								occupado[i][j].push([col,row,-1]);
						}	
						else	// odd
						{
							if ((((Math.abs(col)+1)/3) + ((Math.abs(row)-1)/2)) <= 33)
								occupado[i][j].push([col,row,-1]);
						}
					}
				}
			}
		}	
	}
}

var blocks = [{
	'which':0,
	'description': 'B-T column',
	'occupies': [[0,0,0],[0,0,1],[0,0,2],[0,0,3],[0,0,4],[0,0,5],[0,0,6],[0,0,7]],
	'surroundedby':  [[0,0,-1],[0,0,8]]
},
{
	'which':1,
	'description': 'SW-NE diagonal beam',
	'occupies': [[0,0,0],[0+offset,1,0],[1,2,0],[1+offset,3,0],[2,4,0],[2+offset,5,0],[3,6,0],[3+offset,7,0]],
	'surroundedby':  [[0,0,-1],[0+offset,1,-1],[1,2,-1],[1+offset,3,-1],[2,4,-1],[2+offset,5,-1],[3,6,-1],[3+offset,7,-1],
	                  [0,0,1],[0+offset,1,1],[1,2,1],[1+offset,3,1],[2,4,1],[2+offset,5,1],[3,6,1],[3+offset,7,1]]
},
{
	'which':2,
	'description': 'W-E horizontal beam',
	'occupies': [[0,0,0],[1,0,0],[2,0,0],[3,0,0],[4,0,0],[5,0,0],[6,0,0],[7,0,0]],
	'surroundedby':  [[0,0,-1],[1,0,-1],[2,0,-1],[3,0,-1],[4,0,-1],[5,0,-1],[6,0,-1],[7,0,-1],
	                  [0,0,1],[1,0,1],[2,0,1],[3,0,1],[4,0,1],[5,0,1],[6,0,1],[7,0,1]],
},
{
	'which':3,
	'description': 'SE-NW diagonal beam',
	'occupies': [[0,0,0],[-1+offset,1,0],[-1,2,0],[-2+offset,3,0],[-2,4,0],[-3+offset,5,0],[-3,6,0],[-4+offset,7,0]],
	'surroundedby':  [[0,0,-1],[-1+offset,1,-1],[-1,2,-1],[-2+offset,3,-1],[-2,4,-1],[-3+offset,5,-1],[-3,6,-1],[-4+offset,7,-1],
	                  [0,0,1],[-1+offset,1,1],[-1,2,1],[-2+offset,3,1],[-2,4,1],[-3+offset,5,1],[-3,6,1],[-4+offset,7,1]]
},
{
	'which':4,
	'description': 'SW-NE diagonal snake',
	'occupies': [[0,0,0],[1,0,0],[1+offset,1,0],[2+offset,1,0],[3,2,0],[4,2,0],[4+offset,3,0],[5+offset,3,0]],
	'surroundedby':  [[0,0,-1],[1,0,-1],[1+offset,1,-1],[2+offset,1,-1],[3,2,-1],[4,2,-1],[4+offset,3,-1],[5+offset,3,-1],
	                  [0,0,1],[1,0,1],[1+offset,1,1],[2+offset,1,1],[3,2,1],[4,2,1],[4+offset,3,1],[5+offset,3,1]]
},
{
	'which':5,
	'description': 'SE-NW diagonal snake',
	'occupies': [[0,0,0],[-1,0,0],[-1+offset,1,0],[-2+offset,1,0],[-3,2,0],[-4,2,0],[-4+offset,3,0],[-5+offset,3,0]],
	'surroundedby':  [[0,0,-1],[-1,0,-1],[-1+offset,1,-1],[-2+offset,1,-1],[-3,2,-1],[-4,2,-1],[-4+offset,3,-1],[-5+offset,3,-1],
	                  [0,0,1],[-1,0,1],[-1+offset,1,1],[-2+offset,1,1],[-3,2,1],[-4,2,1],[-4+offset,3,1],[-5+offset,3,1]]
},
{
	'which':6,
	'description': 'W-E quadruple-decker',
	'occupies': [[0,0,0],[1,0,0],[0,0,1],[1,0,1],[0,0,2],[1,0,2],[0,0,3],[1,0,3]],
	'surroundedby':  [[0,0,-1],[1,0,-1],
	                  [0,0,4],[1,0,4]]
},
{
	'which':7,
	'description': 'SW-NE quadruple-decker',
	'occupies': [[0,0,0],[0+offset,1,0],[0,0,1],[0+offset,1,1],[0,0,2],[0+offset,1,2],[0,0,3],[0+offset,1,3]],
	'surroundedby':  [[0,0,-1],[0+offset,1,-1],
	                  [0,0,4],[0+offset,1,4]]
},
{
	'which':8,
	'description': 'SE-NW quadruple-decker',
	'occupies': [[0,0,0],[-1+offset,1,0],[0,0,1],[-1+offset,1,1],[0,0,2],[-1+offset,1,2],[0,0,3],[-1+offset,1,3]],
	'surroundedby':  [[0,0,-1],[-1+offset,1,-1],
	                  [0,0,4],[-1+offset,1,4]]
},
{

	'which':9,
	'description': 'SW-NE double-decker',
	'occupies': [[0,0,0],[0+offset,1,0],[1,2,0],[1+offset,3,0],[0,0,1],[0+offset,1,1],[1,2,1],[1+offset,3,1]],
	'surroundedby':  [[0,0,-1],[0+offset,1,-1],[1,2,-1],[1+offset,3,-1],
	                  [0,0,2],[0+offset,1,2],[1,2,2],[1+offset,3,2]]
},
{
	'which':10,
	'description': 'W-E double-decker',
	'occupies': [[0,0,0],[1,0,0],[2,0,0],[3,0,0],[0,0,1],[1,0,1],[2,0,1],[3,0,1]],
	'surroundedby':  [[0,0,-1],[1,0,-1],[2,0,-1],[3,0,-1],
	                  [0,0,2],[1,0,2],[2,0,2],[3,0,2]]
},
{
	'which':11,
	'description': 'SE-NW double-decker',
	'occupies': [[0,0,0],[-1+offset,1,0],[-1,2,0],[-2+offset,3,0],[0,0,1],[-1+offset,1,1],[-1,2,1],[-2+offset,3,1]],
	'surroundedby':  [[0,0,-1],[-1+offset,1,-1],[-1,2,-1],[-2+offset,3,-1],
	                  [0,0,2],[-1+offset,1,2],[-1,2,2],[-2+offset,3,2]]
},
{
	'which':12,
	'description': 'SW-NE double-decker diagonal snake',
	'occupies': [[0,0,0],[1,0,0],[1+offset,1,0],[2+offset,1,0],[0,0,1],[1,0,1],[1+offset,1,1],[2+offset,1,1]],
	'surroundedby':  [[0,0,-1],[1,0,-1],[1+offset,1,-1],[2+offset,1,-1],
	                  [0,0,2],[1,0,2],[1+offset,1,2],[2+offset,1,2]]
},
{
	'which':13,
	'description': 'SE-NW double-decker diagonal snake',
	'occupies': [[0,0,0],[-1,0,0],[-1+offset,1,0],[-2+offset,1,0],[0,0,1],[-1,0,1],[-1+offset,1,1],[-2+offset,1,1]],
	'surroundedby':  [[0,0,-1],[-1,0,-1],[-1+offset,1,-1],[-2+offset,1,-1],
	                  [0,0,2],[-1,0,2],[-1+offset,1,2],[-2+offset,1,2]]
},
//{
//	'which':14,
//	
//},
//{
//	'which':15,
//	
//},
//{
//	'which':16,
//	
//},
//{
//	'which':17,
//	
//},
//{
//	'which':18,
//	
//},
//{
//	'which':19,
//	
//}
]

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



function touchesAnother(coordx, coordy, which, x, y , z)
{
	//console.log('touches another?');
	if(y % 2 !== 0) // if the starting y is odd
		offset = 1;
	else
		offset = 0;
	
	var surroundings = [];
	
	for(var b = 0; b < blocks[which].surroundedby.length; b++)
	{
		surroundings.push([blocks[which].surroundedby[b][0]+x, blocks[which].surroundedby[b][1]+y, blocks[which].surroundedby[b][2]+z]);
	}
	console.log(surroundings.length);

	
	var occupadolength = occupado[coordx][coordy].length;
	for(var s = 0; s < surroundings.length; s++)
	{
		//console.log('checking to see if surrounding block [' + surroundings[s][0] + "," + surroundings[s][1] + "," + surroundings[s][2] + "] is contained in occupado[" + coordx + "][" + coordy + "]");
		for(var o = 0; o < occupadolength; o++)
		{
		//	if( surroundings.every( function(n, i) { n === occupado[coordx][coordy][o]; } )) 	// are the two arrays equal?	
			if(surroundings[s][0] === occupado[coordx][coordy][o][0] && surroundings[s][1] === occupado[coordx][coordy][o][1] && surroundings[s][2] === occupado[coordx][coordy][o][2]) // are the arrays equal?
			{
				
				//console.log('touches another? TRUE');
				return true;
			}
		}	
	}	
	//console.log('touches another? FALSE');
	return false;
}

function wouldOverlap(coordx, coordy, which, x, y , z)
{
	//console.log('Checking wouldOverlap for which=' + which + " " + x + "," + y + "," + z)
	// make an array of [x,y,z] objects this block would occupy and then check occupado to see if any of them are already occupied.
	if(y % 2 !== 0) // if the starting y is odd
		offset = 1;
	else
		offset = 0;
	
	var wouldoccupy = [];
	if(which === 0)
	{
		wouldoccupy.push([x,y,z]);
		wouldoccupy.push([x,y,z+1]);
		wouldoccupy.push([x,y,z+2]);
		wouldoccupy.push([x,y,z+3]);
		wouldoccupy.push([x,y,z+4]);
		wouldoccupy.push([x,y,z+5]);
		wouldoccupy.push([x,y,z+6]);
		wouldoccupy.push([x,y,z+7]);
	}
	else if(which === 1)
	{
		wouldoccupy.push([x,y,z]);
		wouldoccupy.push([x+offset,y+1,z]);
		wouldoccupy.push([x+1,y+2,z]);
		wouldoccupy.push([x+1+offset,y+3,z]);
		wouldoccupy.push([x+2,y+4,z]);
		wouldoccupy.push([x+2+offset,y+5,z]);
		wouldoccupy.push([x+3,y+6,z]);
		wouldoccupy.push([x+3+offset,y+7,z]);
	}	
	else if(which === 2)
	{
		wouldoccupy.push([x,y,z]);
		wouldoccupy.push([x+1,y,z]);
		wouldoccupy.push([x+2,y,z]);
		wouldoccupy.push([x+3,y,z]);
		wouldoccupy.push([x+4,y,z]);
		wouldoccupy.push([x+5,y,z]);
		wouldoccupy.push([x+6,y,z]);
		wouldoccupy.push([x+7,y,z]);
	}	
	else if(which === 3)
	{
		wouldoccupy.push([x,y,z]);
		wouldoccupy.push([x-1+offset,y+1,z]);
		wouldoccupy.push([x-1,y+2,z]);
		wouldoccupy.push([x-2+offset,y+3,z]);
		wouldoccupy.push([x-2+offset,y+4,z]);
		wouldoccupy.push([x-3+offset,y+5,z]);
		wouldoccupy.push([x-3,y+6,z]);
		wouldoccupy.push([x-4+offset,y+7,z]);
	}	
	else if(which === 4)
	{
		wouldoccupy.push([x,y,z]);
		wouldoccupy.push([x+1,y,z]);
		wouldoccupy.push([x+1+offset,y+1,z]);
		wouldoccupy.push([x+2+offset,y+1,z]);
		wouldoccupy.push([x+3,y+2,z]);
		wouldoccupy.push([x+4,y+2,z]);
		wouldoccupy.push([x+4+offset,y+3,z]);
		wouldoccupy.push([x+5+offset,y+3,z]);
	}
	else if(which === 5)
	{
		wouldoccupy.push([x,y,z]);
		wouldoccupy.push([x-1,y,z]);
		wouldoccupy.push([x-1+offset,y+1,z]);
		wouldoccupy.push([x-2+offset,y+1,z]);
		wouldoccupy.push([x-3,y+2,z]);
		wouldoccupy.push([x-4,y+2,z]);
		wouldoccupy.push([x-4+offset,y+3,z]);
		wouldoccupy.push([x-5+offset,y+3,z]);
	}
	else if(which === 6)
	{
		wouldoccupy.push([x,y,z]);
		wouldoccupy.push([x+1,y,z]);
		wouldoccupy.push([x,y,z+1]);
		wouldoccupy.push([x+1,y,z+1]);
		wouldoccupy.push([x,y,z+1]);
		wouldoccupy.push([x+1,y,z+1]);
		wouldoccupy.push([x,y,z+1]);
		wouldoccupy.push([x+1,y,z+1]);
	}
	else if(which === 7)
	{
		wouldoccupy.push([x,y,z]);
		wouldoccupy.push([x+0+offset,y+1,z]);
		wouldoccupy.push([x,y,z+1]);
		wouldoccupy.push([x+0+offset,y+1,z+1]);
		wouldoccupy.push([x,y,z+2]);
		wouldoccupy.push([x+0+offset,y+1,z+2]);
		wouldoccupy.push([x,y,z+3]);
		wouldoccupy.push([x+0+offset,y+1,z+3]);
	}
	else if(which === 8)
	{
		wouldoccupy.push([x,y,z]);
		wouldoccupy.push([x-1+offset,y+1,z]);
		wouldoccupy.push([x,y,z+1]);
		wouldoccupy.push([x-1+offset,y+1,z+1]);
		wouldoccupy.push([x,y,z+2]);
		wouldoccupy.push([x-1+offset,y+1,z+2]);
		wouldoccupy.push([x,y,z+3]);
		wouldoccupy.push([x-1+offset,y+1,z+3]);
	}
	else if(which === 9)
	{
		wouldoccupy.push([x,y,z]);
		wouldoccupy.push([x+offset,y+1,z]);
		wouldoccupy.push([x+1,y+2,z]);
		wouldoccupy.push([x+1+offset,y+3,z]);
		wouldoccupy.push([x,y,z+1]);
		wouldoccupy.push([x+offset,y+1,z+1]);
		wouldoccupy.push([x+1,y+2,z+1]);
		wouldoccupy.push([x+1+offset,y+3,z+1]);
	}
	else if(which === 10)
	{
		wouldoccupy.push([x,y,z]);
		wouldoccupy.push([x+1,y,z]);
		wouldoccupy.push([x+2,y,z]);
		wouldoccupy.push([x+3,y,z]);
		wouldoccupy.push([x,y,z+1]);
		wouldoccupy.push([x+1,y,z+1]);
		wouldoccupy.push([x+2,y,z+1]);
		wouldoccupy.push([x+3,y,z+1]);
	}
	else if(which === 11)
	{
		wouldoccupy.push([x,y,z]);
		wouldoccupy.push([x-1+offset,y+1,z]);
		wouldoccupy.push([x-1,y+2,z]);
		wouldoccupy.push([x-2+offset,y+3,z]);
		wouldoccupy.push([x,y,z+1]);
		wouldoccupy.push([x-1+offset,y+1,z+1]);
		wouldoccupy.push([x-1,y+2,z+1]);
		wouldoccupy.push([x-2+offset,y+3,z+1]);
	}
	else if(which === 12)
	{
		wouldoccupy.push([x,y,z]);
		wouldoccupy.push([x+1,y,z]);
		wouldoccupy.push([x+1+offset,y+1,z]);
		wouldoccupy.push([x+2+offset,y+1,z]);
		wouldoccupy.push([x,y,z+1]);
		wouldoccupy.push([x+1,y,z+1]);
		wouldoccupy.push([x+1+offset,y+1,z+1]);
		wouldoccupy.push([x+2+offset,y+1,z+1]);
	}
	else if(which === 13)
	{
		wouldoccupy.push([x,y,z]);
		wouldoccupy.push([x-1,y,z]);
		wouldoccupy.push([x-1+offset,y+1,z]);
		wouldoccupy.push([x-2+offset,y+1,z]);
		wouldoccupy.push([x,y,z+1]);
		wouldoccupy.push([x-1,y,z+1]);
		wouldoccupy.push([x-1+offset,y+1,z+1]);
		wouldoccupy.push([x-2+offset,y+1,z+1]);
	}
	
	for(var w = 0; w < wouldoccupy.length; w++)
	{
		//console.log('w=' + w + " " + wouldoccupy[w][0] + "," + wouldoccupy[w][1] + "," + wouldoccupy[w][2]);
		for(var o = 0; o < occupado[coordx][coordy].length; o++)
		{
			//console.log('o=' + o);
			if(wouldoccupy[w][0] === occupado[coordx][coordy][o][0] && wouldoccupy[w][1] === occupado[coordx][coordy][o][1] && wouldoccupy[w][2] === occupado[coordx][coordy][o][2]) // are the arrays equal?
			{
				console.log('[' + wouldoccupy[w][0] + "," + wouldoccupy[w][1] + "," + wouldoccupy[w][2] + "] is contained in occupado[" + coordx + "][" + coordy + "]");
				console.log(occupado[coordx][coordy][o]);
				console.log('would occupy');
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
	//console.log("drawblock(" + coordx + ", "+ coordy + ", " + which + "," + x + ", "+ y + ", "+ z + ", " + color);
	if(y % 2 !== 0) // if the starting y is odd
		offset = 1;
	else
		offset = 0;
	
	var xyz = [];
	var centers = [];
	
	if(which === 0) // 8 high column
	{
		// -50 && y even == out of bounds
		// -50 && y odd == OK
		//console.log('drawblock xyz=' + x + "," + y + "," + z + " wouldoverlap="  + wouldOverlap(coordx,coordy,which,x,y,z) + ' touchesanother=' + touchesAnother(coordx, coordy, which, x, y, z));
		if(blockHexCoordsValid(x,y)  && !wouldOverlap(coordx,coordy,which,x,y,z) && touchesAnother(coordx, coordy, which, x, y, z))
		{
			drawBlockHex(coordx, coordy, x,y,z, color,8);
			occupado[coordx][coordy].push([x,y,z]);
			occupado[coordx][coordy].push([x,y,z+1]);
			occupado[coordx][coordy].push([x,y,z+2]);
			occupado[coordx][coordy].push([x,y,z+3]);
			occupado[coordx][coordy].push([x,y,z+4]);
			occupado[coordx][coordy].push([x,y,z+5]);
			occupado[coordx][coordy].push([x,y,z+6]);
			occupado[coordx][coordy].push([x,y,z+7]);
			return true;
		}
		else
			return false;
	}	
	else if(which === 1) // diagonal beam ne/sw
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x+offset, y+1) && blockHexCoordsValid(x+1, y+2) && blockHexCoordsValid(x+1+offset, y+3) &&
				blockHexCoordsValid(x+2, y+4) && blockHexCoordsValid(x+2+offset, y+5) && blockHexCoordsValid(x+3, y+6) && blockHexCoordsValid(x+3+offset, y+7)
				&& touchesAnother(coordx, coordy, which, x, y, z) && !wouldOverlap(coordx,coordy,which,x,y,z))
		{	
			drawBlockHex(coordx, coordy, x, y, z, color,1);
			drawBlockHex(coordx, coordy, x+offset, y+1, z, darkenColor(color, .98),1);
			drawBlockHex(coordx, coordy, x+1, y+2, z, darkenColor(color, .96),1);
			drawBlockHex(coordx, coordy, x+1+offset, y+3, z, darkenColor(color, .94),1);
			drawBlockHex(coordx, coordy, x+2, y+4, z, darkenColor(color, .92),1);
			drawBlockHex(coordx, coordy, x+2+offset, y+5, z, darkenColor(color, .90),1);
			drawBlockHex(coordx, coordy, x+3, y+6, z, darkenColor(color, .88),1);
			drawBlockHex(coordx, coordy, x+3+offset, y+7, z, darkenColor(color, .86),1);
			occupado[coordx][coordy].push([x,y,z]);
			occupado[coordx][coordy].push([x+offset,y+1,z]);
			occupado[coordx][coordy].push([x+1,y+2,z]);
			occupado[coordx][coordy].push([x+1+offset,y+3,z]);
			occupado[coordx][coordy].push([x+2,y+4,z]);
			occupado[coordx][coordy].push([x+2+offset,y+5,z]);
			occupado[coordx][coordy].push([x+3,y+6,z]);
			occupado[coordx][coordy].push([x+3+offset,y+7,z]);
			return true;
		}
		else
			return false;
	}
	else if(which === 2) // horizontal beam
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x+1, y) && blockHexCoordsValid(x+2, y) && blockHexCoordsValid(x+3, y) &&
				blockHexCoordsValid(x+4, y) && blockHexCoordsValid(x+5, y) && blockHexCoordsValid(x+6, y) && blockHexCoordsValid(x+7, y)
				&& touchesAnother(coordx, coordy, which, x, y, z) && !wouldOverlap(coordx,coordy,which,x,y,z))
		{	
			drawBlockHex(coordx, coordy, x, y, z, color,1);
			drawBlockHex(coordx, coordy, x+1, y, z, darkenColor(color, .98),1);
			drawBlockHex(coordx, coordy, x+2, y, z, darkenColor(color, .96),1);
			drawBlockHex(coordx, coordy, x+3, y, z, darkenColor(color, .94),1);
			drawBlockHex(coordx, coordy, x+4, y, z, darkenColor(color, .92),1);
			drawBlockHex(coordx, coordy, x+5, y, z, darkenColor(color, .90),1);
			drawBlockHex(coordx, coordy, x+6, y, z, darkenColor(color, .88),1);
			drawBlockHex(coordx, coordy, x+7, y, z, darkenColor(color, .86),1);
			occupado[coordx][coordy].push([x,y,z]);
			occupado[coordx][coordy].push([x+1,y,z]);
			occupado[coordx][coordy].push([x+2,y,z]);
			occupado[coordx][coordy].push([x+3,y,z]);
			occupado[coordx][coordy].push([x+4,y,z]);
			occupado[coordx][coordy].push([x+5,y,z]);
			occupado[coordx][coordy].push([x+6,y,z]);
			occupado[coordx][coordy].push([x+7,y,z]);
			return true;
		}
		else
			return false;
	}
	else if(which === 3) // diagonal beam nw/se
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x-1+offset, y+1) && blockHexCoordsValid(x-1, y+2) && blockHexCoordsValid(x-2+offset, y+3) &&
				blockHexCoordsValid(x-2, y+4) && blockHexCoordsValid(x-3+offset, y+5) && blockHexCoordsValid(x-3, y+6) && blockHexCoordsValid(x-4+offset, y+7)
					&& touchesAnother(coordx, coordy, which, x, y, z) && !wouldOverlap(coordx,coordy,which,x,y,z))		
		{	
			drawBlockHex(coordx, coordy, x, y, z, color,1);
			drawBlockHex(coordx, coordy, x-1+offset, y+1, z, darkenColor(color, .98),1);
			drawBlockHex(coordx, coordy, x-1, y+2, z, darkenColor(color, .96),1);
			drawBlockHex(coordx, coordy, x-2+offset, y+3, z, darkenColor(color, .94),1);
			drawBlockHex(coordx, coordy, x-2, y+4, z, darkenColor(color, .92),1);
			drawBlockHex(coordx, coordy, x-3+offset, y+5, z, darkenColor(color, .90),1);
			drawBlockHex(coordx, coordy, x-3, y+6, z, darkenColor(color, .88),1);
			drawBlockHex(coordx, coordy, x-4+offset, y+7, z, darkenColor(color, .86),1);
			occupado[coordx][coordy].push([x,y,z]);
			occupado[coordx][coordy].push([x-1+offset,y+1,z]);
			occupado[coordx][coordy].push([x-1,y+2,z]);
			occupado[coordx][coordy].push([x-2+offset,y+3,z]);
			occupado[coordx][coordy].push([x-2,y+4,z]);
			occupado[coordx][coordy].push([x-3+offset,y+5,z]);
			occupado[coordx][coordy].push([x-3,y+6,z]);
			occupado[coordx][coordy].push([x-4+offset,y+7,z]);
			return true;
		}
		else
			return false;
	}
	else if(which === 4) // diagonal snake sw/ne
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x+1, y) && blockHexCoordsValid(x+1+offset, y+1) && blockHexCoordsValid(x+2+offset, y+1) &&
				blockHexCoordsValid(x+3, y+2) && blockHexCoordsValid(x+4, y+2) && blockHexCoordsValid(x+4+offset, y+3) && blockHexCoordsValid(x+5+offset, y+3)
				&& touchesAnother(coordx, coordy, which, x, y, z) && !wouldOverlap(coordx,coordy,which,x,y,z))		
		{	
			drawBlockHex(coordx, coordy, x, y, z, color,1);
			drawBlockHex(coordx, coordy, x+1, y, z, darkenColor(color, .98),1);
			drawBlockHex(coordx, coordy, x+1+offset, y+1, z, darkenColor(color, .96),1);
			drawBlockHex(coordx, coordy, x+2+offset, y+1, z, darkenColor(color, .94),1);
			drawBlockHex(coordx, coordy, x+3, y+2, z, darkenColor(color, .92),1);
			drawBlockHex(coordx, coordy, x+4, y+2, z, darkenColor(color, .90),1);
			drawBlockHex(coordx, coordy, x+4+offset, y+3, z, darkenColor(color, .88),1);
			drawBlockHex(coordx, coordy, x+5+offset, y+3, z, darkenColor(color, .86),1);
			occupado[coordx][coordy].push([x,y,z]);
			occupado[coordx][coordy].push([x+1,y,z]);
			occupado[coordx][coordy].push([x+1+offset,y+1,z]);
			occupado[coordx][coordy].push([x+2+offset,y+1,z]);
			occupado[coordx][coordy].push([x+3,y+2,z]);
			occupado[coordx][coordy].push([x+4,y+2,z]);
			occupado[coordx][coordy].push([x+4+offset,y+3,z]);
			occupado[coordx][coordy].push([x+5+offset,y+3,z]);
			return true;
		}
		else
			return false;
	}
	else if(which === 5) // diagonal snake se/nw
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x-1, y) && blockHexCoordsValid(x-2+offset, y+1) && blockHexCoordsValid(x-3+offset, y+1) &&
				blockHexCoordsValid(x-3, y+2) && blockHexCoordsValid(x-4, y+2) && blockHexCoordsValid(x-5+offset, y+3) && blockHexCoordsValid(x-6+offset, y+3)
				&& touchesAnother(coordx, coordy, which, x, y, z) && !wouldOverlap(coordx,coordy,which,x,y,z))		
		{
			drawBlockHex(coordx, coordy, x, y, z, color,1);
			drawBlockHex(coordx, coordy, x-1, y, z, darkenColor(color, .98),1);
			drawBlockHex(coordx, coordy, x-2+offset, y+1, z, darkenColor(color, .96),1);
			drawBlockHex(coordx, coordy, x-3+offset, y+1, z, darkenColor(color, .94),1);
			drawBlockHex(coordx, coordy, x-3, y+2, z, darkenColor(color, .92),1);
			drawBlockHex(coordx, coordy, x-4, y+2, z, darkenColor(color, .90),1);
			drawBlockHex(coordx, coordy, x-5+offset, y+3, z, darkenColor(color, .88),1);
			drawBlockHex(coordx, coordy, x-6+offset, y+3, z, darkenColor(color, .86),1);
			occupado[coordx][coordy].push([x,y,z]);
			occupado[coordx][coordy].push([x-1,y,z]);
			occupado[coordx][coordy].push([x-1+offset,y+1,z]);
			occupado[coordx][coordy].push([x-2+offset,y+1,z]);
			occupado[coordx][coordy].push([x-3,y+2,z]);
			occupado[coordx][coordy].push([x-4,y+2,z]);
			occupado[coordx][coordy].push([x-4+offset,y+3,z]);
			occupado[coordx][coordy].push([x-5+offset,y+3,z]);
			return true;
		}
		else
			return false;
	}
	else if(which === 6) // quadruple-decker double-tower horizontal
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x+1, y)
				&& touchesAnother(coordx, coordy, which, x, y, z) && !wouldOverlap(coordx,coordy,which,x,y,z))		
		{
			drawBlockHex(coordx, coordy, x,y,z, color, 4);
			drawBlockHex(coordx, coordy, x+1,y,z, color, 4);
			occupado[coordx][coordy].push([x,y,z]);
			occupado[coordx][coordy].push([x+1,y,z]);
			occupado[coordx][coordy].push([x,y,z+1]);
			occupado[coordx][coordy].push([x+1,y,z+1]);
			occupado[coordx][coordy].push([x,y,z+2]);
			occupado[coordx][coordy].push([x+1,y,z+2]);
			occupado[coordx][coordy].push([x,y,z+3]);
			occupado[coordx][coordy].push([x+1,y,z+3]);
			return true;
		}
		else
			return false;
	}
	else if(which === 7) // quadruple-decker double-tower diagonal sw/ne
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x+offset, y+1)
				&& touchesAnother(coordx, coordy, which, x, y, z) && !wouldOverlap(coordx,coordy,which,x,y,z))		
		{
			drawBlockHex(coordx, coordy, x, y, z, color,4);
			drawBlockHex(coordx, coordy, x+offset, y+1, z, darkenColor(color, .98),4);
			occupado[coordx][coordy].push([x,y,z]);
			occupado[coordx][coordy].push([x+0+offset,y+1,z]);
			occupado[coordx][coordy].push([x,y,z+1]);
			occupado[coordx][coordy].push([x+0+offset,y+1,z+1]);
			occupado[coordx][coordy].push([x,y,z+2]);
			occupado[coordx][coordy].push([x+0+offset,y+1,z+2]);
			occupado[coordx][coordy].push([x,y,z+3]);
			occupado[coordx][coordy].push([x+0+offset,y+1,z+3]);
			return true;
		}
		else
			return false;
	}
	else if(which === 8) // quadruple-decker double-tower diagonal se/nw
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x-1+offset, y+1)
				&& touchesAnother(coordx, coordy, which, x, y, z) && !wouldOverlap(coordx,coordy,which,x,y,z))		
		{
			drawBlockHex(coordx, coordy, x, y, z, color,4);
			drawBlockHex(coordx, coordy, x-1+offset, y+1, z, darkenColor(color, .98),4);
			occupado[coordx][coordy].push([x,y,z]);
			occupado[coordx][coordy].push([x-1+offset,y+1,z]);
			occupado[coordx][coordy].push([x,y,z+1]);
			occupado[coordx][coordy].push([x-1+offset,y+1,z+1]);
			occupado[coordx][coordy].push([x,y,z+2]);
			occupado[coordx][coordy].push([x-1+offset,y+1,z+2]);
			occupado[coordx][coordy].push([x,y,z+3]);
			occupado[coordx][coordy].push([x-1+offset,y+1,z+3]);
			return true;
		}
		else
			return false;
	}
	else if(which === 9) // double-decker diagonal beam ne/sw
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x+offset, y+1) && blockHexCoordsValid(x+1,y+2) && blockHexCoordsValid(x+1+offset, y+3)
				&& touchesAnother(coordx, coordy, which, x, y, z) && !wouldOverlap(coordx,coordy,which,x,y,z))		
		{
			drawBlockHex(coordx, coordy, x, y, z, color,2);
			drawBlockHex(coordx, coordy, x+offset, y+1, z, darkenColor(color, .98),2);
			drawBlockHex(coordx, coordy, x+1, y+2, z, darkenColor(color, .96),2);
			drawBlockHex(coordx, coordy, x+1+offset, y+3, z, darkenColor(color, .94),2);
			occupado[coordx][coordy].push([x,y,z]);
			occupado[coordx][coordy].push([x+offset,y+1,z]);
			occupado[coordx][coordy].push([x+1,y+2,z]);
			occupado[coordx][coordy].push([x+1+offset,y+3,z]);
			occupado[coordx][coordy].push([x,y,z+1]);
			occupado[coordx][coordy].push([x+offset,y+1,z+1]);
			occupado[coordx][coordy].push([x+1,y+2,z+1]);
			occupado[coordx][coordy].push([x+1+offset,y+3,z+1]);
			return true;
		}
		else
			return false;
	}
	else if(which === 10) // double-decker horizontal beam
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x+1, y) && blockHexCoordsValid(x+2,y) && blockHexCoordsValid(x+3, y)
				&& touchesAnother(coordx, coordy, which, x, y, z) && !wouldOverlap(coordx,coordy,which,x,y,z))		
		{
			drawBlockHex(coordx, coordy, x, y, z, color,2);
			drawBlockHex(coordx, coordy, x+1, y, z, darkenColor(color, .98),2);
			drawBlockHex(coordx, coordy, x+2, y, z, darkenColor(color, .96),2);
			drawBlockHex(coordx, coordy, x+3, y, z, darkenColor(color, .94),2);
			occupado[coordx][coordy].push([x,y,z]);
			occupado[coordx][coordy].push([x+1,y,z]);
			occupado[coordx][coordy].push([x+2,y,z]);
			occupado[coordx][coordy].push([x+3,y,z]);
			occupado[coordx][coordy].push([x,y,z+1]);
			occupado[coordx][coordy].push([x+1,y,z+1]);
			occupado[coordx][coordy].push([x+2,y,z+1]);
			occupado[coordx][coordy].push([x+3,y,z+1]);
			return true;
		}
		else
			return false;
	}
	else if(which === 11) // double-decker diagonal beam nw/se
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x-1+offset, y+1) && blockHexCoordsValid(x-1,y+2) && blockHexCoordsValid(x-2+offset, y+3)
				&& touchesAnother(coordx, coordy, which, x, y, z) && !wouldOverlap(coordx,coordy,which,x,y,z))		
		{
			drawBlockHex(coordx, coordy, x, y, z, darkenColor(color, 1),2);
			drawBlockHex(coordx, coordy, x-1+offset, y+1, z, darkenColor(color, .98),2);
			drawBlockHex(coordx, coordy, x-1, y+2, z, darkenColor(color, .96),2);
			drawBlockHex(coordx, coordy, x-2+offset, y+3, z, darkenColor(color, .94),2);
			occupado[coordx][coordy].push([x,y,z]);
			occupado[coordx][coordy].push([x-1+offset,y+1,z]);
			occupado[coordx][coordy].push([x-1,y+2,z]);
			occupado[coordx][coordy].push([x-2+offset,y+3,z]);
			occupado[coordx][coordy].push([x,y,z+1]);
			occupado[coordx][coordy].push([x-1+offset,y+1,z+1]);
			occupado[coordx][coordy].push([x-1,y+2,z+1]);
			occupado[coordx][coordy].push([x-2+offset,y+3,z+1]);
			return true;
		}
		else
			return false;
	}
	else if(which === 12) // diagonal snake sw/ne
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x+1, y) && blockHexCoordsValid(x+1+offset, y+1) && blockHexCoordsValid(x+2+offset, y+1)
				&& touchesAnother(coordx, coordy, which, x, y, z) && !wouldOverlap(coordx,coordy,which,x,y,z))		
		{
			drawBlockHex(coordx, coordy, x, y, z, darkenColor(color, 1),2);
			drawBlockHex(coordx, coordy, x+1, y, z, darkenColor(color, .98),2);
			drawBlockHex(coordx, coordy, x+1+offset, y+1, z, darkenColor(color, .96),2);
			drawBlockHex(coordx, coordy, x+2+offset, y+1, z, darkenColor(color, .94),2);
			occupado[coordx][coordy].push([x,y,z]);
			occupado[coordx][coordy].push([x+1,y,z]);
			occupado[coordx][coordy].push([x+1+offset,y+1,z]);
			occupado[coordx][coordy].push([x+2+offset,y+1,z]);
			occupado[coordx][coordy].push([x,y,z+1]);
			occupado[coordx][coordy].push([x+1,y,z+1]);
			occupado[coordx][coordy].push([x+1+offset,y+1,z+1]);
			occupado[coordx][coordy].push([x+2+offset,y+1,z+1]);
			return true;
		}
		else
			return false;
	}
	else if(which === 13) // diagonal snake se/nw
	{
		if(blockHexCoordsValid(x,y) && blockHexCoordsValid(x-1, y) && blockHexCoordsValid(x-2+offset, y+1) && blockHexCoordsValid(x-3+offset, y+1)
				&& touchesAnother(coordx, coordy, which, x, y, z) && !wouldOverlap(coordx,coordy,which,x,y,z))		
		{
			drawBlockHex(coordx, coordy, x, y, z, darkenColor(color, 1),2);
			drawBlockHex(coordx, coordy, x-1, y, z, darkenColor(color, .98),2);
			drawBlockHex(coordx, coordy, x-2+offset, y+1, z, darkenColor(color, .96),2);
			drawBlockHex(coordx, coordy, x-3+offset, y+1, z, darkenColor(color, .94),2);
			occupado[coordx][coordy].push([x,y,z]);
			occupado[coordx][coordy].push([x-1,y,z]);
			occupado[coordx][coordy].push([x-1+offset,y+1,z]);
			occupado[coordx][coordy].push([x-2+offset,y+1,z]);
			occupado[coordx][coordy].push([x,y,z+1]);
			occupado[coordx][coordy].push([x-1,y,z+1]);
			occupado[coordx][coordy].push([x-1+offset,y+1,z+1]);
			occupado[coordx][coordy].push([x-2+offset,y+1,z+1]);
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
	
	//console.log("drawBlockHex " + coordx + "," + coordy);
	var xpoint = (coordx - (mapsize-1)/2) * tilewidth;
	if(coordy%2 !== 0)
		xpoint = xpoint + tilewidth/2;
	var ypoint = (coordy - (mapsize-1)/2) * tilevert;
	
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
	//console.log("LOWER " + coordx + "," + coordy + " extrudeamount=" + tileextrusion  + " map[coordx][coordy].elevation=" + map[coordx][coordy].elevation + " EXTRUSION_FACTOR=" + EXTRUSION_FACTOR);
	mesh.position.set( 0, 0, tileextrusion + z * blockextrude);
	scene.add( mesh );
}

// a failed attempt at drawing polygons instead of multiple hexes. Very difficult. Little benefit.
//function drawBlockHex(coordx, coordy, centers, color, extrusion_multiple)
//{
//	if(extrusion_multiple === null || extrusion_multiple === 0)
//		extrusion_multiple = 1;
//	
//	var extrudeSettings = {
//			amount			: blockextrude * extrusion_multiple,
//			steps			: 1,
//			material		: 1,
//			extrudeMaterial : 0,
//			bevelEnabled	: false,
//		};
//	
//	var	material = new THREE.MeshPhongMaterial( { color: color, map: texture1 } );
//	texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
//	texture1.repeat.set( 1.3,1.3 );
//	
//	var hexShape = new THREE.Shape();
//	
//	// xpoint and ypoint are the center of the TILE	
//	var xpoint = (coordx - (mapsize-1)/2) * tilewidth;
//	if(coordy%2 !== 0)
//		xpoint = xpoint + tilewidth/2;
//	var ypoint = (coordy - (mapsize-1)/2) * tilevert;
//	
//	for(var centersindex = 0; centersindex < centers.length; centersindex++)
//	{
//		console.log("centers[" + centersindex + "][0]=" + centers[centersindex][0] + " centers[" + centersindex + "][1]=" + centers[centersindex][1])
//	}	
//	
//	var centerPoint;
//	var points = [];
//	var inner = [];
//	var finexpoint;
//	var fineypoint;
//	for(var i = 0; i < centers.length; i++)
//	{
//		finexpoint = xpoint + centers[i][0] * blockwidth; // now move the "cursor" to the right spot within the tile
//		if(centers[i][1]%2 !== 0)
//			finexpoint = finexpoint + blockwidth/2;
//		fineypoint = ypoint + centers[i][1] * blockvert;
//		console.log("finex=" + finexpoint + " finey=" + fineypoint);
//		centerPoint = new Point(finexpoint, fineypoint);
//		points[i] = [];
//		points[i].push(hex_corner(centerPoint, blocksize, 0));
//		points[i].push(hex_corner(centerPoint, blocksize, 1));
//		points[i].push(hex_corner(centerPoint, blocksize, 2));
//		points[i].push(hex_corner(centerPoint, blocksize, 3));
//		points[i].push(hex_corner(centerPoint, blocksize, 4));
//		points[i].push(hex_corner(centerPoint, blocksize, 5));
//	}	
//
//	console.log("points.length=" + points.length);
//	for(var apple = 0; apple < points.length; apple++)
//	{
//		console.log("points[" + apple + "].length=" + points[apple].length);
//		for(var orange = 0; orange < points[apple].length; orange++)
//		{
//			console.log(points[apple][orange]);
//		}	
//	}	
//	
//	var newarray = [];
//	if(points.length == 1)
//	{
//		console.log('only one hex to draw');
//		newarray = points[0];
//	}	
//	else
//	{	
//		var index = 0;
//		console.log("more than one hex. Looping through the points arrays");
//		for(var q = points.length-1; q >=1; q--)
//		{
//			console.log("looking at the 6-point array in points[" + q + "]");
//			for(var r = 0; r < points[q].length; r++)
//			{
//				console.log("checking if points[" + q + "][" + r + "] x=" + points[q][r].x + " y=" + points[q][r].y + " exists in the 6-point array in points[" + (q-1)  + "]");
//				for(var quick = 0; quick < points[q-1].length; quick++)
//				{
//					console.log(points[q-1][quick].x + " and " + points[q-1][quick].y);
//					index = -1;
//					if(Math.round(points[q][r].x*100000000) == Math.round(points[q-1][quick].x*100000000) && Math.round(points[q][r].y*100000000) == Math.round(points[q-1][quick].y*100000000))
//					{
//						index = quick;
//						quick = points[q-1].length; // break
//					}
//				}	
//				//index = $.inArray(points[q][r], points[q-1]);
//				if(index != -1)
//				{
//					console.log("It does!");
//					for(var a = 0; a < index; a++)
//						newarray.push(points[q-1][a]);
//					for(var b = 0; b < points[q].length; b++)
//						newarray.push(points[q][b]);
//					for(var c = (index+2); c < points[q-1].length; c++)
//						newarray.push(points[q-1][c]);
//				}	
//				else
//				{
//					console.log("It does NOT!")
//				}	
//			}	
//		}
//	}
//	
//	console.log(newarray.length);
//	
//	for(var banana = 0; banana < newarray.length; banana++)
//	{
//		console.log(newarray[banana].x + " and " + newarray[banana].y);
//	}	
//	
//	for(var p = 0; p < newarray.length; p++)
//	{
//		if(p === 0)
//			hexShape.moveTo( newarray[p].x , newarray[p].y );
//		else
//			hexShape.lineTo( newarray[p].x, newarray[p].y );
//	}
//	hexShape.moveTo( newarray[0].x , newarray[0].y );
//	
//	var hexGeom = new THREE.ExtrudeGeometry( hexShape, extrudeSettings );
//
//	var mesh = new THREE.Mesh( hexGeom, material );
//	var tileextrusion;
//	if(map[coordx][coordy].elevation < SEA_LEVEL)
//	{
//		tileextrusion = SEA_LEVEL * EXTRUSION_FACTOR;
//	}	
//	else
//	{
//		tileextrusion = map[coordx][coordy].elevation * EXTRUSION_FACTOR;
//	}	
//	console.log("LOWER " + coordx + "," + coordy + " extrudeamount=" + tileextrusion  + " map[coordx][coordy].elevation=" + map[coordx][coordy].elevation + " EXTRUSION_FACTOR=" + EXTRUSION_FACTOR);
//	mesh.position.set( 0, 0, tileextrusion + centers[0][2] * blockextrude);
//	scene.add( mesh );
//}

//if(which === 0) // 8 high column
//{
//	surroundings.push([x,y,z-1]); // block beneath
//	surroundings.push([x,y,z+8]); // block above
//}
//else if(which === 1)
//{
//	surroundings.push([x,y,z-1]); 			// blocks beneath
//	surroundings.push([x+offset,y+1,z-1]); 
//	surroundings.push([x+1,y+2,z-1]);
//	surroundings.push([x+1+offset,y+3,z-1]);
//	surroundings.push([x+2,y+4,z-1]);
//	surroundings.push([x+2+offset,y+5,z-1]);
//	surroundings.push([x+3,y+6,z-1]);
//	surroundings.push([x+3+offset,y+7,z-1]);
//	
//	surroundings.push([x,y,z+1]); 			// blocks above
//	surroundings.push([x+offset,y+1,z+1]); 
//	surroundings.push([x+1,y+2,z+1]);
//	surroundings.push([x+1+offset,y+3,z+1]);
//	surroundings.push([x+2,y+4,z+1]);
//	surroundings.push([x+2+offset,y+5,z+1]);
//	surroundings.push([x+3,y+6,z+1]);
//	surroundings.push([x+3+offset,y+7,z+1]);
//}	
//else if(which === 2)
//{
//	surroundings.push([x,y,z-1]); 			// blocks beneath
//	surroundings.push([x+1,y,z-1]); 
//	surroundings.push([x+2,y,z-1]);
//	surroundings.push([x+3,y,z-1]);
//	surroundings.push([x+4,y,z-1]);
//	surroundings.push([x+5,y,z-1]);
//	surroundings.push([x+6,y,z-1]);
//	surroundings.push([x+7,y,z-1]);
//	
//	surroundings.push([x,y,z+1]); 			// blocks above
//	surroundings.push([x+1,y,z+1]); 
//	surroundings.push([x+2,y,z+1]);
//	surroundings.push([x+3,y,z+1]);
//	surroundings.push([x+4,y,z+1]);
//	surroundings.push([x+5,y,z+1]);
//	surroundings.push([x+6,y,z+1]);
//	surroundings.push([x+7,y,z+1]);
//}	
//else if(which === 3)
//{
//	surroundings.push([x,y,z-1]); 			// blocks beneath
//	surroundings.push([x-1+offset,y+1,z-1]); 
//	surroundings.push([x-1,y+2,z-1]);
//	surroundings.push([x-2+offset,y+3,z-1]);
//	surroundings.push([x-2,y+4,z-1]);
//	surroundings.push([x-3+offset,y+5,z-1]);
//	surroundings.push([x-3,y+6,z-1]);
//	surroundings.push([x-4+offset,y+7,z-1]);
//	
//	surroundings.push([x,y,z+1]); 			// blocks above
//	surroundings.push([x-1+offset,y+1,z+1]); 
//	surroundings.push([x-1,y+2,z+1]);
//	surroundings.push([x-2+offset,y+3,z+1]);
//	surroundings.push([x-2,y+4,z+1]);
//	surroundings.push([x-3+offset,y+5,z+1]);
//	surroundings.push([x-3,y+6,z+1]);
//	surroundings.push([x-4+offset,y+7,z+1]);
//}	
//else if(which === 4)
//{
//	surroundings.push([x,y,z-1]); 			// blocks beneath
//	surroundings.push([x+1,y,z-1]); 
//	surroundings.push([x+1+offset,y+1,z-1]);
//	surroundings.push([x+2+offset,y+1,z-1]);
//	surroundings.push([x+3,y+2,z-1]);
//	surroundings.push([x+4,y+2,z-1]);
//	surroundings.push([x+4+offset,y+3,z-1]);
//	surroundings.push([x+5+offset,y+3,z-1]);
//	
//	surroundings.push([x,y,z+1]); 			// blocks above
//	surroundings.push([x+1,y,z+1]); 
//	surroundings.push([x+1+offset,y+1,z+1]);
//	surroundings.push([x+2+offset,y+1,z+1]);
//	surroundings.push([x+3,y+2,z+1]);
//	surroundings.push([x+4,y+2,z+1]);
//	surroundings.push([x+4+offset,y+3,z+1]);
//	surroundings.push([x+5+offset,y+3,z+1]);
//}	
//else if(which === 5)
//{
//	surroundings.push([x,y,z-1]); 			// blocks beneath
//	surroundings.push([x-1,y,z-1]); 
//	surroundings.push([x-1+offset,y+1,z-1]);
//	surroundings.push([x-2+offset,y+1,z-1]);
//	surroundings.push([x-3,y+2,z-1]);
//	surroundings.push([x-4,y+2,z-1]);
//	surroundings.push([x-4+offset,y+3,z-1]);
//	surroundings.push([x-5+offset,y+3,z-1]);
//	
//	surroundings.push([x,y,z+1]); 			// blocks above
//	surroundings.push([x-1,y,z+1]); 
//	surroundings.push([x-1+offset,y+1,z+1]);
//	surroundings.push([x-2+offset,y+1,z+1]);
//	surroundings.push([x-3,y+2,z+1]);
//	surroundings.push([x-4,y+2,z+1]);
//	surroundings.push([x-4+offset,y+3,z+1]);
//	surroundings.push([x-5+offset,y+3,z+1]);
//}
//else if(which === 6)
//{
//	surroundings.push([x,y,z-1]);	// blocks beneath 	
//	surroundings.push([x+1,y,z-1]); 	
//	
//	surroundings.push([x,y,z+4]);	// blocks above 	
//	surroundings.push([x+1,y,z+4]); 	
//}
//else if(which === 7)
//{
//	surroundings.push([x,y,z-1]);	// blocks beneath 	
//	surroundings.push([x+0+offset,y+1,z-1]); 	
//	
//	surroundings.push([x,y,z+4]);	// blocks above 	
//	surroundings.push([x+0+offset,y+1,z+4]); 	
//}
//else if(which === 8)
//{
//	surroundings.push([x,y,z-1]);	// blocks beneath 	
//	surroundings.push([x-1+offset,y+1,z-1]); 	
//	
//	surroundings.push([x,y,z+4]);	// blocks above 	
//	surroundings.push([x-1+offset,y+1,z+4]); 	
//}
//else if(which === 9)
//{
//	surroundings.push([x,y,z-1]); 			// blocks beneath
//	surroundings.push([x+offset,y+1,z-1]); 
//	surroundings.push([x+1,y+2,z-1]);
//	surroundings.push([x+1+offset,y+3,z-1]);
//	
//	surroundings.push([x,y,z+2]); 			// blocks above
//	surroundings.push([x+offset,y+1,z+2]); 
//	surroundings.push([x+1,y+2,z+2]);
//	surroundings.push([x+1+offset,y+3,z+2]);
//}
//else if(which === 10)
//{
//	surroundings.push([x,y,z-1]); 			// blocks beneath
//	surroundings.push([x+1,y,z-1]); 
//	surroundings.push([x+2,y,z-1]);
//	surroundings.push([x+3,y,z-1]);
//	
//	surroundings.push([x,y,z+2]); 			// blocks above
//	surroundings.push([x+1,y,z+2]); 
//	surroundings.push([x+2,y,z+2]);
//	surroundings.push([x+3,y,z+2]);
//}
//else if(which === 11)
//{
//	surroundings.push([x,y,z-1]); 			// blocks beneath
//	surroundings.push([x-1+offset,y+1,z-1]); 
//	surroundings.push([x-1,y+2,z-1]);
//	surroundings.push([x-2+offset,y+3,z-1]);
//	
//	surroundings.push([x,y,z+2]); 			// blocks above
//	surroundings.push([x-1+offset,y+1,z+2]); 
//	surroundings.push([x-1,y+2,z+2]);
//	surroundings.push([x-2+offset,y+3,z+2]);
//}
//else if(which === 12)
//{
//	surroundings.push([x,y,z-1]); 			// blocks beneath
//	surroundings.push([x+1,y,z-1]); 
//	surroundings.push([x+1+offset,y+1,z-1]);
//	surroundings.push([x+2+offset,y+1,z-1]);
//	
//	surroundings.push([x,y,z+2]); 			// blocks above
//	surroundings.push([x+1,y,z+2]); 
//	surroundings.push([x+1+offset,y+1,z+2]);
//	surroundings.push([x+2+offset,y+1,z+2]);
//}
//else if(which === 13)
//{
//	surroundings.push([x,y,z-1]); 			// blocks beneath
//	surroundings.push([x-1,y,z-1]); 
//	surroundings.push([x-1+offset,y+1,z-1]);
//	surroundings.push([x-2+offset,y+1,z-1]);
//	
//	surroundings.push([x,y,z+2]); 			// blocks above
//	surroundings.push([x-1,y,z+2]); 
//	surroundings.push([x-1+offset,y+1,z+2]);
//	surroundings.push([x-2+offset,y+1,z+2]);
//}