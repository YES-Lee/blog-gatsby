import React from 'react'

export default function AdSense (props) {

  const { style, client, format, layout, slot } = props

  return (
    <>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-format={format}
        data-ad-layout-key={layout}
        data-ad-client={client}
        data-ad-slot={slot}></ins>
      <script dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}></script>
    </>
  )
}
