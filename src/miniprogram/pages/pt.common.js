const app = getApp();

const gotoPageFromPlugin = (data) => {
  console.log('gotoPageFromPlugin -- start')
  console.log(data)
  console.log('gotoPageFromPlugin -- end')
  var options = data.detail.options
  var target = data.detail.target
  var url = null
  var jsonObj = app.globalData.callbackUrl
  for(var item in jsonObj) {
    if(item == target){
      url = jsonObj[item]
    }
  }
  if (url) {
    wx.setStorageSync('DATA_FROM_PLUGIN', options)
    wx.navigateTo({url: url,})
  } else {
    console.log('未配置页面callbackUrl')
  }

  // //拼接插件传递给小程序页面的参数（如果有的话）
  // if (options) {
  //   wx.setStorageSync('DATA_FROM_PLUGIN', options); // 此处通过放在微信本地缓存来传递给下一个页面数据，因为如果用？接参数传递的话会超长
  //   url = url + '?options=' + JSON.stringify(options);
  // }
  // wx.navigateTo({url: url,});
};

const getOpenid = ()=> {
  var gd = app.globalData
  var userinfo = gd.userinfo;
  if (userinfo && userinfo.openid) {
    console.log('has got openid from storage')
    return userinfo.openid
  }
  wx.login({
    success: function (res) {
      var code = res.code
      wx.request({
        url: 'https://apigroupbuy.kfc.com.cn/groupbuying/weixin/openid',
        data: {
          code: code,
          appid: gd.appid,
          secret: gd.secret
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          var openid = res.data.openid
          userinfo['openid'] = openid
          gd.userinfo = userinfo
          console.log('--- server returned openid: ' + openid)
          return openid
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }
  })
}

module.exports = {
  gotoPageFromPlugin,
  getOpenid
}