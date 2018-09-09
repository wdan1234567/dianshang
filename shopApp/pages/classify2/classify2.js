import { ip } from '../ip.js'
Page({

  data: {
    ip,
    wareList: [],
    top1: 'top1.png',
    bottom2: 'bottom2.png',
    price_color: '',
    zhekou_color: '',
    zhekou_top1: 'top1.png',
    zhekou_bottom2: 'bottom2.png',
    wareType: ''
  },

  //点击不同的商品类型，发送ajax请求
  getData(type) {
    wx.request({
      url: ip + '/get_commodityData',
      data: { type },
      success: (res) => {
        this.setData({ wareList: res.data });
      }
    })
  },
  onLoad: function (option) {
    console.log(option.str)
    this.getData(option.str);
    this.setData({ wareType: option.str });
    //改变标题
    wx.setNavigationBarTitle({
      title: option.str
    })
  },
  // 点击价格从高到底排序
  price_top() {
    let arr = this.data.wareList;
    arr = arr.sort(function (a, b) {
      return (b.price - 0) - (a.price - 0)
    })

    this.setData({
      top1: 'top11.png',
      bottom2: 'bottom2.png',
      price_color: 'price_color',
      zhekou_color: '',
      zhekou_top1: 'top1.png',
      zhekou_bottom2: 'bottom2.png',
      wareList: arr
    });
  },
  // 点击价格从低到高排序
  price_bottom() {
    let arr = this.data.wareList;
    arr = arr.sort(function (a, b) {
      return (a.price - 0) - (b.price - 0)
    })
    this.setData({
      top1: 'top1.png',
      bottom2: 'bottom22.png',
      price_color: 'price_color',
      wareList: arr,
      zhekou_color: '',
      zhekou_top1: 'top1.png',
      zhekou_bottom2: 'bottom2.png',
    });
  },
  //点击折扣从高到低
  zhekou_top() {
    let arr = this.data.wareList;
    arr = arr.sort(function (a, b) {
      return (b.price - 0 - b.activity_price) - (a.price - 0 - a.activity_price)
    })
    this.setData({
      top1: 'top1.png',
      bottom2: 'bottom2.png',
      price_color: '',
      wareList: arr,
      zhekou_color: 'price_color',
      zhekou_top1: 'top11.png',
      zhekou_bottom2: 'bottom2.png',
    });
  },
  //点击折扣从低到高
  zhekou_bottom() {
    let arr = this.data.wareList;
    arr = arr.sort(function (a, b) {
      return (a.price - 0 - a.activity_price) - (b.price - 0 - b.activity_price)
    })
    this.setData({
      top1: 'top1.png',
      bottom2: 'bottom2.png',
      price_color: '',
      wareList: arr,
      zhekou_color: 'price_color',
      zhekou_top1: 'top1.png',
      zhekou_bottom2: 'bottom22.png',
    });
  },
  // 点击价格或折扣
  getwareList(e) {
    console.log(e.target.id)
    if (e.target.id === 'zhekou2') {
      this.setData({
        top1: 'top1.png',
        bottom2: 'bottom2.png',
        price_color: '',
        zhekou_color: 'price_color',
        zhekou_top1: 'top1.png',
        zhekou_bottom2: 'bottom2.png',
      });
    }
    if (e.target.id === 'price') {
      this.setData({
        top1: 'top1.png',
        bottom2: 'bottom2.png',
        price_color: 'price_color',
        zhekou_color: '',
        zhekou_top1: 'top1.png',
        zhekou_bottom2: 'bottom2.png',
      });
    }
    this.getData(this.data.wareType)
  },
  inf(e) {
    console.log(e.target.id);
    wx.navigateTo({
      url: `../wareMsg/wareMsg?id=${e.target.id}`,
    })
  }

})