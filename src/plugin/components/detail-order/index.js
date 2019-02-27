var timer = require('../../utils/wxTimer.js');
var wxTimer = null;

Component({
  properties: {
    options: {
      type: Object,
      value: {},
      observer: function (newVal) {
        if (newVal) {
          console.log(newVal);
          // var jsonVal = JSON.parse(newVal.options);
          // if (jsonVal.grpId) {
          //   this.setData({ grpId: jsonVal.grpId });
          // }
          // this.setData({ prdId: jsonVal.prdId });
          // this.setData({ orderNum: jsonVal.orderNum });
          // this.setData({ buyway: jsonVal.buyway });
          // this.setData({ buywayPrice: jsonVal.buywayPrice });
          // this.loadPage();
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

    let self = this;

    // detail data
    let tempData = {
      orderNo: 'E0000001',
      prdId: '10001',
      prdName: '商品名称',
      prdDesc: '这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容',
      prdImage: '../../images/pt-003.png',
      numbers: 3,
      count: 1,
      validDays: '11',
      leftNumbers: 2,
      salesCount: 100,
      price_pref: 99,
      price_suff: 30,
      orgPrice: 1000,
      leftHour: 10,
      leftMinute: 20,
      leftSecond: 20
    };
    self.setData({orderDetail: tempData});

    // 计数器
    let timeStr = tempData.leftHour + ':' + tempData.leftMinute + ':' + tempData.leftSecond;
    wxTimer = new timer({
      beginTime: timeStr
    });
    wxTimer.start(self); 
  },

  detached() {
    wxTimer.stop();
  },  

  methods: {
    gotoPage(event) {
      var value = event.currentTarget.dataset.target;
      this.triggerEvent('callback', {target: value});
    }
  }
});