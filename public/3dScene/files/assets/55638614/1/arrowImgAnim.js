var ArrowImgAnim = pc.createScript('arrowImgAnim');

ArrowImgAnim.attributes.add('speed', {type: 'number'});
ArrowImgAnim.attributes.add('textures', {
    type: 'asset', 
    assetType: 'texture',
    array: true
});


ArrowImgAnim.prototype.initialize = function() {
    var self=this;
    this.id=0;
    
    setInterval(function(){
         var texture = self.textures[self.id].resource;
        self.entity.element.texture=texture;
        self.entity.element.texture.upload();
        
        self.id++;
        
        if(self.id >= self.textures.length){
            self.id=0;
        }
    },self.speed*1000);
};

ArrowImgAnim.prototype.update = function(dt) {
    
};

