const grantMap = {
  chooseAddress: {
    scope: 'address',
    name: '通讯地址'
  },
  saveImageToPhotosAlbum: {
    scope: 'writePhotosAlbum',
    name: '保存到相册'
  },
  getUserInfo: {
    scope: 'userinfo',
    name: '我要获取你微信头像和OPENID'
  }
};

function getSetting(scope) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success({
        authSetting
      }) {
        resolve(authSetting[`scope.${scope}`]);
      },
      fail: reject
    });
  });
}

function openSetting(scope) {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success({
        authSetting
      }) {
        if (scope) {
          resolve(authSetting[`scope.${scope}`]);
        } else {
          resolve(authSetting);
        }
      },
      fail: reject
    });
  });
}
function confirm({ content = '', title = '', options =[{}, {}] }) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      cancelText: options[0].label || '取消',
      confirmText: options[1].label || '确定',
      confirmColor: '#21c0ae',
      success: function (res) {
        if (res.confirm) {
          resolve(res);
          if (options[1].callback) {
            options[1].callback();
          }
        } else if (res.cancel) {
          reject(res);
          if (options[0].callback) {
            options[0].callback();
          }
        }
      }
    });
  });
}
module.exports = function(apiName, params) {
  const grant = grantMap[apiName];
  if (!grant) {
    throw Error(
      `未配置[${apiName}]的api授权映射，请与bridge.js中的grantMap添加映射关系！`
    );
  }
  getSetting(grant.scope).then(isGrant => {
    if (typeof isGrant === 'boolean' && !isGrant) {
      // 用户若已经不允许授权过了，则引导用户重新授权
      confirm({
        content: `请授权[${grant.name}]，才能正常使用功能！`,
        title: '温馨提示'
      })
      .then(_ => {
        console.log(_);
        openSetting();
      });
    } else {
      // 若用户未授权过，或者已经授权允许了，则直接调 api
      wx[apiName](params);
    }
  });
};