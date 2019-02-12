/* eslint-disable no-console */
var timer = require('../../utils/wxTimer.js');
var wxTimer = null;

Component({
  properties: {
  },

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

  attached() {

    let self = this;
    let tempData = {};
    let status = '000';

    try {
      status = wx.getStorageSync('status');
      if (status == '001') {
        self.setData({
          status: {
            code: status,
            image: '../../images/icons/on.png',
            info: '发起拼团成功',
            css: 'on'
          }
        });
      }

      // detail data
      tempData = {
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
      self.setData({prdDetail: tempData});
    } catch (e) {
      // do something
    }

    // 计数器
    let timeStr = tempData.leftHour + ':' + tempData.leftMinute + ':' + tempData.leftSecond;
    wxTimer = new timer({
      beginTime: timeStr
    });
    wxTimer.start(self);    
  },

  detached() {
    wxTimer.stop();
  },

  methods: {
    gotoPage(event) {
      var value = event.currentTarget.dataset.target;
      this.triggerEvent('callback', {target: value});
    },
    formSubmit() {
      wx.showToast({
        title: '装逼中...',
        icon: 'loading',
        duration: 1000
      });
    }
  }
});