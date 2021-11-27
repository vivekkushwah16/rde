var SpecialZoneOtherHandler = pc.createScript('specialZoneOtherHandler');

SpecialZoneOtherHandler.attributes.add('mNik',{type:'entity'});
SpecialZoneOtherHandler.attributes.add('mSur',{type:'entity'});
SpecialZoneOtherHandler.attributes.add('mIri',{type:'entity'});
SpecialZoneOtherHandler.attributes.add('mDani',{type:'entity'});

SpecialZoneOtherHandler.attributes.add('mSan',{type:'entity'});
SpecialZoneOtherHandler.attributes.add('mStu',{type:'entity'});
SpecialZoneOtherHandler.attributes.add('mSud',{type:'entity'});
SpecialZoneOtherHandler.attributes.add('mAlb',{type:'entity'});


SpecialZoneOtherHandler.attributes.add('mAlex',{type:'entity'});
SpecialZoneOtherHandler.attributes.add('mAndrew',{type:'entity'});
SpecialZoneOtherHandler.attributes.add('mBarry',{type:'entity'});
SpecialZoneOtherHandler.attributes.add('mRichard',{type:'entity'});
SpecialZoneOtherHandler.attributes.add('mSarah',{type:'entity'});
SpecialZoneOtherHandler.attributes.add('mSimon',{type:'entity'});
SpecialZoneOtherHandler.attributes.add('mYana',{type:'entity'});

SpecialZoneOtherHandler.attributes.add('mAno',{type:'entity'});
SpecialZoneOtherHandler.attributes.add('name',{type:'entity'});

var specialZoneOtherInstance;
// initialize code called once per entity
SpecialZoneOtherHandler.prototype.initialize = function() {
    specialZoneOtherInstance=this;
    var self=this;
    this.otherUID="";
    this.otherName="";
    this.otherEmail="";
    this.otherModel=null;
    self.mDani.enabled=false;
    self.mIri.enabled=false;
    self.mSur.enabled=false;
    self.mNik.enabled=false;
    
    self.mAlex.enabled=false;
    self.mAndrew.enabled=false;
    self.mBarry.enabled=false;
    self.mRichard.enabled=false;
    self.mSarah.enabled=false;
    self.mSimon.enabled=false;
    self.mYana.enabled=false;
    
    self.mAno.enabled=false;
    
    this.app.on('enterChatRoom', (data)=>{
        console.log("entered room");
        console.log(data);
        if(!data){
            self.otherUID="";
            self.otherName="";
            self.otherEmail="";
            self.otherModel=null;

            self.mDani.enabled=false;
            self.mIri.enabled=false;
            self.mSur.enabled=false;
            self.mNik.enabled=false;
            self.mAno.enabled=false;
            
           self.mAlex.enabled=false;
            self.mAndrew.enabled=false;
            self.mBarry.enabled=false;
            self.mRichard.enabled=false;
            self.mSarah.enabled=false;
            self.mSimon.enabled=false;
            self.mYana.enabled=false;
            
            self.name.parent.enabled=false;
            return;
        }
        
       self.otherUID=data.uid;
       self.otherName=data.name;
       self.otherEmail=data.email;
       self.name.element.text=data.name;
       self.name.parent.enabled=true;
        
        
       if(data.email.includes("n1dj")){
           self.mNik.enabled=true;
           self.otherModel=self.mNik;
        }
        else if(data.email.includes("s2dj")){
            self.mSur.enabled=true;
            self.otherModel=self.mSur;
        }
        else if(data.email.includes("i3dj")){
            self.mIri.enabled=true;
            self.otherModel=self.mIri;
        }
        else if(data.email.includes("d4dj")){
            self.mDani.enabled=true;
            self.otherModel=self.mDani;
        }
         else if(data.email.includes("sa5dj")){
            self.mSan.enabled=true;
            self.otherModel=self.mSan;
        }
         else if(data.email.includes("st6dj")){
            self.mStu.enabled=true;
            self.otherModel=self.mStu;
        }
         else if(data.email.includes("su7dj")){
            self.mSud.enabled=true;
            self.otherModel=self.mSud;
        }
         else if(data.email.includes("al8dj")){
            self.mAlb.enabled=true;
            self.otherModel=self.mAlb;
        }
        else if(data.email.includes("al9dj")){
            self.mAlex.enabled=true;
            self.otherModel=self.mAlex;
        }
        else if(data.email.includes("an10dj")){
            self.mAndrew.enabled=true;
            self.otherModel=self.mAndrew;
        }
        else if(data.email.includes("ba11dj")){
            self.mBarry.enabled=true;
            self.otherModel=self.mBarry;
        }
         else if(data.email.includes("ri12dj")){
            self.mRichard.enabled=true;
            self.otherModel=self.mRichard;
        }
         else if(data.email.includes("sa13dj")){
            self.mSarah.enabled=true;
            self.otherModel=self.mSarah;
        }
         else if(data.email.includes("si14dj")){
            self.mSimon.enabled=true;
            self.otherModel=self.mSimon;
        }
         else if(data.email.includes("ya15dj")){
            self.mYana.enabled=true;
            self.otherModel=self.mYana;
        }
        
        else {
            console.log("anonymous?");
            self.mAno.enabled=true;
            self.otherModel=self.mAno;
        }
        
        setTimeout(function(){
              specialZoneOtherInstance.otherModel.animation.play("Idol.glb",0.5);
              specialZoneOtherInstance.otherModel.animation.loop=true;
        },1000);
    });
    
    this.app.on('exitChatRoom', ()=>{
        self.otherUID="";
        self.otherName="";
        self.otherEmail="";
        self.otherModel=null;
        
        self.mDani.enabled=false;
        self.mIri.enabled=false;
        self.mSur.enabled=false;
        self.mNik.enabled=false;
        self.mAno.enabled=false; 
        
           self.mAlex.enabled=false;
            self.mAndrew.enabled=false;
            self.mBarry.enabled=false;
            self.mRichard.enabled=false;
            self.mSarah.enabled=false;
            self.mSimon.enabled=false;
            self.mYana.enabled=false;
    });
};

// update code called every frame
SpecialZoneOtherHandler.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// SpecialZoneOtherHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/