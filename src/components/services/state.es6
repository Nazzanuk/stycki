app.factory('State', ($rootScope, $sce, $state, $timeout) => {

    var title = 'Content Types', showSplash = true;

    var gen_id = () => {
        var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return Array(10).join().split(',').map(() => s.charAt(Math.floor(Math.random() * s.length))).join('');
    };

    var init = () => {
        console.log('go home', $state);
        $timeout(() => showSplash = false, 1000);

        //$timeout(() => $state.go('login'), 1);

        $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
            $(document).scrollTop(0);
        });
    };

    init();

    _.extend($rootScope, {
        html: () => $sce.trustAsHtml,
        showSplash: () => showSplash
    });

    return {
        isMenuVisible: '',
        toggleMenu: '',
        setTitle: text => title = text,
        getTitle: () => title,
        gen_id
    };
});