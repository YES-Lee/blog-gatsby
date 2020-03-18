import React from 'react'
import { Link } from 'gatsby'
import { ChevronLeft, ChevronRight } from 'react-feather'

import styles from './index.module.scss'

export default function PostFooter (props) {

  const {
    tags,
    prev,
    next
  } = props

  return (
    <footer className={styles.postFooter}>
      <ul className={styles.copyright}>
        <li className={styles.item}>
          <span className={styles.title}>本文作者：</span>
          Johnson
        </li>
        <li className={styles.item}>
          <span className={styles.title}>本文链接：</span>
          Johnson
        </li>
        <li className={styles.item}>
          <span className={styles.title}>版权声明：</span>
          <a href='https://creativecommons.org/licenses/by-nc-nd/4.0/'>署名-非商业性使用-禁止演绎 4.0 国际</a>
        </li>
      </ul>
      <div className={styles.tags}>
        {
          (tags || []).map((item, i) => (
            <Link to={`/tags/${item}`} key={i} className={styles.item}># {item}</Link>
          ))
        }
      </div>
      <div className={styles.line}></div>
      <div className={styles.pager}>
        {
          prev && (
            <Link className={styles.prev} to={prev.link}>
              <ChevronLeft size={14} />
              {`${prev.title}`}
            </Link>
          )
        }
        {
          next && (
            <Link className={styles.next} to={next.link}>
              {`${next.title}`}
              <ChevronRight size={14} />
            </Link>
          )
        }
      </div>
    </footer>
  )
}
