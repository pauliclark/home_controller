module.exports = function(app) {
    return class light {
        constructor(app,schema) {
            this.schema=schema;
        }
        render() {
            return `<button type='button'>${this.schema.name}</button>`
        }
    }
}