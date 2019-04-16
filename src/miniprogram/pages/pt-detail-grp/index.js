const ptCommon = require('../pt.common.js');
Page({
  data: {},
  onLoad() {
    var options = wx.getStorageSync('DATA_FROM_PLUGIN')
    this.setData({options: options})
  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data);
  }
});