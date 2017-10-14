(function () {
"use strict";
/** Service to return the data */
angular.module("GeoApp").
    service("dataService",         // the data service name, can be anything we want
        ["$q",                     // dependency, $q handles promises, the request initially returns a promise, not the data
         "$http",                  // dependency, $http handles the ajax request
         function($q, $http) {     // the parameters must be in the same order as the dependencies
            /*
             * var to hold the data base url
             */
            var urlBase = "/cm0655-assignment/server/index.php";
            /*
             * method to retrieve continents, or a promise which when
             * fulfilled calls the success method
             */
            this.getContinents = function () {
                var defer = $q.defer(),             // The promise
                    data = {
                        action: "list",
                        subject: "continents"
                    };
                /**
                 * make an ajax get call
                 * chain calls to .success and .error which will resolve or reject the promise
                 * @param {string} urlBase The url to call, later we'll to this to pass parameters
                 * @param {object} config a configuration object, can contain parameters to pass, in this case we set cache to true
                 * @return {object} promise The call returns, not data, but a promise which only if the call is successful is 'honoured'
                 */
                $http.get(urlBase, {params: data, cache: true}).                          // notice the dot to start the chain to success()
                        success(function(response){
                            defer.resolve({
                                data: response.ResultSet.Result         // create data property with value from response
                            });
                        }).                                                 // another dot to chain to error()
                        error(function(err){
                            defer.reject(err);
                        });
                // the call to getCourses returns this promise which is fulfilled
                // by the .get method .success or .failure
                return defer.promise;
            };
            /**
             *
             * @param {string} continentid The course code for the course the students are following
             * @returns {object} promise
             */
            this.getCountries = function (ID) {
                var defer = $q.defer(),
                    data = {
                        action: "list",
                        subject: "countries",
                        id: ID
                    };
                $http.get(urlBase, {params: data, cache: true}).                  // notice the dot to start the chain to success()
                        success(function(response){
                            defer.resolve({
                                data: response.ResultSet.Result,         // create data property with value from response
                                rowCount: response.ResultSet.RowCount // create rowCount property with value from response
                            });
                        }).                                         // another dot to chain to error()
                        error(function(err){
                            defer.reject(err);
                        });
                // the call to getCourses returns this promise which is fulfilled
                // by the .get method .success or .failure
                return defer.promise;
            };
            this.getInfo = function (A3Code) {
                var defer = $q.defer(),
                    data = {
                        action: "list",
                        subject: "info",
                        id: A3Code
                    };
                $http.get(urlBase, {params: data, cache: true}).                  // notice the dot to start the chain to success()
                        success(function(response){
                            defer.resolve({
                                data: response.ResultSet.Result[0],         // create data property with value from response
                                rowCount: response.ResultSet.RowCount // create rowCount property with value from response
                            });
                        }).                                         // another dot to chain to error()
                        error(function(err){
                            defer.reject(err);
                        });
                // the call to getCourses returns this promise which is fulfilled
                // by the .get method .success or .failure
                return defer.promise;
            };
            /**
             * By default post sends data as application/json you need to make sure your server handles that
             * @param bio
             * @returns {promise|*}
             */
            this.updateHos = function (bio) {
                var defer = $q.defer(),
                    data = {
                        action: "update",
                        subject: "hos",
                        data: angular.toJson(bio)
                    };
                $http.post(urlBase, data).
                    success(function(response){
                        defer.resolve(response);
                    }).
                    error(function (err){
                        defer.reject(err);
                    });
                return defer.promise;
            };
            this.signin = function(username, password){
                var defer = $q.defer(),
                    details = {
                        username: username,
                        password: password
                    },
                    data = {
                        action: "login",
                        subject: "user",
                        data: angular.toJson(details)
                    };
                $http.post(urlBase, data).
                    success(function (response){
                        defer.resolve(response);
                    }).
                    error(function (err){
                        defer.reject(err);
                    });
                return defer.promise;
            };
            this.checkLogin = function(){
                var defer = $q.defer(),
                    data = {
                        action: "check",
                        subject: "login"
                    };
                $http.post(urlBase, data).
                    success(function (response){
                        defer.resolve(response);
                    }).
                    error(function (err){
                        defer.reject(err);
                    });
                return defer.promise;
            };
            this.signOut = function(){
                var defer = $q.defer(),
                    data = {
                        action: "logout",
                        subject: "user"
                    };
                $http.post(urlBase, data).
                    success(function (response){
                        defer.resolve(response);
                    }).
                    error(function (err){
                        defer.reject(err);
                    });
                return defer.promise;
            };
            this.getSysInfo = function () {
                var defer = $q.defer(),             // The promise
                    geoURL = "/cm0655-assignment/server/sysInfo.json"; // add the static file containing continents to the base url
                /**
                 * make an ajax get call
                 * chain calls to .success and .error which will resolve or reject the promise
                 * @param {string} urlBase The url to call, later we'll to this to pass parameters
                 * @param {object} config a configuration object, can contain parameters to pass, in this case we set cache to true
                 * @return {object} promise The call returns, not data, but a promise which only if the call is successful is 'honoured'
                 */
                $http.get(geoURL, {cache: true}).                          // notice the dot to start the chain to success()
                        success(function(response){
                            defer.resolve({
                                data: response.Setting,        // create data property with value from response
                            });
                        }).                                                 // another dot to chain to error()
                        error(function(err){
                            defer.reject(err);
                        });
                // the call to getCourses returns this promise which is fulfilled
                // by the .get method .success or .failure
                return defer.promise;
            };
         }
        ]
    ).
    service("applicationData",
        function ($rootScope){
            var sharedService = {};
            sharedService.info = {};
            sharedService.publishInfo = function(key, obj){
                this.info[key] = obj;
                $rootScope.$broadcast("systemInfo_"+key, obj);
            };
            return sharedService;
        }
    );
}());