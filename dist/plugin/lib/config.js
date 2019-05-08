const config = {
  buyway_single: 0,
  buyway_group: 1,
  // grp_status_create: 0,   //拼团状态：发起拼团
  // grp_status_join: 1,     //拼团状态：参团
  // grp_status_success: 2,  //拼团状态：拼团成功
  // grp_status_fail: 999,    //拼团状态：拼团失败

  // 首页banner图片长宽比例
  scale_banner: 2.43,

  // 产品图片比例
  scale_product: 2.52,

  // 不同按钮大小比例
  scale_onebtn: 6,
  scale_twobtn: 3.13,
  scale_minibtn: 2.46,

  // 与设备的宽度比例
  width_scale_onebtn: 1.21,
  width_scale_twobtn: 2.60,
  width_scale_minibtn: 4.75,

  // 后台API
  restAPI: {
    banner: 'https://apigroupbuy.kfc.com.cn/groupbuying/group/image',
    prds: 'https://apigroupbuy.kfc.com.cn/groupbuying/product/productlist',
    pt_check: 'https://apigroupbuy.kfc.com.cn/groupbuying/group/prdvalid',
    prd_detail: 'https://apigroupbuy.kfc.com.cn/groupbuying/product/prddetail',
    grp_list: 'https://apigroupbuy.kfc.com.cn/groupbuying/group/grouplist',
    grp_detail: 'https://apigroupbuy.kfc.com.cn/groupbuying/group/groupdetail',
    order_list: 'https://apigroupbuy.kfc.com.cn/groupbuying/group/orderlist',
    order_create: 'https://apigroupbuy.kfc.com.cn/groupbuying/order/creation',
    order_detail: 'https://apigroupbuy.kfc.com.cn/groupbuying/order/detail',
    wxpay: 'https://apigroupbuy.kfc.com.cn/groupbuying/payment/payurl',
    upd_order_status: 'https://apigroupbuy.kfc.com.cn/groupbuying/order/updstatus'
    
  },

  // 拼团详情页入口场合
  // 1. 发团场合: 拼团首页(插件)  -> 产品详情 -> confirm -> 拼团详情
  // 2. 凑团场合: 拼团首页(插件)  -> 产品详情 -> 拼团详情 -> confirm
  // 3. 查看订单场合: 订单列表(小程序)  -> 订单详情(插件) -> 拼团详情
  grpEnter: {
    create: 1,
    create_success: 2,
    create_fail: 3,
    join: 4,
    join_success: 5,
    join_fail: 6,
    fromOrder: 7
  },

  // 小程序接口页面定义
  miniPage: {
    index: 'index',
    login: 'login',
    pay: 'pay',
    detail_prd: 'detail-prd',
    detail_grp: 'detail-grp',
    detail_order: 'detail-order',
    confirm_order: 'confirm-order'
  },

  // 账号信息
  appid: 'wx85694629dac0c26a',
  secret: '17c7b613567ac214c2e8e4f4c4881c0f'
}

module.exports = config