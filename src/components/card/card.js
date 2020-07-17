import React from 'react'
import styles from './card.module.scss'
import PropTypes from 'prop-types'

export default function Card (props) {
  const { className, children, style } = props

  return <div className={`${styles.card} ${className}`} style={style}>
    {children}
  </div>
}

Card.propTypes = {
  className: PropTypes.string
}
