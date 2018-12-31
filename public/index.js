
    var light=function(button) {
        console.log(button);
        this.on=false;
        this.ontoggle=function() {}
        this.toggle=function() {
            console.log(this.button.text())
            this.ontoggle(this.button.text());
        }
        this.button=$(button).click($.proxy(this.toggle,this));
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
    var door=function(button) {
        console.log(button);
        this.open=function() {
            console.log(this.button.text())
            this.onopen(this.button.text());
        }
        this.button=$(button).click($.proxy(this.open,this));
    }
$(document).ready(function() {
    (function(obj) {
        console.log(obj);
        obj.client = new socketClient();
        obj.lights = {};
        obj.doors = {};
        $('button.lights').get().map(b => {
           var l = new light(b);
           l.ontoggle=function(k) {
               console.log(k);
            obj.client.toggle(k);
           }
            obj.lights[l.button.text()]=l;
        });
        $('button.doors').get().map(b => {
           var l = new door(b);
           l.onopen=function(k) {
               console.log(k);
            obj.client.door(k);
           }
            obj.doors[l.button.text()]=l;
        });
        $('button.alloff').click(function() {
            obj.client.off();
        })
        console.log(obj);
    })(window.homeController={})
})
var socketClient=function() {
    this.connected=function() {
        console.log("Connected");
        this.socket.emit("status");
        $('body').addClass("connected");
    }
    this.disconnected=function() {
        $('body').removeClass("connected");
        console.log("disconnected");
    }
    this.toggle=function(k) {
        console.log("toggle",k);
        var obj={};
        obj[k]=true;
        this.socket.emit('toggle',obj);
    }
    this.door=function(k) {
        console.log("open",k);
        var obj={};
        obj[k]=true;
        this.socket.emit('door',obj);
    }
    this.off=function() {
        console.log("off");
        var obj={};
        this.socket.emit('off',obj);
    }
    this.status=function(data) {
        console.log(data,window.homeController.lights);
        for(var k in data) {
            window.homeController.lights[k].status=data[k];
        }
    }
    this.url=`${window.location.host}`;
    this.socket=window.io(this.url);
    this.socket.on('connect', $.proxy(this.connected,this));
    this.socket.on('disconnect', $.proxy(this.disconnected,this));
    this.socket.on('status', $.proxy(this.status,this));
}