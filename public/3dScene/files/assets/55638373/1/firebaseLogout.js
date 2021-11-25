var FirebaseLogout = pc.createScript('firebaseLogout');


FirebaseLogout.attributes.add('firebaseEntity', {type:"entity"});

FirebaseLogout.attributes.add('instruction', {type: 'entity'});
// initialize code called once per entity
FirebaseLogout.prototype.initialize = function() {
    this.entity.on('object:interact', this._onInteract, this);
    this.entity.on('object:onhover', this._onHover, this);
    this.entity.on('object:offhover', this._offHover, this);
    
    this.firebaseRef = this.firebaseEntity.script.firebase;
    
};


FirebaseLogout.prototype._onHover = function(dt) {
    this.instruction.enabled = true;
};

FirebaseLogout.prototype._offHover = function(dt) {
     this.instruction.enabled = false;
};


FirebaseLogout.prototype._onInteract = function(dt) {
    this.firebaseRef.logout();
   location.reload(); 
    /*
            var link =  document.createElement('a');
            link.href = "javascript:close_window();";
            link.target="_top";
             document.body.appendChild(link);
            link.click();
             document.body.removeChild(link);  
             */
};
