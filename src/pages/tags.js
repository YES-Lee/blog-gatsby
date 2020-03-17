import React from 'react'
import MainPage from '../components/main-page'
import Layout from '../components/layout'
import SEO from '../components/seo'
import styles from './tags.module.scss'
import { useStaticQuery, graphql, Link } from 'gatsby'

export default function LinkPage () {

  const MAX_COUNT = 20
  const MAX_SIZE = 3

  const { allMarkdownRemark } = useStaticQuery(graphql`
    query {
      allMarkdownRemark {
        nodes {
          frontmatter {
            tags
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
    (item.frontmatter.tags || []).forEach(tag => {
      if (counter[tag]) {
        counter[tag] = counter[tag] + 1
      } else {
        counter[tag] = 1
      }
    })
  })

  console.log(counter)

  return (
    <Layout active='/tags'>
      <SEO title="标签-Johnson" />
      <MainPage>
        <article className={styles.tagsPage}>
          <h1 className={styles.pageTitle}>
            目前共计35个标签
          </h1>
          <section className={styles.tagsPanel}>
            {
              Object.keys(counter).map((tag, i) => (
                <Link
                  to={`/tags/${tag}`}
                  key={i}
                  count={counter[tag]}
                  className={styles.item}
                  style={{
                    fontSize: `${calcSize(counter[tag])}rem`
                  }}
                ># {tag}</Link>
              ))
            }
          </section>
        </article>
      </MainPage>
    </Layout>
  )
}
