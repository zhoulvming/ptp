const ptCommon = require('../pt.common.js');
Page({
  data: {},
  onLoad(options) {
    console.log(options);
    var jsonVal = JSON.parse(options.options);
    this.setData({options: jsonVal});
  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data);
  },

  pay: function() {
    var that = this;
    // TODO: 在下面页面跳转前处理完小程序这边的支付逻辑,判读支付成功后调用下面代码转入到插件页面
    ptCommon.gotoPageFromPlugin({
      detail: {
        target: that.data.options.targetCallbakUrl,
        options: that.data.options
      }
    });
  }
});
