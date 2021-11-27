var IframeOpener1 = pc.createScript('iframeOpener1');

IframeOpener1.attributes.add('html', {type: 'asset', assetType:'html', title: 'HTML Asset'});

IframeOpener1.attributes.add('width', {type: 'number',  default: 0.85});

IframeOpener1.attributes.add('height', {type: 'number', default: 0.85});

IframeOpener1.prototype.initialize = function() {
console.log('ssdd');
    var self = this; 
    // asset
    this.asset = null;
    this.assetId = 0;
    this.showAsset = false;

     this.createAsset();
    //unlock camera after login
};

IframeOpener1.prototype.attachAsset = function(assetId, fn) {
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


IframeOpener1.prototype.template = function(asset, html) {
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


IframeOpener1.prototype.bindEvents = function() {
   /* 
    var self = this;
    var frame = document.querySelector("#frame");
    
    frame.setAttribute('width', screen.width * self.width);
    
    frame.setAttribute('height', screen.height * self.height);
    
    var container = document.querySelector(".container");
    container.style.backgroundColor = "transparent";
    container.style.width = screen.width;
    container.style.height = screen.height;
    

    var self = this;
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


IframeOpener1.prototype.removeAsset = function () 
{
    this.element.remove();  
    this.showAsset = false;
    
    this.app.fire('unlockCamera');
    
    this.reset = true;
};


IframeOpener1.prototype.createAsset = function () 
{
    console.log("Creating Asset");
    
    this.element = document.createElement('div');
    this.element.classList.add('container');

    document.body.appendChild(this.element);
    
    this.asset = null;
    this.assetId = 0;
    this.showAsset = true;
    
    this.app.fire('lockCamera');
    if(this.app.mouse)
      {
        this.app.mouse.disablePointerLock();
      }

};


IframeOpener1.prototype.update = function (dt) {
   
    if(this.showAsset)
    {
     if (this.assetId !== this.html.id)
        this.attachAsset(this.html.id, this.template);   
    }
 
};
