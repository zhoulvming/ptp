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
          this.setData({ prdId: jsonVal.prdId });
          this.loadPage();
        }
      }
    }
  },

  data: {
    prdId: '',
    currentTab: 0, //当前所在滑块的 index
    salesRecord: [],
    showModal: false,
    min:1,//最小值 整数类型，null表示不设置
    max: 5,//最大值 整数类型，null表示不设置
    num: 1,//输入框数量 整数类型
    change: 1,//加减变化量 整数类型
    def_num: 5,//输入框值出现异常默认设置值
    buyway: 0,
    buywayPrice: 0,
    haveShowAllGroups: 'block',
    haveOrder: false,
    orderId: '',
    wxTimerList:[]
  },

  attached() {
  },
  detached() {
    wxTimer.stop();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoNext(event) {
      var that = this;
      var target = event.currentTarget.dataset.target;
      var status = event.currentTarget.dataset.status;
      var prdId = event.currentTarget.dataset.prdid;
      wx.setStorageSync( {key: 'status', data: status} );
      this.triggerEvent('callback', {
        target: target,
        options: {
          prdId: prdId,
          orderNum: that.data.num,
          buyway: that.data.buyway,
          buywayPrice: that.data.buywayPrice
        }
      });
    },

    gotoGrpDetail(event) {
      // var that = this;
      var target = event.currentTarget.dataset.target;
      var grpId = event.currentTarget.dataset.grpid;
      this.triggerEvent('callback', {
        target: target,
        options: {
          grpId: grpId,
          grp_status: config.grp_status_join
        }
      });      
    },

    loadPage() {
      console.log('prdId is : ' + this.data.prdId);
      var that = this;
      // 根据prdId获取商品详细信息
      wx.request({
        url: 'https://apigroupbuy.kfc.com.cn/groupbuying/product/prddetail',
        data: { prdId: that.data.prdId },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        success(res) {
          var detail = res.data;
          detail = utils.formatProductData(detail);
          that.setData({prdDetail: detail});

          // 计数器
          var timeStr = detail.leftTime_h + ':' + detail.leftTime_m + ':' + detail.leftTime_s;
          wxTimer = new timer({
            beginTime: timeStr
          });
          wxTimer.start(that);
        }
      });
      
      //根据prdId获取该商品的成团列表(默认显示3条)
      wx.request({
        url: 'https://apigroupbuy.kfc.com.cn/groupbuying/group/grouplist',
        data: {prdId: that.data.prdId, flag: 0},
        header: { 'content-type': 'application/json' },
        method: 'POST',
        success(res) {
          var grps = utils.formatGroupListData(res.data);
          that.setData({grps: grps});
        }
      });
    },
    showAllGroups() {
      var that = this;
      if (that.data.haveShowAllGroups == 'none') {
        return ;
      }
      //根据prdId获取该商品的成团列表(全部显示)
      wx.request({
        url: 'https://apigroupbuy.kfc.com.cn/groupbuying/group/grouplist',
        data: {prdId: that.data.prdId, flag: 1},
        header: { 'content-type': 'application/json' },
        method: 'POST',
        success(res) {
          that.setData({grps: utils.formatGroupListData(res.data)});
          that.setData({haveShowAllGroups: 'none'});
        }
      });
    },

    //tab切换
    tabChange: function (event) {
      var that = this;
      // 当切换到成交记录tab时，获取数据
      if (event.target.dataset.current == 1) {
        var records = that.data.records;
        if (!records) {
          wx.request({
            url: 'https://apigroupbuy.kfc.com.cn/groupbuying/group/orderlist',
            data: {
              prdId: that.data.prdId,
              flag: 0
            },
            method: 'POST',
            header: { 'content-type': 'application/json' },
            success(res) {
              var records = res.data;
              that.setData({records: records});
            }
          });
        }
      }

      this.setData({ currentTab: event.target.dataset.current});
    },
    //滑动事件
    tabSwiper: function (event) {
      this.setData({ currentTab: event.detail.current });
    },    
    showModal: function (e) {
      let buyway = e.currentTarget.dataset.buyway;
      let detail = this.data.prdDetail;
      this.setData({
        showModal: true
      });

      var buywayPrice = detail.price;
      if (buyway && buyway == config.buyway_single) {
        buywayPrice = detail.orgPrice;
      }

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