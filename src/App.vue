<template>
  <div>
    <router-view></router-view>
  </div>

</template>

<script>
  import Global from '@/api/global_variable'
  export default {
    data() {
      return {
        websock: null,
      }
    },
    created(){

      this.initWebSocket();
    },
    destroyed() {
      //页面销毁时关闭长连接
      this.websocketclose()
    },
    methods:{
      initWebSocket(){ //初始化weosocket

        //const wsuri = process.env.WS_API + "/websocket";//ws地址


        const wsuri = "ws://localhost:8181/websocket";
        this.websock = new WebSocket(wsuri);
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onclose = this.websocketclose;
      },

      websocketonopen() {
        console.log("WebSocket连接成功");
      },
      websocketonerror(e) { //错误
        console.log("WebSocket连接发生错误");
      },
      websocketonmessage(e){ //数据接收
        console.log("接收到的数据是："+ e.data);
        //将数据进行其他页面推送
       var xandy =  e.data.split(" ");
       Global.rotationx = xandy[0];
       Global.rotationy = xandy[1];
      },

      websocketsend(agentData){//数据发送
        this.websock.send(agentData);
      },

      websocketclose(e){ //关闭
        console.log("connection closed (" + e.code + ")");
      },
    }
  }


</script>

<style>
  body{
    border: 0;
    padding:0;
    margin:0;

  }
  .el-icon-arrow-down:before{
       visibility: hidden !important;
     }
</style>