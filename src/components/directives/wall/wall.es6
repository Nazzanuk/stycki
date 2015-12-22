app.directive('wallItem', (State, $state, Wall, $timeout) => ({
    templateUrl: 'wall.html',
    replace: true,
    scope: {
        wall: "="
    },

    link(scope, element, attrs) {
        var $canvas = element.find('.wall-canvas');

        var settingsActive = false;

        var init = () => {
            $canvas.draggable({
                cancel: ".note",
                start: (event, ui) => $canvas.addClass('dragged'),
                stop: (event, ui) => $timeout(() => $canvas.removeClass('dragged'), 1)
            });

            Wall.setWall(scope.wall);
        };

        init();

        scope = _.extend(scope, {
            showSettings:() => settingsActive,
            toggleSettings:() => settingsActive = !settingsActive,
            addNote: Wall.addNote,
            getNotes: Wall.getNotes
        });
    }
}));
