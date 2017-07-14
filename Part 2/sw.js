var dataCacheName = 'dataCache';
var cacheName = 'fileCache';
var filesToCache = [
 './',
 './index.html',
 './ang1.js',
 './uploadText.php'
];
self.addEventListener('install', function(e) {
 console.log('[ServiceWorker] Install');
 e.waitUntil(
 caches.open(cacheName).then(function(cache) {
 console.log('[ServiceWorker] Caching app shell');
 return cache.addAll(filesToCache);
 })
 );
});
self.addEventListener('activate', function(e) {
 console.log('[ServiceWorker] Activate');
 e.waitUntil(
 caches.keys().then(function(keyList) {
 return Promise.all(keyList.map(function(key) {
 if (key !== cacheName && key !== dataCacheName) {
 console.log('[ServiceWorker] Removing old cache', key);
 return caches.delete(key);
 }
 }));
 })
 );
 return self.clients.claim();
});
self.addEventListener('fetch', function(e) {
 console.log('[Service Worker] Fetch', e.request.url);
 e.respondWith( 
 caches.match(e.request).then(function(response) {
 return response || fetch(e.request);
 },
 function(response)
 {
 return response;
 }
 )
 );
});


self.addEventListener('sync', function(event){
	if(event.tag=="data-store")
	{
		event.waitUntil(getAllData().then(function(){
		self.registration.showNotification("PWA",{
		body: "Your message has been sent"
		}
		);	
		}))
	}
	
});



function getAllData()
{
	return new Promise(function(resolve, reject) {
	console.log("Upload");
	var request = self.indexedDB.open("db1",2);
	request.onerror = function(event) {
	  alert("Why didn't you allow my web app to use IndexedDB?!");
	  reject('Failure!');
	};
	request.onsuccess = function(event) {
	    db = event.target.result;

		var objectStore = db.transaction("messages","readwrite").objectStore("messages");

		objectStore.openCursor().onsuccess = function(event) {
		  var cursor = event.target.result;
		  var data=[];
		  if (cursor) {
			console.log('Cursor user: '+cursor.value.user);
			console.log('Cursor message: '+cursor.value.message);
			console.log('Cursor key: '+cursor.key);
		  data.push({user:cursor.value.user,message:cursor.value.message,date:cursor.value.date,time:cursor.value.time,id:cursor.key});
		    cursor.continue(); 
		  }
		  else {
			console.log("No more entries!");
		  }

		  var i=0;
		  
		  function sendFetch()
		  {
		  if(!data[i])
		  {
		  resolve('Success!');  
		  return
		  }
          var d= new Date();		  
    	  fetch('./uploadText.php?user='+data[i].user+'&message='+data[i].message+'&date='+data[i].date+'&time='+data[i].time+'&sent_date='+d.toLocaleDateString()+'&sent_time='+d.toLocaleTimeString(), {
          method: 'GET',
          headers: new Headers()
        }).then(function(response) {
         return response.text();			
        }).then(function(msg){
		console.log(msg);
		if(msg=="success")
		{
			var request = self.indexedDB.open("db1",2);
			request.onerror = function(event) {
			alert("Why didn't you allow my web app to use IndexedDB?!");
			reject('Failure!');
			};
		   request.onsuccess = function(event) {
	       db = event.target.result;
           db.transaction("messages","readwrite").objectStore("messages").delete(data[i].id);
		   i++;
		   sendFetch();
			};
		}		
		});	
		}
		sendFetch();
		
		};
		
		
	};
	});
}