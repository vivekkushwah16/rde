var IframeOpener = pc.createScript('iframeOpener');

IframeOpener.attributes.add('html', {type: 'asset', assetType:'html', title: 'HTML Asset'});

IframeOpener.attributes.add('instruction', {type: 'entity'});

IframeOpener.attributes.add('canvas2D', {type: 'entity'});

IframeOpener.attributes.add('firebaeconsole', {type: 'entity'});

IframeOpener.attributes.add('closeBtn', {type: 'entity'});

IframeOpener.attributes.add('width', {type: 'number',  default: 0.85});

IframeOpener.attributes.add('height', {type: 'number', default: 0.85});

IframeOpener.attributes.add('teleport', {type: 'boolean', default: false});

IframeOpener.attributes.add('container', {type: 'string', default: "container"});

IframeOpener.attributes.add('camera', {type: 'entity'});

var IframeOpenerInstance=null;
IframeOpener.prototype.initialize = function() {

    var self = this;
    
    this.entity.on('object:interact', this._onInteract, this);
    this.entity.on('object:onhover', this._onHover, this);
    this.entity.on('object:offhover', this._offHover, this);
    this.element=null;
    if(this.closeBtn)
        this.closeBtn.element.on('click', function(){
           self.removeAsset(); 
        });
    // asset
    this.asset = null;
    this.assetId = 0;
    this.showAsset = false;
    this.canWork = true;
     this.reset = false;
    //unlock camera after login
};

IframeOpener.prototype.attachAsset = function(assetId, fn) {
    // remember current assetId
    this.assetId = assetId;

    // might be no asset provided
    if (! this.assetId)
        return fn.call(this);

    // get asset from registry
    var asset = this.app.assets.get(this.assetId);

    // store callback of an asset load event
    var self = this;
    asset._onLoad = function(asset) {
        fn.call(self, asset, asset.resource);
    };

    // subscribe to changes on resource
    asset.on('load', asset._onLoad);
    // callback
    fn.call(this, asset, asset.resource);
    // load asset if not loaded
    this.app.assets.load(asset);
};


IframeOpener.prototype.template = function(asset, html) {
    // unsubscribe from old asset load event if required
    if (this.asset && this.asset !== asset)
        this.asset.off('load', this.asset._onLoad);

    // remember current asset
    this.asset = asset;

    // template element
    // you can use templating languages with renderers here
    // such as hogan, mustache, handlebars or any other
    this.element.innerHTML = html || '';

    // bind some events to dom of an element
    // it has to be done on each retemplate
    if (html)
        this.bindEvents();
};


IframeOpener.prototype.bindEvents = function() {
    
    var self = this;
    
    if(this.container=="binoContainer"){
        var cross=document.querySelector("#close");
        cross.addEventListener('onclick', function(e) {
             e.preventDefault();
             self.removeAsset();
        });
    }else{
        var frame = document.querySelector("#frame");
        if(frame){
            frame.setAttribute('width', screen.width * self.width);
            frame.setAttribute('height', screen.height * self.height);
        }
    }
    IframeOpenerInstance=this;
    window.parent.closeVideoCall = this.removeAssetFromOut;
   /* var self = this;
    var Modalelem = document.querySelector('.modal');
    var instance = M.Modal.init(Modalelem);
    instance.options.dismissible = false;
    instance.open();

    var loginForm = this.element.querySelector('#login-form');
    //----------------------------------------------
           
    //=-
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var email = loginForm['login-email'].value;
        var password = loginForm['login-password'].value;

      firebase.auth().signInWithEmailAndPassword(email, password).then( function(cred) {
        
          console.log(cred.user.displayName);
          self.user = cred.user;
         
         //store user data and close asset
        //  self.callDB();
          self.sendAnalytics();
          self.removeAsset();
          
      }).catch(function(error) {
        // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("code: "+errorCode+" & ErrorMsg: "+errorMessage);  
      });
        
    });*/
    
};

IframeOpener.prototype.removeAssetFromOut = function () 
{
    if(IframeOpenerInstance)
        IframeOpenerInstance.removeAsset();
};

IframeOpener.prototype.removeAsset = function () 
{
    var self=this;
    console.log("removing");
    console.log(this.element);
    
    // var elementa=document.getElementsByClassName("containerVideo")[0];
    // console.log(elementa);
    // if(elementa)
    //     elementa.remove();
    if(this.element)
        this.element.remove();  
    
    this.showAsset = false;
    
    console.log(this.instruction);
    if(this.instruction)
        this.instruction.enabled = false;
    if(this.canvas2D)
        this.canvas2D.enabled = false;
    //this.firebaeconsole.enabled = true;
    if(this.closeBtn){
        var arr = [this.closeBtn];
        this.app.fire("enableButts", arr );   
        this.closeBtn.enabled = false;
    }
    this.app.fire('unlockCamera');
    
    // this.canWork = true;
    // this.time = 0;
    setTimeout(function(){
        self.canWork = true;
    },2000);
    this.reset = true;
    console.log(this.reset);
    IframeOpenerInstance=null;
    window.parent.closeVideoCall=null;
};




IframeOpener.prototype.createAsset = function () 
{
    console.log("Creating Asset");

    
    this.element = document.createElement('div');
    this.element.classList.add(this.container);

    document.body.appendChild(this.element);
    
    this.asset = null;
    this.assetId = 0;
    this.showAsset = true;
    if(this.instruction)
    this.instruction.enabled = true;
    if(this.canvas2D)
    this.canvas2D.enabled = true;
    if(this.closeBtn){
        this.closeBtn.enabled = true;
        var arr = [this.closeBtn];
        this.app.fire('disableButts', arr);
    }
    // this.firebaeconsole.enabled = false;
    this.app.fire('lockCamera');
    if(this.app.mouse)
      {
        this.app.mouse.disablePointerLock();
      }
    
    this.canWork = false;
    this.time = 0;
};


IframeOpener.prototype.update = function (dt) {
   
    if(this.showAsset)
    {
     if (this.assetId !== this.html.id)
        this.attachAsset(this.html.id, this.template);   
    }
        // console.log(this.reset);
    // if(this.reset)
    // {
    //     this.time += dt;
    //     console.log(this.time);
    //     if(this.time > 2)
    //     {
    //         this.canWork = true;
    //         this.reset = false;
    //         this.time = 0;
    //     }
    // }
    
};

IframeOpener.prototype._onInteract = function(dt) {
    console.log(this.canWork);
    if(!this.canWork)
    {
        return;
    }
   // console.log("clicked");
    this.instruction.enabled = false;
    this.createAsset();
    firebaseInstance.logevent("photomosaic_visit");
    firebaseInstance.setPropertyPM();
    if(this.teleport){
       // if(this.camera)
       //     this.camera.setPosition(this.entity.children[0].getPosition());
    }
};

IframeOpener.prototype._onHover = function(dt) {
//    console.log("On HOver");
    this.instruction.enabled = true;
};

IframeOpener.prototype._offHover = function(dt) {
 //   console.log("Off hover");
     this.instruction.enabled = false;
};
