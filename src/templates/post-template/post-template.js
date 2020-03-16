import React from 'react'
import { graphql } from 'gatsby'
import styles from './post-template.module.scss'
import Img from 'gatsby-image'
import { Calendar, Folder } from 'react-feather'
import PostFooter from '../../components/post-footer'
import MainPage from '../../components/main-page'
import Layout from '../../components/layout'
import SEO from '../../components/seo'

export default function PostTemplate (props) {

  const { data: { post }, pageContext } = props

  return (
    <Layout>
      <SEO title={`${post.frontmatter.title}-Johnson`} />
      <MainPage>
        <header className={styles.header}>
          <Img className={styles.cover} fluid={post.frontmatter.thumbnail.childImageSharp.fluid} />
          <div className={styles.infoPanel}>
            <div className={styles.meta}>
              <span className={styles.item}>
                <Calendar size={14} /> {post.frontmatter.date}
              </span>
              {
                post.frontmatter.categories.map(c => (
                  <span className={styles.item} key={c}>
                    <Folder size={14} /> {c}
                  </span>
                ))
              }
            </div>
            <div className={styles.line}></div>
            <div className={styles.title}>{post.frontmatter.title}</div>
          </div>
        </header>
        <article dangerouslySetInnerHTML={{ __html: post.html }} className={`${styles.content} markdown__body`}></article>
        <PostFooter
          tags={post.frontmatter.tags}
          prev={pageContext.prev}
          next={pageContext.next}
        />
      </MainPage>
    </Layout>
  )
}

export const pageQuery = graphql`
  query postInfo($slug: String!){
    post: markdownRemark(fields: {slug: {eq: $slug}}) {
      timeToRead
      id
      html
      excerpt(format: HTML)
      tableOfContents(absolute: false)
      wordCount {
        words
      }
      frontmatter {
        categories
        color
        copyright
        date(formatString: "YYYY-MM-DD")
        tags
        title
        toc
        thumbnail {
          childImageSharp {
            fluid(maxWidth: 1920) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
