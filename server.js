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

var web3 = require('web3');
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

//var abi = [{"constant":true,"inputs":[],"name":"getElevations","outputs":[{"name":"","type":"uint8[17][17]"}],"type":"function"},{"constant":true,"inputs":[],"name":"getIlliquidBalance","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"}],"name":"buyTile","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_b32","type":"bytes32"},{"name":"byteindex","type":"uint8"}],"name":"getUint8FromByte32","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[{"name":"row","type":"uint8"},{"name":"_elevations","type":"uint8[17]"}],"name":"initializeTiles","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"}],"name":"makeOffer","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"}],"name":"getOfferers","outputs":[{"name":"","type":"address[]"}],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"},{"name":"indexOfBlockToEdit","type":"uint256"},{"name":"block","type":"int8[7]"}],"name":"editBlock","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"retrieveLiquidBalance","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"getLiquidBalance","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"}],"name":"farmTile","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"getOwners","outputs":[{"name":"","type":"address[17][17]"}],"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"}],"name":"getBlocksForTile","outputs":[{"name":"","type":"int8[]"}],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"},{"name":"i","type":"uint8"}],"name":"acceptOffer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"},{"name":"i","type":"uint8"}],"name":"rejectOffer","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"}],"name":"getOffers","outputs":[{"name":"","type":"uint256[]"}],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint8"},{"name":"y","type":"uint8"}],"name":"retractOffer","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"}];
var abi =[{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"row","type":"uint8"},{"name":"col","type":"uint8"}],"name":"getWhatHappened","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":true,"inputs":[{"name":"_b32","type":"bytes32"},{"name":"byteindex","type":"uint8"}],"name":"getUint8FromByte32","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"},{"name":"_s","type":"string"}],"name":"setStatus","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"makeOffer","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"getOfferers","outputs":[{"name":"","type":"address[]"}],"type":"function"},{"constant":false,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"},{"name":"index","type":"uint256"},{"name":"_block","type":"int8[5]"}],"name":"editBlock","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"getOccupado","outputs":[{"name":"","type":"int8[3][]"}],"type":"function"},{"constant":false,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"},{"name":"_n","type":"string"}],"name":"setName","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"farmTile","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"getName","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"},{"name":"i","type":"uint8"}],"name":"acceptOffer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"},{"name":"i","type":"uint8"}],"name":"rejectOffer","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"getOffers","outputs":[{"name":"","type":"uint256[]"}],"type":"function"},{"constant":true,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"getStatus","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"getOwner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"retractOffer","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"getBlocks","outputs":[{"name":"","type":"int8[5][]"}],"type":"function"},{"inputs":[],"type":"constructor"}];
var etheriaaddress = "0x96b93e5d82cb6546468d3ee1012896b3ce5dc3fe";
var etheria = web3.eth.contract(abi).at(etheriaaddress);

var elevation_abi = [{"constant":true,"inputs":[],"name":"getElevations","outputs":[{"name":"","type":"uint8[1089]"}],"type":"function"},{"constant":false,"inputs":[],"name":"setLocked","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"getLocked","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"getElevation","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[{"name":"col","type":"uint8"},{"name":"_elevations","type":"uint8[33]"}],"name":"initElevations","outputs":[],"type":"function"}];
var elevationaddress = "0x68549d7dbb7a956f955ec1263f55494f05972a6b";
var elevationcontract = web3.eth.contract(elevation_abi).at(elevationaddress);

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
var mapsize = 33; //etheria.getMapsize(); 
var elevations;
elevations = new Array(mapsize);
for (i = 0; i < mapsize; i++) {
	elevations[i] = new Array(mapsize);
}

var owners;
owners = new Array(mapsize);
for (i = 0; i < mapsize; i++) {
	owners[i] = new Array(mapsize);
}

var names;
names = new Array(mapsize);
for (i = 0; i < mapsize; i++) {
	  names[i] = new Array(mapsize);
}
var statuses;
statuses = new Array(mapsize);
for (i = 0; i < mapsize; i++) {
	  statuses[i] = new Array(mapsize);
}

var blocks;
blocks = new Array(mapsize);
for (i = 0; i < mapsize; i++) {
	  blocks[i] = new Array(mapsize);
}

//var lastcheck = 0;
//
//app.get('/lastcheck', function (req, res){
//	res.end(lastcheck + "");
//});

retrieveMap();

//map-wide information retrieval // only need to do this once as elevations will never change.
console.log('getting elevations');
elevationcontract.getElevations.call(function(error, result) { 
	console.log('elevations callback ' + JSON.stringify(result));
	var somecounter = 0;
	for(var col = 0; col < mapsize; col++)
	{
		for(var row = 0; row < mapsize; row++)
		{
			console.log("setting elevations[" + col + "][" + row + "] = result[" + somecounter + "] " + (result[somecounter]*1));
			elevations[col][row] = result[somecounter]*1;
			somecounter++;
		}
	}
});
console.log('done getting elevations');

var map_retrieval_index = 0;

setInterval(function () { retrieveMap(map_retrieval_index); map_retrieval_index++; if(map_retrieval_index === mapsize) { map_retrieval_index = 0; }}, 5000);

function retrieveMap ( row ) {
	
	//map-wide information retrieval // only need to do this once
	// tile-by-tile information retrieval
	
//	var batch = web3.createBatch();
//	batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
//	batch.add(web3.eth.contract(abi).at(address).balance.request(address, callback2));
//	for(var row = 0; row < mapsize; row++)
//	{
		for(var col = 0; col < mapsize; col++)
		{
			//console.log('getting blocks for ' + col + "," + row);
			var gB = function() { 
				var c = col;
				var r = row;
				etheria.getBlocks.call(c, r, function(error, result) { //console.log('returned from getting blocks for ' + c + "," + r + JSON.stringify(result)); blocks[c][r] = result; });
					if(typeof result === "undefined" || result === null)
					{
						console.log('WARNING: Retrieval of blocks at c,r ' + c + "," + r + 'failed');
					}	
					else
					{
						for(var u = 0; u < result.length; u++)
						{
							for(var v = 0; v < 5; v++)
							{
								result[u][v] = result[u][v]*1; 
							}	
						}
						blocks[c][r] = result;
					}
				});
				etheria.getOwner.call(c, r, function(error, result) { //console.log('returned from getting blocks for ' + c + "," + r + JSON.stringify(result)); blocks[c][r] = result; });
					if(typeof result === "undefined" || result === null)
					{
						console.log('WARNING: Retrieval of owner c,r ' + c + "," + r + 'failed');
					}	
					else
					{
						owners[c][r] = result;
					}
				});
				etheria.getName.call(c, r, function(error, result) { //console.log('returned from getting blocks for ' + c + "," + r + JSON.stringify(result)); blocks[c][r] = result; });
					if(typeof result === "undefined" || result === null)
					{
						console.log('WARNING: Retrieval of name c,r ' + c + "," + r + 'failed');
					}	
					else
					{
						names[c][r] = result;
					}
				});
				etheria.getStatus.call(c, r, function(error, result) { //console.log('returned from getting blocks for ' + c + "," + r + JSON.stringify(result)); blocks[c][r] = result; });
					if(typeof result === "undefined" || result === null)
					{
						console.log('WARNING: Retrieval of status c,r ' + c + "," + r + 'failed');
					}	
					else
					{
						statuses[c][r] = result;
					}
				});
			};
			gB();
		}
//	}
	
}

function getMap()
{
	if(typeof elevations === "undefined" || elevations === null || typeof owners === "undefined" || owners === null) // not yet available
		return null; // signals to the frontend that the map is not yet available
	var row_ja = [];
	var jo = {};
	var blocks_ja = [];
	var block_jo = {};
	var map_ja;
	
	map_ja = new Array(mapsize);
	for (i = 0; i < mapsize; i++) {
		  map_ja[i] = new Array(mapsize);
	}
	
	/* we want to create a 2D array where [1][3] gets the 4th object in the array at the 2nd outer array position
 	[
		[							  // first column
		 	{ "col":0, "row": 0 ...},
			{ "col":0, "row": 1 ...}, // because [0][1] gets this object.
			...
		],
		[							  // second column
		 	{ "col":0, "row": 0 ...},
			{ "col":0, "row": 1 ...}, // because [0][1] gets this object.
			...
		],
			
	*/
	
	for(var col = 0; col < mapsize; col++)
	{
		for(var row = 0; row < mapsize; row++)
		{
			jo = {};
			jo.col = col; // these are reversed on purpose. I don't fully understand, but fuck it. I had a rough night.
			jo.row = row;
			jo.elevation = elevations[col][row] * 1;
			jo.owner = owners[col][row];
			jo.blocks = blocks[col][row];
			jo.status = statuses[col][row];
			jo.name = names[col][row];
			map_ja[col][row] = jo;
		}
	}	
	return map_ja;
}



app.get('/map', function (req, res) {
	console.log("entering /map");
	var map_ja = getMap();
	res.json(map_ja);  // at this point, we're done answering the request. Now check to see if we need to retrieve the map again.
//	console.log(JSON.stringify(map_ja));
//	console.log(process.hrtime()[0]+" - " + lastcheck + " = " + (process.hrtime()[0] - lastcheck));
//	if((process.hrtime()[0] - lastcheck) > 15) // if it's been more than 15 sec, retrieve map from blockchain
//	{	
//		console.log("been a while. Regenning map");
//		lastcheck = process.hrtime()[0];
//		console.log('executing first in series. Getting map.');
//		retrieveMap();
//		console.log('after getMap');
//	}
});

app.get('/blocks', function (req, res) {
	console.log("entering /blocks");
	res.json(blocks);  // at this point, we're done answering the request. Now check to see if we need to retrieve the map again.
	console.log(blocks);
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