app.directive('settingsItem', (State, $state, Wall, Dialog) => ({
    templateUrl: 'settings.html',
    replace: true,
    scope: {
        wall: '=',
        active: "="
    },

    link(scope, element, attrs) {

        var events = () => {

        };

        var getWallName = () => {
            Dialog.newDialog({
                title: "Change Wall Name",
                message: "Wall names must be lowercase with dashes, no spaces.",
                placeholder: "wall-name",
                default: scope.wall.name,
                callback: (response) => {
                    scope.wall.name = response.replace(/\s+/g, '-').toLowerCase();
                    socket.emit('save-wall', scope.wall);
                    socket.emit('get-walls', {});
                }
            })
        };

        var removeWall = () => {
            Dialog.newDialog({
                title: "Delete Wall",
                message: "Type 'delete' to remove this wall.",
                placeholder: "",
                default: "",
                callback: (response) => {
                    if (response == "delete") {
                        socket.emit('remove-wall', scope.wall);
                        socket.emit('get-walls', {});
                        $state.go('home');
                    }
                }
            })
        };

        var init = () => {
            events();
        };

        init();

        scope = _.extend(scope, {
            newDialog: Dialog.newDialog,
            getWallName,
            removeWall
        });
    }
}));
