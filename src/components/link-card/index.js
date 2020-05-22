import React from 'react'
import Card from '../card/card'
import FLink from '../f-link'

import styles from './index.module.scss'

export default function LinkCard () {

  const links = [
    {
      title: '轶哥博客',
      motto: '妄图改变世界的全栈程序员',
      avatar: '//data.sercretcore.cn/new_avatar.jpeg',
      link: '//www.wyr.me/'
    },
    {
      title: '木马小站',
      motto: '想把代码写成诗的未知名作家',
      avatar: '//file.wintc.top/4a79f0e2f0f4468ea76ca68fa169e673',
      link: '//wintc.top/'
    },
    {
      title: 'Mind Spark',
      motto: '',
      avatar: '//wivwiv.com/avatar.png',
      link: '//wivwiv.com/'
    }
  ]

  return (
    <Card className={styles.linksCard}>
      {
        links.map((item, i) => (
          <FLink data={item} key={i} className={styles.linkItem} />
        ))
      }
    </Card>
  )
}
