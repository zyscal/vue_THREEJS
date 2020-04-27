<template>
        <div>
                <div style="height: 150px;margin-left: 890px">
                    <el-row >
                        <font id="xdata" style=";font-weight:300"></font>
                    </el-row>

                    <el-row style="margin-top: 4px;font-weight:300">
                        <font id="ydata"></font>
                    </el-row>
                    <el-row style="margin-top: 4px;font-weight:300">
                        <font id="zdata"></font>
                    </el-row>
                    <el-row style="margin-top: 4px;font-weight:300">
                        <font id="xspeed"></font>
                    </el-row>
                    <el-row style="margin-top: 4px;font-weight:300">
                        <font id="zspeed"></font>
                    </el-row>
                    <el-row style="margin-top: 4px;font-weight:300">
                        <font id="coefficient">coefficient:6</font>
                    </el-row>
                    <el-row style="margin-top: 4px;font-weight:300">
                        <font id="xdatalist"></font>
                    </el-row>
                    <el-row style="margin-top: 4px;font-weight:300">
                        <font id="zdatalist"></font>
                    </el-row>
                </div>
                <div id="container" style="height: 500px"></div>
        </div>

</template>

<script>
    import * as Three from 'three'
    import rotateGlobal from '@/api/global_variable'
    export default {
        name: "postures",
        data () {
            return {
                camera: null,
                scene: null,
                renderer: null,
                mesh: null,
                mouseXOnMouseDown:null,
                windowHalfX:null,
                targetRotationOnMouseDown:null,
                targetRotation:null,
                mouseX:null,

                    xdata:0,
                    ydata:0,
                    zdata:0,
                    xspeed:0,
                    zspeed:0,
                    xdatalist:[0.00,0.00,0.00,0.00,0.00,0.00],
                    zdatalist:[0.00,0.00,0.00,0.00,0.00,0.00],
                    coefficient:6,
                    time:1000,
            }
    },
        methods: {
            dosomething(count){//奥里给！
                setTimeout(()=>{
                    count %= 6;
                    var xdata_font = document.getElementById("xdata");
                    var ydata_font = document.getElementById("ydata");
                    var zdata_font= document.getElementById("zdata");
                    var xspeed_font = document.getElementById("xspeed");
                    var zspeed_font = document.getElementById("zspeed");
                    var xdatalist_font = document.getElementById("xdatalist");
                    var zdatalist_font = document.getElementById("zdatalist");

                    this.xdata = (rotateGlobal.rotationx).toFixed(2);
                    this.zdata = (rotateGlobal.rotationy).toFixed(2);
                    this.ydata = (this.mesh.rotation.y*180/3.14%360).toFixed(2);

                    this.xdatalist[count] = this.xdata;
                    this.zdatalist[count] = this.zdata;

                    var xdatastr = this.xdatalist[0] + " " +this.xdatalist[1] + " " +this.xdatalist[2] + " " +this.xdatalist[3] + " " +this.xdatalist[4] + " " +this.xdatalist[5];
                    var zdatastr = this.zdatalist[0] + " " +this.zdatalist[1] + " " +this.zdatalist[2] + " " +this.zdatalist[3] + " " +this.zdatalist[4] + " " +this.zdatalist[5];

                    console.log(xdatastr);
                    console.log(zdatastr);
                    this.xspeed = ((this.xdatalist[5] - this.xdatalist[0])/(6*this.time/1000)).toFixed(2);
                    this.zspeed = ((this.zdatalist[5] - this.zdatalist[0])/(6*this.time/1000)).toFixed(2);

                    xdata_font.innerText = "x:" + this.xdata;
                    ydata_font.innerText = "y:" + this.ydata;
                    zdata_font.innerText = "z:" + this.zdata;
                    xspeed_font.innerText = "xspeed:" + this.xspeed;
                    zspeed_font.innerText = "zspeed:" + this.zspeed;
                    xdatalist_font.innerText = "list:" + xdatastr;
                    zdatalist_font.innerText = "list:" + zdatastr;

                    count++;
                    this.dosomething(count);
                },this.time)
            },
            init: function () {
                var container = document.getElementById('container');
                this.scene = new Three.Scene();
                // this.scene.background = new THREE.Color(0xffffff);
                this.camera = new Three.PerspectiveCamera( 70, container.clientWidth/container.clientHeight, 0.1, 10 );
                this.camera.position.z = 5;
                var material;

                var bei = 5;
                var geometry = new Three.BoxGeometry(0.65*bei, 0.16*bei,0.97*bei);
                // var geometry = new Three.BoxGeometry(0.65*bei, 0.65*bei,0.65*bei);
                var mats=[];

                for(var i = 0;i < geometry.faces.length;i++)
                {
                    switch (i) {
                        case 0:
                            material = new Three.MeshNormalMaterial({color:0xffffff});//白色
                             mats.push(material);
                            break;
                        case 1:
                            material = new Three.MeshBasicMaterial({color:0xff0000});//红色
                            mats.push(material);
                            break;
                        case 2:
                            material = new Three.MeshBasicMaterial({color:0x0000ff});//蓝色
                            mats.push(material);
                            break;
                        case 3:
                            material = new Three.MeshBasicMaterial({color:0xff6100});//橙色
                            mats.push(material);
                            break;
                        case 4:
                            material = new Three.MeshBasicMaterial({color:0x00ff00});//绿色
                            mats.push(material);
                            break;
                        case 5:
                            material = new Three.MeshBasicMaterial({color:0xffff00});//黄色
                            mats.push(material);
                            break;
                        default:
                            material = new Three.MeshBasicMaterial({ color: new Three.Color(Math.random() * 0xffffff)});// 随机颜色
                            mats.push(material);
                            break;
                    }
                }
                this.mesh = new Three.Mesh( geometry, mats );
                this.scene.add(this.mesh);



                this.renderer = new Three.WebGLRenderer({antialias: true});
                this.renderer.setSize( container.clientWidth, container.clientHeight );
                this.renderer.setClearColor(0xffffff,1.0);
                container.appendChild(this.renderer.domElement);
            },
            animate(){
                requestAnimationFrame(this.animate);
                // this.mesh.rotation.x += 0.1;
                // this.mesh.rotation.y += 0.1;
                //     console.log(rotateGlobal.rotationx,rotateGlobal.rotationy)
                    console.log(rotateGlobal.rotationx,rotateGlobal.rotationy)
                    this.mesh.rotation.x = Number(rotateGlobal.rotationx)*3.14/180;
                    this.mesh.rotation.z = Number(rotateGlobal.rotationy)*3.14/180;
                    this.mesh.rotation.y += ( this.targetRotation -  this.mesh.rotation.y ) * 0.08;
                this.renderer.render(this.scene, this.camera);
            },
                onDocumentMouseDown( event ) {
                        event.preventDefault();
                        document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
                        document.addEventListener( 'mouseup', this.onDocumentMouseUp, false );
                        document.addEventListener( 'mouseout', this.onDocumentMouseOut, false );
                        this.mouseXOnMouseDown = event.clientX - this.windowHalfX;
                        this.targetRotationOnMouseDown = this.targetRotation;
                },
                 onDocumentMouseMove( event ) {
                         this.mouseX = event.clientX - this.windowHalfX;
                    this.targetRotation = this.targetRotationOnMouseDown + ( this.mouseX - this.mouseXOnMouseDown ) * 0.02;
            },

             onDocumentMouseUp( event ) {
                    document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
                    document.removeEventListener( 'mouseup', this.onDocumentMouseUp, false );
                    document.removeEventListener( 'mouseout', this.onDocumentMouseOut, false );
            },

             onDocumentMouseOut( event ) {
                    document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
                    document.removeEventListener( 'mouseup', this.onDocumentMouseUp, false );
                    document.removeEventListener( 'mouseout', this.onDocumentMouseOut, false );
            },

             onDocumentTouchStart( event ) {
                    if ( event.touches.length == 1 ) {
                            event.preventDefault();
                            this.mouseXOnMouseDown = event.touches[ 0 ].pageX - this.windowHalfX;
                            this.targetRotationOnMouseDown = this.targetRotation;
                    }
            },

             onDocumentTouchMove( event ) {
                    if ( event.touches.length == 1 ) {
                            event.preventDefault();
                            this.mouseX = event.touches[ 0 ].pageX - this.windowHalfX;
                            this.targetRotation = this.targetRotationOnMouseDown + ( this.mouseX - this.mouseXOnMouseDown ) * 0.05;
                    }
            }
        },
        mounted () {
                document.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
                document.addEventListener( 'touchstart', this.onDocumentTouchStart, false );
                document.addEventListener( 'touchmove', this.onDocumentTouchMove, false );

            this.init();
            this.animate();
            this.dosomething(0);
        }
    }

</script>

<style scoped>
/*#container{*/
/*    width: 100%;*/
/*    height: 840px;*/
/*}*/
</style>