/* eslint-disable no-console */
var utils = require('../../utils/util.js');
var timer = require('../../utils/wxTimer.js');
var wxTimer = null;

Component({
  properties: {
    options: {
      type: Object,
      value: {},
      observer: function (newVal) {
        console.log('plugin(detail-grp) -- options value : -----------');
        console.log(newVal);
        console.log('plugin(detail-grp) -- options value : -----------');
        if (newVal) {          
          var jsonVal = JSON.parse(newVal.options);
          this.setData({ grpId: jsonVal.grpId });
          this.setData({ grp_status: jsonVal.grp_status });
          this.loadPage();
        }
      }
    }    
  },

  data: {
    grpId: '',
    grp_status: 0,
    status_image_success: '../../images/icons/success.png',
    status_image_fail: '../../images/icons/fail.png',
    wxTimerList:[]
  },

  attached() {

    // let self = this;
    // let tempData = {};
    // let status = '000';

    // try {
    //   status = wx.getStorageSync('status');
    //   if (status == '001') {
    //     self.setData({
    //       status: {
    //         code: status,
    //         image: '../../images/icons/on.png',
    //         info: '发起拼团成功',
    //         css: 'on'
    //       }
    //     });
    //   }

    //   // detail data
    //   tempData = {
    //     prdId: '10001',
    //     prdName: '商品名称',
    //     prdDesc: '这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容',
    //     prdImage: '../../images/pt-003.png',
    //     numbers: 3,
    //     leftNumbers: 2,
    //     salesCount: 100,
    //     price_pref: 99,
    //     price_suff: 30,
    //     orgPrice: 1000,
    //     leftHour: 10,
    //     leftMinute: 20,
    //     leftSecond: 20
    //   };
    //   self.setData({prdDetail: tempData});
    // } catch (e) {
    //   // do something
    // }

    // // 计数器
    // let timeStr = tempData.leftHour + ':' + tempData.leftMinute + ':' + tempData.leftSecond;
    // wxTimer = new timer({
    //   beginTime: timeStr
    // });
    // wxTimer.start(self);    
  },

  detached() {
    wxTimer.stop();
  },

  methods: {
    loadPage() {
      console.log('grpId is : ' + this.data.grpId);

      var that = this;
      // 根据 grpId 获取拼团详细信息
      wx.request({
        url: 'https://apigroupbuy.kfc.com.cn/groupbuying/group/groupdetail',
        data: { grpId: that.data.grpId },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        success(res) {
          var detail = utils.formatGroupDetailData(res.data);
          that.setData({grpDetail: detail});
          // 计数器
          var timeStr = detail.leftTime_h + ':' + detail.leftTime_m + ':' + detail.leftTime_s;
          wxTimer = new timer({
            beginTime: timeStr
          });
          wxTimer.start(that);             
        }
      });
    },
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