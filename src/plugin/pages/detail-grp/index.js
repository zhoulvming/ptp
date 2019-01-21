/* eslint-disable no-console */
// pages/detail-grp/index.js

var timer = require('../../utils/wxTimer.js');
var wxTimer = new timer({
  beginTime: '20:00:00'
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxTimerList:[],
    args: {
      fee: 1, // 支付金额，单位为分
      paymentArgs: 'A' // 将传递到功能页函数的自定义参数
    },
    args2: {
      withCredentials: true,
      lang: 'zh_CN'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    wxTimer.start(this);


    // let tempData = {};
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // wxTimer.stop();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  // 支付成功的回调接口
  paymentSuccess(e) {
    console.log(e);
  },
  // 支付失败的回调接口
  paymentFailed(e) {
    console.log(e);
  },
  loginSuccess(res) {
    console.log(res.detail);
  },
  loginFail(res) {
    console.log(res);
  }
});