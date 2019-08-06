const ptCommon = require('../pt.common.js')
const app = getApp()
Page({
  data: {},
  onLoad(po) {
    var that = this
    if(po.scene) {
      // 通过分享进来的场合
      console.log(po.scene)
      var scene = decodeURIComponent(po.scene)
      that.setData({options: {prdId: scene.prdId}})
    } else if (po.prdId) {
      // 通过分享好友进来的场合
      that.setData({options: {prdId: po.prdId}})
    } else {
      var options = wx.getStorageSync('DATA_FROM_PLUGIN')
      that.setData({options: options})
    }

    var userinfo = app.globalData.userinfo
    if (!userinfo.openid) {
      ptCommon.getOpenid(function(){
        userinfo = app.globalData.userinfo
        that.setData({ userinfo: userinfo })
      })
    } else {
      that.setData({ userinfo: userinfo })
    }

    // 设配匹配
    ptCommon.isIphone(that)

  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data)
  },
  onShareAppMessage(res) {
    var that = this

    // TODO: 设置菜单中的转发按钮触发转发事件时的转发内容
    var opData = that.data.options
    var prdId = opData.prdId
    console.log(res)

    // 来自页面内的按钮的转发
    if (res.from === 'button') {
      console.log('share by page button')
      // 来自页面内转发按钮
      var shareModel = res.target.dataset.sharemodel
      return {
        title: shareModel.title,
        path: 'pintuan/pt-detail-prd/index?prdId=' + prdId,
        imageUrl: shareModel.imageUrl
      }
    } else {
      console.log('share by wx button')
      console.log(opData)
      return {
        path: 'pintuan/pt-detail-prd/index?prdId=' + opData.prdId
      }
    }
  }
})