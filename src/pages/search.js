import React, { useEffect, useState } from 'react'
import algoliasearch from 'algoliasearch'
import { useDebouncedCallback } from 'beautiful-react-hooks'
import { Link } from 'gatsby'

import SEO from '../components/seo'
import Layout from '../components/layout'
import Card from '../components/card/card'
import * as styles from './search.module.scss'
import { Loader } from 'react-feather'

const ALGOLIA_APPID = '46OB2XFJAE'
const ALGOLIA_SEARCH_API_KEY = '398f0a205a139bf94d6f7ad971886228'

const algoliaIndex = algoliasearch(
  ALGOLIA_APPID,
  ALGOLIA_SEARCH_API_KEY
).initIndex('prod_blog')

const SearchPage = () => {
  const [keywords, setKeywords] = useState('')
  const [resultList, setResultList] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = useDebouncedCallback(() => {
    setLoading(true)
    algoliaIndex.search(keywords).then(({ hits }) => {
      setResultList(hits)
      setLoading(false)
    })
  }, [], 200)

  useEffect(() => {
    if (keywords.trim()) {
      handleSearch()
      return () => handleSearch.cancel()
    }
  }, [keywords])

  return (
    <Layout active="/search">
      <SEO title="搜索" />
      <Card className={styles.searchBar}>
        {loading && (
          <div className={styles.loaderContainer}>
            <Loader size="1.2rem" className={styles.loader} />
          </div>
        )}
        <input
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          className={styles.searchInput}
          placeholder="输入关键词搜索🔍"
        />
      </Card>
      {resultList.length > 0 && (
        <Card className={styles.searchResult}>
          {resultList.map((item, index) => (
            <div key={index} className={styles.resultItem}>
              <Link to={item.slug} className={styles.resultTitle}>
                {item.title}
              </Link>
              <div
                className={styles.resultExcerpt}
                dangerouslySetInnerHTML={{ __html: item.excerpt }}
              ></div>
            </div>
          ))}
        </Card>
      )}
    </Layout>
  )
}

export default SearchPage
