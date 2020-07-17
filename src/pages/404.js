import React from 'react'

import SEO from '../components/seo'
import Layout from '../components/layout'
import AdSense from '../components/adsense'

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    <AdSense
      style={{ display: 'block', textAlign: 'center' }}
      data-ad-layout="in-article"
      data-ad-format="fluid"
      data-ad-client="ca-pub-1108685461241651"
      data-ad-slot="2625182891"
    />
  </Layout>
)

export default NotFoundPage
