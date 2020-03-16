import React from 'react'
import styles from './index.module.scss'

export default function MainPage ({ children }) {

  return (
    <div className={styles.mainPage}>
      {children}
    </div>
  )
}
