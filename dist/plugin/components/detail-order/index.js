// var utils = require('../../utils/util.js');
// var timer = require('../../utils/wxTimer.js');
// var wxTimer = null;

Component({
  properties: {
    options: {
      type: Object,
      value: {},
      observer: function (newVal) {
        console.log('Observer data from app page(detail-order):--------');
        console.log(newVal);
        if (newVal) {
          var jsonVal = JSON.parse(newVal.options);
          this.setData({ orderNo: jsonVal.orderNo });
          this.loadPage();
        }
      }
    }    
  },

  data: {
    wxTimerList:[],
    status: {
      orderGrpStatus: 0 
    }
  },

  attached() {

    // let self = this;

    // // detail data
    // let tempData = {
    //   orderNo: 'E0000001',
    //   prdId: '10001',
    //   prdName: '商品名称',
    //   prdDesc: '这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容',
    //   prdImage: '../../images/pt-003.png',
    //   numbers: 3,
    //   count: 1,
    //   validDays: '11',
    //   leftNumbers: 2,
    //   salesCount: 100,
    //   price_pref: 99,
    //   price_suff: 30,
    //   orgPrice: 1000,
    //   leftHour: 10,
    //   leftMinute: 20,
    //   leftSecond: 20
    // };
    // self.setData({orderDetail: tempData});

    // // 计数器
    // let timeStr = tempData.leftHour + ':' + tempData.leftMinute + ':' + tempData.leftSecond;
    // wxTimer = new timer({
    //   beginTime: timeStr
    // });
    // wxTimer.start(self); 
  },

  detached() {
  },  

  methods: {
    gotoPage(event) {
      var value = event.currentTarget.dataset.target;
      this.triggerEvent('callback', {target: value});
    },
    loadPage() {
      var that = this;
      wx.request({
        url: 'https://apigroupbuy.kfc.com.cn/groupbuying/order/detail',
        data: { orderNo: that.data.orderNo },
        header: { 'content-type': 'application/json' },
        method: 'POST',
        success(res) {
          var detail = res.data;
          //detail = utils.formatProductData(detail);
          that.setData({orderDetail: detail});
          console.log(detail);
          
        }
      });
    }
  }
});