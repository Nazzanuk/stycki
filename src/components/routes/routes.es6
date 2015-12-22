app.config(($stateProvider, $urlRouterProvider, $locationProvider) => {

    var resolve = {
        timeout($timeout) {
            $('[screen]').removeClass('active');
            //$('.loading-logo').addClass('active');
            return $timeout(300);
        }
    };

    // For any unmatched url, redirect to /
    $urlRouterProvider.otherwise("/");

    // Now set up the states
    $stateProvider
        .state('login', {
            url: "/",
            templateUrl: "login-screen.html",
            controller: "LoginScreen",
            resolve: resolve
        })
        .state('home', {
            url: "/home",
            templateUrl: "home-screen.html",
            controller: "HomeScreen",
            resolve: resolve
        })
        .state('wall', {
            url: "/wall/:id/:name",
            templateUrl: "wall-screen.html",
            controller: "WallScreen",
            resolve: resolve
        });

    //$locationProvider.html5Mode(true);
});