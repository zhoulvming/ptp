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
          this.setData({ prdId: newVal.prdId })
        }
      }
    }
  },

  data: {
    prdId: '',
    currentTab: 0, //当前所在滑块的 index
    salesRecord: [],
    haveShowAllGroups: 'block',
    haveOrder: false,
    orderId: '',
    wxTimerList:[],
    showModalDlgBuycountFlg: false,
    showModalDlgPostFlg: false,
    canBuy: true
  },

  attached() {
    utils.isIphoneX(this)
  },
  ready() {
    this.checkExist()
    this.loadPage()
  },
  detached() {
    wxTimer.stop()
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 发团场合
    gotoNext(e) {
      var that = this
      var detail = e.detail
      that.triggerEvent('callback', {
        target: config.miniPage.confirm_order,
        options:  {
          prdId: that.data.prdDetail.prdId,
          orderNum: detail.buycount,
          price: that.data.prdDetail.price,
          grpEnter: config.grpEnter.create
        }
      })
    },

    // 凑团场合
    gotoGrpDetail(event) {
      var that = this
      that.triggerEvent('callback', {
        target: config.miniPage.detail_grp,
        options: {
          prdId: that.data.prdDetail.prdId,
          grpId: event.currentTarget.dataset.grpid,
          grpEnter: config.grpEnter.join
        }
      })
    },

    // 加载产品详情数据
    loadPage() {
      var that = this

      // 根据prdId获取商品详细信息
      utils.requestPost(
        config.restAPI.prd_detail,
        { 
          prdId: that.data.prdId,
          openid: that.data.userinfo.openid
        },
        function(res) {
          var resData = res.data
          var detail = resData
          detail = utils.formatProductData(detail)
          that.setData({prdDetail: detail})
          that.setData({max: detail.limitCount})

          // 计数器
          var timeStr = detail.leftTime_h + ':' + detail.leftTime_m + ':' + detail.leftTime_s
          wxTimer = new timer({
            beginTime: timeStr
          })
          wxTimer.start(that)
        }
      )
      
      //根据prdId获取该商品的成团列表(默认显示3条)
      utils.requestPost(
        config.restAPI.grp_list,
        {prdId: that.data.prdId, flag: 0},
        function(res) {
          var grps = utils.formatGroupListData(res.data)
          that.setData({grps: grps})
        }
      )
    },

    // 检测是否参与过该产品的拼团活动
    checkExist() {
      var that = this
      var userinfo = that.data.userinfo
      // 判断是否开团或者参团过，如果已经参与，则不能再次凑团或者开团
      var openid = userinfo.openid
      var prdId = that.data.prdId
      utils.requestPost(
        config.restAPI.pt_check,
        {openid: openid, prdId: prdId},
        function(res) {
          var resData = res.data
          let ordFlg = resData.ordFlg
          let leftCountFlg = resData.leftCountFlg
          if (ordFlg == 0) {
            // 订单进项中
            that.setData({canBuy: false})
            that.setData({orderNo: resData.ordNo})
            that.setData({grpId: resData.grpId})
          } else if(leftCountFlg == 0) {
            // 无库存
            that.setData({canBuy: false})
          }
        }
      )
    },

    // 获取所有成团数据
    showAllGroups() {
      var that = this
      if (that.data.haveShowAllGroups == 'none') {
        return
      }
      //根据prdId获取该商品的成团列表(全部显示)
      utils.requestPost(
        config.restAPI.grp_list,
        {prdId: that.data.prdId, flag: 1},
        function(res) {
          that.setData({grps: utils.formatGroupListData(res.data)})
        }
      )      
    },

    //tab切换
    tabChange: function (event) {
      var that = this
      // 当切换到成交记录tab时，获取数据
      if (event.target.dataset.current == 1) {
        var records = that.data.records
        if (!records) {
          utils.requestPost(
            config.restAPI.order_list,
            {prdId: that.data.prdId, flag: 0},
            function(res) {
              that.setData({records: res.data})
            }
          )
        }
      }

      this.setData({ currentTab: event.target.dataset.current})
    },

    //滑动事件
    tabSwiper: function (event) {
      this.setData({ currentTab: event.detail.current })
    },

    // 弹出/隐藏 购买件数窗口组件
    showModalDlgBuycount: function () {
      var that = this
      if (that.data.canBuy) {
        that.setData({
          showModalDlgBuycountFlg: true
        })
      } else {
        // 查看我的团
        that.triggerEvent('callback', {
          target: config.miniPage.detail_grp,
          options: {
            prdId: that.data.prdDetail.prdId,
            grpEnter: config.grpEnter.fromOrder,
            grpId: that.data.grpId,
            orderNo: that.data.orderNo,
            targetCallbakUrl: config.miniPage.detail_grp
          }
        })
      }
    },
    hideModalDlgBuycount: function () {
      this.setData({
        showModalDlgBuycountFlg: false
      })
    },

    // 弹出/隐藏 海报组件
    showModalDlgPost: function() {
      this.setData({
        showModalDlgPostFlg: true
      })
    },

    hideModalDlg: function() {
      this.setData({
        showModalDlgBuycountFlg: false,
        showModalDlgPostFlg: false
      })
    },

    // 生成海报
    makeSharePoster() {
      this.selectComponent('#poster').makeSharePoster()
    }
  }
})