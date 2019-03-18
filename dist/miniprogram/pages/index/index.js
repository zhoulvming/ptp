const app = getApp();
// const doAuth = require('../doAuth.js');

Page({
  data: {},
  onLoad() {

    var jsonStr = "{\"appId\":\"wx4c78682bea26ab3c\",\"partnerId\":null,\"prePayId\":null,\"timeStamp\":\"1552889849\",\"nonceStr\":\"7e19e7c9f208496088ba6b20e795e439\",\"packageStr\":\"prepay_id=wx1814172964920596674e7cb53771780271\",\"signType\":\"MD5\",\"sign\":\"B881896EBDC517F53A3877084A28B02A\"}";
    var jsonObj = JSON.parse(jsonStr);
    console.log(jsonObj);



    //doAuth('getUserInfo');

    // if (wx.openSetting) {
    //   wx.openSetting({
    //     success: function (res) {
    //       console.log(res);
    //     }
    //   });
    // } else {
    //   wx.showModal({
    //     title: '授权提示: ',
    //     content: 'CJ拼团需要您的微信授权才能使用。错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
    //   });
    // }

    // wx.getSetting({
    //   success: res => {
    //     console.log(res);
    //   }
    // });



    // wx.getUserInfo({
    //   success: res => {
    //     console.log(res);
    //   },
    //   fail: res => {
    //     console.log(res);
    //   }
    // });


    // wx.showLoading({
    //   title: '登录中'
    // });

    // wx.getSetting({
    //   success: res => {
    //     console.log(res);
    //     if (res.authSetting['scope.userInfo'] === true) { // 成功授权
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           console.log(res);
    //           this.setUserInfoAndNext(res);
    //         },
    //         fail: res => {
    //           console.log(res);
    //         }
    //       });
    //     } else if (res.authSetting['scope.userInfo'] === false) { // 授权弹窗被拒绝
    //       wx.openSetting({
    //         success: res => {
    //           console.log(res);
    //         },
    //         fail: res => {
    //           console.log(res);
    //         }
    //       });
    //     } else { // 没有弹出过授权弹窗
    //       wx.getUserInfo({
    //         success: res => {
    //           console.log(res);
    //           this.setUserInfoAndNext(res);
    //         },
    //         fail: res => {
    //           console.log(res);
    //           wx.openSetting({
    //             success: res => {
    //               console.log(res);
    //             },
    //             fail: res => {
    //               console.log(res);
    //             }
    //           });
    //         }
    //       });
    //     }
    //   }
    // });
  },
  pay() {
    wx.login({
      success: function (res) {
        var code = res.code;
        console.log('wx.login=>res:');
        console.log(res);

        var d = app.globalData;
        var l = 'https://api.weixin.qq.com/sns/jscode2session?appid='
          + d.appid + '&secret=' + d.secret + '&js_code=' + code + '&grant_type=authorization_code';
        wx.request({
          url: l,  
          data: {},
          method: 'GET',
          success: function(res) {
            console.log('openid api was called =>openid:');
            console.log(res);
          },
          fail: function(err) {
            console.log(err);
          }
        });


        // wx.request({
        //   url: 'https://apigroupbuy.kfc.com.cn/groupbuying/order/openid',
        //   data: {
        //     code: code,
        //     appid: d.appid,
        //     secret: d.secret
        //   },
        //   header: { 'content-type': 'application/json' },
        //   method: 'POST',
        //   success(res) {
        //     console.log(res);
        //   }
        // });        



        // wx.getUserInfo({
        //   success: function (res) {
        //     console.log('wx.getUserInfo=>res:');
        //     console.log(res);



        //     var d = app.globalData;
        //     var l = 'https://api.weixin.qq.com/sns/jscode2session?appid='
        //       + d.appid + '&secret=' + d.secret + '&js_code=' + code + '&grant_type=authorization_code';
        //     wx.request({
        //       url: l,  
        //       data: {},
        //       method: 'GET',
        //       success: function(res) {
        //         console.log('openid api was called =>res:');
        //         console.log(res);
        //       },
        //       fail: function(err) {
        //         console.log(err);
        //       }
        //     });


        //   }
        // });      








      }
         

    });
    
  }
});