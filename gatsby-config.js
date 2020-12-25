const path = require('path')

module.exports = {
  siteMetadata: {
    title: process.env.NODE_ENV === 'development' ? 'Johnson的博客(开发)' : 'Johnson的博客',
    description: '喜欢折腾，喜欢技术，不想成为咸鱼的前端程序员',
    author: 'Johnson',
    siteUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8000/' : 'https://johnsonlee.site/'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: path.resolve(__dirname, './src/images')
      }
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-fastclick',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Johnson Blog',
        short_name: 'Johnson',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        display: 'standalone',
        icon: 'static/favicons/icon.png' // This path is relative to the root of the site.
      }
    },
    'gatsby-plugin-offline', // service worker
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: path.resolve(__dirname, './source/posts')
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: process.env.NODE_ENV === 'development' ? path.resolve(__dirname, './source/drafts') : path.resolve(__dirname, './source/posts')
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        excerpt_separator: '<!-- more -->',
        plugins: [
          'gatsby-remark-reading-time',
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              isIconAfterHeader: true
            }
          },
          {
            resolve: 'gatsby-remark-katex', // 公式
            options: {
              // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
              strict: 'ignore'
            }
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 1920,
              linkImagesToOriginal: false
            }
          },
          {
            resolve: 'gatsby-remark-images-medium-zoom'
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: '>',
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: true,
              languageExtensions: [
                {
                  language: 'superscript',
                  extend: 'javascript',
                  definition: {
                    superscript_types: /(SuperType)/
                  },
                  insertBefore: {
                    function: {
                      superscript_keywords: /(superif|superelse)/
                    }
                  }
                }
              ],
              // Customize the prompt used in shell output
              // Values below are default
              prompt: {
                user: 'root',
                host: 'localhost',
                global: false
              },
              // By default the HTML entities <>&'" are escaped.
              // Add additional HTML escapes by providing a mapping
              // of HTML entities and their escape value IE: { '}': '&#123;' }
              escapeEntities: {}
            }
          }
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
            {
              site {
                siteMetadata {
                  title
                  description
                  siteUrl
                  site_url: siteUrl
                }
              }
            }
          `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug
                  // custom_elements: [{ 'content:encoded': edge.node.html }]
                })
              })
            },
            query: `
                {
                  allMarkdownRemark(
                    sort: { order: DESC, fields: [frontmatter___date] },
                  ) {
                    edges {
                      node {
                        excerpt
                        html
                        fields { slug }
                        frontmatter {
                          title
                          date
                        }
                      }
                    }
                  }
                }
              `,
            output: '/rss.xml',
            title: 'Johnson的博客',
            // optional configuration to insert feed reference in pages:
            // if `string` is used, it will be used to create RegExp and then test if pathname of
            // current page satisfied this regular expression;
            // if not provided or `undefined`, all pages will have feed reference inserted
            match: '^/post/',
            // optional configuration to specify external rss feed, such as feedburner
            link: 'https://feeds.feedburner.com/gatsby/blog'
          }
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        exclude: [
          '/categories/',
          '/categories/*',
          '/archives/',
          '/archives/*',
          '/tags/',
          '/tags/*',
          '/search/',
          '/search/*',
          '/about/'
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-urls',
      options: {
        domain: 'https://johnsonlee.site/'
      }
    },
    'gatsby-plugin-smoothscroll'
  ]
}
