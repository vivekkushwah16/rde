var Firebase = pc.createScript('firebase');

Firebase.attributes.add('logoutBtn', {type: 'entity'});

Firebase.attributes.add('name', {type: 'entity',  title:'Name Entity on Screen'});

Firebase.attributes.add('score', {type: 'entity', title:'score Entity on Screen'});

Firebase.attributes.add('profileM', {type: 'entity'});
Firebase.attributes.add('profileF', {type: 'entity'});

Firebase.attributes.add('mAno', {type: 'entity'});
Firebase.attributes.add('mNik', {type: 'entity'});
Firebase.attributes.add('mIri', {type: 'entity'});
Firebase.attributes.add('mSur', {type: 'entity'});
Firebase.attributes.add('mDani', {type: 'entity'});

Firebase.attributes.add('mSan',{type:'entity'});
Firebase.attributes.add('mStu',{type:'entity'});
Firebase.attributes.add('mSud',{type:'entity'});
Firebase.attributes.add('mAlb',{type:'entity'});

Firebase.attributes.add('mAlex',{type:'entity'});
Firebase.attributes.add('mAndrew',{type:'entity'});
Firebase.attributes.add('mBarry',{type:'entity'});
Firebase.attributes.add('mRichard',{type:'entity'});
Firebase.attributes.add('mSarah',{type:'entity'});
Firebase.attributes.add('mSimon',{type:'entity'});
Firebase.attributes.add('mYana',{type:'entity'});

Firebase.attributes.add('breakoutRoom',{type:'entity'});
Firebase.attributes.add('negotiationRoom',{type:'entity'});


Firebase.attributes.add('audiOff',{type:'entity'});

Firebase.attributes.add('myNameText', {type: 'entity'});
Firebase.attributes.add('autologin', {type: 'boolean'});

var firebaseInstance;

// initialize code called once per entity
Firebase.prototype.initialize = function() {
    var self = this;
    this.myUID="";
    this.myemail="";   
    this.myModel=null;
    this.communicatingWith="";
    firebaseInstance = this;
    
    this.initializeFirebase();
    
    this.auth.onAuthStateChanged( function(user) {
      if (user) {
         
          self.currentUser = user;
          //for initalization of chat window
          // if(CometChatInstance)
          //     CometChatInstance.openWindow(true);
          
          //make analytics name
            var Id = '';
            Id = user.email.split('@')[0];
            Id = Id.replace(/[&\/\\#,+$~%.'":*?<>{}]/g, '');
            Id = Id.toLowerCase();
            self.analyticsName = Id;
          
          //for marking user online
          self.updateStatus();
          
          //adding userStatus listener
          self.addUserStatusListener();
          
          //adding live chat user
          self.addLiveChatListener();
          
          // self.app.fire("firebaseInitialized"); 
          console.log( user.email + ' is logged');
          self.user = user;
          self.myUID=user.uid;
          self.myemail=user.email;
          self.getAvatarDetails();
          self.myNameText.element.text=user.displayName+" (me)";
          self.name.element.text = user.displayName;
        //  self.updateScore();
          self.logoutBtn.enabled = true;
          self.checkBreakoutRoomMember(user.email);
          // self.checkNegotiationRoomMember(user.email);
          
        //     if(self.myemail.includes("n1dj")){
        //       self.mNik.enabled=true;
        //        self.myModel=self.mNik;
        //     }
        //     else if(self.myemail.includes("s2dj")){
        //         self.mSur.enabled=true;
        //         self.myModel=self.mSur;
        //     }
        //     else if(self.myemail.includes("i3dj")){
        //         self.mIri.enabled=true;
        //         self.myModel=self.mIri;
        //     }
        //     else if(self.myemail.includes("d4dj")){
        //         self.mDani.enabled=true;
        //         self.myModel=self.mDani;
        //     }
        //   else if(self.myemail.includes("sa5dj")){
        //         self.mSan.enabled=true;
        //         self.myModel=self.mSan;
        //     }
        //   else if(self.myemail.includes("st6dj")){
        //         self.mStu.enabled=true;
        //         self.myModel=self.mStu;
        //     }
        //   else if(self.myemail.includes("su7dj")){
        //         self.mSud.enabled=true;
        //         self.myModel=self.mSud;
        //     }
        //   else if(self.myemail.includes("al8dj")){
        //         self.mAlb.enabled=true;
        //         self.myModel=self.mAlb;
        //         self.audiOff.enabled=false;
        //     }
        //   else if(self.myemail.includes("al9dj")){
        //     self.mAlex.enabled=true;
        //     self.myModel=self.mAlex;
        // }
        // else if(self.myemail.includes("an10dj")){
        //     self.mAndrew.enabled=true;
        //     self.myModel=self.mAndrew;
        // }
        // else if(self.myemail.includes("ba11dj")){
        //     self.mBarry.enabled=true;
        //     self.myModel=self.mBarry;
        // }
        //  else if(self.myemail.includes("ri12dj")){
        //     self.mRichard.enabled=true;
        //     self.myModel=self.mRichard;
        // }
        //  else if(self.myemail.includes("sa13dj")){
        //     self.mSarah.enabled=true;
        //     self.myModel=self.mSarah;
        // }
        //  else if(self.myemail.includes("si14dj")){
        //     self.mSimon.enabled=true;
        //     self.myModel=self.mSimon;
        // }
        //  else if(self.myemail.includes("ya15dj")){
        //     self.mYana.enabled=true;
        //     self.myModel=self.mYana;
        // }
        //     else 
            {
                console.log("anonymous?");
                self.mAno.enabled=true;
                self.myModel=self.mAno;
                
            }
          
          setTimeout(function(){
              firebaseInstance.myModel.animation.play("Idol.glb",0.2);
              firebaseInstance.myModel.animation.loop=true;
          },1000);
          
          if(user.photoURL)
          {
            self.app.fire("updateProfileImage", user.photoURL);
          }
          else
          {
            self.app.fire("updateProfileImage","https://storage.googleapis.com/virtual-event-273009.appspot.com/ic_default_avatar.png");  
          }
      }
        else
      {
          self.user = null;
          self.name.element.text = "";
          //self.score.element.text = "";
          self.logoutBtn.enabled = false;
          console.log("No user is logged in");
          
          // self.login("irinai3dj@event.com", "irinai3dj");
         // self.login("danid4dj@event.com", "danid4dj");
         
          // self.login("puneetrawat@event.com", "puneetrawat");
          // if(!self.autologin){
          if (window.self !== window.top) {
              window.parent.location.href =  "/login/index.html";
          } else {
              window.location.href = "/login/index.html";
          }
          // }else{
                       // self.login("V1ZS@event.com", "V1ZSdj123#");

              // self.login("nikhiln1dj@event.com", "nikhiln1dj");
          // }
         // self.login("PRDJZS@event.com", "PRDJZSdj123#");
          // self.login("YHNAZS@event.com", "YHNAZSdj123#");
         //  self.login("guesttwo@event.com", "guesttwo");
         // self.login("nikhiln1dj@event.com", "nikhiln1dj");
       // self.login("sureshs2dj@event.com", "sureshs2dj");
         // self.login("nikhiljoshi@event.com", "nikhiljoshi");
         // self.login("admin@digitaljalebi.com", "Digital14y7434");
         // self.login("naval@digitaljalebi.com", "Up14y7434");
          // self.app.fire("showLogin");
      }
    });
    
    // this.logoutBtn.element.on("click", function(){
    //     self.logout();
    // });
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
    
    firebase.initializeApp(firebaseConfig);
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
    // Initialize Firebase
  
    this.analytics = firebase.analytics();
    this.db = firebase.firestore();
    this.auth = firebase.auth(); 
    this.realDB = firebase.database();
};

Firebase.prototype.logevent=function(str){
    if(this.user === null)
    {
        return;
    }
    
    this.analytics.logEvent(str);
};

 Firebase.prototype.checkBreakoutRoomMember =  function (email){//do not use this please
     var emailTemp=email.split('@')[0].toUpperCase()+"@event.com";
     var self=this;
         this.db.collection("dailyco")
            .where("members", "array-contains", emailTemp)
            .get().then((kuchmila) => {
                 console.log(kuchmila);
                  if (kuchmila.empty) {
                    // alert( "No room found for user");
                  }
                var flag=true;
                  for (let i = 0; i < kuchmila.docs.length; i++) {
                    if (kuchmila.docs[i].id.includes("Breakout")) {
                        self.breakoutRoom.script.hotspotSceneChanger.updateLink(kuchmila.docs[i].id);
                        flag=false;
                         if (typeof window.parent.allowBreakout !== "undefined")
                            window.parent.allowBreakout(kuchmila.docs[i].id);
                        
                        break;
                        // alert(""+kuchmila.docs[i].id);
                      // return kuchmila.docs[i].id;
                    }
                  }
             
             if(flag)
                 self.breakoutRoom.enabled=false;
            });
   
          //   alert( "No room found for user");
          // return "No room found for user";
        };

 Firebase.prototype.checkNegotiationRoomMember =  function (email){//do not use this please
     var self=this;
         this.db.collection("dailyco")
            .where("members", "array-contains", email)
            .get().then((kuchmila) => {
                 console.log(kuchmila);
                  if (kuchmila.empty) {
                    // alert( "No room found for user");
                  }
                var flag=true;
                  for (let i = 0; i < kuchmila.docs.length; i++) {
                    if (kuchmila.docs[i].id.includes("Negotiation")) {
                        self.negotiationRoom.script.hotspotSceneChanger.updateLink(kuchmila.docs[i].id);
                        flag=false;
                         if (typeof window.parent.allowNegotiation !== "undefined")
                            window.parent.allowNegotiation(kuchmila.docs[i].id);
                        break;
                        // alert(""+kuchmila.docs[i].id);
                      // return kuchmila.docs[i].id;
                    }
                  }
             
             if(flag)
                 self.negotiationRoom.enabled=false;
            });
   
          //   alert( "No room found for user");
          // return "No room found for user";
        };
// async function checkRoom () {
//     try {
//       let roomId = await checkForDailycoMember(this.context);
//       alert(roomId);
//     } catch (err) {
//       alert(err);
//     }
//   };

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
        
       if (window.self !== window.top) {
          window.parent.location.href =  "/login/index.html";
        } else {
           window.location.href = "/login/index.html";
        }
  
    }).catch(function(error) {
        
    console.log('error happened while signing out');
        
    });
};

window.parent.logoutFirebase=function(){
    firebaseInstance.logout();
}
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

Firebase.prototype.setPropertyPM=function(temp){
     this.analytics.setUserProperties({PhotomosaicVisit: true});
};

Firebase.prototype.getAvatarDetails = function()
{
    if(this.user === null)
    {
        console.log(this.user +" user value" );
        return false;
        
    }
    
    var self = this;
    console.log(this.user.uid);
    var userDocRef = this.db.collection("negotiationAvatar").doc(this.user.uid);
    
    userDocRef.get().then(function(doc){
        if(doc.data())
        {
            var data = doc.data();
            console.log(data);
            console.log(data.genderData);
            var avatarDetails = 
                {
                    genderData: data.genderData==undefined?0: data.genderData,
                    mhairData: data.mhairData==undefined?0: data.mhairData,
                    mtopData: data.mtopData==undefined?0: data.mtopData,
                    mskinColorData: data.mskinColorData==undefined?0: data.mskinColorData,
                    mhairColorData: data.mhairColorData==undefined?0: data.mhairColorData,
                    mbottomColorData: data.mbottomColorData==undefined?0: data.mbottomColorData,
                    mtop1ColorData: data.mtop1ColorData==undefined?0: data.mtop1ColorData,
                    mtop2ColorData: data.mtop2ColorData==undefined?0: data.mtop2ColorData,
                    mtop3ColorData: data.mtop3ColorData==undefined?0: data.mtop3ColorData,
                    mtop4ColorData: data.mtop4ColorData==undefined?0: data.mtop4ColorData,
                    fhairData: data.fhairData==undefined?0: data.fhairData,
                    ftopData: data.ftopData==undefined?0: data.ftopData,
                    flagData: data.flagData==undefined?0: data.flagData,
                    frame:data.frame==undefined?0: data.frame,
                    frameColorData:data.frameColorData==undefined?0: data.frameColorData,
                    ftop1ColorData: data.ftop1ColorData==undefined?0: data.ftop1ColorData,
                    ftop2ColorData: data.ftop2ColorData==undefined?0: data.ftop2ColorData,
                    ftop3ColorData: data.ftop3ColorData==undefined?0: data.ftop3ColorData,
                    ftop4ColorData: data.ftop4ColorData==undefined?0: data.ftop4ColorData,
                    fskinColorData: data.fskinColorData==undefined?0: data.fskinColorData,
                    fhairColorData: data.fhairColorData==undefined?0: data.fhairColorData,
                    fbottomColorData: data.fbottomColorData==undefined?0: data.fbottomColorData,
                    glassesM:data.glassesM==undefined?0: data.glassesM,
                    glassesF:data.glassesF==undefined?0: data.glassesF,
                    beard:data.beard==undefined?0: data.beard,
                };
            // if(avatarDetails.gender===0)
            //     self.profileM.enabled=true;
            // else if(avatarDetails.gender===1)
            //     self.profileF.enabled=true;
            
            self.analytics.setUserProperties({LobbyVisit: true});
            self.app.fire("firebaseInitialized",self.user, avatarDetails);
            
            return avatarDetails;    
        }else
        {
            console.log("doc doesnot exist!!");
            if (window.self !== window.top) {
              window.parent.location.href =  "/avatar/index.html";
            } else {
               window.location.href = "/avatar/index.html";
            }
            //     var avatarDetails1 = 
            //     {
            //         genderData: 0,
            //         mhairData: 0,
            //         mtopData: 0,
            //         mskinColorData: 0,
            //         mhairColorData: 0,
            //         mbottomColorData: 0,
            //         mtop1ColorData: 0,
            //         mtop2ColorData: 0,
            //         mtop3ColorData: 0,
            //         mtop4ColorData: 0,
            //         fhairData: 0,
            //         ftopData: 0,
                    //flagData: -1,
            //         ftop1ColorData: 0,
            //         ftop2ColorData: 0,
            //         ftop3ColorData: 0,
            //         ftop4ColorData: 0,
            //         fskinColorData: 0,
            //         fhairColorData: 0,
            //         fbottomColorData: 0,
            //         glassesM:0,
            //         glassesF:0,
            //         beard:0,
            //     };
            // return avatarDetails1;    
            return false;
        }
      })
      //   .catch(function(err){
      //   console.log(err.message);
      //   return false;
      // })
    ;
    
};

Firebase.prototype.updateChatId = function(chatId)
{
  this.db.collection("users").doc(this.user.uid).update({
      chatId: chatId
  }).then(function(){
      console.log("updated chatuid!!");
  }).catch(function(err){
      console.log(err);   
  });
};

Firebase.prototype.getChatId = function(SuccessCallback, failureCallback)
{
  this.db.collection("users").doc(this.user.uid).get().then(function(doc){
      var data = doc.data();
      console.log("data :"+data);
      
      if(data)
      {
          if(data.chatId)
          {
              console.log("successs");
              SuccessCallback(data.chatId);
          }else
          {
              console.log("failure");
              failureCallback();
          }
      }
  }).catch(function(err){
      console.log(err);   
  });
};

//---------------------------------------------- realtimeFunction

Firebase.prototype.updateStatus = function ()
{
    this.chatStatus = false;
    var realDB = this.realDB;
    var disconnectRef;
    var userCheck = realDB.ref('userStatus/' + this.analyticsName);
    userCheck.update({
        state: 'online',
        lobbyStatus: 'online',
        name: this.currentUser.displayName,
        uid: this.currentUser.uid,
        email: this.currentUser.email,
        socketID: Network.id ? Network.id:'',
        lastChange: firebase.database.ServerValue.TIMESTAMP,
    }).then(()=>{
        disconnectRef = userCheck.onDisconnect();
           disconnectRef.update({
                state: 'offline',
                lobbyStatus: 'offline',
                lastChange: firebase.database.ServerValue.TIMESTAMP
        });
    });
};

Firebase.prototype.updateLobbyStatus = function (value)
{
    this.chatStatus = !value;
    var realDB = this.realDB;
    var disconnectRef;
    var userCheck = realDB.ref('userStatus/' + this.analyticsName);
    userCheck.update({
       lobbyStatus: value ? 'online':'offline',
        name: this.currentUser.displayName,
        uid: this.currentUser.uid,
        email: this.currentUser.email,
        socketID: Network.id ? Network.id:'',
    });
};

Firebase.prototype.addUserStatusListener = function(){
    var userStatusRef = this.realDB.ref('userStatus/');
    userStatusRef.on('value', (snapshot) => {
        var data = snapshot.val();
        this.app.fire('userStatusUpdate', data);
    });
};

//---------------------------add Live Chat functions
Firebase.prototype.addLiveChatListener = function(){
    var firstTime = true;
    var userLiveChatRef = this.db.collection('liveChat').doc(this.currentUser.email);
   
    userLiveChatRef.onSnapshot((doc) => {
        if(doc.exists){
            if(!firstTime){
                if(doc.data().acceptedRequest){
                    console.log(doc.data().acceptedRequest);
                    this.app.fire('enterChatRoom',doc.data().acceptedRequest);
                }else{
                    this.app.fire('enterChatRoom',null);
                }
            }else{
                if(doc.data().acceptedRequest){
                   this.rejectLiveChatRequest(doc.data().acceptedRequest); 
                }
            }
            if(doc.data().invitationSent !== null){
                    console.log(doc.data().acceptedRequest);
                    this.app.fire('blockLiveChat',doc.data().invitationSent);
                }else{
                    this.app.fire('removeLiveChatBlocker');
                }
            console.log("Current data: ", doc.data());  
            
            if(doc.data().invitationRecieved)
                this.app.fire('invitationDataRecived',doc.data().invitationRecieved);
        }else{
            console.log("seting user LiveChat data");
            userLiveChatRef.set({
                invitationSent: null,
                invitationRecieved: [],
                acceptedRequest: null,
                userData:{
                    name: this.currentUser.displayName,
                    uid: this.currentUser.uid,
                    email: this.currentUser.email,
                }
            });
        }
        firstTime = false;
    });
};

Firebase.prototype.sendLiveChatRequest = function(user){
    console.log(user.email, '<--- to');
    var userLiveChatRef = this.db.collection('liveChat').doc(user.email);
    var currentUserLiveChatRef = this.db.collection('liveChat').doc(this.currentUser.email);
    
    return this.db.runTransaction( (transaction) => {
            var toUserDoc = null;
            var fromUserDoc = null;
          return transaction.get(userLiveChatRef).then( (userDoc) => { 
              return transaction.get(currentUserLiveChatRef).then( (currentUserDoc) => {
                   transaction.update(currentUserLiveChatRef,{
                       invitationSent: {
                            name: user.name,
                            uid: user.uid,
                            email: user.email,
                       },
                       userData:{
                            name: this.currentUser.displayName,
                            uid: this.currentUser.uid,
                            email: this.currentUser.email,
                        }
                   });
                    if(userDoc.exists){
                             console.log(userDoc.data());
                             transaction.update(userLiveChatRef,{
                                   invitationRecieved: firebase.firestore.FieldValue.arrayUnion({
                                        name: this.currentUser.displayName,
                                        uid: this.currentUser.uid,
                                        email: this.currentUser.email,
                                    })
                              }); 
                        }else{
                         console.log('createing new ');
                             transaction.set(userLiveChatRef,{
                                 invitationSent: [],
                                invitationRecieved: [{
                                    name: this.currentUser.displayName,
                                    uid: this.currentUser.uid,
                                    email: this.currentUser.email,
                                }],
                                acceptedRequest: null,
                              }); 
                        }
                         console.log(currentUserDoc.data());
                    });
            });
         
    }).then(() => {
        console.log("Transaction successfully committed!");
    }).catch((error) => {
        console.log("Transaction failed: ", error);
    });
};


Firebase.prototype.acceptLiveChatRequest = function(user, callback){
    console.log(user.email, '<--- to');
    var userLiveChatRef = this.db.collection('liveChat').doc(user.email);
    var currentUserLiveChatRef = this.db.collection('liveChat').doc(this.currentUser.email);
        
    return this.db.runTransaction( (transaction) => {

          return transaction.get(userLiveChatRef).then( (userDoc) => { 
              return transaction.get(currentUserLiveChatRef).then( (currentUserDoc) => {
                   transaction.update(currentUserLiveChatRef,{
                       invitationSent: null,
                        invitationRecieved: [],
                        acceptedRequest: {name: user.name, email: user.email, uid: user.uid},
                   });
                  transaction.update(userLiveChatRef,{
                        invitationSent: null,
                        invitationRecieved: [],
                        acceptedRequest: {name: this.currentUser.displayName, email: this.currentUser.email, uid:this.currentUser.uid},
                  }); 
                });
            }).then(() => {
              if(callback){
                callback(null);  
              }
                console.log("Transaction successfully committed!");
            }).catch((error) => {
                if(callback){
                    callback(error);  
                  }
                console.log("Transaction failed: ", error);
            });
        });
};

Firebase.prototype.rejectLiveChatRequest = function(user, callback){
    console.log(user.email, '<--- to');
    var userLiveChatRef = this.db.collection('liveChat').doc(user.email);
    var currentUserLiveChatRef = this.db.collection('liveChat').doc(this.currentUser.email);
        
    return this.db.runTransaction( (transaction) => {

          return transaction.get(userLiveChatRef).then( (userDoc) => { 
              return transaction.get(currentUserLiveChatRef).then( (currentUserDoc) => {
                  var newInviationArray = currentUserDoc.data().invitationRecieved.filter(cuser => cuser.uid !== user.uid);
                  console.log(newInviationArray);
                   transaction.update(currentUserLiveChatRef,{
                       invitationSent: null,
                        invitationRecieved: newInviationArray,
                        acceptedRequest: null,
                   });
                  transaction.update(userLiveChatRef,{
                        invitationSent: null,
                        acceptedRequest: null,
                  }); 
                });
            }).then(() => {
              if(callback){
                   callback(null);  
              }
                console.log("Transaction successfully committed!");
            }).catch((error) => {
                if(callback){
                   callback(error);  
              }
                console.log("Transaction failed: ", error);
            });
        });
};

Firebase.prototype.cancelLiveChatRequest = function(user, callback){
    console.log(user.email, '<--- to');
    var userLiveChatRef = this.db.collection('liveChat').doc(user.email);
    var currentUserLiveChatRef = this.db.collection('liveChat').doc(this.currentUser.email);
        
    return this.db.runTransaction( (transaction) => {

          return transaction.get(userLiveChatRef).then( (userDoc) => { 
              return transaction.get(currentUserLiveChatRef).then( (currentUserDoc) => {
                  var newInviationArray = userDoc.data().invitationRecieved.filter(cuser => cuser.uid !== this.currentUser.uid);
                  console.log(newInviationArray);
                   transaction.update(userLiveChatRef,{
                        invitationRecieved: newInviationArray,
                        acceptedRequest: null,
                   });
                  transaction.update(currentUserLiveChatRef,{
                        invitationSent: null,
                  }); 
                });
            }).then(() => {
              if(callback){
                   callback(null);  
              }
                console.log("Transaction successfully committed!");
            }).catch((error) => {
                if(callback){
                   callback(error);  
              }
                console.log("Transaction failed: ", error);
            });
        });
};


    
                                  
                                  
                                  