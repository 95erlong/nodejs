const file = require('../models/file')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const sd = require('silly-datetime')

exports.showIndex = (req, res, next) => {
  file.getAllAlbums((err, allAlabums) => {
    if (err) {
      next()
      return
    }
    res.render('index', {
      'albums': allAlabums,
    })
  })
}

// 相册页
exports.showAlbum = (req, res, next) => {
  // 遍历相册中的所有图片
  const albumName = req.params.albumName;
  file.getAllImagesByAlbumName(albumName, (err, imagesArray) => {
    if (err) {
      next()
      return
    }

    res.render('album', {
      'albumname': albumName,
      'images': imagesArray,
    })
  })
}

// 显示上传
exports.showUp = (req, res) => {
  file.getAllAlbums((err, albums) => {
    res.render('up', {
      albums: albums
    })
  })
}

// 上传表单
exports.doPost = (req, res) => {
  const form = new formidable.IncomingForm()

  form.uploadDir = path.normalize(__dirname + '/../tempup/')
  
  form.parse(req, (err, fields, files, next) => {
    // 改名
    if (err) {
      next()
      return
    }
    // 判断文件尺寸
    const size = parseInt(files.tupian.size)
    if (size > 2000000) {
      res.send('图片尺寸应该小于1M')
      fs.unlink(files.tupian.path)
      return
    }

    const ttt = sd.format(new Date(), 'YYYYMMDDHHmmss')
    const ran  = parseInt(Math.random() * 89999 + 10000)
    const extname = path.extname(files.tupian.name);

    const wenjianjia = fields.wenjianjia
    const oldpath = files.tupian.path
    const newpath = path.normalize(__dirname + '/../uploads/' + wenjianjia + '/' + ttt + ran + extname)
    fs.rename(oldpath, newpath, (err) => {
      if (err) {
        res.send('改名失败')
        return
      }
      res.send('成功')
    })
  })
  return
}