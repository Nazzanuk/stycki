app.directive('wallListItem', (State, $state, Wall) => ({
    templateUrl: 'wall-list.html',
    replace: true,
    scope: {},

    link(scope, element, attrs) {

        var walls = [];

        var addWall = () => {
            socket.emit('add-wall', {
                _id: State.gen_id(),
                name: "my-wall",
                user: "nazzanuk@gmail.com"
            });
        };

        var events = () => {
            socket.on('wall-list', (data) => {
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
            getWalls: () => walls,
            addWall
        });
    }
}));
