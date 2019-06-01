const app = getApp()

// 该页面跳转函数由插件触发
const gotoPageFromPlugin = (data) => {
  var options = data.detail.options
  var target = data.detail.target
  var url = null
  var jsonObj = app.globalData.pt_page_route
  for(var item in jsonObj) {
    if(item == target){
      url = jsonObj[item]
    }
  }
  if (url) {
    wx.setStorageSync('DATA_FROM_PLUGIN', options)
    wx.navigateTo({url: url})
  } else {
    console.log('未配置拼团插件的页面路由')
  }
}

// 获取微信用户的openid
const getOpenid = (cb) => {
  var gd = app.globalData
  var userinfo = gd.userinfo
  if (userinfo && userinfo.openid) {
    return userinfo.openid

  }
  wx.login({
    success: function (res) {
      console.log(444444)
      var code = res.code
      console.log(code)
      wx.request({
        url: 'https://apigroupbuy.kfc.com.cn/groupbuying/weixin/openid',
        data: {
          code: code,
          appid: gd.appid,
          secret: gd.secret
        },
        method: 'POST',
        success: function (res) {
          console.log(5555555)
          var openid = res.data.openid
          console.log(66666666)
          console.log('==== 小程序侧首页获取openid：' + openid)
          userinfo['openid'] = openid
          gd.userinfo = userinfo
          if (userinfo.mobileNo) {
            cb()
          }
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }
  })
}

// log定制函数
const log = function(msg, obj) {
  console.log('------- ' + msg + ':')
  if (obj) {
    console.log(obj)
  } else {
    console.log('no data')
  }
}

const logErr= function(err) {
  console.log('------- ' + err + ':')
  if (err) {
    console.log(err)
  } else {
    console.log('no data')
  }
}

module.exports = {
  gotoPageFromPlugin,
  getOpenid,
  log,
  logErr
}