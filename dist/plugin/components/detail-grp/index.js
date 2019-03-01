/* eslint-disable no-console */
const config = require('../../lib/config.js');
var utils = require('../../utils/util.js');
var timer = require('../../utils/wxTimer.js');
var wxTimer = null;

Component({
  properties: {
    options: {
      type: Object,
      value: {},
      observer: function (newVal) {
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
    wxTimerList:[],
    showModal: false,
    min:1,//最小值 整数类型，null表示不设置
    max: 5,//最大值 整数类型，null表示不设置
    num: 1,//输入框数量 整数类型
    change: 1,//加减变化量 整数类型
    def_num: 5,//输入框值出现异常默认设置值
    maskHidden: false
  },

  detached() {
    wxTimer.stop();
  },

  methods: {
    loadPage() {
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
    },

    showModal: function (e) {
      console.log('e.currentTarget.dataset.buyway' + e.currentTarget.dataset.buyway);
      var buyway = e.currentTarget.dataset.buyway;
      var detail = this.data.grpDetail;
      this.setData({
        showModal: true
      });

      var buywayPrice = detail.price;
      console.log(buywayPrice);

      this.setData({
        buyway: buyway,
        buywayPrice: buywayPrice
      });
    },

    hideModalDlg: function() {
      this.setData({
        showModal: false
      });
    },
    evblur: function (e) {
      var zval = parseInt(e.detail.value);
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
    }

  }
});