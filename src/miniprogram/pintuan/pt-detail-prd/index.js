const ptCommon = require('../pt.common.js')
const app = getApp()
Page({
  data: {},
  onLoad() {
    var that = this
    var options = wx.getStorageSync('DATA_FROM_PLUGIN')
    this.setData({options: options})

    var userinfo = app.globalData.userinfo
    this.setData({userinfo: userinfo})

    wx.getSystemInfo({
      success: function (res) {
        if (res.model == 'iphonerx') {
          that.setData({isIphoneX: true})
        } else {
          that.setData({isIphoneX: false})
        }
      }
    })
  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data)
  }
})