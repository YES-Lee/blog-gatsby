import React from 'react'
import Layout from '../../components/layout'
import SEO from '../../components/seo'
import styles from './categories-template.module.scss'
import { Link } from 'gatsby'
import Pagination from '../../components/pagination'
import moment from 'moment'
moment.locale('zh_CN')

export default function CategoryPage (props) {

  const {
    pageContext: {
      currentPage,
      totalPage,
      categories,
      title
    }
  } = props

  return (
    <Layout active='/categories'>
      <SEO title="分类-Johnson" />
      <div className={styles.categoriesPage}>
        <div className={styles.header}>
          <nav className={styles.tabList}>
            {
              Object.keys(categories).map(k => (
                <Link
                  key={k}
                  to={`/categories/${k}`}
                  count={categories[k].length}
                  className={`${styles.tabItem} ${k === title ? styles.active : ''}`}
                >
                  {k}
                </Link>
              ))
            }
          </nav>
        </div>
        <article className={styles.main}>
          {
            categories[title].map((item, i) => (
              <Link className={styles.item} to={item.link} key={i}>
                <span className={styles.date}>{moment(item.date).format('YYYY/MM/DD')}</span>
                <span className={styles.title}>{item.title}</span>
              </Link>
            ))
          }
        </article>
        <div className={styles.pager}>
          <Pagination current={currentPage} total={totalPage} renderPath={i => `/categories/${categories.title}/${i === 0 ? '' : i}`} />
        </div>
      </div>
    </Layout>
  )
}
