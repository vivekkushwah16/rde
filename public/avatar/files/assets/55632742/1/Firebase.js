var Firebase = pc.createScript('firebase');

Firebase.attributes.add('logoutBtn', {type: 'entity'});

// Firebase.attributes.add('name', {type: 'entity',  title:'Name Entity on Screen'});

// Firebase.attributes.add('score', {type: 'entity', title:'score Entity on Screen'});

var firebaseInstance;

// initialize code called once per entity
Firebase.prototype.initialize = function() {
    var self = this;
    firebaseInstance = this;
    
    this.initializeFirebase();
    
    this.auth.onAuthStateChanged( function(user) {
      if (user) {
          // self.app.fire("firebaseInitialized"); 
          console.log( user.email + ' is logged');
          self.user = user;
          self.getAvatarDetails();
          
          
         // self.name.element.text = user.displayName;
        //  self.updateScore();
        //  self.logoutBtn.enabled = true;
          
          // if(user.photoURL)
          // {
          //   self.app.fire("updateProfileImage", user.photoURL);
          // }
          // else
          // {
          //   self.app.fire("updateProfileImage","https://storage.googleapis.com/virtual-event-273009.appspot.com/ic_default_avatar.png");  
          // }
      }
        else
      {
          self.user = null;
         // self.name.element.text = "";
          //self.score.element.text = "";
         // self.logoutBtn.enabled = false;
          console.log("No user is logged in");
          
        //  if (window.self !== window.top) {
        //   window.parent.location.href =  "/login/index.html";
        // } else {
        //    window.location.href = "/login/index.html";
        // }
          // window.location.href = "/login/index.html";
         // self.login("ronaldode@event.com", "ronaldode");
         //  self.login("guesttwo@event.com", "guesttwo");
          // self.login("puneetrawat@event.com", "puneetrawat");
         // self.login("admin@digitaljalebi.com", "Digital14y7434");
         self.login("nikhiln1dj@event.com", "nikhiln1dj");
          // self.app.fire("showLogin");
      }
    });
    // this.app.on("register",function(gender,cap,glass,skin,dress){
    //     self.updateAvatar(gender,cap,glass,skin,dress);
    // });
    this.app.on("register",function(data){
        console.log(data.gd,data.mhd,data.mtd,data.mskd,data.fhd,data.ftd,data.fskd,data.gm,data.gf,data.mb);
        self.updateAvatar(data);
    });
    
    // this.logoutBtn.element.on("click", function(){
    //     self.logout();
    // });
    this.app.on("AvatarDataUpdate",function(){
          window.location.href = "/lobby/index.html";
    });
};

// update code called every frame
Firebase.prototype.update = function(dt) {
    
};

Firebase.prototype.initializeFirebase = function (){
//     if(firebase.apps.length > 0)
//     {
//         console.log(firebase.apps);
        
//     }else
//     {
        // var firebaseConfig = {
        //   apiKey: "AIzaSyBjNxBYxeK4kRO3Nw_bM8mHFhWof3vowy4",
        //   authDomain: "djistest-f1ae1.firebaseapp.com",
        //   databaseURL: "https://djistest-f1ae1.firebaseio.com",
        //   projectId: "djistest-f1ae1",
        //   storageBucket: "djistest-f1ae1.appspot.com",
        //   messagingSenderId: "978964816786",
        //   appId: "1:978964816786:web:fb5ca7022d87b20143d74b",
        //   measurementId: "G-X7TC7B5W4E"
        // };    
        // firebase.initializeApp(firebaseConfig);
    //     console.log(firebase.app());
    //     console.log(firebase.apps);
    // }
    // var firebaseInt = document.createElement('script');  
    // document.body.appendChild(firebaseInt);
     var firebaseConfig = {
        apiKey: "AIzaSyCneEInwQf9s42gCzrX1ybhEvqO8Z1FcjM",
        authDomain: "broad-expo-rent-dj.firebaseapp.com",
        databaseURL: "https://broad-expo-rent-dj.firebaseio.com",
        projectId: "broad-expo-rent-dj",
        storageBucket: "broad-expo-rent-dj.appspot.com",
        messagingSenderId: "60481384412",
        appId: "1:60481384412:web:d39202acf4d3a9df266919",
        measurementId: "G-N8YN11228Z"
      };
    // var firebaseConfig = {
    //   apiKey: "AIzaSyC84J-IrbfRt3PE6tj4BcYikUzuVk7BM1s",
    //   authDomain: "rentertainment-b3993.firebaseapp.com",
    //   databaseURL: "https://rentertainment-b3993.firebaseio.com",
    //   projectId: "rentertainment-b3993",
    //   storageBucket: "rentertainment-b3993.appspot.com",
    //   messagingSenderId: "78915487346",
    //   appId: "1:78915487346:web:c8dca0e7761e6b4a42a4eb",
    //   measurementId: "G-C16DDK38CS"
    // };
  //    var firebaseConfig = {
  //   apiKey: "AIzaSyBBTGTlH5R_OtEFDLGURFBdZgVRy_ng5xw",
  //   authDomain: "dj-expo.firebaseapp.com",
  //   databaseURL: "https://dj-expo.firebaseio.com",
  //   projectId: "dj-expo",
  //   storageBucket: "dj-expo.appspot.com",
  //   messagingSenderId: "703027772053",
  //   appId: "1:703027772053:web:840bf4f2e7fcc6041b799c",
  //   measurementId: "G-1D3J80JLFX"
  // };
    firebase.initializeApp(firebaseConfig);
    
  // Initialize Firebase
  

this.analytics = firebase.analytics();
  this.db = firebase.firestore();
  this.auth = firebase.auth();  
};

Firebase.prototype.logevent=function(str){
    if(this.user === null)
    {
        return;
    }
    
    this.analytics.logEvent(str);
};

Firebase.prototype.signup = function (email, password)//do not use this please
{
    var self = this;
    
    this.auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
    
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("code: "+errorCode+" & ErrorMsg: "+errorMessage);
    
    }).then(function(cred ) {

    console.log("created");
    var user = cred.user;
    if (user) {
        
      //-------------userInfoAccess----------
      var email = user.email;
      //-------------update Name----------------
        user.updateProfile({
        displayName: name
        }).then(function() {
            console.log("name Updated:"+ name +"!!");
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("code: "+errorCode+" & ErrorMsg: "+errorMessage);
        });

      //-------email verification------------
      var actionCodeSettings = {
        url: 'https://www.digitaljalebi.com/',
        iOS: {
          bundleId: 'com.example.ios'
        },
        android: {
          packageName: 'com.example.android',
          installApp: true,
          minimumVersion: '12'
        },
        handleCodeInApp: true,
        // When multiple custom dynamic link domains are defined, specify which
        // one to use.
        dynamicLinkDomain: "https://www.digitaljalebi.com/"
      };
      user.sendEmailVerification().then(function() {
        // Email sent.
        console.log("email send for verification");
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("code: "+errorCode+" & ErrorMsg: "+errorMessage);
      });
        
        //-----------sending Analytics--------------
        
        var method =  cred.signInMethod;
        self.analytics.logEvent('sign_up');
        
    } else {
      // User is signed out.
      console.log("problem siging in");
    }
    });
};

Firebase.prototype.login = function(email, password){
    var self = this;
    this.auth.signInWithEmailAndPassword(email, password).then( function(cred){
        console.log(cred.user.email + " is logged in right now");
            }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("code: "+errorCode+" & ErrorMsg: "+errorMessage);  
    });  
};

Firebase.prototype.logout = function()
{  
    this.auth.signOut().then(function() {
        
    console.log('user signed out');
     window.location.href = "/login/index.html";//uncomment for final build
  
    }).catch(function(error) {
        
    console.log('error happened while signing out');
        
    });
    
};

//------------------------------------------------------------- Score fucntions -------------------------------------------

Firebase.prototype.updateScore = function (){
    
    if(this.user === null)
    {
        return;
    }
    var self = this;
     this.db.collection('userData').doc(this.user.uid).onSnapshot(function(snapshot){
        var docData = snapshot.data();
         var _score = docData.score;
         console.log(_score);
         self.score.element.text = "Score: "+ _score;
  }, function(err) {
    console.log(err.message);
  });
    
};


Firebase.prototype.incrementScore = function (increment){
    
    if(this.user === null)
    {
        return;
    }
    var self = this;
    
    var userDocRef = this.db.collection('userData').doc(this.user.uid);
    
    this.db.runTransaction(function(transaction) {

        return transaction.get(userDocRef).then(function(userDoc) {
            if (!userDoc.exists) {
                throw "Document does not exist!";
            }
    
            var newScore = userDoc.data().score + increment;
            if (newScore <= 1000000) {
                transaction.update(userDocRef, { score: newScore }); //updating user score
                return newScore;
            } else {
                return Promise.reject("Sorry! Population is too big.");
            }
        });
        
    }).then(function(newScore) {
        console.log("score increased to ", newScore);
    }).catch(function(err) {
        // This will be an "population is too big" error.
        console.error(err);
    });
    
};


Firebase.prototype.incrementGameScore = function (gameTabelName,increment){
    
    if(this.user === null)
    {
        return;
    }
    var self = this;
    var prevScore = 0;

    var userDocRef = this.db.collection(gameTabelName).doc(this.user.uid);
    this.db.runTransaction(function(transaction) {

        return transaction.get(userDocRef).then(function(userDoc) {
            if (!userDoc.exists) {
                throw "Document does not exist!";
            }
    
            prevScore = userDoc.data().score;
            if (prevScore < newScore) {
                transaction.update(userDocRef, { score: newScore });//----------update in game tabel
                var changed = true;
                return changed;
            } else {
                return Promise.reject("Sorry! older score is more");
            }
        });
    }).then(function(changed) {
        if(changed)
        {
          var diff =  newScore - prevScore;
            self.incrementScore(diff); //------update in user tabel
        }
        console.log("score increased to ", newScore);
    }).catch(function(err) {
        // This will be an "population is too big" error.
        console.error(err);
    });
    
};

//----------------------------------------------------------------- Stall function -------------------------------------------------------------

Firebase.prototype.stallEnter = function(stallID)
{
    //-------------increase live count----------------
    var userDocRef = this.db.collection('stallData').doc(stallID);
    
    this.db.runTransaction(function(transaction) {

        return transaction.get(userDocRef).then(function(userDoc) {
            if (!userDoc.exists) {
                throw "Document does not exist!";
            }
    
            var newCount = userDoc.data().liveCount + 1;
            if (newCount <= 1000000) {
                transaction.update(userDocRef, { liveCount: newCount });
                return newCount;
            } else {
                return Promise.reject("Error Updating Counter");
            }
        });
    }).then(function(newCount) {
        console.log("live count increased to ", newCount);
    }).catch(function(err) {
        // This will be an "population is too big" error.
        console.error(err);
    });
    
    //------------------increase Total Count---------------
    this.db.runTransaction(function(transaction) {

        return transaction.get(userDocRef).then(function(userDoc) {
            if (!userDoc.exists) {
                throw "Document does not exist!";
            }
    
            var newCount = userDoc.data().totalCount + 1;
            if (newCount <= 1000000) {
                transaction.update(userDocRef, { totalCount: newCount });
                return newCount;
            } else {
                return Promise.reject("Error Updating Counter");
            }
        });
    }).then(function(newCount) {
        console.log("live count increased to ", newCount);
    }).catch(function(err) {
        console.error(err);
    });
    
    
};


Firebase.prototype.stallLeave = function(stallID)
{
    
    //-------------decrease live count----------------
    var userDocRef = this.db.collection('stallData').doc(stallID);
    
    this.db.runTransaction(function(transaction) {

        return transaction.get(userDocRef).then(function(userDoc) {
            if (!userDoc.exists) {
                throw "Document does not exist!";
            }
    
            var newCount = userDoc.data().liveCount - 1;
            if (newCount >= 0) {
                transaction.update(userDocRef, { liveCount: newCount });
                return newCount;
            } else {
                return Promise.reject("Error Updating Counter");
            }
        });
    }).then(function(newCount) {
        console.log("live count decrease to ", newCount);
    }).catch(function(err) {
        // This will be an "population is too big" error.
        console.error(err);
    }); 
    
};

Firebase.prototype.addTOAvgTime = function(stallID, userTime)
{
    var self = this;
    var id = stallID;
    //-------------decrease live count----------------
    var userDocRef = this.db.collection('stallData').doc(stallID);
    
    this.db.runTransaction(function(transaction) {

        return transaction.get(userDocRef).then(function(userDoc) {
            if (!userDoc.exists) {
                throw "Document does not exist!";
            }
    
            var totalCount = userDoc.data().totalCount;
            var avgTime = userDoc.data().avgTime;
            
            var newavgTime = ((avgTime * (totalCount - 1)) + userTime)/totalCount ;
            newavgTime = newavgTime.toFixed(2);
            
            if (newavgTime >= 0) {
                transaction.update(userDocRef, { avgTime: newavgTime });
                return newavgTime;
            } else {
                return Promise.reject("Error Updating avgTime");
            }
        });
    }).then(function(newavgTime) {
        console.log("new Avg Time is ", newavgTime);
        self.stallLeave(id);
        
    }).catch(function(err) {
        console.error(err);
    }); 
    
};
Firebase.prototype.updateAvatar = function(data)
{ var self=this;
    if(this.user === null)
    {
        console.log(this.user +" user value" );
        return false;
        
    }
    var app=this.app;
    
  this.db.collection("negotiationAvatar").doc(this.user.uid).set({
      genderData: data.gd,
        mhairData: data.mhd,
        mtopData: data.mtd,
        mskinColorData: data.mskd,
        mhairColorData: data.mhcd,
        mbottomColorData: data.mbcd,
        mtop1ColorData:data.mt1cd,
        mtop2ColorData:data.mt2cd,
        mtop3ColorData:data.mt3cd,
        mtop4ColorData:data.mt4cd,
        flagData:data.flagData,
        fhairData: data.fhd,
        ftopData: data.ftd,
          frame:data.frame,
          frameColorData:data.frameColorData,
      
        ftop1ColorData:data.ft1cd,
        ftop2ColorData:data.ft2cd,
        ftop3ColorData:data.ft3cd,
        ftop4ColorData:data.ft4cd,
        fskinColorData: data.fskd,
        fhairColorData: data.fhcd,
        fbottomColorData: data.fbcd,
        glassesM:data.gm,
        glassesF:data.gf,
        beard:data.mb,
  }).then(function(){
      console.log("updated avatar!!");
    app.fire("AvatarDataUpdate");
  }).catch(function(err){
      console.log(err);   
    //     self.db.collection("negotiationAvatar").doc(this.user.uid).set({
    //         genderData: g,
    //         mhairData: h,
    //         mtopData: t,
    //         mskinColorData: sc,
    //         fhairData: fh,
    //         ftopData: ft,
    //         fskinColorData: fsc,
    //         glassesM:gm,
    //         glassesF:gf,
    //         beard:b,
    //   }).then(function(){
    //       console.log("updated avatar!!");
    //     app.fire("AvatarDataUpdate");
    //   }).catch(function(err){
    //      app.fire("fail");
    // });
  });
};

Firebase.prototype.getAvatarDetails = function()
{
    if(this.user === null)
    {
        console.log(this.user +" user value" );
        return false;
        
    }
    
    var self = this;
    var userDocRef = this.db.collection("negotiationAvatar").doc(this.user.uid);
    
    userDocRef.get().then(function(doc){
        if(doc.data())
        {
            var data = doc.data();
            var avatarDetails = 
                {
                    genderData: data.genderData,
                    mhairData: data.mhairData,
                    mtopData: data.mtopData,
                    mskinColorData: data.mskinColorData,
                    mhairColorData: data.mhairColorData,
                    mbottomColorData: data.mbottomColorData,
                    mtop1ColorData: data.mtop1ColorData,
                    mtop2ColorData: data.mtop2ColorData,
                    mtop3ColorData: data.mtop3ColorData,
                    mtop4ColorData: data.mtop4ColorData,
                    flagData:data.flagData,
                    fhairData: data.fhairData,
                    ftopData: data.ftopData,
                      frame:data.frame,
                      frameColorData:data.frameColorData,
                    ftop1ColorData: data.ftop1ColorData,
                    ftop2ColorData: data.ftop2ColorData,
                    ftop3ColorData: data.ftop3ColorData,
                    ftop4ColorData: data.ftop4ColorData,
                    fskinColorData: data.fskinColorData,
                    fhairColorData: data.fhairColorData,
                    fbottomColorData: data.fbottomColorData,
                    glassesM:data.glassesM,
                    glassesF:data.glassesF,
                    beard:data.beard,
                };

            self.analytics.setUserProperties({AvatarVisit: true});
//             self.analytics.setUserProperties({PhotomosaicVisit: false});
//             self.analytics.setUserProperties({AuditoriumVisit: false});
//             self.analytics.setUserProperties({GalleryVisit: false});
//             self.analytics.setUserProperties({LobbyVisit: false});
//             self.analytics.setUserProperties({AvatarVisit: false});
//             self.analytics.setUserProperties({Stall1visit: false});
//             self.analytics.setUserProperties({Stall11visit: false});
//             self.analytics.setUserProperties({Stall10visit: false});
//             self.analytics.setUserProperties({Stall2visit: false});
//             self.analytics.setUserProperties({Stall3visit: false});
//             self.analytics.setUserProperties({Stall4visit: false});
//             self.analytics.setUserProperties({Stall5visit: false});
//             self.analytics.setUserProperties({Stall6visit: false});
//             self.analytics.setUserProperties({Stall7visit: false});
//             self.analytics.setUserProperties({Stall8visit: false});
//             self.analytics.setUserProperties({Stall9visit: false});
            
            //.setUserID(self.user.uid);
            // self.app.fire("firebaseInitialized",self.user, avatarDetails);
           
            self.app.fire("preregisteredAvatar",avatarDetails);
            return avatarDetails;    
        }else
        {
            console.log("doc doesnot exist!!");
             self.app.fire("preregisteredAvatar",null);
            return false;
        }
      }).catch(function(err){
        console.log(err.message);
        return false;
      });
    
};

// Firebase.prototype.updateChatId = function(chatId)
// { 
//     if(this.user === null)
//     {
//         console.log(this.user +" user value" );
//         return false;
        
//     }
//   this.db.collection("users").doc(this.user.uid).update({
//       chatId: chatId
//   }).then(function(){
//       console.log("updated chatuid!!");
//   }).catch(function(err){
//       console.log(err);   
//   });
// };

// Firebase.prototype.getChatId = function(SuccessCallback, failureCallback)
// { 
//     if(this.user === null)
//     {
//         console.log(this.user +" user value" );
//         return false;
        
//     }
//   this.db.collection("users").doc(this.user.uid).get().then(function(doc){
//       var data = doc.data();
//       console.log("data :"+data);
      
//       if(data)
//       {
//           if(data.chatId)
//           {
//               console.log("successs");
//               SuccessCallback(data.chatId);
//           }else
//           {
//               console.log("failure");
//               failureCallback();
//           }
//       }
//   }).catch(function(err){
//       console.log(err);   
//   });
// };