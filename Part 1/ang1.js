var app = angular.module(‘myApp’, []);
 
app.controller(‘myCtrl’, function($scope,$http,$q,$document) {
});

if (‘serviceWorker’ in navigator) {
 console.log(‘Reached 1’)
 $(document).ready(function() {
 console.log(‘Reached 2’)
 console.log();
 navigator.serviceWorker.register(‘/sw.js’)
 .then(registration => navigator.serviceWorker.ready)
 .then(registration => {
 console.log(‘Reached 4’)
 })
 .catch(err => {
 console.log(“Reg failed!”)
 });
 });
}