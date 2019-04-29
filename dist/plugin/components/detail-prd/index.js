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
          this.setData({ userinfo: newVal })
        }
      }
    },
    options: {
      type: Object,
      value: {},
      observer: function (newVal) {
        if (newVal) {          
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
    gotoNext(event) {
      var that = this
      var target = event.currentTarget.dataset.target
      var prdId = event.currentTarget.dataset.prdid
      var options = {
        prdId: prdId,
        orderNum: that.data.num,
        buyway: that.data.buyway,
        buywayPrice: that.data.buywayPrice
      }
      this.triggerEvent('callback', {
        target: target,
        options: options
      })
    },

    gotoGrpDetail(event) {
      var target = event.currentTarget.dataset.target
      var grpId = event.currentTarget.dataset.grpid
      this.triggerEvent('callback', {
        target: target,
        options: {
          grpId: grpId,
          grp_status: config.grp_status_join
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

    evblur: function (e) {
      var zval = parseInt(e.detail.value)
      //正则 正整数 0 负整数
      if (/(^-[1-9][0-9]{0,}$)|(^0$)|(^[1-9][0-9]{0,}$)/.test(zval)){
        //最大值
        if (this.data.max != null) {
          if (zval > this.data.max) {
            utils.log('超出购买数量最大值')
            this.setData({ num: this.data.def_num })
            this.setData({maxflag: true})
          }else{
            this.setData({ num: zval })
            this.setData({maxflag: false})
          }
        } else {
          this.setData({ num: zval })
        }

        //最小值
        if (this.data.min != null) {
          if (zval < this.data.min) {
            utils.log('低于最小值')
            this.setData({minflag: true})
            this.setData({ num: this.data.def_num })
          } else {
            this.setData({minflag: false})
            this.setData({ num: zval })
          }
        } else {
          this.setData({ num: zval })
        }
      } else {
        utils.log('不是整数')
        this.setData({ num: this.data.def_num })
      }
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