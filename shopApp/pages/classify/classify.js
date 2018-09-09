import { ip } from '../ip.js'
var app = getApp()
Page({
  data: {
    head: ['鞋包', '超市', '女装', '母婴', '今日惊喜', '美妆', '男装', '运动'],
    shopitem: '鞋包',
    firstItem:'鞋包',
    ip,
    wareList: [] //商品
  },
  //点击搜获框跳转到搜索页面
  searchInput() {
    wx.navigateTo({
      url: "../search/search",
    })
  },
  //标题选中跳转到相应的页面
  checkItem(e) {
    this.setData({ shopitem: e.target.id })
    this.getData(e.target.id)
  },
  onLoad: function (option) {
    //请求数据,默认请求第一个类型---鞋包
    var cate_id = app.globalData.cate_id;
    this.setData({ shopitem: cate_id })
    this.getData(cate_id);
  
  },
  //点击不同的商品类型，发送ajax请求
  getData(type) {
    wx.request({
      url: ip + '/get_commodityData', 
      data: { type },
      success: (res) => {
        this.setData({ wareList: res.data });
        app.globalData.cate_id = ""
      }
    })
  },
  //点击不同的类型，跳转到这种类型的页面--classify2
  findType(e){
    wx.navigateTo({
      url: `../classify2/classify2?str=${e.target.dataset.item.type}`,
    })

  }




})
