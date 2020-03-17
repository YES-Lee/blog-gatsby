import React from 'react'
import MainPage from '../components/main-page'
import FLink from '../components/f-link'
import Layout from '../components/layout'
import SEO from '../components/seo'
import styles from './links.module.scss'

export default function LinkPage () {

  const links = [
    {
      title: '轶哥博客',
      motto: '妄图改变世界的全栈程序员',
      avatar: 'https://data.sercretcore.cn/new_avatar.jpeg',
      link: 'https://www.wyr.me/'
    },
    {
      title: '木马tc个人博客',
      motto: '想把代码写成诗的未知名作家',
      avatar: 'http://file.wintc.top/4a79f0e2f0f4468ea76ca68fa169e673',
      link: 'http://wintc.top/'
    },
    {
      title: 'Mind Spark',
      motto: '',
      avatar: 'https://wivwiv.com/avatar.png',
      link: 'https://wivwiv.com/'
    }
  ]

  return (
    <Layout>
      <SEO title="友情链接-Johnson" />
      <MainPage>
        <article className={styles.linksPage}>
          <h1 className={styles.pageTitle}>
            友情链接
          </h1>
          <section className={styles.list}>
            {
              links.map((item, i) => (
                <FLink data={item} key={i} />
              ))
            }
          </section>
        </article>
      </MainPage>
    </Layout>
  )
}
