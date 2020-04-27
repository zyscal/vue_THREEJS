<template>
    <div>
        <el-header style="background-color: #ffffff;margin-left: 25px;margin-right: 25px;border-bottom: 1px solid rgb(28, 202, 213);">
            <div>
                <font style="font-family: 'Microsoft YaHei';font-size: 30px;color: #000000">路由设备集</font>
                <el-button style="margin-left: 550px" type="primary" @click="Refresh">刷新</el-button>
                <el-button type="info" @click="dialogFormVisible2 = true">新增一个路由节点</el-button>
                <el-button type="success" @click="testconnect24()">测试STM32连接</el-button>
            </div>

        </el-header>

    <el-table :data="tableData" style="margin-top: 20px;margin-left: 25px;width: 96%" >
        <el-table-column
                label="路由IPv6地址"
                prop="router_IPv6">
        </el-table-column>
        <el-table-column
                label="路由名称"
                prop="router_name">
        </el-table-column>
        <el-table-column
                label="在线设备数量"
                prop="online">
        </el-table-column>
        <el-table-column
                label="总设备数量"
                prop="total_terminal">
        </el-table-column>
        <el-table-column align="right">
            <template slot-scope="scope">
                <el-button
                        size="mini" type="text"
                        @click="handleEdit(scope.$index, scope.row),dialogFormVisible = true">Edit</el-button>
                <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
            </template>
        </el-table-column>
    </el-table>


        <el-dialog title="添加一个路由器" :visible.sync="dialogFormVisible2" style="width: 1100px; margin: auto">
            <el-form :model="form_newrouter">
                <el-form-item label="router_name" :label-width="formLabelWidth">
                    <el-input v-model="form_newrouter.router_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="router_IPv6" :label-width="formLabelWidth">
                    <el-input v-model="form_newrouter.router_IPv6" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible2 = false"  >取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible2 = false,handle_newrouter()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import Global from '@/api/global_variable'
    export default {
        data() {
            return {
                tableData2:[
                    {
                        router_IPv6:'222',
                        router_name:'22',
                        online:1,
                        total_terminal:1
                    }
                ],
                tableData:[
                    {
                        router_IPv6:'',
                        router_name:'',
                        online:'',
                        total_terminal:''
                    }
                ],

                dialogFormVisible2:false,
                form:{
                    router_name:"",
                    router_IPv6:"",
                    index:999
                },
                form_newrouter:{
                    router_name:"",
                    router_IPv6:""
                },
                formLabelWidth: '120px',

            }

        },
        created() {
            this.tableData2[0].router_IPv6 = "ererererer";
            const _this = this;
            axios.get('http://localhost:8181/router').then(
                function (data) {
                    _this.tableData = data.data;
                    const __this = _this;
                    for(var i = 0;i< _this.tableData.length;i++)
                    {
                        var ask = "/router/" + _this.tableData[i].router_IPv6 + "/online";
                        const ii = i;
                        axios.get('http://localhost:8181'+ask).then(
                            function (data2)
                            {
                                __this.tableData[ii].online = data2.data;
                            })
                    }


                })
            // for(var i = 1;i<= this.tableData.length;i++)
            // {
            //     console.log(this.tableData[i]);
            //     var ask = "/router/"+this.tableData[i].router_IPv6+"/total_terminal";
            //     axios.get('http://localhost:8181'+ask).then(
            //         function (data)
            //         {
            //             _this.tableData[i].total_terminal = data.data;
            //         })
            // }
        },
        methods: {
            testconnect24(){
                axios.get('http://localhost:8181/testconnect24').then(
                    function (data) {
                    if(data.data == "SUCCESS"){
                        alert("STM32连接正常");
                    }else{
                        alert("STM32连接失败");
                    }
                    })
            },
            handle_newrouter(){

                console.log(this.form_newrouter.router_IPv6);
                console.log(this.form_newrouter.router_name);
                axios.get('http://localhost:8181'+'/router/'+this.form_newrouter.router_IPv6+"/"+this.form_newrouter.router_name+"/addrouter").then(
                    function (data) {
                        if(data.data)
                        {
                            window.location.reload();
                        }
                        else
                        {
                            alert("IPv6地址不合规范");
                        }

                    }
                );



                this.form_newrouter.router_IPv6 = "";
                this.form_newrouter.router_name = "";
            },
            Refresh(){
                window.location.reload();
            },
            handle_changroutername(index, row) {
                console.log(this.form.router_IPv6,this.form.router_name);
                //此处进行数据库修改
                 var ask = "/router/"+this.form.router_IPv6+"/"+this.form.router_name;
                const _this = this;
                const _index = index;
                const _row = row;
                axios.get('http://localhost:8181'+ask).then(
                    function (data) {
                       console.log("the ask request:"+data.data);
                       if(data.data)
                       {
                           console.log("OKOKOKOKOKOKOKO the answer is true!!");
                           _this.tableData[_this.form.index].router_name = _this.form.router_name;
                       }
                       else
                           alert("粗错啦！！")
                    }
                )
            },
            handleEdit(index, row,button) {
                this.form.router_name = row.router_name;
                this.form.router_IPv6 = row.router_IPv6;
                this.form.index = index;
            },
            handleDelete(index, row) {
                console.log(index, row);
                var ask = "/router/"+row.router_IPv6+"/delete";
                axios.get('http://localhost:8181'+ask).then(
                    function (data) {
                        console.log("the ask request:"+data.data);
                        if(data.data)
                        {
                            console.log("OKOKOKOKOKOKOKO the answer is true!!");
                            window.location.reload();
                        }
                        else
                            alert("粗错啦！！")
                    }
                )


            },
            stateFormat(row, column) {

            },
        },
    }
</script>
<style scoped>
    .el-table{
        overflow:visible !important;
    }
</style>