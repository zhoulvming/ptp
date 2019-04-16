/* eslint-disable no-console */
// const config = require('../../lib/config.js');
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
          var jsonVal = newVal;
          this.setData({ grpId: jsonVal.grpId });
          this.setData({ grp_status: jsonVal.grp_status });
          if (jsonVal.buyCount) {
            this.setData({ buyCount: jsonVal.buyCount});
          }
          this.loadPage();
        }
      }
    }    
  },

  data: {
    grpId: null,
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
    maskHidden: false,
    cardInfo: {
      avater: 'http://t2.hddhhn.com/uploads/tu/201806/9999/91480c0c87.jpg', //需要https图片路径
      qrCode: 'http://i4.hexun.com/2018-07-05/193365388.jpg', //需要https图片路径
      TagText: '小姐姐', //标签
      Name: '小姐姐', //姓名
      Position: '程序员鼓励师', //职位
      Mobile: '13888888888', //手机
      Company: '才华无限有限公司', //公司
    }
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
    gotoNext(event) {
      var that = this;
      var target = event.currentTarget.dataset.target;
      var prdId = event.currentTarget.dataset.prdid;
      console.log(that.data.buywayPrice);
      that.triggerEvent('callback', {
        target: target,
        options: {
          prdId: prdId,
          grpId: that.data.grpId,
          orderNum: that.data.num,
          buyway: that.data.buyway,
          buywayPrice: that.data.buywayPrice
        }
      });
    },
    gotoHomePage(event) {
      var value = event.currentTarget.dataset.target;
      this.triggerEvent('callback', {
        target: value,
        options: {
          brand: wx.getStorageSync('brand'),
          channelId: wx.getStorageSync('channelId')
        }
      });
    },
    showModal: function (e) {
      var buyway = e.currentTarget.dataset.buyway;
      var detail = this.data.grpDetail;
      this.setData({
        showModal: true
      });

      this.setData({
        buyway: buyway,
        buywayPrice: detail.price
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
      var that = this;
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

      var price = that.data.grpDetail.price;
      that.setData({ buywayPrice: price * cval });

    },
    //减
    evic: function () {
      var that = this;
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

      var price = that.data.grpDetail.price;
      that.setData({ buywayPrice: price * cval });
    },


    // 生成海报
    getSharePoster() {
      this.selectComponent('#poster').getAvaterInfo();
    },

  }
});