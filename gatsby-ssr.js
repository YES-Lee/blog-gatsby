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
  setHeadComponents([
    <script key='GOOGLE_GTAG' async src="https://www.googletagmanager.com/gtag/js?id=UA-171547937-1"></script>,
    <script key='GOOGLE_ANALYTICS' dangerouslySetInnerHTML={{
      __html: `
        <!-- Global site tag (gtag.js) - Google Analytics -->
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      
        gtag('config', 'UA-171547937-1');
      `
    }}/>,
    <script key='BAIDU_STATISTIC_SPA_TRACER' dangerouslySetInnerHTML={{
      __html: `
        var _hmt = _hmt || [];
        _hmt.push(['_requirePlugin', 'UrlChangeTracker', {
          shouldTrackUrlChange: function (newPath, oldPath) {
          return newPath && oldPath;
          }}
        ]);
      `
    }}/>,
    <script key='BAIDU_STATISTIC' dangerouslySetInnerHTML={{
      __html: `
        var _hmt = _hmt || [];
        (function() {
          const hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?3872d781f970a63603d95f9f88a6497e";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();
      `
    }} />
  ])
  setPostBodyComponents([
    <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js" key='bsz'></script>
  ])
}
