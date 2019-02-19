Component({
  properties: {
  },

  data: {
    order: {
      price_pref: 99,
      price_suff: 30,
      count: 1,
      prdName: '我是商品名称',
      validDays: '11',
      leftTime_h: '12',
      leftTime_m: '12',
      leftTime_s: '12',
      prdImage: '../../images/pt002-detail.jpg',

    }
  },  

  attached() {
  },

  methods: {
    gotoPage(event) {
      let value = event.currentTarget.dataset.target;
      let price = event.currentTarget.dataset.price;
      this.triggerEvent('callback', {
        target: value,
        options: {
          price: price
        }
      });
    }
  }
});