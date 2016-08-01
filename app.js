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



    // ---------- Graph Code START -----------
    $scope.options = {
        chart: {
            type: 'lineChart',
            height: 250,
            width: 400,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 85
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            // useInteractiveGuideline: true,
            transitionDuration: 1500,
            yAxis: {
                tickFormat: function(d){
                    return d3.format('.01f')(d);
                }
            },
            xAxis: {
                axisLabel:'Time',
                tickFormat: function(d){
                    for(var uuid in $scope.visibleThings.peripherals){
                        if($scope.visibleThings.peripherals[uuid].tempGraphData[0].values[d]){
                            var label = $scope.visibleThings.peripherals[uuid].tempGraphData[0].values[d].label;
                            return label;
                        }
                    }
                }
            },
            forceX: [0,19]
        }
    };

    $scope.tempOptions = angular.copy($scope.options);
    $scope.humidityOptions = angular.copy($scope.options);
    $scope.gyroOptions = angular.copy($scope.options);
    $scope.accOptions = angular.copy($scope.options);
    $scope.magOptions = angular.copy($scope.options);



    var x = 20;
    setInterval(function (){
        for(var uuid in $scope.visibleThings.peripherals){
            if(!isNaN($scope.visibleThings.peripherals[uuid].tempData.timeNum) && !isNaN($scope.visibleThings.peripherals[uuid].tempData.temp)){

                    $scope.visibleThings.peripherals[uuid].tempGraphData[0].values.push(
                        { x: $scope.visibleThings.peripherals[uuid].tempData.timeNum,
                            y: $scope.visibleThings.peripherals[uuid].tempData.temp,
                            label:$scope.visibleThings.peripherals[uuid].tempData.date
                        });
                }
            for (var i = 0, len = $scope.visibleThings.peripherals[uuid].tempGraphData[0].values.length; i < len; i++) {
                $scope.visibleThings.peripherals[uuid].tempGraphData[0].values[i].x = $scope.visibleThings.peripherals[uuid].tempGraphData[0].values[i].x - 1;
            }
            if ($scope.visibleThings.peripherals[uuid].tempGraphData[0].values.length > 20) {
                $scope.visibleThings.peripherals[uuid].tempGraphData[0].values.shift();
            }

            console.log('x current value '+x);

            console.log('all data '+JSON.stringify( $scope.visibleThings.peripherals[uuid].tempGraphData[0].values,null,4));


            console.log('first '+JSON.stringify( $scope.visibleThings.peripherals[uuid].tempGraphData[0].values[0],null,4));


            if(!isNaN($scope.visibleThings.peripherals[uuid].humidityData.timeNum) && !isNaN($scope.visibleThings.peripherals[uuid].humidityData.hum)){
                $scope.visibleThings.peripherals[uuid].humidityGraphData[0].values.push(
                    { x: $scope.visibleThings.peripherals[uuid].humidityData.timeNum,
                        y: $scope.visibleThings.peripherals[uuid].humidityData.hum,
                        label:$scope.visibleThings.peripherals[uuid].tempData.date});
            }

            for (var i = 0, len = $scope.visibleThings.peripherals[uuid].humidityGraphData[0].values.length; i < len; i++) {
                $scope.visibleThings.peripherals[uuid].humidityGraphData[0].values[i].x = $scope.visibleThings.peripherals[uuid].humidityGraphData[0].values[i].x - 1;
            }
            if ($scope.visibleThings.peripherals[uuid].humidityGraphData[0].values.length > 20) {
                $scope.visibleThings.peripherals[uuid].humidityGraphData[0].values.shift();
            }

            if(!isNaN($scope.visibleThings.peripherals[uuid].gyroData.timeNum) && !isNaN($scope.visibleThings.peripherals[uuid].gyroData.value_1) && !isNaN($scope.visibleThings.peripherals[uuid].gyroData.value_2) && !isNaN($scope.visibleThings.peripherals[uuid].gyroData.value_3)){

                $scope.visibleThings.peripherals[uuid].giroGraphData_1[0].values.push(
                    { x: $scope.visibleThings.peripherals[uuid].gyroData.timeNum,
                        y: $scope.visibleThings.peripherals[uuid].gyroData.value_1,
                        label:$scope.visibleThings.peripherals[uuid].gyroData.date
                    });
                for (var i = 0, len = $scope.visibleThings.peripherals[uuid].giroGraphData_1[0].values.length; i < len; i++) {
                    $scope.visibleThings.peripherals[uuid].giroGraphData_1[0].values[i].x = $scope.visibleThings.peripherals[uuid].giroGraphData_1[0].values[i].x - 1;
                }
                if ($scope.visibleThings.peripherals[uuid].giroGraphData_1[0].values.length > 20) {
                    $scope.visibleThings.peripherals[uuid].giroGraphData_1[0].values.shift();
                }

                $scope.visibleThings.peripherals[uuid].giroGraphData_2[0].values.push(
                    { x: $scope.visibleThings.peripherals[uuid].gyroData.timeNum,
                        y: $scope.visibleThings.peripherals[uuid].gyroData.value_2,
                        label:$scope.visibleThings.peripherals[uuid].gyroData.date
                    });

                for (var i = 0, len = $scope.visibleThings.peripherals[uuid].giroGraphData_2[0].values.length; i < len; i++) {
                    $scope.visibleThings.peripherals[uuid].giroGraphData_2[0].values[i].x = $scope.visibleThings.peripherals[uuid].giroGraphData_2[0].values[i].x - 1;
                }
                if ($scope.visibleThings.peripherals[uuid].giroGraphData_2[0].values.length > 20) {
                    $scope.visibleThings.peripherals[uuid].giroGraphData_2[0].values.shift();
                }

                $scope.visibleThings.peripherals[uuid].giroGraphData_3[0].values.push(
                    { x: $scope.visibleThings.peripherals[uuid].gyroData.timeNum,
                        y: $scope.visibleThings.peripherals[uuid].gyroData.value_3,
                        label:$scope.visibleThings.peripherals[uuid].gyroData.date
                    });

                for (var i = 0, len = $scope.visibleThings.peripherals[uuid].giroGraphData_3[0].values.length; i < len; i++) {
                    $scope.visibleThings.peripherals[uuid].giroGraphData_3[0].values[i].x = $scope.visibleThings.peripherals[uuid].giroGraphData_3[0].values[i].x - 1;
                }
                if ($scope.visibleThings.peripherals[uuid].giroGraphData_3[0].values.length > 20) {
                    $scope.visibleThings.peripherals[uuid].giroGraphData_3[0].values.shift();
                }

                $scope.visibleThings.peripherals[uuid].giroGraphData =
                    [
                        $scope.visibleThings.peripherals[uuid].giroGraphData_1[0],
                        $scope.visibleThings.peripherals[uuid].giroGraphData_2[0],
                        $scope.visibleThings.peripherals[uuid].giroGraphData_3[0]
                    ];

            }

            console.log('ziroskop '+JSON.stringify( $scope.visibleThings.peripherals[uuid].giroGraphData,null,4));



            if(!isNaN($scope.visibleThings.peripherals[uuid].accData.timeNum) && !isNaN($scope.visibleThings.peripherals[uuid].accData.value_1) && !isNaN($scope.visibleThings.peripherals[uuid].accData.value_2) && !isNaN($scope.visibleThings.peripherals[uuid].accData.value_3)){

                $scope.visibleThings.peripherals[uuid].accGraphData_1[0].values.push(
                    { x: $scope.visibleThings.peripherals[uuid].accData.timeNum,
                        y: $scope.visibleThings.peripherals[uuid].accData.value_1,
                        label:$scope.visibleThings.peripherals[uuid].accData.date
                    });

                for (var i = 0, len = $scope.visibleThings.peripherals[uuid].accGraphData_1[0].values.length; i < len; i++) {
                    $scope.visibleThings.peripherals[uuid].accGraphData_1[0].values[i].x = $scope.visibleThings.peripherals[uuid].accGraphData_1[0].values[i].x - 1;
                }
                if ($scope.visibleThings.peripherals[uuid].accGraphData_1[0].values.length > 20) {
                    $scope.visibleThings.peripherals[uuid].accGraphData_1[0].values.shift();
                }

                $scope.visibleThings.peripherals[uuid].accGraphData_2[0].values.push(
                    { x: $scope.visibleThings.peripherals[uuid].accData.timeNum,
                        y: $scope.visibleThings.peripherals[uuid].accData.value_2,
                        label:$scope.visibleThings.peripherals[uuid].accData.date
                    });

                for (var i = 0, len = $scope.visibleThings.peripherals[uuid].accGraphData_2[0].values.length; i < len; i++) {
                    $scope.visibleThings.peripherals[uuid].accGraphData_2[0].values[i].x = $scope.visibleThings.peripherals[uuid].accGraphData_2[0].values[i].x - 1;
                }
                if ($scope.visibleThings.peripherals[uuid].accGraphData_2[0].values.length > 20) {
                    $scope.visibleThings.peripherals[uuid].accGraphData_2[0].values.shift();
                }

                $scope.visibleThings.peripherals[uuid].accGraphData_3[0].values.push(
                    { x: $scope.visibleThings.peripherals[uuid].accData.timeNum,
                        y: $scope.visibleThings.peripherals[uuid].accData.value_3,
                        label:$scope.visibleThings.peripherals[uuid].accData.date
                    });

                for (var i = 0, len = $scope.visibleThings.peripherals[uuid].accGraphData_3[0].values.length; i < len; i++) {
                    $scope.visibleThings.peripherals[uuid].accGraphData_3[0].values[i].x = $scope.visibleThings.peripherals[uuid].accGraphData_3[0].values[i].x - 1;
                }
                if ($scope.visibleThings.peripherals[uuid].accGraphData_3[0].values.length > 20) {
                    $scope.visibleThings.peripherals[uuid].accGraphData_3[0].values.shift();
                }

                $scope.visibleThings.peripherals[uuid].accGraphData =
                    [
                        $scope.visibleThings.peripherals[uuid].accGraphData_1[0],
                        $scope.visibleThings.peripherals[uuid].accGraphData_2[0],
                        $scope.visibleThings.peripherals[uuid].accGraphData_3[0]
                    ];

                console.log('ubrzanje '+JSON.stringify( $scope.visibleThings.peripherals[uuid].accGraphData,null,4));
            }

            if(!isNaN($scope.visibleThings.peripherals[uuid].magData.timeNum) && !isNaN($scope.visibleThings.peripherals[uuid].magData.value_1) && !isNaN($scope.visibleThings.peripherals[uuid].magData.value_2) && !isNaN($scope.visibleThings.peripherals[uuid].magData.value_3)){

                $scope.visibleThings.peripherals[uuid].magGraphData_1[0].values.push(
                    { x: $scope.visibleThings.peripherals[uuid].magData.timeNum,
                        y: $scope.visibleThings.peripherals[uuid].magData.value_1,
                        label:$scope.visibleThings.peripherals[uuid].magData.date
                    });

                for (var i = 0, len = $scope.visibleThings.peripherals[uuid].magGraphData_1[0].values.length; i < len; i++) {
                    $scope.visibleThings.peripherals[uuid].magGraphData_1[0].values[i].x = $scope.visibleThings.peripherals[uuid].magGraphData_1[0].values[i].x - 1;
                }
                if ($scope.visibleThings.peripherals[uuid].magGraphData_1[0].values.length > 20) {
                    $scope.visibleThings.peripherals[uuid].magGraphData_1[0].values.shift();
                }

                $scope.visibleThings.peripherals[uuid].magGraphData_2[0].values.push(
                    { x: $scope.visibleThings.peripherals[uuid].magData.timeNum,
                        y: $scope.visibleThings.peripherals[uuid].magData.value_2,
                        label:$scope.visibleThings.peripherals[uuid].magData.date
                    });

                for (var i = 0, len = $scope.visibleThings.peripherals[uuid].magGraphData_2[0].values.length; i < len; i++) {
                    $scope.visibleThings.peripherals[uuid].magGraphData_2[0].values[i].x = $scope.visibleThings.peripherals[uuid].magGraphData_2[0].values[i].x - 1;
                }
                if ($scope.visibleThings.peripherals[uuid].magGraphData_2[0].values.length > 20) {
                    $scope.visibleThings.peripherals[uuid].magGraphData_2[0].values.shift();
                }

                $scope.visibleThings.peripherals[uuid].magGraphData_3[0].values.push(
                    { x: $scope.visibleThings.peripherals[uuid].magData.timeNum,
                        y: $scope.visibleThings.peripherals[uuid].magData.value_3,
                        label:$scope.visibleThings.peripherals[uuid].magData.date
                    });

                for (var i = 0, len = $scope.visibleThings.peripherals[uuid].magGraphData_3[0].values.length; i < len; i++) {
                    $scope.visibleThings.peripherals[uuid].magGraphData_3[0].values[i].x = $scope.visibleThings.peripherals[uuid].magGraphData_3[0].values[i].x - 1;
                }
                if ($scope.visibleThings.peripherals[uuid].magGraphData_3[0].values.length > 20) {
                    $scope.visibleThings.peripherals[uuid].magGraphData_3[0].values.shift();
                }

                $scope.visibleThings.peripherals[uuid].magGraphData =
                    [
                        $scope.visibleThings.peripherals[uuid].magGraphData_1[0],
                        $scope.visibleThings.peripherals[uuid].magGraphData_2[0],
                        $scope.visibleThings.peripherals[uuid].magGraphData_3[0]
                    ];

             }
        }
    },4000);
    

    // ---------- Graph Code END -----------

    $scope.visibleThings.onSuccess = function(message){
        $mdToast.show(
            $mdToast.simple()
                .content(message)
                .position('top right')
                .hideDelay(4000)
                .theme("success-toast")
        );
    };

    $scope.visibleThings.onError = function(message){
        $mdToast.show(
            $mdToast.simple()
                .content(message)
                .position('top right')
                .hideDelay(2500)
                .theme("error-toast")
        );
    };

    $scope.visibleThings.updateUI = function(){
        $scope.$apply();
    };

    $scope.visibleThings.onSuccess('Scanning ....');
});