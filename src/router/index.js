import Vue from 'vue'
import VueRouter from 'vue-router'
import navigationone from "../views/navigationone";
import navigationtwo from "../views/navigationtwo";
import navigationthree from "../views/navigationthree";
import RouterPage from "../views/RouterPage";
import SensorPage from "../views/SensorPage";
import STM32Page from "../views/STM32Page";
import SensorTypePage from "../views/SensorTypePage";
import PowerPage from "../views/PowerPage";
import Powernetmap from "../views/Powernetmap";
import Powermap from "../views/Powermap";
import Sensor_echars from "../views/Sensor_echars";
import postures from "../views/postures";
import Settings from "../views/Settings";
import Powertree from "../views/Powertree";
import Index from "../views/Index";
import App from "../App";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '第一导航',
    component: Index,
    // redirect:'RouterPage',
    // redirect:'Sensor_echars',
    children:[
      {
        path:'/RouterPage',
        name:'路由表',
        component:RouterPage
      },
      {
        path:'/STM32Page',
        name:'终端设备集',
        component:STM32Page
      },
      {
        path:'/SensorPage',
        name:'传感器集',
        component:SensorPage
      },
      // {
      //   path:'/SensorTypePage',
      //   name:'传感器类型表',
      //   component:SensorTypePage
      // },
      // {
      //   path:'/PowerPage',
      //   name:'电力线表',
      //   component:PowerPage
      // }
    ]
  },
  {
    path:'/navigationtwo',
    name: '第二导航',
    component: Index,
    children: [
      {
        path:'/Powertree',
        name:'配电线路关系网',
        component:Powertree
      },
      {
        path:'/Powernetmap',
        name:'电力数据信息拓扑',
        component:Powernetmap
      },
      {
        path:'/Powermap',
        name:'电力网络拓扑',
        component:Powermap
      },
      {
        path:'/Sensor_echars',
        name:'传感器数据采集',
        component:Sensor_echars
      },
      {
        path:'/postures',
        name:'姿态',
        component:postures
      }
    ]
  },
  {
    path:'/navigationthree',
    name:'第三导航',
    component:Index,
    children:[
      {
        path:'/Settings',
        name:'设置',
        component:Settings
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
