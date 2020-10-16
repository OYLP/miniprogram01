//Page Object
Page({
  handleGetUserInfo(e){
    const {userInfo} = e.detail;
    wx.setStorageSync("userInfo",userInfo);
      
  },
  data:{
    userInfo:{}
  },
  onShow(){
    const userInfo = wx.getStorageSync("userInfo");
    this.setData({userInfo})
      
  }
});