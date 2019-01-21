// plugin/components/help-box/help-box.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    content: [{
      id: '01',
      title: '拼团玩法',
      contents: '发猜数包的人设置问题和答案，只有提交的答案和出题答案一致才可以得到红包',
      shows: false,
      imageFlag: ''
    }, {
      id: '02',
      title: '电子卡券',
      contents: '发猜数包的人设置问题和答案，只有提交的答案和出题答案一致才可以得到红包',
      shows: false
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showHide: function (e) {
      var contentFor = this.data.content;
      for (var i = 0; i < contentFor.length; i++) {
        if (e.currentTarget.dataset.changeid == contentFor[i].id) {
          var printPrice = 'content[' + i + '].shows';
          if (this.data.content[i].shows) {
            this.setData({ [printPrice]: false });
          } else {
            this.setData({ [printPrice]: true });
          }
        } else {
          var printPrice1 = 'content[' + i + '].shows';
          this.setData({ [printPrice1]: false });
        }
      }
    }
  }
});
