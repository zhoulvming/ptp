const config = {
  buyway_single: 0,
  buyway_group: 1,
  grp_status_create: 0,   //拼团状态：发起拼团
  grp_status_join: 1,     //拼团状态：参团
  grp_status_success: 2,  //拼团状态：拼团成功
  grp_status_fail: 999,    //拼团状态：拼团失败

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
  width_scale_minibtn: 4.75
};

module.exports = config;