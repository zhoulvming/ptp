const config = require('../lib/config.js')
const utils = {
  formatPriceOld(data) {
    var strData = data + ''
    var pref = '00'
    var suff = '00'
    var index = strData.indexOf('.')
    if (index > 0) {
      pref = strData.substring(0, index)
      suff = strData.substring(index+1, index+2)
    } else {
      pref = strData
      suff = '00'
    }

    return {pref: pref, suff: suff}
  },

  formatPrice(data) {
    var pref = ''
    var suff = ''
    var price = data + ''
    var arr = price.split('.')
    if (arr) {
      pref = arr[0]
      if (arr.length > 1) {
        suff = arr[1]
        if (suff.length > 1) {
          suff = suff.substring(0, 1)
        }
      }
      if (suff != '') {
        var suffNumber = suff * 1
        if (suffNumber == 0) {
          suff = ''
        }
      }
    }
    if (suff != '') {
      suff = '.' + suff
    }

    return {pref: pref, suff: suff}
  },

  // 格式化商品列表信息
  formatProductListData(datas) {
    var that = this
    var rts = []
    datas.forEach(function(data){     
      var price = that.formatPrice(data.price)
      rts.push({
        prdId: data.prdId,
        prdName: data.proName,
        price: data.price,
        price_pref: price.pref,
        price_suff: price.suff,
        orgPrice: data.orgPrice,
        pricReduce: data.pricReduce,
        numbers: data.numbers,
        limitNum: data.limitNum,
        image: data.image,
        orgPrdId: data.orgPrdId,
        groupBuyPrdId: data.groupBuyPrdId
      })
    })
  
    return rts
  },

  // 格式化商品信息
  formatProductData(data) {
    var leftTime = data.leftTime
    var timeTemp = leftTime.split(':')
    var leftTime_d = timeTemp[0]
    var leftTime_h = timeTemp[1]
    var leftTime_m = timeTemp[2]
    var leftTime_s = timeTemp[3]

    var price = this.formatPrice(data.price)
    var prdDesc = data.activityDesc
    if (!prdDesc || prdDesc == 'null') {
      prdDesc = ''
    }
    var detailContent = data.detailContent
    if (!detailContent || detailContent == 'null') {
      detailContent = ''
    }
    return {
      prdId: data.prdId,
      prdName: data.prdName,
      prdDesc: prdDesc,
      catgryName: data.categoryName,
      numbers: data.numbers,
      salesCount: data.salesCount,
      leftCount: data.leftCount,
      restCount: data.restCount,
      price: data.price,
      price_pref: price.pref,
      price_suff: price.suff,
      orgPrice: data.orgPrice,
      detailContent: detailContent,
      question: data.question,
      leftTime_d: leftTime_d,
      leftTime_h: leftTime_h,
      leftTime_m: leftTime_m,
      leftTime_s: leftTime_s,
      limitCount: data.limitCount,
      images: data.images,
      imageSingle: data.imageSingle,
      imagePoster: data.imagePoster,
      validDays: data.validDays,
      orgProdId: data.orgProdId,
      groupBuyProId: data.groupBuyProId,
      shortPrdName: data.shortPrdName
    }
  },

  // 格式化拼团列表信息
  formatGroupListData(datas) {
    var rts = []
    datas.forEach(function(data){
      var validatedTime = data.validatedTime

      var timeTemp = validatedTime.split(':')
      var validatedTime_d = timeTemp[0]
      var validatedTime_h = timeTemp[1]
      var validatedTime_m = timeTemp[2]
      var validatedTime_s = timeTemp[3]
      
      rts.push({
        prdId: data.prdId,
        grpId: data.grpId,
        prdName: data.prdName,
        leftNumbers: data.leftNumbers,
        openid: data.openid,
        validatedTime_d: validatedTime_d,
        validatedTime_h: validatedTime_h,
        validatedTime_m: validatedTime_m,
        validatedTime_s: validatedTime_s,
        nickname: data.nickName,
        avatarUrl: data.avatarUrl
      })
    })
  
    return rts
  },

  // 格式化拼团详细信息
  formatGroupDetailData(data) {
    var leftTime = data.leftTime
    var timeTmep = leftTime.split(':')
    var leftTime_d = timeTmep[0]
    var leftTime_h = timeTmep[1]
    var leftTime_m = timeTmep[2]
    var leftTime_s = timeTmep[3]
    var price = this.formatPrice(data.price)
    return {
      grpId: data.grpId,
      numbers: data.number,
      prdId: data.prdId,
      prdName: data.prdName,
      prdDesc: data.activityDesc,
      prdImage: data.prdImage,
      leftNumber: data.leftNumber,
      validDays: data.validDays,
      members: data.members,
      leftTime: leftTime,
      leftTime_d: leftTime_d,
      leftTime_h: leftTime_h,
      leftTime_m: leftTime_m,
      leftTime_s: leftTime_s,
      price: data.price,
      price_pref: price.pref,
      price_suff: price.suff,
      orgPrice: data.orgPrice,
      leftCount: data.leftCount,
      limitNum: data.limitNum,
      grpStatus: data.grpStatus,
      orderNum: data.orderNum,
      restCount: data.restCount,
      shortPrdName: data.shortPrdName,
      imagePoster: data.imagePoster
    }
  },

  // log定制函数
  log(msg, obj) {
    console.log('=== ' + msg + ':')
    if (obj) {
      console.log(obj)
    } else {
      console.log('no data')
    }
  },
  logErr(err) {
    console.log('=== ' + err + ':')
    if (err) {
      console.log(err)
    } else {
      console.log('no data')
    }
  },

  // request
  requestPost(url, data, cb, that) {
    utils.log('请求参数', data) 
    wx.request({
      url: url,
      data: data,
      header: { 'content-type': 'application/json;charset=utf-8' },
      method: 'POST',
      success(res) {
        console.log('server response: 111111111111111')
        console.log(res)
        console.log('server response: 222222222222222')
        if (res.statusCode != config.apiStatusCode.sucess) {

          // 502
          if (res.statusCode == 502 || res.statusCode == 508) {
            that.triggerEvent('callback', {target: config.miniPage.error, options:{errMsg: '系统正在维护中，请稍后再试'}})
            return
          }

          // TODO:发生后台异常或者错误
          console.log('发生后台异常或者错误')
          var dataCode = res.data.code
          console.log(dataCode)

          var errMsg = '哎呀，页面出问题啦！'
          if (dataCode == config.apiStatusCode.duplicator_join) {
            errMsg = '您已存在拼团订单，不能重复下单'
          } else if (dataCode == config.apiStatusCode.createOrder_joinFail) {
            errMsg = '拼团失败，付款将在7个工作日内退到您的支付账号'
          } else if (dataCode == config.apiStatusCode.product_invalid) {
            errMsg = '拼团活动已过期'
          } else if (dataCode == config.apiStatusCode.stock_none) {
            errMsg = '商品库存不足，请选择其他商品'
          }

          that.triggerEvent('callback', {target: config.miniPage.error, options:{errMsg: errMsg}})
        } else {
          // 正常场合
          cb(res)
        }
      },
      fail(errMsg) {
        utils.log('请求失败', errMsg),
        that.triggerEvent('callback', {target: config.miniPage.error, options:{errMsg: '啊，网络不给力呀！', errType: 'request fail'}})
      }
    })
  },

  // iphone
  isIphone(page) {
    page.setData({isAndroid: false})
    page.setData({isIphone: false})
    page.setData({isIphoneX: false})

    // #### iphoneX
    // model = iPhone XR
    // platform = ios
    // brand = iPhone
    // #### iphone
    // model = iPhone 6s Plus
    // platform = ios
    // brand = iPhone

    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == 'ios') {
          var model = res.model
          console.log(model)
          if (model.indexOf('iPhone X') >= 0) {
            page.setData({isIphoneX: true})
            console.log('.............................iphonex.................')
          } else {
            page.setData({isIphone: true})
            console.log('.............................iphone.................')
          }
        } else {
          page.setData({isAndroid: true})
          console.log('.............................android.................')
        }
      }
    })
  }
}

module.exports = utils