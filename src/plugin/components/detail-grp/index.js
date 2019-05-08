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
          this.loadPage()
        }
      }
    }    
  },

  data: {
    status_image_success: '../../images/icons/success.png',
    status_image_fail: '../../images/icons/fail.png',
    wxTimerList:[],
    showModal: false,

    // min:1,//最小值 整数类型，null表示不设置
    // max: 5,//最大值 整数类型，null表示不设置
    // num: 1,//输入框数量 整数类型
    // change: 1,//加减变化量 整数类型
    // def_num: 5,//输入框值出现异常默认设置值

    min: 1,//最小值 整数类型，null表示不设置
    minflag: true,
    max: 5,//最大值 整数类型，null表示不设置
    maxflag: false,
    num: 1,//输入框数量 整数类型
    change: 1,//加减变化量 整数类型
    def_num: 1,//输入框值出现异常默认设置值




    maskHidden: false,
    status_text: ''
  },

  detached() {
    wxTimer.stop()
  },

  methods: {
    loadPage() {
      var that = this
      // 根据 grpId 获取拼团详细信息
      utils.requestPost(
        config.restAPI.grp_detail,
        { 
          grpId: that.data.inputData.grpId,
          orderNo: that.data.inputData.orderNo
        },
        function(resData) {
          var detail = utils.formatGroupDetailData(resData)
          that.setData({grpDetail: detail})
          that.setGrpStatus(detail)
          that.setData({max: detail.limitNum})

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
        }
      )


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
          function(resData) {
            utils.log('更新支付状态成功', resData)
          }
        )
      }

    },

    // "下一步" 按钮处理事件
    gotoNext() {
      var that = this
      that.triggerEvent('callback', {
        target: config.miniPage.confirm_order,
        options: {
          prdId: that.data.inputData.prdId,
          grpId: that.data.inputData.grpId,
          orderNum: that.data.inputData.orderNum,
          price: that.data.inputData.price,
          grpEnter: that.data.inputData.grpEnter
        }
      })
    },

    // 回到拼团首页
    gotoHomePage(event) {
      var value = event.currentTarget.dataset.target
      this.triggerEvent('callback', {
        target: value,
        options: {
          brand: wx.getStorageSync('brand'),
          channelId: wx.getStorageSync('channelId')
        }
      })
    },
    showModal: function () {
      var detail = this.data.grpDetail
      this.setData({
        showModal: true
      })

      this.setData({
        buywayPrice: detail.price
      })
    },
    hideModalDlg: function() {
      this.setData({
        showModal: false
      })
    },

    //加
    evad: function () {
      var that = this
      var cval = Number(this.data.num) + this.data.change
      if (cval > this.data.max) {
        utils.log('超出最大值')
        this.setData({maxflag: true})
      }else{
        this.setData({ num: cval })
        this.setData({maxflag: false})
        this.setData({minflag: false})
      }
      var price = that.data.grpDetail.price
      that.setData({ buywayPrice: price * cval })
    },

    //减
    evic: function () {
      var that = this
      var cval = Number(this.data.num) - this.data.change
      if (cval < this.data.min) {
        utils.log('低于最小值')
        this.setData({minflag: true})
      } else {
        this.setData({ num: cval })
        this.setData({minflag: false})
        this.setData({maxflag: false})
      }
      var price = that.data.grpDetail.price
      that.setData({ buywayPrice: price * cval })
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
      } else if (grpEnter == config.grpEnter.join) {
        joinBtn = true
      } else if (grpEnter == config.grpEnter.join_success) {
        status_text = '拼团成功'
        orderBtn = true
      } else if (grpEnter == config.grpEnter.join_fail) {
        status_text = '拼团未成功'
        joinBtn = true
      } else if (grpEnter == config.grpEnter.fromOrder) {
        if (grpDetail.grpStatus == 0) {
          status_text = '拼团未成功'
        } else if (grpDetail.grpStatus == 1) {
          status_text = '拼团成功'
        } else {
          status_text = '待成团'
        }
        orderBtn = true
      }

      that.setData({status_text: status_text})
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