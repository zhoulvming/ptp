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
    if (target == 'login') {
      ptCommon.gotoPageFromPlugin(data)
    } else {
      this.pay(data)
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
      },
      'fail': function (res) {
        ptCommon.log('支付失败', res)
        wx.showModal({
          title: '提示',
          content: '支付失败'
        })        
        return
      },
      'complete': function (res) {
        if (res.errMsg == 'requestPayment:ok') {
          wx.showModal({
            title: '提示',
            content: '支付成功'
          })
          setTimeout(function () {
            var target = options.targetCallbakUrl
            ptCommon.gotoPageFromPlugin({
              detail: {
                target: target,
                options: {
                  prdId: options.prdId,
                  price: options.price,
                  orderNo: options.orderNo,
                  grpEnter: options.grpEnter,
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