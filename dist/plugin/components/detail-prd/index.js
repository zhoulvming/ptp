const config = require('../../lib/config.js');

Component({
  properties: {
    options: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        if (newVal) {          
          var jsonVal = JSON.parse(newVal.options);
          this.setData({ proId: jsonVal.proId });
          this.loadPage();
        }
      }
    }
  },

  data: {
    proId: '',
    currentTab: 0, //当前所在滑块的 index
    salesRecord: [],
    showModal: false,
    min:1,//最小值 整数类型，null表示不设置
    max: 5,//最大值 整数类型，null表示不设置
    num: 1,//输入框数量 整数类型
    change: 1,//加减变化量 整数类型
    def_num: 5,//输入框值出现异常默认设置值
    imgUrls: [
      '../../images/slide001.png',
      '../../images/slide002.png'
    ],
    buyway: 0,
    buywayPrice: 0
  },

  attached() {
    // var that = this;

    // // 根据proId获取商品详细信息
    // wx.request({
    //   url: 'https://apigroupbuy.kfc.com.cn/groupbuying/product/productdetail/groupbuyingitemid/TG2019021516041426971002',
    //   data: {},
    //   header: { 'content-type': 'application/json' },
    //   success(res) {
    //     let detail = res.data;
    //     that.setData({prdDetail: detail});
    //   }
    // }); 


    let tempData = {
      prdId: '10001',
      prdName: '商品名称',
      prdDesc: '这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容这里提供商品简介内容',
      prdImage: '../../images/pt001-detail.jpg',
      numbers: 3,
      salesCount: 100,
      leftCount: 50,
      limitCount: 5,
      leftTime_d: '12',
      leftTime_h: '12',
      leftTime_m: '12',
      leftTime_s: '12',
      price_pref: 99,
      price_suff: 30,
      orgPrice: 1000,
      detailContent: '凭券可到店兑换1份炭烤鸡腿帕尼尼，仅限1次兑换。\n\n1.使用有效期：自购买日起14天内使用有效，仅限6:00~9:00使用。\n2.这里是使用规则2说明部分',
      question: '券可到店兑换1.....',
      isJoined: 0, // 根据userId查看是否已经参团或者开团，如果是设置为1，同时设置grpId
      grpId: '',
      groups: [
        {
          userId: '1000',
          userName: 'jacob',
          leftNumbers: 2,
          leftTime_h: '12',
          leftTime_m: '12'
        },
        {
          userId: '1001',
          userName: 'rachel',
          leftNumbers: 1,
          leftTime_h: '12',
          leftTime_m: '12'           
        }
      ],
      records: [
        {
          userId: '1000',
          time: 3000,
          count: 1
        },
        {
          userId: '1001',
          time: 3000,
          count: 1
        }
      ]
    };

    // TODO: 数据format
    
    
    // this.setData({prdDetail: tempData});
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoPage(event) {
      var target = event.currentTarget.dataset.target;
      var status = event.currentTarget.dataset.status;
      wx.setStorageSync( {key: 'status', data: status} );
      this.triggerEvent('callback', {target: target});
    },

    loadPage() {
      var that = this;
      // 根据proId获取商品详细信息
      wx.request({
        url: 'https://apigroupbuy.kfc.com.cn/groupbuying/product/productdetail/groupbuyingitemid/' + that.data.proId,
        data: {},
        header: { 'content-type': 'application/json' },
        success(res) {
          var detail = res.data;
          that.setData({prdDetail: detail});
        }
      });       
    },

    showAllGroups() {
      console.log(111111);
    },

    //tab切换
    tabChange: function (event) {
      if (event.target.dataset.current == 1) {
      }
      this.setData({ currentTab: event.target.dataset.current});
    },
    //滑动事件
    tabSwiper: function (event) {
      this.setData({ currentTab: event.detail.current });
    },    

    showModal: function (e) {
      let buyway = e.currentTarget.dataset.buyway;
      let detail = this.data.prdDetail;
      this.setData({
        showModal: true
      });

      let buywayPrice = detail.price_pref + '.' + detail.price_suff;
      if (buyway && buyway == config.buyway_single) {
        buywayPrice = detail.orgPrice;
      }

      this.setData({
        buyway: buyway,
        buywayPrice: buywayPrice
      });
    },

    hideModalDlg: function() {
      this.setData({
        showModal: false
      });
    },

    evblur: function (e) {
      var zval = parseInt(e.detail.value);
      //正则 正整数 0 负整数
      if (/(^-[1-9][0-9]{0,}$)|(^0$)|(^[1-9][0-9]{0,}$)/.test(zval)){
        //最大值
        if (this.data.max != null) {
          if (zval > this.data.max) {
            console.log('超出最大值');
            this.setData({ num: this.data.def_num });
          }else{
            this.setData({ num: zval });
          }
        } else {
          this.setData({ num: zval });
        }
        //最小值
        if (this.data.min != null) {
          if (zval < this.data.min) {
            console.log('低于最小值');
            this.setData({ num: this.data.def_num });
          } else {
            this.setData({ num: zval });
          }
        } else {
          this.setData({ num: zval });
        }
      } else {
        console.log('不是整数');
        this.setData({ num: this.data.def_num });
      }
    },
    //加
    evad: function () {
      var cval = Number(this.data.num) + this.data.change;
      if (this.data.max != null){
        if (cval > this.data.max){
          console.log('超出最大值');
        }else{
          this.setData({ num: cval });
        }
      }else{
        this.setData({ num: cval });
      }
    },
    //减
    evic: function () {
      var cval = Number(this.data.num) - this.data.change;
      if (this.data.min != null) {
        if (cval < this.data.min) {
          console.log('低于最小值');
        } else {
          this.setData({ num: cval });
        }
      } else {
        this.setData({ num: cval });
      }
    }
  }
});