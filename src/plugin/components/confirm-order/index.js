const config = require('../../lib/config.js')
var utils = require('../../utils/util.js')
var timer = require('../../utils/wxTimer.js')
var wxTimer = null

Component({
  properties: {
    userinfo: {
      type: Object,
      value: {},
      observer: function (newVal) {
        console.log('--- plugin-- userinfo: ')
        console.log(newVal)
        if (newVal) {
          this.setData({ userinfo: newVal });
        }
      }
    },
    options: {
      type: Object,
      value: {},
      observer: function (newVal) {
        console.log('Observer data from app page(confirm-order):--------');
        console.log(newVal);
        if (newVal) { 
          var jsonVal = newVal;
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
    nextBtnDisabled: false,
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
    wxTimer.stop()
  },

  methods: {
    // '选好了' 按钮对应事件处理
    gotoNext() {
      var that = this
      var userinfo = that.data.userinfo
      that.setData({nextBtnDisabled: true})
      if (userinfo && userinfo.userCode) {
        console.log('用户已登录----:')
        console.log(userinfo)

        // 没有grpId的场合，就不是团长，是凑团
        var isMaster = 1
        if (that.data.grpId) {
          isMaster = 0
        }

        var activityId = that.data.prd.groupBuyProId;
        if (that.data.buyway == config.buyway_single) {
          activityId = that.data.prd.orgProdId;
        }

        // 下单参数
        var data = {
          mobileNo: userinfo.mobileNo,
          brand: wx.getStorageSync('brand'),
          catgryName: that.data.prd.catgryName,
          userCd: userinfo.userCode,
          quantity: that.data.orderNum,
          openId: userinfo.openid,
          prdId: that.data.prd.prdId,
          grpId: that.data.grpId,
          nickName: userinfo.nickName,
          avatarUrl: userinfo.avatarUrl,
          isMaster: isMaster,
          activityId: activityId,
          buyway: that.data.buyway,
          channelId: wx.getStorageSync('channelId')
        }

        console.log('下单数据-------: ')
        console.log(data)

        // 正式下单
        //that.createOrder(data, that.pay)
        
      } else {
        console.log('用户未登录');
        this.triggerEvent('callback', {
          target: 'login',
          options: {
            prdId: that.data.prdId,
            grpId: that.data.grpId,
            orderNum: that.data.orderNum,
            buyway: that.data.buyway,
            buywayPrice: that.data.buywayPrice
          }
        })
      }

      setTimeout(function(){
        that.setData({nextBtnDisabled: false})
      }, 1000)
    },
    createOrder(data, cb_pay) {
      var that = this
      var orderUrl = 'https://apigroupbuy.kfc.com.cn/groupbuying/order/creation'
      wx.request({
        url: orderUrl,
        header: { 'content-type': 'application/json' },
        method: 'POST',
        data: data,
        success(res) {
          if (res.statusCode == 200) {
            console.log('下单成功')
            //下单成功后继续调用支付接口
            var price = that.data.buywayPrice * that.data.orderNum
            var grpId = res.data.grpId
            var callbackUrl = 'detail-grp'
            if (data.grpId || data.buyway == config.buyway_single) {
              // 凑团支付后跳转到订单详情页面
              callbackUrl = 'detail-order'
            }            
            var dataPayment = {
              openId: that.data.userinfo.openid,
              orderNo: res.data.orderNo,
              channelId: wx.getStorageSync('channelId'),
              returnUrl: ''
            }
            var callbackData = {
              orderNo: res.data.orderNo,
              price: price,
              grpId: grpId,
              callbackUrl: callbackUrl
            }

            console.log('支付参数&回调数据')
            console.log(dataPayment)
            console.log(callbackData)

            // 调用支付
            cb_pay(dataPayment, callbackData)
          } else {
            console.log('下单失败: ' + res.data.error)
          }
        },
        fail: function({errMsg}) {
          console.log('下单失败：' + errMsg)
        }
      })
    },
    pay(dataPayment, callbackData) {
      var that = this
      var apiUrl = 'https://apigroupbuy.kfc.com.cn/groupbuying/payment/payurl'
      wx.request({
        url: apiUrl,
        header: { 'content-type': 'application/json' },
        method: 'POST',
        data: dataPayment,
        success(res) {
          if (res.statusCode == 200 && res.data.payUrl) {
            // 跳转到小程序支付模块进行支付
            var payUrl = JSON.parse(res.data.payUrl);
            that.triggerEvent('callback', {
              target: 'pay',
              options: {
                price: callbackData.price,
                orderNo: callbackData.orderNo,
                grp_status: config.grp_status_create,
                grpId: callbackData.grpId,
                targetCallbakUrl: callbackData.callbackUrl,
                buyCount: that.data.orderNum,
                payInfo: {
                  timeStamp: payUrl.timeStamp,
                  nonceStr: payUrl.nonceStr,
                  packageStr: payUrl.packageStr,
                  sign: payUrl.sign
                }
              }
            })
          } else {
            console.log('获取支付URL失败: ' + res.data.error)
          }
        },
        fail: function({errMsg}) {
          console.log('获取支付URL失败: ' + errMsg)
        }
      })
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
      var orderNum = that.data.orderNum*1;

      if (that.data.buyway == config.buyway_single) {
        var price = utils.formatPrice(that.data.buywayPrice * 1/orderNum);
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
    },
    getPaymentURL(orderNo) {
      var payUrl = '';

      // var that = this;
      // var userinfo = that.data.userinfo;
      // var openId = userinfo.openid;
      var openId = 'oWolJ5Lis-ex2YiiwJXBF-FqYWfk';
      
      var data = {
        openId: openId,
        orderNo: orderNo,
        channelId: wx.getStorageSync('channelId'),
        returnUrl: ''
      };
      wx.request({
        url: 'https://apigroupbuy.kfc.com.cn/groupbuying/payment/payurl',
        header: { 'content-type': 'application/json' },
        method: 'POST',
        data: data,
        success(res) {
          if (res.statusCode == 200) {
            payUrl = res.data.payUrl;
          } else {
            console.log('获取支付URL失败: ' + res.data.error);
          }
          
        },
        fail: function({errMsg}) {
          console.log('获取支付URL失败');
          console.log(errMsg);
        }
      });
      
      return payUrl;
    }
  }
})