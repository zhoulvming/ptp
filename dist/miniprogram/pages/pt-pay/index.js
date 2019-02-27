const ptCommon = require('../pt.common.js');
Page({
  data: {
    txtOrderCode: '',
    options: {
      price: 0,
      orderNo: null
    }
  },
  onLoad(options) {
    var jsonVal = JSON.parse(options.options);
    this.setData({options: jsonVal});
  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data);
  },

  // 此处实装小程序的支付页面逻辑，支付URL由插件侧传入
  pay: function() {
    var that = this;
    var url = '../pt-detail-order/index?options=' + JSON.stringify(that.data.options);
    wx.navigateTo({
      url: url
    });
  },
  getOrderCode: function (event) {
    this.setData({
      txtOrderCode: event.detail.value
    });
  }

  // payTest: function () {
  //   var ordercode = this.data.txtOrderCode;
  //   wx.login({
  //     success: function (res) {
  //       if (res.code) {
  //         wx.request({
  //           url: '',
  //           data: {
  //             code: res.code,//要去换取openid的登录凭证
  //             ordercode: ordercode
  //           },
  //           method: 'GET',
  //           success: function (res) {
  //             console.log(res.data);
  //             wx.requestPayment({
  //               timeStamp: '',
  //               nonceStr: '',
  //               package: '',
  //               signType: 'MD5',
  //               paySign: '',
  //               success: function (res) {
  //                 // success
  //                 console.log(res);
  //               },
  //               fail: function (res) {
  //                 // fail
  //                 console.log(res);
  //               },
  //               complete: function (res) {
  //                 // complete
  //                 console.log(res);
  //               }
  //             });
  //           }
  //         });
  //       } else {
  //         console.log('获取用户登录态失败！' + res.errMsg);
  //       }
  //     }
  //   });
  // },


});
