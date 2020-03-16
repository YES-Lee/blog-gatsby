/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'
import Sider from '../sider'

const Layout = ({ children, active }) => {
  return (
    <div className={styles.layout}>
      <Sider active={active} />
      <div className={styles.mainContainer}>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
