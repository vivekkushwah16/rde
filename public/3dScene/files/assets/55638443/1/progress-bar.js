var ProgressBar = pc.createScript('progressBar');


ProgressBar.attributes.add('loaderParent', {type: 'entity'});
ProgressBar.attributes.add('infoImage', {type: 'entity'});

// The entity that shows the fill image 
ProgressBar.attributes.add('progressImage', {type: 'entity'});
// The maximum width of the fill image
ProgressBar.attributes.add('progressImageMaxWidth', {type: 'number'});

ProgressBar.prototype.initialize = function() {
    var self = this;
    
    this.setProgress(0);
    this.increase = false;
    
    this.entity.on('startLoader', function(){
        self.setProgress(0);    
        self.increase = true;
        self.infoImage.element.opacity = 1;
        self.progressImage.element.opacity = 1;
        self.loaderParent.enabled = true;
        console.log(self.progressImage.name);
    });
};

ProgressBar.prototype.setProgress = function (value) {   
    value = pc.math.clamp(value, 0, 1);
    this.progress = value;
    var width = pc.math.lerp(0, this.progressImageMaxWidth, value);
    this.progressImage.element.width = width;    
    this.progressImage.element.rect.z = value;
    this.progressImage.element.rect = this.progressImage.element.rect;
};

// Increase or decrease the progress automatically
ProgressBar.prototype.update = function(dt) {
    
    if(this.increase)
    {
        this.setProgress(this.progress + dt);
            if (this.progress >= 1)
            {
                this.increase = false;
                this.entity.fire('loadingDone');
            }
            
    }
};


