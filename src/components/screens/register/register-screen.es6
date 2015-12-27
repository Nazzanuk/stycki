app.controller('RegisterScreen', ($element, $timeout, API, $scope) => {

    var init = () => {
        $timeout(() => $element.find('[screen]').addClass('active'), 50);
    };

    init();

    _.extend($scope, {

    });
});



