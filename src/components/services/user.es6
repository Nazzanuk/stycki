app.factory('User', ($rootScope, $sce, $state, $timeout) => {

    var user = {
        _id: localStorage.getItem('email'),
        name: localStorage.getItem('name'),
        email: localStorage.getItem('email')
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
        localStorage.clear();
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

    var updateUser = (userDetails) => {
        socket.emit('update-user', userDetails);
    };

    var events = () => {
        socket.on('valid-user', (data) => {
            console.log('valid-user', data);
            if (!data) return;
            user = data;
            $rootScope.$apply();
            $state.go('home');
            localStorage.setItem('email', data.email);
            localStorage.setItem('name', data.name);
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
        updateUser,
        getUser: () => user
    };
});