(function () {
    "use strict";  // turn on javascript strict syntax mode
   /**
    * Start a new Application, a module in Angular
    * @param {string} ApplicationName a string which will be the name of the application
    *                 and, in fact, an object to which we add all other components
    * @param {array} dependencies An array of dependencies, the names are passed as strings
    */
    angular.module("GeoApp", [
        "ngRoute"   // the only dependency at this stage, for routing
    ]).              // note this fullstop where we chain the call to config
    config([
        "$routeProvider",     // built in variable which injects functionality, passed as a string
        function ($routeProvider) {
            $routeProvider.when("/continent", {
                templateUrl: "js/partials/continent-list.html",
                controller: "ContinentController"
            }).when("/continent/:ID", {
                templateUrl: "js/partials/country-list.html",
                controller: "CountryController"
            }).when("/continent/:Continent/:A3Code", {
                templateUrl: "js/partials/country-page.html",
                controller: "InfoController"
            }).when("/login", {
                templateUrl: "js/partials/login.html",
                controller: "LoginController"
            }).when("/logout", {
                templateUrl: "js/partials/logout.html",
                controller: "LogoutController"
            }).otherwise({
                redirectTo: "/"
            });
        }
    ]);  // end of config method
}());   // end of IIFE