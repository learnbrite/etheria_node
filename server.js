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
var etheriaaddress = "0xbc42c84ef4a54c655c5e8bfc8bf119fef55d1543"
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
var map_ja = [];
var lastcheck = 0;

app.get('/lastcheck', function (req, res){
	res.end(lastcheck + "");
});

function getMap() {
	etheria.getOwners.call(function(result) {
		owners = result;
	});
	etheria
	var elevations = etheria.getElevations();
	var row_ja = [];
	var jo = {};
	var blocks = [];
	var blocks_ja = [];
	var block_jo = {};
	map_ja = [];
	for(var row = 0; row < elevations.length; row++)
	{
		row_ja = [];
		for(var col = 0; col < elevations.length; col++)
		{
			jo = {};
			jo.x = row;
			jo.y = col;
			jo.elevation = elevations[col][row] * 1;
			jo.owner = owners[col][row];
			blocks = etheria.getBlocksForTile(col,row);
			blocks_ja = [];
			for(var i = 0; i < blocks.length; i+=7)
			{
				block_jo = {};
				block_jo.which = blocks[i]*1;
				block_jo.x = blocks[i+1]*1;
				block_jo.y = blocks[i+2]*1;
				block_jo.z = blocks[i+3]*1;
				block_jo.r = blocks[i+4]*1;
				block_jo.g = blocks[i+5]*1;
				block_jo.b = blocks[i+6]*1;
				blocks_ja.push(block_jo);
			}	
			jo.blocks = blocks_ja;
			row_ja.push(jo);
		}
		map_ja.push(row_ja);
	}	
}

app.get('/map', function (req, res) {
	console.log("entering /map");
	res.json(map_ja);
	console.log(process.hrtime()[0]+" - " + lastcheck + " = " + (process.hrtime()[0] - lastcheck));
	if((process.hrtime()[0] - lastcheck) > 60) // if it's been more than 1 min, retrieve map from blockchain
	{	
		console.log("been a while. Regenning map");
		lastcheck = process.hrtime()[0];
		async.series([
		              function(callback){
		            	console.log('executing first in series. Getting map.');
		            	getMap();
		            	console.log('after getMap');
		                callback(null);
		                console.log('after callback null');
		              }],
		              // optional callback
		              function(err, results){
		                console.log('this is the err, results callback');
		              }
		            );
		console.log('after async.series');
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