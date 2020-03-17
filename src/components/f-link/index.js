import React from 'react'
import styles from './f-link.module.scss'

console.log(styles)

export default function FLink ({ data }) {

  return (
    <a
      href={data.link}
      target='_blank'
      rel='noopener noreferrer'
      className={styles.fLink}
    >
      <img className={styles.avatar} src={data.avatar} />
      <div className={styles.content}>
        <div className={styles.title}>{data.title}</div>
        <div className={styles.motto}>{data.motto}</div>
      </div>
    </a>
  )
}
