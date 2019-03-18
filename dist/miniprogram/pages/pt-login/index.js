const ptCommon = require('../pt.common.js');
var app = getApp();

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
    var userInfo = app.globalData.userInfo;
    
    // TODO: 此处调用小程序系统登录逻辑，登录成功后设置用户手机号码等信息到globalData
    var mobile = '1234566677';
    var userCode = '1000';
    var openid = 'oWolJ5Lis-ex2YiiwJXBF-FqYWfk';


    userInfo.mobile = mobile;
    userInfo.userCode = userCode;
    userInfo.openid = openid;
    app.globalData.userInfo = userInfo;

    wx.setStorageSync('userinfo', userInfo );
    wx.setStorageSync('options', this.data.options );
    wx.navigateTo({
      url: '../pt-confirm-order/index'
    });
  }
});