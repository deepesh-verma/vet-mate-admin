var app = angular.module('jsonEditorApp', []);

const REQUEST_URL = 'https://api.npoint.io/da923ccbf7de7586179e';

var getElementById = function(id) {
    return angular.element( document.getElementById(id) );
};

//Intercepts ALL angular ajax http calls
app.factory('httpInterceptor', function ($q) {
    var numLoadings = 0;
    console.log(getElementById('loadingSpinner'));
    return {
        request: function (config) {
            numLoadings++;
            // Show loader

            getElementById('loadingSpinner').removeClass('d-none');
            return config || $q.when(config)
        },
        response: function (response) {
            if ((--numLoadings) === 0) {
                // Hide loader
                getElementById('loadingSpinner').addClass('d-none');
            }
            return response || $q.when(response);
        },
        responseError: function (response) {
            if (!(--numLoadings)) {
                // Hide loader
                getElementById('loadingSpinner').addClass('d-none');
            }
            return $q.reject(response);
        }
    };
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
});

app.controller('JsonViewController', function ($scope, $http) {

    $scope.jsonData = [];

    $http.get(REQUEST_URL).then(function (response) {
        $scope.jsonData = response.data;        
    });

    $scope.addNewParameter = function(animalIndex, categoryIndex) {
        console.log('Add', animalIndex, categoryIndex);
        $scope.jsonData[animalIndex].categories[categoryIndex].parameters.push({name: '', value: ''});
    };

    $scope.deleteParameter = function(animalIndex, categoryIndex, parameterIndex) {
        console.log('Remove', animalIndex, categoryIndex, parameterIndex);
        $scope.jsonData[animalIndex].categories[categoryIndex].parameters.splice(parameterIndex, 1);
    };

    $scope.addNewAnimal = function() {
        $scope.jsonData.push({
            name: 'New animal',
            categories: [
                {
                    name: 'Physiological Parameters',
                    parameters: []
                },
                {
                    name: 'Haematological Parameters',
                    parameters: []
                },
                {
                    name: 'Blood Biochemical',
                    parameters: []
                }
            ]
        });
    };

    $scope.deleteAnimal = function(animalIndex) {
        console.log('Remove animal', animalIndex);
        $scope.jsonData.splice(animalIndex, 1);
    };

    $scope.addNewCategory = function(animalIndex) {
        console.log('Add', animalIndex);
        $scope.jsonData[animalIndex].categories.push({name: '', parameters: []});
    };

    $scope.deleteCategory = function(animalIndex, categoryIndex) {
        console.log('Remove', animalIndex, categoryIndex);
        $scope.jsonData[animalIndex].categories.splice(categoryIndex, 1);
    };

    $scope.save = function() {
        console.log('Saving', $scope.jsonData);
        $http({
            url: REQUEST_URL,
            method: "POST",
            data: $scope.jsonData
        })
        .then(function(response) {
            $scope.jsonData = response.data;
        });
    };
});