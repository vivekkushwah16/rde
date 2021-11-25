var Hotspot = pc.createScript('hotspot');

Hotspot.attributes.add("cameraEntity", {type: "entity", title: "Camera Entity"});
Hotspot.attributes.add("radius", {type: "number", title: "Radius"});

var CameraEntity;

// initialize code called once per entity
Hotspot.prototype.initialize = function() {
    // Create a hit area using a bounding sphere
    CameraEntity = this.cameraEntity;
    this.hitArea = new pc.BoundingSphere(this.entity.getPosition(), this.radius);
    // More information about pc.ray: http://developer.playcanvas.com/en/api/pc.Ray.html
    this.ray = new pc.Ray();
    
    // Register the mouse down and touch start event so we know when the user has clicked
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    
    if (this.app.touch) {
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
    }
};

// update code called every frame
Hotspot.prototype.update = function(dt) {
  };

Hotspot.prototype.doRayCast = function (screenPosition) {
    // Only do the raycast if the sprite is showing
        // Initialise the ray and work out the direction of the ray from the a screen position
        CameraEntity.camera.screenToWorld(screenPosition.x, screenPosition.y, CameraEntity.camera.farClip, this.ray.direction); 
        this.ray.origin.copy(CameraEntity.getPosition());
        this.ray.direction.sub(this.ray.origin).normalize();

        // If the hotspot is clicked on, then send a event to start the 'pulse' effect
        if (this.hitArea.intersectsRay(this.ray)) {
            this.entity.fire("hotspot:click");
            console.log("clicked");
        }
   
};

Hotspot.prototype.onMouseDown = function(event) {
    if (event.button == pc.MOUSEBUTTON_LEFT) {
        this.doRayCast(event);
    }
};

Hotspot.prototype.onTouchStart = function (event) {
    // On perform the raycast logic if the user has one finger on the screen
    if (event.touches.length == 1) {
        this.doRayCast(event.touches[0]);
        
        // Prevent the default mouse down event from triggering
        // https://www.w3.org/TR/touch-events/#h3_list-of-touchevent-types
        event.event.preventDefault();
    }    
};

