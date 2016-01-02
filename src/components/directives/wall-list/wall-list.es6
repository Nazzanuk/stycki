app.directive('wallListItem', (State, $state, Wall, User) => ({
    templateUrl: 'wall-list.html',
    replace: true,
    scope: {},

    link(scope, element, attrs) {

        var walls = [];

        var addWall = () => {
            socket.emit('add-wall', {
                _id: State.gen_id(),
                name: User.getUser().name.toLowerCase().replace(" ", "") + "s-wall-" + (walls.length + 1),
                owner: User.getUser()._id,
                users: [User.getUser()._id],
                private:false
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
