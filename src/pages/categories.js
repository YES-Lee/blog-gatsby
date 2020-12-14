import React from 'react'
import SEO from '../components/seo'
import { useStaticQuery, graphql, Link } from 'gatsby'
import Layout from '../components/layout'

import styles from './categories.module.scss'

export default function LinkPage () {

  const MAX_COUNT = 20
  const MAX_SIZE = 3

  const { allMarkdownRemark } = useStaticQuery(graphql`
    query {
      allMarkdownRemark {
        nodes {
          frontmatter {
            categories
          }
        }
      }
    }
  `)

  const calcSize = count => {
    const s = (count / MAX_COUNT) + 1
    return s > MAX_SIZE ? MAX_SIZE : s
  }

  const counter = {}

  allMarkdownRemark.nodes.forEach(item => {
    (item.frontmatter.categories || []).forEach(cat => {
      if (counter[cat]) {
        counter[cat] = counter[cat] + 1
      } else {
        counter[cat] = 1
      }
    })
  })

  return (
    <Layout active='/categories'>
      <SEO
        title="分类-Johnson"
        meta={[
          {
            name: 'keywords',
            content: Object.keys(counter).join(',')
          }
        ]}
      />
      <div>
        <article className={styles.categoriesPage}>
          <section className={styles.categoriesPanel}>
            {
              Object.keys(counter).map((cat, i) => (
                <Link
                  to={`/categories/${cat}`}
                  key={i}
                  count={counter[cat]}
                  className={styles.item}
                  style={{
                    fontSize: `${calcSize(counter[cat])}rem`
                  }}
                ># {cat}</Link>
              ))
            }
          </section>
        </article>
      </div>
    </Layout>
  )
}
