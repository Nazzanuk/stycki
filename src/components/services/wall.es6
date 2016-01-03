app.factory('Wall', (State, $rootScope) => {
    var notes = [], sections = [], color = 1, wall = {}, scale = 1, users = [
        {
            _id:'guest',
            name:'Nathan',
            img:'/public/img/black-male-4.svg'
        },
        {
            _id:'12345',
            name:'Louis',
            img:'/public/img/white-male.svg'
        },
        {
            _id:'123456',
            name:'Mike',
            img:'/public/img/white-male-2.svg'
        },
        {
            _id:'sadsadsadcsas',
            name:'Mel',
            img:'/public/img/black-male-2.svg'
        },
        {
            _id:'sdnajfonojw',
            name:'Holly',
            img:'/public/img/white-female.svg'
        },
        {
            _id:'nsdjfnj',
            name:'Jas',
            img:'/public/img/asian-male.svg'
        },
        {
            _id:'ct7tgv8yy',
            name:'Nosh',
            img:'/public/img/asian-female.svg'
        }
    ];

    var addNote = (event, top = 100, left = 50) => {

        var _id = State.gen_id();
        console.log('hello', event)
        if (event.currentTarget.className != event.target.className) return;
        if ($(event.currentTarget).hasClass('dragged')) return;

        if ($(event.currentTarget).hasClass('wall-canvas')) {
            top = event.offsetY;
            left = event.offsetX;
        }

        notes.push({_id, color, top, left, wall: wall._id});
        socket.emit('add-note', {_id, color, top, left, wall: wall._id});
    };


    var addSection = (event, top = 100 + ($('.wall-zoom').position().top * -1), left = (50 + $('.wall-zoom').position().left * -1)) => {

        console.log('new section', top, left);

        var _id = State.gen_id();
        console.log('hello', event);
        if (event.currentTarget.className != event.target.className) return;
        if ($(event.currentTarget).hasClass('dragged')) return;

        if ($(event.currentTarget).hasClass('wall-canvas')) {
            top = event.offsetY;
            left = event.offsetX;
        }

        var section = {_id, color, top, left, wall: wall._id, text:"Section"};

        sections.push(section);
        socket.emit('add-section', section);
    };

    var setWall = (theWall) => {
        scale = 1;
        wall = theWall;
        notes = [];
        sections = [];
        socket.emit('join-wall', wall._id);
    };

    var events = () => {
        socket.on('notes', (data) => {
            notes = data;
            $rootScope.$apply();
        });

        socket.on('sections', (data) => {
            sections = data;
            $rootScope.$apply();
        });
    };

    var init = () => {
        events();

        socket.on('connect', () => {
            if (wall._id == undefined) return;
            console.log('rejoining...');
            socket.emit('join-wall', wall._id);
        });
    };

    init();

    return {
        getScale: () => scale,
        changeScale: (amount) => scale += amount,
        addNote,
        addSection,
        setWall,
        changeColor: (currentColor) => color = ++currentColor <= 5 ? currentColor : 1,
        getColor: () => color,
        getNotes: () => notes,
        getSections: () => sections,
        getUsers: () => users
    };
});
