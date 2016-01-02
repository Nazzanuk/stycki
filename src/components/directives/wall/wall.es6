app.directive('wallItem', (State, $state, Wall, $timeout) => ({
    templateUrl: 'wall.html',
    replace: true,
    scope: {
        wall: "="
    },

    link(scope, element, attrs) {
        var $wall = element.find('.wall-zoom');
        var $canvas = element.find('.wall-canvas');

        var settingsActive = false;

        var click = {
            x: 0,
            y: 0
        };

        var multiplier = ($('.wall-canvas').height() / 2) -($('.wall-canvas').height() / 2) * Wall.getScale();

        var getOrigin = () => {
            var x = 0, y = 0;

            y = ($('.wall').height() / 2) + $('.wall-zoom').position().top * -1;
            x = ($('.wall').width() / 2) + $('.wall-zoom').position().left * -1;

            return `${x}px ${y}px`;
        };

        var init = () => {
            $wall.draggable({
                cancel: ".note",
                start: (event, ui) => {
                    console.log('start', event.clientX, event.clientY);
                    //multiplier = ($('.wall-canvas').height() / 2) -($('.wall-canvas').height() / 2) * Wall.getScale();
                    multiplier = 0;
                    click.x = event.clientX;
                    click.y = event.clientY;
                    console.log('event', event);
                    console.log('start', click.x, click.y);
                    $canvas.addClass('dragged');
                },
                drag(event, ui) {
                    var original = ui.originalPosition;
                    ui.position = {
                        left: (event.clientX - click.x + original.left),
                        top:  (event.clientY - click.y + original.top )
                    };
                    scope.$apply();
                    //console.log(ui.position.left, ui.position.top);
                },
                stop: (event, ui) => {
                    $timeout(() => $canvas.removeClass('dragged'), 1)
                    var original = ui.originalPosition;
                    ui.position = {
                        left: (event.clientX - click.x + original.left) / Wall.getScale(),
                        top:  (event.clientY - click.y + original.top ) / Wall.getScale()
                    };
                    scope.$apply();
                }
            });

            Wall.setWall(scope.wall);
        };

        init();

        scope = _.extend(scope, {
            getOrigin,
            showSettings:() => settingsActive,
            toggleSettings:() => settingsActive = !settingsActive,
            addNote: Wall.addNote,
            getNotes: Wall.getNotes,
            getScale: Wall.getScale,
            changeScale: Wall.changeScale
        });
    }
}));
