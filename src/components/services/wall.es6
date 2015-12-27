app.factory('Wall', (State, $rootScope) => {
    var notes = [], color = 1, wall = {};

    var addNote = (event, top = 100, left = 50) => {

        var _id = State.gen_id();
        if (event.currentTarget.className != event.target.className) return;
        if ($(event.currentTarget).hasClass('dragged')) return;

        if ($(event.currentTarget).hasClass('wall-canvas')) {
            top = event.offsetY;
            left = event.offsetX;
        }

        notes.push({_id, color, top, left, wall: wall._id});
        socket.emit('add-note', {_id, color, top, left, wall: wall._id});
    };

    var setWall = (theWall) => {
        wall = theWall;
        notes = [];
        socket.emit('join-wall', wall._id);
    };

    var events = () => {
        socket.on('notes', (data) => {
            notes = data;
            $rootScope.$apply();
        });
    };

    var init = () => {
        events();
    };

    init();

    socket.on('connect', () => {
        console.log('rejoining...');
        socket.emit('join-wall', wall._id);
    });

    return {
        addNote,
        setWall,
        changeColor: (currentColor) => color = ++currentColor <= 5 ? currentColor : 1,
        getColor: () => color,
        getNotes: () => notes
    };
});
