import React, { useState, useEffect } from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import { Mail, Rss, GitHub, Send, Moon, Sun, Search, Play } from 'react-feather'
import Card from '../card/card'

import styles from './sider.module.scss'
import { switchTheme } from '../../lib/utils'

export default function Sider (props) {

  const { plugins, fixed = true } = props
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const themes = ['light', 'dark']
    let localTheme = window.localStorage.getItem('__JOHNSON__THEME__')
    localTheme = themes.includes(localTheme) ? localTheme : 'light'
    setTheme(localTheme)
  }, [])

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

  useEffect(() => {
    switchTheme(theme)
    window.localStorage.setItem('__JOHNSON__THEME__', theme)
  }, [theme])

  return <aside className={styles.sider} style={{ position: fixed ? 'fixed' : 'absolute' }}>
    <Card className={styles.profileCard}>
      <div className={styles.themeHandler}>
        {
          theme === 'dark' ? (
            <Moon onClick={() => setTheme('light')} />
          ) : (
            <Sun onClick={() => setTheme('dark')}/>
          )
        }
      </div>
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
        <li className={`${styles.tabItem} ${active === '/search' ? styles.active : ''}`}>
          <Link to='/search'>
            <div className={styles.icon}>
              <Search size='1rem' />
            </div>
            <div className={styles.title}>搜索</div>
          </Link>
        </li>
      </ul>
    </Card>
    {/* <Card className={styles.pandoraBoxCard}>
      TODO: 小功能菜单
    </Card> */}
    {
      plugins
    }
  </aside>
}
