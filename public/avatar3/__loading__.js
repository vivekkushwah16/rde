pc.script.createLoadingScreen(function (app) {
    var showSplash = function () {
        // splash wrapper
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        document.body.appendChild(wrapper);
        
        wrapper.style.backgroundImage='url(https://storage.googleapis.com/djzs-bucket/NegotationAcademy/Textures/loaderBG_blurplus.jpg)';//
        wrapper.style.backgroundrepeat='no-repeat';
        wrapper.style.backgroundSize='cover';
        // splash
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);
        splash.style.display = 'none';

        
        var logo = document.createElement('img');
        logo.src = 'https://storage.googleapis.com/djzs-bucket/NegotationAcademy/Textures/ZS-logo-loading.png';//'https://storage.googleapis.com/virtual-event-273009.appspot.com/BroadExpo/Textures/eventLogo.png';//https://i.ibb.co/QHp4kRb/dj-logo-white.png';//https://s3-eu-west-1.amazonaws.com/static.playcanvas.com/images/play_text_252_white.png';//'https://www.digitaljalebi.com@digitaljalebi.com/TestVideos/dj-logo-white.png';//https://www.digitaljalebi.com/wp/wp-content/uploads/2018/06/dj-logo-03-1.png';
        splash.appendChild(logo);
        logo.onload = function () {
            splash.style.display = 'block';
        };

        var container = document.createElement('div');
        container.id = 'progress-bar-container';
        splash.appendChild(container);

        var bar = document.createElement('div');
        bar.id = 'progress-bar';
        container.appendChild(bar);

    };

    var hideSplash = function () {
        var splash = document.getElementById('application-splash-wrapper');
        splash.parentElement.removeChild(splash);
        if (typeof window.avatarLoadingDone !== "undefined")
            window.avatarLoadingDone();
    };

    var setProgress = function (value) {
        var bar = document.getElementById('progress-bar');
        if(bar) {
            value = Math.min(1, Math.max(0, value));
            bar.style.width = value * 100 + '%';
        }
    };

    var createCss = function () {
        var css = [
             'body {',
            '    background-color: #c4c4c4;',
            '}',

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
            '}',

            '#application-splash {',
            // '    position: absolute;',
            '    top: calc(50% - 28px);',
            '    width: 400px;',
            '    left: calc(50% - 200px);',
            '}',

            '#application-splash img {',
            '    width: 100%;',
            '}',

           '#progress-bar-container {',
            // '    margin: 20px auto 0 auto;',
            '    height: 5px;',
            '    width: 100%;',
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
            '}'
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
        
    app.on('preload:end', function () {
        app.off('preload:progress');
    });
    app.on('preload:progress', setProgress);
    app.on('start', hideSplash);
});