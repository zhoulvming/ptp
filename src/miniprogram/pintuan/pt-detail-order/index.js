const ptCommon = require('../pt.common.js')
const app = getApp()
Page({
  data: {},
  onLoad() {
    var options = wx.getStorageSync('DATA_FROM_PLUGIN')
    this.setData({options: options})
  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data);
  },
  chama() {
    app.tdsdk.event({
      id: 'mini_c&j_pinorderdetail_csonline_click'
    })
  }
});