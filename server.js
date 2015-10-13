/*var http = require('http');
var web3 = require('web3');
http.createServer(function handler(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('something\n');
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
    res.write('' + web3.fromWei(web3.eth.getBalance('0xcf684dfb8304729355b58315e8019b1aa2ad1bac')) + '\n');
    res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
*/

var express = require('express');
var async = require('async');
//var async = require('async');

var web3 = require('web3');
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));


var abi = [{"constant":true,"inputs":[],"name":"getElevations","outputs":[{"name":"","type":"uint8[17][17]"}],"type":"function"},{"constant":true,"inputs":[],"name":"getIlliquidBalance","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"}],"name":"buyTile","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_b32","type":"bytes32"},{"name":"byteindex","type":"uint8"}],"name":"getUint8FromByte32","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[{"name":"row","type":"uint8"},{"name":"_elevations","type":"uint8[17]"}],"name":"initializeTiles","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"}],"name":"makeOffer","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"}],"name":"getOfferers","outputs":[{"name":"","type":"address[]"}],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"},{"name":"indexOfBlockToEdit","type":"uint256"},{"name":"block","type":"int8[7]"}],"name":"editBlock","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"retrieveLiquidBalance","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"getLiquidBalance","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"}],"name":"farmTile","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"getOwners","outputs":[{"name":"","type":"address[17][17]"}],"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"}],"name":"getBlocksForTile","outputs":[{"name":"","type":"int8[]"}],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"},{"name":"i","type":"uint8"}],"name":"acceptOffer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"},{"name":"i","type":"uint8"}],"name":"rejectOffer","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"}],"name":"getOffers","outputs":[{"name":"","type":"uint256[]"}],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"}],"name":"retractOffer","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"}];
var etheriaaddress = "0xc31ba27585978de7df2b7cb3797b21b9531335ec";
var etheria = web3.eth.contract(abi).at(etheriaaddress);

var app = express();

app.use(express.static('WebContent'));

/* 
 We want the map in this format:
 {
 	"map":[
 		[tile0, ... tile32], [tile33...tile65]...
 	]
 }
 where each tile is 
 {
 	"e": 134,ls
 	
 	"owner": 0xabc123...,
 	"price": 7000000000
 	"blocks": [
 		[which0,blockx0,blocky0,blockz0,r0,g0,b0,which1,blockx1,blocky1,blockz1,r1,g1,b1,...]
 	]
 }
 */
var mapsize = 17; //etheria.getMapsize(); 
var elevations;
var owners;

var blocks;
blocks = new Array(mapsize);
for (i = 0; i < mapsize; i++) {
	  blocks[i] = new Array(mapsize);
}

var lastcheck = 0;

app.get('/lastcheck', function (req, res){
	res.end(lastcheck + "");
});

retrieveMap();

function retrieveMap() {
	console.log('getting elevations');
	etheria.getElevations.call(function(error, result) { elevations = result; });
	console.log('done getting elevations, getting owners');
	etheria.getOwners.call(function(error, result) { owners = result; });
	console.log('done getting owners');
		
	var row = 0;
	var col = 0;
	for(row = 0; row < mapsize; row++)
	{
		col = 0;
		for(col = 0; col < mapsize; col++)
		{
			//console.log('getting blocks for ' + col + "," + row);
			var gB = function() { 
				var c = col;
				var r = row;
				etheria.getBlocksForTile.call(c, r, function(error, result) { 
					//console.log('callback c=' + c + ' and r=' + r);
					blocks[c][r] = result; 
				});
			};
			gB();
			//console.log('done getting blocks');
		}
	}
//	async.series([
//	              function(){
//	            	  console.log('getting elevations');
//	            	  
//	            	  console.log('done getting elevations');
//	            	  //callback(null, elevations);
//	              },
//	              function(){
//	            	  console.log('getting owners');
//	            	 
//	            	  console.log('done getting owners');
//	            	  //callback(null, owners);
//	              },
//	              ]
//	,
//	              function(err, results){
//						console.log(results);
//						console.log('inside callback, assembling map object');
//						assembleMapObject(results[0], results[1]);
//						console.log('inside callback, done assembling map object');
//				}
//	);
}

function getMap()
{
	if(typeof elevations === "undefined" || elevations === null || typeof owners === "undefined" || owners === null) // not yet available
		return null; // signals to the frontend that the map is not yet available
	var row_ja = [];
	var jo = {};
	var blocks_ja = [];
	var block_jo = {};
	var map_ja = [];
	for(var row = 0; row < mapsize; row++)
	{
		row_ja = [];
		for(var col = 0; col < mapsize; col++)
		{
			jo = {};
			jo.x = row;
			jo.y = col;
			jo.elevation = elevations[col][row] * 1;
			jo.owner = owners[col][row];
			blocks_ja = [];
			for(var i = 0; i < blocks[col][row].length; i+=7)
			{
				block_jo = {};
				block_jo.which = blocks[col][row][i]*1;
				block_jo.x = blocks[col][row][i+1]*1;
				block_jo.y = blocks[col][row][i+2]*1;
				block_jo.z = blocks[col][row][i+3]*1;
				block_jo.r = blocks[col][row][i+4]*1;
				block_jo.g = blocks[col][row][i+5]*1;
				block_jo.b = blocks[col][row][i+6]*1;
				blocks_ja.push(block_jo);
			}	
			jo.blocks = blocks_ja;
			row_ja.push(jo);
		}
		map_ja.push(row_ja);
	}	
	return map_ja;
}



app.get('/map', function (req, res) {
	console.log("entering /map");
	var map_ja = getMap();
	res.json(map_ja);  // at this point, we're done answering the request. Now check to see if we need to retrieve the map again.
	console.log(JSON.stringify(map_ja));
	console.log(process.hrtime()[0]+" - " + lastcheck + " = " + (process.hrtime()[0] - lastcheck));
	if((process.hrtime()[0] - lastcheck) > 60) // if it's been more than 1 min, retrieve map from blockchain
	{	
		console.log("been a while. Regenning map");
		lastcheck = process.hrtime()[0];
		console.log('executing first in series. Getting map.');
		retrieveMap();
		console.log('after getMap');
	}
});

app.get('/date', function (req, res) {
	res.send(process.hrtime()); //Date.now());
});

app.get('/', function (req, res) {
	  res.write('' + web3.fromWei(web3.eth.getBalance('0xcf684dfb8304729355b58315e8019b1aa2ad1bac')) + '\n');
	    res.end('Hello World\n');
});

var server = app.listen(1337, function () {
  var host = server.address().address;
  var port = server.address().port;
  map_ja = [];
  console.log('Example app listening at http://%s:%s', host, port);
});