const ptCommon = require('../pt.common.js');
const app = getApp();
Page({
  data: {},
  onLoad(options) {
    var userinfo = wx.getStorageSync('userinfo');
    this.setData({ userinfo: userinfo });
    this.setData({options: options});    
  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data);
  },
  login() {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        var d = app.globalData;
        // var l = 'https://api.weixin.qq.com/sns/jscode2session?appid='
        //   + d.appid + '&secret=' + d.secret + '&js_code=' + code + '&grant_type=authorization_code';
        var l = 'https://apigroupbuy.kfc.com.cn/groupbuying/weixin/openid';
        wx.request({
          url: l,
          data: {
            code: code,
            appid: d.appid,
            secret: d.secret
          },
          method: 'POST',
          success: function (res) {
            var openid = res.data.openid;
            console.log('--- return openid: ' + openid);
            var userinfo = wx.getStorageSync('userinfo' );
            if (userinfo) {
              userinfo['openid'] = openid;
              userinfo['userCode'] = '1000'; // 此处需要小程序用户的登录信息
              userinfo['mobileNo'] = '123456789';// 此处需要小程序用户的登录信息
              console.log(userinfo);
              wx.setStorageSync('userinfo', userinfo );
              wx.setStorageSync('options', that.data.options );
              wx.navigateTo({
                url: '../pt-confirm-order/index'
              });
            } else {
              console.log('请先利用微信授权获得用户信息');
            }
          },
          fail: function (err) {
            console.log(err);
          }
        });
      }
    });
  },
  onGotUserInfo() {
    console.log('onGotUserInfo');
    wx.getUserInfo({
      success: res => {
        console.log('-----wx.getUserInfo success');
        console.log(res.userInfo);
        wx.setStorageSync('userinfo', res.userInfo );
      },
      fail: res => {
        console.log('-----wx.getUserInfo fail');
        console.log(res);
      }
    });
  }
});