Component({
  /**
   * 组件的属性列表
   */
  properties: {
    prds: {
      type: [],//类型
      value: []//默认值
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoDetail: function(e) {
      //console.log(e.currentTarget.dataset.prdid);
      // e.currentTarget.dataset.prdid 获取prdId
      wx.navigateTo({
        url: '/pages/detail-prd/index?prdId=' + e.currentTarget.dataset.prdid
      });

      // console.log(1111);
      // let urlPay = 'https://mclient.alipay.com/service/rest.htm?sign=AM4qwYqFy0cV0%2BPMCv1eEE8CXhrBJ%2FJLpv1UViqobKNJY67LkbyiEIvBHi0DRJsxDX4u2TEZfZjr7KpS6m2nDiSVklIuJpWJcOJO4cNIrWnrKx877N2%2FNbVQQqLTmjukPC10O4L6Wn%2FU6y9jgNLQv8GF5MKmBpRf6hI5zAERNis%3D&sec_id=0001&v=2.0&_input_charset=utf-8&req_data=%3Cauth_and_execute_req%3E%3Crequest_token%3E201707124346f9bc964d52f0f244a1576f5c7f18%3C%2Frequest_token%3E%3C%2Fauth_and_execute_req%3E&service=alipay.wap.auth.authAndExecute&partner=2088521384879692&format=xml';
      // wx.request({
      //   url: urlPay,
      //   success: function (res) {
      //     console.log(res.data);
      //   },
      //   fail: function() {
      //     console.log('failed');
      //   }
      // });

    }
  }
});
