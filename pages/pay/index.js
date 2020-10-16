
import {requestPayMent, showToast} from '../../utils/asyncWx'
//解决es7版本报错
import regeneratorRuntime from '../../lib/runtime/runtime'
//引入 用来发送请求的方法
import { request } from '../../request/index'
Page({
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0,
    all:""
  },
  onShow(){
    // 1 获取本地缓存中的收货地址
    const address = wx.getStorageSync("address");
    const all = address.provinceName + address.cityName + address.countyName + address.detailInfo
    let cart = wx.getStorageSync("cart") || [];
    let totalPrice = 0
    let totalNum = 0

    cart = cart.filter(v=>v.checked);

    cart.forEach(ele => {
      totalPrice += ele.num * ele.goods_price;
        totalNum += ele.num 
    });
    //2 给data 赋值
    this.setData({
      cart,
      address,
      all,
      totalNum,
      totalPrice
    })
  },
  //支付结算
  async handleOrderPay(){
    try {
      //判断storage中有没有token
      const token = wx.getStorageSync("token");
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/index'
        });
          
        return;
      }
      //缓存中有token 就创建订单
      // const header = {Authorization:token};  //请求头参数, 用户登录成功后的token值
      const order_price = this.data.totalPrice;  //订单总价
      const consignee_addr = this.data.all;  //收货地址
      const {cart} = this.data;
      let goods = [];   //订单列表
      
      cart.forEach(v=>goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
      }))
      const orderParams = {order_price,consignee_addr,goods};
      //发送请求 创建订单 获取订单编号
      const {order_number} = await request({url:'/my/orders/create',method:"post",data:orderParams});
      //发起 预支付接口 获取支付参数
      const {pay} = await request({url:'/my/orders/req_unifiedorder',method:"POST",data:{order_number}});
      //发起微信支付
      await requestPayMent(pay);
      //查询后台订单状态  
      const res = await request({url:'/my/orders/chkOrder',method:'POST',data:{order_number}});
      await showToast({title:"支付成功"})
      wx.navigateTo({
        url: '/pages/order/index'
      });

      // 支付成功后 收手动删除缓存中的数据
      let newCart = wx.getStorageSync("cart");
      newCart.filter(v=>!v.checked)
      wx.setStorageSync("cart", newCart);
    } catch (error) {
      await showToast({title:"支付失败"})
      console.log(error);
    }
  }


})