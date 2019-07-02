var utils = require('../../utils/util.js')
const config = require('../../lib/config.js')
const singleItemHeight = 450

Component({
  properties: {
    options: {
      type: Object,
      value: {},
      observer: function (newVal) {
        if (newVal) {
          utils.log('从小程序页面传递过来的参数(options)', newVal)
          wx.setStorageSync('brand', newVal.brand )
          wx.setStorageSync('channelId', newVal.channelId )
        }
      }
    },
    userinfo: {
      type: Object,
      value: {},
      observer: function(newVal) {
        if (newVal) {
          utils.log('从小程序页面传递过来的用户信息(userinfo)', newVal)
          this.setData({ userinfo: newVal })
        }
      }
    }
  },

  data: {
    currentTab: 0, //当前所在滑块的 index
    swipperHeight: 0,
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    inputData: null,
    showModalDlg: false,
    showModalDlgLeftCount: false,
    ModalDlgMsg: ''
  }, 

  attached() {
    // var windowWidth = wx.getSystemInfoSync().windowWidth
    // this.setData({bannerHeight: windowWidth/config.scale_banner})
    // var cardItemImageHeight = (windowWidth - 70) / config.scale_product
    // this.setData({cardItemImageHeight: cardItemImageHeight})
    this.setData({cardItemImageHeight: 260})
    utils.isIphoneX(this)
  },
  ready() {
    this.loadPage()
  },

  methods: {
    loadPage() {
      var that = this

      // 拼团产品一览
      utils.requestPost(
        config.restAPI.prds, 
        {offset:0, listsize:10}, 
        function(res) {
          var prds = res.data
          that.setData({prds: prds})

          // 调整swipper高度
          let swipperHeight = prds[0].items.length * singleItemHeight
          that.setData({ swipperHeight: swipperHeight})

          // 调整swipper tab 的居左距离，使其保持居中显示
          var windowWidth = wx.getSystemInfoSync().windowWidth
          var marginLeft = windowWidth/2 - (90*prds.length)/2 - 10
          that.setData({tabnavMarginLeft: marginLeft})

          // 首页横幅
          utils.requestPost(
            config.restAPI.banner,
            {channelId: wx.getStorageSync('channelId')},
            function(res) {
              that.setData({imgUrls: res.data})
            }, that
          )
        }, that
      )
    },
    gotoCreatePT(event) {
      var that = this
      var prdId = event.currentTarget.dataset.prdid
      that.triggerEvent('callback', {target: config.miniPage.detail_prd, options: {prdId: prdId}})
    },

    //tab切换
    tabChange: function (event) {
      var that = this
      // 重新计算swipper最大高度
      let idex = event.currentTarget.dataset.current
      let swipperHeight = that.data.prds[idex].items.length * singleItemHeight
      if ( swipperHeight > that.data.swipperHeight) {
        this.setData({ swipperHeight: swipperHeight})
      }
 
      // 保存当前tab索引
      this.setData({ currentTab: event.currentTarget.dataset.current})
    },
    //滑动事件
    tabSwiper: function (event) {
      var that = this
      var currentTab = event.detail.current
      var prds = that.data.prds[currentTab]
      var swipperHeight = prds.items.length * singleItemHeight
      that.setData({ swipperHeight: swipperHeight})
      this.setData({ currentTab: event.detail.current })
    },

    hideModalDlg: function() {
      this.setData({
        showModalDlg: false,
        showModalDlgLeftCount: false
      })
    },

    gotoOrder: function() {
      var orderNo = this.data.orderNoOfDoing
      if(orderNo) {
        this.triggerEvent('callback', {
          target: 'detail-order', 
          options: {
            orderNo: orderNo
          }
        })
      }
    },

    tabNav: function(event) {
      var target = event.target.dataset.target
      this.triggerEvent('callback', {target: target})
    },

    gotoPageWhenError() {
      this.triggerEvent('callback', {target: config.miniPage.index})
    }

  }
})