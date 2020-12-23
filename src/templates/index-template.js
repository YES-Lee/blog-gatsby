import React from 'react'

import SEO from '../components/seo'
import { graphql } from 'gatsby'
import PostCard from '../components/post-card'
import Layout from '../components/layout'
import Pagination from '../components/pagination'

import styles from './index.module.scss'
import LinkCard from '../components/link-card'

const IndexPage = (props) => {

  const { data: { postList }, pageContext: { currentPage, totalPage } } = props

  return (
    <Layout
      active={currentPage === 0 ? '/' : ''}
      plugins={[
        <LinkCard key='links' />
      ]}
    >
      <SEO
        title="欢迎访问"
        meta={[
          {
            name: 'keywords',
            content: '前端,程序员,Johnson,技术,计算机,IT,信息技术'
          }
        ]}
      />
      {
        (postList.rows || []).map(post => (
          <PostCard
            key={post.id}
            url={post.fields.slug}
            title={post.frontmatter.title}
            excerpt={post.excerpt}
            thumbnail={post.frontmatter.thumbnail ? post.frontmatter.thumbnail.childImageSharp.fluid : ''}
            date={post.frontmatter.date}
            timeToRead={post.timeToRead}
          />
        ))
      }
      <Pagination className={styles.pager} current={currentPage} total={totalPage} renderPath={i => i === 0 ? '/' : `/${i}`} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query homePostList ($limit: Int!, $skip: Int!) {
    postList: allMarkdownRemark(limit: $limit, skip: $skip, sort: {fields: [frontmatter___date], order: [DESC]}) {
      count: totalCount
      rows: nodes {
        timeToRead
        id
        excerpt
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "ll")
          thumbnail {
            childImageSharp {
              fluid(maxWidth: 660) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`

export default IndexPage
