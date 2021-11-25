var GamepadInput = pc.createScript('gamepadInput');

GamepadInput.attributes.add('gazeControllerEntity', {type: 'entity', title: 'Gaze Controller Entity'});
GamepadInput.attributes.add('sensitivity', {type: 'number', default: 0.3, title: 'Sensitivity'});
GamepadInput.attributes.add('joystickAccelerationCurve', {type: 'curve', title: 'Joystick Acceleration Curve'});
GamepadInput.attributes.add('deadZone', {type: 'number', default: 0.2, title: 'Joystick Dead Zone'});
GamepadInput.attributes.add('discreteRotation', {type: 'number', default: 30, title: 'Discrete Rotation (degrees)'});
GamepadInput.attributes.add('useJoystickAcceleration', {type: 'boolean', default: false, title: 'Use Joystick Acceleration'});


// initialize code called once per entity
GamepadInput.prototype.initialize = function() {
    this._vrController = this.gazeControllerEntity.script.gazeController;

    // Treat all the buttons on a pad as 'one' button
    // ie, any buttons are down then the button state is 'down'
    // if all buttons are up then the button state is 'up'
    this._padButtonState = {};
};

GamepadInput.joystickVec2 = new pc.Vec2();

// update code called every frame
GamepadInput.prototype.update = function(dt) {
    if (this.app.gamepads) {
        var pads = this.app.gamepads.current;
        for (var i = 0; i < pads.length; ++i) {
            var pad = pads[i].pad; 
            // Make sure it isn't a VR input device
            if ((!pad.hand && !pad.pose)) {
                var id = pad.id + pad.index.toString();

                var prevAnyButtonDown = this._padButtonState[id] ? this._padButtonState[id] : false;
                var anyButtonDown = false;

                var buttons = pad.buttons;
                for (var j = 0; j < buttons.length; ++j) {
                    if (buttons[j].pressed && buttons[j].value > 0.8) {
                        anyButtonDown = true;
                    }
                }

                // If the button state is just been pressed
                if (!prevAnyButtonDown && anyButtonDown) {
                    this._vrController.onButtonDown();
                }            

                // If they have just released all buttons on the pad
                if (prevAnyButtonDown && !anyButtonDown) {
                    this._vrController.onButtonUp();
                }

                var axes = pad.axes;
                if (axes.length >= 2) {
                    if (this.useJoystickAcceleration) {
                        var joystickVec = GamepadInput.joystickVec2.set(axes[0], axes[1]);
                        var length = pc.math.clamp(joystickVec.length(), 0, 1);
                        var curve = this.joystickAccelerationCurve.value(length) * this.sensitivity * dt * 100;

                        // X axis
                        if (Math.abs(axes[0]) > this.deadZone) {
                            this._vrController.yaw -= axes[0] * curve;
                        }

                        // Y axis
                        if (Math.abs(axes[1]) > this.deadZone) {
                            this._vrController.pitch += axes[1] * curve;              
                        }
                    } else {
                        if (axes[0] > this.deadZone) {
                            this._vrController.yaw -= this.discreteRotation * dt;
                        } else if (axes[0] < -this.deadZone) {
                            this._vrController.yaw += this.discreteRotation * dt;
                        }
                        
                        if (axes[1] > this.deadZone) {
                            this._vrController.pitch += this.discreteRotation * dt;
                        } else if (axes[1] < -this.deadZone) {
                            this._vrController.pitch -= this.discreteRotation * dt;
                        }
                    } 
                }

                this._padButtonState[id] = anyButtonDown;
            }
        }
    }
};