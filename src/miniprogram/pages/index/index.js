const app = getApp()
Page({
  data: {},
  onLoad() {
    var that = this
    var userinfo = wx.getStorageSync('userinfo')
    var gd = app.globalData
    if (userinfo) {
      gd.userinfo = userinfo
    }

    this.setData({brand: gd.brand, channelId: gd.channelId})
    if (!userinfo.openid) {
      that.getOpenid(this.getOrderList)
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
      url: '../../pages/pt-detail-order/index'
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
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  login() {
    // 此处调用小程序登录逻辑设置 mobileNo 和 userCode
    var userinfo = app.globalData.userinfo
    userinfo['userCode'] = '1000' // 此处需要小程序用户的登录信息
    userinfo['mobileNo'] = '123456789'// 此处需要小程序用户的登录信息
    wx.setStorageSync('userinfo', userinfo )
    wx.navigateTo({
      url: '../index/index'
    })
  },

  // 获取微信用户的openid
  getOpenid(cb) {
    var gd = app.globalData
    var userinfo = gd.userinfo
    if (userinfo && userinfo.openid) {
      return userinfo.openid
    }
    wx.login({
      success: function (res) {
        var code = res.code
        console.log('wx.login获取到的code：' + code)
        wx.request({
          url: 'https://apigroupbuy.kfc.com.cn/groupbuying/weixin/openid',
          data: {
            code: code,
            appid: gd.appid,
            secret: gd.secret
          },
          method: 'POST',
          success: function (res) {
            console.log('小程序端页面获取到用户的openid：')
            console.log(res)
            var openid = res.data.openid
            console.log('==== 小程序侧获取到的openid：' + openid)
            userinfo['openid'] = openid
            gd.userinfo = userinfo
            if (userinfo.mobileNo) {
              cb()
            }
          },
          fail: function (err) {
            console.log(err)
          }
        })
      }
    })
  }


})