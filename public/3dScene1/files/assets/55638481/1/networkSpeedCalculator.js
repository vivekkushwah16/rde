var NetworkSpeedCalculator = pc.createScript('networkSpeedCalculator');

var imageAddr = "https://storage.googleapis.com/virtual-event-273009.appspot.com/BroadExpo/Textures/31120037-5mb.jpg"; 
var downloadSize = 4995374; //bytes

NetworkSpeedCalculator.attributes.add("downloadText", {type: "entity"});
NetworkSpeedCalculator.attributes.add("delayms", {type: "number",default:90000});
NetworkSpeedCalculator.attributes.add("redC", {type: "rgba"});
NetworkSpeedCalculator.attributes.add("orangeC", {type: "rgba"});
NetworkSpeedCalculator.attributes.add("greenC", {type: "rgba"});

this.speedMb=0;
// initialize code called once per entity
NetworkSpeedCalculator.prototype.initialize = function() {
    
    //InitiateSpeedDetection();
    
    this.updateSpeed();
};

NetworkSpeedCalculator.prototype.updateSpeed = function() {
    var self=this;
    InitiateSpeedDetection();
    setTimeout(function(){
        self.updateSpeed();
    },this.delayms);
};

// update code called every frame
NetworkSpeedCalculator.prototype.update = function(dt) {
    var self=this;
    if(speedMb!==0){
        var speed=Math.floor(speedMb);
        //console.log(speed);
        if(speed<0.5){
             self.downloadText.element.text="Very Slow";
           self.downloadText.element.color=this.redC;
        }
        else if(speed<1){
             self.downloadText.element.text="Slow";
           self.downloadText.element.color=this.orangeC;
        }
        else if(speed<2&&speed>=1){
             self.downloadText.element.text="Typical";
            self.downloadText.element.color=this.orangeC;
        }
        else if(speed>=8){
             self.downloadText.element.text="Very Fast";
            self.downloadText.element.color=this.greenC;
        }
        else if(speed>=2){
             self.downloadText.element.text="Fast";
            self.downloadText.element.color=this.greenC;
        }
        
                                                                     
          // self.downloadText.element.text=speedMb + " Mbps";              //To display the exact speed
    }
};

function ShowProgressMessage(msg) {
    if (console) {
        if (typeof msg == "string") {
            console.log(msg);
        } else {
            for (var i = 0; i < msg.length; i++) {
                console.log(msg[i]);
            }
        }
    }
    
    var oProgress = document.getElementById("progress");
    if (oProgress) {
        var actualHTML = (typeof msg == "string") ? msg : msg.join("<br />");
        oProgress.innerHTML = actualHTML;
    }
};

function InitiateSpeedDetection() {
    ShowProgressMessage("Loading the image, please wait...");
    window.setTimeout(MeasureConnectionSpeed, 1);
};    

if (window.addEventListener) {
    window.addEventListener('load', InitiateSpeedDetection, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', InitiateSpeedDetection);
}

function MeasureConnectionSpeed() {
    var startTime, endTime;
    var download = new Image();
    download.onload = function () {
        endTime = (new Date()).getTime();
        showResults();
    };
    
    download.onerror = function (err, msg) {
        ShowProgressMessage("Invalid image, or error downloading");
    };
    
    startTime = (new Date()).getTime();
    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;
    
    function showResults() {
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);
        ShowProgressMessage([
            "Your connection speed is:", 
            speedBps + " bps", 
            speedKbps + " kbps", 
            speedMbps + " Mbps"
        ]);
        this.speedMb=speedMbps;
    };
};

