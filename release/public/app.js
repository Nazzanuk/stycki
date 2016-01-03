'use strict';

var app = angular.module('app', ['ui.router']).run(function () {
    return FastClick.attach(document.body);
});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind('keypress', function (event) {
            if (event.which !== 13) return;
            scope.$apply(function () {
                return scope.$eval(attrs.ngEnter, { $event: event });
            });
            event.preventDefault();
        });
    };
});

String.prototype.hashCode = function () {
    var hash = 0,
        i,
        chr,
        len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

var server = window.location.host;
//var server ='https://stycki.herokuapp.com:5001';

var socket = io.connect(server);

socket.on('connect', function () {
    return console.log('connected!');
});
socket.on('disconnect', function () {
    return console.log('disconnected!');
});
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    var resolve = {
        timeout: function timeout($timeout) {
            $('[screen]').removeClass('active');
            //$('.loading-logo').addClass('active');
            return $timeout(300);
        }
    };

    // For any unmatched url, redirect to /
    $urlRouterProvider.otherwise("/");

    // Now set up the states
    $stateProvider.state('login', {
        url: "/",
        templateUrl: "login-screen.html",
        controller: "LoginScreen",
        resolve: resolve
    }).state('register', {
        url: "/register",
        templateUrl: "register-screen.html",
        controller: "RegisterScreen",
        resolve: resolve
    }).state('home', {
        url: "/home",
        templateUrl: "home-screen.html",
        controller: "HomeScreen",
        resolve: resolve
    }).state('wall', {
        url: "/wall/:id/:name",
        templateUrl: "wall-screen.html",
        controller: "WallScreen",
        resolve: resolve
    });

    //$locationProvider.html5Mode(true);
});
app.controller('ScreenCtrl', function ($element, $timeout, State, $state) {

    var init = function init() {
        $timeout(function () {
            return $element.find('[screen]').addClass('active');
        }, 50);
    };

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $(document).scrollTop(0);
    });

    init();
});

'use strict';

app.factory('Alert', function ($timeout, $rootScope) {

    //var active = false,
    //    message = false,
    //    colour = "",
    //    timeout;
    //
    //var showSuccess = (msg) => {
    //    showError(msg);
    //    colour = "";
    //};
    //
    //var showMessage = (msg) => {
    //    showError(msg);
    //    colour = "primary";
    //};
    //
    //var showError = (msg) => {
    //    colour = "red";
    //    setActive(true);
    //    message = msg;
    //    $timeout.cancel(timeout);
    //    timeout = $timeout(() => setActive(false), 5000);
    //};
    //
    //var getColour = () => {
    //    return colour;
    //};
    //
    //var getMessage = () => {
    //    return message;
    //};
    //
    //var getActive = () => {
    //    return active;
    //};
    //
    //var setActive = (flag) => {
    //    active = flag;
    //};
    //
    //var switchActive = () => {
    //    active = !active;
    //};
    //
    //var init = () => {
    //
    //};
    //
    //init();
    //
    //$rootScope.Alert = {
    //    showMessage: showMessage,
    //    showError: showError
    //};
    //
    //return {
    //    showMessage: showMessage,
    //    showError: showError,
    //    getMessage: getMessage,
    //    getColour: getColour,
    //    getActive: getActive,
    //    setActive: setActive,
    //    showSuccess: showSuccess,
    //    switchActive: switchActive
    //};
});
'use strict';

app.factory('API', function ($rootScope, $http) {

    var API_URL = "/api/";

    var login = function login(object) {
        return $http.get(API_URL + "login/", {
            params: object,
            headers: { 'Cache-Control': 'no-cache' }
        }).then(function (response) {
            return response.data;
        });
    };

    var getHome = function getHome() {
        return $http.get(API_URL + 'home').then(function (response) {
            return response.data;
        });
    };

    var getPost = function getPost(id) {
        return $http.get(API_URL + 'post/' + id).then(function (response) {
            return response.data;
        });
    };

    var getPosts = function getPosts() {
        return $http.get(API_URL + 'posts/').then(function (response) {
            return response.data;
        });
    };

    var getRandomPosts = function getRandomPosts() {
        return $http.get(API_URL + 'posts/orderby/rand').then(function (response) {
            return response.data;
        });
    };

    var getPostsByCat = function getPostsByCat(cat) {
        return $http.get(API_URL + 'posts/cat/' + cat).then(function (response) {
            return response.data;
        });
    };

    var getPostsByTag = function getPostsByTag(tag) {
        return $http.get(API_URL + 'posts/tag/' + tag).then(function (response) {
            return response.data;
        });
    };

    var getCollections = function getCollections() {
        return $http.get('' + API_URL, { headers: { 'Cache-Control': 'no-cache' } }).then(function (response) {
            return _.drop(response.data);
        });
    };

    var getCollection = function getCollection(collection) {
        return $http.get('' + API_URL + collection, { headers: { 'Cache-Control': 'no-cache' } }).then(function (response) {
            return response.data;
        });
    };

    var getDocument = function getDocument(collection, data) {
        return $http.get('' + API_URL + collection, { params: data, headers: { 'Cache-Control': 'no-cache' } }).then(function (response) {
            console.log(response.data[0]);
            return response.data[0];
        });
    };

    var insertDocument = function insertDocument(collection, data) {
        return $http.post('' + API_URL + collection, data).then(function (response) {
            return response.data;
        });
    };

    var updateDocument = function updateDocument(collection, id, data) {
        return $http.put('' + API_URL + collection + '/_id/' + id, data).then(function (response) {
            return response.data;
        });
    };

    return {
        login: login,
        getHome: getHome,
        getPost: getPost,
        getPosts: getPosts,
        getRandomPosts: getRandomPosts,
        getPostsByCat: getPostsByCat,
        getPostsByTag: getPostsByTag,
        getCollections: getCollections,
        getCollection: getCollection,
        getDocument: getDocument,
        insertDocument: insertDocument,
        updateDocument: updateDocument
    };
});
app.factory('Dialog', function ($timeout, $rootScope) {

    var content = {},
        active = false;
    content['default'] = "";
    content.callback = function () {};

    var closeDialog = function closeDialog() {
        active = false;
    };

    var newDialog = function newDialog(data) {
        content = _.extend(content, data);
        active = true;
    };

    var submit = function submit(response) {
        console.log('submitted', response);
        content.callback(response);
        active = false;
    };

    var init = function init() {};

    init();

    return {
        getMessage: function getMessage() {
            return content.message;
        },
        getTitle: function getTitle() {
            return content.title;
        },
        getPlaceholder: function getPlaceholder() {
            return content.placeholder;
        },
        content: content,
        submit: submit,
        isActive: function isActive() {
            return active;
        },
        newDialog: newDialog,
        closeDialog: closeDialog
    };
});
app.factory('State', function ($rootScope, $sce, $state, $timeout, User) {

    var title = 'Content Types',
        _showSplash = true,
        _showUnder = true,
        _showAvatars = false;

    var gen_id = function gen_id() {
        var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return Array(10).join().split(',').map(function () {
            return s.charAt(Math.floor(Math.random() * s.length));
        }).join('');
    };

    var events = function events() {
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $(document).scrollTop(0);

            if (!User.getUser()._id) if (toState.name != "register" && toState.name != "login") {
                $state.go('login');
                return;
            }

            if (User.getUser()._id) if (toState.name == "register" || toState.name == "login") {
                $state.go('home');
                return;
            }
            _showUnder = toState.name == "register" || toState.name == "login";
        });
    };

    var init = function init() {
        events();

        $timeout(function () {
            return _showSplash = false;
        }, 1000);
    };

    init();

    _.extend($rootScope, {
        html: function html() {
            return $sce.trustAsHtml;
        },
        showSplash: function showSplash() {
            return _showSplash;
        },
        showUnder: function showUnder() {
            return _showUnder;
        }
    });

    return {
        isMenuVisible: '',
        toggleMenu: '',
        showAvatars: function showAvatars() {
            return _showAvatars = true;
        },
        hideAvatars: function hideAvatars() {
            return _showAvatars = false;
        },
        avatarsVisible: function avatarsVisible() {
            return _showAvatars;
        },
        setTitle: function setTitle(text) {
            return title = text;
        },
        getTitle: function getTitle() {
            return title;
        },
        gen_id: gen_id
    };
});
app.factory('User', function ($rootScope, $sce, $state, $timeout) {

    var user = {
        _id: localStorage.getItem('email'),
        name: localStorage.getItem('name'),
        email: localStorage.getItem('email'),
        img: localStorage.getItem('img')
    };

    var setGuest = function setGuest() {
        user = {
            _id: 'guest',
            name: 'Guest'
        };
    };

    var clearUser = function clearUser() {
        user = {
            _id: '',
            name: ''
        };
        localStorage.clear();
    };

    var checkUser = function checkUser(userDetails) {
        console.log(userDetails);
        userDetails.password += "saltMe";
        userDetails.password = userDetails.password.hashCode();
        userDetails = _.extend(userDetails, { _id: userDetails.email });
        socket.emit('check-user', userDetails);
    };

    var registerUser = function registerUser(userDetails) {
        userDetails.password += "saltMe";
        userDetails.password = userDetails.password.hashCode();
        user = _.extend(user, userDetails);
        user = _.extend(user, { _id: userDetails.email });
        socket.emit('add-user', user);
    };

    var updateUser = function updateUser(userDetails) {
        user = _.extend(user, userDetails);
        localStorage.setItem('img', userDetails.img);
        socket.emit('update-user', userDetails);
    };

    var events = function events() {
        socket.on('valid-user', function (data) {
            console.log('valid-user', data);
            if (!data) return;
            user = data;
            $rootScope.$apply();
            $state.go('home');
            localStorage.setItem('email', data.email);
            localStorage.setItem('name', data.name);
            localStorage.setItem('img', data.img);
        });
    };

    var init = function init() {
        events();
    };

    init();

    return {
        registerUser: registerUser,
        clearUser: clearUser,
        setGuest: setGuest,
        checkUser: checkUser,
        updateUser: updateUser,
        getUser: function getUser() {
            return user;
        }
    };
});
app.factory('Wall', function (State, $rootScope) {
    var notes = [],
        sections = [],
        color = 1,
        wall = {},
        scale = 1,
        users = [{
        _id: 'guest',
        name: 'Nathan',
        img: '/public/img/black-male-4.svg'
    }, {
        _id: '12345',
        name: 'Louis',
        img: '/public/img/white-male.svg'
    }, {
        _id: '123456',
        name: 'Mike',
        img: '/public/img/white-male-2.svg'
    }, {
        _id: 'sadsadsadcsas',
        name: 'Mel',
        img: '/public/img/black-male-2.svg'
    }, {
        _id: 'sdnajfonojw',
        name: 'Holly',
        img: '/public/img/white-female.svg'
    }, {
        _id: 'nsdjfnj',
        name: 'Jas',
        img: '/public/img/asian-male.svg'
    }, {
        _id: 'ct7tgv8yy',
        name: 'Nosh',
        img: '/public/img/asian-female.svg'
    }];

    var addNote = function addNote(event) {
        var top = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
        var left = arguments.length <= 2 || arguments[2] === undefined ? 50 : arguments[2];

        var _id = State.gen_id();
        console.log('hello', event);
        if (event.currentTarget.className != event.target.className) return;
        if ($(event.currentTarget).hasClass('dragged')) return;

        if ($(event.currentTarget).hasClass('wall-canvas')) {
            top = event.offsetY;
            left = event.offsetX;
        }

        notes.push({ _id: _id, color: color, top: top, left: left, wall: wall._id });
        socket.emit('add-note', { _id: _id, color: color, top: top, left: left, wall: wall._id });
    };

    var addSection = function addSection(event) {
        var top = arguments.length <= 1 || arguments[1] === undefined ? 100 + $('.wall-zoom').position().top * -1 : arguments[1];
        var left = arguments.length <= 2 || arguments[2] === undefined ? 50 + $('.wall-zoom').position().left * -1 : arguments[2];

        console.log('new section', top, left);

        var _id = State.gen_id();
        console.log('hello', event);
        if (event.currentTarget.className != event.target.className) return;
        if ($(event.currentTarget).hasClass('dragged')) return;

        if ($(event.currentTarget).hasClass('wall-canvas')) {
            top = event.offsetY;
            left = event.offsetX;
        }

        var section = { _id: _id, color: color, top: top, left: left, wall: wall._id, text: "Section" };

        sections.push(section);
        socket.emit('add-section', section);
    };

    var setWall = function setWall(theWall) {
        scale = 1;
        wall = theWall;
        notes = [];
        sections = [];
        socket.emit('join-wall', wall._id);
    };

    var events = function events() {
        socket.on('notes', function (data) {
            notes = data;
            $rootScope.$apply();
        });

        socket.on('sections', function (data) {
            sections = data;
            $rootScope.$apply();
        });
    };

    var init = function init() {
        events();

        socket.on('connect', function () {
            if (wall._id == undefined) return;
            console.log('rejoining...');
            socket.emit('join-wall', wall._id);
        });
    };

    init();

    return {
        getScale: function getScale() {
            return scale;
        },
        changeScale: function changeScale(amount) {
            return scale += amount;
        },
        addNote: addNote,
        addSection: addSection,
        setWall: setWall,
        changeColor: function changeColor(currentColor) {
            return color = ++currentColor <= 5 ? currentColor : 1;
        },
        getColor: function getColor() {
            return color;
        },
        getNotes: function getNotes() {
            return notes;
        },
        getSections: function getSections() {
            return sections;
        },
        getUsers: function getUsers() {
            return users;
        }
    };
});

app.directive('dialogItem', function (State, $state, Wall, Dialog) {
    return {
        templateUrl: 'dialog.html',
        replace: true,
        scope: {},

        link: function link(scope, element, attrs) {

            var events = function events() {};

            var init = function init() {
                events();
            };

            init();

            scope = _.extend(scope, {
                getMessage: Dialog.getMessage,
                getTitle: Dialog.getTitle,
                submit: Dialog.submit,
                isActive: Dialog.isActive,
                getPlaceholder: Dialog.getPlaceholder,
                content: Dialog.content,
                closeDialog: Dialog.closeDialog,
                newDialog: Dialog.newDialog
            });
        }
    };
});

app.directive('headerItem', function (State, $state, User) {
    return {
        templateUrl: 'header.html',
        replace: true,
        scope: {},

        link: function link(scope, element, attrs) {

            var menuVisible = true,
                currentscroll = 0;

            var checkScroll = function checkScroll() {
                menuVisible = $(window).scrollTop() <= currentscroll;
                currentscroll = $(window).scrollTop();
                scope.$digest();
            };

            var events = function events() {
                $(window).on('scroll', checkScroll);
            };

            var init = function init() {
                events();
            };

            init();

            scope = _.extend(scope, {
                isActive: function isActive(page) {
                    return page == $state.current.name;
                },
                isMenuVisible: function isMenuVisible() {
                    return menuVisible;
                },
                toggleMenu: State.toggleMenu,
                getTitle: State.getTitle,
                showAvatars: State.showAvatars,
                getUser: User.getUser
            });
        }
    };
});

app.directive('menuItem', function (State, $state, User) {
    return {
        templateUrl: 'menu.html',
        replace: true,
        scope: {},

        link: function link(scope, element, attrs) {
            var walls,
                shrink = false;

            var logout = function logout() {
                User.clearUser();
                $state.go('login');
            };

            var events = function events() {
                socket.on('wall-list', function (data) {
                    console.log(data);
                    walls = data;
                    scope.$apply();
                });
            };

            var init = function init() {
                events();
                socket.emit('get-walls', {});
            };

            init();

            scope = _.extend(scope, {
                getWalls: function getWalls() {
                    return walls;
                },
                getScreen: function getScreen() {
                    return $state.current.name;
                },
                isScreen: function isScreen(screen) {
                    return screen == $state.current.name;
                },
                isWall: function isWall(wall_id) {
                    return wall_id == $state.params.id;
                },
                shrinkMe: function shrinkMe() {
                    return shrink = !shrink;
                },
                isShrunk: function isShrunk() {
                    return shrink;
                },
                logout: logout
            });
        }
    };
});

app.directive('loginItem', function (State, $state, $timeout, User, $rootScope) {
    return {
        templateUrl: 'login.html',
        replace: true,
        scope: {},

        link: function link(scope, element, attrs) {
            var _errorMessage = "";

            var setGuest = function setGuest() {
                User.setGuest();
                $state.go('home');
            };

            var events = function events() {
                socket.on('invalid-login', function () {
                    console.log('invalid-login');
                    _errorMessage = "The email and / or password is incorrect";
                    $rootScope.$apply();
                });
            };

            var init = function init() {
                events();
                scope.email = localStorage.getItem('email');
            };

            init();

            scope = _.extend(scope, {
                setGuest: setGuest,
                checkUser: User.checkUser,
                errorMessage: function errorMessage() {
                    return _errorMessage;
                },
                clearError: function clearError() {
                    return _errorMessage = "";
                }
            });
        }
    };
});

app.directive('noteItem', function (State, $state, Wall, Dialog, $timeout) {
    return {
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

        link: function link(scope, element, attrs) {
            var $canvas = $('.wall-canvas');

            var position = { top: scope.top, left: scope.left, "z-index": scope.zIndex },
                text = scope.text,
                assignedUser = scope.assignedUser,
                link = scope.link,
                rotation = _.random(-5, 5);

            var _usersVisible = false,
                _settingsVisible = false;

            var click = { x: 0, y: 0 };

            var getTopZ = function getTopZ() {
                var z = 1;

                $('.note').each(function () {
                    if ($(this).css('z-index') * 1 >= z) {
                        z = $(this).css('z-index') * 1 + 1;
                    }
                    console.log($(this).css('z-index'));
                });

                console.log("z", z);
                return z;
            };

            var setText = function setText(event) {
                text = element.find('.note-text').text().trim();
                saveNote();
            };

            var updateText = function updateText() {
                updateNote();
            };

            var updateLink = function updateLink() {
                Dialog.newDialog({
                    title: "Add Link",
                    message: "Enter the link below, or leave empty to remove the link.",
                    placeholder: "http://",
                    'default': "",
                    callback: function callback(response) {
                        link = response;
                        updateNote();
                    }
                });
            };

            var assignUser = function assignUser(id) {
                assignedUser = id;
                saveNote();
            };

            var getStyle = function getStyle() {
                return {
                    'top': position.top,
                    'left': position.left,
                    'z-index': position["z-index"]
                };
            };

            var setColor = function setColor() {
                Wall.changeColor(scope.color);
                scope.color = Wall.getColor();
                saveNote();
            };

            var getNote = function getNote() {
                return {
                    _id: scope.id,
                    color: scope.color,
                    text: element.find('.note-text').text().trim(),
                    'z-index': position["z-index"],
                    top: position.top,
                    left: position.left,
                    wall: scope.wall,
                    link: link,
                    assignedUser: assignedUser
                };
            };

            var removeNote = function removeNote() {
                console.log('removeNote', getNote());
                element.find('.note').addClass('deleted');
                socket.emit('remove-note', getNote());
            };

            var updateNote = function updateNote() {
                socket.emit('update-note', getNote());
            };

            var saveNote = function saveNote() {
                socket.emit('save-note', getNote());
            };

            var events = function events() {
                socket.on('note-' + scope.id, function (data) {
                    scope.color = data.color;
                    position.top = data.top;
                    position.left = data.left;
                    position["z-index"] = data["z-index"];
                    text = data.text;
                    scope.$apply();
                });
            };

            var init = function init() {
                events();
                element.find('.note').draggable({
                    cancel: ".note-text",
                    //stack: ".note",
                    start: function start(event, ui) {
                        console.log('start', event.clientX, event.clientY);
                        click.x = event.clientX;
                        click.y = event.clientY;
                        position['z-index'] = getTopZ();
                        scope.$apply();
                        $canvas.addClass('dragged');
                    },
                    drag: function drag(event, ui) {
                        console.log(event.clientX, event.clientY);
                        var original = ui.originalPosition;
                        ui.position = {
                            left: (event.clientX - click.x + original.left) / Wall.getScale(),
                            top: (event.clientY - click.y + original.top) / Wall.getScale()
                        };

                        position = _.extend(position, ui.position);
                        updateNote();
                        scope.$apply();
                    },
                    stop: function stop(event, ui) {
                        position = _.extend(position, ui.position);
                        saveNote();
                        scope.$apply();
                        $timeout(function () {
                            return $canvas.removeClass('dragged');
                        }, 1);
                    }
                });

                element.find('.note-text').focus();
                element.find('.note').removeClass('deleted');
            };

            init();

            scope = _.extend(scope, {
                removeNote: removeNote,
                setColor: setColor,
                getPosition: function getPosition() {
                    return position;
                },
                getRotation: function getRotation() {
                    return 'transform:rotate(' + rotation + 'deg);-webkit-transform:rotate(' + rotation + 'deg);';
                },
                getStyle: getStyle,
                setText: setText,
                updateText: updateText,
                hideContext: function hideContext() {
                    return _usersVisible = false, _settingsVisible = false;
                },
                hello: function hello() {
                    return assignedUser;
                },
                getAssignedUser: function getAssignedUser() {
                    return _.find(Wall.getUsers(), { _id: assignedUser }, '*');
                },
                assignUser: assignUser,
                getUsers: Wall.getUsers,
                showUsers: function showUsers() {
                    return _usersVisible = !_usersVisible;
                },
                usersVisible: function usersVisible() {
                    return _usersVisible;
                },
                showSettings: function showSettings() {
                    return _settingsVisible = !_settingsVisible;
                },
                settingsVisible: function settingsVisible() {
                    return _settingsVisible;
                },
                getText: function getText() {
                    return text;
                },
                updateLink: updateLink,
                getLink: function getLink() {
                    return link;
                }
            });
        }
    };
});

app.directive('profilePicItem', function (State, $state, User) {
    return {
        templateUrl: 'profile-pic.html',
        replace: true,
        scope: {},

        link: function link(scope, element, attrs) {

            var visible = true;

            var avatars = [
            //'/public/img/black-male.svg',
            '/public/img/black-male-2.svg', '/public/img/black-male-3.svg', '/public/img/black-male-4.svg', '/public/img/asian-male.svg', '/public/img/white-male.svg', '/public/img/white-male-2.svg', '/public/img/white-male-3.svg', '/public/img/black-female.svg', '/public/img/asian-female.svg', '/public/img/asian-female-2.svg', '/public/img/white-female.svg', '/public/img/white-female-2.svg', '/public/img/white-female-3.svg', '/public/img/white-female-4.svg'];

            var selectAvatar = function selectAvatar(img) {
                User.updateUser({ img: img });
            };

            var events = function events() {};

            var init = function init() {
                events();
            };

            init();

            scope = _.extend(scope, {
                close: State.hideAvatars,
                selectAvatar: selectAvatar,
                getAvatars: function getAvatars() {
                    return avatars;
                },
                isVisible: State.avatarsVisible
            });
        }
    };
});

app.directive('registerItem', function (State, $state, $timeout, User, $rootScope) {
    return {
        templateUrl: 'register.html',
        replace: true,
        scope: {},

        link: function link(scope, element, attrs) {

            var _errorMessage2 = "";

            var validate = function validate(name, email) {
                var password = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
                return validateList([[!name, "Name is required."], [!email, "A valid email is required."], [!password, "Password is required."], [password.length < 8, "Password must be at least 8 characters."]]);
            };

            var validateList = function validateList(list) {
                var valid = true;
                _.each(list, function (item) {
                    if (item[0]) {
                        _errorMessage2 = item[1];
                        valid = false;
                    }
                });
                return valid;
            };

            var register = function register(name, email, password) {
                if (validate(name, email, password)) User.registerUser({ name: name, email: email, password: password });
            };

            var events = function events() {
                socket.on('email-exists', function () {
                    console.log('email-exists');
                    _errorMessage2 = "This email is already registered";
                    $rootScope.$apply();
                });
            };

            var init = function init() {
                events();
            };

            init();

            scope = _.extend(scope, {
                register: register,
                errorMessage: function errorMessage() {
                    return _errorMessage2;
                },
                clearError: function clearError() {
                    return _errorMessage2 = "";
                }

            });
        }
    };
});

app.directive('sectionItem', function (State, $state, Wall, Dialog, $timeout) {
    return {
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

        link: function link(scope, element, attrs) {
            var $canvas = $('.wall-canvas');

            var position = { top: scope.top, left: scope.left, height: scope.height, width: scope.width };

            var click = { x: 0, y: 0 };

            var setText = function setText() {
                saveSection();
            };

            var updateText = function updateText() {
                updateSection();
            };

            var getStyle = function getStyle() {
                return {
                    'top': position.top,
                    'left': position.left,
                    'height': position.height,
                    'width': position.width
                };
            };

            var setColor = function setColor() {
                Wall.changeColor(scope.color);
                scope.color = Wall.getColor();
                saveSection();
            };

            var getSection = function getSection() {
                return {
                    _id: scope.id,
                    color: scope.color,
                    height: position.height,
                    width: position.width,
                    top: position.top,
                    left: position.left,
                    text: scope.text,
                    wall: scope.wall
                };
            };

            var removeSection = function removeSection() {
                console.log('removeSection', getSection());
                element.find('.section').addClass('deleted');
                socket.emit('remove-section', getSection());
            };

            var updateSection = function updateSection() {
                socket.emit('update-section', getSection());
            };

            var saveSection = function saveSection() {
                socket.emit('save-section', getSection());
            };

            var events = function events() {
                socket.on('section-' + scope.id, function (data) {
                    scope.color = data.color;
                    position.top = data.top;
                    position.left = data.left;
                    position.height = data.height;
                    position.width = data.width;
                    scope.text = data.text;
                    scope.$apply();
                });
            };

            var init = function init() {
                events();
                element.find('.section').draggable({
                    cancel: ".section-text, .section-title",
                    start: function start(event, ui) {
                        click.x = event.clientX;
                        click.y = event.clientY;
                        scope.$apply();
                        $canvas.addClass('dragged');
                    },
                    drag: function drag(event, ui) {
                        var original = ui.originalPosition;
                        ui.position = {
                            left: (event.clientX - click.x + original.left) / Wall.getScale(),
                            top: (event.clientY - click.y + original.top) / Wall.getScale()
                        };

                        position = _.extend(position, ui.position);
                        updateSection();
                        scope.$apply();
                    },
                    stop: function stop(event, ui) {
                        saveSection();
                        scope.$apply();
                        $timeout(function () {
                            return $canvas.removeClass('dragged');
                        }, 1);
                    }
                }).resizable({
                    start: function start(event, ui) {
                        $canvas.addClass('dragged');
                    },
                    resize: function resize(event, ui) {
                        position.height = ui.size.height;
                        position.width = ui.size.width;
                        updateSection();
                        scope.$apply();
                    },
                    stop: function stop(event, ui) {
                        saveSection();
                        $timeout(function () {
                            return $canvas.removeClass('dragged');
                        }, 1);
                    }
                }).droppable({
                    accept: ".note",
                    activeClass: "droppable",
                    hoverClass: "dropping"
                });

                element.find('.section').removeClass('deleted');
            };

            init();

            scope = _.extend(scope, {
                removeSection: removeSection,
                setColor: setColor,
                getPosition: function getPosition() {
                    return position;
                },
                getStyle: getStyle,
                setText: setText,
                updateText: updateText,
                getText: function getText() {
                    return text;
                }
            });
        }
    };
});

app.directive('settingsItem', function (State, $state, Wall, Dialog) {
    return {
        templateUrl: 'settings.html',
        replace: true,
        scope: {
            wall: '=',
            active: "="
        },

        link: function link(scope, element, attrs) {

            var events = function events() {};

            var getWallName = function getWallName() {
                Dialog.newDialog({
                    title: "Change Wall Name",
                    message: "Wall names must be lowercase with dashes, no spaces.",
                    placeholder: "wall-name",
                    'default': scope.wall.name,
                    callback: function callback(response) {
                        scope.wall.name = response.replace(/\s+/g, '-').toLowerCase();
                        socket.emit('save-wall', scope.wall);
                        socket.emit('get-walls', {});
                    }
                });
            };

            var removeWall = function removeWall() {
                Dialog.newDialog({
                    title: "Delete Wall",
                    message: "Type 'delete' to remove this wall.",
                    placeholder: "",
                    'default': "",
                    callback: function callback(response) {
                        if (response == "delete") {
                            socket.emit('remove-wall', scope.wall);
                            socket.emit('get-walls', {});
                            $state.go('home');
                        }
                    }
                });
            };

            var init = function init() {
                events();
            };

            init();

            scope = _.extend(scope, {
                newDialog: Dialog.newDialog,
                getWallName: getWallName,
                removeWall: removeWall
            });
        }
    };
});

app.directive('wallItem', function (State, $state, Wall, $timeout) {
    return {
        templateUrl: 'wall.html',
        replace: true,
        scope: {
            wall: "="
        },

        link: function link(scope, element, attrs) {
            var $wall = element.find('.wall-zoom');
            var $canvas = element.find('.wall-canvas');

            var settingsActive = false;

            var click = {
                x: 0,
                y: 0
            };

            var multiplier = $('.wall-canvas').height() / 2 - $('.wall-canvas').height() / 2 * Wall.getScale();

            var getOrigin = function getOrigin() {
                var x = 0,
                    y = 0;

                y = $('.wall').height() / 2 + $('.wall-zoom').position().top * -1;
                x = $('.wall').width() / 2 + $('.wall-zoom').position().left * -1;

                return x + 'px ' + y + 'px';
            };

            var init = function init() {
                $wall.draggable({
                    cancel: ".note, .section",
                    start: function start(event, ui) {
                        console.log('start', event.clientX, event.clientY);
                        //multiplier = ($('.wall-canvas').height() / 2) -($('.wall-canvas').height() / 2) * Wall.getScale();
                        multiplier = 0;
                        click.x = event.clientX;
                        click.y = event.clientY;
                        console.log('event', event);
                        console.log('start', click.x, click.y);
                        $canvas.addClass('dragged');
                    },
                    drag: function drag(event, ui) {
                        var original = ui.originalPosition;
                        ui.position = {
                            left: event.clientX - click.x + original.left,
                            top: event.clientY - click.y + original.top
                        };
                        scope.$apply();
                        //console.log(ui.position.left, ui.position.top);
                    },
                    stop: function stop(event, ui) {
                        $timeout(function () {
                            return $canvas.removeClass('dragged');
                        }, 1);
                        var original = ui.originalPosition;
                        ui.position = {
                            left: (event.clientX - click.x + original.left) / Wall.getScale(),
                            top: (event.clientY - click.y + original.top) / Wall.getScale()
                        };
                        scope.$apply();
                        $(event.toElement).one('click', function (e) {
                            return e.stopImmediatePropagation();
                        });
                    }
                });

                Wall.setWall(scope.wall);
            };

            init();

            scope = _.extend(scope, {
                getOrigin: getOrigin,
                showSettings: function showSettings() {
                    return settingsActive;
                },
                toggleSettings: function toggleSettings() {
                    return settingsActive = !settingsActive;
                },
                addNote: Wall.addNote,
                addSection: Wall.addSection,
                getNotes: Wall.getNotes,
                getSections: Wall.getSections,
                getScale: Wall.getScale,
                changeScale: Wall.changeScale,
                tryMe: function tryMe(event) {
                    console.log('tryMe', event);
                    event.stopImmediatePropagation();
                    event.stopPropagation();
                    return false;
                    if (event.currentTarget.className != event.target.className) return false;
                }
            });
        }
    };
});

app.directive('wallListItem', function (State, $state, Wall, User) {
    return {
        templateUrl: 'wall-list.html',
        replace: true,
        scope: {},

        link: function link(scope, element, attrs) {

            var walls = [];

            var addWall = function addWall() {
                socket.emit('add-wall', {
                    _id: State.gen_id(),
                    name: User.getUser().name.toLowerCase().replace(" ", "") + "s-wall-" + (walls.length + 1),
                    owner: User.getUser()._id,
                    users: [User.getUser()._id],
                    'private': false
                });
            };

            var events = function events() {
                socket.on('wall-list', function (data) {
                    walls = data;
                    scope.$apply();
                });
            };

            var init = function init() {
                events();
                socket.emit('get-walls', {});
            };

            init();

            scope = _.extend(scope, {
                getWalls: function getWalls() {
                    return walls;
                },
                addWall: addWall
            });
        }
    };
});

app.controller('BootcampScreen', function ($element, $timeout, API, $scope, $state) {

    var content, tags, international, politics, religion, culture;

    var init = function init() {
        $timeout(function () {
            return $element.find('[screen]').addClass('active');
        }, 50);
        console.log('$state', $state);
    };

    init();

    _.extend($scope, {});
});

app.controller('HomeScreen', function ($element, $timeout, API, $scope) {

    var content, tags, international, politics, religion, culture;

    var init = function init() {
        $timeout(function () {
            return $element.find('[screen]').addClass('active');
        }, 50);
    };

    init();

    _.extend($scope, {});
});

app.controller('LoginScreen', function ($element, $timeout, API, $scope) {

    var init = function init() {
        $timeout(function () {
            return $element.find('[screen]').addClass('active');
        }, 50);
    };

    init();

    _.extend($scope, {});
});

app.controller('RegisterScreen', function ($element, $timeout, API, $scope) {

    var init = function init() {
        $timeout(function () {
            return $element.find('[screen]').addClass('active');
        }, 50);
    };

    init();

    _.extend($scope, {});
});

app.controller('WallScreen', function ($element, $timeout, API, $scope, $state, $stateParams) {
    var wall;

    var events = function events() {
        socket.on('wall', function (data) {
            wall = data;
            $scope.$apply();
        });
    };

    var init = function init() {
        events();
        $timeout(function () {
            return $element.find('[screen]').addClass('active');
        }, 50);
        socket.emit('get-wall', $stateParams.id);
    };

    init();

    _.extend($scope, {
        getWall: function getWall() {
            return wall;
        }
    });
});