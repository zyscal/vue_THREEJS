<template>
    <div>
        <el-header style="background-color: #ffffff;margin-left: 25px;margin-right: 25px;border-bottom: 1px solid rgb(28, 202, 213);">
            <font style="font-family: 'Microsoft YaHei';font-size: 30px;color: #000000;">终端设备集</font>
            <el-button type="primary" style="margin-left: 700px" @click="Refresh" >刷新</el-button>
            <el-button type="info" @click="dialogFormVisible= true" >新增一个终端设备</el-button>
        </el-header>

        <el-table :data="tableData" style="width: 96%;margin-left: 25px;margin-top: 20px">
            <el-table-column label="设备IP" prop="stm32_IPv6"  align="center"></el-table-column>
            <el-table-column label="设备名称" align="center">
                <template slot-scope="scope2">
                    <el-input v-model="tableData[scope2.$index].stm32_name"
                              placeholder="未命名设备"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="设备状态" prop="state" align="center" width="80px"></el-table-column>
            <el-table-column label="路由IP" prop="router_IPv6" align="center" width="135px"></el-table-column>
            <el-table-column label="传感器数" prop="sensor_num" align="center" width="80px"></el-table-column>
            <el-table-column label="最后通讯" prop="last_comm" width="105px" align="center"></el-table-column>
            <el-table-column label="注册时间" prop="register"  align="center"></el-table-column>
            <el-table-column label="所属电网线路"  align="center" width="135px">
                <template slot-scope="scope">
                    <el-select  v-model="values[scope.$index].value" placeholder="未定义线路">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column align="right" width="110px">
                <template slot-scope="scope3">
                    <el-button size="mini" type="success" @click="handleupdate(scope3.row.stm32_IPv6,scope3.row.stm32_name,values[scope3.$index].value)">保存修改</el-button>
                    <el-button size="mini" type="danger" @click="handledelete(scope3.row.stm32_IPv6)" style="margin-top: 2px">删除设备</el-button>
                </template>
            </el-table-column>
        </el-table>






        <el-dialog title="新的设备" :visible.sync="dialogFormVisible"
                    style="width: 1100px; margin: auto">
            <el-form ref="form"   :model="form" label-width="150px"
                     :label-position="labelPosition" >
                <el-form-item label="设备IPv6地址" align="center">
                    <el-input v-model="form.stm32_IPv6" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="设备名称" align="center">
                    <el-input v-model="form.stm32_name" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="设备状态"  >
                    <el-switch v-model="form.state" style="margin-left: 55px" ></el-switch>
                </el-form-item>
                <el-form-item label="路由IPv6地址" align="center">
                    <el-select v-model="form.router_IPv6" placeholder="请选择路由" style="width: 250px">
                        <el-option
                                v-for="item in form.routeropt"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电网线路选择" align="center">
                    <el-select v-model="form.power_ID" placeholder="电网线路" style="width: 250px">
                        <el-option
                                v-for="item in form.poweropt"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="传感器数量" align="center">
                    <el-slider v-model="form.sensor_num" style="width: 250px"></el-slider>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false,handlecancel()" >取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false,handleconfirm()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "STM32Page",
        data(){
            return{
                labelPosition: 'right',
                formLabelAlign: {
                    name: '',
                    region: '',
                    type: ''
                },
                form:{
                    stm32_IPv6:"",
                    stm32_name:"",
                    state:false,
                    routeropt:[],
                    router_IPv6:"",
                    power_ID:[],
                    poweropt:[],
                    sensor_num:0,
                },
                tableData:[],
                options: [],//power选择框
                values: [],//power备选内容
                dialogFormVisible:false,



            }
        },
        created(){
            const _this = this;
            axios("http://localhost:8181/querySTM32List").then(function (data) {
                _this.tableData = data.data;
                for(var i = 0;i<_this.tableData.length;i++){
                    if(_this.tableData[i].power_ID != null && _this.tableData[i].power_ID != ""){
                        _this.values.push({value:_this.tableData[i].power_ID})
                    }
                    else{
                        _this.values.push({value:""})
                    }
                    if(_this.tableData[i].state){
                        _this.tableData[i].state = "在线";
                    }else{
                        _this.tableData[i].state = "离线";
                    }
                    if(_this.tableData[i].last_comm != null && _this.tableData[i].last_comm == ""){
                    }else{
                        _this.tableData[i].last_comm = "未通讯";
                    }
                }
            })
            axios.get("http://localhost:8181/findallpower").then(//请求所有power
                function (data) {
                    for(var i = 0;i<data.data.length;i++){
                        _this.options.push({
                            value:data.data[i].power_ID,
                            label:data.data[i].power_name
                        })
                    }


                }
            )
            axios.get("http://localhost:8181/router").then(
                function (data) {
                    for(var i = 0;i<data.data.length;i++){
                        _this.form.routeropt.push({
                            value:data.data[i].router_IPv6,
                            label:data.data[i].router_IPv6
                        })
                    }
                }
            )
            axios.get("http://localhost:8181/findallpower").then(
                function (data) {
                    for(var i = 0;i<data.data.length;i++){
                        _this.form.poweropt.push({
                            value:data.data[i].power_ID,
                            label:data.data[i].power_name,
                        })
                    }

                }
            )
        },
        methods:{
            handleupdate(stm32_IPv6,stm32_name,power_ID){
                console.log(stm32_IPv6,stm32_name,power_ID);
                axios("http://localhost:8181/updateSTM32/" +stm32_IPv6+"/"+stm32_name+"/"+power_ID).then(
                    function (data) {
                    if (data.data){
                        alert("修改成功！");
                        window.location.reload();
                    }else{
                        alert("修改失败！");
                    }

                    }
                )

            },
            Refresh(){
                window.location.reload();
            },
            handledelete(stm32_IPv6){
                axios.get("http://localhost:8181/deleteSTM32/"+stm32_IPv6).then(
                    function (data) {
                        if (data.data){
                            alert("删除数据成功！");
                            window.location.reload();
                        }else{
                            alert("请检查服务器或传感器集！");
                        }

                    }
                )

            },
            handlecancel(){

            },
            handleconfirm(){
                //http://localhost:8181/addSTM32/fe80::1:4/test/1/fe80::1:1/2/2
                var url="http://localhost:8181/addSTM32/"+this.form.stm32_IPv6+"/"+this.form.stm32_name+"/"+this.form.state+"/"+this.form.router_IPv6+"/"+this.form.sensor_num
                + "/"+this.form.power_ID;
                console.log(url);
                console.log(this.form.stm32_name);
                axios(url).then(function (data) {
                    if (data.data){
                        alert("添加成功！");
                        window.location.reload();
                    }
                    else {
                        alert("添加失败！");
                    }

                })
            }

        },

    }
</script>

<style scoped>
    .el-dialog {
        display: flex;
        flex-direction: column;
        margin:0 !important;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        /*height:600px;*/
        max-height:calc(100% - 30px);
        max-width:calc(100% - 30px);
    }
</style>