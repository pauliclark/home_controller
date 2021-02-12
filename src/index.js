import './main.scss'
// import $ from 'jquery'
import io from 'socket.io-client'
import clock from './clock.js'
let idleTimeout = null
let idleDelay = 1000*60*3
// idleDelay = 30000
const showClock = () => {
    clock.show(() => {
        resetIdle()
    })
}
const resetIdle = () => {
    clearTimeout(idleTimeout)
    idleTimeout = setTimeout(showClock, idleDelay)
}
const controller = {}
const Light=function(button) {
    // console.log(button);
    this.on=false;
    this.ontoggle=function() {}
    this.toggle=function() {
        resetIdle()
        // console.log(this.button.text())
        this.ontoggle(this.button.innerText);
    }
    this.button=button
    button.addEventListener("click",() => this.toggle())
    Object.defineProperty(this, 'status', {
        get: function () {
            return this.on;
        },
        set: function (v) {
            this.on=v;
            // if (this.on) {
                this.button.classList.toggle("on", this.on)
            // }else{
            //     this.button.removeClass("on");
            // }
        }
    });
}
const Door=function(button) {
    this.open=function() {
        resetIdle()
                this.button.classList.add("on")
        // this.button.addClass("on");
        this.onopen(this.button.innerText)
        setTimeout(() => {
                this.button.classList.remove("on")
        },3000)
    }
    this.button=button
    this.button.addEventListener("click",() => this.open())
}
const SocketClient=function() {
    this.connected=function() {
        // console.log("Connected");
        this.socket.emit("status");
        document.body.classList.add("connected")
        resetIdle()
    }
    this.disconnected=function() {
        document.body.classList.remove("connected")
        // console.log("disconnected");
    }
    this.toggle=function(k) {
        // console.log("toggle",k);
        var obj={};
        obj[k]=true;
        this.socket.emit('toggle',obj)
    }
    this.door=function(k) {
        // console.log("open",k);
        var obj={};
        obj[k]=true;
        this.socket.emit('door',obj)
    }
    this.off=function() {
        // console.log("off");
        var obj={};
        this.socket.emit('off',obj)
    }
    this.status=function(data) {
        for(var k in data) {
            controller.lights[k].status=data[k];
        }
    }
    this.url=`${window.location.host}`
    this.socket=io(this.url);
    this.socket.on('connect', () => {this.connected()})
    this.socket.on('disconnect', () => {this.disconnected()})
    this.socket.on('status', (...args) => {
        this.status(...args)
    })
}
window.addEventListener('load',() => {
        // console.log(obj);
        controller.client = new SocketClient();
        controller.lights = {}
        controller.doors = {}
        document.querySelectorAll('button.lights').forEach(b => {
           var l = new Light(b);
           l.ontoggle=function(k) {
            //    console.log(k);
            controller.client.toggle(k);
           }
            controller.lights[l.button.innerText]=l;
        })
        document.querySelectorAll('button.doors').forEach(b => {
           var l = new Door(b);
           l.onopen=function(k) {
            //    console.log(k);
            controller.client.door(k);
           }
            controller.doors[l.button.innerText]=l;
        })
        document.querySelector('button.alloff').addEventListener("click",() => {
            controller.client.off();
        })
        resetIdle()
})