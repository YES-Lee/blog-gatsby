import React, { useEffect, useState } from 'react'
import { graphql, Link } from 'gatsby'
import Img from 'gatsby-image'
import { Calendar, Folder, Clock } from 'react-feather'
import PostFooter from '../../components/post-footer'
import SEO from '../../components/seo'
import Layout from '../../components/layout'
import Card from '../../components/card/card'
import scrollTo from 'gatsby-plugin-smoothscroll'
import { postHtmlFilter } from '../../lib/utils'

import styles from './post-template.module.scss'
import Valine from '../../components/valine'

export default function PostTemplate (props) {

  const { data: { post, site }, pageContext } = props
  const [path, setPath] = useState()

  const handleClickTitle = e => {
    e.preventDefault()
    if (e.target.hash) {
      scrollTo(decodeURIComponent(e.target.hash))
    }
  }

  useEffect(() => {
    console.log(site)
    setPath(window.location.pathname)
  }, [])

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
                  <span className={styles.item}>
                    <Calendar size={14} /> {post.frontmatter.date}
                  </span>
                  <span className={styles.item} title={`阅读时间${post.timeToRead}分钟`}>
                    <Clock size={14} /> {post.timeToRead}‘
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
          slug={site.siteMetadata.siteUrl + post.fields.slug}
        />
        <div className={styles.comment}>
          {/* <Valine path={path} placeholder='来一发吧～' visitor='true' avatar='robohash' /> */}
          <Valine
            path={path}
            placeholder='来一发吧～'
            visitor='true'
            avatar='robohash'
          />
        </div>
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
        date(formatString: "YYYY-MM-DD")
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
