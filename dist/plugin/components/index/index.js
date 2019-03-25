const config = require('../../lib/config.js');
var utils = require('../../utils/util.js');

Component({
  properties: {
    options: {
      type: Object,
      value: {},
      observer: function (newVal) {
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
    imgUrls: [
      '../../images/slide001.png',
      '../../images/slide002.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000
  }, 

  attached() {
    var windowWidth = wx.getSystemInfoSync().windowWidth;
    this.setData({bannerHeight: windowWidth/config.scale_banner});

    var cardItemImageHeight = (windowWidth - 70) / config.scale_product;
    this.setData({cardItemImageHeight: cardItemImageHeight});   

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
    },
    gotoNext(event) {
      var value = event.currentTarget.dataset.target;
      var prdId = event.currentTarget.dataset.prdid;
      this.triggerEvent('callback', {target: value, options: {prdId: prdId}});
    },

    //tab切换
    tabChange: function (event) {
      if (event.target.dataset.current == 1) {
        console.log('you change tab , call tabChange function');
      }

      // 重新计算swipper最大高度
      let idex = event.target.dataset.current;
      let swipperHeight = this.data.prds[idex].items.length * 500;
      if ( swipperHeight > this.data.swipperHeight) {
        this.setData({ swipperHeight: swipperHeight});
      }
 
      // 保存当前tab索引
      this.setData({ currentTab: event.target.dataset.current});
    },
    //滑动事件
    tabSwiper: function (event) {
      this.setData({ currentTab: event.detail.current });
    }
        
  }
});
