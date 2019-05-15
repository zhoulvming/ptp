var utils = require('../../utils/util.js')
const config = require('../../lib/config.js')

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
          this.loadPage()
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
    var windowWidth = wx.getSystemInfoSync().windowWidth
    this.setData({bannerHeight: windowWidth/config.scale_banner})
    var cardItemImageHeight = (windowWidth - 70) / config.scale_product
    this.setData({cardItemImageHeight: cardItemImageHeight})
  },

  methods: {
    loadPage() {
      var that = this

      // 拼团产品一览
      utils.requestPost(
        config.restAPI.prds, 
        {offset:0, listsize:10}, 
        function(resData) {
          var prds = resData
          that.setData({prds: prds})

          // 调整swipper高度
          let swipperHeight = prds[0].items.length * 250
          that.setData({ swipperHeight: swipperHeight})

          // 调整swipper tab 的居左距离，使其保持居中显示
          var windowWidth = wx.getSystemInfoSync().windowWidth
          var marginLeft = windowWidth/2 - (90*prds.length)/2 - 10
          that.setData({tabnavMarginLeft: marginLeft})          
        }
      )

      // 首页横幅
      utils.requestPost(
        config.restAPI.banner,
        {channelId: that.data.channelId},
        function(resData) {
          that.setData({imgUrls: resData})  
        }
      )
    },
    gotoCreatePT(event) {
      var that = this
      var prdId = event.currentTarget.dataset.prdid
      
      // var openid = that.data.userinfo.openid
      // utils.requestPost(
      //   config.restAPI.pt_check,
      //   {openid: openid, prdId: prdId},
      //   function(resData) {
      //     let ordFlg = resData.ordFlg
      //     let leftCountFlg = resData.leftCountFlg
      //     if (ordFlg == 0) {
      //       // 订单进项中
      //       that.setData({showModalDlgLeftCount: false})
      //       that.setData({showModalDlg: true, ModalDlgMsg: '您已经购买过此产品，请完成订单后再次购买'})
      //       that.setData({orderNoOfDoing: resData.ordNo})
      //     } else if(leftCountFlg == 0) {
      //       // 无库存
      //       that.setData({showModalDlg: false})
      //       that.setData({showModalDlgLeftCount: true, ModalDlgMsg: '很抱歉，该产品已经售卖完毕'})
      //     } else {
      //       that.triggerEvent('callback', {target: config.miniPage.detail_prd, options: {prdId: prdId}})
      //     }          
      //   }
      // )

      that.triggerEvent('callback', {target: config.miniPage.detail_prd, options: {prdId: prdId}})



    },

    //tab切换
    tabChange: function (event) {
      var that = this
      // 重新计算swipper最大高度
      let idex = event.currentTarget.dataset.current
      let swipperHeight = that.data.prds[idex].items.length * 250
      if ( swipperHeight > that.data.swipperHeight) {
        this.setData({ swipperHeight: swipperHeight})
      }
 
      // 保存当前tab索引
      this.setData({ currentTab: event.currentTarget.dataset.current})
    },
    //滑动事件
    tabSwiper: function (event) {
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
    }
  }
})