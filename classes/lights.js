module.exports = function(app) {
    return class light {
        constructor(app,schema) {
            this.schema=schema;
            this.on=false;
            this.lighton=false;
            var _this=this;
            this.bcm={
                '0':17,
                '1':18,
                '2':27,
                '3':22,
                '4':23,
                '5':24,
                '6':25,
                '7':4,
                '21':5,
                '22':6,
                '23':13,
                '24':19,
                '25':26,
                '26':12,
                '27':16,
                '28':20,
                '29':21
            }
            app.gpio.setMode(app.gpio.MODE_BCM)
            this.gpiop = app.gpio.promise;
            if (true/* || app.Gpio.accessible*/) {
                
                 var channelIn=this.bcm[this.schema.status.toString()];
                console.log(this.schema.switch,app.gpio.DIR_OUT)
                this.gpiop.setup(this.bcm[this.schema.switch.toString()], app.gpio.DIR_OUT)
                .then(() => {
                    console.log("Success",this.schema.switch,app.gpio.DIR_OUT)
                    return true;//gpiop.write(7, true)
                })
                .catch((err) => {
                    console.log('Error: ',this.schema.switch.toString(), err.toString())
                })
                this.gpiop.setup(this.bcm[this.schema.status.toString()], app.gpio.DIR_IN,app.gpio.EDGE_BOTH)
                .then(() => {
                    _this.gpiop.read(this.bcm[this.schema.status.toString()],(err,v) => {
                        if (!!err) {
                            console.warn(e)
                        }else{
                            _this.lighton=v;
                            console.log(_this.schema.status,v);
                            _this.statusChanged(null,_this.lighton)
                        }
                    })
                })
                .catch((err) => {
                    console.log('Error: ',this.schema.status, err.toString())
                })
                
                app.gpio.on("change",(c,v) => {
                    if (c==channelIn) {
                        if (v!=_this.lighton) {
                            _this.lighton=v;
                            if (c==5) console.log(new Date(),c,v);
                            //_this.statusChanged(null,v)
                        }
                    }
                })

                    /*_this.status.on("change",(c,v) => {
                        console.log(v);
                        _this.statusChanged(err,v)
                    })*/
                    
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
            
            this.gpiop.write(this.bcm[this.schema.switch.toString()],this.on,(err) => {
                if (!!err) console.warn(err);
            })
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