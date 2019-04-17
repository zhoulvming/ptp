App({
  globalData: {
    /*用户信息*/
    userinfo: {},
    
    /*页面路由*/
    callbackUrl: {
      'index': '../pt-index/index',                       // 拼团首页
      'detail-prd': '../pt-detail-prd/index',             // 拼团商品详情
      'detail-grp': '../pt-detail-grp/index',             // 拼团详情
      'detail-order': '../pt-detail-order/index',         // 订单详情
      'confirm-order': '../pt-confirm-order/index',       // 订单确认
      'pay': '../pt-pay/index',                           // 支付呼出
      'login': '../pt-login/index'                        // 登录呼出
    },

    /*小程序所属*/
    appid:'wx85694629dac0c26a',
    secret:'17c7b613567ac214c2e8e4f4c4881c0f',
    brand: 'KFC',
    channelId:'800009'
  }
})