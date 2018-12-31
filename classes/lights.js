module.exports = function (app) {
    return class light {
        constructor(app, schema) {
            this.schema = schema;
            this.on = false;
            this.lighton = false;
            var _this = this;
            this.bcm = schema.bcm;
            console.log(this.bcm);
            var channelIn = this.bcm[this.schema.status.toString()];
            console.log(channelIn,this.schema.status);
            app.gpio.open(this.bcm[this.schema.switch.toString()], app.gpio.OUTPUT)
            app.gpio.open(this.bcm[this.schema.status.toString()], app.gpio.INPUT)
            setTimeout(function () {
                _this.lighton = app.gpio.read(_this.bcm[_this.schema.status.toString()]);
                app.gpio.write(_this.bcm[_this.schema.switch.toString()], _this.on ? 1 : 0)
            }, 1000);
            var values = [];
            setInterval(function () {
                var v = app.gpio.read(_this.bcm[_this.schema.status.toString()]);
                if (_this.lighton != v) {
                    values.push(v);
                    while (values.length > 3) values.shift();
                    var sum = values.reduce(function (a, b) { return a + b; });
                    var avg = sum / values.length;
                    var v = (Math.round(avg) == 1);
                    if (_this.lighton != v) {
                        _this.lighton = v;
                        if (_this.bcm[_this.schema.status.toString()] == 20) console.log(_this.schema.status, v);
                        _this.statusChanged(null, _this.lighton)
                    }
                }
            }, 100)
            console.log(`GPIO ${this.schema.switch} out`)
            console.log(`GPIO ${this.schema.status} in`)

        }
        destroy() {
            app.gpio.close(this.bcm[this.schema.switch.toString()])
            app.gpio.close(this.bcm[this.schema.status.toString()])
        }
        statusChanged(err, status) {
            console.log("Light " + this.schema.name + " on BCM " + this.bcm[this.schema.status.toString()] + " to " + status);
            //console.log('broadcast',this.schema,status);
            var obj = {};
            obj[this.schema.name] = status;
            app.sockets.broadcast(obj)
        }
        off() {
            if (this.lighton) this.toggle();
        }
        toggle() {
            const _this = this;
            this.on = !this.on;
            console.log("Toggle " + this.schema.name + " on BCM " + this.bcm[this.schema.switch.toString()] + " to " + (this.on ? '1' : '0'))

            app.gpio.write(this.bcm[this.schema.switch.toString()], this.on ? 1 : 0)
        }
        render() {
            return `<button type='button' class='lights ${this.schema.name.toLowerCase().replace(/\W/g, '')}'><div>${this.schema.name}</div></button>`
        }
    }
}
