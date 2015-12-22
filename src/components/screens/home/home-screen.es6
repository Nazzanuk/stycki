app.controller('HomeScreen', ($element, $timeout, API, $scope) => {

    var content, tags, international, politics, religion, culture;

    var init = () => {
        $timeout(() => $element.find('[screen]').addClass('active'), 50);
    };

    init();

    _.extend($scope, {

    });
});



