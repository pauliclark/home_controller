export default function (app) {
    return class door {
        constructor(app, schema) {
            this.schema = schema;
            this.bcm = schema.bcm;
            app.gpio.open(this.bcm[this.schema.switch.toString()], app.gpio.OUTPUT);
            app.gpio.write(this.bcm[this.schema.switch.toString()], 1)
            console.log(`GPIO ${this.schema.switch} out`)

        }
        destroy() {
            app.gpio.close(this.bcm[this.schema.switch.toString()])
        }
        open() {
            app.gpio.write(this.bcm[this.schema.switch.toString()], 0)
            setTimeout(() => {
                app.gpio.write(this.bcm[this.schema.switch.toString()], 1)
            },500)
        }
        render() {
            return `<button type='button' class='doors ${this.schema.name.toLowerCase().replace(/\W/g, '')}'><div>${this.schema.name}</div></button>`
        }
    }
}
