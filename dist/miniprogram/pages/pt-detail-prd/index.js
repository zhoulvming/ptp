const ptCommon = require('../pt.common.js');
Page({
  data: {
  },
  onLoad(options) {
    this.setData({options: options});
  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data);
  }
});