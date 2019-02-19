
// 全局app实例
// const app = getApp();
// console.log(app);

Page({
  data: {},
  onLoad() {


    // wx.login({
    //   success: res => {
    //     console.log(res);
    //     var code = res.code;
    //     if (code) {
    //       console.log('获取用户登录凭证：' + code);
    //       try {
    //         wx.setStorageSync('openid', code);
    //       } catch (e) {
    //         console.log(e);
    //       }
    //     }
    //   }
    // });


  },
  onReady() {
    // Do something when page ready.
  },
  onShow() {
    // Do something when page show.
  },
  onHide() {
    // Do something when page hide.
  },
  onUnload() {
    // Do something when page close.
  },
  onPullDownRefresh() {
    // Do something when pull down.
  },
  onReachBottom() {
    // Do something when page reach bottom.
  },
  onShareAppMessage() {
    // return custom share data when user share.
  },
  onPageScroll() {
    // Do something when page scroll
  },
  onTabItemTap() {
    // 当前是 tab 页时，点击 tab 时触发
  },
  customData: {},

  incrementTotal() {
    wx.navigateTo({
      url: '../detail-order/detail-order',
    });
  },

  gotoplugin() {
    wx.navigateTo({
      url: 'plugin://pt_plugin/index'
    });
  }
});