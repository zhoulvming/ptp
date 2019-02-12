Component({
  properties: {
  },

  data: {
  },  

  attached() {
  },

  methods: {
    gotoPage(event) {
      var value = event.currentTarget.dataset.target;
      this.triggerEvent('callback', {target: value});
    }
  }
});