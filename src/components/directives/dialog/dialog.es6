app.directive('dialogItem', (State, $state, Wall, Dialog) => ({
    templateUrl: 'dialog.html',
    replace: true,
    scope: {},

    link(scope, element, attrs) {

        var events = () => {

        };

        var init = () => {
            events();
        };

        init();

        scope = _.extend(scope, {
            getMessage: Dialog.getMessage,
            getTitle: Dialog.getTitle,
            submit: Dialog.submit,
            isActive: Dialog.isActive,
            getPlaceholder: Dialog.getPlaceholder,
            content: Dialog.content,
            newDialog: Dialog.newDialog
        });
    }
}));
