app.factory('State', ($rootScope, $sce, $state, $timeout, User) => {

    var title = 'Content Types', showSplash = true, showUnder = true, showAvatars = false;

    var gen_id = () => {
        var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return Array(10).join().split(',').map(() => s.charAt(Math.floor(Math.random() * s.length))).join('');
    };

    var events = () => {
        $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
            $(document).scrollTop(0);

            if (!User.getUser()._id) if (toState.name != "register" && toState.name != "login") {
                $state.go('login');
                return;
            }

            if (User.getUser()._id) if (toState.name == "register" || toState.name == "login") {
                $state.go('home');
                return;
            }
            showUnder = (toState.name == "register" || toState.name == "login");
        });
    };

    var init = () => {
        events();

        $timeout(() => showSplash = false, 1000);
    };

    init();

    _.extend($rootScope, {
        html: () => $sce.trustAsHtml,
        showSplash: () => showSplash,
        showUnder: () => showUnder
    });

    return {
        isMenuVisible: '',
        toggleMenu: '',
        showAvatars: () => showAvatars = true,
        hideAvatars: () => showAvatars = false,
        avatarsVisible: () => showAvatars,
        setTitle: text => title = text,
        getTitle: () => title,
        gen_id
    };
});