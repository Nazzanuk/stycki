app.directive('headerItem', (State, $state, User) => ({
    templateUrl: 'header.html',
    replace:true,
    scope: {},

    link(scope, element, attrs) {

        var menuVisible = true, currentscroll = 0;

        var checkScroll = () => {
            menuVisible = $(window).scrollTop() <= currentscroll;
            currentscroll = $(window).scrollTop();
            scope.$digest();
        };

        var events = () => {
            $(window).on('scroll', checkScroll);
        };

        var init = () => {
            events();
        };

        init();

        scope = _.extend(scope, {
            isActive:(page) => page == $state.current.name,
            isMenuVisible: () => menuVisible,
            toggleMenu: State.toggleMenu,
            getTitle: State.getTitle,
            getUser: User.getUser
        });
    }
}));
