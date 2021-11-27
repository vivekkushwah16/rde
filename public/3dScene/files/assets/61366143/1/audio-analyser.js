var AudioAnalyser = pc.createScript('audioAnalyser');

AudioAnalyser.attributes.add('fftsize', {
    type: 'number'
});

AudioAnalyser.prototype.assignSoundSlot = function (soundSlot) {
    if (soundSlot) {
        soundSlot.setExternalNodes(this.analyser);

        var minDb = this.analyser.minDecibels;
        var maxDb = this.analyser.maxDecibels;

        this.freqScale = 1 / (maxDb - minDb);
        this.freqOffset = minDb;
        
        this.soundSlot = soundSlot;
    }
};

// initialize code called once per entity
AudioAnalyser.prototype.initialize = function() {
    var context = this.app.systems.sound.context;
    
    // create analyser node and set up
    this.analyser = context.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.6;
    this.analyser.fftSize = this.fftsize;

    this.freqData = new Float32Array(this.fftsize/2);
    
    this.freqScale = 0; 
    this.freqOffset = 0;

    this.soundSlot = null;
};


// update code called every frame
AudioAnalyser.prototype.update = function(dt) {
    this.analyser.getFloatFrequencyData(this.freqData);
};


