const ptCommon = require('../pt.common.js')
const app = getApp()
Page({
  data: {},
  onLoad() {
    var that = this
    var options = wx.getStorageSync('DATA_FROM_PLUGIN')
    this.setData({options: options})

    var userinfo = app.globalData.userinfo
    if (!userinfo.openid) {
      ptCommon.getOpenid(function(){
        userinfo = app.globalData.userinfo
        that.setData({ userinfo: userinfo })
      })
    } else {
      that.setData({ userinfo: userinfo })
    }
  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data)
  }
})