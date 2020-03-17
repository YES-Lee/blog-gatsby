import React from 'react'
import Layout from '../../components/layout'
import SEO from '../../components/seo'
import styles from './tags-template.module.scss'
import { Link } from 'gatsby'
import Pagination from '../../components/pagination'
import moment from 'moment'
import MainPage from '../../components/main-page'
moment.locale('zh_CN')

export default function CategoryPage (props) {

  const {
    pageContext: {
      currentPage,
      totalPage,
      tags,
      title
    }
  } = props

  return (
    <Layout active='/tags'>
      <SEO
        title="标签-Johnson"
        meta={[
          {
            name: 'keywords',
            content: tags[title].map(item => item.title).join(',')
          }
        ]}
      />
      <MainPage>
        <article className={styles.tagsPage}>
          <h1 className={styles.pageTitle}>
            # {title}
          </h1>
          <section className={styles.list}>
            {
              tags[title].map((item, i) => (
                <Link className={styles.item} to={item.link} key={i}>
                  <span className={styles.date}>{moment(item.date).format('YYYY/MM/DD')}</span>
                  <span className={styles.title}>{item.title}</span>
                </Link>
              ))
            }
          </section>
          <div className={styles.pager}>
            <Pagination current={currentPage} total={totalPage} renderPath={i => `/tags/${tags.title}/${i === 0 ? '' : i}`} />
          </div>
        </article>
      </MainPage>
    </Layout>
  )
}
