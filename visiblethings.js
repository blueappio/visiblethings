(function() {

    var gattip = null;
    var count = 0;
    function VisibleThings() {
            var perId = 0;
            this.peripherals = {};
            gattip = navigator.bluetooth.gattip;

            gattip.once('ready', function(gateway) {
                console.log('ready');

                function onScan(peripheral) {
                    var mfrData;

                    if (peripheral.advdata && !isEmpty(peripheral.advdata.manufacturerData)) {
                        mfrData = peripheral.advdata.manufacturerData['1019'];
                    } else {
                        mfrData = peripheral.getMfrData('1019');
                    }

                    // console.log(mfrData);

                    if (mfrData) {
                        mfrData = mfrData.toUpperCase();
                        var d = new Date();
                        var currDate = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();

                        var data_array = mfrData.match(/.{1,2}/g);

                        visibleThings.peripherals[peripheral.uuid] = peripheral;

                        var n = 0;
                        var n2 = data_array.length;

                        while (n < n2) {

                            var n5 = '0x' + data_array[n];
                            var rawData = n5 >> 4 & 15;
                            var multiplier = Math.pow(2.0, (n5 & 15) - 8);

                            switch (rawData) {

                                case 1:
                                {
                                    var extractedAcc = extractTripletData(n,multiplier,data_array);
                                    extractedAcc = extractedAcc.map(function(value) {
                                        return value > 127 ? value - 255 : value;
                                    });
                                    extractedAcc = extractedAcc.map(function(value) {
                                        return (value/100).toFixed(2);
                                    });
                                    storeTripleData(visibleThings.peripherals[peripheral.uuid], 'accData', extractedAcc, count, currDate);
                                    break;
                                }
                                case 2:
                                {
                                    var extractedGyro = extractTripletData(n,multiplier,data_array);
                                    extractedGyro = extractedGyro.map(function(value) {
                                        return value > 127 ? value - 255 : value;
                                    });
                                    storeTripleData(visibleThings.peripherals[peripheral.uuid], 'gyroData', extractedGyro, count, currDate);
                                    break;
                                }
                                case 3:
                                {
                                    var extractedMag = extractTripletData(n,multiplier,data_array);
                                    extractedMag = extractedMag.map(function(value) {
                                        return value > 127 ? value - 255 : value;
                                    });
                                    storeTripleData(visibleThings.peripherals[peripheral.uuid], 'magData', extractedMag, count, currDate);
                                    break;
                                }
                                case 4:
                                {
                                    var extractedLight = extractTripletData(n,multiplier,data_array);
                                    storeTripleData(visibleThings.peripherals[peripheral.uuid], 'lightData', extractedLight, count, currDate);
                                    break;
                                }
                                case 5:
                                {
                                    if (data_array[n]=='58') {
                                        var extractedTemp = extractOneData(n,multiplier,data_array);
                                        storeTempData(visibleThings.peripherals[peripheral.uuid], 'tempData', extractedTemp, count, currDate);
                                    }
                                    break;
                                }
                                case 10:
                                {
                                    var extractedHum = extractOneData(n,multiplier,data_array);
                                    storeHumData(visibleThings.peripherals[peripheral.uuid], 'humidityData', extractedHum, count, currDate);
                                    break;
                                }
                            }
                            n = n + 2;
                        }
                    }
                }
                gateway.scan();
                gateway.on('scan', onScan);
            });

            gattip.on('error', function(err) {
                console.log(err);
            });
    }

    window.visibleThings = new VisibleThings();
})();

function extractOneData(n,multiplier,data_array) {
    var hex_data = data_array[n + 1];
    return data = parseInt(hex_data, 16) * multiplier;
}

function extractTripletData(n,multiplier,data_array) {
    var counter= n + 1;
    var counter1=counter+1;
    var value=[];
    value[0]= parseInt(data_array[counter], 16) * multiplier;
    value[1]= parseInt(data_array[counter1], 16) * multiplier;
    value[2]= parseInt(data_array[++counter1], 16) * multiplier;
    return value;
}

function storeTripleData(peripheral, data, extracted, count, currDate) {
    if (!isNaN(Number(extracted[0])) && !isNaN(Number(extracted[1])) && !isNaN(Number(extracted[2]))) {
        peripheral[data] = {
            timeNum: count,
            date: currDate,
            value: extracted
        };
    }
}

function storeTempData(peripheral, data, extracted, count, currDate) {
    if (!isNaN(Number(extracted))){
        peripheral[data] = {
            timeNum: count,
            date: currDate,
            value: extracted,
            fahrenheit: extracted * 9 / 5 + 32
        };
    }
}

function storeHumData(peripheral, data, extracted, count, currDate) {
    if (!isNaN(Number(extracted))){
        peripheral[data] = {
            timeNum: count,
            date: currDate,
            value: extracted
        };
    }
}

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});
}