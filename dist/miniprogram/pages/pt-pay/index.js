const ptCommon = require('../pt.common.js');
Page({
  data: {},

  onUnload() {
    wx.removeStorageSync('DATA_FROM_PLUGIN');
  },
  // onLoad(options) {
  //   // console.log('herer is pt-pay onload method options value...');
  //   // console.log(options); 
  //   var payObj = wx.getStorageSync('DATA_FROM_PLUGIN');
    
  //   this.setData({payInfo: payObj.payInfo});

  //   // console.log(options.options);
  //   // var jsonVal = JSON.parse(options.options);
  //   // console.log(jsonVal);
  //   this.setData({options: options.options});
  // },

  onLoad() {
    var data = wx.getStorageSync('DATA_FROM_PLUGIN');
    if (data) {
      this.setData({input: data});
      console.log('------ input data from plugin page: ');
      console.log(data);
    }
  },

  pay: function() {
    var that = this;

    console.log('------ payment parameters:');
    console.log(that.data.input.payInfo);
    
    // TODO: 真机测试
    wx.requestPayment({
      'timeStamp': that.data.input.payInfo.timeStamp,
      'nonceStr': that.data.input.payInfo.nonceStr,
      'package': that.data.input.payInfo.packageStr,
      'signType': 'MD5',
      'paySign': that.data.input.payInfo.sign,
      'success': function (res) {
        console.log('支付成功');
        console.log(res);
      },
      'fail': function (res) {
        console.log('支付失败');
        console.log(res);
        return;
      },
      'complete': function () {
        console.log('支付完成');
        // var url = that.data.url;

        // TODO: 支付正常后，打开注解
        //if (res.errMsg == 'requestPayment:ok') {
        wx.showModal({
          title: '提示',
          content: '充值成功'
        });

        // if (url) {
        //   setTimeout(function () {
        //     ptCommon.gotoPageFromPlugin({
        //       detail: {
        //         target: that.data.options.targetCallbakUrl,
        //         options: that.data.options
        //       }
        //     });
        //   }, 2000);
        // } else {
        //   setTimeout(() => {
        //     wx.navigateBack();
        //   }, 2000);
        // }


        setTimeout(function () {
          var target = that.data.input.targetCallbakUrl;
          console.log('will goto : ' + target);
          console.log('old data from pre page: ');
          console.log(that.data.input);
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
          });
        }, 2000);

        
        //}

        return;
      }
    });
  }
});
