import React from 'react'
import * as styles from './f-link.module.scss'

export default function FLink({ data, className }) {
  return (
    <div className={`${styles.fLink} ${className}`}>
      <img className={styles.avatar} src={data.avatar} />
      <div className={styles.content}>
        <a
          href={data.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.title}
        >
          {data.title}
        </a>
        <div className={styles.motto}>{data.motto}</div>
      </div>
    </div>
  )
}
