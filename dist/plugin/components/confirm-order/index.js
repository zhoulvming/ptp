const config = require('../../lib/config.js');
var utils = require('../../utils/util.js');
var timer = require('../../utils/wxTimer.js');
var wxTimer = null;

Component({
  properties: {
    userinfo: {
      type: Object,
      value: {},
      observer: function (newVal) {
        if (newVal) {
          this.setData({ userinfo: newVal });
        }
      }
    },
    options: {
      type: Object,
      value: {},
      observer: function (newVal) {
        if (newVal) { 
          var jsonVal = JSON.parse(newVal.options);
          if (jsonVal.grpId) {
            this.setData({ grpId: jsonVal.grpId });
          }
          this.setData({ prdId: jsonVal.prdId });
          this.setData({ orderNum: jsonVal.orderNum });
          this.setData({ buyway: jsonVal.buyway });
          this.setData({ buywayPrice: jsonVal.buywayPrice });
          this.loadPage();
        }
      }         
    }
  },

  data: {
    prdId: null,
    grpId: null,
    orderNum: null,
    userinfo: null,
    buyway: null,
    buywayPrice: null,
    wxTimerList:[]
  },

  attached() {
  },
  detached() {
    wxTimer.stop();
  },

  methods: {

    // '选好了' 按钮对应事件处理
    gotoNext() {
      var that = this;

      // 用户是否登录小程序系统check
      var userinfo = that.data.userinfo;

      if (userinfo) {
        console.log('用户已登录');
        console.log(userinfo);

        // 调用下单接口
        var isMaster = 1;
        if (that.data.grpId) {
          isMaster = 0;
        }

        var activityId = that.data.prd.groupBuyProId;
        if (that.data.buyway == config.buyway_single) {
          activityId = that.data.prd.orgProdId;
        }
        var data = {
          mobileNo: that.data.userinfo.mobileNo,
          brand: wx.getStorageSync('brand'),
          catgryName: that.data.prd.catgryName,
          userCd: userinfo.userCode,
          quantity: that.data.orderNum,
          openId: userinfo.openid,
          prdId: that.data.prd.prdId,
          grpId: that.data.grpId,
          nickName: userinfo.nickname,
          atavaUrl: userinfo.avatarUrl,
          isMaster: isMaster,
          activityId: activityId
        };

        wx.request({
          url: 'https://apigroupbuy.kfc.com.cn/groupbuying/order/creation',
          header: { 'content-type': 'application/json' },
          method: 'POST',
          data: data,
          success(res) {
            console.log(res.data);

            // 下单成功后跳转到小程序的支付模块，在小程序的支付页面中支付成功后直接跳转到插件的订单详情页面
            var price = that.data.buywayPrice * that.data.orderNum;
            that.triggerEvent('callback', {
              target: 'pay',
              options: {
                price: price,
                grp_status: config.grp_status_create
              }
            });

            // 下单成功后跳到拼团详情页面
            // that.triggerEvent('callback', {
            //   target: 'detail-grp',
            //   options: {
            //     grpId: grpId,
            //     grp_status: config.grp_status_join
            //   }
            // });            
          },
          fail: function({errMsg}) {
            console.log(errMsg);
          }
        });

      } else {
        console.log('用户未登录');
        this.triggerEvent('callback', {
          target: 'login',
          options: {
            prdId: that.data.prdId,
            orderNum: that.data.orderNum,
            buyway: that.data.buyway,
            buywayPrice: that.data.buywayPrice
          }
        });

      }
    },
    loadPage() {
      var that = this;
      // 根据prdId获取商品详细信息
      wx.request({
        url: 'https://apigroupbuy.kfc.com.cn/groupbuying/product/prddetail',
        data: { prdId: that.data.prdId },
        header: { 'content-type': 'application/json' },
        method: 'POST',        
        success(res) {
          var prdData = utils.formatProductData(res.data);
          that.setData({prd: prdData});

          var orderData = that.formatOrderData(prdData);
          that.setData({order: orderData});

          // 计数器
          var timeStr = prdData.leftTime_h + ':' + prdData.leftTime_m + ':' + prdData.leftTime_s;
          wxTimer = new timer({
            beginTime: timeStr
          });
          wxTimer.start(that);
        }
      });
    },
    formatOrderData(prdData) {
      var that = this;
      var price_pref = null;
      var price_suff = null;
      if (that.data.buyway == config.buyway_single) {
        var price = utils.formatPrice(that.data.buywayPrice);
        price_pref = price.pref;
        price_suff = price.suff;
      } else {
        price_pref = prdData.price_pref;
        price_suff = prdData.price_suff;
      }
      return {
        price_pref: price_pref,
        price_suff: price_suff,
        orderNum: that.data.orderNum,
        prdName: prdData.prdName,
        leftTime_d: prdData.leftTime_d,
        leftTime_h: prdData.leftTime_h,
        leftTime_m: prdData.leftTime_m,
        leftTime_s: prdData.leftTime_s,
        imageSingle: prdData.imageSingle,
        validDays: prdData.validDays
      };
    }
  }
});