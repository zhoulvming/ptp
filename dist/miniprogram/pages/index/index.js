const app = getApp()
const ptCommon = require('../pt.common.js')
Page({
  data: {},
  onLoad() {
    var userinfo = wx.getStorageSync('userinfo')
    ptCommon.log('userinfo from wx storage of enter page', userinfo)

    var gd = app.globalData
    if (userinfo) {
      gd.userinfo = userinfo
    }

    this.setData({brand: gd.brand, channelId: gd.channelId})
    if (!userinfo.openid) {
      ptCommon.getOpenid(this.getOrderList)
    } else {
      this.getOrderList()
    }
  },
  getOrderList() {
    var that = this
    var userinfo = app.globalData.userinfo
    var brand = app.globalData.brand
    var channelId = app.globalData.channelId

    // 调用拼团插件接口获取订单列表(在已经登录的情况)
    if (userinfo.mobileNo) {
      wx.request({
        url: 'https://apigroupbuy.kfc.com.cn/groupbuying/order/ordhistory',
        header: { 'content-type': 'application/json' },
        method: 'POST',
        data: {
          mobileNo: userinfo.mobileNo,
          brand: brand,
          channelId: channelId
        },
        success(res) {
          that.setData({ords:res.data})
        }
      })
    }
  },
  gotoOrderDetail(event) {
    var orderNo = event.currentTarget.dataset.ordno
    wx.setStorageSync('DATA_FROM_PLUGIN', {
      orderNo: orderNo
    })
    wx.navigateTo({
      url: '../pt-detail-order/index'
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
        ptCommon.log('利用 获取用户信息 按钮后的用户数据', userinfo)
      },
      fail: res => {
        ptCommon.logErr(res)
      }
    })
  },
  login() {
    // 此处调用小程序登录逻辑设置 mobileNo 和 userCode
    var userinfo = app.globalData.userinfo
    userinfo['userCode'] = '1000' // 此处需要小程序用户的登录信息
    userinfo['mobileNo'] = '123456789'// 此处需要小程序用户的登录信息
    wx.setStorageSync('userinfo', userinfo )
    ptCommon.log('模拟登陆后的用户数据', userinfo)
    wx.navigateTo({
      url: '../index/index'
    })
  }
})