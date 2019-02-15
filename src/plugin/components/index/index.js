Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  

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
    duration: 1000,
    test: 'fsfsdf'
  },  

  attached() {

    // 在组件实例进入页面节点树时执行
    var that = this;
    var prds = [];
    var prdsOld = [
      {
        actionType: '01',
        actionName: '当季活动',
        items: [
          {
            prdId: '10001',
            prdName: '当季活动-拼团产品1',
            price: 500,
            orgPrice: 1000,
            priceReduce: 500,
            numbers: 3,
            image: '../../images/cj-001.jpg'
          }
        ]
      },
      {
        actionType: '02',
        actionName: '限时拼团',
        items: [
          {
            prdId: '10002',
            prdName: '限时拼团-拼团产品1',
            price: 300,
            orgPrice: 600,
            priceReduce: 500,
            numbers: 3,
            image: '../../images/cj-002.jpg'
          },
          {
            prdId: '10003',
            prdName: '限时拼团-拼团产品2',
            price: 400,
            orgPrice: 800,
            priceReduce: 500,
            numbers: 4,
            image: '../../images/cj-002.jpg'
          }
        ]
      }
    ];    

    // 获取数据
    wx.request({
      url: 'https://apigroupbuy.kfc.com.cn/groupbuying/product/productlist/offset/1/listsize/10',
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        prds = res.data;
        that.setData({prds: prds});

        // 调整swipper高度
        let swipperHeight = prds[0].items.length * 500;
        that.setData({ swipperHeight: swipperHeight});
      }
    });

    

  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoPage(event) {

      var value = event.currentTarget.dataset.target;
      this.triggerEvent('callback', {target: value});
    },

    //tab切换
    tabChange: function (event) {
      if (event.target.dataset.current == 1) {
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
