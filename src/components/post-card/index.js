import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import { Calendar } from 'react-feather'
import Card from '../card/card'

import styles from './index.module.scss'

export default function PostCard (props) {
  const { title, excerpt, url, thumbnail, date } = props

  return (
    <Card className={styles.postCard}>
      {
        thumbnail && (
          <Img fluid={thumbnail} />
        )
      }
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
      <div className={styles.date}>
        <Calendar size={14} /> {date}
      </div>
    </Card>
  )
}
