app.controller('WallScreen', ($element, $timeout, API, $scope, $state, $stateParams) => {
    var wall;

    var events = () => {
        socket.on('wall', (data) => {
            wall = data;
            $scope.$apply();
        })
    };

    var init = () => {
        events();
        $timeout(() => $element.find('[screen]').addClass('active'), 50);
        socket.emit('get-wall', $stateParams.id);
    };

    init();

    _.extend($scope, {
        getWall: () => wall
    });
});



