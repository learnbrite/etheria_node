var express = require('express');

var web3 = require('web3');
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

var elevation_abi = [{"constant":true,"inputs":[],"name":"getElevations","outputs":[{"name":"","type":"uint8[1089]"}],"type":"function"},{"constant":false,"inputs":[],"name":"setLocked","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"getLocked","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"getElevation","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"col","type":"uint8"},{"name":"_elevations","type":"uint8[33]"}],"name":"initElevations","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"}]
var elevationcontract = web3.eth.contract(elevation_abi).at("0x68549d7dbb7a956f955ec1263f55494f05972a6b");

var abi = [{"constant":false,"inputs":[],"name":"setLocked","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"getWhatHappened","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":true,"inputs":[],"name":"getLocked","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_b32","type":"bytes32"},{"name":"byteindex","type":"uint8"}],"name":"getUint8FromByte32","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"},{"name":"_s","type":"string"}],"name":"setStatus","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"makeOffer","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"getOfferers","outputs":[{"name":"","type":"address[]"}],"type":"function"},{"constant":false,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"},{"name":"i","type":"uint8"},{"name":"amt","type":"uint256"}],"name":"deleteOffer","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"getLastFarm","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"},{"name":"index","type":"uint256"},{"name":"_block","type":"int8[5]"}],"name":"editBlock","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"},{"name":"_n","type":"string"}],"name":"setName","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"farmTile","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"},{"name":"i","type":"uint8"},{"name":"amt","type":"uint256"}],"name":"acceptOffer","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"getName","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"getOffers","outputs":[{"name":"","type":"uint256[]"}],"type":"function"},{"constant":true,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"getStatus","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"getOwner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"col","type":"uint8"},{"name":"row","type":"uint8"}],"name":"getBlocks","outputs":[{"name":"","type":"int8[5][]"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"col","type":"uint8"},{"indexed":false,"name":"row","type":"uint8"}],"name":"TileChanged","type":"event"}];
var etheria = web3.eth.contract(abi).at('0xe414716f017b5c1457bf98e985bccb135dff81f2');

var events = etheria.allEvents(function(error, log){
	if (error)
		console.log(error);
	else if (!error)
	{
		console.log(log);
		retrieveTileInfo (log.args.col*1, log.args.row*1);
	}
});

var app = express();

app.use(express.static('WebContent'));

/* 
 Ultimately, we want the map in this format:
 {
 	"map":[
 		[tile0, ... tile32],  // first COLUMN (so that [0][1] gets the second object, eg.)
 		[tile33...tile65]...  // second COLUMN (so that [1][1] gets the second object in the second column, eg.)
 	]
 }
 where each tile is 
 {
 	"elevation": 134,ls
 	"owner": 0xabc123...,
 	"status": "blah",
 	"name": "some name",
 	"blocks": [
 		[which0,blockx0,blocky0,blockz0,r0,g0,b0,which1,blockx1,blocky1,blockz1,r1,g1,b1,...]
 	]
 }
 */
var mapsize = 33; //etheria.combineTileAndElevationInfoIntoSingleMapObjectsize(); 

//map-wide information retrieval // only need to do this once as elevations will never change.
var elevations;
elevations = new Array(mapsize);
for (i = 0; i < mapsize; i++) {
	elevations[i] = new Array(mapsize);
}
console.log('getting elevations');
elevationcontract.getElevations.call(function(error, result) { 
	console.log('elevations callback error ' + JSON.stringify(result));
	console.log('elevations callback result ' + JSON.stringify(result));
	var numland = 0;
	var somecounter = 0;
	for(var col = 0; col < mapsize; col++)
	{
		for(var row = 0; row < mapsize; row++)
		{
			console.log("setting elevations[" + col + "][" + row + "] = result[" + somecounter + "] " + (result[somecounter]*1));
			elevations[col][row] = result[somecounter]*1;
			if(result[somecounter]*1 >= 125)
				numland++;
			somecounter++;
		}
	}
	console.log('numland=' + numland);
});
console.log('done getting elevations');

//owner, name, status, lastfarm, offerers, offers, blocks

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

var lastfarms;
lastfarms = new Array(mapsize);
for (i = 0; i < mapsize; i++) {
	  lastfarms[i] = new Array(mapsize);
}

var offerers;
offerers = new Array(mapsize);
for (i = 0; i < mapsize; i++) {
	  offerers[i] = new Array(mapsize);
}

var offers;
offers = new Array(mapsize);
for (i = 0; i < mapsize; i++) {
	  offers[i] = new Array(mapsize);
}

var blocks;
blocks = new Array(mapsize);
for (i = 0; i < mapsize; i++) {
	  blocks[i] = new Array(mapsize);
}

var c = 0;
var r = 0;

var map_retrieval_index = 0;
console.log('before setinterval');
var myTimer = setInterval(function () { 
	console.log('inside setinterval callback');
	r = map_retrieval_index % 33;
	c = (map_retrieval_index - r) / mapsize;
	retrieveTileInfo(c,r); 
	map_retrieval_index++; 
	if(map_retrieval_index >= 1089)
	{	
		clearInterval(myTimer);
	}
}, 30);

function retrieveTileInfo (col, row) {
	var batch = web3.createBatch();
	
	//row = map_retrieval_index % 33;
	//col = (map_retrieval_index - row) / mapsize;
	console.log('getting block for ' + col + "," + row);
	
		var gB = function() { 
			var c = col;
			var r = row;
			batch.add(etheria.getOwner.request(c, r, function(error, result) { //console.log('returned from getting blocks for ' + c + "," + r + JSON.stringify(result)); blocks[c][r] = result; });
				if(typeof result === "undefined" || result === null)
				{
					console.log('WARNING: Retrieval of owner c,r ' + c + "," + r + 'failed');
				}	
				else
				{
					owners[c][r] = result;
				}
			}));
			batch.add(etheria.getName.request(c, r, function(error, result) { //console.log('returned from getting blocks for ' + c + "," + r + JSON.stringify(result)); blocks[c][r] = result; });
				if(typeof result === "undefined" || result === null)
				{
					console.log('WARNING: Retrieval of name c,r ' + c + "," + r + 'failed');
				}	
				else
				{
					names[c][r] = result;
				}
			}));
			batch.add(etheria.getStatus.request(c, r, function(error, result) { //console.log('returned from getting blocks for ' + c + "," + r + JSON.stringify(result)); blocks[c][r] = result; });
				if(typeof result === "undefined" || result === null)
				{
					console.log('WARNING: Retrieval of status c,r ' + c + "," + r + 'failed');
				}	
				else
				{
					statuses[c][r] = result;
				}
			}));
			batch.add(etheria.getLastFarm.request(c, r, function(error, result) { //console.log('returned from getting blocks for ' + c + "," + r + JSON.stringify(result)); blocks[c][r] = result; });
				if(typeof result === "undefined" || result === null)
				{
					console.log('WARNING: Retrieval of lastfarm c,r ' + c + "," + r + 'failed');
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
					lastfarms[c][r] = result;
				}
			}));
			batch.add(etheria.getOfferers.request(c, r, function(error, result) { //console.log('returned from getting blocks for ' + c + "," + r + JSON.stringify(result)); blocks[c][r] = result; });
				if(typeof result === "undefined" || result === null)
				{
					console.log('WARNING: Retrieval of offerers c,r ' + c + "," + r + 'failed');
				}	
				else
				{
					offerers[c][r] = result;
				}
			}));
			batch.add(etheria.getOffers.request(c, r, function(error, result) { //console.log('returned from getting blocks for ' + c + "," + r + JSON.stringify(result)); blocks[c][r] = result; });
				if(typeof result === "undefined" || result === null)
				{
					console.log('WARNING: Retrieval of offers c,r ' + c + "," + r + 'failed');
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
					offers[c][r] = result;
				}
			}));
			batch.add(etheria.getBlocks.request(c, r, function(error, result) { //console.log('returned from getting blocks for ' + c + "," + r + JSON.stringify(result)); blocks[c][r] = result; });
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
			}));
		};
		gB();
	batch.execute();
}
//function retrieveTileInfo () 
//{
//var batch = web3.createBatch();
//
////row = map_retrieval_index % 33;
////col = (map_retrieval_index - row) / mapsize;
////console.log('getting block for ' + col + "," + row);
//
//for(var col = 0; col < (mapsize -1); col++)
//{
//	for(var row = 0; row < (mapsize -1); row++)
//	{
//		var gB = function() { 
//			var c = col;
//			var r = row;
//			batch.add(etheria.getBlocks.request(c, r, function(error, result) { //console.log('returned from getting blocks for ' + c + "," + r + JSON.stringify(result)); blocks[c][r] = result; });
//				if(typeof result === "undefined" || result === null)
//				{
//					console.log('WARNING: Retrieval of blocks at c,r ' + c + "," + r + 'failed');
//				}	
//				else
//				{
//					for(var u = 0; u < result.length; u++)
//					{
//						for(var v = 0; v < 5; v++)
//						{
//							result[u][v] = result[u][v]*1; 
//						}	
//					}
//					blocks[c][r] = result;
//				}
//			}));
//			batch.add(etheria.getOwner.request(c, r, function(error, result) { //console.log('returned from getting blocks for ' + c + "," + r + JSON.stringify(result)); blocks[c][r] = result; });
//				if(typeof result === "undefined" || result === null)
//				{
//					console.log('WARNING: Retrieval of owner c,r ' + c + "," + r + 'failed');
//				}	
//				else
//				{
//					owners[c][r] = result;
//				}
//			}));
//			batch.add(etheria.getName.request(c, r, function(error, result) { //console.log('returned from getting blocks for ' + c + "," + r + JSON.stringify(result)); blocks[c][r] = result; });
//				if(typeof result === "undefined" || result === null)
//				{
//					console.log('WARNING: Retrieval of name c,r ' + c + "," + r + 'failed');
//				}	
//				else
//				{
//					names[c][r] = result;
//				}
//			}));
//			batch.add(etheria.getStatus.request(c, r, function(error, result) { //console.log('returned from getting blocks for ' + c + "," + r + JSON.stringify(result)); blocks[c][r] = result; });
//				if(typeof result === "undefined" || result === null)
//				{
//					console.log('WARNING: Retrieval of status c,r ' + c + "," + r + 'failed');
//				}	
//				else
//				{
//					statuses[c][r] = result;
//				}
//			}));
//		};
//		gB();
//	}
//}
//batch.execute();
//}

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
function combineTileAndElevationInfoIntoSingleMapObject()
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

	for(var col = 0; col < mapsize; col++)
	{
		for(var row = 0; row < mapsize; row++)
		{
			jo = {};
			jo.col = col; // these are reversed on purpose. I don't fully understand, but fuck it. I had a rough night.
			jo.row = row;
			jo.elevation = elevations[col][row] * 1;
			jo.owner = owners[col][row];
			jo.status = statuses[col][row];
			jo.name = names[col][row];
			jo.offerers = offerers[col][row];
			jo.offers = offers[col][row];
			jo.blocks = blocks[col][row];
			map_ja[col][row] = jo;
		}
	}	
	return map_ja;
}

app.get('/map', function (req, res) {
	console.log("entering /map");
	var map_ja = combineTileAndElevationInfoIntoSingleMapObject();
	res.json(map_ja);  // at this point, we're done answering the request. Now check to see if we need to retrieve the map again.
});

exports.findById = function(req, res) {
    console.log(req.params);
    var id = parseInt(req.params.id);
    console.log('findById: ' + id);
    db.collection('employees', function(err, collection) {
        collection.findOne({'id': id}, function(err, item) {
            console.log(item);
            res.jsonp(item);
        });
    });
};

app.get('/tile/:col/:row', function (req, res) {
	console.log("entering /tile");
	var col = parseInt(req.params.col);
	var row = parseInt(req.params.row);
	var colrow_jo = {};
	colrow_jo.col = col;
	colrow_jo.row = row;
	var map_ja = combineTileAndElevationInfoIntoSingleMapObject();
	res.json(map_ja[col][row]);  // at this point, we're done answering the request. Now check to see if we need to retrieve the map again.
});

app.get('/blocks', function (req, res) {
	console.log("entering /blocks");
	res.json(blocks);  // at this point, we're done answering the request. Now check to see if we need to retrieve the map again.
	console.log(blocks);
});

app.get('/', function (req, res) {
	  res.write('' + web3.fromWei(web3.eth.getBalance('0xcf684dfb8304729355b58315e8019b1aa2ad1bac')) + '\n');
	    res.end('Hello World\n');
});

var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;
  map_ja = [];
  console.log('Example app listening at http://%s:%s', host, port);
});