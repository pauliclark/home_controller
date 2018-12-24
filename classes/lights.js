module.exports = function(app) {
    return class light {
        constructor(app,schema) {
            this.schema=schema;
            this.on=false;
            var _this=this;
            if (true/* || app.Gpio.accessible*/) {
                
                var gpiop = gpio.promise;
                 
                gpiop.setup(this.schema.switch, gpio.DIR_OUT,(err,obj) => {
                    _this.switch=obj;
                })
                gpiop.setup(this.schema.status, gpio.DIR_IN,(err,obj) => {
                    _this.status=obj;
                    _this.status.on("change",(c,v) => {
                        console.log(v);
                        _this.statusChanged(err,v)
                    })
                })
                //this.switch = new app.Gpio(this.schema.switch, 'out');
                console.log(`GPIO ${this.schema.switch} out`)
                //this.status = new app.Gpio(this.schema.status, 'in');
                console.log(`GPIO ${this.schema.status} in`)
                /*this.status.watch((err,status) => {
                    _this.statusChanged(err,status)
                })*/
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
            console.log("Toggle "+this.schema.switch+" to "+(this.on?'1':'0'))
            this.switch.writeSync(this.on?1:0);
            if (false/* && !app.Gpio.accessible*/) {
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