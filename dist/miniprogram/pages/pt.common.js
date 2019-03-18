const app = getApp();

const gotoPageFromPlugin = (data) => {
  var options = data.detail.options;
  var target = data.detail.target;
  var url = '';
  var jsonObj = app.globalData.callbackUrl;
  for(var item in jsonObj) {
    if(item == target){
      url = jsonObj[item];
    }
  }

  //拼接插件传递给小程序页面的参数（如果有的话）
  if (options) {
    wx.setStorageSync('DATA_FROM_PLUGIN', options);
    url = url + '?options=' + JSON.stringify(options);
  }
  wx.navigateTo({
    url: url,
  });
};

module.exports = {
  gotoPageFromPlugin
};