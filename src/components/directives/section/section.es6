app.directive('sectionItem', (State, $state, Wall, Dialog, $timeout) => ({
    templateUrl: 'section.html',
    replace: true,
    scope: {
        id: '=',
        wall: '=',
        text: '=',
        color: '=',
        top: '=',
        left: '=',
        height: '=',
        width: '='
    },

    link(scope, element, attrs) {
        var $canvas = $('.wall-canvas');

        var position = {top: scope.top, left: scope.left, height: scope.height, width: scope.width};

        var click = {x: 0, y: 0};

        var setText = () => {
            saveSection();
        };

        var updateText = () => {
            updateSection();
        };

        var getStyle = () => ({
            'top': position.top,
            'left': position.left,
            'height': position.height,
            'width': position.width
        });

        var setColor = () => {
            Wall.changeColor(scope.color);
            scope.color = Wall.getColor();
            saveSection();
        };

        var getSection = () =>({
            _id: scope.id,
            color: scope.color,
            height: position.height,
            width: position.width,
            top: position.top,
            left: position.left,
            text: scope.text,
            wall: scope.wall
        });

        var removeSection = () => {
            console.log('removeSection', getSection());
            element.find('.section').addClass('deleted');
            socket.emit('remove-section', getSection());
        };

        var updateSection = () => {
            socket.emit('update-section', getSection());
        };

        var saveSection = () => {
            socket.emit('save-section', getSection());
        };

        var events = () => {
            socket.on('section-' + scope.id, (data) => {
                scope.color = data.color;
                position.top = data.top;
                position.left = data.left;
                position.height = data.height;
                position.width = data.width;
                scope.text = data.text;
                scope.$apply();
            });
        };

        var init = () => {
            events();
            element.find('.section').draggable({
                cancel: ".section-text, .section-title",
                start(event, ui) {
                    click.x = event.clientX;
                    click.y = event.clientY;
                    scope.$apply();
                    $canvas.addClass('dragged');
                },
                drag(event, ui) {
                    var original = ui.originalPosition;
                    ui.position = {
                        left: (event.clientX - click.x + original.left) / Wall.getScale(),
                        top: (event.clientY - click.y + original.top ) / Wall.getScale()
                    };

                    position = _.extend(position, ui.position);
                    updateSection();
                    scope.$apply();
                },
                stop(event, ui) {
                    saveSection();
                    scope.$apply();
                    $timeout(() => $canvas.removeClass('dragged'), 1);
                }
            }).resizable({
                start(event, ui) {
                    $canvas.addClass('dragged');
                },
                resize(event, ui) {
                    position.height = ui.size.height;
                    position.width = ui.size.width;
                    updateSection();
                    scope.$apply();
                },
                stop(event, ui) {
                    saveSection();
                    $timeout(() => $canvas.removeClass('dragged'), 1);
                }
            }).droppable({
                accept:".note",
                activeClass: "droppable",
                hoverClass: "dropping"
            });

            element.find('.section').removeClass('deleted')
        };

        init();

        scope = _.extend(scope, {
            removeSection,
            setColor,
            getPosition: () => position,
            getStyle,
            setText,
            updateText,
            getText: () => text
        });
    }
}));
