/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Sider from '../sider'
import * as styles from './layout.module.scss'
import Fab from '../fab/fab'
import Toc from '../toc/toc'

export default function Layout(props) {
  const pageRef = useRef()
  const { children, active, plugins, siderFixed, showFab, fabToc, toc } = props
  const [progress, setProgress] = useState(0)
  const [tocVisible, setTocVisible] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [siderVisible, setSiderVisible] = useState(false)

  const handleScroll = useCallback($e => {
    let scale =
      $e.target.scrollTop / ($e.target.scrollHeight - $e.target.offsetHeight)
    if (scale < 0) scale = 0
    if (scale > 1) scale = 1
    setProgress(Math.round(scale * 100))
  }, [])

  useEffect(() => {
    const tablet = window.matchMedia('(max-width: 976px)')
    setIsTablet(tablet.matches)
    tablet.addEventListener('change', m => {
      setIsTablet(m.matches)
      if (!m.matches) {
        setSiderVisible(false)
      }
    })
  }, [])

  const onFabAction = useCallback(type => {
    switch (type) {
      case 'top':
        pageRef.current.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
        break
      case 'bottom':
        pageRef.current.scrollTo({
          top: pageRef.current.scrollHeight - pageRef.current.offsetHeight,
          behavior: 'smooth',
        })
        break
      case 'toc':
        setTocVisible(v => !v)
        break
      case 'sider':
        setSiderVisible(v => !v)
        break
      default:
        break
    }
  }, [])

  const handleClickContainer = useCallback(() => {
    setSiderVisible(false)
    setTocVisible(false)
  }, [])

  return (
    <>
      <Sider
        className={`${styles.sider} ${siderVisible ? styles.show : ''}`}
        active={active}
        plugins={plugins}
        fixed={siderFixed}
      />
      <div
        className={`${styles.container1} ${siderVisible ? styles.showSider : ''
          }`}
        onClick={() => handleClickContainer()}
      >
        <div className={styles.container2}>
          <div
            className={styles.container3}
            ref={pageRef}
            onScroll={handleScroll}
          >
            <main className={styles.main}>{children}</main>
          </div>
        </div>
      </div>
      {(isTablet || showFab) && (
        <Fab
          fabSider={isTablet && !tocVisible}
          fabToc={fabToc && !siderVisible}
          progress={progress}
          action={onFabAction}
        />
      )}
      <Toc visible={tocVisible} content={toc} />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}
