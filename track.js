// Helper functions
// ----------------

// Generate a unique ID to refer to this specefic page load
function uuidGenerator() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(char) {
        var r, v;
        r = Math.random() * 16 | 0;
        v = char === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
};
_basset.uuid = uuidGenerator();

// Send data to server
function sendData() {
    console.log("Sending data:");
    console.log(JSON.stringify(_basset));
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "http://api.basset.io/track", true);
    xmlHttp.send(JSON.stringify(_basset));
    _basset = {uuid: _basset.uuid, apiKey: _basset.apiKey}; // reset object to avoid sending data twice
};

// Form listeners
function addFormListeners() {
	// TODO
	// var allForms;
	// for each form:
	//   add formChangeRecorder() to key typing event
	//   add sendData() to unfocus event

	// var submitButton;
	// add sendData() to submitbutton (put it in from of other function calls hooked up to the button)
};



// Functions for tracking
// ----------------------

// track context
function trackContext() {
    console.log("running trackContext!");
    _basset.context = {};
    _basset.context.url = window.location.href;
    _basset.context.referrer = document.referrer;
    sendData();
};

// track IP
function trackIp(){
    console.log("running trackIp!");
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            _basset.ip = JSON.parse(xmlHttp.responseText);
            sendData();
        }
    }
    xmlHttp.open("GET", "https://api.ipify.org?format=json", true);
    xmlHttp.send(JSON.stringify(_basset));
};

// track content
function trackContent() {
    console.log("running trackContent!");
    _basset.page = {};
    _basset.page.title = document.title;
    // This works, but way too many prices exists on most checkout pages
    //pricePattern = /\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})/g;
    //ignoreTagsPattern = /(<(?:script|style)[\s\S]*?<\/(?:script|style)>)/g;
    //_basset.page.price = html.replace(ignoreTagsPattern, "").match(pricePattern);
    sendData();
};

// track fingerprint
function trackFingerprint() {
    console.log("running trackFingerprint!");
    Fingerprint2.prototype.getAll = function(){
        var all = {};
        all.userAgent = this.userAgentKey([]);
        all.language = this.languageKey([]);
        all.colorDepth = this.colorDepthKey([]);
        all.screenResolution = this.screenResolutionKey([]);
        all.timezoneOffset = this.timezoneOffsetKey([]);
        all.sessionStorage = this.sessionStorageKey([]);
        all.localStorage = this.localStorageKey([]);
        all.indexedDb = this.indexedDbKey([]);
        all.addBehavior = this.addBehaviorKey([]);
        all.openDatabase = this.openDatabaseKey([]);
        all.cpuClass = this.cpuClassKey([]);
        all.platform = this.platformKey([]);
        all.doNotTrack = this.doNotTrackKey([]);
        all.plugins = this.pluginsKey([]);
        //all.canvas = this.canvasKey([]); left out for better performance
        //all.webgl = this.webglKey([]); left out for better performance
        all.adBlock = this.adBlockKey([]);
        all.hasLiedLanguages = this.hasLiedLanguagesKey([]);
        all.hasLiedResolution = this.hasLiedResolutionKey([]);
        all.hasLiedOs = this.hasLiedOsKey([]);
        all.hasLiedBrowser = this.hasLiedBrowserKey([]);
        all.touchSupport = this.touchSupportKey([]);
        // fonts are left out for better performance
        return all;
    }
    _basset.fingerprint = new Fingerprint2().getAll();
    sendData();
};



// Execute functions when the time is right
// ----------------------------------------

// Track context and ip right away
trackContext();
trackIp();

// Start fingerprint tracking when fingerprintjs2 is loaded
(function() {
    console.log("init fingerprint load");
    var d = document;
    var t = d.createElement('script');
    t.type = 'text/javascript';
    t.async = true;
    t.src = (d.location.protocol == 'https:'? 'https' : 'http') + '://cdn.jsdelivr.net/fingerprintjs2/0.7.1/fingerprint2.min.js';
    t.onload = function () {
        console.log("fingerprintjs2 loaded!");
        trackFingerprint();
    };
    var s = d.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(t, s);
})();

// Start content tracking and add listeners when page has loaded
(function() {
    console.log("init page load");
    var oldOnLoad = window.onload;
    window.onload = function () {
        console.log("page loaded!");
        if (typeof window.onload != 'function') {
            oldOnLoad();
        }
        addFormListeners();
        trackContent();
    };
})();