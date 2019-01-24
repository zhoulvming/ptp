/* eslint-disable no-console */
var timer = require('../../utils/wxTimer.js');
var wxTimer = null;

Page({
  data: {
    wxTimerList:[],
    args: {
      fee: 1, // 支付金额，单位为分
      paymentArgs: 'A' // 将传递到功能页函数的自定义参数
    },
    args2: {
      withCredentials: true,
      lang: 'zh_CN'
    },
    status: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // status
    let statusCode = options.status;
    let that = this;
    console.log(statusCode);
    if (statusCode == 1) {
      that.setData({
        status: {
          code: statusCode,
          image: '../../images/icons/on.png',
          info: '发起拼团成功',
          css: 'on'
        }
      });
    }

    // detail data
    let tempData = {
      prdId: '10001',
      prdName: '商品名称',
      prdDesc: '这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容',
      prdImage: '../../images/pt-003.png',
      numbers: 3,
      leftNumbers: 2,
      salesCount: 100,
      price_pref: 99,
      price_suff: 30,
      orgPrice: 1000,
      leftHour: 10,
      leftMinute: 20,
      leftSecond: 20
    };
    that.setData({prdDetail: tempData});

    // 计数器
    let timeStr = tempData.leftHour + ':' + tempData.leftMinute + ':' + tempData.leftSecond;
    wxTimer = new timer({
      beginTime: timeStr
    });
    wxTimer.start(this);


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
  },



  formSubmit() {
    wx.showToast({
      title: '装逼中...',
      icon: 'loading',
      duration: 1000
    });
  }






});