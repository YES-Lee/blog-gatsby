import React from 'react'
import SEO from '../../components/seo'
import { Link } from 'gatsby'
import Layout from '../../components/layout'
import Card from '../../components/card/card'
import Pagination from '../../components/pagination'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

import styles from './categories-template.module.scss'

export default function CategoryPage(props) {
  const {
    pageContext: { currentPage, totalPage, categories, currentList, title },
  } = props

  return (
    <Layout active="/categories">
      <SEO
        title="分类-Johnson"
        meta={[
          {
            name: 'keywords',
            content: currentList.map(item => item.title).join(','),
          },
        ]}
      />
      <div className={styles.categoriesPage}>
        <Card className={styles.header}>
          <nav className={styles.tabList}>
            {categories.map(item => (
              <Link
                key={item.title}
                to={`/categories/${item.title}`}
                count={item.count}
                className={`${styles.tabItem} ${
                  item.title === title ? styles.active : ''
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </Card>
        <Card className={styles.main}>
          {currentList.map((item, i) => (
            <Link className={styles.item} to={item.link} key={i}>
              <span className={styles.date}>
                {dayjs(item.date)
                  .locale('zh-cn')
                  .format('DD/MM/YYYY')}
              </span>
              <span className={styles.title}>{item.title}</span>
            </Link>
          ))}
        </Card>
        <Pagination
          className={styles.pager}
          current={currentPage}
          total={totalPage}
          renderPath={i => `/categories/${title}/${i === 0 ? '' : i}`}
        />
      </div>
    </Layout>
  )
}
