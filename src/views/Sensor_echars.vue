<template>
    <div height="840px" width="800px">
        <el-header style="background-color: #ffffff;margin-left: 25px;margin-right: 25px;border-bottom: 1px solid rgb(28, 202, 213);">
            <el-select v-model="value1" placeholder="请选择终端设备" style="">
                <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="value2" placeholder="请选择监控内容" style="margin-left: 14px">
                <el-option
                        v-for="item in options2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="value3" placeholder="请选择监控模式" style="margin-left:  14px">
                <el-option
                        v-for="item in options3"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-date-picker style="margin-left:  14px"
                    v-model="dataofselect"
                    type="date"
                    placeholder="选择日期">
            </el-date-picker>
            <el-button type="primary" @click="handleonclick(value1,value2,value3)" style="margin-left: 14px">查询</el-button>
            <el-button type="danger" @click="nowvalue1 = null,nowvalue2 = null" style="margin-left: 14px">停止</el-button>
        </el-header>

        <div  ref="bar_dv"  style="width:96%;height: 600px; margin-left: 25px;margin-top: 20px"></div>
    </div>

</template>

<script>
    import echarts from 'echarts'
    export default {
        name: "Sensor_echars",
        data() {
            return {
                myChart:null,
                data:[],
                Temp1281Bdata:[],
                Temp680data:[],
                Press680data:[],
                Hum680data:[],
                numofdata:0,
                dataofselect:null,
                options1:[],
                options2:[
                    {
                        value: '1281BCurrent',
                        label: '互感电流'
                    },
                    {
                        value: 'TEMP',
                        label: '温度'
                    },
                    {
                        value: 'HUMandPRESS',
                        label: '湿度气压'
                    },
                ],
                options3:[{
                    value: '1',
                    label: '正常速度'
                    },
                    {
                        value: '2',
                        label: 'X2倍速度'
                    },
                    {
                        value: '5',
                        label: 'X5倍速度'
                    },
                    {
                        value:'all',
                        label:'查看全部数据'
                    }],
                value1:null,
                value2:null,
                value3:null,
                echarts_speed:1000,
                nowvalue1:null,
                nowvalue2:null,
            }
        },
        created() {
            console.log("created")
            var urlofSTM32 = "http://localhost:8181/querySTM32List";
            const _this = this;
            axios.get(urlofSTM32).then(
                function (data) {
                    console.log(data.data)
                    for(var i = 0;i<data.data.length;i++){
                        _this.options1.push({
                            value: data.data[i].stm32_IPv6,
                            label: data.data[i].stm32_IPv6,
                        })
                    }
                    console.log(_this.options1)
                })
            console.log("created");
        },
            methods: {
                    handleonclick(value1,value2,value3){


                    if(value1 == null && value2 == null)
                    {
                        /*两个框都没选*/
                        console.log("1")
                    }
                    else if (value1 == null && value2!=null)
                    {
                        /*一选二没选*/
                        console.log("2")
                    }
                    else if(value2 == null &&value1 != null)
                    {
                        /*二选一没选*/
                        console.log("3")
                    }
                    else{
                        switch (value3) {
                            case "1":
                                this.echarts_speed = 1000;
                                break;
                            case "2":
                                this.echarts_speed = 500;
                                break;
                            case "5":
                                this.echarts_speed = 200;
                                break;
                            case "all":
                                switch (value2) {
                                    case '1281BCurrent':/*电流表*/
                                    {
                                        var url = 'http://localhost:8181/Sensor_Data/' + value1 +'/all1281BCurrent/';
                                        if(this.dataofselect == null){
                                            url += "null";
                                        }else{
                                           // this.dataofselect.getFullYear(),this.dataofselect.getMonth()+1,this.dataofselect.getDate()
                                            var month = this.dataofselect.getMonth()+1
                                            if(month < 10)
                                                month = "0"+month;
                                            var Date = this.dataofselect.getDate();
                                            if(Date < 10)
                                                Date = "0" + Date;
                                            url += this.dataofselect.getFullYear() + "-"+month+"-"+Date;
                                        }
                                        console.log(url)
                                        const _this = this;
                                        axios.get(url).then(
                                            function (data) {
                                                if(data.data != null && data.data != ""){
                                                    console.log(data.data);
                                                    _this.data = [];
                                                    for(var i = 0;i<data.data.length;i++){
                                                        if(i > 0){//从第二个数开始，如果时间重复则抛弃后面的
                                                            if(_this.data[_this.data.length - 1][0] != data.data[i].sensor_time){
                                                                _this.data.push([data.data[i].sensor_time,data.data[i].sensor_data]);
                                                            }
                                                        }else {
                                                            _this.data.push([data.data[i].sensor_time,data.data[i].sensor_data]);
                                                        }
                                                    }
                                                }
                                            })
                                        break;
                                    }
                                    case 'TEMP':/*温度表*/
                                    {
                                        var url = 'http://localhost:8181/Sensor_Data/' + value1 +'/all1281BTemp/';
                                        if(this.dataofselect == null){
                                            url += "null";
                                        }else{
                                            // this.dataofselect.getFullYear(),this.dataofselect.getMonth()+1,this.dataofselect.getDate()
                                            var month = this.dataofselect.getMonth()+1
                                            if(month < 10)
                                                month = "0"+month;
                                            var Date = this.dataofselect.getDate();
                                            if(Date < 10)
                                                Date = "0" + Date;
                                            url += this.dataofselect.getFullYear() + "-"+month+"-"+Date;
                                        }
                                        const _this = this;
                                        this.Temp1281Bdata = [];//清空缓冲区
                                        this.Temp680data = [];//清空680缓冲区
                                        axios.get(url).then(
                                            function (data) {
                                                if(data.data != null && data.data != ""){
                                                    for(var i = 0;i<data.data.length;i++){
                                                        if(i > 0){//从第二个数开始，如果时间重复则抛弃后面的
                                                            if(_this.Temp1281Bdata[_this.Temp1281Bdata.length - 1][0] != data.data[i].sensor_time){
                                                                _this.Temp1281Bdata.push([data.data[i].sensor_time,data.data[i].sensor_data]);
                                                            }
                                                        }else {
                                                            _this.Temp1281Bdata.push([data.data[i].sensor_time,data.data[i].sensor_data]);
                                                        }
                                                    }
                                                }
                                            })
                                        url = 'http://localhost:8181/Sensor_Data/' + value1 +'/all680Temp/';
                                        if(this.dataofselect == null){
                                            url += "null";
                                        }else{
                                            // this.dataofselect.getFullYear(),this.dataofselect.getMonth()+1,this.dataofselect.getDate()
                                            var month = this.dataofselect.getMonth()+1
                                            if(month < 10)
                                                month = "0"+month;
                                            var Date = this.dataofselect.getDate();
                                            if(Date < 10)
                                                Date = "0" + Date;
                                            url += this.dataofselect.getFullYear() + "-"+month+"-"+Date;

                                        }
                                        axios.get(url).then(
                                            function (data) {
                                                if(data.data != null && data.data != ""){
                                                    for(var i = 0;i<data.data.length;i++){
                                                        if(i > 0){//从第二个数开始，如果时间重复则抛弃后面的
                                                            if(_this.Temp680data[_this.Temp680data.length - 1][0] != data.data[i].sensor_time){
                                                                _this.Temp680data.push([data.data[i].sensor_time,data.data[i].sensor_data]);
                                                            }
                                                        }else {
                                                            _this.Temp680data.push([data.data[i].sensor_time,data.data[i].sensor_data]);
                                                        }
                                                    }
                                                }
                                            })
                                        break;
                                    }

                                    case 'HUMandPRESS':/*气压湿度表 20200425 周六 终于写到你了 即将结束 88*/
                                    {
                                        var url = 'http://localhost:8181/Sensor_Data/' + value1 +'/all680Hum/';
                                        if(this.dataofselect == null){
                                            url += "null";
                                        }else{
                                            // this.dataofselect.getFullYear(),this.dataofselect.getMonth()+1,this.dataofselect.getDate()
                                            var month = this.dataofselect.getMonth()+1
                                            if(month < 10)
                                                month = "0"+month;
                                            var Date = this.dataofselect.getDate();
                                            if(Date < 10)
                                                Date = "0" + Date;
                                            url += this.dataofselect.getFullYear() + "-"+month+"-"+Date;

                                        }
                                        this.Hum680data = [];
                                        this.Press680data = [];
                                        const _this = this;
                                        console.log(url);
                                        axios.get(url).then(
                                            function (data) {
                                                if(data.data != null && data.data != ""){
                                                    console.log(data.data);
                                                    for(var i = 0;i<data.data.length;i++){

                                                        if(i > 0){//从第二个数开始，如果时间重复则抛弃后面的
                                                            if(_this.Hum680data[_this.Hum680data.length - 1][0] != data.data[i].sensor_time){
                                                                _this.Hum680data.push([data.data[i].sensor_time,data.data[i].sensor_data]);
                                                            }
                                                        }else {
                                                            _this.Hum680data.push([data.data[i].sensor_time,data.data[i].sensor_data]);
                                                        }

                                                    }
                                                }
                                            })
                                        url = 'http://localhost:8181/Sensor_Data/' + value1 +'/all680Pre/';
                                        if(this.dataofselect == null){
                                            url += "null";
                                        }else{
                                            // this.dataofselect.getFullYear(),this.dataofselect.getMonth()+1,this.dataofselect.getDate()
                                            var month = this.dataofselect.getMonth()+1
                                            if(month < 10)
                                                month = "0"+month;
                                            var Date = this.dataofselect.getDate();
                                            if(Date < 10)
                                                Date = "0" + Date;
                                            url += this.dataofselect.getFullYear() + "-"+month+"-"+Date;

                                        }
                                        console.log(url);
                                        axios.get(url).then(
                                            function (data) {
                                                if(data.data != null && data.data != ""){
                                                    console.log(data.data);
                                                    for(var i = 0;i<data.data.length;i++){

                                                        if(i > 0){//从第二个数开始，如果时间重复则抛弃后面的
                                                            if(_this.Press680data[_this.Press680data.length - 1][0] != data.data[i].sensor_time){
                                                                _this.Press680data.push([data.data[i].sensor_time,data.data[i].sensor_data]);
                                                            }
                                                        }else {
                                                            _this.Press680data.push([data.data[i].sensor_time,data.data[i].sensor_data]);
                                                        }



                                                    }
                                                }
                                            })

                                        break;
                                    }
                                        break;
                                    default:
                                        break;
                                }
                        }

                        if(value1 == this.nowvalue1 && value2 == this.nowvalue2)
                        {
                            /*重复选择*/
                            console.log("4")
                            this.data = [];
                            this.Temp680data = [];
                            this.Temp1281Bdata = [];
                            this.Press680data = [];
                            this.Hum680data = [];
                        }
                        else{
                            /*非重复选择*/
                            if(this.myChart != null)
                                this.myChart.dispose();
                            //清空缓冲区
                            //清空条件：当选择了all时候，不能清空！！！
                            if(value3 != "all"){
                                this.data = [];
                                this.Temp680data = [];
                                this.Temp1281Bdata = [];
                                this.Press680data = [];
                                this.Hum680data = [];
                            }



                            this.nowvalue1 = value1;
                            this.nowvalue2 = value2;
                            //清空表格缓冲区

                            /////
                            switch (this.nowvalue2) {
                                case '1281BCurrent':/*电流表*/
                                {
                                    var url = 'http://localhost:8181/Sensor_Data/' + value1 +'/1281BCurrent';
                                    const _this = this;
                                    axios.get(url).then(
                                        function (data) {
                                            console.log(data.data)
                                            if( null != data.data && "" != data.data)
                                            {
                                                _this.handle1218BCurrent(_this.nowvalue1,_this.nowvalue2);//传参目的是便于终止当前表后台数据请求
                                            }
                                            else {
                                                console.log("查找数据失败");
                                            }
                                        })
                                    break;
                                }
                                case 'TEMP':/*温度表*/
                                {
                                    var url = 'http://localhost:8181/Sensor_Data/' + value1 +'/Temp';
                                    const _this = this;
                                    axios.get(url).then(
                                        function (data) {
                                            console.log(data.data)
                                            if( null != data.data && "" != data.data)
                                            {
                                                _this.handleTemps(_this.nowvalue1,_this.nowvalue2);//传参目的是便于终止当前表后台数据请求
                                            }
                                            else {
                                                console.log("查找数据失败");
                                            }
                                        })
                                    break;
                                }
                                case 'HUMandPRESS':/*气压湿度表*/
                                {
                                    var url = 'http://localhost:8181/Sensor_Data/' + value1 +'/HumandPre';
                                    const _this = this;
                                    axios.get(url).then(
                                        function (data) {
                                            console.log(data.data)
                                            if( null != data.data && "" != data.data)
                                            {
                                                _this.handleHumandPre(_this.nowvalue1,_this.nowvalue2);//传参目的是便于终止当前表后台数据请求
                                                console.log("after   handlehunanpre")
                                            }
                                            else {
                                                console.log("查找数据失败");
                                            }
                                        })
                                    break;
                                }
                                default:
                                    break;
                            }
                        }
                    }
                },
                handleHumandPre(value1,value2){//参数目的：当当前value1或value2改变时结束本次循环
                    if(this.nowvalue1 != value1 || this.nowvalue2 != value2){
                        console.log(value1,value2," 请求更改",this.nowvalue1,this.nowvalue2);
                    }else {
                        console.log("enter into handleHumandPre");
                        var url = 'http://localhost:8181/Sensor_Data/' + value1 +'/HumandPre';
                        const _this = this;
                        if(this.value3 != "all")
                        axios.get(url).then(
                            function (data) {
                                console.log(data.data)
                                if( data.data!=null)
                                {
                                    _this.Press680data.push([data.data[0].sensor_time,data.data[0].sensor_data]);
                                    _this.Hum680data.push([data.data[1].sensor_time,data.data[1].sensor_data]);
                                }
                            })

                        this.myChart = echarts.init(this.$refs.bar_dv);
                        // this.myChart = echarts.init(document.getElementById("main"));


                        var option = {
                            tooltip: {
                                trigger: 'axis',
                                // axisPointer: {
                                //     type: 'cross',
                                //     crossStyle: {
                                //         color: '#999'
                                //     }
                                // }
                            },
                            toolbox: {
                                feature: {
                                    dataZoom: {
                                        yAxisIndex: 'none'
                                    },
                                    restore: {},
                                    saveAsImage: {}
                                }
                            },
                                legend: {
                                    data:['湿度', '大气压强']
                                },
                            xAxis: [
                                {
                                    type:'time',
                                    splitNumber:24
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '湿度',
                                    min: 0,
                                    max: 100,
                                    // interval: 50,
                                },
                                {
                                    type: 'value',
                                    name: '大气压强',
                                    min: 102.2,
                                    max: 102,
                                    // interval: 5,
                                }
                            ],
                                dataZoom: [{

                                }, {
                                    type: 'inside'
                                }],
                            series: [
                                {
                                    name: '湿度',
                                    type: 'bar',
                                    data: this.Hum680data,
                                    showBackground: true,
                                    yAxisIndex: 0,
                                    backgroundStyle: {color: 'rgba(220, 220, 220, 0.8)'},
                                },
                                {
                                    name: '大气压强',
                                    type: 'line',
                                    data: this.Press680data,
                                    yAxisIndex: 1,
                                    symbol: 'none',
                                    lineStyle:{
                                        normal:{
                                            color:"#000000",
                                            width:1,
                                        }
                                    }

                                                // itemStyle: {
                                                //     normal: {
                                                //         color: '#8cd5c2', //改变折线点的颜色
                                                //         lineStyle: {
                                                //             color: '#0000ff' //改变折线颜色
                                                //         }
                                                //     }
                                                // },
                                }
                            ]
                        };
                        this.myChart.setOption(option);
                            setTimeout(() =>{
                                this.handleHumandPre(value1,value2);
                            },this.echarts_speed);


                    }
                },
                handleTemps(value1,value2){//参数目的：当当前value1或value2改变时结束本次循环
                    if(this.nowvalue1 != value1 || this.nowvalue2 != value2){
                        console.log(value1,value2," 请求更改",this.nowvalue1,this.nowvalue2);
                    }else {
                        console.log("enter into handle1281BTemp");
                        var url = 'http://localhost:8181/Sensor_Data/' + value1 +'/Temp';
                        const _this = this;

                        if(this.value3 != "all")
                        axios.get(url).then(
                            function (data) {
                                console.log(data.data)
                                if( data.data!=null)
                                {
                                    _this.Temp1281Bdata.push([data.data[0].sensor_time,data.data[0].sensor_data]);
                                    _this.Temp680data.push([data.data[1].sensor_time,data.data[1].sensor_data]);
                                }
                            })

                        this.myChart = echarts.init(this.$refs.bar_dv);
                        // this.myChart = echarts.init(document.getElementById("main"));
                        let option = {
                            title: {
                                text: '线圈温度与环境温度实时监控',
                            },
                            tooltip: {
                                trigger: 'axis',
                            },
                            legend: {
                                data: ['1281B温度', 'BME680温度']
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    dataZoom: {
                                        yAxisIndex: 'none'
                                    },
                                    dataView: {readOnly: false},
                                    magicType: {type: ['line', 'bar']},
                                    restore: {},
                                    saveAsImage: {}
                                }
                            },
                            dataZoom: [{

                            }, {
                                type: 'inside'
                            }],
                            xAxis: {
                                type:'time',
                                splitNumber:24
                            },
                            yAxis: {
                                min:10,
                                type: 'value',
                                axisLabel: {
                                    formatter: '{value} °C'
                                }
                            },
                            smooth: true,
                            series: [

                                {
                                    name: '最高气温',
                                    type: 'line',
                                    symbol: 'none',
                                    smooth: true,
                                    data:this.Temp1281Bdata,
                                    markPoint: {
                                        data: [
                                            {type: 'max', name: '最大值'},
                                            {type: 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'}
                                        ]
                                    },
                                    areaStyle: {
                                        normal: {
                                            color: '#8cd5c2' //改变区域颜色
                                        }
                                    },
                                },
                                {
                                    name: '最低气温',

                                    type: 'line',
                                    symbol: 'none',
                                    smooth: true,
                                    data:this.Temp680data,
                                    areaStyle: {
                                        color: ['rgba(250,250,250,0.3)','rgba(200,200,200,0.3)']
                                    },
                                    markPoint: {
                                        data: [
                                            {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'},
                                            [{
                                                symbol: 'none',
                                                x: '90%',
                                                yAxis: 'max'
                                            }, {
                                                symbol: 'circle',
                                                label: {
                                                    position: 'start',
                                                    formatter: '最大值'
                                                },
                                                type: 'max',
                                                name: '最高点'
                                            }]
                                        ]
                                    }
                                }
                            ]
                        };
                        this.myChart.setOption(option);

                            setTimeout(() =>{
                                this.handleTemps(value1,value2);
                            },this.echarts_speed);


                    }
                },
                handle1218BCurrent(value1,value2)
                {
                    if(this.nowvalue1 != value1 || this.nowvalue2 != value2)
                    {
                        console.log(value1,value2,"  请求更改！",this.nowvalue1,this.nowvalue2);
                        //跳出递归的接口

                        /*数据表格请求更改不做处理*/
                    }
                    else{
                        console.log("echarts")
                        var url = 'http://localhost:8181/Sensor_Data/' + value1 +'/1281BCurrent';
                        const _this = this;
                        if(this.value3 != "all")
                        axios.get(url).then(
                            function (data) {
                                if(data.data!=null)
                                {
                                    console.log("请求的数据是：",data.data);
                                        _this.data.push([data.data.sensor_time,data.data.sensor_data]);
                                        _this.numofdata++;
                                }
                            })

                        // this.myChart = echarts.init(document.getElementById("main"));

                        this.myChart = echarts.init(this.$refs.bar_dv);
                        let option = {
                            grid:{
                                x:50,
                                y:50,
                                x2:50,
                                y2:60,
                                borderWidth:10
                            },
                            title: {
                                text: '1281B_Current'
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            xAxis: {

                                ////
                                type:'time',
                                splitNumber:24
                                ////

                                // data: this.data.map(function (item) {
                                //     return item[0];
                                // })
                            },
                            yAxis: {
                                splitLine: {
                                    show: false
                                }
                            },
                            toolbox: {
                                left: 'center',
                                feature: {
                                    dataZoom: {
                                        yAxisIndex: 'none'
                                    },
                                    restore: {},
                                    saveAsImage: {}
                                }
                            },
                            dataZoom: [{
                            }, {
                                type: 'inside'
                            }],
                            visualMap: {
                                precision:2,
                                top: 10,
                                right: 10,
                                pieces: [{
                                    gt: 0,
                                    lte: 0.2,
                                    color: '#096'
                                }, {
                                    gt: 0.2,
                                    lte: 0.225,
                                    color: '#ffde33'
                                }, {
                                    gt: 0.225,
                                    lte: 0.25,
                                    color: '#ff9933'
                                }, {
                                    gt: 0.25,
                                    lte: 0.275,
                                    color: '#cc0033'
                                }, {
                                    gt: 0.275,
                                    lte: 0.3,
                                    color: '#660099'
                                }, {
                                    gt: 0.3,
                                    color: '#7e0023'
                                }],
                                outOfRange: {
                                    color: '#999'
                                }
                            },
                            series: [
                                {
                                    name: '1281B_Current',
                                    type: 'line',
                                    symbol: 'none',
                                    data:this.data,
                                    // data: this.data.map(function (item) {
                                    //     return item[1];
                                    // }),
                                    markLine: {
                                        silent: true,
                                        data: [{
                                            yAxis: 50
                                        }, {
                                            yAxis: 100
                                        }, {
                                            yAxis: 150
                                        }, {
                                            yAxis: 200
                                        }, {
                                            yAxis: 300
                                        }]
                                    }
                                }
                            ]
                        };
                        this.myChart.setOption(option);
                        setTimeout(() =>{
                            this.handle1218BCurrent(value1,value2);
                        },this.echarts_speed);

                }
                },

        mounted() {
            console.log("mounted");
        }


        }
    }
</script>

<style scoped>

</style>