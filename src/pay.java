paypay: function (that, openid) {
    let operFlag = 'pay';
    wx.request({
      url: 'https://xxx/wechatserver/servlet/WechatServlet',
      data: {
        openid: openid,
        operFlag: operFlag
      },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res);
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': 'MD5',
          'paySign': res.data.sign,
          'success': function (res) {
            if (res.errMsg == "requestPayment:ok") {
              wx.showToast({
                title: '支付成功'
              })
            }
          },
          'fail': function (res) {
          }
        })
      },
      fail: function (res) {
        console.log(res.data.errmsg);
        console.log(res.data.errcode);
      },
      complete: function (res) {
      }
    })
  },





  if("pay".equals(operFlag)){
            String openid = request.getParameter("openid");
            logger.info("openid = " + openid);
            String url = "https://api.mch.weixin.qq.com/pay/unifiedorder";
            String reqStr = getReqStr(openid); //组装预下单的请求数据
            logger.info("reqStr=" + reqStr);
            results = sendPost(url,reqStr);//发送post数据到微信预下单
            logger.info("prepay from weixin: \n " + results);
            Map<String,String> return_data = null;
            try {
                return_data = WXPayUtil.xmlToMap(results);//微信的一个工具类
            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
                logger.error(e.getMessage());
            }
            String return_code = return_data.get("return_code");
            logger.info("return_code=" + return_code);
            if("SUCCESS".equals(return_code)){
                String prepay_id = return_data.get("prepay_id");
                results = conPayParam(prepay_id); //组装返回数据
            }else{
                results ="{\"return_code\":\"fail\"}";
            }

        }



//组装预下单的请求数据
    public static String getReqStr(String openid){
        Map<String,String> data = new HashMap<String,String>();
        String out_trade_no = setTradeNo();//
        //
        data.put("appid", appid);
        data.put("mch_id",mer_id);
        data.put("nonce_str", WXPayUtil.generateUUID());
        data.put("sign_type", "MD5");
        data.put("body", "spy test");
        data.put("out_trade_no", out_trade_no);
        data.put("device_info", "");
        data.put("fee_type", "CNY");
        data.put("total_fee", "1");//1分钱
        data.put("spbill_create_ip", "123.12.12.123");
        data.put("notify_url", "http://xxx/wxpay/notify");
        data.put("trade_type", "JSAPI");
        data.put("product_id", "12");
        data.put("openid", openid);
        try {
            String sign = WXPayUtil.generateSignature(data, merKey, SignType.MD5);
            data.put("sign", sign);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("sign error");
        }
        String reqBody = null;
        try {
            reqBody = WXPayUtil.mapToXml(data);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return reqBody;
    }

//保证唯一
    public static String setTradeNo(){
        String orderid = "20211909105011"+ getRandom(6);
        logger.info("orderid = " + orderid);
        return orderid;
    }

    //组装返回客户端的请求数据
    public static String conPayParam(String prepayid){
        logger.info("根据当前的prepayid构造返回参数= " + prepayid);
        String results = "";
        Map<String,String> map = new HashMap<String,String>();
        map.put("appId", appid);
        LocalDateTime time = LocalDateTime.now();
        map.put("timeStamp",  WXPayUtil.getCurrentTimestamp()+"");
        map.put("nonceStr", WXPayUtil.generateUUID() );
        map.put("package", "prepay_id=" + prepayid);
        map.put("signType", "MD5");
        String sign;
        try {
            sign = WXPayUtil.generateSignature(map, merKey, SignType.MD5);
            map.put("sign", sign);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            logger.error(e.getMessage());
        }
        return JSON.toJSONString(map);
    }        





    #### 注意点

    微信小程序前端发起post请求到服务器端时，服务器端收不到请求参数。原因是：微信API接口wx.request中： 
a) 对于 GET 方法的数据，会将数据转换成 query string（encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)…） 
b1) 对于 POST 方法且 header[‘content-type’] 为 application/json 的数据，会对数据进行 JSON 序列化 
b2) 对于 POST 方法且 header[‘content-type’] 为 application/x-www-form-urlencoded 的数据，会将数据转换成 query string （encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)…）
所以，如果post请求，为省去服务器端反序列化的操作时，可使用header[‘content-type’] 为 application/x-www-form-urlencoded 的数据。