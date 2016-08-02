function Utility() {

    this.initializeData = function (scope,uuid) {
        scope.data[uuid]={temp:[],hum:[],light:[],gyro:[],acc:[],mag:[],name:'', currTempC:'', currTempF:'', currHum:'', currLight:'', currGyro:'', currAcc:'', currMag:''};
        this.initializeSingleData(scope,'temp','Temperature',uuid);
        this.initializeSingleData(scope,'hum','Humidity',uuid);
        this.initializeSingleData(scope, 'light','Light',uuid);
        this.initializeTripleData(scope,'gyro',uuid);
        this.initializeTripleData(scope, 'acc',uuid);
        this.initializeTripleData(scope, 'mag',uuid);
    };

    this.initializeSingleData = function(scope,item,name,uuid) {
        scope.data[uuid][item] = [{ values: [], key: name, color: '#2287c1' }];
    };

    this.initializeTripleData = function(scope,item,uuid) {
        scope.data[uuid][item] = [{ values: [], key: 'x',color: '#2287c1' },{ values: [], key: 'y',color: '#b3e5fc' },{ values: [], key: 'z',color: '#fbae20' }];
    };

    this.pushSingleData = function(time, value, label, data) {

        data[0].values.push(
            {
                x: time,
                y: value,
                label: label
            }
        );
    };

    this.pushTripleData = function(time, value, label, data) {
        for (var i=0; i<3; i++){
            data[i].values.push(
                {
                    x: time,
                    y: value[i],
                    label: label
                }
            )
        }
    };

    this.handleData = function(data) {
        for (var i = 0, len = data.values.length; i < len; i++) {
            data.values[i].x = data.values[i].x - 1;
        }
        if (data.values[data.values.length - 2]) {
            if ((data.values[data.values.length - 1].label) == ( data.values[data.values.length - 2].label)) {
                data.values.pop();
            }
        }
        if (Math.abs(data.values[0].x) > 299) {
            data.values.shift();
        }
    };

    this.handleTripleData = function(data) {
        this.handleData(data[0]);
        this.handleData(data[1]);
        this.handleData(data[2]);
    };

    this.preapareSingleGraph = function(inputData,outputData){
        if (!isNaN(inputData.timeNum) && !isNaN(inputData.value)) {
            this.pushSingleData(inputData.timeNum,inputData.value,inputData.date,outputData);
            this.handleData(outputData[0]);
        }
    };

    this.prepareLightData = function(inputData,outputData) {
        if (!isNaN(inputData.timeNum) && !isNaN(inputData.value[0])) {
            this.pushSingleData(inputData.timeNum, inputData.value[0], inputData.date, outputData);
            this.handleData(outputData[0]);
        }
    };

    this.prepareTripleGraph = function(inputData,outputData) {
        if (!isNaN(inputData.timeNum) && !isNaN(inputData.value[0]) && !isNaN(inputData.value[1]) && !isNaN(inputData.value[2])) {
            this.pushTripleData(inputData.timeNum,inputData.value,inputData.date,outputData);
            this.handleTripleData(outputData);
        }
    };
    
    return this;
}