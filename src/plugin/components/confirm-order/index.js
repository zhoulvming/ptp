Component({
  properties: {
  },

  data: {
    order: {
      price: 200
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