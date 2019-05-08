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
          this.loadPage()
        }
      }
    }    
  },

  data: {
    wxTimerList:[]
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
        function(resData) {
          that.setData({orderDetail: resData})
          var totalPrice = resData.quantity * resData.price
          that.setData({totalPrice: totalPrice})

          var status = resData.status
          if (status == 0) {
            that.setData({order_status_code: status})
            that.setData({order_status_text: '订单进行中'})
          }

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
        }
      )
    }
  }
})