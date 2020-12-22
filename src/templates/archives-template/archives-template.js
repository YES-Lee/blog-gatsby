import React from 'react'
import { Link } from 'gatsby'
import Layout from '../../components/layout'
import Card from '../../components/card/card'
import Pagination from '../../components/pagination'
import SEO from '../../components/seo'

import styles from './archives-template.module.scss'

const MONTH = {
  1: 'JAN',
  2: 'FEB',
  3: 'MAR',
  4: 'APR',
  5: 'MAY',
  6: 'JUN',
  7: 'JUL',
  8: 'AUG',
  9: 'SEPT',
  10: 'OCT',
  11: 'NOV',
  12: 'DEC'
}

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
      <SEO
        title="归档-Johnson"
      />
      <Card>
        <article className={styles.archives}>
          {
            archives && (
              Object.keys(archives).sort((a, b) => b - a).map(y => (
                <section className={styles.yearSection} key={y}>
                  <h1 className={styles.year}>{y}</h1>
                  {
                    Object.keys(archives[y]).sort((a, b) => b - a).map(m => (
                      <section className={styles.monthSection} key={m}>
                        <header className={styles.month}>{MONTH[m]}</header>
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
      </Card>
      <Pagination className={styles.pager} current={currentPage} total={totalPage} renderPath={i => `/archives/${i === 0 ? '' : i}`} />
    </Layout>
  )
}
