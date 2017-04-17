var app;
(function(){
    app = angular.module('visibleThings', ['ngMaterial', 'nvd3'])
        .config(function($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('blue-grey');
            $mdThemingProvider.theme('success-toast');
            $mdThemingProvider.theme('error-toast');
            $mdThemingProvider.alwaysWatchTheme(true);
        })
})();

app.controller('mainController', function($scope, $mdToast){
    $scope.visibleThings = visibleThings;
    var util = new Utility();
    var deviceNames = [];
    $scope.rc = {};
    $scope.data={};

    // Disabling the mouse right click event
    document.addEventListener('contextmenu', event => event.preventDefault());

    // ---------- Graph Code START -----------
    
    $scope.options = {
        chart: {
            type: 'lineChart',
            height: 250,
            width: 310,
            margin : {
                right: 20,
                bottom: 40,
                left: 85
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            useInteractiveGuideline: true,
            transitionDuration: 0,
            duration: 500,
            yAxis: {
                tickFormat: function(d){
                    return d3.format('.01f')(d);
                }
            },
            xAxis: {
                axisLabel:'Time',
                showMaxMin: false,
                tickFormat: function(d){
                    if (Math.abs(d) == 1){
                        return (Math.abs(d)+' second ago');
                    }
                    return (Math.abs(d)+' seconds ago');
                    }
            },
            forceX: [-299,0],
            noData: ("")
        }
    };

    setInterval(function () {
        for (var uuid in $scope.visibleThings.peripherals) {

            if (deviceNames.indexOf($scope.visibleThings.peripherals[uuid].name) == -1){
                util.initializeData($scope,uuid);
                $scope.data[uuid].name = $scope.visibleThings.peripherals[uuid].name;
                deviceNames.push($scope.visibleThings.peripherals[uuid].name);
            }

            var peripheral = $scope.visibleThings.peripherals[uuid];
            var data = $scope.data[uuid];

            util.preapareSingleGraph(peripheral.tempData,data.temp);
            util.preapareSingleGraph(peripheral.humidityData,data.hum);
            util.prepareLightData(peripheral.lightData,data.light);
            util.prepareTripleGraph(peripheral.accData,data.acc);
            util.prepareTripleGraph(peripheral.gyroData,data.gyro);
            util.prepareTripleGraph(peripheral.magData,data.mag);

            data.currTempC = peripheral.tempData.value;
            data.currTempF = peripheral.tempData.fahrenheit;
            data.currHum = peripheral.humidityData.value;
            data.currLight = peripheral.lightData.value;
            data.currGyro = peripheral.accData.value;
            data.currAcc = peripheral.gyroData.value;
            data.currMag = peripheral.magData.value;

            $scope.$apply();
        }

    },1000);

    // ---------- Graph Code END -----------

});
