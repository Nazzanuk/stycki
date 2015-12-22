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
                    scope.wall.name = response;
                    socket.emit('save-wall', scope.wall);
                }
            })
        };

        var init = () => {
            events();
        };

        init();

        scope = _.extend(scope, {
            newDialog: Dialog.newDialog,
            getWallName
        });
    }
}));
