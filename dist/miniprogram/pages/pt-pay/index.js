const ptCommon = require('../pt.common.js');
Page({
  data: {
    txtOrderCode: '',
    price: 0
  },
  onLoad(options) {
    var jsonVal = JSON.parse(options.options);
    this.setData({price:jsonVal.price});
  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data);
  },

  payRealy: function () {
    var ordercode = this.data.txtOrderCode;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: '',
            data: {
              code: res.code,//要去换取openid的登录凭证
              ordercode: ordercode
            },
            method: 'GET',
            success: function (res) {
              console.log(res.data);
              wx.requestPayment({
                timeStamp: '',
                nonceStr: '',
                package: '',
                signType: 'MD5',
                paySign: '',
                success: function (res) {
                  // success
                  console.log(res);
                },
                fail: function (res) {
                  // fail
                  console.log(res);
                },
                complete: function (res) {
                  // complete
                  console.log(res);
                }
              });
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
        }
      }
    });
  },
  pay: function() {
    wx.navigateTo({
      url: '../pt-detail-order/index'
    });
  },
  getOrderCode: function (event) {
    this.setData({
      txtOrderCode: event.detail.value
    });
  }
});
