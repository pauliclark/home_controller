module.exports = function(app) {
    var schema=[
        {
            name:'Hall',
            image:{
                on:'hallOn.jpg',
                off:'hallOff.jpg'
            },
            status:1,
            switch:2
        },
        {
            name:'Kitchen',
            image:{
                on:'kitchenOn.jpg',
                off:'kitchenOff.jpg'
            },
            status:3,
            switch:4
        }
    ];
    var light=require('./lights')(app);
    return schema.map(l => new light(app,l));
}