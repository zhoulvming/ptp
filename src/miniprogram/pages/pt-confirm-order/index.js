const ptCommon = require('../pt.common.js');
Page({
  data: {},
  onLoad(options) {
    var optionsNew = options;

    // 如果是从小程序的登录页面直接过来，则从小程序本地缓存获取options数据
    if (!options.options) {
      optionsNew = wx.getStorageSync('options');
    }

    var userinfo = wx.getStorageSync('userinfo');
    this.setData({ userInfo: userinfo });
    this.setData({options: optionsNew});
  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data);
  }
});