var NameHandler = pc.createScript('nameHandler');

NameHandler.attributes.add('textName', {type: 'entity', title: 'TextFront'});
NameHandler.attributes.add('textRole', {type: 'entity', title: 'TextFront'});

// NameHandler.attributes.add('textBack', {type: 'entity', title: 'TextBack'});

NameHandler.prototype.initialize = function() {
  //  this.player = this.app.root.findByName('Camera Offset');  

 //this.entity.rigidbody.teleport(0, 0, 0, 0, 90, 0);
};

NameHandler.prototype.changeName = function(Name,role) {
    if(!Name)
    {
        console.log("error in Name : "+Name);
        Name = "Unknown";
    }
    this.textName.element.text = Name;
    this.textRole.element.text = role;
};
