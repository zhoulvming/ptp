const ptCommon = require('../pt.common.js')
const app = getApp()
Page({
  data: {},
  onLoad(po) {
    var that = this

    //TODO: 测试海报分享时候的传参
    console.log('post 11111111111111111111111111111111')
    if(po.scene) {
      // 通过分享进来的场合
      console.log(po.scene)
      var scene = decodeURIComponent(po.scene)
      that.setData({options: {prdId: scene.prdId}})
    } else {
      var options = wx.getStorageSync('DATA_FROM_PLUGIN')
      that.setData({options: options})
    }
    console.log('post 22222222222222222222222222222222')
    
    // var options = wx.getStorageSync('DATA_FROM_PLUGIN')
    // that.setData({options: options})

    var userinfo = app.globalData.userinfo
    if (!userinfo.openid) {
      ptCommon.getOpenid(function(){
        userinfo = app.globalData.userinfo
        that.setData({ userinfo: userinfo })
      })
    } else {
      that.setData({ userinfo: userinfo })
    }
  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data)
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      var shareModel = res.target.dataset.sharemodel
      return {
        title: shareModel.title,
        path: 'pintuan/pt-detail-prd/index',
        imageUrl: shareModel.imageUrl
      }
    }
  }
})