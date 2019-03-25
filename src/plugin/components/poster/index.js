var utils = require('../../utils/util.js');
var config = require('../../lib/config.js');
Component({
  properties: {
    imageUrl: {
      type: String,
      value: ''
    },
    price: { // 价格
      type: String,
      value: ''
    },
    orgPrice: { // 原价
      type: String,
      value: ''
    },
    prdName: { // 名称
      type: String,
      value: ''
    },
    prdDesc: { // 简介
      type: String,
      value: ''
    },
    numbers: { // 几人团
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    productCode: '',//二维码
    showpost: false,
    imgHeight: 600,
    captchaImage: null,
    imageShowFlag: 'none'
  },

  ready: function() {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    makeSharePoster: function() {
      var that = this;
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });

      that.setData({
        showpost: true
      });
      wx.downloadFile({
        url: that.data.imageUrl,
        success: function(res) {
          wx.hideLoading();
          var imagePath = res.tempFilePath;
          that.calculateHeight(imagePath, function(imageHeight) {
            that.drawCanvas(imagePath, imageHeight);
          });
        }
      });
    },

    //canvas绘制分享海报
    drawCanvas: function(imagePath, imageHeight) {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      var that = this;
      const ctx = wx.createCanvasContext('myCanvas', that);
      var width = '';
      const query = wx.createSelectorQuery().in(this);
      query.select('#canvas-container').boundingClientRect(function(rect) {
        var height = rect.height;
        width = rect.width;
        var left = rect.left + 5;
        ctx.setFillStyle('#fff');
        ctx.fillRect(0, 0, rect.width, height);
        var imgheght = parseFloat(imageHeight);

        // 图片
        if (imagePath) {
          ctx.drawImage(imagePath, 0, 0, width, imgheght);
          ctx.setFillStyle('#fff');
          ctx.setTextAlign('left');
        }

        //产品名称
        if (that.data.prdName) {
          const CONTENT_ROW_LENGTH = 24; // 正文 单行显示字符长度
          let [contentLeng, contentArray, contentRows] = that.textByteLength((that.data.prdName).substr(0, 40), CONTENT_ROW_LENGTH);
          ctx.setTextAlign('left');
          ctx.setFillStyle('#000');
          ctx.setFontSize(14);
          let contentHh = 22 * 1;
          for (let m = 0; m < contentArray.length; m++) {
            ctx.fillText(contentArray[m], 15, imgheght + 25 + contentHh * m);
          }
        }

        // 产品简介
        if (that.data.prdDesc) {
          that.fillTextByLength(ctx, '10', '#999', that.data.prdDesc, imgheght + 40);
        }

        // 产品金额
        if (that.data.price || that.data.price == 0) {
          ctx.setFontSize(25);
          ctx.setFillStyle('#F57509');
          ctx.setTextAlign('left');
          var price = utils.formatPrice(that.data.price);
          var orgPrice = that.data.orgPrice;
          var numbers = that.data.numbers;

          // 团购价
          ctx.setFontSize(10);
          ctx.setFillStyle('#000');
          ctx.fillText('¥', left - 28, imgheght + 80);

          ctx.setFontSize(14);
          ctx.fillText(price.pref + '.', left - 20, imgheght + 80);

          ctx.setFontSize(10);
          ctx.fillText(price.suff, left - 12, imgheght + 80);

          // 原价
          ctx.setFontSize(10);
          ctx.setFillStyle('#666');
          ctx.fillText('¥' + orgPrice, left + 7, imgheght + 80);
          ctx.fillText('-----', left + 7, imgheght + 80);

          // 几人团信息
          ctx.setFillStyle('#FFF6E8');
          ctx.fillRect(left + 40, imgheght + 66, 40, 20);
          ctx.setFillStyle('#FFBA4A');
          ctx.setFontSize(10);
          console.log(numbers);
          ctx.fillText(numbers + '人团', left + 45, imgheght + 80);

        }

        // 小程序码
        ctx.setFillStyle('#000');
        ctx.fillText('长按识别小程序码', left + 160, imgheght + 80);
        that.getCodeImage();

      }).exec();

      setTimeout(function() {
        ctx.draw();
        that.setData({imageShowFlag: 'block'});
        wx.hideLoading();
      }, 1000);
    },

    fillTextByLength(ctx, fontSize, fontColor, text, y) {
      var chr =text.split('');//这个方法是将一个字符串分割成字符串数组
      var temp = '';
      var row = [];
      ctx.setFontSize(fontSize);
      ctx.setFillStyle(fontColor);
      for (var a = 0; a < chr.length; a++) {
        if (ctx.measureText(temp).width < 150) {
          temp += chr[a];
        }
        else {
          a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
          row.push(temp);
          temp = '';
        }
      }
      row.push(temp); 
  
      //如果数组长度大于2 则截取前两个
      if (row.length > 2) {
        var rowCut = row.slice(0, 2);
        var rowPart = rowCut[1];
        var test = '';
        var empty = [];
        for (var i = 0; i < rowPart.length; i++) {
          if (ctx.measureText(test).width < 220) {
            test += rowPart[i];
          }
          else {
            break;
          }
        }
        empty.push(test);
        var group = empty[0] + '...'; //这里只显示两行，超出的用...表示
        rowCut.splice(1, 1, group);
        row = rowCut;
      }
      for (var b = 0; b < row.length; b++) {
        ctx.fillText(row[b], 15, y + b*10, 200);
      }
    },

    textByteLength(text, num) { // text为传入的文本  num为单行显示的字节长度
      let strLength = 0; // text byte length
      let rows = 1;
      let str = 0;
      let arr = [];
      for (let j = 0; j < text.length; j++) {
        if (text.charCodeAt(j) > 255) {
          strLength += 2;
          if (strLength > rows * num) {
            strLength++;
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        } else {
          strLength++;
          if (strLength > rows * num) {
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        }
      }
      arr.push(text.slice(str, text.length));
      return [strLength, arr, rows]; //  [处理文字的总字节长度，每行显示内容的数组，行数]
    },

    //点击保存到相册
    saveShareImg: function() {
      var that = this;
      wx.showLoading({
        title: '正在保存',
        mask: true,
      });
      setTimeout(function() {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success: function(res) {
            wx.hideLoading();
            var tempFilePath = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success() {
                wx.showModal({
                  content: '图片已保存到相册，赶紧晒一下吧~',
                  showCancel: false,
                  confirmText: '好的',
                  confirmColor: '#333',
                  success: function(res) {
                    that.closePoste();
                    if (res.confirm) {
                      console.log('do nothing...');
                    }
                  },
                  fail: function(res) {
                    console.log(res);
                  }
                });
              },
              fail: function(res) {
                wx.showToast({
                  title: res.errMsg,
                  icon: 'none',
                  duration: 2000
                });
              }
            });
          },
          fail: function(err) {
            console.log(err);
          }
        }, that);
      }, 1000);
    },
    //关闭海报
    closePoste: function() {
      this.setData({
        showpost: false
      });
    },

    //计算个元素高度
    calculateHeight: function(imagePath, cb) {
      var mtHeight = 50; // canvas距离屏幕顶部的距离，该值在css文件会有设置, 注意此处都是以 px 为单位的高度
      var that = this;
      wx.getSystemInfo({
        success(res) {
          var canvasHeight = res.windowHeight * 0.66;
          var imgHeight = canvasHeight * 0.73;
          var codeimgHeight = res.windowWidth * 0.14;
          var buttonTop = canvasHeight + mtHeight + 30;
          var codeimgTop = imgHeight + mtHeight + 30 - codeimgHeight/2;
          console.log('imgHeight: ' + imgHeight);
          that.setData({
            canvasHeight: canvasHeight,
            imgHeight: imgHeight,
            codeimgHeight: codeimgHeight,
            buttonTop: buttonTop,
            codeimgTop: codeimgTop
          });
          cb(imgHeight);
        }
      });
    },
 
    // 小程序码
    getCodeImage() {
      var that = this;
      wx.request({
        url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.appid + '&secret=' + config.secret,
        header: { 'content-type': 'application/json' },
        method: 'GET',
        success(res) {
          wx.request({
            url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + res.data.access_token,
            method: 'POST',
            header: { 'content-type': 'application/json;charset=utf-8' },
            responseType: 'arraybuffer',
            data: {
              page: 'pages/index/index',
              scene: 'prdId=124'
            },
            success(res) {
              if (res.statusCode == 200) {
                var base64 = wx.arrayBufferToBase64(res.data);
                that.setData ({
                  captchaImage: 'data:image/PNG;base64,' + base64
                });
              }
            }
          });
        }
      });
    }
  }
});