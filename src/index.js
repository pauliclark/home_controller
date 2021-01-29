import './main.scss'
import $ from 'jquery'
import io from 'socket.io-client'
const controller = {}
const Light=function(button) {
    // console.log(button);
    this.on=false;
    this.ontoggle=function() {}
    this.toggle=function() {
        // console.log(this.button.text())
        this.ontoggle(this.button.text());
    }
    this.button=$(button).on("click",() => this.toggle())
    Object.defineProperty(this, 'status', {
        get: function () {
            return this.on;
        },
        set: function (v) {
            this.on=v;
            if (this.on) {
                this.button.addClass("on");
            }else{
                this.button.removeClass("on");
            }
        }
    });
}
const Door=function(button) {
    this.open=function() {
        this.button.addClass("on");
        this.onopen(this.button.text());
        setTimeout(() => {
            this.button.removeClass("on");
        },3000)
    }
    this.button=$(button).on("click",() => this.open())
}
const SocketClient=function() {
    this.connected=function() {
        // console.log("Connected");
        this.socket.emit("status");
        $('body').addClass("connected");
    }
    this.disconnected=function() {
        $('body').removeClass("connected");
        // console.log("disconnected");
    }
    this.toggle=function(k) {
        // console.log("toggle",k);
        var obj={};
        obj[k]=true;
        this.socket.emit('toggle',obj);
    }
    this.door=function(k) {
        // console.log("open",k);
        var obj={};
        obj[k]=true;
        this.socket.emit('door',obj);
    }
    this.off=function() {
        // console.log("off");
        var obj={};
        this.socket.emit('off',obj);
    }
    this.status=function(data) {
        console.log(data,controller.lights);
        for(var k in data) {
            controller.lights[k].status=data[k];
        }
    }
    this.url=`${window.location.host}`
    this.socket=io(this.url);
    this.socket.on('connect', () => {this.connected()})
    this.socket.on('disconnect', () => {this.disconnected()})
    this.socket.on('status', (...args) => {this.status(...args)})
}
$(() => {
        // console.log(obj);
        controller.client = new SocketClient();
        controller.lights = {}
        controller.doors = {}
        $('button.lights').get().map(b => {
           var l = new Light(b);
           l.ontoggle=function(k) {
            //    console.log(k);
            controller.client.toggle(k);
           }
            controller.lights[l.button.text()]=l;
        })
        $('button.doors').get().map(b => {
           var l = new Door(b);
           l.onopen=function(k) {
            //    console.log(k);
            controller.client.door(k);
           }
            controller.doors[l.button.text()]=l;
        })
        $('button.alloff').on("click",() => {
            controller.client.off();
        })
})