/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode, basePath: 'src/posts' })
    createNodeField({
      node,
      name: 'slug',
      value: `/post/${slug.split('/')[1]}`,
      trailingSlash: false
    })
  }
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const postListTemplate = path.resolve('src/templates/index-template.js')
  const postTemplate = path.resolve('src/templates/post-template/post-template.js')
  const archivesTemplate = path.resolve('src/templates/archives-template/archives-template.js')
  const categoriesTemplate = path.resolve('src/templates/categories-template/categories-template.js')

  const result = await graphql(`
    {
      allMarkdownRemark (sort: {fields: frontmatter___date, order: DESC}) {
        edges {
          next {
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
          node {
            fields {
              slug
            }
          }
          previous {
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
        }
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
            date
            categories
            tags
          }
        }
        totalCount
      }
    }
  `)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild('Error while running GraphQL query.')
    return
  }

  const totalPage = Math.ceil(result.data.allMarkdownRemark.totalCount / 5)

  // 生成文章列表页面
  for (let p = 0; p < totalPage; p++) {
    createPage({
      path: p === 0 ? '/' : '/' + p,
      component: postListTemplate,
      context: {
        currentPage: p,
        totalPage,
        limit: 5,
        skip: p * 5
      } // additional data can be passed via context
    })
  }

  /**
   * 生成文章详情页
   */
  result.data.allMarkdownRemark.edges.forEach(item => {
    const prevAndNext = {}
    if (item.previous) {
      prevAndNext.prev = {
        title: item.previous.frontmatter.title,
        link: item.previous.fields.slug
      }
    }
    if (item.next) {
      prevAndNext.next = {
        title: item.next.frontmatter.title,
        link: item.next.fields.slug
      }
    }
    createPage({
      path: item.node.fields.slug,
      component: postTemplate,
      context: {
        slug: item.node.fields.slug,
        ...prevAndNext
      }
    })
  })

  /**
   * 生成归档页
   */
  const archivePageSize = 10
  const totalArchivePage = Math.ceil(result.data.allMarkdownRemark.totalCount / archivePageSize)
  for (let i = 0; i < totalArchivePage; i++) {
    const nodes = result.data.allMarkdownRemark.nodes.slice(archivePageSize * i, archivePageSize * (i + 1))
    const archives = {}
    nodes.forEach(item => {
      const date = new Date(item.frontmatter.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      archives[year] = archives[year] || {}
      archives[year][month] = archives[year][month] || []
      archives[year][month].push({
        date,
        link: item.fields.slug,
        title: item.frontmatter.title
      })
    })
    createPage({
      path: `/archives/${i === 0 ? '' : i}`,
      component: archivesTemplate,
      context: {
        archives,
        totalPage: totalArchivePage,
        currentPage: i
      }
    })
  }

  /**
   * 生成分类页面
   */
  const categories = {}
  result.data.allMarkdownRemark.nodes.forEach(item => {
    (item.frontmatter.categories || []).forEach(c => {
      if (!categories[c]) {
        categories[c] = []
      }
      categories[c].push({
        date: item.frontmatter.date,
        title: item.frontmatter.title,
        link: item.fields.slug
      })
    })
  })

  Object.keys(categories).forEach(k => {
    const cat = categories[k]
    const totalCatePage = Math.ceil(cat.length / 10)
    for (let i = 0; i < totalCatePage; i++) {
      createPage({
        path: `/categories/${k}/${i === 0 ? '' : i}`,
        component: categoriesTemplate,
        context: {
          title: k,
          categories,
          totalPage: totalCatePage,
          currentPage: i
        }
      })
    }
  })
}
