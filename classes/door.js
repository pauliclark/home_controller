module.exports = function (app) {
    return class door {
        constructor(app, schema) {
            this.schema = schema;
            var _this = this;
            this.bcm = schema.bcm;
            app.gpio.open(this.bcm[this.schema.switch.toString()], app.gpio.OUTPUT);
            app.gpio.write(_this.bcm[_this.schema.switch.toString()], 0)
            console.log(`GPIO ${this.schema.switch} out`)

        }
        destroy() {
            app.gpio.close(this.bcm[this.schema.switch.toString()])
        }
        open() {
            var _this = this;
            app.gpio.write(this.bcm[this.schema.switch.toString()], 1)
            setTimeout(function() {
                app.gpio.write(_this.bcm[_this.schema.switch.toString()], 0)
            },500)
        }
        render() {
            return `<button type='button' class='doors ${this.schema.name.toLowerCase().replace(/\W/g, '')}'><div>${this.schema.name}</div></button>`
        }
    }
}
