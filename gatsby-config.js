const ALGOLIA_APP_ID = '46OB2XFJAE'
const ALGOLIA_API_KEY = '59100ca72155cd848ddabfc5ea264400'
const ALGOLIA_INDEX_NAME = 'prod_blog'

const myQuery = `{
  allMarkdownRemark {
    nodes {
      # try to find a unique id for each node
      # if this field is absent, it's going to
      # be inserted by Algolia automatically
      # and will be less simple to update etc.
      objectID: id
      frontmatter {
        title
        keywords
      }
      excerpt
      fields {
        slug
      }
      rawMarkdownBody
    }
  }
}`

const queries = [
  {
    query: myQuery,
    transformer: ({ data }) => data.allMarkdownRemark.nodes.map(node => ({
      objectID: node.objectID,
      title: node.frontmatter.title,
      slug: node.fields.slug,
      keywords: node.frontmatter.keywords,
      excerpt: node.excerpt,
      rawMarkdownBody: node.rawMarkdownBody
    })), // optional
    settings: {
      // optional, any index settings
    }
  }
]

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
    'gatsby-plugin-offline', // service worker
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/posts`
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: process.env.NODE_ENV === 'development' ? `${__dirname}/drafts` : `${__dirname}/posts`
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        excerpt_separator: '<!-- more -->',
        plugins: [
          'gatsby-remark-reading-time',
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
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              isIconAfterHeader: true
            }
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              // Class prefix for <pre> tags containing syntax highlighting;
              // defaults to 'language-' (e.g. <pre class="language-js">).
              // If your site loads Prism into the browser at runtime,
              // (e.g. for use with libraries like react-live),
              // you may use this to prevent Prism from re-processing syntax.
              // This is an uncommon use-case though;
              // If you're unsure, it's best to use the default value.
              classPrefix: 'language-',
              // This is used to allow setting a language for inline code
              // (i.e. single backticks) by creating a separator.
              // This separator is a string and will do no white-space
              // stripping.
              // A suggested value for English speakers is the non-ascii
              // character '›'.
              inlineCodeMarker: '>',
              // This lets you set up language aliases.  For example,
              // setting this to '{ sh: "bash" }' will let you use
              // the language "sh" which will highlight using the
              // bash highlighter.
              aliases: {},
              // This toggles the display of line numbers globally alongside the code.
              // To use it, add the following line in gatsby-browser.js
              // right after importing the prism color scheme:
              //  require("prismjs/plugins/line-numbers/prism-line-numbers.css")
              // Defaults to false.
              // If you wish to only show line numbers on certain code blocks,
              // leave false and use the {numberLines: true} syntax below
              showLineNumbers: false,
              // If setting this to true, the parser won't handle and highlight inline
              // code used in markdown i.e. single backtick code like `this`.
              noInlineHighlight: true,
              // This adds a new language definition to Prism or extend an already
              // existing language definition. More details on this option can be
              // found under the header "Add new language definition or extend an
              // existing language" below.
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
    },
    {
      // This plugin must be placed last in your list of plugins to ensure that it can query all the GraphQL data
      resolve: 'gatsby-plugin-algolia',
      options: {
        appId: ALGOLIA_APP_ID,
        // Careful, no not prefix this with GATSBY_, since that way users can change
        // the data in the index.
        apiKey: ALGOLIA_API_KEY,
        indexName: ALGOLIA_INDEX_NAME, // for all queries
        queries,
        chunkSize: 10000, // default: 1000
        settings: {
          // optional, any index settings
        },
        enablePartialUpdates: true, // default: false
        matchFields: ['slug', 'modified', 'rawMarkdownBody', 'excerpt', 'keywords'] // Array<String> default: ['modified']
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
