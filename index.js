require("dot").process({
	global: "_page.render"
	, destination: __dirname + "/render/"
	, path: (__dirname + "/templates")
});
//const puppeteer = require('puppeteer');
var express = require('express')
, http = require('http')
, app = express()
, render = require('./render')
;

app.httpServer = http.createServer(app);
app.httpServer.listen(3000, function() {
	console.log('Listening on port %d', app.httpServer.address().port);
});

app.Gpio={accessible:false}
//app.Gpio = require('onoff').Gpio;
var {lights,sockets} = require("./classes")(app);
app.lights={};
lights.map(l => {
	app.lights[l.schema.name]=l;
})
app.sockets=sockets;
lights=lights.map(l => l.render());

app.use(express.static('public'))

app.get('/', function(req, res){
  res.send(render.dashboard({lights:app.lights}));
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

/*
const chromeLauncher = require('chrome-launcher');

chromeLauncher.launch({
  startingUrl: 'http://localhost:3000',
  chromeFlags:['--start-fullscreen','--kiosk']
}).then(chrome => {
  console.log(`Chrome debugging port running on ${chrome.port}`);
});
*/
/*var sr = require('screenres');
(async () => {
	const browser = await puppeteer.launch({
		headless: false,
		//executablePath: '/usr/bin/chromium-browser',
		args: ['--disable-infobars','--start-fullscreen']
	});
	var size = sr.get()
	const page = await browser.newPage();
	await page.goto('http://localhost:3000');
	page.setViewport({ width:size[0], height:size[1] });
	process.on('exit', (code) => {
		browser.close();
	  });
})();*/
