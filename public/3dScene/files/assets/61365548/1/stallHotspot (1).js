var StallHotspot = pc.createScript('stallHotspot');

StallHotspot.attributes.add('stallHandler', { type: 'entity', });
StallHotspot.attributes.add('filename', { type: 'string', default:"1"});
StallHotspot.attributes.add('fileext', { type: 'string', default:".jpg"});

StallHotspot.attributes.add('logThis', { type: 'string'});

StallHotspot.prototype.initialize = function() {
    var self=this;
     this.entity.on('hotspot:click', function (evt) {
         if( this.stallHandler.script.stallHtmlHandler)
            this.stallHandler.script.stallHtmlHandler.showStallContent(self.filename+self.fileext);
         if( this.stallHandler.script.pdfHandler)
            this.stallHandler.script.pdfHandler.render();
         //this.stallHandler.fire('renderPDF');
         if(self.logThis!=="")
            firebaseInstance.logevent(self.logThis);
    }, this);
};


StallHotspot.prototype.update = function(dt) {
    
};
