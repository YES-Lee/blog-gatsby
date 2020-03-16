import React from 'react'
import styles from './index.module.scss'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import { Calendar } from 'react-feather'

export default function PostCard (props) {
  const { title, excerpt, url, thumbnail, date } = props

  return (
    <section className={styles.postCard}>
      <Link to={url}>
        {
          thumbnail && (
            <Img fluid={thumbnail} />
          )
        }
      </Link>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link to={url} className={styles.text}>
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
    </section>
  )
}
