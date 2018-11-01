const api = require('../../helper/apis')
const req = require('../../helper/req')

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    guessLike: [],
    page: 2,
    isListLoading: false,
    isLoadingAll: false
  },
 
  onLoad: function () {
    req.getShops({}, {
      page:1,
      rows: 10
    })
    .then(res=>{
      console.log(res, '----');
      if (res.length) {
        this.setData({
          guessLike: [...res]
        })
      }
    })
  },

  onReachBottom() {
    let { page, guessLike, isListLoading, isLoadingAll } = this.data;
    if (isListLoading || isLoadingAll) return;
    this.setData({
      isListLoading: true
    })
    req.getShops({}, {
      page,
      rows: 10
    })
    .then(res=>{
      console.log(res, '----');
      if (res.length) {
        this.setData({
          guessLike: [...guessLike, ...res],
          page: page + 1,
          isListLoading: false
        })
      }
      if (res.error) {
        this.setData({
          isListLoading: false,
          isLoadingAll: true
        })
      }
    })
  }
})
