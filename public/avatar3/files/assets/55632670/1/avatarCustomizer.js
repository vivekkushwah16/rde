var AvatarCustomizer = pc.createScript('avatarCustomizer');

AvatarCustomizer.attributes.add("glassesButtonOn_F", { type: 'entity' });
AvatarCustomizer.attributes.add("glassesButtonOff_F", { type: 'entity' });
AvatarCustomizer.attributes.add("glassesButtonOn_M", { type: 'entity' });
AvatarCustomizer.attributes.add("glassesButtonOff_M", { type: 'entity' });
AvatarCustomizer.attributes.add("beardButtonOn_M", { type: 'entity' });
AvatarCustomizer.attributes.add("beardButtonOff_M", { type: 'entity' });
AvatarCustomizer.attributes.add("male", { type: 'entity' });
AvatarCustomizer.attributes.add("female", { type: 'entity' });
AvatarCustomizer.attributes.add("maleUI", { type: 'entity' });
AvatarCustomizer.attributes.add("femaleUI", { type: 'entity' });
AvatarCustomizer.attributes.add("femaleGlasses", { type: 'entity' });
AvatarCustomizer.attributes.add("maleGlasses", { type: 'entity' });
AvatarCustomizer.attributes.add("maleBeard", { type: 'entity' });
AvatarCustomizer.attributes.add("blocker", { type: 'entity' });
AvatarCustomizer.attributes.add("mhairButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("mhair", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("mtopButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("mtop", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("skinColour", { type: 'rgba', array: true });
AvatarCustomizer.attributes.add("lipColour", { type: 'rgba', array: true });
AvatarCustomizer.attributes.add("hairColour", { type: 'rgba', array: true });

AvatarCustomizer.attributes.add("topAColour", { type: 'rgba', array: true });
AvatarCustomizer.attributes.add("topBColour", { type: 'rgba', array: true });
AvatarCustomizer.attributes.add("topCColour", { type: 'rgba', array: true });
AvatarCustomizer.attributes.add("topCBColour", { type: 'rgba', array: true });

AvatarCustomizer.attributes.add("mTopUColour", { type: 'rgba', array: true });
AvatarCustomizer.attributes.add("fTopUColour", { type: 'rgba', array: true });

AvatarCustomizer.attributes.add("frameButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("frameColorButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("frameColour", { type: 'rgba', array: true });
AvatarCustomizer.attributes.add("frameTextures", { type: 'asset', array: true });

AvatarCustomizer.attributes.add("mTopColourButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("mTop1ColourButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("mTop2ColourButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("mTop3ColourButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("mTop4ColourButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("fTopColourButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("fTop1ColourButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("fTop2ColourButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("fTop3ColourButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("fTop4ColourButtons", { type: 'entity', array: true });

AvatarCustomizer.attributes.add("mskinColourButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("fskinColourButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("mhairColourButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("fhairColourButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("flagButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("bottomColour", { type: 'rgba', array: true });
AvatarCustomizer.attributes.add("mbottomColourButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("fbottomColourButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("fhairButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("fhair", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("ftopButtons", { type: 'entity', array: true });
AvatarCustomizer.attributes.add("ftop", { type: 'entity', array: true });
let avatarInstance = null;
let socketInstance = null;
// initialize code called once per entity
AvatarCustomizer.prototype.initialize = function () {
    avatarInstance = this;
    var self = this;
    this.genderData = 0;
    this.mhairData = 0;
    this.mtopData = 0;
    this.mskinColorData = 0;
    this.mhairColorData = 0;
    this.mbottomColorData = 0;
    this.mtop1ColorData = 0;
    this.mtop2ColorData = 0;
    this.mtop3ColorData = 0;
    this.mtop4ColorData = 0;
    this.fhairData = 0;
    this.ftopData = 0;
    this.flagData = -1;
    this.fskinColorData = 0;
    this.fhairColorData = 0;
    this.fbottomColorData = 0;
    this.ftop1ColorData = 0;
    this.ftop2ColorData = 0;
    this.ftop3ColorData = 0;
    this.ftop4ColorData = 0;
    this.glassesM = 0;
    this.glassesF = 0;
    this.beard = 0;
    this.frame = 0;
    this.frameColorData = 0;
    this.mskinColorData = 0;
    this.mskinColorData = 0;

    this.app.on("fail", function () {
        self.blocker.enabled = false;
    });
    this.app.on("looksGood", function (data) {
        self.blocker.enabled = true;
        console.log(self.genderData, self.mhairData, self.mtopData, self.mskinColorData, self.fhairData, self.ftopData, self.fskinColorData, self.glassesM, self.glassesF, self.beard);
        // self.app.fire("register",{frame:self.frame,frameColorData:self.frameColorData,flagData:self.flagData,ft1cd:self.ftop1ColorData,ft2cd:self.ftop2ColorData,ft3cd:self.ftop3ColorData,ft4cd:self.ftop4ColorData,mt1cd:self.mtop1ColorData,mt2cd:self.mtop2ColorData,mt3cd:self.mtop3ColorData,mt4cd:self.mtop4ColorData,mbcd:self.mbottomColorData,fbcd:self.fbottomColorData,gd:self.genderData,mhd:self.mhairData,mtd:self.mtopData,mskd:self.mskinColorData,fhd:self.fhairData,ftd:self.ftopData,fskd:self.fskinColorData,gm:self.glassesM,gf:self.glassesF,mb:self.beard,mhcd:self.mhairColorData,fhcd:self.fhairColorData});

        if (window.parent.socketRef) {
            window.parent.socketRef.emit('avatar:updateUserAvatar', {
                avatarDetails: {
                    frame: self.frame, frameColorData: self.frameColorData, flagData: self.flagData, ftop1ColorData: self.ftop1ColorData, ftop2ColorData: self.ftop2ColorData, ftop3ColorData: self.ftop3ColorData, ftop4ColorData: self.ftop4ColorData, mtop1ColorData: self.mtop1ColorData, mtop2ColorData: self.mtop2ColorData, mtop3ColorData: self.mtop3ColorData, mtop4ColorData: self.mtop4ColorData, mbottomColorData: self.mbottomColorData, fbottomColorData: self.fbottomColorData, genderData: self.genderData, mhairData: self.mhairData, mtopData: self.mtopData, mskinColorData: self.mskinColorData, fhairData: self.fhairData, ftopData: self.ftopData, fskinColorData: self.fskinColorData, glassesM: self.glassesM, glassesF: self.glassesF, beard: self.beard, mhairColorData: self.mhairColorData, fhairColorData: self.fhairColorData
                }
            });
        }

    });

    this.app.on("reset", function (data) {
        self.assignElements({
            genderData: self.genderData,
            mhairData: 0,
            mtopData: 0,
            mskinColorData: 0,
            mhairColorData: 0,
            mbottomColorData: 0,
            mtop1ColorData: 0,
            mtop2ColorData: 0,
            mtop3ColorData: 0,
            mtop4ColorData: 0,
            frame: 0,
            frameColorData: 0,
            flagData: -1,
            fhairData: 0,
            ftopData: 0,
            fskinColorData: 0,
            fhairColorData: 0,
            ftop1ColorData: 0,
            ftop2ColorData: 0,
            ftop3ColorData: 0,
            ftop4ColorData: 0,
            fbottomColorData: 0,
            glassesM: 0,
            glassesF: 0,
            beard: 0,
        });
    });

    this.app.on("frame", function (data) {
        self.assignFrame(data);
    });

    this.app.on("frameColor", function (data) {
        self.assignFrameColor(data);
    });

    this.app.on("gender", function (data) {
        self.assignGender(data);
    });

    this.app.on("glasses", function (data) {
        self.assignGlasses(data, data);
    });

    this.app.on("beard", function (data) {
        self.assignBeard(data);
    });

    this.app.on("hair", function (data) {
        self.assignHair(data, data);
    });
    this.app.on("mHairColor", function (data) {
        self.assignHairColor(0, data);
    });
    this.app.on("fHairColor", function (data) {
        self.assignHairColor(1, data);
    });

    this.app.on("top", function (data) {
        self.assignTop(data, data);
    });

    this.app.on("flag", function (data) {
        self.flagData = data;
        for (var i = 0; i < self.flagButtons.length; i++)
            self.flagButtons[i].children[0].enabled = i == data ? true : false;

    });

    this.app.on("mSkinColor", function (data) {
        self.assignSkinColor(0, data);
    });

    this.app.on("fSkinColor", function (data) {
        self.assignSkinColor(1, data);
    });

    this.app.on("mBottomColor", function (data) {
        self.assignBottomColor(0, data);
    });

    this.app.on("fBottomColor", function (data) {
        self.assignBottomColor(1, data);
    });

    this.app.on("m1TopColor", function (data) {
        self.mtop1ColorData = data;
        self.assignTopColor(0, 0);
    });
    this.app.on("m2TopColor", function (data) {
        self.mtop2ColorData = data;
        self.assignTopColor(0, 1);
    });
    this.app.on("m3TopColor", function (data) {
        self.mtop3ColorData = data;
        self.assignTopColor(0, 2);
    });
    this.app.on("m4TopColor", function (data) {
        self.mtop4ColorData = data;
        self.assignTopColor(0, 3);
    });

    this.app.on("f1TopColor", function (data) {
        // console.log("print"+data);
        self.ftop1ColorData = data;
        self.assignTopColor(1, 0);
    });
    this.app.on("f2TopColor", function (data) {
        self.ftop2ColorData = data;
        self.assignTopColor(1, 1);
    });
    this.app.on("f3TopColor", function (data) {
        self.ftop3ColorData = data;
        self.assignTopColor(1, 2);
    });
    this.app.on("f4TopColor", function (data) {
        self.ftop4ColorData = data;
        self.assignTopColor(1, 3);
    });
    

    this.app.on("preregisteredAvatar", function (data) {
        console.log(data);
        self.assignElements(data);
    });

    this.newWorld = this.app.scene.layers.getLayerByName('World');
    this.blocker.enabled = true;
    // setTimeout(()=>{
    //     self.blocker.enabled=false;
    // },1000);
    // 

    this.assignGender(this.genderData);
    this.assignHair(this.mhairData, this.fhairData);
    this.assignTop(this.mtopData, this.ftopData);
    this.assignGlasses(this.glassesM, this.glassesF);
    this.assignBeard(this.beard);
    this.assignSkinColor(0, this.mskinColorData);
    this.assignSkinColor(1, this.fskinColorData);
    this.assignBottomColor(0, this.mbottomColorData);
    this.assignHairColor(0, this.mhairColorData);
    this.assignHairColor(1, this.fhairColorData);
    this.assignBottomColor(1, this.fbottomColorData);

    this.playAnimAll();


};

window.avatarLoadingDone=function(){
    console.log("loaded");
    window.parent.SocketManager.subscribe_GetSocket((socket) => {
        socketInstance = socket;
        console.log("socket found");
        
    });
};
AvatarCustomizer.prototype.assignElements = function (data) {
    console.log(data);
    this.blocker.enabled = false;
    if (!data) {
        this.assignGender(this.genderData);
        this.assignHair(this.mhairData, this.fhairData);
        this.assignTop(this.mtopData, this.ftopData);
        this.assignGlasses(this.glassesM, this.glassesF);
        this.assignBeard(this.beard);
        this.assignSkinColor(0, this.mskinColorData);
        this.assignSkinColor(1, this.fskinColorData);
        this.assignBottomColor(0, this.mbottomColorData);
        this.assignHairColor(0, this.mhairColorData);
        this.assignHairColor(1, this.fhairColorData);
        this.assignBottomColor(1, this.fbottomColorData);
        return;
    }

    if (data.genderData !== undefined)
        this.assignGender(data.genderData);
    else
        this.assignGender(this.genderData);

    if (data.mtop1ColorData !== undefined)
        this.mtop1ColorData = data.mtop1ColorData;
    if (data.mtop2ColorData !== undefined)
        this.mtop2ColorData = data.mtop2ColorData;
    if (data.mtop3ColorData !== undefined)
        this.mtop3ColorData = data.mtop3ColorData;
    if (data.mtop4ColorData !== undefined)
        this.mtop4ColorData = data.mtop4ColorData;
    if (data.flagData !== undefined) {
        this.flagData = data.flagData;

        for (var i = 0; i < this.flagButtons.length; i++)
            this.flagButtons[i].children[0].enabled = i == data.flagData ? true : false;
    }

    if (data.ftop1ColorData !== undefined)
        this.ftop1ColorData = data.ftop1ColorData;
    if (data.ftop2ColorData !== undefined)
        this.ftop2ColorData = data.ftop2ColorData;
    if (data.ftop3ColorData !== undefined)
        this.ftop3ColorData = data.ftop3ColorData;
    if (data.ftop4ColorData !== undefined)
        this.ftop4ColorData = data.ftop4ColorData;
    if (data.frameColorData !== undefined)
        this.assignFrameColor(data.frameColorData);

    if (data.frame !== undefined)
        this.assignFrame(data.frame);

    if (data.mhairData !== undefined && data.fhairData !== undefined)
        this.assignHair(data.mhairData, data.fhairData);
    else
        this.assignHair(this.mhairData, this.fhairData);
    if (data.mtopData !== undefined && data.ftopData !== undefined)
        this.assignTop(data.mtopData, data.ftopData);
    else
        this.assignTop(this.mtopData, this.ftopData);
    if (data.glassesM !== undefined && data.glassesF !== undefined)
        this.assignGlasses(data.glassesM, data.glassesF);
    else
        this.assignGlasses(this.glassesM, this.glassesF);
    if (data.beard !== undefined)
        this.assignBeard(data.beard);
    else
        this.assignBeard(this.beard);
    if (data.mskinColorData !== undefined)
        this.assignSkinColor(0, data.mskinColorData);
    else
        this.assignSkinColor(0, this.mskinColorData);
    if (data.fskinColorData !== undefined)
        this.assignSkinColor(1, data.fskinColorData);
    else
        this.assignSkinColor(1, this.fskinColorData);
    if (data.mhairColorData !== undefined)
        this.assignHairColor(0, data.mhairColorData);
    else
        this.assignHairColor(0, this.mhairColorData);
    if (data.fhairColorData !== undefined)
        this.assignHairColor(1, data.fhairColorData);
    else
        this.assignHairColor(1, this.fhairColorData);
    if (data.mbottomColorData !== undefined)
        this.assignBottomColor(0, data.mbottomColorData);
    else
        this.assignBottomColor(0, this.mbottomColorData);
    if (data.fbottomColorData !== undefined)
        this.assignBottomColor(1, data.fbottomColorData);
    else
        this.assignBottomColor(1, this.fbottomColorData);
};

AvatarCustomizer.prototype.playAnimAll = function (data) {
    this.male.animation.play("Idle", 0);
    this.female.animation.play("Idle", 0);
    this.maleBeard.animation.play("Idle", 0);
    this.femaleGlasses.animation.play("Idle", 0);
    this.maleGlasses.animation.play("Idle", 0);
    for (var i = 0; i < this.mhair.length; i++)
        this.mhair[i].animation.play("Idle", 0);
    for (i = 0; i < this.mtop.length; i++)
        this.mtop[i].animation.play("Idle", 0);
    for (i = 0; i < this.fhair.length; i++)
        this.fhair[i].animation.play("Idle", 0);
    for (i = 0; i < this.ftop.length; i++)
        this.ftop[i].animation.play("Idle", 0);
};

AvatarCustomizer.prototype.assignFrame = function (data) {
    this.frame = data;

    console.log(this.frame);
    this.maleGlasses.enabled = this.frame >= 1 ? true : false;
    this.femaleGlasses.enabled = this.frame >= 1 ? true : false;
    // this.maleGlasses.enabled=true;
    // this.femaleGlasses.enabled=true;

    for (var i = 0; i < this.frameButtons.length; i++)
        this.frameButtons[i].children[0].enabled = i == data ? true : false;

    if (data >= 1) {
        this.maleGlasses.model.meshInstances[0].material.opacityMap = this.frameTextures[data - 1].resource;
        this.maleGlasses.model.meshInstances[0].material.diffuse = this.frameColour[this.frameColorData];
        this.maleGlasses.model.meshInstances[0].material.update();

        this.femaleGlasses.model.meshInstances[0].material.opacityMap = this.frameTextures[data - 1].resource;
        this.femaleGlasses.model.meshInstances[0].material.diffuse = this.frameColour[this.frameColorData];
        this.femaleGlasses.model.meshInstances[0].material.update();
    }


    this.playAnimAll();
};

AvatarCustomizer.prototype.assignFrameColor = function (data) {
    this.frameColorData = data;

    for (var i = 0; i < this.frameColorButtons.length; i++)
        this.frameColorButtons[i].children[0].enabled = i == data ? true : false;

    if (this.frame >= 1) {
        this.maleGlasses.model.meshInstances[0].material.diffuse = this.frameColour[this.frameColorData];
        this.maleGlasses.model.meshInstances[0].material.update();

        this.femaleGlasses.model.meshInstances[0].material.diffuse = this.frameColour[this.frameColorData];
        this.femaleGlasses.model.meshInstances[0].material.update();
    }
};

AvatarCustomizer.prototype.assignGender = function (data) {
    this.genderData = data;
    // var layersFemale = this.female.model.layers.splice(0);
    // var layersMale = this.female.model.layers.splice(0);

    this.male.enabled = data === 0 ? true : false;
    this.maleUI.enabled = data === 0 ? true : false;
    this.female.enabled = data === 0 ? false : true;
    //     if(data===1){
    //         layersMale.splice(this.newWorld.id, 1);
    //         this.male.model.layers = layersMale;

    //         layersFemale.push(this.newWorld.id);
    //         this.female.model.layers = layersFemale;
    //     }else{
    //         layersFemale.splice(this.newWorld.id, 1);
    //         this.female.model.layers = layersFemale;

    //         layersMale.push(this.newWorld.id);
    //         this.male.model.layers = layersMale;
    //     }
    this.femaleUI.enabled = data === 0 ? false : true;
    this.playAnimAll();
};

AvatarCustomizer.prototype.assignGlasses = function (dataM, dataF) {
    // if(this.genderData===0){
    //     this.glassesM=dataM;
    //     this.glassesButtonOn_M.enabled=this.glassesM==1?true:false;
    //     this.glassesButtonOff_M.enabled=this.glassesM===0?true:false;
    //     this.maleGlasses.enabled=this.glassesM==1?true:false;
    // }else{
    //     this.glassesF=dataF;
    //     this.glassesButtonOn_F.enabled=this.glassesF==1?true:false;
    //     this.glassesButtonOff_F.enabled=this.glassesF===0?true:false;
    //     this.femaleGlasses.enabled=this.glassesF==1?true:false;
    // }
    // this.playAnimAll();
};

AvatarCustomizer.prototype.assignBeard = function (data) {
    this.beard = data;
    if (this.genderData === 0) {
        this.beardButtonOn_M.enabled = this.beard == 1 ? true : false;
        this.beardButtonOff_M.enabled = this.beard === 0 ? true : false;
        this.maleBeard.enabled = this.beard == 1 ? true : false;
    }
    this.playAnimAll();
};

AvatarCustomizer.prototype.assignHair = function (mhairData, fhairData) {
    if (this.genderData === 0) {
        this.mhairData = mhairData;
        for (var i = 0; i < this.mhair.length; i++) {

            this.mhair[i].enabled = i == mhairData && i != 3 ? true : false;
            this.mhairButtons[i].children[0].enabled = i == mhairData ? true : false;
        }
        this.mhair[this.mhairData].model.meshInstances[0].material.diffuse = this.hairColour[this.mhairColorData];
        this.mhair[this.mhairData].model.meshInstances[0].material.update();

        this.male.model.meshInstances[8].material.diffuse = this.hairColour[this.mhairColorData];
        this.male.model.meshInstances[8].material.update();

        this.maleBeard.model.meshInstances[0].material.diffuse = this.hairColour[this.mhairColorData];
        this.maleBeard.model.meshInstances[0].material.update();
        //  this.mhair[this.mhairData].model.meshInstances[0].setParameter('material_diffuse',[this.hairColour[this.mhairColorData].r,this.hairColour[this.mhairColorData].g,this.hairColour[this.mhairColorData].b]);
        //  this.male.model.meshInstances[8].setParameter('material_diffuse',[this.hairColour[this.mhairColorData].r,this.hairColour[this.mhairColorData].g,this.hairColour[this.mhairColorData].b]);
        // this.maleBeard.model.meshInstances[0].setParameter('material_diffuse',[this.hairColour[this.mhairColorData].r,this.hairColour[this.mhairColorData].g,this.hairColour[this.mhairColorData].b]);

    } else {
        this.fhairData = fhairData;
        for (var ii = 0; ii < this.fhair.length; ii++) {
            this.fhair[ii].enabled = ii === fhairData ? true : false;
            this.fhairButtons[ii].children[0].enabled = ii == fhairData ? true : false;
        }

        this.fhair[this.fhairData].model.meshInstances[0].material.diffuse = this.hairColour[this.fhairColorData];
        this.fhair[this.fhairData].model.meshInstances[0].material.update();

        this.female.model.meshInstances[4].material.diffuse = this.hairColour[this.fhairColorData];
        this.female.model.meshInstances[4].material.update();
        // this.female.model.meshInstances[4].setParameter('material_diffuse',[this.hairColour[this.fhairColorData].r,this.hairColour[this.fhairColorData].g,this.hairColour[this.fhairColorData].b]);
        // this.fhair[this.fhairData].model.meshInstances[0].setParameter('material_diffuse',[this.hairColour[this.fhairColorData].r,this.hairColour[this.fhairColorData].g,this.hairColour[this.fhairColorData].b]);

    }
    this.playAnimAll();
};

AvatarCustomizer.prototype.assignTop = function (mtopData, ftopData) {
    if (this.genderData === 0) {
        this.mtopData = mtopData;
        for (var i = 0; i < this.mtopButtons.length; i++) {
            if (i < 3)
                this.mtop[i].enabled = i === mtopData ? true : false;
            this.mtopButtons[i].children[0].enabled = i == mtopData ? true : false;
            this.mTopColourButtons[i].enabled = i == mtopData ? true : false;

            this.assignTopColor(0, this.mtopData);
        }
    } else {
        this.ftopData = ftopData;
        for (var ii = 0; ii < this.ftopButtons.length; ii++) {
            if (ii < 3)
                this.ftop[ii].enabled = ii === ftopData ? true : false;
            this.ftopButtons[ii].children[0].enabled = ii == ftopData ? true : false;
            this.fTopColourButtons[ii].enabled = ii == ftopData ? true : false;

            this.assignTopColor(1, this.ftopData);
        }
    }
    this.playAnimAll();
};

AvatarCustomizer.prototype.assignSkinColor = function (i, data) {
    vEmissionIntensity = 1;
    console.log(data);
    if (data == 0)
        vEmissionIntensity = 0.05;
    else if (data == 1)
        vEmissionIntensity = 0.15;
    else if (data == 2)
        vEmissionIntensity = 0.25;
    else if (data == 3)
        vEmissionIntensity = 0.35;
    else if (data == 4)
        vEmissionIntensity = 0.42;


    if (i === 0) {
        this.mskinColorData = data;
        for (var iii = 0; iii < this.mskinColourButtons.length; iii++) {
            this.mskinColourButtons[iii].children[0].enabled = iii == data ? true : false;
        }
        console.log(this.skinColour[data].r, this.skinColour[data].g, this.skinColour[data].b);

        this.male.model.meshInstances[1].material.diffuse = this.lipColour[data];
        this.male.model.meshInstances[1].material.update();

        this.male.model.meshInstances[2].material.diffuse = this.skinColour[data];
        this.male.model.meshInstances[2].material.update();

        this.male.model.meshInstances[5].material.diffuse = this.skinColour[data];
        this.male.model.meshInstances[5].material.update();

        // this.male.model.meshInstances[1].setParameter('material_diffuse',[this.lipColour[data].r,this.lipColour[data].g,this.lipColour[data].b]);
        // this.male.model.meshInstances[2].setParameter('material_diffuse',[this.skinColour[data].r,this.skinColour[data].g,this.skinColour[data].b]);
        // this.male.model.meshInstances[2].setParameter('material_emissiveIntensity',vEmissionIntensity);
        // this.male.model.meshInstances[5].setParameter('material_diffuse',[this.skinColour[data].r,this.skinColour[data].g,this.skinColour[data].b]);
        // this.male.model.meshInstances[5].setParameter('material_emissiveIntensity',vEmissionIntensity);
    } else {
        this.fskinColorData = data;
        for (var ii = 0; ii < this.fskinColourButtons.length; ii++) {
            this.fskinColourButtons[ii].children[0].enabled = ii == data ? true : false;
        }

        this.female.model.meshInstances[1].material.diffuse = this.lipColour[data];
        this.female.model.meshInstances[1].material.update();

        this.female.model.meshInstances[0].material.diffuse = this.skinColour[data];
        this.female.model.meshInstances[0].material.update();

        this.female.model.meshInstances[5].material.diffuse = this.skinColour[data];
        this.female.model.meshInstances[5].material.update();

        // this.female.model.meshInstances[1].setParameter('material_diffuse',[this.lipColour[data].r,this.lipColour[data].g,this.lipColour[data].b]);
        // this.female.model.meshInstances[0].setParameter('material_diffuse',[this.skinColour[data].r,this.skinColour[data].g,this.skinColour[data].b]);
        // this.female.model.meshInstances[0].setParameter('material_emissiveIntensity',vEmissionIntensity);
        // this.female.model.meshInstances[5].setParameter('material_diffuse',[this.skinColour[data].r,this.skinColour[data].g,this.skinColour[data].b]);
        // this.female.model.meshInstances[5].setParameter('material_emissiveIntensity',vEmissionIntensity);
    }
};

AvatarCustomizer.prototype.assignHairColor = function (i, data) {
    if (i === 0) {
        this.mhairColorData = data;

        for (var iii = 0; iii < this.mhairColourButtons.length; iii++) {
            this.mhairColourButtons[iii].children[0].enabled = iii == data ? true : false;
        }

        this.mhair[this.mhairData].model.meshInstances[0].material.diffuse = this.hairColour[data];
        this.mhair[this.mhairData].model.meshInstances[0].material.update();

        this.male.model.meshInstances[8].material.diffuse = this.hairColour[data];
        this.male.model.meshInstances[8].material.update();

        this.maleBeard.model.meshInstances[0].material.diffuse = this.hairColour[data];
        this.maleBeard.model.meshInstances[0].material.update();

        //   this.mhair[this.mhairData].model.meshInstances[0].setParameter('material_diffuse',[this.hairColour[data].r,this.hairColour[data].g,this.hairColour[data].b]);
        // this.male.model.meshInstances[8].setParameter('material_diffuse',[this.hairColour[data].r,this.hairColour[data].g,this.hairColour[data].b]);
        //   this.maleBeard.model.meshInstances[0].setParameter('material_diffuse',[this.hairColour[data].r,this.hairColour[data].g,this.hairColour[data].b]);

    } else {
        this.fhairColorData = data;
        for (var ii = 0; ii < this.fhairColourButtons.length; ii++) {
            this.fhairColourButtons[ii].children[0].enabled = ii == data ? true : false;
        }

        this.fhair[this.fhairData].model.meshInstances[0].material.diffuse = this.hairColour[data];
        this.fhair[this.fhairData].model.meshInstances[0].material.update();

        this.female.model.meshInstances[4].material.diffuse = this.hairColour[data];
        this.female.model.meshInstances[4].material.update();
        // this.fhair[this.fhairData].model.meshInstances[0].setParameter('material_diffuse',[this.hairColour[data].r,this.hairColour[data].g,this.hairColour[data].b]);
        // this.female.model.meshInstances[4].setParameter('material_diffuse',[this.hairColour[data].r,this.hairColour[data].g,this.hairColour[data].b]);
    }
};

AvatarCustomizer.prototype.assignBottomColor = function (i, data) {
    if (i === 0) {
        this.mbottomColorData = data;

        for (var iii = 0; iii < this.mbottomColourButtons.length; iii++) {
            this.mbottomColourButtons[iii].children[0].enabled = iii == data ? true : false;
        }

        console.log(this.bottomColour[data]);
        this.male.model.meshInstances[4].material.diffuse = this.bottomColour[data];
        this.male.model.meshInstances[4].material.update();

    } else {
        this.fbottomColorData = data;
        for (var ii = 0; ii < this.fbottomColourButtons.length; ii++) {
            this.fbottomColourButtons[ii].children[0].enabled = ii == data ? true : false;
        }
        this.female.model.meshInstances[7].material.diffuse = this.bottomColour[data];
        this.female.model.meshInstances[7].material.update();

    }
};

AvatarCustomizer.prototype.assignTopColor = function (i, data) {
    console.log(i, data);
    console.log(this.mTop2ColorData);

    if (i === 0) {
        if (data == 0) {
            for (var ii1 = 0; ii1 < this.mTop1ColourButtons.length; ii1++)
                this.mTop1ColourButtons[ii1].children[0].enabled = ii1 == this.mtop1ColorData ? true : false;

            this.male.model.meshInstances[3].material.diffuse = this.topCBColour[this.mtop1ColorData];
            this.male.model.meshInstances[3].material.update();

            this.mtop[data].model.meshInstances[0].material.diffuse = this.topCColour[this.mtop1ColorData];
            this.mtop[data].model.meshInstances[0].material.update();
        }
        else if (data == 1) {
            for (var ii2 = 0; ii2 < this.mTop2ColourButtons.length; ii2++)
                this.mTop2ColourButtons[ii2].children[0].enabled = ii2 == this.mtop2ColorData ? true : false;

            this.mtop[data].model.meshInstances[0].material.diffuse = this.mTopUColour[this.mtop2ColorData];
            this.mtop[data].model.meshInstances[0].material.update();
        }
        else if (data == 2) {
            for (var ii3 = 0; ii3 < this.mTop3ColourButtons.length; ii3++)
                this.mTop3ColourButtons[ii3].children[0].enabled = ii3 == this.mtop3ColorData ? true : false;

            this.mtop[data].model.meshInstances[0].material.diffuse = this.mTopUColour[this.mtop3ColorData];
            this.mtop[data].model.meshInstances[0].material.update();
        }
        else if (data == 3) {
            for (var ii4 = 0; ii4 < this.mTop4ColourButtons.length; ii4++)
                this.mTop4ColourButtons[ii4].children[0].enabled = ii4 == this.mtop4ColorData ? true : false;

            this.male.model.meshInstances[3].material.diffuse = this.topAColour[this.mtop4ColorData];
            this.male.model.meshInstances[3].material.update();
        }

    } else {
        if (data == 0) {
            for (var i1 = 0; i1 < this.fTop1ColourButtons.length; i1++)
                this.fTop1ColourButtons[i1].children[0].enabled = i1 == this.ftop1ColorData ? true : false;

            this.ftop[data].model.meshInstances[0].material.diffuse = this.fTopUColour[this.ftop1ColorData];
            this.ftop[data].model.meshInstances[0].material.update();
        }
        else if (data == 1) {
            for (var i2 = 0; i2 < this.fTop2ColourButtons.length; i2++)
                this.fTop2ColourButtons[i2].children[0].enabled = i2 == this.ftop2ColorData ? true : false;

            this.female.model.meshInstances[6].material.diffuse = this.topCBColour[this.ftop2ColorData];
            this.female.model.meshInstances[6].material.update();

            this.ftop[data].model.meshInstances[0].material.diffuse = this.topCColour[this.ftop2ColorData];
            this.ftop[data].model.meshInstances[0].material.update();

        }
        else if (data == 2) {
            for (var i3 = 0; i3 < this.fTop3ColourButtons.length; i3++)
                this.fTop3ColourButtons[i3].children[0].enabled = i3 == this.ftop3ColorData ? true : false;

            this.ftop[data].model.meshInstances[0].material.diffuse = this.fTopUColour[this.ftop3ColorData];
            this.ftop[data].model.meshInstances[0].material.update();
        }
        else if (data == 3) {
            for (var i4 = 0; i4 < this.fTop4ColourButtons.length; i4++)
                this.fTop4ColourButtons[i4].children[0].enabled = i4 == this.ftop4ColorData ? true : false;

            this.female.model.meshInstances[6].material.diffuse = this.topAColour[this.ftop4ColorData];
            this.female.model.meshInstances[6].material.update();
        }


    }
};
var onceSocket=true;
// update code called every frame
AvatarCustomizer.prototype.update = function (dt) {
    if(onceSocket){
        if (socketInstance&&avatarInstance) {
            onceSocket=false;
            console.log("socket: "+socketInstance);
            socketInstance.emit('avatar:userAvatar', null);
            socketInstance.on('avatar:userAvatar', function (data) {
                console.log(data);
                avatarInstance.blocker.enabled = false;
                if(data.data)
                    avatarInstance.assignElements(data.data.data);
                else
                    avatarInstance.assignElements(data);
            });
            
            socketInstance.on('avatar:updateUserAvatar', function (data) {
                window.localStorage.setItem("avatarDone", "true");
                if (typeof window.parent.switchSceneInformer !== "undefined")
                    window.parent.switchSceneInformer('lobby');
            });
        }
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// AvatarCustomizer.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/