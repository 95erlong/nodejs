const fs = require('fs')

exports.getAllAlbums = (callback) => {
  fs.readdir('./uploads', (err, files) => {
    if (err) {
      callback('没有找到uploads文件', null)
    }
    let allAlbums = [];

    (function iterator(i) {
      if (i == files.length) {
        // 遍历结束
        callback(null, allAlbums)
        return
      }
      fs.stat('./uploads/' + files[i], (err, stats) => {
        if (err) {
          callback('找不到文件'+ files[i], null);
          return
        }
        if (stats.isDirectory()) {
          allAlbums.push(files[i])
        }
        iterator(i + 1);
      })
    })(0)
  })
}

exports.getAllImagesByAlbumName = (albumName, callback) => {
  fs.readdir('./uploads/' + albumName, (err, files) => {
    if (err) {
      callback('没有找到upload文件', null)
      return
    }
    let allImages = [];
    (function iterator(i) {
      if (i === files.length) {
        callback(null, allImages)
        return
      }
      fs.stat('./uploads/' + albumName + '/' + files[i], (err, stats) => {
        if (err) {
          callback('找不到文件' + files[i], null)
          return
        }
        if (stats.isFile()) {
          allImages.push(files[i])
        }
        iterator(i + 1)
      })
    })(0)
  })
}