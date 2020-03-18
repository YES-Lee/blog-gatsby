import React from 'react'
import styles from './f-link.module.scss'

console.log(styles)

export default function FLink ({ data, className }) {

  return (
    <div className={`${styles.fLink} ${className}`}>
      <img className={styles.avatar} src={data.avatar} />
      <div className={styles.content}>
        <div className={styles.title}>
          <a
            href={data.link}
            target='_blank'
            rel='noopener noreferrer'
          >
            {data.title}
          </a>
        </div>
        <div className={styles.motto}>{data.motto}</div>
      </div>
    </div>
  )
}
