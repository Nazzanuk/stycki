app.controller('ScreenCtrl', ($element, $timeout, State, $state) => {

    var init = () => {
        $timeout(() => $element.find('[screen]').addClass('active'), 50);
    };

    $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
        $(document).scrollTop(0);
    });

    init();
});
