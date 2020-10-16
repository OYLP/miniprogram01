/**
 * 1 获取用户的收货地址
 *    1 绑定点击事件
 *    2 调用小程序内置 api 获取用户的收货地址 wx.chooseAddress
 *    3 获取 用户对小程序所授予的获取地址的权限 scope
 *      1 假设用户 确定 点击 获取收货地址 authSetting scope.address
 *        scope=true
 *      2 假设用户 从来没有调用过 收货地址的api
 *        scope=undefined
 *      3 假设用户 取消 点击 获取收货地址  
 *        scope=false
 *        1 诱导用户 自己 打开 授权设置界面(wx.openSetting) 当用户重新给与 获取地址权限时
 *        2 获取收货地址
 *      4 把获取到的地址 存储到 本地缓存中
 * 2 页面加载完毕 onLoad onShow
 *    1 获取本地存储中的地址数据
 *    2 把数据 设置给data中的变量
 *      
 */
import { getSetting,chooseAddress,openSetting,showModal ,showToast} from '../../utils/asyncWx'
//解决es7版本报错
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    // 1 获取本地缓存中的收货地址
    const address = wx.getStorageSync("address");
    const cart = wx.getStorageSync("cart") || [];
    this.setCart(cart)
    this.setData({address})
  },
  onLoad: function (options) {

  },
  async handleChooseAddress(){
  
    //获取 用户收货地址  es7 async 语法
    try {
      //1 获取 权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"]; 
      //2 判断权限 为false 则打开权限设置页面 引导用户打开权限
      if (scopeAddress === false) {
        await openSetting();
      } 
      //3 调用获取收货地址的api
      const address = await chooseAddress();
      //4 存入到缓存中
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }
  },
  handleItemChange(e){
    const goods_id = e.target.dataset.id;
    let {cart} = this.data;
    let index = cart.findIndex(v=>v.goods_id === goods_id);
    console.log(index);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart)
  },
  setCart(cart){
    let allChecked = true;
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(ele => {
      if (ele.checked) {
        totalPrice += ele.num * ele.goods_price;
        totalNum += ele.num 
      }else{
        allChecked = false
      }
    });
    allChecked = cart.length!=0 ? allChecked : false;
    //2 给data 赋值
    wx.setStorageSync("cart", cart);
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    })
  },

  handleItemAllChecked(){
    let {cart,allChecked} = this.data;
    allChecked = !allChecked;
    cart.forEach(v=>v.checked=allChecked)
    this.setCart(cart)
  },
  //商品数量 编辑功能
  async handleItemNumEdit(e){
    let {operation,id} = e.target.dataset;
    let {cart} = this.data;
    const index = cart.findIndex(v=>v.goods_id===id);
    if (cart[index].num===1 && operation===-1) {
      const res = await showModal({content:"您是否要删除？"});
      if (res.confirm) {
        cart.splice(index,1)
        this.setCart(cart);
        console.log();
      }
    }else{
      cart[index].num +=operation
      this.setCart(cart)
    }
    
    
  },

  //点击结算
  async handleOrderPay(){
    const {address,totalNum} = this.data;
    //判断有没有获取收货地址
    if(!address.userName){
      await showToast({title:'您还没有选择收货地址'}) 
      return
    }
    //判断商品数量
    if(totalNum===0){
      await showToast({title:"您还没有选购商品！"})
      return
    }
    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
      
  }
})