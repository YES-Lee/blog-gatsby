import React from 'react'
import { Link } from 'gatsby'
import { ChevronLeft, ChevronRight } from 'react-feather'
import { Reward } from '../reward'
import btcLogo from '../../images/btc.png'
import wechatPayLogo from '../../images/wechat_pay_logo.png'
import wechatCode from '../../images/wechat_pay.jpg'
import ethLogo from '../../images/ethereum.png'
import btcCode from '../../images/btc_code.png'
import ethCode from '../../images/eth_code.png'

import styles from './index.module.scss'

export default function PostFooter (props) {

  const {
    tags,
    prev,
    next
  } = props

  return (
    <footer className={styles.postFooter}>
      <Reward
        text='如果本文对你有帮助，👆可以打赏我的女朋友'
        list={[
          {
            title: 'WeChat',
            icon: wechatPayLogo,
            qrcode: wechatCode,
            url: ''
          },
          {
            title: 'BTC',
            icon: btcLogo,
            qrcode: btcCode,
            url: '32eMuE3yPEwZxdwNpidzqYz947BF88ZnYR'
          },
          {
            title: 'ETH',
            icon: ethLogo,
            qrcode: ethCode,
            url: '0x0d9f1baF872471ED47fB7Ca808163D0334541Cdd'
          }
        ]}
      />
      <ul className={styles.copyright}>
        <li className={styles.item}>
          <span className={styles.title}>本文作者：</span>
          Johnson
        </li>
        <li className={styles.item}>
          <span className={styles.title}>本文链接：</span>
          Johnson
        </li>
        <li className={styles.item}>
          <span className={styles.title}>版权声明：</span>
          <a href='https://creativecommons.org/licenses/by-nc-nd/4.0/'>署名-非商业性使用-禁止演绎 4.0 国际</a>
        </li>
      </ul>
      <div className={styles.tags}>
        {
          (tags || []).map((item, i) => (
            <Link to={`/tags/${item}`} key={i} className={styles.item}># {item}</Link>
          ))
        }
      </div>
      <div className={styles.line}></div>
      <div className={styles.pager}>
        {
          prev && (
            <Link className={styles.prev} to={prev.link}>
              <ChevronLeft size={14} />
              {`${prev.title}`}
            </Link>
          )
        }
        {
          next && (
            <Link className={styles.next} to={next.link}>
              {`${next.title}`}
              <ChevronRight size={14} />
            </Link>
          )
        }
      </div>
    </footer>
  )
}
