app.directive('noteItem', (State, $state, Wall, Dialog) => ({
    templateUrl: 'note.html',
    replace: true,
    scope: {
        id: '=',
        wall: '=',
        text: '=',
        color: '=',
        top: '=',
        left: '=',
        assignedUser: '=',
        link: '=',
        "zIndex": '='
    },

    link(scope, element, attrs) {

        var position = {top: scope.top, left: scope.left, "z-index": scope.zIndex},
            text = scope.text, assignedUser = scope.assignedUser, link = scope.link,
            rotation = _.random(-5, 5);

        var usersVisible = false, settingsVisible = false;

        var click = {x: 0, y: 0};

        var getTopZ = () => {
            var z = 1;

            $('.note').each(function () {
                if ($(this).css('z-index') * 1 >= z) {
                    z = ($(this).css('z-index') * 1) + 1;
                }
                console.log($(this).css('z-index'));
            });

            console.log("z", z);
            return z;
        };

        var setText = (event) => {
            text = element.find('.note-text').text().trim();
            saveNote();
        };

        var updateText = () => {
            updateNote();
        };

        var updateLink = () => {
            Dialog.newDialog({
                title: "Add Link",
                message: "Enter the link below, or leave empty to remove the link.",
                placeholder: "http://",
                default: "",
                callback: (response) => {
                    link = response;
                    updateNote();
                }
            })
        };

        var assignUser = (id) => {
            assignedUser = id;
            saveNote();
        };

        var getStyle = () => ({
            'top': position.top,
            'left': position.left,
            'z-index': position["z-index"]
        });

        var setColor = () => {
            Wall.changeColor(scope.color);
            scope.color = Wall.getColor();
            saveNote();
        };

        var getNote = () =>({
            _id: scope.id,
            color: scope.color,
            text: element.find('.note-text').text().trim(),
            'z-index': position["z-index"],
            top: position.top,
            left: position.left,
            wall: scope.wall,
            link,
            assignedUser
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
                position["z-index"] = data["z-index"];
                text = data.text;
                scope.$apply();
            });
        };

        var init = () => {
            events();
            element.find('.note').draggable({
                cancel: ".note-text",
                //stack: ".note",
                start(event, ui) {
                    console.log('start', event.clientX, event.clientY);
                    click.x = event.clientX;
                    click.y = event.clientY;
                    position['z-index'] = getTopZ();
                    scope.$apply();
                },
                drag(event, ui) {
                    console.log(event.clientX, event.clientY);
                    var original = ui.originalPosition;
                    ui.position = {
                        left: (event.clientX - click.x + original.left) / Wall.getScale(),
                        top: (event.clientY - click.y + original.top ) / Wall.getScale()
                    };


                    position = _.extend(position, ui.position);
                    updateNote();
                    scope.$apply();
                },
                stop(event, ui) {
                    position = _.extend(position, ui.position);
                    saveNote();
                    scope.$apply();
                }
            });

            element.find('.note-text').focus();
            element.find('.note').removeClass('deleted')
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
            hideContext: () => (usersVisible = false, settingsVisible = false),
            hello: () => assignedUser,
            getAssignedUser: () => _.find(Wall.getUsers(), {_id: assignedUser}, '*'),
            assignUser,
            getUsers: Wall.getUsers,
            showUsers: () => usersVisible = !usersVisible,
            usersVisible: () => usersVisible,
            showSettings: () => settingsVisible = !settingsVisible,
            settingsVisible: () => settingsVisible,
            getText: () => text,
            updateLink,
            getLink: () => link
        });
    }
}));
