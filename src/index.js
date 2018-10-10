// //////////////////////////////////////////////////////////////////////////////
//
//  Copyright (C) 2016-present  All Rights Reserved.
//  Licensed under the Apache License, Version 2.0 (the "License");
//  http://www.apache.org/licenses/LICENSE-2.0
//
//  Github Home: https://github.com/AlexWang1987
//  Author: AlexWang
//  Date: 2017-03-17 11:13:14
//  QQ Email: 1669499355@qq.com
//  Last Modified time: 2017-09-20 11:36:39
//  Description: wbp-init-umd-main
//
// //////////////////////////////////////////////////////////////////////////////
function mresolver(m_url) {
  return new Promise(function(res, rej) {
    const mount_target = (document.getElementsByTagName('head') || document.getElementsByTagName('head'))[0]
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.charset = 'utf-8'
    script.async = true
    script.src = m_url
    script.timeout = 8000
    let timer = 0
    const clear = function() {
      clearTimeout(timer)
      script.onload = null
      script.onerror = null
      mount_target.removeChild(script)
    }
    script.onload = function() {
      clear()
      res()
    }
    script.onerror = function() {
      clear()
      rej(new Error(`${m_url} module got fatal error.`))
    }
    timer = setTimeout(clear, 8000)
    mount_target.appendChild(script)
  })
}

module.exports = function(repo_url) {
  return function(m_id) {
    let m_verson = 'latest'
    const is_version_provided = /\/(\d+\.\d+\.\d+$)/.test(m_id)
    if (is_version_provided) {
      const id_version = m_id.split('/')
      m_id = id_version[0]
      m_verson = id_version[1]
    }
    return mresolver(`${repo_url}/${m_id}/${m_verson}/index.js`).then(() => {
      const mod = window[m_id]

      if(mod && mod.__esModule)
        return mod.default

      return mod
    })
  }
}
