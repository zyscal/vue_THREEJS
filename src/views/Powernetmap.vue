<template>
    <div  style="width: 100%">
        <el-button @click="handlerefrash()" type="primary" style="margin-left: 16px;">刷新</el-button>
        <div id="Powernetmap" style="width: 100%;height: 600px;"></div>
    </div>

</template>

<script>
    import echarts from 'echarts'
    export default {
        name: "Powernetmap",
        data(){
            return{
                data:{},
                root:{
                    "name":"name",
                    "children":[]
                },
                leaves: {
                    "name":"name",
                    "value":0
                }

            }
        },
        created(){

        },
        mounted() {
            console.log("mounted");
            const _this = this;
            axios.get("http://localhost:8181/Powernetmap").then(function (data) {
                _this.data  =  JSON.parse(JSON.stringify(data.data));
                var myChart = echarts.init(document.getElementById("Powernetmap"));
                var option = {
                    tooltip: {
                        trigger: 'item',
                        triggerOn: 'mousemove'
                    },
                    series: [
                        {
                            type: 'tree',
                            data: [_this.data],
                            top: '1%',
                            left: '10%',
                            bottom: '1%',
                            right: '17%',
                            symbolSize: 20,
                            label: {
                                position: 'front',
                                verticalAlign: 'bottom',
                                align: 'right',
                                fontSize: 20
                            },
                            leaves: {
                                label: {
                                    position: 'right',
                                    verticalAlign: 'bottom',
                                    align: 'left'
                                }
                            },
                            expandAndCollapse: true,
                            animationDuration: 550,
                            animationDurationUpdate: 750
                        }
                    ]
                }
                myChart.setOption(option);

            })


        },
        methods:{
            handlerefrash(){
                window.location.reload();
            }
        }
    }
</script>

<style scoped>

</style>