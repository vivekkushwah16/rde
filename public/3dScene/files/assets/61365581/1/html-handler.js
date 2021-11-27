// this script can reference html asset as an attribute
// and will live update dom and reattach events to it on html changes
// so that launcher don't need to be refreshed during development
var HtmlHandler = pc.createScript('htmlHandler');

HtmlHandler.attributes.add('html', {type: 'asset', assetType:'html', title: 'HTML Asset'});


HtmlHandler.attributes.add('instruction', {type: 'entity'});

HtmlHandler.prototype.initialize = function() {

    var self = this;
   //lock camera----
   //
    //create html for login
    
    
    this.app.on('enterServer', function(name){
        self.removeAsset();
    });
    
    // asset
    this.asset = null;
    this.assetId = 0;
    this.showAsset = false;
    
    this.app.on("showLogin", function(){
            self.createAsset();            
    });
    //unlock camera after login
};


HtmlHandler.prototype.attachAsset = function(assetId, fn) {
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


HtmlHandler.prototype.template = function(asset, html) {
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


HtmlHandler.prototype.bindEvents = function() {

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
        
    });
    
};

HtmlHandler.prototype.update = function (dt) {
    // check for swapped asset
    // if so, then start asset loading and templating
    if(this.showAsset)
    {
     if (this.assetId !== this.html.id)
        this.attachAsset(this.html.id, this.template);   
    }
    
};


HtmlHandler.prototype.removeAsset = function () 
{
    this.element.remove();  
    this.showAsset = false;
    this.instruction.enabled = true;
   // this.app.fire('unlockCamera');
};


HtmlHandler.prototype.createAsset = function () 
{
    console.log("Creating Asset");
    
    this.element = document.createElement('div');
    this.element.classList.add('container');

    document.body.appendChild(this.element);
    
    this.asset = null;
    this.assetId = 0;
    this.showAsset = true;
    this.instruction.enabled = false;
    
    this.app.fire('lockCamera');
};


HtmlHandler.prototype.callDB = function () 
{
    firebase.firestore().collection('userData').orderBy("score", "desc").limit(3).get().then(function(snapshot){
      console.log('got data from db');
      var docs = snapshot.docs;
        for (i = 0; i < docs.length; i++) {
            console.log(docs[i].data().name);
            console.log(docs[i].data().score);
        }   
    });
};

HtmlHandler.prototype.sendAnalytics = function () 
{
    var usermail = this.user.email;
    firebase.analytics().logEvent('userSignIn', { email: usermail});
};
