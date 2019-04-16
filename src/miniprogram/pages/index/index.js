const app = getApp()
Page({
  data: {},
  onLoad() {
    var gd = app.globalData
    this.setData({brand: gd.brand, channelId: gd.channelId})
  }
})