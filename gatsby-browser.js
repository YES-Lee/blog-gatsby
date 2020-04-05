/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import 'prismjs/themes/prism-solarizedlight.css'
// import 'prismjs/themes/prism-solarizedlight.css'
import 'prismjs/themes/prism.css'
import './src/styles/global.scss'

export function onRouteUpdate () {
  // const bp = document.createElement('script')
  // bp.id = 'baidu-push'
  // const curProtocol = window.location.protocol.split(':')[0]
  // if (curProtocol === 'https') {
  //   bp.src = 'https://zz.bdstatic.com/linksubmit/push.js?t=' + new Date().getTime()
  // } else {
  //   bp.src = 'http://push.zhanzhang.baidu.com/push.js?t=' + new Date().getTime()
  // }
  // const old = document.getElementById('baidu-push')
  // if (old) {
  //   old.src = bp.src
  // } else {
  //   window.document.body.appendChild(bp)
  // }

  // const adsense = document.createElement('script')
  // adsense.id = 'adsense'
  // adsense.async = true
  // adsense.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?t=' + new Date().getTime()
  // adsense.setAttribute('data-ad-client', 'ca-pub-1108685461241651')

  // const oldAd = document.getElementById('adsense')
  // if (oldAd) {
  //   oldAd.src = adsense.src
  // } else {
  //   window.document.head.appendChild(adsense)
  // }
}
