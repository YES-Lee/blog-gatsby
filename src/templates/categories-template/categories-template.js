import React from 'react'
import Layout from '../../components/layout'
import SEO from '../../components/seo'
import styles from './categories-template.module.scss'

export default function CategoryPage () {

  return (
    <Layout active='categories'>
      <SEO title="分类-Johnson" />
      <div className={styles.categoriesPage}>
        <header className={styles.tabs}></header>
        <article className={styles.main}></article>
      </div>
    </Layout>
  )
}
