var express = require('express');
var router = express.Router();
var http = require('ykt-http-client');

//去commodity集合得到商品
router.get('/get_commodityData', function (req, res) {
  http.post('http://127.0.0.1:3333/commodity/find', req.query).then((data) => {
    res.send(data)
  })
});
// ------------------------------------登录页面------------------------------------
//用户登录
router.post('/login', function (req, res) {
  http.post('http://127.0.0.1:3333/user/find', req.body).then((data) => {
  
    res.send(data)
  })
})

// ------------------------------------购物车页面------------------------------------
//点击购物车将商品的id加入user的commity的字段，更改用户购物车的数量
router.post('/addShopWare', function (req, res) {

    http.post('http://127.0.0.1:3333/user/update',req.body).then((msg) => {
      res.send(msg)
    })

 
})




module.exports = router;
