export default function (app) {
    return class light {
        constructor(app, schema) {
            this.schema = schema
            this.on = false
            this.lighton = false
            this.bcm = schema.bcm
            const channelIn = this.bcm[this.schema.status.toString()]
            this.channelIn = channelIn
            const channelOut = this.bcm[this.schema.switch.toString()]
            this.channelOut = channelOut
            app.gpio.open(channelOut, app.gpio.OUTPUT)
            app.gpio.open(channelIn, app.gpio.INPUT)
            setTimeout(() => {
                this.lighton = app.gpio.read(channelIn)
                app.gpio.write(channelOut, this.on ? 1 : 0)
            }, 1000);
            const values = [];
            setInterval(() => {
                let v = app.gpio.read(channelIn);
                if (this.lighton != v) {
                    values.push(v);
                    while (values.length > 3) values.shift();
                    const sum = values.reduce(function (a, b) { return a + b; });
                    const avg = sum / values.length;
                    v = (Math.round(avg) == 1);
                    if (this.lighton != v) {
                        this.lighton = v;
                        if (channelIn == 20) console.log(this.schema.status, v);
                        this.statusChanged(null, this.lighton)
                    }
                }
            }, 100)
            console.log(`GPIO ${this.schema.switch} out`)
            console.log(`GPIO ${this.schema.status} in`)

        }
        destroy() {
            app.gpio.close(this.channelIn)
            app.gpio.close(this.channelOut)
        }
        statusChanged(err, status) {
            console.log("Light " + this.schema.name + " on BCM " + this.channelIn + " to " + status);
            //console.log('broadcast',this.schema,status);
            const obj = {}
            obj[this.schema.name] = status;
            app.sockets.broadcast(obj)
        }
        off() {
            if (this.lighton) this.toggle();
        }
        toggle() {
            this.on = !this.on;
            console.log("Toggle " + this.schema.name + " on BCM " + this.channelOut + " to " + (this.on ? '1' : '0'))

            app.gpio.write(this.channelOut, this.on ? 1 : 0)
        }
        render() {
            return `<button type='button' class='lights ${this.schema.name.toLowerCase().replace(/\W/g, '')}'><div>${this.schema.name}</div></button>`
        }
    }
}
