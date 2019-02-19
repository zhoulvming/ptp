const ptCommon = require('../pt.common.js');
Page({
  data: {
  },
  onLoad() {
  },
  gotoPageFromPlugin(data) {
    console.log(11111111111111);
    console.log(data.detail.options);
    console.log(22222222222222);
    ptCommon.gotoPageFromPlugin(data);
  }
});