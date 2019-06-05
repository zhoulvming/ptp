const ptCommon = require('../pt.common.js')
const app = getApp()
Page({
  data: {},
  onLoad(options) {
    if (options.brand) {
      this.setData({options: options})
    } else {
      var optionsNew = wx.getStorageSync('DATA_FROM_PLUGIN')
      this.setData({options: optionsNew})
    }
    var userinfo = app.globalData.userinfo
    this.setData({userinfo: userinfo})
  },
  gotoPageFromPlugin(data) {
    var target = data.detail.target
    if (target == 'app-home') {
      wx.switchTab({url: '../../pages/index/index'})
    } else if (target == 'app-menu') {
      wx.switchTab({url: '../../pages/menu/menu'})
    } else if (target == 'app-mine') {
      wx.switchTab({url: '../../pages/usercenter/main'})
    } else {
      ptCommon.gotoPageFromPlugin(data)
    }
  }
})