var SpatialAudio = pc.createScript('spatialAudio');

SpatialAudioInstance = null;

// SpatialAudio.attributes.add("object1",{type:'entity'});
// SpatialAudio.attributes.add("object2",{type:'entity'});
SpatialAudio.attributes.add("player",{type:'entity'});

SpatialAudio.prototype.initialize = function() {

    SpatialAudioInstance = this;

    console.log("tesitng");


    this.otherParent = this.app.root.findByTag('ParentBoi')[0];

    this.others = [];

    this.closeOthers = {};

    this.threshold = 6;



    for(let i = 0 ; i < this.otherParent.children.length ; ++i){
        this.others.push(this.otherParent.children[i]);
        this.closeOthers[this.otherParent.children[i].name] = this.threshold + 1;
    }



    

    setInterval( () => {
        // console.log( this.getDistance(this.object1.getPosition(),this.object2.getPosition()) );
        for(let i = 0 ; i < this.others.length ; ++i){
            let dist =  this.getDistance(this.others[i].getPosition(),this.player.getPosition());
            this.closeOthers[this.others[i].name] = dist;
            if(dist < this.threshold){
                console.log(this.others[i].name);
            }
        }
        for(let i = 0 ; i< this.others.length ; ++i){
            this.closeOthers[this.others[i].name] < this.threshold;

        }
    } , 200 );


    setInterval( () => {
        this.otherParent = this.app.root.findByTag('ParentBoi')[0];

        this.others = [];

        this.closeOthers = {};

        this.threshold = 6;



        for(let i = 0 ; i < this.otherParent.children.length ; ++i){
            this.others.push(this.otherParent.children[i]);
            this.closeOthers[this.otherParent.children[i].name] = this.threshold + 1;
        }
    } , 2000 );

    // pc.Vec3.Distance(this.object1.getPosition(),this.object2.getPosition());


};


SpatialAudio.prototype.getDistance = function (pos1, pos2) {
    var temp = new pc.Vec3();
    temp.sub2(pos1, pos2);
    var d = temp.length();
    return d;
};

