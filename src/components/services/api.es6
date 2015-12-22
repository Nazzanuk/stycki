'use strict';

app.factory('API', function ($rootScope, $http) {

    var API_URL = "/api/";

    var login = (object) => {
        return $http.get(API_URL + "login/", {
            params: object,
            headers: {'Cache-Control': 'no-cache'}
        }).then((response) => response.data);
    };

    var getHome = () => $http.get(`${API_URL}home`).then(response => response.data);

    var getPost = (id) => $http.get(`${API_URL}post/${id}`).then(response => response.data);

    var getPosts = () => $http.get(`${API_URL}posts/`).then(response => response.data);

    var getRandomPosts = () => $http.get(`${API_URL}posts/orderby/rand`).then(response => response.data);

    var getPostsByCat = (cat) => $http.get(`${API_URL}posts/cat/${cat}`).then(response => response.data);

    var getPostsByTag = (tag) => $http.get(`${API_URL}posts/tag/${tag}`).then(response => response.data);

    var getCollections = () => {
        return $http.get(`${API_URL}`, {headers: {'Cache-Control': 'no-cache'}}).then((response) => _.drop(response.data));
    };

    var getCollection = (collection) => {
        return $http.get(`${API_URL}${collection}`, {headers: { 'Cache-Control' : 'no-cache' } }).then((response) => response.data);
    };

    var getDocument = (collection, data) => {
        return $http.get(`${API_URL}${collection}`, {params: data, headers: { 'Cache-Control' : 'no-cache' } }).then((response) => {
            console.log(response.data[0]);
            return response.data[0];
        });
    };

    var insertDocument = (collection, data) => {
        return $http.post(`${API_URL}${collection}`, data).then((response) => response.data);
    };

    var updateDocument = (collection, id, data) => {
        return $http.put(`${API_URL}${collection}/_id/${id}`, data).then((response) => response.data);
    };

    return {
        login: login,
        getHome: getHome,
        getPost: getPost,
        getPosts: getPosts,
        getRandomPosts: getRandomPosts,
        getPostsByCat: getPostsByCat,
        getPostsByTag: getPostsByTag,
        getCollections: getCollections,
        getCollection: getCollection,
        getDocument: getDocument,
        insertDocument: insertDocument,
        updateDocument: updateDocument
    }
});