const utils = {
  formatPrice(data) {
    var pref = '00';
    var suff = '00';
    var index = data.indexOf('.');
    if (index > 0) {
      pref = data.substring(0, index);
      suff = data.substring(index+1);
    } else {
      pref = data;
      suff = '00';
    }

    return {pref: pref, suff: suff};
  },

  // 格式化商品信息
  formatProductData(data) {
    var leftTime = data.leftTime;
    var fi = leftTime.indexOf(':');
    var leftTime_d = leftTime.substring(0,fi);
    var leftTime_h = leftTime.substring(fi+1,fi+3);
    var leftTime_m = leftTime.substring(fi+4,fi+6);
    var leftTime_s = leftTime.substring(fi+7,fi+9);

    var price = this.formatPrice(data.price);

    return {
      prdId: data.prdId,
      prdName: data.prdName,
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
      var validatedTime_d = validatedTime.substring(0,2);
      var validatedTime_h = validatedTime.substring(3,5);
      var validatedTime_m = validatedTime.substring(6,8);
      var validatedTime_s = validatedTime.substring(9,11);
      
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
    var fi = leftTime.indexOf(':');
    var leftTime_d = leftTime.substring(0,fi);
    var leftTime_h = leftTime.substring(fi+1,fi+3);
    var leftTime_m = leftTime.substring(fi+4,fi+6);
    var leftTime_s = leftTime.substring(fi+7,fi+9);
    var price = this.formatPrice(data.price);
    return {
      grpId: data.grpId,
      numbers: data.numbers,
      prdName: data.prdName,
      prdImage: data.prdImage,
      leftNumber: data.leftNumber,
      members: data.members,
      leftTime: leftTime,
      leftTime_d: leftTime_d,
      leftTime_h: leftTime_h,
      leftTime_m: leftTime_m,
      leftTime_s: leftTime_s,
      price_pref: price.pref,
      price_suff: price.suff
    };
  }
};

module.exports = utils;