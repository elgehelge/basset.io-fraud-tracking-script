// Generate a unique ID to refer to this specefic page load
function uuidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4();
}
_basset.uuid = uuidGenerator();

// Helper functions
function sendData() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "www.api.basset.io/endpoint", true);
    xmlHttp.send(_basset);
}


// Fingerprinting
function detectFingerprint() {
	// TODO: Do browser fingerprinting here
	sendData();
}


// Content capturing
function capturePageContent() {
	// TODO: Track more page related stuff here
	_basset.page {};
	_basset.page.url = window.location.href;
	_basset.page.title = document.title
	sendData();
}

// Form listeners
function addFormListeners() {
	// TODO:
	// var allForms;
	// for each form:
	//   add formChangeRecorder() to key typing event
	//   add sendData() to unfocus event

	// var submitButton;
	// add sendData() to submitbutton (put it in from of other function calls hooked up to the button)
}


// Call what should be called immediatly, and hook it rest onto the window.onload event
detectFingerprint();
var oldOnLoad = window.onload;
if (typeof window.onload != 'function') {
    window.onload = func;
} else { // someone already hooked a function
    window.onload = function () {
        oldOnLoad();
        capturePageContent();
        addFormListeners();
    }
}
