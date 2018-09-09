import { ip } from '../ip.js'
Page({
  data: {
    islogin: false,
    uname:'',
    head:'',
    ip
  },
  onLoad: function () {
    wx.getStorage({//获取本地存储的值
      key: "checkLogin",
      success: (res) => {
        this.setData({ islogin: res.data.status, uname: res.data.uname, head: res.data.head})
      }
    })

  },
  login(){
    wx.navigateTo({
      url: '../login/login',
    })
  },

  
})