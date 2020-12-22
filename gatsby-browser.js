/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import 'prismjs/themes/prism.css'
import 'prismjs/themes/prism-okaidia.css'
import './src/styles/index.scss'
import 'katex/dist/katex.min.css'

export function onRouteUpdate () {
  // 谷歌统计
  if (window.gtag && typeof window.gtag === 'function') {
    window.gtag('config', 'UA-171547937-1')
  }
}
