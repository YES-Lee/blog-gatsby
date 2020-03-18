import React from 'react'
import SEO from '../../components/seo'
import styles from './tags-template.module.scss'
import Card from '../../components/card/card'
import { Link } from 'gatsby'
import Layout from '../../components/layout'
import Pagination from '../../components/pagination'
import moment from 'moment'
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
      <Card>
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
          <Pagination className={styles.pager} current={currentPage} total={totalPage} renderPath={i => `/tags/${tags.title}/${i === 0 ? '' : i}`} />
        </article>
      </Card>
    </Layout>
  )
}
