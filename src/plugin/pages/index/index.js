/* eslint-disable no-console */
// plugin/pages/index-page.js
Page({
  data: {
    imgUrls: [
      '../../images/slide001.png',
      '../../images/slide002.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    test: 'fsfsdf',
    
    // 拼团活动数据 （后台需设置数据范围，可以考虑用时间限制)
    prds: [
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
    ]
  },
  onLoad: function () {
    // wx.request({
    //   url: 'https://www.hugchina.cn/hugchina/prds',
    //   data: {
    //     brand: '1001'
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success(res) {
    //     console.log(res.data);
    //   }
    // });
  }

});