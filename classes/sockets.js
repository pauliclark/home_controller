module.exports = function(app) {
    class socketServer {
        constructor(app) {
            
            this.io = require('socket.io')(app.httpServer, {
              //path: '/test',
              serveClient: false,
              // below are engine.IO options
              pingInterval: 10000,
              pingTimeout: 5000,
              cookie: false
            });
            this.clients=[];
            var _this=this;
            this.io.on('connection', function (client) {
                _this.clients.push(client);
                client.on('disconnect', function () {
                    _this.clients.splice(_this.clients.indexOf(client),1);
                })
                client.on('toggle', function (data) {
                    _this.toggle(Object.keys(data));
                })
                client.on('door', function (data) {
                    _this.door(Object.keys(data));
                })
                client.on('off', function (data) {
                    _this.off();
                })
                client.on('status', function () {
                    console.log("Status requested")
                    var stats={};
                    for(var k in app.lights) {
                        stats[k]=app.lights[k].lighton;
                    }
                    console.log(stats);
                    client.emit("status",stats)
                })
            });

        }
        broadcast(data) {
            console.log(data);
            this.clients.map(c => {
                c.emit("status",data)
            })
        }
        off() {
            for(var name in app.lights) app.lights[name].off();
        }
        door(names) {
            names.map(name => {
                console.log(name);
                if (app.doors[name]) app.doors[name].open();
            })
        }
        toggle(names) {
            names.map(name => {
                console.log(name);
                if (app.lights[name]) app.lights[name].toggle();
            })
            
        }
    }
    return new socketServer(app);
}
