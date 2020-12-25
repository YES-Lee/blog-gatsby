/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

const PAGE_SIZE = 6

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode, basePath: 'src/posts' })
    createNodeField({
      node,
      name: 'slug',
      value: `/post/${slug.split('/')[1]}/`,
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
  const tagsTemplate = path.resolve('src/templates/tags-template/tags-template.js')

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
          excerpt
          frontmatter {
            title
            date
            categories
            tags
            keywords
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

  let hasError = false
  for (let i = 0; i < result.data.allMarkdownRemark.nodes.length; i++) {
    if (!result.data.allMarkdownRemark.nodes[i].excerpt || !result.data.allMarkdownRemark.nodes[i].frontmatter.keywords || !result.data.allMarkdownRemark.nodes[i].frontmatter.keywords.length) {
      reporter.panicOnBuild(`文章${result.data.allMarkdownRemark.nodes[i].frontmatter.title}没有关键词或摘要`)
      hasError = true
    }
  }
  if (hasError) {
    process.exit(1)
  }

  const totalPage = Math.ceil(result.data.allMarkdownRemark.totalCount / PAGE_SIZE)

  // 生成文章列表页面
  for (let p = 0; p < totalPage; p++) {
    createPage({
      path: p === 0 ? '/' : '/' + p + '/',
      component: postListTemplate,
      context: {
        currentPage: p,
        totalPage,
        limit: PAGE_SIZE,
        skip: p * PAGE_SIZE
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
      path: `/archives/${i === 0 ? '' : i + '/'}`,
      component: archivesTemplate,
      context: {
        archives,
        totalPage: totalArchivePage,
        currentPage: i
      }
    })
  }

  /**
   * 生成分类、标签页面
   */
  const categories = {}
  const tags = {}
  result.data.allMarkdownRemark.nodes.forEach(item => {
    const categoryList = item.frontmatter.categories || []
    categoryList.forEach(c => {
      if (!categories[c]) {
        categories[c] = []
      }
      categories[c].push({
        date: item.frontmatter.date,
        title: item.frontmatter.title,
        link: item.fields.slug
      })
    })
    const tagList = item.frontmatter.tags || []
    tagList.forEach(t => {
      if (!tags[t]) {
        tags[t] = []
      }
      tags[t].push({
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
        path: `/categories/${k}/${i === 0 ? '' : i + '/'}`,
        component: categoriesTemplate,
        context: {
          title: k,
          categories: Object.keys(categories).map(ck => ({
            title: ck,
            count: categories[ck].length
          })),
          totalPage: totalCatePage,
          currentPage: i,
          currentList: categories[k].slice(i * 10, (i + 1) * 10)
        }
      })
    }
  })
  Object.keys(tags).forEach(k => {
    const tag = tags[k]
    const totalCatePage = Math.ceil(tag.length / 10)
    for (let i = 0; i < totalCatePage; i++) {
      createPage({
        path: `/tags/${k}/${i === 0 ? '' : i + '/'}`,
        component: tagsTemplate,
        context: {
          title: k,
          totalPage: totalCatePage,
          currentPage: i,
          currentList: tags[k].slice(i * 10, (i + 1) * 10)
        }
      })
    }
  })
}
