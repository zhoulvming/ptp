var utils = require('../../utils/util.js')
var timer = require('../../utils/wxTimer.js')
var wxTimer = null
const config = require('../../lib/config.js')

Component({
  properties: {
    options: {
      type: Object,
      value: {},
      observer: function (newVal) {
        console.log('Observer data from app page(detail-order):--------')
        console.log(newVal);
        if (newVal) {
          // var jsonVal = JSON.parse(newVal.options)
          var jsonVal = newVal
          this.setData({ orderNo: jsonVal.orderNo })
        }
      }
    }    
  },

  data: {
    wxTimerList:[]
  },

  ready() {
    this.loadPage()
    utils.isIphone(this)
  },
  methods: {
    gotoGrpPage() {
      var detail = this.data.orderDetail
      this.triggerEvent('callback', {
        target: 'detail-grp',
        options: {
          grpId: detail.grpId,
          prdId: detail.prdId,
          orderNum: detail.quantity,
          grpEnter: config.grpEnter.fromOrder,
          orderNo: detail.orderNo
        }
      })
    },
    loadPage() {
      var that = this;
      utils.requestPost(
        config.restAPI.order_detail,
        {orderNo: that.data.orderNo},
        function(res) {
          var resData = res.data
          var orderObj = that.formatOrderData(resData)
          that.setData({orderDetail: orderObj})

          var leftTime = resData.leftTime
          var timeTmep = leftTime.split(':')
          var leftTime_d = timeTmep[0]
          var leftTime_h = timeTmep[1]
          var leftTime_m = timeTmep[2]
          var leftTime_s = timeTmep[3]

          // 计数器
          that.setData({left_days: leftTime_d})
          let timeStr = leftTime_h + ':' + leftTime_m + ':' + leftTime_s
          wxTimer = new timer({
            beginTime: timeStr
          })
          wxTimer.start(that)
        }, that
      )
    },

    formatOrderData(data) {
      var totalPrice = data.quantity * data.price
      var priceObj = utils.formatPrice(data.price)
      var statusText = ''
      var statusMemo = ''

      var status = data.status
      if (status == 1) {  // 支付成功
        statusText = '订单进行中'
      } else if (status == 2) { // 发货中，等待后台job
        statusText = '发货中'
      } else if (status == 6) { // 订单已完成
        statusText = '订单已完成'
      } else if (status == 8) { // 已退单
        statusText = '订单已关闭'
        statusMemo = '拼团失败，付款将在7个工作日内退到您的支付账号'
      } else if (status == 9) { // 退单中
        statusText = '退单中'
      } else if (status == 10) {  // 拼团已过期
        statusText = '订单已关闭'
        statusMemo = '拼团失败，付款将在7个工作日内退到您的支付账号'
      }

      return {
        activityDesc: data.activityDesc,
        activityId: data.activityId,
        amount: data.amount,
        deliveryTime: data.deliveryTime,
        returnTime: data.returnTime,
        doneTime: data.doneTime,
        grpId: data.grpId,
        leftNumber: data.leftNumber,
        leftTime: data.leftTime,
        numbers: data.numbers,
        orderNo: data.orderNo,
        orderTime: data.orderTime,
        orgPrice: data.orgPrice,
        payTime: data.payTime,
        prdId: data.prdId,
        prdImage: data.prdImage,
        prdName: data.prdName,
        price: data.price,
        quantity: data.quantity,
        status: data.status,
        validDays: data.validDays,
        totalPrice: totalPrice,
        price_pref: priceObj.pref,
        price_suff: priceObj.suff,
        statusText: statusText,
        statusMemo: statusMemo,
        shortPrdName: data.shortPrdName
      }
    }
  }
})