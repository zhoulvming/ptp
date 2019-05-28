const ptCommon = require('../pt.common.js')
const app = getApp()
Page({
  data: {},
  onLoad() {
    var userinfo = wx.getStorageSync('userinfo')
    this.setData({ userinfo: userinfo })

    var options = wx.getStorageSync('DATA_FROM_PLUGIN')
    this.setData({options: options})
  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data)
  },
  login() {
    // 此处调用小程序登录逻辑设置 mobileNo 和 userCode
    var that = this
    var userinfo = app.globalData.userinfo
    userinfo['userCode'] = '1000' // 此处需要小程序用户的登录信息
    userinfo['mobileNo'] = '123456789'// 此处需要小程序用户的登录信息
    wx.setStorageSync('userinfo', userinfo )
    wx.setStorageSync('options', that.data.options )
    ptCommon.log('模拟登陆后的用户信息', userinfo)
    wx.navigateTo({
      url: '../pt-confirm-order/index'
    })
  },
  onGotUserInfo() {
    var gd = app.globalData
    var userinfo = gd.userinfo
    wx.getUserInfo({
      success: res => {
        userinfo['nickName'] = res.userInfo.nickName
        userinfo['avatarUrl'] = res.userInfo.avatarUrl
        gd.userinfo = userinfo
        wx.setStorageSync('userinfo', userinfo)
        ptCommon.log('获取用户信息后的数据', userinfo)
      },
      fail: res => {
        console.log(res)
      }
    })
  }
})