
import { ip } from '../ip.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip,
    image: "",
    inputValue: '',
    pwd: '',
  },

  //获取输入的值
  getPhone(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  getPwd(e) {
    this.setData({
      pwd: e.detail.value
    })
  },

  //用户登录
  loginBtn() {
    wx.request({
      url: ip + '/login',
      method: 'post',
      data: { uname: this.data.inputValue, pwd: this.data.pwd, findType: "exact" },
      success: (res) => {
        console.log(res.data)
        if (res.data.length===1){
          
          wx.setStorage({//存储到本地
            key: "checkLogin",
            data: { uname: res.data[0].uname, _id: res.data[0]._id, content: res.data, status: true, head: res.data[0].head}

          })
          console.log('存储到本地')
          wx.getStorage({//存储到本地
            key: "checkLogin",
            success: function (res) {
              console.log(res)
            },

          })

          //跳转页面并强制刷新
          wx.switchTab({
            url: '../my/my',
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            } 
          })
        
         
        }
     
      }
    })
  },

  


  // btn_sub: function (res) {
  //   // 声明一个变量接收用户授权信息
  //   var userinfos = res.detail.userInfo;
  //   // 判断是否授权  true 替换微信用户头像
  //   if (userinfos != undefined) {

  //     this.setData({
  //       image: userinfos.avatarUrl
  //     })
  //   } else {
  //     // false 默认头像
  //     this.setData({
  //       image: ""
  //     })
  //   }
  // }
  // ,

})

