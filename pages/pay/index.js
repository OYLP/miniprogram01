
import { getSetting,chooseAddress,openSetting,showModal ,showToast} from '../../utils/asyncWx'
//解决es7版本报错
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    // 1 获取本地缓存中的收货地址
    const address = wx.getStorageSync("address");
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
      totalNum,
      totalPrice
    })
  }

})