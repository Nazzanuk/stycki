var app = angular.module('app', ['ui.router'])
    .run(() => FastClick.attach(document.body));

app.directive('ngEnter', () => (scope, element, attrs) => {
    element.bind('keypress', (event) => {
        if (event.which !== 13) return;
        scope.$apply(() => scope.$eval(attrs.ngEnter, {$event: event}));
        event.preventDefault();
    });
});


var server = 'http://localhost:5001';
//var server ='https://nameless-beyond-9248.herokuapp.com';

var socket = io.connect(server);

socket.on('connect', () => console.log('connected!'));
socket.on('disconnect', () => console.log('disconnected!'));