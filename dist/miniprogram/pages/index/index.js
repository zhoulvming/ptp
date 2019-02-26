Page({
  data: {},
  onLoad() {
    var userinfo = {
      userCode: '1000',
      openid: '11111',
      nickname: 'nickname',
      avatarUrl: '',
      mobileNo: '12345567789'
    };
    wx.setStorageSync('userinfo', userinfo );
  }
});