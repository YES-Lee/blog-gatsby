import React, { useEffect } from 'react'

export default function AdSense (props) {

  useEffect(() => {
    console.log('加载广告')
    window.adsbygoogle = window.adsbygoogle || []
    window.adsbygoogle.push({})
  }, [])

  return (
    <>
      <ins
        className="adsbygoogle"
        {...props}></ins>
    </>
  )
}
