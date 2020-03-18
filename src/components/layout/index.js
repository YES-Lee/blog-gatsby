/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import PropTypes from 'prop-types'
import Sider from '../sider'
import { Link } from 'gatsby'
import styles from './sider.module.scss'

export default function Layout (props) {
  const { children, active } = props
  return (
    <div className={styles.layout}>
      <Sider active={active} />
      <main className={styles.main}>
        {children}
        <footer className={styles.footer}>
          <div className={styles.copyright}>
            <span>©️{ new Date().getFullYear() }</span>
            ❤️
            <Link to='/' className={styles.author}>Johnson</Link>
          </div>
          <p className={styles.beian}>
            <a href='http://www.beian.miit.gov.cn/' target='_blank' rel="noopener noreferrer">
              滇ICP备16003902号
            </a>
          </p>
        </footer>
      </main>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}
