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
    var prds = [
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

    that.setData({prds: prds});

  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoPage(event) {


  


      var value = event.currentTarget.dataset.target;
      this.triggerEvent('callback', {target: value});
    }
  }
});
