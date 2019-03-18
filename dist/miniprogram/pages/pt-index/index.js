const ptCommon = require('../pt.common.js');
var app = getApp();
Page({
  data: {},
  onLoad(options) {
    this.setData({options: options});


    


  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data);
  }
});