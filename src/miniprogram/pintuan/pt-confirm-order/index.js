const ptCommon = require('../pt.common.js')
const app = getApp()
Page({
  data: {},
  onLoad() {
    var options = wx.getStorageSync('DATA_FROM_PLUGIN')
    this.setData({options: options})

    var userinfo = app.globalData.userinfo
    this.setData({ userinfo: userinfo })
  },
  gotoPageFromPlugin(data) {
    var target = data.detail.target    
    if (target == 'pay') {
      this.pay(data)
    } else {
      ptCommon.gotoPageFromPlugin(data)
    }
  },
  pay: function (data) {
    var options = data.detail.options
    var payInfo = options.payInfo
    ptCommon.log('支付参数', options.payInfo)
    wx.requestPayment({
      'timeStamp': payInfo.timeStamp,
      'nonceStr': payInfo.nonceStr,
      'package': payInfo.packageStr,
      'signType': 'MD5',
      'paySign': payInfo.sign,
      'success': function (res) {
        ptCommon.log('支付成功', res)

        wx.request({
          url: 'https://apigroupbuy.kfc.com.cn/groupbuying/order/updstatus',
          data: {
            prdId: options.prdId,
            payFlg: 1,
            grpId: options.grpId,
            orderNo: options.orderNo            
          },
          header: { 'content-type': 'application/json;charset=utf-8' },
          method: 'POST',
          success(res) {
            if (res.statusCode != 200) {
              console.log('发生后台异常或者错误')
              var dataCode = res.data.code
              console.log(dataCode)
    
              var errMsg = '哎呀...，页面出问题啦！'
              if (dataCode == 9999) {
                errMsg = '您的拼团失败，付款金额将在 7 个工作日内退到您的支付账号'
              }
              wx.setStorageSync('DATA_FROM_PLUGIN', {errMsg: errMsg})
              wx.reLaunch({url: '../pt-error/index'})
            }
          },
          fail() {
            wx.reLaunch({url: '../pt-error/index'})
          }
        })
        
      },
      'fail': function (res) {
        ptCommon.log('支付失败', res)
        return
      },
      'complete': function (res) {
        if (res.errMsg == 'requestPayment:ok') {

          var grpEnter = options.grpEnter
          if (grpEnter == 1) {
            grpEnter = 2
          } else if (grpEnter == 4) {
            grpEnter = 5
          }

          setTimeout(function () {
            var target = options.targetCallbakUrl
            ptCommon.gotoPageFromPlugin({
              detail: {
                target: target,
                options: {
                  prdId: options.prdId,
                  price: options.price,
                  orderNo: options.orderNo,
                  grpEnter: grpEnter,
                  grpId: options.grpId,
                  orderNum: options.orderNum,
                  paySuccessFlag: true
                }
              }
            })
          }, 2000)
        } else {
          wx.showModal({
            title: '提示',
            content: '支付失败'
          })
        }
        return
      }
    })
  }  
})