import { login } from '../../utils/asyncWx'
//解决es7版本报错
import regeneratorRuntime from '../../lib/runtime/runtime'
//引入 用来发送请求的方法
import { request } from '../../request/index'
Page({
  //获取用户信息
  async handleGetUserInfo(e){
    try {
      //1 拿到微信提供的用户信息
      const {encrytedData, rawData, iv, signature} = e.detail;
      //2 获取小程序登录成功后的code
      const { code } = await login();
      // console.log(code);
      //3 发送请求 获取用户token
      const loginParams = {encrytedData, rawData, iv, signature, code};
      //个人用户获取null，只有企业用户才能得到token
      const {token} = await request({
        url:'/users/wxlogin',
        data:loginParams,
        method:"post"
      });
      //4 把token存入缓存中 同时跳转上一页
      wx.setStorageSync("token",token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }  
  }
});
  