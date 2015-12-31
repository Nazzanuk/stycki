app.directive('loginItem', (State, $state, $timeout, User, $rootScope) => ({
    templateUrl: 'login.html',
    replace: true,
    scope: {},

    link(scope, element, attrs) {
        var errorMessage = "";

        var setGuest = () => {
            User.setGuest();
            $state.go('home')
        };

        var events = () => {
            socket.on('invalid-login', () => {
                console.log('invalid-login');
                errorMessage = "The email and / or password is incorrect";
                $rootScope.$apply();
            });
        };

        var init = () => {
            events();
            scope.email = localStorage.getItem('email');
        };

        init();

        scope = _.extend(scope, {
            setGuest,
            checkUser:User.checkUser,
            errorMessage: () => errorMessage,
            clearError: () => errorMessage = ""
        });
    }
}));
