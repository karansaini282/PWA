var app = angular.module('myApp', []);
 
app.controller('myCtrl', function($scope,$http,$q,$document) {
});

if ('serviceWorker' in navigator) {
 console.log('Reached 1')
 $(document).ready(function() {
 console.log('Reached 2')
 console.log();
 navigator.serviceWorker.register('./sw.js')
 .then(registration => navigator.serviceWorker.ready)
 .then(registration => {
 console.log('Reached 4')
 		
    Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
});
	document.getElementById('formSubmit').addEventListener('click', () => {
      saveMarkdownLocally().then(() => {
        registration.sync.register('data-store');
		console.log("Done reg!")
      }).catch(err => console.log("Error submitting markdown: ", err));
    });
 })
 .catch(err => {
 console.log("Reg failed!")
 });
 });
}

function saveMarkdownLocally(){
	return new Promise(function(resolve, reject) {
	
	var d= new Date();
	
    var sendData = {
      user: document.getElementById('messages.user').value,
      message: document.getElementById('messages.message').value,
	  time: d.toLocaleTimeString(),
	  date: d.toLocaleDateString()
    };
	
	console.log(sendData);
	
	var request = window.indexedDB.open("db1",2);
	request.onerror = function(event) {
	  alert("Why didn't you allow my web app to use IndexedDB?!");
	  reject('Failure!');
	};
	request.onsuccess = function(event) {
	    db = event.target.result;
		db.transaction("messages", "readwrite").objectStore("messages").add(sendData);
		var scope = angular.element(document.getElementById('messages.user')).scope();
		scope.$apply(function(){
		scope.messages.user='';
		scope.messages.message='';
		resolve('Success!');
	  });
    };
	request.onupgradeneeded = function(event) {
	    
		db = event.target.result;
	    		
		
		var objectStore2 = db.createObjectStore("messages",{ autoIncrement : true,keyPath: "id" });
		objectStore2.createIndex("user", "user", { unique: false });
		objectStore2.createIndex("message", "message", { unique: false });
		objectStore2.createIndex("date", "date", { unique: false });
		objectStore2.createIndex("time", "time", { unique: false });
		objectStore2.transaction.oncomplete = function(event) {
	  };
	};
    });		 
} 