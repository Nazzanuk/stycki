var app = angular.module('app', ['ui.router'])
    .run(() => FastClick.attach(document.body));

app.directive('ngEnter', () => (scope, element, attrs) => {
    element.bind('keypress', (event) => {
        if (event.which !== 13) return;
        scope.$apply(() => scope.$eval(attrs.ngEnter, {$event: event}));
        event.preventDefault();
    });
});


var server =  window.location.host;
//var server ='https://stycki.herokuapp.com:5001';

var socket = io.connect(server);

socket.on('connect', () => console.log('connected!'));
socket.on('disconnect', () => console.log('disconnected!'));