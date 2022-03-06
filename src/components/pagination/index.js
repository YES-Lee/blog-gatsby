import React from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'

import * as styles from './index.module.scss'

export default function Pagination(props) {
  const { current, total, renderPath = () => { }, className } = props

  if (!total || total <= 1) {
    return null
  }

  const renderList = (total = 0) => {
    const list = []
    if (total <= 5) {
      for (let i = 0; i < total; i++) {
        list.push(
          <Link
            key={i}
            to={renderPath(i)}
            className={`${styles.item} ${current === i ? styles.active : ''}`}
          >
            {i + 1}
          </Link>
        )
      }
    }
    if (total > 5) {
      const first = (
        <Link
          key={0}
          to={renderPath(0)}
          className={`${styles.item} ${current === 0 ? styles.active : ''}`}
        >
          {1}
        </Link>
      )
      const last = (
        <Link
          key={total - 1}
          to={renderPath(total - 1)}
          className={`${styles.item} ${current === total - 1 ? styles.active : ''
            }`}
        >
          {total}
        </Link>
      )
      const more = (
        <span key={3} className="iconfont icon-more-horizontal"></span>
      )
      if (current < 2) {
        for (let i = 0; i < 3; i++) {
          list.push(
            <Link
              key={i}
              to={renderPath(i)}
              className={`${styles.item} ${current === i ? styles.active : ''}`}
            >
              {i + 1}
            </Link>
          )
        }
        list.push(more)
        list.push(last)
      }
      if (current === 2) {
        for (let i = 0; i < 4; i++) {
          list.push(
            <Link
              key={i}
              to={renderPath(i)}
              className={`${styles.item} ${current === i ? styles.active : ''}`}
            >
              {i + 1}
            </Link>
          )
        }
        list.push(more)
        list.push(last)
      }
      if (current > 2 && current < total - 3) {
        list.push(first)
        list.push(more)
        list.push(
          <Link
            key={current - 1}
            to={renderPath(current - 1)}
            className={`${styles.item} ${current === current - 1 ? styles.active : ''
              }`}
          >
            {current}
          </Link>
        )
        list.push(
          <Link
            key={current}
            to={renderPath(current)}
            className={`${styles.item} ${styles.active}`}
          >
            {current + 1}
          </Link>
        )
        list.push(
          <Link
            key={current + 1}
            to={renderPath(current + 1)}
            className={`${styles.item} ${current === current + 1 ? styles.active : ''
              }`}
          >
            {current + 2}
          </Link>
        )
        list.push(more)
        list.push(last)
      }
      if (current >= total - 3) {
        list.push(first)
        list.push(more)
        for (let i = total - 3; i < total; i++) {
          list.push(
            <Link
              key={i}
              to={renderPath(i)}
              className={`${styles.item} ${current === i ? styles.active : ''}`}
            >
              {i + 1}
            </Link>
          )
        }
      }
    }
    return list
  }

  return (
    <div className={`${styles.pagination} ${className}`}>
      {current > 0 && (
        <Link
          className={`${styles.prev} iconfont icon-chevron-left`}
          to={renderPath(current - 1)}
        ></Link>
      )}
      <ul className={styles.list}>{renderList(total)}</ul>
      {current + 1 < total && (
        <Link
          className={`${styles.next} iconfont icon-chevron-right`}
          to={renderPath(current + 1)}
        ></Link>
      )}
    </div>
  )
}

Pagination.propTypes = {
  current: PropTypes.number,
  total: PropTypes.number,
  renderPath: PropTypes.func,
}
