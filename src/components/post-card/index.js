import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import Card from '../card/card'

import * as styles from './index.module.scss'

export default function PostCard(props) {
  const { title, excerpt, url, thumbnail, date, timeToRead } = props

  return (
    <Card className={styles.postCard}>
      <div className={styles.cover}>
        <Link to={url}>{thumbnail && <Img fluid={thumbnail} />}</Link>
      </div>
      <div className={styles.container}>
        <div className={styles.body}>
          <h3 className={styles.title}>
            <Link to={url} title={title} className={styles.text}>
              {title}
            </Link>
          </h3>
          <p className={styles.excerpt}>{excerpt}</p>
        </div>
        <div className={styles.metas}>
          <span className={`${styles.metaItem} iconfont icon-calendar`}>
            {date}
          </span>
          <span
            className={`${styles.metaItem} iconfont icon-clock`}
            title={`阅读时间${timeToRead}分钟`}
          >
            {timeToRead}‘
          </span>
        </div>
      </div>
    </Card>
  )
}
