app.directive('menuItem', (State, $state, User) => ({
    templateUrl: 'menu.html',
    replace:true,
    scope: {},

    link(scope, element, attrs) {
        var walls, shrink = false;

        var logout = () => {
            User.clearUser();
            $state.go('login');
        };

        var events = () => {
            socket.on('wall-list', (data) => {
                console.log(data);
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
            isWall:(wall_id) => wall_id == $state.params.id,
            shrinkMe: () => shrink = !shrink,
            isShrunk: () => shrink,
            logout
        });
    }
}));
