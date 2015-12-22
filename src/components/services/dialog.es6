app.factory('Dialog', function ($timeout, $rootScope) {

    var content = {}, active = false;
    content.default = "";
    content.callback = () => {};

    var closeDialog = () => {
        active = false;
    };

    var newDialog = (data) => {
        content = _.extend(content, data);
        active = true;
    };

    var submit = (response) => {
        console.log('submitted', response);
        content.callback(response);
        active = false;
    };

    var init = () => {
    };

    init();

    return {
        getMessage: () => content.message,
        getTitle: () => content.title,
        getPlaceholder: () => content.placeholder,
        content,
        submit,
        isActive: () => active,
        newDialog,
        closeDialog
    }
});