
import hbs from 'hbs'
import open from 'open'
import express from 'express'
import http from 'http'
import buttonStyleTag from './helpers/buttonStyleTag.js'
import SegfaultHandler from 'segfault-handler'
SegfaultHandler.registerHandler("crash.log")
const app = express()
const port = 3000

app.httpServer = http.createServer(app);
app.httpServer.listen(port, function() {
	// console.log('Listening on port %d', app.httpServer.address().port);
setTimeout(() => {
	open(`http://localhost:${app.httpServer.address().port}`, {
		app:['google chrome','--start-fullscreen']
	})
}, 1000)
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
});

app.use(function(err, req, res, next) {
	// console.error(err.stack);
	res.status(500).send('Something broke!');
	next()
})
process.on("exit",(code) => {
	for(var k in app.lights) {
		app.lights[k].destroy();
	}
})