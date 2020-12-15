import React from 'react'
import SEO from '../components/seo'
import Layout from '../components/layout'
import Card from '../components/card/card'
import styles from './about.module.scss'

export default function AboutPage () {
  return (
    <Layout active='/about'>
      <SEO title="关于-Johnson" />
      <Card className={styles.body}>
        <h1>About Me</h1>
      </Card>
    </Layout>
  )
}
