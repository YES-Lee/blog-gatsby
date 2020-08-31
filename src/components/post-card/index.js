import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import { Calendar, Clock } from 'react-feather'
import Card from '../card/card'

import styles from './index.module.scss'

export default function PostCard (props) {
  const { title, excerpt, url, thumbnail, date, timeToRead } = props

  return (
    <Card className={styles.postCard}>
      <div className={styles.cover}>
        {
          thumbnail && (
            <Img fluid={thumbnail} />
          )
        }
      </div>
      <div className={styles.container}>
        <div className={styles.body}>
          <h3 className={styles.title}>
            <Link to={url} title={title} className={styles.text}>
              {title}
            </Link>
          </h3>
          <p className={styles.excerpt}>
            {excerpt}
          </p>
        </div>
        <div className={styles.metas}>
          <span className={styles.metaItem}>
            <Calendar size={14} /> {date}
          </span>
          <span className={styles.metaItem} title={`阅读时间${timeToRead}分钟`}>
            <Clock size={14} /> {timeToRead}‘
          </span>
        </div>
      </div>
    </Card>
  )
}
