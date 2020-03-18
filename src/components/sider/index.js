import React from 'react'
import styles from './index.module.scss'
import { Link, useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import { Mail, Rss, GitHub, Send } from 'react-feather'
import Card from '../card/card'
import FLink from '../f-link'

export default function Sider (props) {

  const links = [
    {
      title: '轶哥博客',
      motto: '妄图改变世界的全栈程序员',
      avatar: 'https://data.sercretcore.cn/new_avatar.jpeg',
      link: 'https://www.wyr.me/'
    },
    {
      title: '木马tc个人博客',
      motto: '想把代码写成诗的未知名作家',
      avatar: 'http://file.wintc.top/4a79f0e2f0f4468ea76ca68fa169e673',
      link: 'http://wintc.top/'
    },
    {
      title: 'Mind Spark',
      motto: '',
      avatar: 'https://wivwiv.com/avatar.png',
      link: 'https://wivwiv.com/'
    }
  ]

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
    <Card className={styles.profileCard}>
      <div className={styles.avatarContainer}>
        <Img className={styles.avatar} imgStyle={{ borderRadius: '50%' }} fluid={avatarImage.childImageSharp.fluid} />
      </div>
      <h3 className={styles.name}>
        <Link to='/' className={styles.link}>
          Johnson
        </Link>
      </h3>
      <p className={styles.motto}>
        行到水穷处 坐看云起时
      </p>
      <div className={styles.snsList}>
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
      </div>
    </Card>
    <Card className={styles.tabsCard}>
      <ul className={styles.tabList}>
        <li className={`${styles.tabItem} ${active === '/archives' ? styles.active : ''}`}>
          <Link to='/archives'>
            <div className={styles.count}>{siderData.totalCount}</div>
            <div className={styles.title}>归档</div>
          </Link>
        </li>
        <li className={`${styles.tabItem} ${active === '/categories' ? styles.active : ''}`}>
          <Link to={`/categories/${categories[0]}`}>
            <div className={styles.count}>{categories.length}</div>
            <div className={styles.title}>分类</div>
          </Link>
        </li>
        <li className={`${styles.tabItem} ${active === '/tags' ? styles.active : ''}`}>
          <Link to='/tags'>
            <div className={styles.count}>{tags.length}</div>
            <div className={styles.title}>标签</div>
          </Link>
        </li>
      </ul>
    </Card>
    <Card className={styles.linksCard}>
      {
        links.map((item, i) => (
          <FLink data={item} key={i} className={styles.linkItem} />
        ))
      }
    </Card>
  </aside>
}
