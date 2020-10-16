//引入 用来发送请求的方法
import { request } from '../../request/index'
//解决es7版本报错
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList:[],
    //右侧的菜单数据
    rightContent:[],
    //被点击的左侧的菜单索引
    currentIndex:0,
    //右侧内容置顶
    scrollTop:0
  },

  //接口的返回数据
  Cates:[],
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 1、先判断本地存储中有没有旧数据
     * 2、没有旧数据 直接发送新请求
     * 3、有旧数据 同时 旧数据没有过期 就使用 本地存储的旧数据
     */
    const Cates = wx.getStorageSync("cates");
    if(!Cates){
      //不存在 发送请求新数据
      this.getCates()
    }else{
      //有旧数据 定义过期时间  先测试100s过期
      if (Date.now() - Cates.time > 1000 * 100) {
        //过期后 重新发送请求
        this.getCates()
      }else{
        //可以使用旧数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v=> v.cat_name);
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
      // wx.wx.setStorageSync("cates");
        
    }
    
  },
  async getCates(){
    //使用es7 的async await 来请求数据
    const res = await request({
      url:'/categories'
    })
      this.Cates = res
      //把接口数据存入到本地存储中 
      wx.setStorageSync("cates",{
        time:Date.now(),
        data:this.Cates
      })

      let leftMenuList = this.Cates.map(v=> v.cat_name);
      let rightContent = this.Cates[0].children
      this.setData({
        leftMenuList,
        rightContent
      })

  },
  handleItemTap(e){
    const {index} = e.target.dataset
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
    })
  }
})