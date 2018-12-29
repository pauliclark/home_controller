module.exports = function(app) {
    var schema=[
        {
            name:'Kitchen',
            image:{
                on:'images/on.jpg',
                off:'images/off.jpg'
            },
            switch:21,
            status:6
        },
        {
            name:'Kitchen cabinets',
            image:{
                on:'images/on.jpg',
                off:'images/off.jpg'
            },
            switch:22,
            status:4
        },
        {
            name:'Lounge',
            image:{
                on:'images/on.jpg',
                off:'images/off.jpg'
            },
            switch:23,
            status:3
        },
        {
            name:'Lounge Wall',
            image:{
                on:'images/on.jpg',
                off:'images/off.jpg'
            },
            switch:24,
            status:2
        },
        {
            name:'Boudoir',
            image:{
                on:'images/on.jpg',
                off:'images/off.jpg'
            },
            switch:25,
            status:0
        },
        {
            name:'Bedroom',
            image:{
                on:'images/on.jpg',
                off:'images/off.jpg'
            },
            switch:27,
            status:5
        },
        {
            name:'Patio',
            image:{
                on:'images/on.jpg',
                off:'images/off.jpg'
            },
            switch:28,
            status:7 // ????
        },
        {
            name:'Hall',
            image:{
                on:'images/on.jpg',
                off:'images/off.jpg'
            },
            switch:26,
            status:1
        }
    ];
    var light=require('./lights')(app);
    return {
        sockets:require('./sockets')(app),
        lights:schema.map(l => new light(app,l))
    };
}