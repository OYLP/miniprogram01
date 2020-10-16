//引入 用来发送请求的方法
import { request } from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
    tabs:[
      {
        id:0,
        value:'综合',
        isActive:true
      },
      {
        id:1,
        value:'销量',
        isActive:false
      },
      {
        id:2,
        value:'价格',
        isActive:false
      }
    ],
    goodsList:[]
  },
  //设置传递的url参数
  QueryParams:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },
  //全局变量 总页数
  totalPages:1,

  onLoad: function (options) {
    this.QueryParams.cid = options.cid
    this.getGoodsList()
  },

  //获取商品列表数据
  async getGoodsList(){
    const res = await request({
      url:'/goods/search',
      data:this.QueryParams
    })
    //获取 总条数
    const total = res.total
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
  
    this.setData({
      //拼接数组
      goodsList:[...this.data.goodsList,...res.goods]
    })

    //关闭下拉刷新窗口，如果没有调用下拉刷新窗口 直接关闭也不会报错
    wx.stopPullDownRefresh()
      
  },

  //从子组件中获取索引
  handleTabsItemChange(e){
    // console.log(e.detail.index);
    //1 获取被点击的标题索引
    const {index} = e.detail

    //2 修改原数组
    let {tabs} = this.data
    tabs.forEach((v,i) => 
      i===index ? v.isActive=true : v.isActive=false
    );
    //3 赋值到data中
    this.setData({
      tabs
    })
  },

  // 页面上滑  滚动条触底事件
  /**
   * 1、用户上滑页面 滚动条触底 开始加载下一页
   *  a 找到滚动条触底事件  微信小程序自带onReachBottom事件
   *  b 判断还有没有下一页数据
   *    获取 总页数 = Math.ceil(总条数total/页容量pagesize) 
   *                = Math.ceil(23/10)=3
   *    获取当前的页码 pagenum
   *    判断 当前页码是否 >= 总页数,表示 没有下一页数据
   *  c 假如没有下一页数据 弹出一个提示
   *  d 假如还有下一页数据 就加载下一页数据
   *    1 当前页码pagenum++
   *    2 重新发送请求
   *    3 数据请求回来 要对data中的数组 进行 拼接 而不是 替换
   * 2、下拉刷新页面
   *  1 触发下拉刷新事件 需要在页面的index.json文件中配置"enablePullDownRefresh": true,
   *    找到触发下拉刷新页面的事件 
   *  2 重置 数据 数组
   *    重置页码pagenum 设置为1
   *  3
   */
  onReachBottom(){
    // 1 判断还有没有下一页数据
    if(this.QueryParams.pagenum >= this.totalPages){
      //没有下一页
      // console.log('没有下一页数据了');
      wx.showToast({
        title: '没有下一页数据了'
      });
        
    }else{
      //还有下一页
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },
  //微信自带  下拉刷新事件
  onPullDownRefresh(){
    // 1 重置数组
    this.setData({
      goodsList:[]
    })

    //2 重置页码
    this.QueryParams.pagenum = 1
    this.getGoodsList()
  }

})