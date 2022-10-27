import mixpanel from 'mixpanel-browser'
import config from '../nuxt.config'
export default ({ app }, inject) => {
  inject('mixpanelTrackAction', (action, content, view) => {
    mixpanel.track('viz interaction', {
      'page title': config.head.title,
      action,
      content,
      'current view': view,
      'viz type': 'iati ukr dashboard'
    })
  })

  inject('mixpanelTrackLink', (url, type) => {
    mixpanel.track('link click', {
      'destination url': url,
      'link type': type,
      'page title': config.head.title
    })
  })

  inject('mixpanelTrackView', () => {
    mixpanel.track('page view', {
      'page title': config.head.title,
      'page type': 'datavis'
    })
  })
}
