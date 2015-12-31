app.factory('User', ($rootScope, $sce, $state, $timeout) => {

    var user = {
        _id: '',
        name: ''
    };

    var setGuest = () => {
        user = {
            _id: 'guest',
            name: 'Guest'
        };
    };

    var clearUser = () => {
        user = {
            _id: '',
            name: ''
        };
    };

    var checkUser = (userDetails) => {
        console.log(userDetails);
        userDetails.password += "saltMe";
        userDetails.password = userDetails.password.hashCode();
        userDetails = _.extend(userDetails, {_id: userDetails.email});
        socket.emit('check-user', userDetails);
    };

    var registerUser = (userDetails) => {
        userDetails.password += "saltMe";
        userDetails.password = userDetails.password.hashCode();
        user = _.extend(user, userDetails);
        user = _.extend(user, {_id: userDetails.email});
        socket.emit('add-user', user);
    };

    var events = () => {
        socket.on('valid-user', (data) => {
            console.log('valid-user', data);
            if (!data) return;
            user = data;
            $rootScope.$apply();
            $state.go('home');
            localStorage.setItem('email', data.email);
        });
    };

    var init = () => {
        events();
    };

    init();

    return {
        registerUser,
        clearUser,
        setGuest,
        checkUser,
        getUser: () => user
    };
});