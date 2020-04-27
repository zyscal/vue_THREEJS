<template>

    <el-container style="height: 754.4px;">
        <el-aside height="100%" width="300px" style="background-color: #343131;">
            <el-menu router  :default-openeds="['1','0']" style="border:0px;background-color: #343131;">

                    <div class="block"height="150px">
                        <el-carousel height="150px" direction="vertical">
                            <el-carousel-item align="center">
                                <el-row>
                                    <font id="clock" style="font-family: clock;font-size: 85px;color: white"></font>
                                </el-row>
                                <el-row>
                                    <font id="date" style="font-family:'Microsoft YaHei';font-size: 25px;color: white"></font>
                                </el-row>

                            </el-carousel-item>
                            <el-carousel-item style="background-color: 	#90EE90">
                                <el-row style="text-align: center">
                                    <font id="messages1" style="font-family:'Microsoft YaHei';font-size: 55px;color: white;">实时监控</font>
                                </el-row>
                                <el-row style="text-align: center" >
                                    <font id="messages2" style="font-family:'Microsoft YaHei';font-size: 45px;color: white;">安全</font>
                                </el-row>
                            </el-carousel-item>
                            <el-carousel-item style="background-color: #F0879B">
                                <el-row style="text-align: center">
                                    <font style="font-family:'Microsoft YaHei';font-size: 30px;color: white;">实时监控</font>
                                </el-row>

                                <el-row style="margin-left: 55px" >
                                    <font id="Current" style="font-family:'Microsoft YaHei';font-size: 25px;color: white;"></font>
                                    <font id="Resistor" style="font-family:'Microsoft YaHei';font-size: 25px;color: white;float: right;margin-right: 55px"></font>
                                </el-row>
                                <el-row style="margin-left: 55px">
                                    <font id="Watt" style="font-family:'Microsoft YaHei';font-size: 25px;color: white;"></font>
                                    <font id="Temp" style="font-family:'Microsoft YaHei';font-size: 25px;color: white;float: right;margin-right: 55px"></font>

                                </el-row>

                                <el-row style="margin-left: 55px">
                                    <font id="Hum" style="font-family:'Microsoft YaHei';font-size: 25px;color: white"></font>
                                    <font id="Press" style="font-family:'Microsoft YaHei';font-size: 25px;color: white;float: right;margin-right: 32px"></font>
                                </el-row>
                            </el-carousel-item>
                        </el-carousel>
                    </div>

                <el-submenu v-for="(item,index) in $router.options.routes" :index="index + ''" :key="index"
                style="color: #343131">
                    <template slot="title"><i class="el-icon-setting"></i> <font color="white" style="font-size: large">{{item.name}}</font></template>

                    <el-menu-item v-for="(item2,index2) in item.children":index="item2.path + ''" :key="item2.path"
                                  :class="$route.path == item2.path?'is-active':''" style="background-color: #D9D9D9;
                                    ">  {{item2.name}}</el-menu-item>

                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main >
            <router-view></router-view>
        </el-main>

    </el-container>
</template>

<script>
    export default {
        name: "Index",
        data(){
          return{
              Current:0,
              Temp:0,
              Press:0,
              Hum:0,
              Watt:0,
              Resistor:0,
          }
        },
        methods:{
            getByClass(name){
                //如果浏览器支持 会得到一个函数体
                if(document.getElementsByClassName){
                    return document.getElementsByClassName(name);
                }
                //把所有的元素获取到
                var allItems = document.getElementsByTagName("*");
                var newArr = [];
                //查找每一个元素的className 看其中含不含name
                for(var i = 0; i < allItems.length; i++){
                    var classNames = allItems[i].className;//"test test11"
                    var arrClass = classNames.split(" ");
                    for(var j = 0; j <　arrClass.length; j++){
                        if(arrClass[j]==name){
                            newArr.push(allItems[i]);
                        }
                    }
                }
                return newArr;
            },
            souttime(){
                var clock = document.getElementById("clock");
                var date = document.getElementById("date");
                var time = new Date();
                var hour;
                var minute;
                var second;
                var Month = time.getMonth()+1;
                var year = time.getFullYear();
                var datetime = time.getDate()+1;
                var week = "";
                switch (time.getDay()) {
                    case 0:
                        week = '日';
                        break;
                    case 1:
                        week = '一';
                        break;
                    case 2:
                        week = '二';
                        break;
                    case 3:
                        week = '三';
                        break;
                    case 4:
                        week = '四';
                        break;
                    case 5:
                        week = '五';
                        break;
                    case 6:
                        week = '六';
                        break;

                }
                if(time.getMinutes()<10)
                    minute = "0"+time.getMinutes();
                else
                    minute = time.getMinutes();
                if(time.getHours()<10)
                    hour = "0"+time.getHours();
                else
                    hour = time.getHours();
                if(time.getSeconds()<10)
                    second = "0"+time.getSeconds();
                else
                    second = time.getSeconds();
                clock.innerText = hour + ":" + minute + ":" + second;
                date.innerText = year+"年"+Month+"月"+datetime+"日"+"  星期"+week;
                // console.log(time.getHours(),":",time.getMinutes(),":",time.getSeconds());
                setTimeout(() =>{
                    this.souttime();
                },1000);
            },
            SetTHP(){
                const _this = this;
                var url = "http://localhost:8181/Sensor_Data/2001:db8:0:0:0:0:0:24/1281BCurrent";// 电流
                axios.get(url).then(
                    function (data) {
                        if (data.data != null) {
                            _this.Current = data.data.sensor_data;
                            if (_this.Current != 0) {
                                var setCurrent = document.getElementById("Current");
                                setCurrent.innerText = _this.Current.toFixed(2) + " A";
                                _this.Resistor = 220 / _this.Current;
                                var setResistor = document.getElementById("Resistor");
                                setResistor.innerText = _this.Resistor.toFixed(0) + " Ω";
                            } else {
                                _this.Resistor = 0;
                            }
                            _this.Watt = 220*_this.Current;
                            var setWatt = document.getElementById("Watt");
                            setWatt.innerText = _this.Watt.toFixed(1) + " W";
                        }
                    }
                )
                url = "http://localhost:8181/Sensor_Data/2001:db8:0:0:0:0:0:24/Temp";
                axios.get(url).then(
                    function (data) {
                        if(data.data != null){
                            _this.Temp = data.data[0].sensor_data;
                            var setTemp = document.getElementById("Temp");
                            setTemp.innerText = _this.Temp.toFixed(1) + " ℃";
                        }
                    }
                )
                url = "http://localhost:8181/Sensor_Data/2001:db8:0:0:0:0:0:24/HumandPre"
                axios.get(url).then(
                    function (data) {
                        if(data.data != null){
                            _this.Press = data.data[0].sensor_data;
                            _this.Hum = data.data[1].sensor_data;
                            var setHum = document.getElementById("Hum");
                            setHum.innerText = _this.Hum.toFixed(1) + " %";
                            var setPress = document.getElementById("Press");
                            setPress.innerText = _this.Press.toFixed(1) + " kPa";
                        }
                    }
                )
                setTimeout(()=>{
                    this.SetTHP();
                },1000 * 60)//没分钟刷新
            }
        },
        created(){

        },
        mounted(){
            // console.log("created")
            this.souttime();
            this.SetTHP();//实时拿湿度、温度、大气压,电流，电阻，电功率
            var setCurrent = document.getElementById("Current");
            setCurrent.innerText = this.Current + " A";
            var setResistor = document.getElementById("Resistor");
            setResistor.innerText = this.Resistor + " Ω";
            var setWatt = document.getElementById("Watt");
            setWatt.innerText = this.Watt + " W";
            var setTemp = document.getElementById("Temp");
            setTemp.innerText = this.Temp + " ℃";
            var setHum = document.getElementById("Hum");
            setHum.innerText = this.Hum + " %";
            var setPress = document.getElementById("Press");
            setPress.innerText = this.Press + " kPa";
        }

    }
</script>

<style>

</style>
<style>
    .el-menu-item.is-active {
        background-color: #ffffff !important;
    }
    .el-submenu__title:hover{
        background-color: #343131;
    }

    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #99a9bf;
    }

</style>