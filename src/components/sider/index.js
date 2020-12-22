import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import { Mail, Rss, GitHub, Send } from 'react-feather'
import Card from '../card/card'

import styles from './sider.module.scss'

export default function Sider (props) {

  const { plugins } = props

  const { active } = props

  const { avatarImage, siderData } = useStaticQuery(graphql`
    query {
      avatarImage: file(relativePath: { eq: "avatar.jpeg" }) {
        childImageSharp {
          fluid(maxWidth: 240) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      siderData: allMarkdownRemark {
        nodes {
          frontmatter {
            categories
            tags
            date
          }
        }
        totalCount
      }
    }
  `)

  let categories = []
  let tags = []
  siderData.nodes.forEach(item => {
    if (item.frontmatter.tags) {
      tags.push(...item.frontmatter.tags)
    }
    if (item.frontmatter.categories) {
      categories.push(...item.frontmatter.categories)
    }
  })
  categories = [...new Set(categories)]
  tags = [...new Set(tags)]

  return <aside className={styles.sider}>
    <div className={styles.container}>
      <Card className={styles.profileCard}>
        <div className={styles.avatarContainer}>
          <Img className={styles.avatar} imgStyle={{ borderRadius: '50%' }} fluid={avatarImage.childImageSharp.fluid} />
        </div>
        <h1 className={styles.name}>
          <Link to='/' className={styles.link}>
            Johnson
          </Link>
        </h1>
        <p className={styles.motto}>
          行到水穷处<br/>
          坐看云起时
        </p>
        {/* <div className={styles.snsList}>
          <a href='mailto:598465252@qq.com' target='_blank' rel="noopener noreferrer nofollow" title='598465252@qq.com' className={styles.snsItem}>
            <Mail size={20} strokeWidth={3} />
          </a>
          <a href='/rss.xml' target='_blank' rel="noopener noreferrer nofollow" className={styles.snsItem}>
            <Rss size={20} strokeWidth={3} />
          </a>
          <a href='https://github.com/YES-Lee' target='_blank' rel="noopener noreferrer nofollow" className={styles.snsItem}>
            <GitHub size={20} strokeWidth={3} />
          </a>
          <a href='https://t.me/JohnsonLe' target='_blank' rel="noopener noreferrer nofollow" className={styles.snsItem}>
            <Send size={20} strokeWidth={3} />
          </a>
        </div> */}
      </Card>
      <Card className={styles.tabsCard}>
        <Link to='/archives' className={`${styles.tabItem} ${active === '/archives' ? styles.active : ''}`}>
          <span className={styles.count}>{siderData.totalCount}</span>
          <span className={styles.title}>Archives</span>
        </Link>
        <Link to={`/categories/${categories[0]}`} className={`${styles.tabItem} ${active === '/categories' ? styles.active : ''}`}>
          <span className={styles.count}>{categories.length}</span>
          <span className={styles.title}>Categories</span>
        </Link>
        <Link to='/tags' className={`${styles.tabItem} ${active === '/tags' ? styles.active : ''}`}>
          <span className={styles.count}>{tags.length}</span>
          <span className={styles.title}>Tags</span>
        </Link>
      </Card>
      {
        plugins
      }
      <footer className={styles.footer}>
        <p className={styles.snsList}>
          <a href='mailto:598465252@qq.com' target='_blank' rel="noopener noreferrer nofollow" title='598465252@qq.com' className={`${styles.snsItem} icon-mail`}>
          </a>
          <a href='/rss.xml' target='_blank' rel="noopener noreferrer nofollow" className={`${styles.snsItem} icon-rss`}>
          </a>
          <a href='https://github.com/YES-Lee' target='_blank' rel="noopener noreferrer nofollow" className={`${styles.snsItem} icon-github`}>
          </a>
          <a href='https://t.me/JohnsonLe' target='_blank' rel="noopener noreferrer nofollow" className={`${styles.snsItem} icon-telegram`}>
          </a>
        </p>
        <p className={styles.copyright}>
          <span>©️{ new Date().getFullYear() }</span>
          ❤️
          <Link to='/' className={styles.author}>Johnson</Link>
        </p>
        <p className={styles.beian}>
          <a href='http://www.beian.miit.gov.cn/' target='_blank' rel="noopener noreferrer">
            滇ICP备16003902号
          </a>
        </p>
      </footer>
    </div>
  </aside>
}
