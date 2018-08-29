import React from 'react'

import '../src/globalStyles.css'
import Home from '../src/views/Home'
import SinglePost from '../src/views/SinglePost'

console.log('React version', React.version)

const CMS = window.CMS
CMS.registerPreviewStyle(
  'https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.css'
)
CMS.registerPreviewStyle('/admin/cms.bundle.css')

// Preview Templates
CMS.registerPreviewTemplate('home-page', ({ entry }) => (
  <Home fields={entry.toJS().data} />
))
CMS.registerPreviewTemplate('posts', ({ entry }) => (
  <SinglePost fields={entry.toJS().data} />
))

// Return to home when user logging out
window.netlifyIdentity.on('logout', function () {
  document.location.href = '/'
})

// Log netlifySiteURL if editing on localhost
if (
  window.location.hostname === 'localhost' &&
  window.localStorage.getItem('netlifySiteURL')
) {
  console.log(
    `%cnetlifySiteURL: ${window.localStorage.getItem('netlifySiteURL')}`,
    'color: hotpink; font-size: 15px'
  )
}
