App({
  onLaunch() {
  },
  onShow() {
    // Do something when show.
  },
  onHide() {
    // Do something when hide.
  },
  onError() {
    // 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
  },
  onPageNotFound() {
    // 当要打开的页面并不存在时，会回调这个监听器
  },
  globalData: {
    userInfo: {},
    
    /*从插件返回到小程序的页面路由*/
    callbackUrl: {
      'index': '../pt-index/index',                       // 拼团首页
      'detail-prd': '../pt-detail-prd/index',             // 拼团商品详情
      'detail-grp': '../pt-detail-grp/index',             // 拼团详情
      'detail-order': '../pt-detail-order/index',         // 订单详情
      'confirm-order': '../pt-confirm-order/index',       // 订单确认
      'pay': '../pt-pay/index',                           // 支付呼出
      'login': '../pt-login/index'                        // 登录呼出
    },

    appid:'wx85694629dac0c26a',
    secret:'17c7b613567ac214c2e8e4f4c4881c0f'
  }
});
