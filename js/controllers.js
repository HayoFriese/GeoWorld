(function () {
    "use strict";
    /**
     * Extend the module "CourseApp" instantiated in app.js  To add a controller called
     * IndexController (on line 17)
     * 
     * The controller is given two parameters, a name as a string and an array.
     * The array lists any injected objects to add and then a function which will be the
     * controller object and can contain properties and methods.
     * $scope is a built in object which refers to the application model and acts 
     * as a sort of link between the controller, its data and the application's views.
     * '
     * @link https://docs.angularjs.org/guide/scope
     */
    angular.module("GeoApp").
        controller("FooterController",
            [
                "$scope",
                "$rootScope",
                "dataService",
                "applicationData",
                "$location",
                function ($scope, $rootScope, dataService, appData, $location){
                    var getInfo = function () {
                        dataService.getSysInfo().then(
                            function(response){
                                $scope.sysInfo = response.data;
                            },
                            function(err){
                                $scope.status = "Unable to load data" + err;
                            },
                            function(notify){
                                console.log(notify);
                            }
                        );
                    };
                    getInfo();
                }
            ]
        ).
        controller("IndexController",   // controller given two params, a name and an array
            [
                "$scope",
                "$rootScope",
                "dataService",
                "applicationData",
                "$location",       // angular variable as a string 
                function ($scope, $rootScope, dataService, appData, $location) {
                    // add a title property which we can refer to in our view (index.html in this example)
                    $scope.title = "GeoWorld - The Global Database";
                    $scope.geotitle = "Pick a Continent";
                    $scope.role = "";
                    $scope.$on("systemInfo_continent", function (ev, continent){
                        $scope.title = "Showing all countries in "+continent.Name;
                        $scope.geotitle = "";
                    });
                    $scope.$on("systemInfo_country", function (ev, country){
                        $scope.title = country.Name;
                        $scope.geotitle = "";
                    });
                    $scope.$on("systemInfo_back3", function (ev, back3){
                        $scope.title = "GeoWorld - The Global Database";
                        $scope.geotitle = "Pick a Continent";
                    });
                    $scope.$on("systemInfo_bio", function (ev, bio){
                        $scope.title = "Showing all countries in "+bio.Continent;
                        $scope.geotitle = "";
                    });
                    $scope.$on("systemInfo_back", function (ev, back){
                        $scope.title = "GeoWorld - The Global Database";
                        $scope.geotitle = "Pick a Continent";
                    });
                    $scope.$on("systemInfo_login", function (){
                        $scope.geotitle = "";
                        $scope.title = "Sign In";
                    });
                    $scope.$on("systemInfo_role", function (ev, role){
                        $scope.role = role;
                    });
                    $scope.$on("systemInfo_norole", function (ev, norole){
                        $scope.role = "";
                    });
                    $rootScope.$on("init", function(){
                        init();
                    }); 
                    var init = function () {
                        dataService.checkLogin().then(
                            function(response){
                                $scope.status = response.status;
                                if(response.status === "ok"){
                                    $scope.userid = response.username;
                                    $scope.userrole = response.role;
                                    }else if(response.status === "error"){
                                    $scope.status = response.status;
                                }
                            }
                        );
                    };
                    init();
                    $scope.goLogin = function(){
                        $location.path("/login");
                        appData.publishInfo("login");
                    }
                    $scope.signOut = function(){
                        dataService.signOut().then(
                            function (response){
                                $scope.status = response.status;
                                $location.path("/continent");
                                if($scope.status === "ok"){
                                    $location.path("/continent");
                                }else{
                                    $scope.status = response.message;
                                }
                            }  
                        );
                    }
                    $scope.back3 = function($event){
                        $location.path("/continent");
                        appData.publishInfo("back3");
                    }
                }
            ]
             
        ).
        controller("ContinentController",  // create a Continent Controller, the basis of the front end functionality
            [
                "$scope",
                "dataService",
                "applicationData",
                "$location",
                function ($scope, dataService, appData, $location) {
                    var getContinents = function (){
                        dataService.getContinents().then( //called when the promise is resolved or rejected
                            function(response){
                                $scope.continents = response.data;
                            },
                            function(err){
                                $scope.status = "Unable to load data: " + err;
                            },
                            function(notify){
                                console.log(notify);
                            }
                        );
                    };
                    $scope.selectContinent = function($event, continent){
                        $scope.selectedContinent = continent;
                        $location.path("/continent/" + continent.ID);
                        appData.publishInfo("continent", continent);
                    }
                    getContinents();
                }
            ]
        ).
        controller("CountryController", 
            [
                "$scope", 
                "dataService", 
                "applicationData",
                "$location",
                "$routeParams",
                function ($scope, dataService, appData, $location, $routeParams){
                    var getCountries = function (ID) {
                        dataService.getCountries(ID).then(
                            function (response) {
                                $scope.countryCount = response.rowCount + " countries";
                                $scope.countries = response.data;
                            },
                            function (err){
                                $scope.status = "Unable to load data " + err;
                            }
                        );  // end of getCountries().then
                    };
                    $scope.back = function($event){
                        $location.path("/continent");
                        appData.publishInfo("back");
                    }
                    $scope.selectCountry = function($event, country){
                        $scope.selectedCountry = country;
                        $location.path("/continent/"+country.Continent+"/"+country.A3Code);
                        appData.publishInfo("country", country);
                    }
                    // only if there has been a ID passed in do we bother trying to get the countries
                    if ($routeParams && $routeParams.ID) {
                        getCountries($routeParams.ID);
                    }
                }
            ]
        ).
        controller("InfoController",
            [
                "$scope",
                "$rootScope",
                "dataService", 
                "applicationData",
                "$location",
                "$routeParams",
                function ($scope, $rootScope, dataService, appData, $location, $routeParams){
                    $rootScope.$on("checkRole", function(){
                        checkRole();
                    }); 
                    var checkRole = function () {
                        dataService.checkLogin().then(
                            function(response){
                                $scope.status = response.status;
                                if(response.status === "ok"){
                                    $scope.role = response.role;
                                    appData.publishInfo("role");
                                }else if(response.status === "error"){
                                    $scope.status = response.status;
                                }
                            }
                        );
                    };
                    checkRole();
                    var getInfo = function (A3Code){
                        dataService.getInfo(A3Code).then(
                            function (response){
                                $scope.userrole = $scope.role;
                                $scope.bioCount = response.rowCount;
                                $scope.bio = response.data;
                            },
                            function (err){
                                $scope.status = "Unable to load data "+ err;
                            }
                        );
                    };
                    $scope.back2 = function($event, bio){
                        $location.path("/continent/"+bio.ContinentID);
                        appData.publishInfo("bio", bio);
                    }
                    if ($routeParams && $routeParams.A3Code) {
                        getInfo($routeParams.A3Code);
                    }
                    /**
                     * Shows the edit window and positions it based on the row clicked on.
                     * 
                     * @param {object} $event
                     * @param {object} bio
                     * @returns {null}
                     */
                    $scope.showEditHos = function ($event, bio, editorID) {
                        var element = $event.currentTarget,
                            padding = 22,
                            posY = (element.offsetTop + element.clientTop + padding) - (element.scrollTop + element.clientTop),
                            hosEditorElement = document.getElementById(editorID);
                     
                        $scope.selectedBio = angular.copy(bio);
                        $scope.editorVisible = true;
                        console.log($scope.selectedBio);
                        hosEditorElement.style.position = "absolute";
                        hosEditorElement.style.top = posY + "px";
                    };
                    /**
                     * Abandon the edit in progress
                     * @returns {null}
                     */
                    $scope.abandonEdit = function () {
                        $scope.editorVisible = false;
                        $scope.selectedBio = null;
                    };
                    /**
                     * functions, attached to $scope so they"re visible in the view, 
                     * to handle editing a bio
                     * 
                     * @param {object} bio
                     * @returns {null}
                     */
                    $scope.saveHos = function (){
                        var currentBio;
                     
                        $scope.editorVisible = false;
                        // call dataService method
                        dataService.updateHos($scope.selectedBio).then(
                            function (response) {
                                $scope.status = response.status;
                                if (response.status === "ok") { // if we saved the file then update the screen{
                                    currentBio = $scope.bio;
                                    if (currentBio.A3Code === $scope.selectedBio.A3Code) {
                                        $scope.bio = angular.copy($scope.selectedBio);
                                    }
                                }
                                // reset selectedStudent
                                $scope.selectedBio = null;
                            },
                            function (err) {
                                $scope.status = "Error with save " + err;
                            }
                        );
                    };
                }
            ]
        ).
        controller("LoginController",
            [
                "$scope",
                "$rootScope",
                "dataService",
                "applicationData",
                "$location",
                function ($scope, $rootScope, dataService, appData, $location){
                    $scope.signin = function(){
                        dataService.signin($scope.username, $scope.password).then(
                            function (response){
                                $scope.status = response.status;
                                if(response.status === "ok"){
                                    $rootScope.$emit("init", {});
                                    $location.path("/continent");
                                    appData.publishInfo("back");
                                }else{
                                    $scope.loginstatus = response.message;
                                    console.log($scope.loginstatus);
                                }
                            }  
                        );
                    }
                    $scope.back3 = function($event){
                        $location.path("/continent");
                        appData.publishInfo("back3");
                    }
                }
            ] 
        );
}());