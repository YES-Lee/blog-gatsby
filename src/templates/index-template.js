import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'
import { graphql } from 'gatsby'
import PostCard from '../components/post-card'
import Pagination from '../components/pagination'

const IndexPage = (props) => {

  const { data: { postList }, pageContext: { currentPage, totalPage } } = props

  return (
    <Layout
      active={currentPage === 0 ? '/' : ''}
    >
      <SEO title="Johnson" />
      {
        (postList.rows || []).map(post => (
          <PostCard
            key={post.id}
            url={post.fields.slug}
            title={post.frontmatter.title}
            excerpt={post.excerpt}
            thumbnail={post.frontmatter.thumbnail ? post.frontmatter.thumbnail.childImageSharp.fluid : ''}
            date={post.frontmatter.date}
          />
        ))
      }
      <div style={{ marginBottom: '2rem' }}>
        <Pagination current={currentPage} total={totalPage} renderPath={i => i === 0 ? '/' : `/${i}`} />
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query homePostList ($limit: Int!, $skip: Int!) {
    postList: allMarkdownRemark(limit: $limit, skip: $skip, sort: {fields: [frontmatter___date], order: [DESC]}) {
      count: totalCount
      rows: nodes {
        id
        excerpt
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "YYYY年MM月DD日")
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
