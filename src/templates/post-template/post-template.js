import React from 'react'
import { graphql, Link } from 'gatsby'
import Img from 'gatsby-image'
import { Calendar, Folder } from 'react-feather'
import PostFooter from '../../components/post-footer'
import SEO from '../../components/seo'
import Layout from '../../components/layout'
import Card from '../../components/card/card'
import scrollTo from 'gatsby-plugin-smoothscroll'
import { postHtmlFilter } from '../../lib/utils'

import styles from './post-template.module.scss'

export default function PostTemplate (props) {

  const { data: { post }, pageContext } = props

  const handleClickTitle = e => {
    e.preventDefault()
    if (e.target.hash) {
      scrollTo(decodeURIComponent(e.target.hash))
    }
  }

  return (
    <Layout
      siderFixed={false}
      plugins={[
        <Card key='toc' className={styles.toc}>
          <div dangerouslySetInnerHTML={{ __html: post.tableOfContents }} onClick={handleClickTitle}></div>
        </Card>
      ]}
    >
      <SEO
        title={`${post.frontmatter.title}-Johnson`}
        description={post.plainExcerpt}
        meta={[
          {
            name: 'keywords',
            content: (post.frontmatter.tags || []).concat(post.frontmatter.categories || []).join(',')
          }
        ]}
      />
      <Card>
        {
          post.frontmatter.thumbnail ? (
            <header className={styles.headerWidthCover}>
              <Img className={styles.cover} fluid={post.frontmatter.thumbnail.childImageSharp.fluid} />
              <div className={`${styles.infoPanel}`}>
                <div className={styles.meta}>
                  <span className={styles.item}>
                    <Calendar size={14} /> {post.frontmatter.date}
                  </span>
                  {
                    post.frontmatter.categories.map(c => (
                      <Link key={c} to={`/categories/${c}`}>
                        <span className={styles.item}>
                          <Folder size={14} /> {c}
                        </span>
                      </Link>
                    ))
                  }
                </div>
                <div className={styles.line}></div>
                <div className={styles.title}>{post.frontmatter.title}</div>
              </div>
            </header>
          ) : (
            <header className={styles.header}>
              <div className={styles.title}>{post.frontmatter.title}</div>
              <div className={styles.meta}>
                <span className={styles.item}>
                  <Calendar size={14} /> {post.frontmatter.date}
                </span>
                {
                  post.frontmatter.categories.map(c => (
                    <Link key={c} to={`/categories/${c}`}>
                      <span className={styles.item}>
                        <Folder size={14} /> {c}
                      </span>
                    </Link>
                  ))
                }
              </div>
            </header>
          )
        }
        <article dangerouslySetInnerHTML={{ __html: postHtmlFilter(post.html) }} className={`${styles.content} markdown__body`}></article>
        <PostFooter
          tags={post.frontmatter.tags}
          prev={pageContext.prev}
          next={pageContext.next}
        />
      </Card>
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
      plainExcerpt: excerpt
      tableOfContents(absolute: false, maxDepth: 3)
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
