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
    salesRecord: [],
    haveOrder: false,
    orderId: '',
    wxTimerList:[],
    showModalDlgBuycountFlg: false,
    showModalDlgPostFlg: false,
    canBuy: true,
    prd_other_item1_flag: true,
    prd_other_item2_flag: false,
    prd_other_item3_flag: false,
    isShowLookMore: false
  },

  attached() {
    console.log('...................attached method...................')
    utils.isIphone(this)


    
  },
  ready() {
    console.log('...................ready method...................')
    var that = this
    setTimeout(function(){
      that.checkExist()
      that.loadPage()
    }, 400)  
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

      // 检查购买数量是否在限定购买数量之内
      var restCount = that.data.prdDetail.restCount - detail.buycount
      var buyedCount = that.data.prdDetail.limitCount - that.data.prdDetail.restCount
      if (restCount < 1) {
        wx.showToast({
          icon: 'none',
          duration: 5000,
          title: '该商品每人限购' + that.data.prdDetail.limitCount + '件，您之前已购买过' + buyedCount + '件~',
          mask:true
        })
        return
      }

      // 跳转到订单确认页面
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
          that.setData({
            shareModel: {
              title: detail.prdName,
              prdId: detail.prdId,
              imageUrl: detail.imagePoster
            }
          })

          // 计数器
          var timeStr = detail.leftTime_h + ':' + detail.leftTime_m + ':' + detail.leftTime_s
          wxTimer = new timer({
            beginTime: timeStr
          })
          wxTimer.start(that)

          //根据prdId获取该商品的成团列表(默认显示3条)
          utils.requestPost(
            config.restAPI.grp_list,
            {prdId: that.data.prdId, flag: 1},
            function(res) {              
              var grps_all = utils.formatGroupListData(res.data)
              var grps_top = []

              if (grps_all.length > 3) {
                grps_top.push(grps_all[0])
                grps_top.push(grps_all[1])
                grps_top.push(grps_all[2])
                that.setData({isShowLookMore: true})
              } else {
                grps_top = grps_all
                that.setData({isShowLookMore: false})
              }
              that.setData({grps_top: grps_top})
              that.setData({grps_all: grps_all})
            }, that
          )
        }, that
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
        }, that
      )
    },

    showPrdOtherInfo(event) {
      var that = this
      var target = event.target.dataset.current
      if (target == 0) {
        that.setData({prd_other_item1_flag: true})
        that.setData({prd_other_item2_flag: false})
        that.setData({prd_other_item3_flag: false})
      } else if (target == 1) {
        that.setData({prd_other_item1_flag: false})
        that.setData({prd_other_item2_flag: true})
        that.setData({prd_other_item3_flag: false})        
        // 当切换到成交记录tab时，获取数据
        var records = that.data.records
        if (!records) {
          utils.requestPost(
            config.restAPI.order_list,
            {prdId: that.data.prdId, flag: 0},
            function(res) {
              that.setData({records: res.data})
            }, that
          )
        }
      } else if (target == 2) {
        that.setData({prd_other_item1_flag: false})
        that.setData({prd_other_item2_flag: false})
        that.setData({prd_other_item3_flag: true})        
      }
    },

    // 获取所有成团数据
    showAllGroups() {
      var that = this
      var grps_all = that.data.grps_all
      that.setData({grps_top: grps_all})
      that.setData({isShowLookMore: false})
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