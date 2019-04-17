const ptCommon = require('../pt.common.js')
Page({
  data: {},
  onLoad() {
    var options = wx.getStorageSync('DATA_FROM_PLUGIN')
    this.setData({options: options})

    var userinfo = wx.getStorageSync('userinfo')
    this.setData({ userinfo: userinfo })
  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data)
  }
})