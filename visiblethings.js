(function() {

    var gateway = null;
    var count1 = 20;
    var count2 = 20;
    var count3 = 20;
    var count4 = 20;
    var count5 = 20;
    var count10 = 20;

    class VisibleThings {
        constructor() {
            this.temperature = '';
            this.humidity = '';
            this.time = '';
            this.tempData = [];
            this.humidityData = [];

            this.peripherals = {};
            gateway = navigator.bluetooth.gateway;

            gateway.onstate = function(error) {
                if (gateway.state === C.kPoweredOn) {
                    gateway.scan(true);
                } else if (gateway.state === C.kPoweredOff) {
                    console.log('Please turn on the Bluetooth');
                } else if (gateway.state === C.kUnsupported) {
                    console.log('Bluetooth Low Energy is not supported with this device.');
                }
            };

            gateway.onscan = function(peripheral, error) {
                if (error) {
                    console.log(error.code + ': ' + error.message);
                    visibleThings.onError(error.code + ': ' + error.message);
                    return;
                }

                var adv_data_vt = peripheral.manufacturerData['1019'];

                if(adv_data_vt){
                    adv_data_vt = adv_data_vt.toUpperCase();

                    if(!visibleThings.peripherals[peripheral.uuid]){
                        peripheral.tempGraphData = [{ values: [], key: 'Temperature',color: '#2287c1' }];

                        peripheral.humidityGraphData = [{ values: [], key: 'Humidity', color: '#2287c1'}];

                        peripheral.giroGraphData_1 = [{ values: [], key: 'x', color:'#2287c1'}];
                        peripheral.giroGraphData_2 = [{ values: [], key: 'y', color: '#b3e5fc'}];
                        peripheral.giroGraphData_3 = [{ values: [], key: 'z', color: '#fbae20'}];
                        peripheral.giroGraphData = [peripheral.giroGraphData_1,peripheral.giroGraphData_2,peripheral.giroGraphData_3];

                        peripheral.accGraphData_1 = [{ values: [], key: 'x', color:'#2287c1'}];
                        peripheral.accGraphData_2 = [{ values: [], key: 'y', color:'#b3e5fc'}];
                        peripheral.accGraphData_3 = [{ values: [], key: 'z', color:'#fbae20'}];
                        peripheral.accGraphData = [peripheral.accGraphData_1,peripheral.accGraphData_2,peripheral.accGraphData_3];

                        peripheral.accGraphData_1 = [{ values: [], key: 'x', color:'#2287c1'}];
                        peripheral.accGraphData_2 = [{ values: [], key: 'y', color:'#b3e5fc'}];
                        peripheral.accGraphData_3 = [{ values: [], key: 'z', color:'#fbae20'}];
                        peripheral.accGraphData = [peripheral.accGraphData_1,peripheral.accGraphData_2,peripheral.accGraphData_3];

                        peripheral.magGraphData_1 = [{ values: [], key: 'x', color:'#2287c1'}];
                        peripheral.magGraphData_2 = [{ values: [], key: 'y', color:'#b3e5fc'}];
                        peripheral.magGraphData_3 = [{ values: [], key: 'z', color:'#fbae20'}];
                        peripheral.magGraphData = [peripheral.magGraphData_1,peripheral.magGraphData_2,peripheral.magGraphData_3];
                    }

                    var d = new Date();
                    var h = d.getHours();
                    if (h.toString().length<2){
                        h = '0'+h;
                    }
                    var m = d.getMinutes();
                    if (m.toString().length<2){
                        m = '0'+m;
                    }
                    var s = d.getSeconds();
                    if (s.toString().length<2){
                        s = '0'+s;
                    }
                    var currDate = h+':'+m+':'+s;

                    var data_array = adv_data_vt.match(/.{1,2}/g);

                    visibleThings.peripherals[peripheral.uuid] = peripheral;


                    var n=0;
                    var n2 = data_array.length;

                    while (n < n2) {

                        var n5 = '0x' + data_array[n];
                        var n3 = n5 >> 4 & 15;
                        var n4 = Math.pow(2.0, (n5 & 15) - 8);


                        switch (n3) {

                            case 1:
                            {
                                var counter_3_1 = n + 1;
                                var first_value_acc = parseInt(data_array[counter_3_1], 16) * n4;
                                var counter_5_1 = counter_3_1 + 1;
                                var second_value_acc = parseInt(data_array[counter_5_1], 16) * n4;
                                var third_value_acc =  parseInt(data_array[++counter_5_1], 16) * n4;

                                if(!isNaN(Number(first_value_acc)) && !isNaN(Number(second_value_acc)) && !isNaN(Number(third_value_acc))){
                                    visibleThings.peripherals[peripheral.uuid].accData = {
                                        timeNum: count2,
                                        date: currDate,
                                        value_1: (first_value_acc/100).toFixed(2),
                                        value_2: (second_value_acc/100).toFixed(2),
                                        value_3: (third_value_acc/100).toFixed(2)
                                    }
                                }


                                break;
                            }
                            case 2:
                            {
                                var counter_3_2 = n + 1;
                                var first_value_gyro = parseInt(data_array[counter_3_2], 16) * n4;
                                var counter_5_2 = counter_3_2 + 1;
                                var second_value_gyro = parseInt(data_array[counter_5_2], 16) * n4;
                                var third_value_gyro =  parseInt(data_array[++counter_5_2], 16) * n4;

                                first_value_gyro = first_value_gyro-125;
                                second_value_gyro = second_value_gyro-125;
                                third_value_gyro = third_value_gyro-125;

                                if(!isNaN(Number(first_value_gyro)) && !isNaN(Number(second_value_gyro)) && !isNaN(Number(third_value_gyro))){
                                    visibleThings.peripherals[peripheral.uuid].gyroData = {
                                        timeNum: count2,
                                        date: currDate,
                                        value_1: first_value_gyro,
                                        value_2: second_value_gyro,
                                        value_3: third_value_gyro
                                    }
                                }
                                break;
                            }

                            case 3:
                            {
                                var counter_3_3 = n + 1;
                                var first_value_mag = parseInt(data_array[counter_3_3], 16) * n4;
                                var counter_5_3 = counter_3_3 + 1;
                                var second_value_mag = parseInt(data_array[counter_5_3], 16) * n4;
                                var third_value_mag =  parseInt(data_array[++counter_5_3], 16) * n4;

                                if(!isNaN(Number(first_value_mag)) && !isNaN(Number(second_value_mag)) && !isNaN(Number(third_value_mag))){
                                    visibleThings.peripherals[peripheral.uuid].magData = {
                                        timeNum: count3,
                                        date: currDate,
                                        value_1: first_value_mag,
                                        value_2: second_value_mag,
                                        value_3: third_value_mag
                                    }
                                }

                                break;
                            }
                            case 4:
                            {
                                var counter_3_4 = n + 1;
                                var first_value_light = parseInt(data_array[counter_3_4], 16) * n4;
                                var counter_5_4 = counter_3_4 + 1;
                                var second_value_light = parseInt(data_array[counter_5_4], 16) * n4;
                                var third_value_light =  parseInt(data_array[++counter_5_4], 16) * n4;

                                if(!isNaN(Number(first_value_light)) && !isNaN(Number(second_value_light)) && !isNaN(Number(third_value_light))){
                                    visibleThings.peripherals[peripheral.uuid].lightData = {
                                        timeNum: count3,
                                        date: currDate,
                                        value_1: first_value_light,
                                        value_2: second_value_light,
                                        value_3: third_value_light
                                    }
                                }
                                break;
                            }
                            case 5:
                            {
                                var hex_temp = data_array[n+1] * n4;
                                var temperature = parseInt(hex_temp,16);

                                if(!isNaN(Number(temperature))){
                                    visibleThings.peripherals[peripheral.uuid].tempData = {
                                        timeNum: count5,
                                        date: currDate,
                                        temp: Number(temperature)
                                    }
                                }
                                break;

                            }

                            case 10:
                            {
                                var hex_hum = parseInt(data_array[n+1], 16);

                                var humidity = hex_hum * n4;

                                if(!isNaN(Number(humidity))){
                                    visibleThings.peripherals[peripheral.uuid].humidityData = {
                                        timeNum: count10,
                                        date: currDate,
                                        hum: Number(humidity)
                                    }
                                }

                                break;
                            }
                        }

                        n=n+2;
                    }
                    visibleThings.time = currDate;
                    visibleThings.minutes = d.getMinutes();
                    visibleThings.hours = d.getHours();
                    visibleThings.seconds = d.getSeconds();
                    visibleThings.peripherals[peripheral.uuid].acc_1 = (first_value_acc/100).toFixed(2) + ' g';
                    visibleThings.peripherals[peripheral.uuid].acc_2 = (second_value_acc/100).toFixed(2) + ' g';
                    visibleThings.peripherals[peripheral.uuid].acc_3 = (third_value_acc/100).toFixed(2) + ' g';

                    visibleThings.peripherals[peripheral.uuid].gyro_1 = first_value_gyro + ' deg/s';
                    visibleThings.peripherals[peripheral.uuid].gyro_2 = second_value_gyro + ' deg/s';
                    visibleThings.peripherals[peripheral.uuid].gyro_3 = third_value_gyro + ' deg/s';

                    visibleThings.peripherals[peripheral.uuid].mag_1 = first_value_mag + ' 10^-6T';
                    visibleThings.peripherals[peripheral.uuid].mag_2 = second_value_mag + ' 10^-6T';
                    visibleThings.peripherals[peripheral.uuid].mag_3 = third_value_mag + ' 10^-6T';

                    visibleThings.peripherals[peripheral.uuid].light_1 = first_value_light + ' klux';
                    visibleThings.peripherals[peripheral.uuid].light_2 = second_value_light + ' mW/cm2';
                    visibleThings.peripherals[peripheral.uuid].light_3 = third_value_light + ' mW/cm2';
                    visibleThings.peripherals[peripheral.uuid].temperature = temperature + ' °C';
                    visibleThings.peripherals[peripheral.uuid].humidity = humidity + ' %rH';



                    visibleThings.updateUI();
                }
            };

            gateway.onerror = function(err_msg) {
                console.log(err_msg);
                visibleThings.onError(err_msg);
            };
        }

    }

    window.visibleThings = new VisibleThings();
})();

