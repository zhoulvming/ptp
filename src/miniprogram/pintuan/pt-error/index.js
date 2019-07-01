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
  },
  gotoHomePage() {
    wx.navigateTo({url: '../pt-index/index'})
  }
})