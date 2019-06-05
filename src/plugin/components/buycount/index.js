var utils = require('../../utils/util.js')
Component({
  properties: {
    detail: {
      type: Object,
      value: {}
    },
    limitCount: {
      type: Number,
      value: 5
    },
    prdImage: {
      type: String,
      value: ''
    }
  },
  data: {
    min: 1,//最小值 整数类型，null表示不设置
    minflag: true,
    max: 5,//最大值 整数类型，null表示不设置
    maxflag: false,
    num: 1,//输入框数量 整数类型
    change: 1,//加减变化量 整数类型
  },
  attached() {
    var that = this
    if ( that.data.limitCount == 1) {
      that.setData({maxflag: true})
    }
  },
  methods: {
    hideModalDlg: function() {
      this.triggerEvent('hideEvent')
    },
    gotoNext: function() {
      var that = this
      this.triggerEvent('nextEvent', { buycount: that.data.num})
    },

    //加
    evad: function () {
      var that = this
      var cval = Number(that.data.num) + that.data.change
      console.log('......' + cval)
      if (cval > that.data.limitCount) {
        utils.log('超出最大值')
        that.setData({maxflag: true})
      }else{
        that.setData({ num: cval })
        that.setData({maxflag: false})
        that.setData({minflag: false})
      }
    },

    //减
    evic: function () {
      var that = this
      var cval = Number(that.data.num) - that.data.change
      if (cval < that.data.min) {
        utils.log('低于最小值')
        that.setData({minflag: true})
      } else {
        that.setData({ num: cval })
        that.setData({minflag: false})
        that.setData({maxflag: false})
      }
    }    
  }
})