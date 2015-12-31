app.directive('registerItem', (State, $state, $timeout, User, $rootScope) => ({
    templateUrl: 'register.html',
    replace: true,
    scope: {},

    link(scope, element, attrs) {

        var errorMessage = "";

        var validate = (name, email, password = "") => validateList([
            [!name, "Name is required."],
            [!email, "A valid email is required."],
            [!password, "Password is required."],
            [password.length < 8, "Password must be at least 8 characters."]
        ]);

        var validateList = (list) => {
            var valid = true;
            _.each(list, (item) => {
                if (item[0]) {
                    errorMessage = item[1];
                    valid = false;
                }
            });
            return valid;
        };

        var register = (name, email, password) => {
            if (validate(name, email, password)) User.registerUser({name, email, password});
        };

        var events = () => {
            socket.on('email-exists', () => {
                console.log('email-exists');
                errorMessage = "This email is already registered";
                $rootScope.$apply();
            });
        };

        var init = () => {
            events();
        };

        init();

        scope = _.extend(scope, {
            register,
            errorMessage: () => errorMessage,
            clearError: () => errorMessage = ""

        });
    }
}));
