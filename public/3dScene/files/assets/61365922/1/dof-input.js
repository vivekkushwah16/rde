var DofInput = pc.createScript('dofInput');

DofInput.attributes.add('tapThreshold', {type: 'number', default: 0.25, title: 'Tap Threshold (secs)'});
DofInput.attributes.add('sensitivity', {type: 'number', default: 0.3, title: 'Sensitivity'});
DofInput.attributes.add('joystickAccelerationCurve', {type: 'curve', title: 'Joystick Acceleration Curve'});
DofInput.attributes.add('deadZone', {type: 'number', default: 0.2, title: 'Joystick Dead Zone'});
DofInput.attributes.add('discreteRotation', {type: 'number', default: 30, title: 'Discrete Rotation (degrees)'});
DofInput.attributes.add('useJoystickAcceleration', {type: 'boolean', default: false, title: 'Use Joystick Acceleration'});

// initialize code called once per entity
DofInput.prototype.initialize = function() {
    this.vrController = this.entity.script.vrController;
    
    this._buttonDown = false;   
    this._secsSinceButtonDown = 0;
};

// update code called every frame
DofInput.prototype.update = function(dt) {
    var pad = this.vrController.pad;
    var dofController = null;

    if (pad) {
        var prevButtonDown = this._buttonDown;
        this._buttonDown = false;
        
        var threeDofController = this.entity.script.threeDofController;
        var sixDofController = this.entity.script.sixDofController;

        if (pad.pose.hasPosition) {
            if (threeDofController.enabled) {
                threeDofController.enabled = false;
            }                
            dofController = sixDofController;
            dofController.enabled = true;
        } else {
            if (sixDofController.enabled) {
                sixDofController.enabled = false;
            }     

            dofController = threeDofController;
            dofController.enabled = true;
        }
        
        var buttons = pad.buttons;
        for (var j = 0; j < buttons.length; ++j) {
            if (buttons[j].pressed && buttons[j].value > 0.8) {
                this._buttonDown = true;
            }
        }

        // If the button state is just been pressed
        if (!prevButtonDown && this._buttonDown) {
            dofController.onButtonDown();
            this._secsSinceButtonDown = 0;
        }  

        // If they have just released all buttons on the pad
        if (prevButtonDown && !this._buttonDown) {
            if (this._secsSinceButtonDown <= this.tapThreshold) {
                dofController.onButtonTap();
            } 

            dofController.onButtonUp();
        }

        var axes = pad.axes;
        if (axes.length >= 1) {
            // Using an accelaration curve for rotation
            if (this.useJoystickAcceleration) {
                var joystickVec = GamepadInput.joystickVec2.set(axes[0], axes[1]);
                var length = pc.math.clamp(joystickVec.length(), 0, 1);
                var curve = this.joystickAccelerationCurve.value(length) * this.sensitivity * dt;

                // X axis
                if (Math.abs(axes[0]) > this.deadZone) {
                    dofController.yaw -= axes[0] * curve;
                }
            } else {
                if (axes[0] > this.deadZone) {
                    dofController.yaw -= this.discreteRotation * dt;
                } else if (axes[0] < -this.deadZone) {
                    dofController.yaw += this.discreteRotation * dt;
                }
            }
        }

        this._secsSinceButtonDown += dt;
    }
};
