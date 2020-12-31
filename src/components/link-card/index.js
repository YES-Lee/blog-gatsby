import React from 'react'
import FLink from '../f-link'

import styles from './index.module.scss'

export default function LinkCard () {

  const links = [
    // {
    //   title: 'Johnson的实验室',
    //   motto: '属于Johnson的私人车库',
    //   avatar: '/images/lab.svg',
    //   link: '//lab.johnsonlee.site/?path=/story/web%E5%AE%9E%E9%AA%8C%E5%AE%A4-%F0%9F%91%8F%E6%AC%A2%E8%BF%8E%E5%8F%82%E8%A7%82%F0%9F%91%8F--page'
    // },
    {
      title: '轶哥博客',
      motto: '妄图改变世界的全栈程序员',
      avatar: '//data.sercretcore.cn/new_avatar.jpeg',
      link: '//www.wyr.me/'
    },
    {
      title: '沐码小站',
      motto: '想把代码写成诗的未知名作家',
      avatar: '//file.wintc.top/logo.jpeg',
      link: '//wintc.top/'
    },
    {
      title: 'Mind Spark',
      motto: '',
      avatar: '//wivwiv.com/avatar.png',
      link: '//wivwiv.com/'
    }
    // {
    //   title: 'Traveling',
    //   motto: '开往未知的世界',
    //   avatar: '/images/traveling.svg',
    //   link: '//travellings.now.sh/'
    // }
  ]

  return (
    <div className={styles.linksCard}>
      {
        links.map((item, i) => (
          <FLink data={item} key={i} className={styles.linkItem} />
        ))
      }
    </div>
  )
}
