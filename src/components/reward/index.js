import React, { useState } from 'react'
import Popover, { ArrowContainer } from 'react-tiny-popover'

import styles from './index.module.scss'

export function Reward(props) {
  const { list = [], text } = props
  const [current, setCurrent] = useState(-1)
  return (
    <div className={styles.reward}>
      <div className={styles.tabs}>
        {list.map((item, i) => (
          <Popover
            key={i}
            isOpen={current === i}
            onClickOutside={() => setCurrent(-1)}
            position={'top'} // preferred position
            padding={10}
            content={({ position, targetRect, popoverRect }) => (
              <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                position={position}
                targetRect={targetRect}
                popoverRect={popoverRect}
                arrowColor={'var(--theme-color-background)'}
                arrowSize={10}
              >
                <div
                  style={{
                    backgroundColor: 'var(--theme-color-background)',
                    borderRadius: '4px',
                    padding: '1rem',
                    textAlign: 'center',
                  }}
                >
                  <img src={item.qrcode} style={{ width: '240px' }} />
                  <p
                    style={{
                      opacity: 0.5,
                      fontSize: '0.5rem',
                      userSelect: 'all',
                    }}
                  >
                    {item.url}
                  </p>
                </div>
              </ArrowContainer>
            )}
          >
            <span className={styles.tab} onClick={() => setCurrent(i)}>
              {item.icon ? (
                <img
                  className={styles.paymentIcon}
                  src={item.icon}
                  title={item.title}
                />
              ) : (
                item.title
              )}
            </span>
          </Popover>
        ))}
      </div>
      <p className={styles.rewardText}>{text}</p>
    </div>
  )
}
