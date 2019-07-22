Page({
  data: {},
  onLoad() {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        let cH = res.windowHeight
        let cW = res.windowWidth
        let ratio = 750 / cW
        let height = cH * ratio
        that.setData({height: height})
      }
    })

    var options = wx.getStorageSync('DATA_FROM_PLUGIN')
    console.log('errror page options: ')
    console.log(options)
    that.setData({errMsg: options.errMsg})
    that.setData({errImg: '../images/error.png'})

    if (options.errType && options.errType == 'request fail') {
      that.setData({errImg: '../images/error2.png'})
    }

  },
  gotoHomePage() {
    wx.navigateTo({url: '../pt-index/index'})
  }
})