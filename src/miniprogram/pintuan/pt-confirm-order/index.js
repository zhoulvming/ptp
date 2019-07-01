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

        // TODO: 添加更新状态的逻辑代码
      },
      'fail': function (res) {
        ptCommon.log('支付失败', res)
        return
      },
      'complete': function (res) {
        if (res.errMsg == 'requestPayment:ok') {

          // grpEnter: {
          //   create: 1,
          //   create_success: 2,
          //   create_fail: 3,
          //   join: 4,
          //   join_success: 5,
          //   join_fail: 6,
          //   fromOrder: 7
          // },

          var grpEnter = options.grpEnter
          if (grpEnter == 1) {
            grpEnter = 2
          } else if (grpEnter == 4) {
            grpEnter = 5
          }

          console.log('grpEnter value :')
          console.log(grpEnter)

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