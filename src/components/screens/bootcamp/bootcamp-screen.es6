app.controller('BootcampScreen', ($element, $timeout, API, $scope, $state) => {

    var content, tags, international, politics, religion, culture;

    var init = () => {
        $timeout(() => $element.find('[screen]').addClass('active'), 50);
        console.log('$state', $state)
    };

    init();

    _.extend($scope, {

    });
});



