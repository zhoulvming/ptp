const ptCommon = require('../pt.common.js')
Page({
  data: {},
  onUnload() {
    wx.removeStorageSync('DATA_FROM_PLUGIN')
  },
  onLoad() {
    var data = wx.getStorageSync('DATA_FROM_PLUGIN')
    if (data) {
      this.setData({input: data});
      ptCommon.log('插件页面传递过来的支付数据', data)
    }
  },
  pay: function() {
    var that = this
    ptCommon.log('支付参数', that.data.input.payInfo)
    
    // TODO: 真机测试
    wx.requestPayment({
      'timeStamp': that.data.input.payInfo.timeStamp,
      'nonceStr': that.data.input.payInfo.nonceStr,
      'package': that.data.input.payInfo.packageStr,
      'signType': 'MD5',
      'paySign': that.data.input.payInfo.sign,
      'success': function (res) {
        ptCommon.log('支付成功', res)
      },
      'fail': function (res) {
        ptCommon.log('支付失败', res)
        return
      },
      'complete': function (res) {
        if (res.errMsg == 'requestPayment:ok') {
          wx.showModal({
            title: '提示',
            content: '充值成功'
          })
          setTimeout(function () {
            var target = that.data.input.targetCallbakUrl
            ptCommon.gotoPageFromPlugin({
              detail: {
                target: target,
                options: {
                  price: that.data.input.price,
                  orderNo: that.data.input.orderNo,
                  grp_status: that.data.input.grp_status,
                  grpId: that.data.input.grpId,
                  buyCount: that.data.input.orderNum
                }
              }
            })
          }, 2000)
        }
        return
      }
    })
  }
})