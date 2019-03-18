const utils = {
  formatPrice(data) {
    var strData = data + '';
    var pref = '00';
    var suff = '00';
    var index = strData.indexOf('.');
    if (index > 0) {
      pref = strData.substring(0, index);
      suff = strData.substring(index+1);
    } else {
      pref = strData;
      suff = '00';
    }

    return {pref: pref, suff: suff};
  },

  // 格式化商品信息
  formatProductData(data) {
    var leftTime = data.leftTime;
    var timeTemp = leftTime.split(':');
    var leftTime_d = timeTemp[0];
    var leftTime_h = timeTemp[1];
    var leftTime_m = timeTemp[2];
    var leftTime_s = timeTemp[3];

    var price = this.formatPrice(data.price);

    return {
      prdId: data.prdId,
      prdName: data.prdName,
      prdDesc: data.activityDesc,
      catgryName: data.categoryName,
      numbers: data.numbers,
      salesCount: data.salesCount,
      leftCount: data.leftCount,
      price: data.price,
      price_pref: price.pref,
      price_suff: price.suff,
      orgPrice: data.orgPrice,
      detailContent: data.detailContent,
      question: data.question,
      leftTime_d: leftTime_d,
      leftTime_h: leftTime_h,
      leftTime_m: leftTime_m,
      leftTime_s: leftTime_s,
      limitCount: data.limitCount,
      images: data.images,
      imageSingle: data.imageSingle,
      validDays: data.validDays,
      orgProdId: data.orgProdId,
      groupBuyProId: data.groupBuyProId
    };
  },

  // 格式化拼团列表信息
  formatGroupListData(datas) {
    var rts = [];
    datas.forEach(function(data){
      var validatedTime = data.validatedTime;

      var timeTemp = validatedTime.split(':');
      var validatedTime_d = timeTemp[0];
      var validatedTime_h = timeTemp[1];
      var validatedTime_m = timeTemp[2];
      var validatedTime_s = timeTemp[3];
      
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
        nickname: data.nickname,
        atavaUrl: data.atavaUrl
      });
    });
  
    return rts;
  },

  // 格式化拼团详细信息
  formatGroupDetailData(data) {

    var leftTime = data.leftTime;
    var timeTmep = leftTime.split(':');
    var leftTime_d = timeTmep[0];
    var leftTime_h = timeTmep[1];
    var leftTime_m = timeTmep[2];
    var leftTime_s = timeTmep[3];
    var price = this.formatPrice(data.price);
    return {
      grpId: data.grpId,
      number: data.number,
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
      limitNum: data.limitNum
    };
  },

};

module.exports = utils;