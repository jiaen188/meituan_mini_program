const api = require('../../helper/apis')
const req = require('../../helper/req')

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
  },
 
  onLoad: function () {
    req.getShops({}, {
      page:1,
      rows: 10
    })
    .then(res=>{
      console.log(res, '----');
    })
  }
})
