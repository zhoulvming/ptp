const ptCommon = require('../pt.common.js')
Page({
  data: {},
  onLoad(options) {
    if (options.brand) {
      this.setData({options: options})
    } else {
      var optionsNew = wx.getStorageSync('DATA_FROM_PLUGIN')
      this.setData({options: optionsNew})
    }
  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data)
  }
})