<template>
    <div class="block">
        <el-header style="background-color: #ffffff;margin-left: 25px;margin-right: 25px;border-bottom: 1px solid rgb(28, 202, 213);">
            <font style="font-family: 'Microsoft YaHei';font-size: 30px;color: #000000;">传感器集</font>
            <el-button type="primary" @click="handlerefrash()" style="margin-left: 710px">刷新</el-button>
            <el-button type="info" @click="dialogFormVisible= true" >批量添加传感器设备</el-button>

        </el-header>

        <el-table :data="tableData" style="width: 96%;margin-left: 25px;margin-top: 20px" >
            <el-table-column label="传感器ID" prop="sensor_ID" align="center" width="100px" ></el-table-column>
            <el-table-column label="传感器名称" align="center">
                <template slot-scope="scope">
                    <el-input v-model="tableData[scope.$index].sensor_name" placeholder="未命名设备"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="传感器类型" prop="type_ID" align="center"></el-table-column>
            <el-table-column label="传感器状态" align="center">
                <template slot-scope="scope2">
                    <el-switch
                            v-model="tableData[scope2.$index].sensor_state"
                            disabled>
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="所属STM32设备IP" prop="stm32_IPv6" align="center"></el-table-column>
            <el-table-column align="right">
                <template slot-scope="scope3">
                    <el-button size="mini" type="success" @click="handleconfirm(nowpage,tableData[scope3.$index].sensor_ID,tableData[scope3.$index].sensor_name)">保存修改</el-button>
                    <el-button size="mini" type="danger" @click="handledelete(nowpage,tableData[scope3.$index].sensor_ID)">删除设备</el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-pagination
                layout="prev, pager, next"
                :total="50"
                @current-change="handleCurrentChange"
               style="text-align: center; ">
        </el-pagination>

        <el-dialog title="批量添加传感器设备" :visible.sync="dialogFormVisible" style="width: 1200px;margin: auto" align="center"  >

                <el-form  ref="form"   :model="form" label-width="150px"
                          :label-position="form.labelPosition"   >
                    <el-form-item label="请选择目标设备">
                        <el-select v-model="form.stm32values" multiple placeholder="请选择STM32设备" style="width: 250px">
                            <el-option v-for="item in form.stm32options"
                                       :key="item.value" :label="item.label":value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="请选择传感器类型集">
                        <el-select v-model="form.sensorvalues" multiple placeholder="请选择传感器类型" style="width: 250px">
                            <el-option v-for="item in form.sensoroptions" :key="item.value" :label="item.label":value="item.value"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="每种传感器数量">
                        <el-input-number v-model="form.num" @change="handleChange"
                                         :min="1" :max="10" label="描述文字" style="width: 250px"></el-input-number>
                    </el-form-item>
                    <el-form-item label="设备状态" >
                        <el-switch v-model="form.state" ></el-switch>
                    </el-form-item>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false,handlecancel()" >取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false,handleconfirmform()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SensorPage",
        data(){
            return{
                form:{
                    state:true,
                    labelPosition:'right',
                    stm32options: [],
                    sensoroptions: [],
                    stm32values: [],
                    sensorvalues: [],
                    num: 5,
                    allsuccessnum:0,
                },
                dialogFormVisible:false,
                tableData:[],
                nowpage:1,//记录当前页号，辅助刷新本页
            }
        },
        methods:{
            handlerefrash(){
                window.location.reload();
            },
            handleChange(value) {
                console.log(value);
            },
            handlecancel(){

            },
            handleconfirmform(){
                this.allsuccessnum = 0;
                const _this = this;
                for (var i = 0;i<this.form.stm32values.length;i++){
                    for(var j = 0;j<this.form.sensorvalues.length;j++){
                        for(var k = 0;k<this.form.num;k++){
                            // console.log(this.form.stm32values[i],this.form.sensorvalues[j],k);
                            axios.get("http://localhost:8181/insertsensor/"+this.form.stm32values[i]+"/"+this.form.sensorvalues[j]+"/"+this.form.state).then(
                                function (data) {
                                    if(data.data){
                                        _this.allsuccessnum++;
                                    }
                                    else {
                                        alert("批量添加失败！");
                                        return;
                                    }
                                }
                            )
                        }
                    }
                }
            },
            handleconfirm(nowpage,sensor_ID,sensor_name){
                const _this = this;
                axios("http://localhost:8181/updateSensor/" + sensor_ID+"/"+sensor_name).then(
                    function (data) {
                        if(data.data){
                            alert("修改成功！");
                            axios("http://localhost:8181//findsensorbypage/"+nowpage).then(
                                function (data) {
                                    _this.tableData = data.data;
                                    for(var i = 0;i<_this.tableData.length;i++){
                                        const _i = i;
                                        axios("http://localhost:8181/findsensortype/"+_this.tableData[i].type_ID).then(function (data) {

                                            if(data.data != null && data.data != ""){
                                                _this.tableData[_i].type_ID = data.data + "";
                                            }else{

                                                _this.tableData[_i].type_ID = "未命名设备类型"
                                            }
                                        })
                                    }
                                }
                            )
                        }

                    }
                )



            },
            handleCurrentChange(currentPage){
                this.nowpage = currentPage;
                console.log(currentPage);
                const _this = this;
                axios("http://localhost:8181//findsensorbypage/"+currentPage).then(
                    function (data) {
                        _this.tableData = data.data;
                        for(var i = 0;i<_this.tableData.length;i++){
                            const _i = i;
                            axios("http://localhost:8181/findsensortype/"+_this.tableData[i].type_ID).then(function (data) {

                                if(data.data != null && data.data != ""){
                                    _this.tableData[_i].type_ID = data.data;
                                }else{

                                    _this.tableData[_i].type_ID = "未命名设备类型"
                                }
                            })
                        }
                        })
            },
            handledelete(nowpage,sensor_ID){
                const _this = this;
                axios("http://localhost:8181/deleteSensor/"+sensor_ID).then(
                    function (data) {
                        if(data.data){
                            alert("删除成功！");
                            axios("http://localhost:8181/findsensorbypage/"+nowpage).then(
                                function (data) {
                                    _this.tableData = data.data;

                                    for(var i = 0;i<_this.tableData.length;i++){
                                        const _i = i;
                                        axios("http://localhost:8181/findsensortype/"+_this.tableData[i].type_ID).then(function (data) {

                                            if(data.data != null && data.data != ""){
                                                _this.tableData[_i].type_ID = data.data + "";
                                            }else{

                                                _this.tableData[_i].type_ID = "未命名设备类型"
                                            }
                                        })
                                    }

                                }
                            )
                        }else {
                            alert("删除失败！");
                        }

                    }
                )
            }
        },
        created(){
            const _this = this;
            axios("http://localhost:8181/findsensorbypage/1").then(
                function (data) {
                    _this.tableData = data.data;
                    for(var i = 0;i<_this.tableData.length;i++){
                        const _i = i;
                        axios("http://localhost:8181/findsensortype/"+_this.tableData[i].type_ID).then(function (data) {

                            if(data.data != null && data.data != ""){
                                _this.tableData[_i].type_ID = data.data + "";
                            }else{

                                _this.tableData[_i].type_ID = "未命名设备类型"
                            }
                        })
                    }
                }
            )

            axios.get("http://localhost:8181/querySTM32List").then(
                function (data) {
                    for(var i = 0;i<data.data.length;i++){
                        _this.form.stm32options.push({
                            value:data.data[i].stm32_IPv6,
                            label:data.data[i].stm32_IPv6
                        })
                    }

                }
            )
            axios.get("http://localhost:8181/findallsensortype").then(
                function (data) {
                    for(var i = 0;i<data.data.length;i++){
                        _this.form.sensoroptions.push({
                            value:data.data[i].type_ID,
                            label:data.data[i].type_name
                        })
                    }


                }
            )
        }
    }
</script>

<style scoped>

</style>