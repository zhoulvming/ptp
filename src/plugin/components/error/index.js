Component({
  properties: {
    myProperty:{
      type:String,
      value:'',
      observer: function() {}
    },

  },
  data: {
    showModalDlgWhenError: false,
    errorMsg: ''
  },
  methods: {

    gotoHomePage: function() {
      this.triggerEvent('gotoPageWhenErrorEvent')
      this.setData({
        showModalDlgWhenError: false
      })
    },
    showError: function(msg) {
      var that = this
      that.setData({
        showModalDlgWhenError: true,
        errorMsg: msg
      })
    }
    
  },
  created: function() {
  },
  attached: function() {

  },
  ready: function() {

  },
  moved: function() {

  },
  detached: function() {

  },
});
  