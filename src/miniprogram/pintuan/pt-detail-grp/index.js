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
      that.setData({options: {grpId: scene.grpId, grpEnter: 8}})
    } else if (po.grpId) {
      // 通过分享好友进来的场合
      that.setData({options: {grpId: po.grpId, grpEnter: 8}})
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
  },
  onUnload() {
    // wx.reLaunch({url: '../pt-index/index'})
  },
  gotoPageFromPlugin(data) {
    ptCommon.gotoPageFromPlugin(data);
  },
  onShareAppMessage(res) {

    var that = this
    var opData = that.data.options
    var userinfo = that.data.userinfo
    var grpId = opData.grpId
    var openid = userinfo.openid
    console.log(grpId)
    console.log(openid)

    if (res.from === 'button') {
      // 来自页面内转发按钮
      var shareModel = res.target.dataset.sharemodel
      return {
        title: shareModel.title,
        path: 'pintuan/pt-detail-grp/index?openid=' + openid + '&grpId=' + grpId,
        imageUrl: shareModel.imageUrl
      }
    } else {
      return {
        path: 'pintuan/pt-detail-grp/index?openid=' + openid + '&grpId=' + grpId
      }
    }
  }
})