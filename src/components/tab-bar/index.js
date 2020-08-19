import React from 'react'
import styles from './tab-bar.module.scss'
import { Link } from 'gatsby'
import { Home, Tag, Archive, Search } from 'react-feather'

export default function TabBar (props) {

  return (
    <div className={`${styles.tabBar} ${props.className}`} style={props.style}>
      <ul className={styles.tabList}>
        <li className={`${styles.tabItem} active`}>
          <Link to='/'>
            <Home />
          </Link>
        </li>
        <li className={styles.tabItem}>
          <Link to='/tags'>
            <Tag />
          </Link>
        </li>
        <li className={styles.tabItem}>
          <Link to='/archives'>
            <Archive />
          </Link>
        </li>
        <li className={styles.tabItem}>
          <Link to='/search'>
            <Search />
          </Link>
        </li>
      </ul>
    </div>
  )
}
