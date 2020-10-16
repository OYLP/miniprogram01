//引入 用来发送请求的方法
import { request } from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    //轮播图数组
    swiperList:[],
    //导航 数组
    catesList:[],
    //楼层 数组
    floorList:[]
  },
  //options(Object)
  onLoad: function(options) {
    //1、发送异步请求获取轮播图数据
    this.getSwiperList();
    this.getCateList();
    this.getFloorList()
  },
  getSwiperList(){
    request({url:'/home/swiperdata'})
    .then(result=>{
      this.setData({
        swiperList: result
      })
    })
  },
  getCateList(){
    request({url:'/home/catitems'})
    .then(result=>{
      this.setData({
        catesList: result
      })
    })
  },
  getFloorList(){
    request({url:'/home/floordata'})
    .then(result=>{
      this.setData({
        floorList: result
      })
    })
  }
});
  