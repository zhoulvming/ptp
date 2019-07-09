const app = getApp()
Page({
  data: {},
  onLoad() {
    console.log('on load')
    var that = this
    var userinfo = wx.getStorageSync('userinfo')
    var gd = app.globalData
    if (userinfo) {
      gd.userinfo = userinfo
    }

    this.setData({brand: gd.brand, channelId: gd.channelId})
    if (!userinfo.openid) {
      console.log(1111)
      that.getOpenid(this.getOrderList)
    } else {
      console.log(2222)
      this.getOrderList()
    }
  },
  getOrderList() {
    console.log(22333388)
    var that = this
    var userinfo = app.globalData.userinfo
    var brand = app.globalData.brand
    var channelId = app.globalData.channelId

    // 调用拼团插件接口获取订单列表(在已经登录的情况)
    console.log(22333388)
    console.log(userinfo.mobileNo)
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
          console.log(res)
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
    console.log('login ')
    // 此处调用小程序登录逻辑设置 mobileNo 和 userCode
    var userinfo = app.globalData.userinfo
    userinfo['userCode'] = '1000' // 此处需要小程序用户的登录信息
    userinfo['mobileNo'] = '123456789'// 此处需要小程序用户的登录信息
    wx.setStorageSync('userinfo', userinfo )
    console.log(userinfo)
    wx.navigateTo({
      url: '../index/index'
    })
  },

  // 获取微信用户的openid
  getOpenid(cb) {
    var gd = app.globalData
    var userinfo = gd.userinfo
    console.log('userinfo')
    console.log(userinfo)
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
            appid: gd.appid
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
            var openid = res.data.openid
            console.log('==== 小程序侧获取到的openid：(' + openid + ')')
            if (openid) {
              userinfo['openid'] = openid
            } else {
              // TODO: 测试用（因为用手机扫码开发工具二维码的测试场合，获取不到openid
              //userinfo['openid'] = 'oAs4Q5f-LOAmNghgUF4jEOAxfH60'
            }
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