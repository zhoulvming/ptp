const ptCommon = require('../pt.common.js');
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
    // 此处模拟小程序登录后返回的用户信息，保存在小程序本地缓存，同时跳转到小程序拼团订单的确认页面
    var userinfo = {
      userCode: '1000',
      openid: 'xfjlsfjlsfjsdfsdjafsalfsaf',
      nickname: 'nickname'
    };
    wx.setStorageSync('userinfo', userinfo );
    wx.setStorageSync('options', this.data.options );
    wx.navigateTo({
      url: '../pt-confirm-order/index'
    });
  }
});