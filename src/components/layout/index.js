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
import styles from './layout.module.scss'
import TabBar from '../tab-bar'

export default function Layout (props) {
  const { children, active, plugins, siderFixed } = props

  return (
    <>
      <Sider active={active} plugins={plugins} fixed={siderFixed} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            {children}
          </div>
        </div>
      </main>
      <TabBar className={styles.tabBar} />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}
