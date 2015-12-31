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
        _showUnder = true;

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
        _id: '',
        name: ''
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

    var events = function events() {
        socket.on('valid-user', function (data) {
            console.log('valid-user', data);
            if (!data) return;
            user = data;
            $rootScope.$apply();
            $state.go('home');
            localStorage.setItem('email', data.email);
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
        getUser: function getUser() {
            return user;
        }
    };
});
app.factory('Wall', function (State, $rootScope) {
    var notes = [],
        color = 1,
        wall = {};

    var addNote = function addNote(event) {
        var top = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
        var left = arguments.length <= 2 || arguments[2] === undefined ? 50 : arguments[2];

        var _id = State.gen_id();
        if (event.currentTarget.className != event.target.className) return;
        if ($(event.currentTarget).hasClass('dragged')) return;

        if ($(event.currentTarget).hasClass('wall-canvas')) {
            top = event.offsetY;
            left = event.offsetX;
        }

        notes.push({ _id: _id, color: color, top: top, left: left, wall: wall._id });
        socket.emit('add-note', { _id: _id, color: color, top: top, left: left, wall: wall._id });
    };

    var setWall = function setWall(theWall) {
        wall = theWall;
        notes = [];
        socket.emit('join-wall', wall._id);
    };

    var events = function events() {
        socket.on('notes', function (data) {
            notes = data;
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
        addNote: addNote,
        setWall: setWall,
        changeColor: function changeColor(currentColor) {
            return color = ++currentColor <= 5 ? currentColor : 1;
        },
        getColor: function getColor() {
            return color;
        },
        getNotes: function getNotes() {
            return notes;
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

app.directive('noteItem', function (State, $state, Wall) {
    return {
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

        link: function link(scope, element, attrs) {

            var position = { top: scope.top, left: scope.left },
                text = scope.text,
                rotation = _.random(-5, 5);

            var setText = function setText(event) {
                text = element.find('.note').text().trim();
                saveNote();
            };

            var updateText = function updateText() {
                //text = element.find('.note').text().trim();
                //console.log(element.find('.note').text().trim());
                updateNote();
            };

            var getStyle = function getStyle() {
                return {
                    'top': position.top,
                    'left': position.left
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
                    text: element.find('.note').text().trim(),
                    top: position.top,
                    left: position.left,
                    wall: scope.wall
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
                    text = data.text;
                    scope.$apply();
                });
            };

            var init = function init() {
                events();
                element.find('.note').draggable({
                    cancel: ".note-text",
                    stack: ".note",
                    drag: function drag(event, ui) {
                        position = ui.position;
                        updateNote();
                        scope.$apply();
                    },
                    stop: function stop(event, ui) {
                        position = ui.position;
                        saveNote();
                        scope.$apply();
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
                getText: function getText() {
                    return text;
                }
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
            var $canvas = element.find('.wall-canvas');

            var settingsActive = false;

            var init = function init() {
                $canvas.draggable({
                    cancel: ".note",
                    start: function start(event, ui) {
                        return $canvas.addClass('dragged');
                    },
                    stop: function stop(event, ui) {
                        return $timeout(function () {
                            return $canvas.removeClass('dragged');
                        }, 1);
                    }
                });

                Wall.setWall(scope.wall);
            };

            init();

            scope = _.extend(scope, {
                showSettings: function showSettings() {
                    return settingsActive;
                },
                toggleSettings: function toggleSettings() {
                    return settingsActive = !settingsActive;
                },
                addNote: Wall.addNote,
                getNotes: Wall.getNotes
            });
        }
    };
});

app.directive('wallListItem', function (State, $state, Wall) {
    return {
        templateUrl: 'wall-list.html',
        replace: true,
        scope: {},

        link: function link(scope, element, attrs) {

            var walls = [];

            var addWall = function addWall() {
                socket.emit('add-wall', {
                    _id: State.gen_id(),
                    name: "my-wall",
                    user: "nazzanuk@gmail.com"
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