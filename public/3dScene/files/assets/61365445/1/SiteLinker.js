var SiteLinker = pc.createScript('siteLinker');

SiteLinker.attributes.add('url', {type:'string', title: 'Site Link'});


// initialize code called once per entity
SiteLinker.prototype.initialize = function() {
    var self = this;
    
    this.entity.on('hotspot:click', function(){
        console.log("new site open request" + self.url);
     var link =  document.createElement('a');
        link.href = self.url;
        link.target="_top";
         document.body.appendChild(link);
        link.click();
         document.body.removeChild(link);  
    });
};

// update code called every frame
SiteLinker.prototype.update = function(dt) {
    
};
