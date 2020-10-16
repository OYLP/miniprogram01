//获取用户权限
export const getSetting=()=>{
  return new Promise((resolve,reject)=>{
    wx.getSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
      
  })
}
// 获取微信内收货地址
export const chooseAddress = ()=>{
  return new Promise((resolve,reject)=>{
    wx.chooseAddress({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
      
  })
}
//打开权限设置页面
export const openSetting = ()=>{
  return new Promise((resolve,reject)=>{
    wx.openSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
      
  })
}

//购物车确认删除 模态框
export const showModal = ({content})=>{
  return new Promise((resolve,reject)=>{
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: true,
      success: (result) => {
        if (result.confirm) {
          resolve(result)
        }
      },
      fail: (err) => {
        reject(err)
      }
    });
      
  })
}

//结算

export const showToast = ({title})=>{
  return new Promise((resolve,reject)=>{
    wx.showToast({
      title: title,
      icon: 'none',
      mask: true,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    });
      
  })
}