module.exports = {
  siteMetadata: {
    title: 'Johnson的博客',
    description: '喜欢折腾，喜欢技术，不想成为咸鱼的前端程序员',
    author: 'Johnson',
    siteUrl: process.env.NODE_ENV === 'develop' ? 'http://localhost:8000/' : 'https://johnsonlee.site/'
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
    'gatsby-plugin-smoothscroll',
    {
      resolve: 'gatsby-plugin-valine',
      options: {
        appId: 'IhzszDWs5ShzipHniw3nDG6K-gzGzoHsz',
        appKey: '7wUmsu7fBEbsuhXqx3kYuKgA',
        emojiCDN: '//i0.hdslb.com/bfs/emote/',
        emojiMaps: {
          tv_doge: '6ea59c827c414b4a2955fe79e0f6fd3dcd515e24.png',
          tv_亲亲: 'a8111ad55953ef5e3be3327ef94eb4a39d535d06.png',
          tv_偷笑: 'bb690d4107620f1c15cff29509db529a73aee261.png',
          tv_再见: '180129b8ea851044ce71caf55cc8ce44bd4a4fc8.png',
          tv_冷漠: 'b9cbc755c2b3ee43be07ca13de84e5b699a3f101.png',
          tv_发怒: '34ba3cd204d5b05fec70ce08fa9fa0dd612409ff.png',
          tv_发财: '34db290afd2963723c6eb3c4560667db7253a21a.png',
          tv_可爱: '9e55fd9b500ac4b96613539f1ce2f9499e314ed9.png',
          tv_吐血: '09dd16a7aa59b77baa1155d47484409624470c77.png',
          tv_呆: 'fe1179ebaa191569b0d31cecafe7a2cd1c951c9d.png',
          tv_呕吐: '9f996894a39e282ccf5e66856af49483f81870f3.png',
          tv_困: '241ee304e44c0af029adceb294399391e4737ef2.png',
          tv_坏笑: '1f0b87f731a671079842116e0991c91c2c88645a.png',
          tv_大佬: '093c1e2c490161aca397afc45573c877cdead616.png',
          tv_大哭: '23269aeb35f99daee28dda129676f6e9ea87934f.png',
          tv_委屈: 'd04dba7b5465779e9755d2ab6f0a897b9b33bb77.png',
          tv_害羞: 'a37683fb5642fa3ddfc7f4e5525fd13e42a2bdb1.png',
          tv_尴尬: '7cfa62dafc59798a3d3fb262d421eeeff166cfa4.png',
          tv_微笑: '70dc5c7b56f93eb61bddba11e28fb1d18fddcd4c.png',
          tv_思考: '90cf159733e558137ed20aa04d09964436f618a1.png',
          tv_惊吓: '0d15c7e2ee58e935adc6a7193ee042388adc22af.png'
        }
      }
    }
    // {
    //   resolve: 'gatsby-plugin-robots-txt',
    //   options: {
    //     // host: 'https://johnsonlee.site/',
    //     sitemap: 'https://johnsonlee.site/sitemap.xml',
    //     policy: [
    //       {
    //         userAgent: 'Googlebot',
    //         disallow: ['/tags', '/archives', '/categories']
    //       },
    //       {
    //         userAgent: 'Baiduspider',
    //         disallow: ['/tags', '/archives', '/categories']
    //       },
    //       {
    //         userAgent: '*',
    //         allow: '/'
    //       }
    //     ]
    //   }
    // }
  ]
}
