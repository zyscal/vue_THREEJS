<template>
    <div >
        <el-button @click="handletreedepth()" :disabled=disable1 style="z-index:100;position: relative;"type="primary">展 开</el-button>
        <el-button @click="dialog = true,handlesetting()"style="z-index:100;position: relative;"type="success">编 辑</el-button>
        <el-button @click=" booleanrotate = !booleanrotate,handlerotate()" :disabled=disable2  style="z-index:100;position: relative;" type="danger">静 止</el-button>
        <el-button @click="handleback()" :disabled=disable3  style="z-index:100;position: relative;">返 回</el-button>
        <div  class="rotate" id="testrotate" style="height: 670px;width: 80%;margin-left: 150px">
                <div id="powertree" style="width: 100%;height: 670px"></div>
        </div>

        <el-dialog :visible.sync="dialog" style="width: 1100px; margin: auto">
        <el-form :model="form" style="width: 100%">
            <el-form-item label="删除配电线路" :label-width="formLabelWidth" >
                <el-select
                        v-model="form2.deletepowerlist"
                        multiple
                        collapse-tags
                        style="margin-left: 20px;"
                        placeholder="请选择">
                    <el-option
                            v-for="item in form2.enableddelete"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="danger" style="margin-left: 20px;" @click="deletefromlist()">确认删除</el-button>
            </el-form-item>
            <hr>
            <el-form-item label="修改线路关系"  :label-width=formLabelWidth style="margin-top: 20px">
                <el-select v-model="form2.move" placeholder="请选择" @change="handleselect()" style="margin-left: 20px">
                    <el-option
                        v-for="item in form2.enablemovelist"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="从"  :label-width=formLabelWidth>
                <el-input :disabled="true" v-model="form2.orginpower" style="width: 221.4px;margin-left: 20px"></el-input>
            </el-form-item>
            <el-form-item label="修改至"  :label-width=formLabelWidth>
                <el-select v-model="form2.moveto" placeholder="请选择" style="margin-left: 20px">
                    <el-option
                               v-for="item in form2.movetolist"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="success" style="margin-left: 20px" @click="handleupdata()">确认修改</el-button>
            </el-form-item>
            <hr>


            <el-form-item label="配电线路 ID" :label-width=formLabelWidth style="margin-top: 20px">
                <el-input v-model="form.nextID" :disabled="true" style="width: 221.4px;margin-left: 20px"></el-input>
            </el-form-item>
            <el-form-item label="配电线路名称" :label-width=formLabelWidth >
                <el-input   v-model="form.nextname" style="width: 221.4px;margin-left: 20px"></el-input>
            </el-form-item>
            <el-form-item label="选择线路分支" :label-width="formLabelWidth">
                <el-select v-model="form.nextselect" style="margin-left: 20px">
                    <el-option
                            v-for="item in form.nextoption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" style="margin-left: 20px" @click="dialog = false,handleadd(form.nextname,form.nextselect)">确定添加</el-button>

            </el-form-item>
        </el-form>
    </el-dialog>

<!--        <el-drawer-->
<!--                :visible.sync="drawer"-->
<!--                :direction="direction"-->
<!--                :with-header="false"-->
<!--                size="45%">-->



<!--        </el-drawer>-->
    </div>

</template>

<script>
    import echarts from 'echarts'
    export default {
        name: "powertree",
        data(){
            return{
                form:{
                    nextID:null,
                    nextname:null,
                    nextselect:null,
                    nextoption:[],
                },
                form2:{
                    deletepowerlist:[],
                    enableddelete:[],
                    move:null, //被选择移动的点
                    movetolist:[],//被选择移动的点可以移动到的点
                    moveto:null,//最终被选择的新线路
                    enablemovelist:[],//除了root外的所有点
                    orginpower:null,//被选择移动线路原先所属线路
                    treedepth:2,
                },
                disable1:false,
                disable2:false,
                disable3:true,
                rotatedeg:0,//div旋转角度
                booleanrotate:true,//是否旋转div
                formLabelWidth:'130px',
                dialog:false,
                direction: 'rtl',
                powertreeall:[],
                option:null,
                // powertreeeach:[],
                 powertreeeach :[],
                myChart:null,
            }
        },
        methods:{
            handleback(){
              window.location.reload();
            },
            handletreedepth(){
                if(this.form2.treedepth == 2){
                    this.form2.treedepth = 0;
                }
                else
                    this.form2.treedepth++;
                this.rotatedeg = 0;
                var testrotate = document.getElementById("testrotate");
                testrotate.style.transform='rotate('+this.rotatedeg+'deg)';
              this.option.series[0].initialTreeDepth = this.form2.treedepth;
              console.log(this.option);
              this.myChart.setOption(this.option);
            },
            clickFun(param){
                /**
                 * 1.若点击位置为0 1 层次，不做处理
                 * 2.若点击2层
                 * 2.1 旋转为0 + 暂停旋转
                 * 2.2 收起结点/缩小视图 + 下移 + 上部展示
                 * 2.3 案件禁用
                 */
                console.log(param);
                console.log(this.myChart._chartsViews);
                var nodes = this.myChart._chartsViews[0]._data.tree._nodes;
                var index = param.dataIndex;//拿到树内编号
                if(param.componentIndex == 0)
                if(nodes[index].depth > 2){
                    //停止旋转//页面放大
                    this.rotatedeg = 0;
                    this.booleanrotate = false;
                    var testrotate = document.getElementById("testrotate");
                    testrotate.style.transform='rotate('+this.rotatedeg+'deg)';

                    //按键禁用
                    this.disable1 = true;
                    this.disable2 = true;
                    this.disable3 = false;
                    //收起节点


                        this.option.series[0].initialTreeDepth = 0;
                        this.myChart.setOption(this.option);


                    setTimeout(() =>{
                        this.option.series[0].top = "90%";
                        this.option.series[0].right = "95%";
                        this.myChart.setOption(this.option);
                    },400);

                    const _this = this;
                    var url = "http://localhost:8181/findpowertreebyid/" + param.data.power_ID
                    setTimeout(() =>{
                    axios.get(url).then(
                        function (data) {
                            _this.powertreeeach =  JSON.parse(JSON.stringify(data.data));
                            _this.option.series.push(
                                {
                                    data: [_this.powertreeeach],
                                    type: 'tree',
                                    top: '15%',
                                    bottom: '15%',
                                    left: '5%',
                                    right: '5%',
                                    symbol: 'emptyCircle',
                                    edgeShape: 'polyline',
                                    orient: 'BT',
                                    // layout: 'radial',
                                    symbol: 'emptyCircle',
                                    symbolSize: 7,
                                    initialTreeDepth: _this.form2.treedepth,
                                    animationDurationUpdate: 750,
                                    label: {
                                        position: 'bottom',
                                        verticalAlign: 'middle',
                                        align: 'right',
                                        fontSize: 12
                                    },
                                    leaves:{
                                        label: {
                                            position: 'top',
                                            rotate: 90,
                                            verticalAlign: 'middle',
                                            align: 'left'
                                        }
                                    },
                                    root:{

                                    }
                                },
                            )

                                _this.myChart.setOption(_this.option);


                        }
                    )},800);


                }else{
                    return;
                }


                // this.myChart._chartsViews[0]._data.tree._nodes[0].isExpand = false;
                // this.myChart.setOption(this.option);



            },
            handleupdata(){
              const _this = this;
              var url = "http://localhost:8181/updataparent_ID/" + this.form2.move + "/" + this.form2.moveto;
              axios.get(url).then(
                  function (data) {
                      if(data.data){
                          window.location.reload();
                      }
                  }
              )
            },
            handleselect(){
                const _this = this;
                this.form2.movetolist = [];
                axios.get("http://localhost:8181//findpowerexcept/"+this.form2.move).then(//找到可移动到的线路
                    function (data) {
                        for(var i = 0;i<data.data.length;i++){
                                _this.form2.movetolist.push({
                                    label:data.data[i].power_name,
                                    value:data.data[i].power_ID
                                })
                        }
                    },
                axios.get("http://localhost:8181/findparentpower_namebyID/"+this.form2.move).then(
                    function (data) {
                        _this.form2.orginpower = data.data;
                    }
                )
                )



            },
            deletefromlist(){
                for(var i = 0;i<this.form2.deletepowerlist.length;i++){
                    var url = "http://localhost:8181/deletepower_byID/"+this.form2.deletepowerlist[i];
                    axios.get(url).then(
                        function (data) {
                            if(data.data){
                                window.location.reload();
                            }
                        }
                    )
                }
            },
            handlerotate(){
                if( this.booleanrotate){
                    var testrotate = document.getElementById("testrotate");
                    this.rotatedeg += 0.1;
                    testrotate.style.transform='rotate('+this.rotatedeg+'deg)';
                    setTimeout(() =>{
                        this.handlerotate();
                    },10);
                }

            },
            handleadd(nextname,nextselect){
                var url = "http://localhost:8181/addapower/"+nextname+"/"+nextselect;
                console.log(url)
                const _this= this;
                axios.get(url).then(
                    function (data) {
                        if(data.data){
                            window.location.reload();
                        }else {
                            alert("添加失败！");
                        }

                    }
                )
            },
            handlesetting(){
                this.form.nextoption = [];
                const _this = this;
                axios.get("http://localhost:8181/findnextpower_ID").then(
                    function (data) {
                        if(data.data != 0){
                            _this.form.nextID = data.data;
                            _this.form.nextname = "电力线路"+data.data;
                        }
                    }
                )
                axios.get("http://localhost:8181/findallpower").then(
                    function (data) {
                        for (var i = 0;i<data.data.length;i++){
                            _this.form.nextoption.push({
                                label:data.data[i].power_name,
                                value:data.data[i].power_ID,
                            })
                        }

                    }
                )
            }
        },
        mounted(){
            var url = "http://localhost:8181/findpowertreebyid/1";
            const _this = this;
            axios.get(url).then(
                function (data) {
                    _this.powertreeall  =  JSON.parse(JSON.stringify(data.data));
                    _this.myChart = echarts.init(document.getElementById("powertree"));
                    _this.myChart.on("click",_this.clickFun);
                    _this.option = {
                        label: {

                            fontSize: 15
                        },
                        tooltip: {
                            trigger: 'item',
                            triggerOn: 'mousemove'
                        },
                        legend: {
                            top: '2%',
                            left: '3%',
                            orient: 'vertical',
                            borderColor: '#c23531'
                        },
                        series: [
                            {
                                data: [_this.powertreeall],
                                type: 'tree',
                                top: '13%',
                                bottom: '12%',
                                layout: 'radial',
                                symbol: 'emptyCircle',
                                symbolSize: 10,
                                initialTreeDepth: _this.form2.treedepth,
                                animationDurationUpdate: 750,
                            },
                        ]
                    }
                    _this.myChart.setOption(_this.option);
                    _this.handlerotate();
                }
            )
            axios.get("http://localhost:8181/finddeletelist").then(//获取可以删除节点列表，叶子节点
                function (data) {
                    for(var i = 0;i<data.data.length;i++){
                        _this.form2.enableddelete.push({
                            label:data.data[i].power_name,
                            value:data.data[i].power_ID,
                        })
                    }
                }
            )
            axios.get("http://localhost:8181/findallpower").then(
                function (data) {
                    for(var i = 0;i<data.data.length;i++){
                        if(data.data[i].parent_ID != 0){
                            _this.form2.enablemovelist.push({
                                label:data.data[i].power_name,
                                value:data.data[i].power_ID
                            })
                        }
                    }

                }
            )
        }
    }
</script>

<style >
    ::-webkit-scrollbar {
        width: 0 !important;
    }
    ::-webkit-scrollbar {
        width: 0 !important;height: 0;
    }
</style>
