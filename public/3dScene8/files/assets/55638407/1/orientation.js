var Orientation = pc.createScript('orientation');

// initialize code called once per entity
Orientation.prototype.initialize = function() {
    
   /*  styleEl = document.createElement('div');
     styleEl.innerHTML = "<input type='button' onclick='fullLand();' value ='Change Orientation ' id='orentiationid' style='padding-left:0px; width:150px; height: 40px; position:absolute;background-color:green;color:white'></input>";   
      document.body.appendChild(styleEl); */
  //  fullLand();
};

// update code called every frame
Orientation.prototype.update = function(dt) {
    
    
};

function fullScreenCheck() {
  if (document.fullscreenElement) return;
  return document.documentElement.requestFullscreen();
}

/*function updateDetails(lockButton) {
  const buttonOrientation = getOppositeOrientation();
  lockButton.value = `Change to ${buttonOrientation}`;
    confirm.log(lockButton.value);
}

function getOppositeOrientation() {
  const { type } = screen.orientation;
  return type.startsWith("portrait") ? "landscape" : "portrait";
}

async function rotate(lockButton) { 
  try {
    await fullScreenCheck();
  } catch (err) {
    console.error(err);
  }
  const newOrientation = getOppositeOrientation();
  await screen.orientation.lock(newOrientation);
  updateDetails(lockButton);
}

function show() {
  const { type, angle } = screen.orientation;
  console.log(`Orientation type is ${type} & angle is ${angle}.`);
}

screen.orientation.addEventListener("change", () => {
  show();
  updateDetails(document.getElementById("orentiationid"));
});

window.addEventListener("load", () => {
  show();
  updateDetails(document.getElementById("orentiationid"));
});*/

async function fullLand(){
    try {
        await fullScreenCheck();
    } catch (err) {
        console.error(err);
    }
    const newOrientation = "landscape";
    await screen.orientation.lock(newOrientation);
}

// swap method called for script hot-reloading
// inherit your script state here
// Orientation.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/