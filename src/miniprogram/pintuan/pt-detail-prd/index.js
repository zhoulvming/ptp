const ptCommon = require('../pt.common.js')
const app = getApp()
Page({
  data: {},
  onLoad() {
    var options = wx.getStorageSync('DATA_FROM_PLUGIN')
    this.setData({options: options})

    var userinfo = app.globalData.userinfo
    this.setData({userinfo: userinfo})
  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data)
  }
})