App({
  onLaunch: function() {
    wx.removeStorageSync('userinfo')
  },
  globalData: {
    /*用户信息*/
    userinfo: {},
    
    /*嵌入拼团插件的页面路由*/
    pt_page_route: {
      'index': '../pt-index/index',                       // 拼团首页
      'detail-prd': '../pt-detail-prd/index',             // 拼团商品详情
      'detail-grp': '../pt-detail-grp/index',             // 拼团详情
      'detail-order': '../pt-detail-order/index',         // 订单详情
      'confirm-order': '../pt-confirm-order/index',       // 订单确认
      'login': '../pt-login/index',                       // 登录呼出

      'app-home': '../../pages/index/index',                       // app首页
      'app-menu': '../../pages/menu/menu',                         // 点单
      'app-mine': '../../pages/usercenter/main'                    // 我的  
    },

    /*小程序所属*/
    appid:'wx85694629dac0c26a',
    secret:'17c7b613567ac214c2e8e4f4c4881c0f',
    brand: 'CJ',
    channelId:'800008'
  }
})