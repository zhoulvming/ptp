const config = require('../../lib/config.js');

Component({
  properties: {
    options: {
      type: Object,
      value: {},
      observer: function (newVal) {
        console.log('options parameters from miniPage  : ')
        console.log(newVal)
        if (newVal) {
          wx.setStorageSync('brand', newVal.brand );
          wx.setStorageSync('channelId', newVal.channelId );
          this.loadPage();
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
    inputData: null
  }, 

  attached() {
    var windowWidth = wx.getSystemInfoSync().windowWidth
    this.setData({bannerHeight: windowWidth/config.scale_banner})
    var cardItemImageHeight = (windowWidth - 70) / config.scale_product
    this.setData({cardItemImageHeight: cardItemImageHeight})
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadPage() {
      var that = this;
      wx.request({
        url: 'https://apigroupbuy.kfc.com.cn/groupbuying/product/productlist',
        data: {offset:0, listsize:10},
        header: { 'content-type': 'application/json' },
        method: 'POST',
        success(res) {
          let prds = res.data;
          that.setData({prds: prds});
  
          // 调整swipper高度
          let swipperHeight = prds[0].items.length * 500;
          that.setData({ swipperHeight: swipperHeight});

          // 调整swipper tab 的居左距离，使其保持居中显示
          var windowWidth = wx.getSystemInfoSync().windowWidth;
          var marginLeft = windowWidth/2 - (90*prds.length)/2 - 10;
          that.setData({tabnavMarginLeft: marginLeft});
        }
      });
      wx.request({
        url: 'https://apigroupbuy.kfc.com.cn/groupbuying/group/image',
        data: {channelId: that.data.channelId},
        header: { 'content-type': 'application/json' },
        method: 'POST',
        success(res) {
          let imgs = res.data;
          that.setData({imgUrls: imgs});
        }
      });
    },
    gotoNext(event) {
      var target = event.currentTarget.dataset.target;
      var prdId = event.currentTarget.dataset.prdid;
      this.triggerEvent('callback', {target: target, options: {prdId: prdId}});
    },

    //tab切换
    tabChange: function (event) {
      var that = this
      if (event.currentTarget.dataset.current == 1) {
        console.log('you change tab , call tabChange function');
      }

      // 重新计算swipper最大高度
      let idex = event.currentTarget.dataset.current;
      let swipperHeight = that.data.prds[idex].items.length * 500;
      if ( swipperHeight > that.data.swipperHeight) {
        this.setData({ swipperHeight: swipperHeight});
      }
 
      // 保存当前tab索引
      this.setData({ currentTab: event.currentTarget.dataset.current});
    },
    //滑动事件
    tabSwiper: function (event) {
      this.setData({ currentTab: event.detail.current });
    }
        
  }
});