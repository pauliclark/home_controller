module.exports = function(app) {
    return class light {
        constructor(app,schema) {
            this.schema=schema;
            this.on=false;
            var _this=this;
            if (app.Gpio.accessible) {
                this.switch = new app.Gpio(this.schema.switch, 'out');
                this.status = new app.Gpio(this.schema.status, 'in', 'both');
                this.status.watch(
                    this.statusChanged
                )
            }else{
                console.log("GPIO not accessible")
                this.dummy=false;
                this.switch = {
                    writeSync: (value) => {
                        this.dummy=value;
                      console.log(`${this.schema.name}` + value);
                    }
                  };
                  this.status = {
                      readSync:() => {
                        return _this.dummy;
                      }
                  }
            }
        }
        statusChanged(err,status) {
            console.log('broadcast',this.schema,status);
            var obj={};
            obj[this.schema.name]=status;
            app.sockets.broadcast(obj)
        }
        toggle() {
            const _this=this;
            this.on=!this.on;
            console.log(this);
            console.log("Toggle "+this.schema.switch)
            this.switch.writeSync(this.on);
            if (!app.Gpio.accessible) {
                setTimeout(() => {
                    _this.statusChanged(null,_this.on)
                },3000)
            }
        }
        render() {
            return `<button type='button' class='lights ${this.schema.name.toLowerCase().replace(/\W/g,'')}'>${this.schema.name}</button>`
        }
    }
}