import React from 'react'
import styles from './card.module.scss'
import PropTypes from 'prop-types'

export default function Card (props) {
  const { className, children } = props

  return <div className={`${styles.card} ${className}`}>
    {children}
  </div>
}

Card.propTypes = {
  className: PropTypes.string
}
