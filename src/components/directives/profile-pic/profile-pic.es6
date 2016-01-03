app.directive('profilePicItem', (State, $state, User) => ({
    templateUrl: 'profile-pic.html',
    replace: true,
    scope: {},

    link(scope, element, attrs) {

        var visible = true;

        var avatars = [
            //'/public/img/black-male.svg',
            '/public/img/black-male-2.svg',
            '/public/img/black-male-3.svg',
            '/public/img/black-male-4.svg',
            '/public/img/asian-male.svg',
            '/public/img/white-male.svg',
            '/public/img/white-male-2.svg',
            '/public/img/black-female.svg',
            '/public/img/asian-female.svg',
            '/public/img/asian-female-2.svg',
            '/public/img/white-female.svg',
            '/public/img/white-female-2.svg',
            '/public/img/white-female-3.svg'
        ];

        var selectAvatar = (img) => {
            User.updateUser({img: img});

        };

        var events = () => {

        };

        var init = () => {
            events();
        };

        init();

        scope = _.extend(scope, {
            close: State.hideAvatars,
            selectAvatar,
            getAvatars: () => avatars,
            isVisible: State.avatarsVisible
        });
    }
}));
