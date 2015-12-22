app.directive('menuItem', (State, $state) => ({
    templateUrl: 'menu.html',
    replace:true,
    scope: {},

    link(scope, element, attrs) {
        var walls;

        var events = () => {
            socket.on('wall-list', (data) => {
                console.log(data)
                walls = data;
                scope.$apply();
            });
        };

        var init = () => {
            events();
            socket.emit('get-walls', {});
        };

        init();

        scope = _.extend(scope, {
            getWalls:() => walls,
            getScreen:() => $state.current.name,
            isScreen:(screen) => screen == $state.current.name,
            isWall:(wall) => wall == $state.params.name
        });
    }
}));
