Component({
  properties: {
    options: {
      type: Object,
      value: {},
      observer: function (newVal) {
        if (newVal) {
          wx.setStorageSync('brand', newVal.brand );
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
