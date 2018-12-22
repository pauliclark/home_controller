require("dot").process({
	global: "_page.render"
	, destination: __dirname + "/render/"
	, path: (__dirname + "/templates")
});
const puppeteer = require('puppeteer');
var express = require('express')
, http = require('http')
, app = express()
, render = require('./render')
;
var lights = require("./classes")(app);
lights=lights.map(l => l.render());

app.use(express.static('public'))

app.get('/', function(req, res){
  res.send(render.dashboard({rooms:lights}));
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

var httpServer = http.createServer(app);
httpServer.listen(3000, function() {
	console.log('Listening on port %d', httpServer.address().port);
});
var sr = require('screenres');
(async () => {
	const browser = await puppeteer.launch({
		headless: false,
		args: ['--disable-infobars','--start-fullscreen']
	});
	var size = sr.get()
	const page = await browser.newPage();
	await page.goto('http://localhost:3000');
	page.setViewport({ width:size[0], height:size[1] });
	process.on('exit', (code) => {
		browser.close();
	  });
})();
