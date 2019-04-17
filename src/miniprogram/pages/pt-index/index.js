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
    ptCommon.gotoPageFromPlugin(data)
  }
})