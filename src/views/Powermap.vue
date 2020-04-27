<template>
    <div style="width: 100%">
        <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">设置</el-button>
        <el-drawer
                :visible.sync="drawer"
                :direction="direction"
                :with-header="false"
                style="font-size: 25px;outline: 0"
                size="45%">

            <div  style="margin-top: 30px">
                <div align="left">
                    <label style="margin-left: 30px; font-size: 25px;font-family:'Microsoft YaHei;color:#72767B" >电网线—传感器关系设置</label>
                </div>
                <div align="center" style="margin-top: 50px">
                    <el-select v-model="valueofgrid" placeholder="请选择电网线路" style="width: 250px">
                        <el-option
                                v-for="item in power_grid"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button @click="handlerefrashgrid()" type="primary" style="margin-left: 16px;">查找</el-button>
                </div>

            </div>

            <div align="center" style="margin-top: 50px">
                <el-transfer
                        :disabled=true
                        style="text-align: left; display: inline-block;"
                        v-model="value"
                        filterable
                        :titles="['可使用传感器集', '已使用传感器集']"
                        :format="{noChecked: '${total}',hasChecked: '${checked}/${total}'}"
                        @change="handleChange"
                        :data="datamove"
                        >
                </el-transfer>
            </div>


            <div  align="center" style="margin-top: 75px">
                <el-button @click="" style="width: 250px">取 消</el-button>
                <el-button type="primary" @click="handleconfirm()" style="width: 250px;margin-left: 50px">确定</el-button>
            </div>

        </el-drawer>
        <div id="Powermap" style="width: 100%;height: 600px;">
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        data(){
            return{
                mychart:[],
                form:{
                    labelPosition:'right',
                },
                power_grid:[],
                drawer: false,
                direction: 'rtl',
                datamove:[],
                datarealstate:[],//刷新后datamove中的disable都为false，本数组存储真实状态
                value: [],//value中有谁的key谁就去右边
                valueofgrid:[],
                datatree:{
                    "nodes": [],
                    "links": []},
            }
        },
        methods:{
            handleconfirm(){
             window.location.reload();
            },
            handleChange(value, direction, movedKeys) {

                //  console.log(movedKeys);
                // console.log(this.valueofgrid)
                if(direction == "right"){
                    for(var i = 0;i<movedKeys.length;i++){
                        axios.get("http://localhost:8181/insertpower_sensor/"+this.valueofgrid+"/"+movedKeys[i]).then(
                            function (data) {
                                if(data.data){

                                }else {
                                    alert("添加关系失败！")
                                }

                            }
                        )
                    }
                }else{
                    for(var i = 0;i<movedKeys.length;i++){
                        axios.get("http://localhost:8181/deletepower_sensor/"+this.valueofgrid+"/"+movedKeys[i]).then(
                            function (data) {
                                if (data.data){

                                }else{
                                    alert("删除关系失败！");
                                }

                            }
                        )
                    }
                }
            },
            handlerefrashgrid(){
                this.value = [];
                if(this.valueofgrid != null && this.valueofgrid != ""){//选择框已选内容
                    for(var i = 0;i<this.datamove.length;i++){
                        this.datamove[i].disabled = this.datarealstate[i];
                    }
                    //查询关系并向右侧添加
                    const _this = this;
                    axios.get("http://localhost:8181/findpower_sensorbypower/"+this.valueofgrid).then(
                        function (data) {
                            for(var i = 0;i<data.data.length;i++){
                                _this.value.push(data.data[i].sensor_ID);
                            }

                        }
                    )
                }
            }
        },
        mounted(){
            setTimeout(() =>{
                for(var i = 0;i<this.datatree.nodes.length;i++){
                    // console.log(this.datatree.nodes[i].name);
                }
                for(var i = 0;i<this.datatree.links.length;i++){
                    // console.log(this.datatree.links[i].source," ",this.datatree.links[i].target);
                }
                this.myChart = echarts.init(document.getElementById("Powermap"));
                var option = {
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: 'item',
                        triggerOn: 'mousemove'
                    },
                    series: [
                        {
                            right:'15%',
                            type: 'sankey',
                            data: this.datatree.nodes,
                            links: this.datatree.links,
                            focusNodeAdjacency: true,
                            levels: [{
                                depth: 0,
                                itemStyle: {
                                    color: '#fbb4ae'
                                },
                                lineStyle: {
                                    color: 'source',
                                    opacity: 0.6
                                }
                            }, {
                                depth: 1,
                                itemStyle: {
                                    color: '#b3cde3'
                                },
                                lineStyle: {
                                    color: 'source',
                                    opacity: 0.6
                                }
                            }, {
                                depth: 2,
                                itemStyle: {
                                    color: '#ccebc5'
                                },
                                lineStyle: {
                                    color: 'source',
                                    opacity: 0.6
                                }
                            }, {
                                depth: 3,
                                itemStyle: {
                                    color: '#decbe4'
                                },
                                lineStyle: {
                                    color: 'source',
                                    opacity: 0.6
                                }
                            }],
                            lineStyle: {
                                curveness: 0.5
                            }
                        }
                    ]
                }
               this.myChart.setOption(option);


            },1000);


        },
        created(){
            const _this = this;


            axios.get("http://localhost:8181/findallpower").then(
                function (data) {
                    for(var i =0;i<data.data.length;i++){
                        _this.power_grid.push({
                            value:data.data[i].power_ID,
                            label:data.data[i].power_name
                        })
                        //原算法为在查找到所有电力线路时添加端点，导致如果没有连接关系则孤独点仍会显示，现算法为在添加链接时添加点
                        // _this.datatree.nodes.push({
                        //     "name":data.data[i].power_name+"_N",
                        //     depth: 0
                        // })
                        // _this.datatree.nodes.push({
                        //     "name":data.data[i].power_name+"_L",
                        //     depth: 3
                        // })
                    }


                }
            )
            axios.get("http://localhost:8181/findallsensor").then(
                function (data) {
                    if(data.data != null &&data.data != ""){
                        for(var i = 0;i<data.data.length;i++){
                            _this.datamove.push({
                                key: data.data[i].sensor_ID,
                                label: data.data[i].sensor_name+" "+data.data[i].sensor_ID,
                                disabled: true,
                            })
                            _this.datarealstate.push(!data.data[i].sensor_state);
                            _this.datatree.nodes.push({
                                "name":data.data[i].sensor_name+" "+data.data[i].sensor_ID,
                                depth: 1
                            })
                            const _sensor_name = data.data[i].sensor_name;
                            const _sensor_ID = data.data[i].sensor_ID;
                            axios.get("http://localhost:8181/findSTM32byIP/" + data.data[i].stm32_IPv6).then(
                                function (data) {
                                    _this.datatree.links.push({
                                        "source":_sensor_name+" "+_sensor_ID,
                                        "target":data.data.stm32_name+" "+data.data.stm32_IPv6,
                                        "value":0.00964970063322223,
                                    })

                                }
                            )

                        }
                    }
                }
            )
            axios.get("http://localhost:8181/querySTM32List").then(
                function (data) {
                    if(data.data!= null &&data.data != ""){
                        for(var i = 0;i<data.data.length;i++){
                            _this.datatree.nodes.push({
                                "name":data.data[i].stm32_name+" "+data.data[i].stm32_IPv6,
                                depth: 2
                            })
                            const _stm32_name = data.data[i].stm32_name+"";
                            const _stm32_IPv6 = data.data[i].stm32_IPv6+"";
                            axios.get("http://localhost:8181/findpower_namebyID/"+data.data[i].power_ID).then(
                                function (data) {
                                    var check = false;
                                    for(var i = 0;i<_this.datatree.nodes.length;i++){
                                        if(_this.datatree.nodes[i].name == data.data+"_L"){
                                            console.log("重复添加！");
                                            check = true;
                                            break;
                                        }
                                    }
                                    if(!check){
                                        _this.datatree.nodes.push({
                                            "name":data.data+"_L",
                                            depth:3,
                                        })
                                    }
                                    _this.datatree.links.push({
                                        "source":_stm32_name+" "+_stm32_IPv6,
                                        "target":data.data+"_L",
                                        "value":0.00964970063322223
                                    })

                                }
                            )
                        }
                    }

                }
            )
            axios.get("http://localhost:8181/findallpower_sensor").then(
                function (data) {
                    if (data.data != null && data.data != null){
                        for(var i = 0;i<data.data.length;i++){
                            const _sensor_ID = data.data[i].sensor_ID;
                            axios.get("http://localhost:8181/findpower_namebyID/"+data.data[i].power_ID).then(//获取电力线名字
                                function (data) {
                                    const  _power_name = data.data;
                                    axios.get("http://localhost:8181/findsensor_namebyid/"+_sensor_ID).then(
                                        function (data) {
                                            var check = false;
                                            for(var i = 0;i<_this.datatree.nodes.length;i++){
                                                if(_this.datatree.nodes[i].name == _power_name+"_N"){
                                                    console.log("重复添加")
                                                    check = true;
                                                    break;
                                                }
                                            }
                                            if(!check){
                                                _this.datatree.nodes.push({
                                                    "name":_power_name+"_N",
                                                    depth: 0
                                                })
                                            }
                                            _this.datatree.links.push({
                                                "source":_power_name+"_N",
                                                "target":data.data+" "+_sensor_ID,
                                                "value":0.00964970063322223
                                            })

                                        }
                                    )

                                }
                            )

                        }
                        // {"source": "Access to land", "target": "Hazelnuts (Organic)", "value": 0.00964970063322223},
                    }

                }
            )



        }
    }
</script>

<style scoped>

</style>