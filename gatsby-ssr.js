/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

const React = require('react')

// You can delete this file if you're not using it

exports.onRenderBody = ({
  pathname,
  setPostBodyComponents,
  setHeadComponents
}) => {
  // setHeadComponents([])
  setPostBodyComponents([
    <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js" key='bsz'></script>
  ])
}
