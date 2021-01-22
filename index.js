// import dot from 'dot'
// dot.process({
// 	global: "_page.render"
// 	, destination: __dirname + "/render/"
// 	, path: (__dirname + "/templates")
// })
import hbs from 'hbs'
import express from 'express'
import http from 'http'
import buttonStyleTag from './helpers/buttonStyleTag.js'
const app = express()
// import render from './render/index.js'

app.httpServer = http.createServer(app);
app.httpServer.listen(3000, function() {
	console.log('Listening on port %d', app.httpServer.address().port);
})

//app.Gpio={accessible:false}
import gpio from 'rpio'
app.gpio = gpio
app.gpio.init({
	gpiomem: true,          /* Use /dev/gpiomem */
	mapping: 'gpio',    /* Use the P1-P40 numbering scheme */
	mock: undefined,        /* Emulate specific hardware in mock mode */
})

    app.set('view engine', 'hbs')
    app.engine('hbs', hbs.__express)
		app.set('views', './views')
		
import classes from './classes/index.js'
let {lights,doors,sockets} = classes(app)
app.lights={};
lights.map(l => {
	app.lights[l.schema.name]=l;
})
app.doors={};
doors.map(l => {
	app.doors[l.schema.name]=l;
})
app.sockets=sockets;

app.use(express.static('public'))
const style = buttonStyleTag({doors:app.doors,lights:app.lights})
const doorsHTML = doors.map(d => d.render())
const lightsHTML = lights.map(d => d.render())
app.get('/', function(req, res){
	res.render('home', {doors:doorsHTML,lights:lightsHTML, style})
  // res.send(render.dashboard({doors:app.doors,lights:app.lights}));
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
// var sr = require('screenres');
// (async () => {
// 	try{
// 	const browser = await puppeteer.launch({
// 		headless: false,
// 		executablePath: '/usr/bin/chromium-browser',
// 		args: ['--disable-infobars','--start-fullscreen','--no-sandbox']
// 	});
// 	var size = sr.get()
// 	const page = await browser.newPage();
// 	await page.goto('http://localhost:3000');
// 	page.setViewport({ width:size[0], height:size[1] });
// 	process.on('exit', (code) => {
// 		browser.close();
// 		});
// 	}catch(e) {
// 		console.warn(e);
// 	}
// })();
process.on("exit",(code) => {
	for(var k in app.lights) {
		app.lights[k].destroy();
	}
})