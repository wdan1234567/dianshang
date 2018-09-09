import { ip } from '../ip.js'
Page({
  data: {
    ip,
    islogin: false,
    wareList: [], //购物车
    'checkAll': false,
    'totalCount': 0,
    'totalPrice': 0,
    userId: '',
    isdel: '',
    userMsg: {},//此用户所有的信息
    commodity: ['1'], //商品的id
    checkWare: [], //s所有选中商品的id
  },
  // 当用户点击添加或减少商品，发送ajax更改用户数据此条商品的数量
  changeWareNum(_id, shopping_cart, commodity) {
    let obj = {
      _id,
      shopping_cart
    }
    if (commodity) {
      obj.commodity = commodity
    }

    wx.request({
      url: ip + '/addShopWare',
      method: 'post',
      data: { _id, shopping_cart, commodity },//传递用户的id，更改对应商品的数量
      success: (res) => {
       
      }

    })

  },
  onLoad: function () {
    wx.getStorage({//获取本地缓存
      key: "checkLogin",
      success: (res) => {
        this.setData({
          islogin: res.data.status,
          userId: res.data._id
        })
      }
    })

  },
  //如果用户没有登录，点击跳转到登录页面
  login() {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  onShow: function (options) {
    wx.getStorage({//获取本地缓存
      key: "checkLogin",
      success: (res) => {
    
        this.setData({
          islogin: res.data.status,
          userId: res.data._id
        })

        if (res.data.status) {
          //发送请求获取用户所有的数据
          wx.request({
            url: ip + '/login',
            method: 'post',
            data: { _id: res.data._id },
            success: (msg) => {
          
              this.setData({
                userMsg: msg.data,
                wareList: msg.data.shopping_cart, //购物车
                commodity: msg.data.commodity   //商品的id
              })
            }
          })
        }

      }
    })


  },

  // -----------------------计算商品总数-----------------------

  calculateTotal: function () {
    var wareList = this.data.wareList;
    var totalCount = 0;
    var totalPrice = 0;
    for (var i = 0; i < wareList.length; i++) {
      var good = wareList[i];
      if (good.singleSlect) {
        totalCount += good.num;
        totalPrice += good.num * good.price;
      }
    }
    totalPrice = totalPrice.toFixed(2);
    this.setData({
      'totalCount': totalCount,
      'totalPrice': totalPrice
    })
  },

  //------------------ 用户点击商品减1------------------
  subtracttap: function (e) {
    var dataId = e.target.dataset.id;
    var wareList = this.data.wareList;
    for (let i = 0; i < wareList.length; i++) {
      if (wareList[i].goods_id == dataId && wareList[i].num > 1) {
        wareList[i].num--;
        break
      }
    }
    this.setData({
      'wareList': wareList
    });
 
    this.calculateTotal();
    this.changeWareNum(this.data.userId, wareList)

  },

  //------------------ 用户点击商品加1------------------
  addtap: function (e) {
    var dataId = e.target.dataset.id;
    var wareList = this.data.wareList;
    for (let i = 0; i < wareList.length; i++) {
      if (wareList[i].goods_id == dataId) {
        wareList[i].num++;
        break
      }
    }
    this.setData({
      'wareList': wareList
    });
  
    this.calculateTotal();
    this.changeWareNum(this.data.userId, wareList)
  },
  //------------------ 用户选择删除购物车商品------------------ 
  delWare(e) {
    var wareList = this.data.wareList;
    var dataId = e.target.dataset.id;

    wx.showModal({
      title: '提示',
      content: '是否确认删除',
      confirmColor: '#ff69b4',
      success: (res) => {
        if (res.confirm) {
          this.setData({ isdel: dataId }) //点击删除时删除按钮变色
          wareList = wareList.filter(item => {
            return item.goods_id !== dataId
          })
          this.setData({
            'wareList': wareList
          });
          let commodity = this.data.commodity; //用户购物车所有的商品id
          for (let i = 0; i < commodity.length; i++) {
            if (commodity[i] == dataId) {
              commodity.splice(i, 1)
              this.setData({
                commodity,
              })
            }
          }
          this.calculateTotal();
          this.changeWareNum(this.data.userId, wareList, commodity) //删除user字段中


        }
      }
    })

  },

  //------------------ 用户选择购物车商品------------------ 

  checkboxChange: function (e) {
    this.setData({ checkWare: e.detail.value })
  
    var checkboxItems = this.data.wareList;

    var values = e.detail.value;
    for (var i = 0; i < checkboxItems.length; ++i) {
      checkboxItems[i].singleSlect = false;
      for (var j = 0; j < values.length; ++j) {
        if (checkboxItems[i].goods_id == values[j]) {
          checkboxItems[i].singleSlect = true;
          break;
        }
      }
    }

    var checkAll = false;
    if (checkboxItems.length == values.length) {
      checkAll = true;
    }

    this.setData({
      'wareList': checkboxItems,
      'checkAll': checkAll
    });
    this.calculateTotal();
  },

  //-------------------------用户点击全选----------------------------
  selectalltap: function (e) {
  
    var value = e.detail.value;
    var checkAll = false;
    if (value && value[0]) {
      checkAll = true;
      this.setData({ checkWare: this.data.commodity }) //点击全选
    }
    //点击全选把所有的商品都勾选上
    var wareList = this.data.wareList;
    for (var i = 0; i < wareList.length; i++) {
      var good = wareList[i];
      good['singleSlect'] = checkAll;
    }

    this.setData({
      'checkAll': checkAll,
      'wareList': wareList
    });
    this.calculateTotal();
  },
  // 点击结算
  pay() {
    //所有选中商品的id ----------------------this.data.checkWare
    let arr = [];
    for (let i = 0; i < this.data.wareList.length; i++) {
      for (let j = 0; j < this.data.checkWare.length; j++) {
        if (this.data.wareList[i].goods_id === this.data.checkWare[j]) {
          arr = [...arr, { wareId: this.data.checkWare[j], content: this.data.wareList[i] }]
        }
      }
    }
    if (arr.length !== 0) {
      //将此条商品从本页面删除，同时加入到user集合中的order中
      var wareList = this.data.wareList;
      let commodity = this.data.commodity; //用户购物车所有的商品id
      for (let i = 0; i < wareList.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (wareList[i].goods_id === arr[j].wareId) {
            wareList.splice(i,1);
            i--;
          }
        }
      }
  //为更改user中的商品字段和购物车字段内容，
      for (let i = 0; i < commodity.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (commodity[i] === arr[j].wareId) {
            commodity.splice(i, 1);
            i--;
          }
        }
      }
      this.setData({
        wareList,
        commodity
      })
      //发送请求修改数据库中的数据
      wx.request({
        url: ip + '/addShopWare',
        method: 'post',
        data: { _id: this.data.userId, shopping_cart: wareList,  commodity },//传递用户的id，更改对应商品的数量
        success: (res) => {
        }
      })
      //跳转到支付页面
      arr = JSON.stringify(arr)
      wx.navigateTo({
        url: `../pay/pay?value=${arr}`,
      })

      // 用户购物车所有的商品id
    } else {
      wx.showModal({
        title: '提示',
        content: '请先选择一件商品',
        confirmColor: '#ff69b4',
        success: (res) => {

        }
      })
    }


  }


})























