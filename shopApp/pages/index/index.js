//index.js
//获取应用实例
const app = getApp()

import { ip } from '../ip.js'

Page({
  data: {
    checked: '',
    head: ['鞋包', '超市', '女装', '母婴', '今日惊喜', '美妆', '男装', '运动'],
    shopitem: '鞋包',
    imgUrl: ['banner1.png', 'banner2.png'],
    imgArr1: [
      { img: 'chaoshi.jpg', id: '1', name: '超市' },
      { img: 'fuzhuang.jpg', id: '2', name: '女装' },
      { img: 'jingxi.jpg', id: '3', name: '今日惊喜' },
      { img: 'meizhuang.jpg', id: '4', name: '美妆' }],
    imgArr2: [
      { img: 'muying.jpg', id: '1', name: '母婴' },
      { img: 'nanzhuang.jpg', id: '2', name: '男装' },
      { img: 'xiebao.jpg', id: '3', name: '鞋包' },
      { img: 'yundong.jpg', id: '4', name: '运动' }],
    ip
  },

  //二级标题被选中变色
  checkItem: function (e) {
    var classify = e.currentTarget.dataset.classify; //选中标签时的文本值
    this.setData({
      shopitem: classify,
    })

  },
  //用户点击搜索框
  searchInput(e) {
    wx.navigateTo({
      url: "../search/search",
    })
  },
  
  // 点击宫格跳转
  chooseType(e) {
    app.globalData.cate_id = e.target.dataset.name;
    wx.switchTab({
      url: `../classify/classify`,
      //重新加载页面
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }

    })
  }
})



