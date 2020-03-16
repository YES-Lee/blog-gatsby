import React from 'react'
import styles from './archives-template.module.scss'
import { Link } from 'gatsby'
import Layout from '../../components/layout'
import SEO from '../../components/seo'
import MainPage from '../../components/main-page'
import Pagination from '../../components/pagination'

export default function ArchivesTemplage (props) {

  const {
    pageContext: {
      archives,
      currentPage,
      totalPage
    }
  } = props

  return (
    <Layout active='/archives'>
      <SEO title="友情链接-Johnson" />
      <MainPage>
        <article className={styles.archives}>
          {
            archives && (
              Object.keys(archives).sort((a, b) => b - a).map(y => (
                <section className={styles.yearSection} key={y}>
                  <h1 className={styles.year}>{y}</h1>
                  {
                    Object.keys(archives[y]).sort((a, b) => b - a).map(m => (
                      <section className={styles.monthSection} key={m}>
                        <header className={styles.month}>{m + '月'}</header>
                        <div className={styles.list}>
                          {
                            archives[y][m].map((item, i) => (
                              <Link to={item.link} className={styles.item} key={i}>
                                <span className={styles.date}>{m < 10 ? '0' + m : m}-{new Date(item.date).getDate()}</span>
                                <span className={styles.title}>{item.title}</span>
                              </Link>
                            ))
                          }
                        </div>
                      </section>
                    ))
                  }
                </section>
              ))
            )
          }
        </article>
      </MainPage>
      <Pagination current={currentPage} total={totalPage} renderPath={i => `/archives/${i === 0 ? '' : i}`} />
    </Layout>
  )
}
