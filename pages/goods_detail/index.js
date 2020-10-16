
//引入 用来发送请求的方法
import { request } from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
    goodsDetail:{}
  },
  
  //获取商品列表数据
  async getGoodsDetail(goods_id){
    const res = await request({
      url:'/goods/detail',
      data:{goods_id}
    })
    this.GoodsInfo = res;
    
    this.setData({
      goodsDetail:{
        goods_name:res.goods_name,
        /**
         * iphone部分手机不支持 webp图片格式
         * 最好找后台修改
         * 临时自己改 确保后台存在 1.webp => 1.jpg
         */
        goods_introduce:res.goods_introduce.replace(/\.webp/g,'.jpg'),
        goods_price:res.goods_price,
        pics:res.pics
      }
    })

  },

  onLoad: function (options) {
    const {goods_id} = options   //{}对象解构 es6解构赋值 
    this.getGoodsDetail(goods_id)
  },
  // 全局变量
  GoodsInfo:{},
  /**
   *点击轮播图 放大预览
   调用小程序自带方法 previewImage
   */
  handlePreviewImage(e){  
    //1 先构造要预览的图片数组
    const current = e.currentTarget.dataset.url
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    wx.previewImage({
      current,
      urls
    })
  },

  /*
  点击加入购物车
  1、获取缓存中的购物车数据，数组格式
  2、判断当前的商品是否已存在于 购物车
  3、如果已经存在，给数量num++ 重新把购物车数组添加到缓存中
  4、不存在，直接给数组添加一个新元素，给新元素带上数量属性num，重新把购物车数组添加到缓存中
  5、弹出提示
  */
 handleCartAdd(){
    let cart = wx.getStorageSync("cart")||[];
    let index = cart.findIndex(v => v.goods_id===this.GoodsInfo.goods_id)
    if(index===-1){
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    }else{
      cart[index].num++
    }

    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true,
    });
      
 }
})