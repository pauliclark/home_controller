import io from 'socket.io'
export default function(app) {
    class socketServer {
        constructor(app) {
            this.io = io(app.httpServer, {
              //path: '/test',
              serveClient: false,
              // below are engine.IO options
              pingInterval: 10000,
              pingTimeout: 5000,
              cookie: false
            });
            this.clients=[];
            this.io.on('connection', (client) => {
                this.clients.push(client);
                client.on('disconnect', () => {
                    this.clients.splice(this.clients.indexOf(client),1);
                })
                client.on('toggle', (data) => {
                    this.toggle(Object.keys(data));
                })
                client.on('door', (data) => {
                    this.door(Object.keys(data));
                })
                client.on('off', (data) => {
                    this.off();
                })
                client.on('status', () => {
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
