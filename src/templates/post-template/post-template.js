import React from 'react'
import { graphql, Link } from 'gatsby'
import Img from 'gatsby-image'
import PostFooter from '../../components/post-footer'
import SEO from '../../components/seo'
import Layout from '../../components/layout'
import Card from '../../components/card/card'
import scrollTo from 'gatsby-plugin-smoothscroll'
import { postHtmlFilter } from '../../lib/utils'

import styles from './post-template.module.scss'

export default function PostTemplate (props) {

  const { data: { post, site }, pageContext } = props

  const handleClickTitle = e => {
    e.preventDefault()
    if (e.target.hash) {
      scrollTo(decodeURIComponent(e.target.hash))
    }
  }

  return (
    <Layout
      showFab
      fabToc
      toc={
        <Card key='toc' className={styles.toc}>
          <div dangerouslySetInnerHTML={{ __html: post.tableOfContents }} onClick={handleClickTitle}></div>
        </Card>
      }
      siderFixed={false}
      // plugins={[
      //   <Card key='toc' className={styles.toc}>
      //     <div dangerouslySetInnerHTML={{ __html: post.tableOfContents }} onClick={handleClickTitle}></div>
      //   </Card>
      // ]}
    >
      <SEO
        title={`${post.frontmatter.title}`}
        description={post.plainExcerpt}
        meta={[
          {
            name: 'keywords',
            content: (post.frontmatter.keywords || []).join(',')
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
                  <span className={`${styles.item} ${styles.iconCalendar}`}>
                    {post.frontmatter.date}
                  </span>
                  <span className={`${styles.item} ${styles.iconClock}`} title={`阅读时间${post.timeToRead}分钟`}>
                    {post.timeToRead}‘
                  </span>
                  {
                    post.frontmatter.categories.map(c => (
                      <Link key={c} to={`/categories/${c}`}>
                        <span className={`${styles.item} ${styles.iconFolder}`}>
                          {c}
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
                <span className={`${styles.item} ${styles.iconCalendar}`}>
                  {post.frontmatter.date}
                </span>
                <span className={`${styles.item} ${styles.iconClock}`} title={`阅读时间${post.timeToRead}分钟`}>
                  {post.timeToRead}‘
                </span>
                {
                  post.frontmatter.categories.map(c => (
                    <Link key={c} to={`/categories/${c}`}>
                      <span className={`${styles.item} ${styles.iconFolder}`}>
                        {c}
                      </span>
                    </Link>
                  ))
                }
              </div>
            </header>
          )
        }
        <div itemScope itemType='http://schema.org/Article'>
          <article itemProp="articleBody" dangerouslySetInnerHTML={{ __html: postHtmlFilter(post.html) }} className={`${styles.content} markdown__body`}></article>
        </div>
        <PostFooter
          tags={post.frontmatter.tags}
          prev={pageContext.prev}
          next={pageContext.next}
          slug={site.siteMetadata.siteUrl + post.fields.slug}
        />
      </Card>
    </Layout>
  )
}

export const pageQuery = graphql`
  query postInfo($slug: String!){
    site {
      siteMetadata {
        siteUrl
      }
    }
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
      fields {
        slug
      }
      frontmatter {
        categories
        color
        copyright
        date(formatString: "ll")
        tags
        title
        toc
        keywords
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
