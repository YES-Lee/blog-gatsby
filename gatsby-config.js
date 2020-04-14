module.exports = {
  siteMetadata: {
    title: 'Blog',
    description: '佛性程序员',
    author: 'Johnson',
    siteUrl: 'https://johnsonlee.site'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`
      }
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
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
    'gatsby-plugin-offline',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/posts`
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        excerpt_separator: '<!-- more -->',
        plugins: [
          'gatsby-remark-reading-time',
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
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              isIconAfterHeader: true
            }
          },
          {
            resolve: 'gatsby-remark-vscode',
            // All options are optional. Defaults shown here.
            options: {
              theme: {
                default: 'Monokai'
              }, // Read on for list of included themes. Also accepts object and function forms.
              wrapperClassName: '', // Additional class put on 'pre' tag. Also accepts function to set the class dynamically.
              injectStyles: true, // Injects (minimal) additional CSS for layout and scrolling
              extensions: [], // Third-party extensions providing additional themes and languages
              languageAliases: {}, // Map of custom/unknown language codes to standard/known language codes
              replaceColor: x => x, // Function allowing replacement of a theme color with another. Useful for replacing hex colors with CSS variables.
              getLineClassName: ({ // Function allowing dynamic setting of additional class names on individual lines
                content, //   - the string content of the line
                index, //   - the zero-based index of the line within the code fence
                language, //   - the language specified for the code fence
                meta //   - any options set on the code fence alongside the language (more on this later)
              }) => '',
              logLevel: 'warn' // Set to 'info' to debug if something looks wrong
            }
          }
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        google: {
          families: [
            'Josefin Sans', // 正文字体
            'Fira Code', // 代码字体
            'Lobster', // Johnson标题字体
            'cursive', // 英文草书
            'Sarpanch' // 数字字体
          ]
        }
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
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ 'content:encoded': edge.node.html }]
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
            title: "Johnson's Feed",
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
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-page-progress',
      options: {
        includePaths: [{ regex: '^/post' }],
        height: 3,
        prependToBody: false,
        color: '#363636'
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
