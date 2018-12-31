module.exports = function(app) {
    var schema=[
        {
            name:'Kitchen',
            image:{
                on:'images/kitchen.jpg',
                off:'images/kitchen.jpg'
            },
            switch:21,
            status:29
        },
        {
            name:'Kitchen cabinets',
            image:{
                on:'images/kitchen-cabinets.jpg',
                off:'images/kitchen-cabinets.jpg'
            },
            switch:22,
            status:4
        },
        {
            name:'Lounge',
            image:{
                on:'images/lounge.jpg',
                off:'images/lounge.jpg'
            },
            switch:23,
            status:3
        },
        {
            name:'Lounge Wall',
            image:{
                on:'images/lounge-wall.jpg',
                off:'images/lounge-wall.jpg'
            },
            switch:24,
            status:2
        },
        {
            name:'Boudoir',
            image:{
                on:'images/boudoir.jpg',
                off:'images/boudoir.jpg'
            },
            switch:25,
            status:0
        },
        {
            name:'Bedroom',
            image:{
                on:'images/bedroom.jpg',
                off:'images/bedroom.jpg'
            },
            switch:27,
            status:5
        },
        {
            name:'Patio',
            image:{
                on:'images/patio.jpg',
                off:'images/patio.jpg'
            },
            switch:28,
            status:6 // ????
        },
        {
            name:'Hall',
            image:{
                on:'images/hall.jpg',
                off:'images/hall.jpg'
            },
            switch:26,
            status:1
        }
    ];
    var doors =[{
        name:'Front door',
        image:{
            on:'images/on.jpg',
            off:'images/off.jpg'
        },
        switch:7
    }];
    
    var bcm={
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
    var light=require('./lights')(app);
    var door=require('./door')(app);
    return {
        sockets:require('./sockets')(app),
        doors:doors.map(d => new door(app,Object.assign(d,{bcm}))),
        lights:schema.map(l => new light(app,Object.assign(l,{bcm})))
    };
}