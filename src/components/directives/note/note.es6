app.directive('noteItem', (State, $state, Wall) => ({
    templateUrl: 'note.html',
    replace: true,
    scope: {
        id: '=',
        wall: '=',
        text: '=',
        color: '=',
        top: '=',
        left: '='
    },

    link(scope, element, attrs) {

        var position = {top: scope.top, left: scope.left}, text = scope.text,
            rotation = _.random(-5, 5);

        var setText = (event) => {
            text = element.find('.note').text().trim();
            saveNote();
        };

        var updateText = () => {
            //text = element.find('.note').text().trim();
            //console.log(element.find('.note').text().trim());
            updateNote();
        };

        var getStyle = () => ({
            'top': position.top,
            'left': position.left
        });

        var setColor = () => {
            Wall.changeColor(scope.color);
            scope.color = Wall.getColor();
            saveNote();
        };

        var getNote = () =>({
            _id: scope.id,
            color: scope.color,
            text:  element.find('.note').text().trim(),
            top: position.top,
            left: position.left,
            wall: scope.wall
        });

        var removeNote = () => {
            console.log('removeNote', getNote());
            element.find('.note').addClass('deleted');
            socket.emit('remove-note', getNote());
        };

        var updateNote = () => {
            socket.emit('update-note', getNote());
        };

        var saveNote = () => {
            socket.emit('save-note', getNote());
        };

        var events = () => {
            socket.on('note-' + scope.id, (data) => {
                scope.color = data.color;
                position.top = data.top;
                position.left = data.left;
                text = data.text;
                scope.$apply();
            });
        };

        var init = () => {
            events();
            element.find('.note').draggable({
                cancel: ".note-text",
                stack: ".note",
                drag(event, ui) {
                    position = ui.position;
                    updateNote();
                    scope.$apply();
                },
                stop(event, ui) {
                    position = ui.position;
                    saveNote();
                    scope.$apply();
                }
            });

            element.find('.note-text').focus();
        };

        init();

        scope = _.extend(scope, {
            removeNote,
            setColor,
            getPosition: () => position,
            getRotation: () => `transform:rotate(${rotation}deg);-webkit-transform:rotate(${rotation}deg);`,
            getStyle,
            setText,
            updateText,
            getText: () => text
        });
    }
}));
