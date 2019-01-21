/* eslint-disable no-console */
// pages/detail-pro/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, //当前所在滑块的 index
    salesRecord: [],
    showModal: false,
    min:1,//最小值 整数类型，null表示不设置
    max: 5,//最大值 整数类型，null表示不设置
    num: 1,//输入框数量 整数类型
    change: 1,//加减变化量 整数类型
    def_num: 5//输入框值出现异常默认设置值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 根据传递过来prdId获取商品详细信息
    let prdId = options.prdId;
    console.log(prdId);
    let that = this;
    wx.request({
      url: 'https://www.hugchina.cn/hugchina/prds',
      data: {
        brand: '1001'
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res);
        // 测试用，实际是从res中获取如下数据
        let tempData = {
          prdId: '10001',
          prdName: '商品名称',
          prdDesc: '这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容',
          prdImage: '../../images/pt001-detail.jpg',
          numbers: 3,
          salesCount: 100,
          leftCount: 50,
          leftTime_d: '12',
          leftTime_h: '12',
          leftTime_m: '12',
          leftTime_s: '12',
          price_pref: 99,
          price_suff: 30,
          orgPrice: 1000,
          detailContent: '凭券可到店兑换1份炭烤鸡腿帕尼尼，仅限1次兑换。\n\n1.使用有效期：自购买日起14天内使用有效，仅限6:00~9:00使用。\n2.这里是使用规则2说明部分',
          question: '券可到店兑换1.....',
          isJoined: 0, // 根据userId查看是否已经参团或者开团，如果是设置为1，同时设置grpId
          grpId: '',
          groups: [
            {
              userId: '1000',
              userName: 'jacob',
              leftNumbers: 2,
              leftTime_h: '12',
              leftTime_m: '12'
            },
            {
              userId: '1001',
              userName: 'rachel',
              leftNumbers: 1,
              leftTime_h: '12',
              leftTime_m: '12'           
            }
          ],
          records: [
            {
              userId: '1000',
              time: 3000,
              count: 1
            },
            {
              userId: '1001',
              time: 3000,
              count: 1
            }
          ]
        };

        // TODO: 数据format
        
        
        that.setData({prdDetail: tempData});
      }
    });

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


  gotoGroup: function() {
    wx.navigateTo({
      url: '../detail-grp/index',
    });
  },


  //tab切换
  tab: function (event) {
    if (event.target.dataset.current == 1) {
      console.log('testtest');
    }
    this.setData({ currentTab: event.target.dataset.current});
  },
  //滑动事件
  eventchange: function (event) {
    this.setData({ currentTab: event.detail.current });
  },


  showModal: function (e) {
    let buyway = e.currentTarget.dataset.buyway;
    console.log(buyway);
    this.setData({
      showModal: true
    });
  },

  //输入框失去焦点事件
  evblur: function (e) {
    var zval = parseInt(e.detail.value);
    console.log(zval);
    //正则 正整数 0 负整数
    if (/(^-[1-9][0-9]{0,}$)|(^0$)|(^[1-9][0-9]{0,}$)/.test(zval)){
      //最大值
      if (this.data.max != null) {
        if (zval > this.data.max) {
          console.log('超出最大值');
          this.setData({ num: this.data.def_num });
        }else{
          this.setData({ num: zval });
        }
      } else {
        this.setData({ num: zval });
      }
      //最小值
      if (this.data.min != null) {
        if (zval < this.data.min) {
          console.log('低于最小值');
          this.setData({ num: this.data.def_num });
        } else {
          this.setData({ num: zval });
        }
      } else {
        this.setData({ num: zval });
      }
    } else {
      console.log('不是整数');
      this.setData({ num: this.data.def_num });
    }
  },
  //加
  evad: function () {
    var cval = Number(this.data.num) + this.data.change;
    if (this.data.max != null){
      if (cval > this.data.max){
        console.log('超出最大值');
      }else{
        this.setData({ num: cval });
      }
    }else{
      this.setData({ num: cval });
    }
  },
  //减
  evic: function () {
    var cval = Number(this.data.num) - this.data.change;
    if (this.data.min != null) {
      if (cval < this.data.min) {
        console.log('低于最小值');
      } else {
        this.setData({ num: cval });
      }
    } else {
      this.setData({ num: cval });
    }
  },



  
  next: function() {
    wx.navigateTo({
      url: 'plugin-private://wx85694629dac0c26a/pages/confirm-order/index'
    });
  }



});