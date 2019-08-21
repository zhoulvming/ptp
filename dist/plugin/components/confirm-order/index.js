const config = require('../../lib/config.js')
var utils = require('../../utils/util.js')
var timer = require('../../utils/wxTimer.js')
var wxTimer = null
const TDSDK = require('../../lib/tdweapp.js')

Component({
  properties: {
    userinfo: {
      type: Object,
      value: {},
      observer: function (newVal) {
        if (newVal) {
          utils.log('从小程序页面传递过来的参数(userinfo)', newVal)
          this.setData({ userinfo: newVal })
        }
      }
    },
    options: {
      type: Object,
      value: {},
      observer: function (newVal) {
        if (newVal) {
          utils.log('从小程序页面传递过来的参数(options)', newVal)
          this.setData({inputData: {
            grpEnter: newVal.grpEnter,
            prdId: newVal.prdId,
            orderNum: newVal.orderNum,
            grpId: newVal.grpId,
            price: newVal.price
          }})
        }
      }         
    }
  },

  data: {
    nextBtnDisabled: false,
    userinfo: null,
    wxTimerList:[],
    inputData: null,
    nextBtn_canClick: true,
    processing: false
  },

  attached() {
    console.log('...................attached method...................')
    utils.isIphone(this)

    TDSDK.App.onLaunch()
  
  },
  detached() {
    wxTimer.stop()
  },

  ready() {
    this.loadPage()
  },

  methods: {

    // '选好了' 按钮对应事件处理
    gotoNext() {
      var that = this
      var userinfo = that.data.userinfo
      var processing = that.data.processing
      if (processing) {
        return ;
      } else {
        that.setData({processing: true})
      }

      // chama
      TDSDK.Event.event({
        id: 'mini_c&j_pinorderconfirm_ok_click'
      })
      
      if (userinfo && userinfo.userCode) {
        utils.log('微信用户已经登录小程序系统')

        // 下单 -> 支付 -> 返回到拼团详情
        that.crtOrder(function(orderResult) {
          if (orderResult.resultFlag) {
            utils.log('下单成功：' + orderResult.orderNo)

            // TODO: 测试时暂时关闭绕过支付，后面需要打开wxPay的调用，删除测试代码
            that.wxPay(orderResult.orderNo, orderResult.grpId)

            // TODO: 测试代码，绕过支付      ------ start
            // var grpEnter = that.data.inputData.grpEnter
            // if (grpEnter == 1) {
            //   grpEnter = 2
            // } else if (grpEnter == 4) {
            //   grpEnter = 5
            // }
            // that.triggerEvent('callback', {
            //   target: config.miniPage.detail_grp,
            //   options: {
            //     grpEnter: grpEnter,
            //     prdId: that.data.inputData.prdId,
            //     grpId: orderResult.grpId,
            //     price: that.data.inputData.price,
            //     paySuccessFlag: true,
            //     orderNo: orderResult.orderNo
            //   }
            // })
            // TODO: 测试代码，绕过支付      ------ end
             
          } else {
            // 下单失败
            var errMsg = ''
            that.setData({processing: false})
            if (orderResult.statusCode == config.apiStatusCode.createOrder_joinFail) {
              errMsg = '他人已凑团成功，您本次拼团失败'
            } else {
              errMsg = '发生系统错误，请联系客服'
            }

            //TODO: 要考虑放到统一错误页面显示，不采用弹出提示的方式
            wx.showModal({
              title: '错误',
              content: errMsg
            })
          }
        })
      } else {
        utils.log('微信用户未登录小程序系统')
        that.setData({processing: false})
        this.triggerEvent('callback', {
          target: 'login',
          options: {
            grpEnter: that.data.inputData.grpEnter,
            prdId: that.data.inputData.prdId,
            grpId: that.data.inputData.grpId,
            orderNum: that.data.inputData.orderNum,
            price: that.data.inputData.price
          }
        })
      }
    },

    // 下单
    crtOrder(cb) {
      var that = this

      // 是否是团长
      var isMaster = 0
      if (that.data.inputData.grpEnter == config.grpEnter.create) {
        isMaster = 1
      }

      // 下单数据
      var data = {
        brand: wx.getStorageSync('brand'),
        channelId: wx.getStorageSync('channelId'),
        mobileNo: that.data.userinfo.mobileNo,
        catgryName: that.data.prd.catgryName,
        userCd: that.data.userinfo.userCode,
        quantity: that.data.inputData.orderNum,
        openId: that.data.userinfo.openid,
        prdId: that.data.prd.prdId,
        grpId: that.data.inputData.grpId,
        nickName: that.data.userinfo.nickName,
        avatarUrl: that.data.userinfo.avatarUrl,
        isMaster: isMaster,
        activityId: that.data.prd.groupBuyProId
      }
      utils.log('下单数据', data)
    
      utils.requestPost(
        config.restAPI.order_create,
        data,
        function(res) {
          var resData = res.data
          var resultFlag = false
          var ordreNo = null
          var grpId = null
          if (res.statusCode == config.apiStatusCode.sucess) {
            // 下单成功
            resultFlag = true
            ordreNo = resData.orderNo
            grpId = resData.grpId
          }
          cb({
            resultFlag: resultFlag,
            orderNo: ordreNo,
            grpId: grpId,
            statusCode: res.statusCode
          })  
        }, that
      )
    },

    // 支付
    wxPay(orderNo, grpId) {
      var that = this
      var price = that.data.inputData.price * that.data.inputData.orderNum
      var dataPayment = {
        openId: that.data.userinfo.openid,
        orderNo: orderNo,
        channelId: wx.getStorageSync('channelId'),
        price: price,
        returnUrl: ''
      }
      utils.log('支付参数', dataPayment)
      utils.requestPost(
        config.restAPI.wxpay,
        dataPayment,
        function(res) {
          var resData = res.data
          var payUrl = null
          if (resData && resData.payUrl) {
            payUrl = JSON.parse(resData.payUrl)
            utils.log('payUrl', payUrl)
            that.setData({processing: false})
            // 跳出到小程序页面由小程序呼出支付
            that.triggerEvent('callback', {
              target: config.miniPage.pay,
              options: {
                price: dataPayment.price,
                orderNo: orderNo,
                grpId: grpId,
                prdId: that.data.inputData.prdId,
                grpEnter: that.data.inputData.grpEnter,
                targetCallbakUrl: config.miniPage.detail_grp,
                buyCount: that.data.inputData.orderNum,
                payInfo: {
                  timeStamp: payUrl.timeStamp,
                  nonceStr: payUrl.nonceStr,
                  packageStr: payUrl.packageStr,
                  sign: payUrl.sign
                }
              }
            })
          }
        }, that
      )
    },

    // 页面加载
    loadPage() {
      var that = this
      // 根据prdId获取商品详细信息
      utils.requestPost(
        config.restAPI.prd_detail,
        { 
          prdId: that.data.inputData.prdId,
          openid: that.data.userinfo.openid
        },

        function(res) {
          var resData = res.data
          var prdData = utils.formatProductData(resData)
          var orderData = that.formatOrderData(prdData)
          that.setData({prd: prdData})
          that.setData({order: orderData})

          // 计数器
          var timeStr = prdData.leftTime_h + ':' + prdData.leftTime_m + ':' + prdData.leftTime_s
          wxTimer = new timer({
            beginTime: timeStr
          })
          wxTimer.start(that)  


          // chama
          TDSDK.Event.event({
            id: 'mini_c&j_pinorderconfirm_load'
          })

        }, that
      )
    },
    formatOrderData(prdData) {
      var that = this
      var price_total = that.data.inputData.orderNum * prdData.price + ''
      var priceObj = utils.formatPrice(price_total)
      return {
        price_pref: prdData.price_pref,
        price_suff: prdData.price_suff,
        orderNum: that.data.inputData.orderNum,
        prdName: prdData.prdName,
        leftTime_d: prdData.leftTime_d,
        leftTime_h: prdData.leftTime_h,
        leftTime_m: prdData.leftTime_m,
        leftTime_s: prdData.leftTime_s,
        imageSingle: prdData.imageSingle,
        validDays: prdData.validDays,
        price_total_pref: priceObj.pref,
        price_total_suff: priceObj.suff,
        shortPrdName: prdData.shortPrdName
      }
    }
  }
})