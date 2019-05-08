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
          this.loadPage()
        }
      }
    }
  },

  data: {
    prdId: '',
    currentTab: 0, //当前所在滑块的 index
    salesRecord: [],
    showModal: false,
    showModalPost: false,
    min: 1,//最小值 整数类型，null表示不设置
    minflag: true,
    max: 5,//最大值 整数类型，null表示不设置
    maxflag: false,
    num: 1,//输入框数量 整数类型
    change: 1,//加减变化量 整数类型
    def_num: 1,//输入框值出现异常默认设置值
    buyway: 0,
    buywayPrice: 0,
    haveShowAllGroups: 'block',
    haveOrder: false,
    orderId: '',
    wxTimerList:[]
  },

  attached() {
    var windowWidth = wx.getSystemInfoSync().windowWidth
    this.setData({bannerHeight: windowWidth/1.48})
  },
  detached() {
    wxTimer.stop()
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 发团场合
    gotoNext() {
      var that = this
      that.triggerEvent('callback', {
        target: config.miniPage.confirm_order,
        options:  {
          prdId: that.data.prdDetail.prdId,
          orderNum: that.data.num,
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

    loadPage() {
      var that = this

      // 根据prdId获取商品详细信息
      utils.requestPost(
        config.restAPI.prd_detail,
        { prdId: that.data.prdId },
        function(resData) {
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
        function(resData) {
          var grps = utils.formatGroupListData(resData)
          that.setData({grps: grps})
        }
      )
    },
    showAllGroups() {
      var that = this
      if (that.data.haveShowAllGroups == 'none') {
        return
      }
      //根据prdId获取该商品的成团列表(全部显示)
      utils.requestPost(
        config.restAPI.grp_list,
        {prdId: that.data.prdId, flag: 1},
        function(resData) {
          that.setData({grps: utils.formatGroupListData(resData)})
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
            function(resData) {
              that.setData({records: resData})
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

    showModal: function (e) {
      let buyway = e.currentTarget.dataset.buyway
      let detail = this.data.prdDetail
      this.setData({
        showModal: true
      })

      var buywayPrice = detail.price
      if (buyway && buyway == config.buyway_single) {
        buywayPrice = detail.orgPrice
      }

      this.setData({
        buyway: buyway,
        buywayPrice: buywayPrice
      })
    },

    showModalPost: function() {
      this.setData({
        showModalPost: true
      })
    },

    hideModalDlg: function() {
      this.setData({
        showModal: false,
        showModalPost: false
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

      var buyway = that.data.buyway
      var price = that.data.prdDetail.price
      if (buyway && buyway == config.buyway_single) {
        price = that.data.prdDetail.orgPrice
      }
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

      var buyway = that.data.buyway
      var price = that.data.prdDetail.price
      if (buyway && buyway == config.buyway_single) {
        price = that.data.prdDetail.orgPrice
      }
      that.setData({ buywayPrice: price * cval })
    },

    // 生成海报
    makeSharePoster() {
      this.selectComponent('#poster').makeSharePoster()
    }
  }
})