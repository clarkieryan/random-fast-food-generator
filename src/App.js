import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Meta from './components/global/Meta'
import Home from './views/Home'
import SinglePost from './views/SinglePost'
import NoMatch from './views/NoMatch'
import Nav from './components/global/Nav'
import Footer from './components/global/Footer'
import ServiceWorkerNotifications from './components/global/ServiceWorkerNotifications'
import data from './data.json'
import { slugify } from './util/url'
import { getCollectionTerms } from './util/collection'

class App extends Component {
  state = {
    data
  }

  getDocument = (collection, name) =>
    this.state.data[collection] &&
    this.state.data[collection].filter(page => page.name === name)[0]

  getDocuments = collection => this.state.data[collection] || []

  render () {
    const globalSettings = this.getDocument('settings', 'global')
    const {
      siteTitle,
      siteUrl,
      siteDescription,
      socialMediaCard,
      headerScripts
    } = globalSettings

    const posts = this.getDocuments('posts').filter(
      post => post.status !== 'Draft'
    )
    const categoriesFromPosts = getCollectionTerms(posts, 'categories')
    const postCategories = this.getDocuments('postCategories').filter(
      category => categoriesFromPosts.indexOf(category.name.toLowerCase()) >= 0
    )

    return (
      <Router>
        <div className='React-Wrap'>
          <ServiceWorkerNotifications reloadOnUpdate />
          <Meta
            defaultTitle={siteTitle}
            titleTemplate={`${siteTitle} | %s`}
            headerScripts={headerScripts}
            absoluteImageUrl={
              socialMediaCard &&
              socialMediaCard.image &&
              siteUrl + socialMediaCard.image
            }
            twitterCreatorAccount={
              socialMediaCard && socialMediaCard.twitterCreatorAccount
            }
            twitterSiteAccount={
              socialMediaCard && socialMediaCard.twitterSiteAccount
            }
          />

          <Switch>
            <Route
              path='/'
              exact
              render={() => <Home description={siteDescription} fields={this.getDocument('pages', 'home')} />}
            />
          
            {posts.map((post, index) => {
              const path = slugify(`/blog/${post.title}`)
              const nextPost = posts[index - 1]
              const prevPost = posts[index + 1]
              return (
                <Route
                  key={path}
                  path={path}
                  exact
                  component={SinglePost}
                  fields={post}
                  nextPostURL={nextPost && slugify(`/blog/${nextPost.title}/`)}
                  prevPostURL={prevPost && slugify(`/blog/${prevPost.title}/`)}
                />
              )
            })}

            <Route render={() => <NoMatch siteUrl={siteUrl} />} />
          </Switch>
          <Footer />
        </div>
      </Router>
    )
  }
}

export default App
