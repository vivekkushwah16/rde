

pc.script.createLoadingScreen(function (app) {
  var showSplash = function () {
    // splash wrapper
    var wrapper = document.createElement('div');
    wrapper.id = 'application-splash-wrapper';
    document.body.appendChild(wrapper);

    wrapper.style.backgroundImage = 'url(https://storage.googleapis.com/djzs-bucket/NegotationAcademy/Textures/loaderBG_blurplus.jpg)';//
    wrapper.style.backgroundrepeat = 'no-repeat';
    wrapper.style.backgroundSize = 'cover';
    // splash
    var splash = document.createElement('div');
    splash.id = 'application-splash';
    wrapper.appendChild(splash);
    splash.style.display = 'none';

    //
    var logo = document.createElement('img');
    logo.src = 'https://storage.googleapis.com/djzs-bucket/NegotationAcademy/Textures/dj_zs_instructions_loading.png';
    //  logo.src = 'https://storage.googleapis.com/djzs-bucket/NegotationAcademy/Textures/ZS-logo-loading.png';//'https://storage.googleapis.com/virtual-event-273009.appspot.com/BroadExpo/Textures/eventLogo.png';//https://i.ibb.co/QHp4kRb/dj-logo-white.png';//https://s3-eu-west-1.amazonaws.com/static.playcanvas.com/images/play_text_252_white.png';//'https://www.digitaljalebi.com@digitaljalebi.com/TestVideos/dj-logo-white.png';//https://www.digitaljalebi.com/wp/wp-content/uploads/2018/06/dj-logo-03-1.png';
    logo.id = 'centerLogo';
    splash.appendChild(logo);
    logo.onload = function () {
      splash.style.display = 'block';
    };

    var continueBtn = document.createElement('img');
    continueBtn.src = '/assets/svg/continue.svg';
    continueBtn.id = 'continueBtn';
    wrapper.appendChild(continueBtn);
    continueBtn.style.display = "none";

    document.getElementById('application-canvas').style="top: 100% !important;";
    continueBtn.onclick = (() => {

      var splash = document.getElementById('application-splash-wrapper');
      splash.parentElement.removeChild(splash);

      if (typeof window.parent.loadingComplete !== "undefined")
        window.parent.loadingComplete();
      if (typeof window.lobbyLoadingDone !== "undefined")
        window.lobbyLoadingDone();
      if(typeof window.parent.tutorialStart !== "undefined")
        window.parent.tutorialStart();  
        document.getElementById('application-canvas').style="top: 0% !important;";
        window.localStorage.setItem("firstTimeContinueBtnClicked","true");
        window.localStorage.setItem("lobbySpawning","default");
    });

    var container = document.createElement('div');
    container.id = 'progress-bar-container';
    wrapper.appendChild(container);

    var bar = document.createElement('div');
    bar.id = 'progress-bar';
    container.appendChild(bar);

    // var zsLogo = document.createElement('img');
    // zsLogo.src = 'https://storage.googleapis.com/openbucketproject/ZS/Textures/ZS-logo1.png';
    // zsLogo.id = 'zsLogo';
    // splash.appendChild(zsLogo);

    var tutorialParent = document.createElement('div');
    tutorialParent.classList.add('loop-text');
    wrapper.appendChild(tutorialParent);

    var t1 = document.createElement('p');
    // t1.id = 'quotes1';
    // t1.classList.add('quotes');
    t1.innerHTML = "<b>Instruction:</b> Click on floor or use WASD keys to navigate.";
    tutorialParent.appendChild(t1);

    var t2 = document.createElement('p');
    // t2.id = 'quotes2';
    // t2.classList.add('quotes');
    t2.innerHTML = "<b>Instruction:</b> You can enter the Breakout, Plenary, and Negotiation Room through the side folded menu on the top left.";
    tutorialParent.appendChild(t2);

    var t3 = document.createElement('p');
    // t3.id = 'quotes3';
    // t3.classList.add('quotes');
    t3.innerHTML = "<b>Instruction:</b> To interact with a guest, click on their avatar.";
    tutorialParent.appendChild(t3);

  };
  var quoteIndex = 0;

  // var showNextQuote = function () {

  // };

  //     var quotes = $(".quotes");
  //     var quoteIndex = -1;

  //     var showNextQuote = function () {
  //             ++quoteIndex;
  //             quotes
  //               .eq(quoteIndex % quotes.length)
  //               .fadeIn(2000)
  //               .delay(2000)
  //               .fadeOut(2000, showNextQuote);
  //       };

  //       showNextQuote();

  var hideSplash = function () {
    if (window.localStorage.getItem("welcomeVO") == "true"){
      
      window.localStorage.setItem("libraryFirst","true");
      var continueBtn = document.getElementById("continueBtn");
      continueBtn.style.display = "block";
      var progressBar = document.getElementById('progress-bar-container');
      progressBar.style.display = "none";
    } else {
      var splash = document.getElementById('application-splash-wrapper');
      splash.parentElement.removeChild(splash);

      if (typeof window.parent.loadingComplete !== "undefined")
        window.parent.loadingComplete();
      if (typeof window.lobbyLoadingDone !== "undefined")
        window.lobbyLoadingDone();
        document.getElementById('application-canvas').style="top: 0% !important;";
    }
  };

  var setProgress = function (value) {
    var bar = document.getElementById('progress-bar');
    if (bar) {
      value = Math.min(1, Math.max(0, value));
      bar.style.width = value * 100 + '%';
    }
  };

  var createCss = function () {
    var css = [
      'body {',
      '    background-color: #283538;',
      '}',
      // '#zsLogo{height:5vh;width:9.04vh !important;padding-top:2vh}',
      // '.quotes {display: none;}',
      '#application-splash-wrapper {',
      '    position: absolute;',
      '    top: 0;',
      '    left: 0;',
      '    height: 100%;',
      '    width: 100%;',
      '    background-color: #283538;',
      '    display: flex;',
      '    justify-content: center;',
      '    align-items: center;',
      'flex-direction: column;',
      '}',
      '#continueBtn{cursor:pointer;opacity:0.9;}',
      '#continueBtn:hover{cursor:pointer;opacity:1 !important;}',
      '#application-splash {',
      // '    position: absolute;',
      // '    top: calc(50% - 28px);',
      // '    width: 400px;',
      // '    left: calc(50% - 200px);',
      'height: 70%;',
      'padding-bottom: 1rem;',
      '}',

      '#application-splash img {',
      'height: 100%;',
      '}',

      '#progress-bar-container {',
      // '    margin: 20px auto 0 auto;',
      '    height: 5px;',
      '    width: 30%;',
      '    background-color: white;',
      '}',

      '#progress-bar {',
      '    width: 0%;',
      '    height: 100%;',
      '    background-color: #DD782D;',
      '}',

      '@media (max-width: 480px) {',
      '    #application-splash {',
      '        width: 170px;',
      '        left: calc(50% - 85px);',
      '    }',
      '}',
      '.loop-text {',
      '   position: absolute;',
      '   bottom: calc(50% - 217px);',
      '   width: 65%;',
      '   height: 0rem;',//4rem
      '   overflow: hidden;',
      '   color: white;',
      '   display: flex;',
      '   justify-content: center;',
      '   align-items: center;',
      '   text-align:center',
      'opacity:0',
      'display:none;',
      '}',
      '.loop-text p {',
      '  position: absolute;',
      '  height: 30px;',
      '  opacity: 0;',
      '  transition: 0.25s ease-out;',
      '}',
      '.loop-text p.show {',
      'opacity: 1;',
      '  transition: 1.75s ease-out;',
      '}',
      '#centerLogo{transition:750ms}',
    ].join("\n");

    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    document.head.appendChild(style);
  };

  createCss();

  showSplash();

  let texts = document.querySelectorAll(".loop-text p");

  let prev = null;
  let animate = (curr, currIndex) => {
    let index = (currIndex + 1) % texts.length;

    if (prev) {
      prev.className = "";
    }
    curr.className = "show";
    prev = curr;

    setTimeout(() => {
      if (prev) {
        prev.className = "";
      }
      curr.className = "show";
      prev = curr;
      animate(texts[index], index);
    }, 3500);
  };

  animate(texts[0], 0);

  var x12 = 3;
  // var tempzz;
  // var tempInterval=setInterval(()=>{
  //     document.getElementById("centerLogo").style.opacity=0; 
  //     tempzz=setTimeout(()=>{
  //         document.getElementById("centerLogo").src="https://storage.googleapis.com/virtual-event-273009.appspot.com/ILEX/loadingPNG/loadz"+x12+".png";    
  //         document.getElementById("centerLogo").style.opacity=1; 
  //         x12++;
  //         if(x12>3)
  //             x12=2;
  //     },1000);
  // },5000);

  app.on('preload:end', function () {
    app.off('preload:progress');
  });
  app.on('preload:progress', setProgress);
  app.on('start', hideSplash);
});