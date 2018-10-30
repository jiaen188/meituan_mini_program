const api = require('../../helper/apis')

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
  },
 
  onLoad: function () {
    api.request({
      url: 'https://www.koocv.com/article/shoplist?page=1&rows=10',
      methods: 'POST'
    })
    .then(res => {
      console.log(res)
    })
  }
})
