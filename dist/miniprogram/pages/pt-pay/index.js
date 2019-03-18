const ptCommon = require('../pt.common.js');
Page({
  data: {},

  onUnload() {
    wx.removeStorageSync('DATA_FROM_PLUGIN');
  },
  onLoad(options) {
    var payObj = wx.getStorageSync('DATA_FROM_PLUGIN');
    this.setData({payInfo: payObj.payInfo});
    this.setData({options: options});
  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data);
  },
  pay: function() {
    var that = this;
    
    // TODO: 真机测试
    wx.requestPayment({
      'timeStamp': that.data.payInfo.timeStamp,
      'nonceStr': that.data.payInfo.nonceStr,
      'package': that.data.payInfo.packageStr,
      'signType': 'MD5',
      'paySign': that.data.payInfo.sign,
      'success': function (res) {
        console.log('支付成功');
        console.log(res);
      },
      'fail': function (res) {
        console.log('支付失败');
        console.log(res);
        return;
      },
      'complete': function (res) {
        console.log('支付完成');
        var url = that.data.url;
        console.log('get url', url);
        if (res.errMsg == 'requestPayment:ok') {
          wx.showModal({
            title: '提示',
            content: '充值成功'
          });
          if (url) {
            setTimeout(function () {
              ptCommon.gotoPageFromPlugin({
                detail: {
                  target: that.data.options.targetCallbakUrl,
                  options: that.data.options
                }
              });
            }, 2000);
          } else {
            setTimeout(() => {
              wx.navigateBack();
            }, 2000);
          }
        }
        return;
      }
    });
  }
});
