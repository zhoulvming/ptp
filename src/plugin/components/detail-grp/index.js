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
            price: newVal.price,
            orderNo: newVal.orderNo,
            paySuccessFlag: newVal.paySuccessFlag
          }})
        }
      }
    }    
  },

  data: {
    status_pt_success: '../../images/icons/success.png',
    status_pt_fail: '../../images/icons/fail.png',
    wxTimerList:[],

    min: 1,//最小值 整数类型，null表示不设置
    minflag: true,
    max: 5,//最大值 整数类型，null表示不设置
    maxflag: false,
    num: 1,//输入框数量 整数类型
    change: 1,//加减变化量 整数类型
    def_num: 1,//输入框值出现异常默认设置值

    maskHidden: false,
    status_text: '',

    showModalDlgBuycountFlg: false
  },

  detached() {
    wxTimer.stop()
  },

  ready() {
    this.loadPage()
  },

  methods: {

    takeDetailData() {
      var that = this
      utils.requestPost(
        config.restAPI.grp_detail,
        { 
          grpId: that.data.inputData.grpId,
          openid: that.data.userinfo.openid
        },
        function(res) {
          var resData = res.data
          var detail = utils.formatGroupDetailData(resData)
          that.setData({grpDetail: detail})
          that.setGrpStatus(detail)
          that.setData({max: detail.limitNum})

          that.setData({
            shareModel: {
              title: detail.prdName,
              grpId: detail.grpId,
              imageUrl: detail.prdImage
            }
          })

          if (that.data.inputData.orderNum) {
            that.setData({orderNum: that.data.inputData.orderNum})
          } else {
            that.setData({orderNum: detail.orderNum})
          }

          // 计数器
          var timeStr = detail.leftTime_h + ':' + detail.leftTime_m + ':' + detail.leftTime_s
          wxTimer = new timer({
            beginTime: timeStr
          })
          wxTimer.start(that)
        }, that
      )
    },

    loadPage() {
      var that = this
      // 如果是从支付成功的小程序页面跳转到此，则需要调用后台API更新数据
      if (that.data.inputData.paySuccessFlag) {
        utils.requestPost(
          config.restAPI.upd_order_status,
          {
            prdId: that.data.inputData.prdId,
            payFlg: 1,
            grpId: that.data.inputData.grpId,
            orderNo: that.data.inputData.orderNo            
          },
          function(res) {
            var resData = res.data
            var statusCode = res.statusCode
            if (statusCode == config.apiStatusCode.sucess) {
              utils.log('更新支付状态成功', resData)
            } else {
              utils.log('更新支付状态失败', res)
              wx.showModal({
                title: '错误',
                content: '他人已凑团成功，您本次拼团失败',
                showCancel: false,
                success: function() {
                  // 跳转到商品详情页面
                  that.triggerEvent('callback', {target: config.miniPage.detail_prd, options: {prdId: that.data.inputData.prdId}})
                }
              })
              return
            }
            // load grp detail
            that.takeDetailData()
          }, that
        )
      } else {
        that.takeDetailData()
      }
    },

    // "下一步" 按钮处理事件
    gotoNext(e) {
      var that = this
      var detail = e.detail

      var restCount = that.data.grpDetail.restCount  - detail.buycount
      if (restCount < 1) {
        wx.showModal({
          title: '错误',
          content: '您的购买数量已经超过该商品的最大购买数量'
        })
        return
      }

      that.triggerEvent('callback', {
        target: config.miniPage.confirm_order,
        options: {
          prdId: that.data.inputData.prdId,
          grpId: that.data.inputData.grpId,
          orderNum: detail.buycount,
          price: that.data.inputData.price,
          grpEnter: that.data.inputData.grpEnter
        }
      })
    },

    // 回到拼团首页
    gotoHomePage() {
      this.triggerEvent('callback', {
        target: config.miniPage.index,
        options: {
          brand: wx.getStorageSync('brand'),
          channelId: wx.getStorageSync('channelId')
        }
      })
    },
    showModal: function () {
      var detail = this.data.grpDetail
      this.setData({
        showModalDlgBuycountFlg: true
      })

      this.setData({
        buywayPrice: detail.price
      })
    },
    hideModalDlgBuycount: function () {
      this.setData({
        showModalDlgBuycountFlg: false
      })
    },
    // 生成海报
    makeSharePoster() {
      this.selectComponent('#poster').makeSharePoster()
    },

    // 设置拼团页面状态
    setGrpStatus(grpDetail) {
      var that = this
      var inviteBtn = false
      var makepostBtn = false
      var joinBtn = false
      var orderBtn = false
      var status_text = ''
      var status_flag = false

      // 拼团状态1：发起拼团成功(显示’发起拼团成功‘，按钮为’邀请好友‘和’生成海报‘)
      // 拼团状态2：凑团初始状态(不用显示任何状态文字，按钮为’我要参团‘)
      // 拼团状态3：凑团成功状态(显示’拼团成功状态‘，按钮为’点击查看订单‘)
      // 拼团状态4：凑团失败状态(显示’拼团未成功‘，按钮为’我要参团‘)
      // 后台返回的拼团状态 grpStatus（0/拼团失败、1/拼团成功、2/待成团）

      var grpEnter = that.data.inputData.grpEnter
      if (grpEnter == config.grpEnter.create_success) {
        status_text = '发起拼团成功'
        inviteBtn = true
        makepostBtn = true
        status_flag = true
        orderBtn = true
      } else if (grpEnter == config.grpEnter.join) {
        joinBtn = true
      } else if (grpEnter == config.grpEnter.join_success) {
        status_text = '拼团成功'
        orderBtn = true
        status_flag = true
      } else if (grpEnter == config.grpEnter.join_fail) {
        status_text = '拼团未成功'
        joinBtn = true
        status_flag = true
      } else if (grpEnter == config.grpEnter.fromOrder) {
        status_flag = true
        if (grpDetail.grpStatus == 0) {
          status_text = '拼团未成功'
        } else if (grpDetail.grpStatus == 1) {
          status_text = '拼团成功'
        } else {
          status_text = '待成团'
          inviteBtn = true
          makepostBtn = true
        }
        orderBtn = true
      } else if (grpEnter == config.grpEnter.fromJoin) {
        status_flag = true
        status_text = '待成团'
        inviteBtn = true
        makepostBtn = true
        joinBtn = true
      } else {
        status_flag = true
        status_text = '有未catch的grpEnter状态: ' + grpEnter
      }

      that.setData({status_text: status_text})
      that.setData({status_flag: status_flag})
      that.setData({btnStatus:{
        inviteBtn: inviteBtn,
        makepostBtn: makepostBtn,
        joinBtn: joinBtn,
        orderBtn: orderBtn
      }})
    },

    // 点击查看订单处理事件
    gotoOrder() {
      var that = this
      var orderNo = that.data.inputData.orderNo
      if (orderNo) {
        that.triggerEvent('callback', {
          target: config.miniPage.detail_order,
          options: {
            orderNo: orderNo
          }
        })
      }
    }
  }
})