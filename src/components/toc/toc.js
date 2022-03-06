import React from 'react'
import * as styles from './toc.module.scss'

export default function Toc(props) {
  const { visible, content } = props

  return (
    <div className={`${styles.toc} ${visible ? styles.active : ''}`}>
      {content}
    </div>
  )
}
