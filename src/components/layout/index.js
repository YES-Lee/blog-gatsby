/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import PropTypes from 'prop-types'
import Sider from '../sider'
import styles from './layout.module.scss'

export default function Layout (props) {
  const { children, active, plugins, siderFixed } = props

  return (
    <>
      <Sider active={active} plugins={plugins} fixed={siderFixed} />
      <div className={styles.container1}>
        <div className={styles.container2}>
          <div className={styles.container3}>
            <main className={styles.main}>
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}
