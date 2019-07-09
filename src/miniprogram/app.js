App({
  onLaunch: function() {
    wx.removeStorageSync('userinfo')
  },
  
  globalData: {
    /*用户信息*/
    userinfo: {},
    
    /*小程序所属*/
    appid:'wx85694629dac0c26a',
    brand: 'CJ',
    channelId:'800008'
  },

  isLogin() {
    if (this.globalData.userinfo.userCode) {
      return true
    }
    return false
  }
})