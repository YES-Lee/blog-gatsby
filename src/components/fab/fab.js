import React, { useCallback, useState } from 'react'
import * as styles from './fab.module.scss'

export default function Fab(props) {
  const { progress = 0, action, fabSider, fabToc } = props
  const [showMenu, setShowMenu] = useState(false)

  const act = useCallback(
    type => {
      if (action && typeof action) {
        action(type)
      }
    },
    [action]
  )

  return (
    <div className={styles.fab}>
      <div
        className={`${styles.fabMenuGroup} ${showMenu ? styles.fabActive : ''}`}
      >
        <span
          className={`${styles.fabMenu} iconfont icon-chevron-up`}
          onClick={() => act('top')}
        ></span>
        <span
          className={`${styles.fabMenu} iconfont icon-chevron-down`}
          onClick={() => act('bottom')}
        ></span>
        {fabSider && (
          <span
            className={`${styles.fabMenu} iconfont icon-sidebar`}
            onClick={() => act('sider')}
          ></span>
        )}
        {fabToc && (
          <span
            className={`${styles.fabMenu} iconfont icon-list`}
            onClick={() => act('toc')}
          ></span>
        )}
        {/* <span className={`${styles.fabMenu} icon-search`}></span> */}
      </div>
      <div className={styles.fabControl} onClick={() => setShowMenu(!showMenu)}>
        <svg className={styles.fabControlSvg}>
          <defs>
            <filter id="dp">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
          </defs>
          <circle
            filter="url(#dp)"
            fill="rgba(0,0,0,.3)"
            cx="50%"
            cy="52%"
            r="44%"
          ></circle>
          <circle
            className={styles.fabControlCover}
            cx="50%"
            cy="50%"
            r="44%"
          ></circle>
          <circle
            className={styles.fabControlStroke}
            strokeDasharray={3.1415926 * (progress || 0) + '% 314.15926%'}
            cx="50%"
            cy="50%"
            r="48%"
          ></circle>
          {progress && (
            <text className={styles.fabControlProgress} x="50%" y="0" dy="50%">
              {progress || ''}
              <tspan dx="1">%</tspan>
            </text>
          )}
          {!progress && (
            <g className={styles.fabControlDot}>
              <circle
                cx={showMenu ? '-.8rem' : 0}
                cy={showMenu ? 0 : '-.8rem'}
                r=".2rem"
              ></circle>
              <circle r=".2rem"></circle>
              <circle
                cx={showMenu ? '.8rem' : 0}
                cy={showMenu ? 0 : '.8rem'}
                r=".2rem"
              ></circle>
            </g>
          )}
        </svg>
      </div>
    </div>
  )
}
