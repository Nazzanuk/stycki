app.factory('State', ($rootScope, $sce, $state, $timeout) => {

    var title = 'Content Types';

    var gen_id = () => {
        var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return Array(10).join().split(',').map(() => s.charAt(Math.floor(Math.random() * s.length))).join('');
    };

    var init = () => {
        console.log('go home', $state);

        //$timeout(() => $state.go('login'), 1);

        $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
            $(document).scrollTop(0);
        });
    };

    init();

    _.extend($rootScope, {
        html: () => $sce.trustAsHtml
    });

    return {
        isMenuVisible: '',
        toggleMenu: '',
        setTitle: text => title = text,
        getTitle: () => title,
        gen_id
    };
});