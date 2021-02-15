import React from 'react'

import SEO from '../components/seo'
import Layout from '../components/layout'
import AdSense from '../components/adsense'

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <h1
      style={{
        margin: '10rem 0 3rem',
        border: 0,
        fontSize: '10rem',
        fontFamily: 'monospace',
        textAlign: 'center',
        opacity: '.5',
      }}
    >
      (;-;)
    </h1>
    <p
      style={{
        fontSize: '1.125rem',
        opacity: '.5',
        textAlign: 'center',
      }}
    >
      Nothing here.
    </p>
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
