import { Linking } from 'react-native'

import { log } from './sentry'

// fix ios issue for Django, that requires trailing slash in request url https://github.com/square/retrofit/issues/1037
export const addTrailingSlashToUrl = (url: string): string => (url.endsWith('/') ? url : `${url}/`)

export const openExternalUrl = (url: string): Promise<void> =>
  Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        // iOS Simulators do not support certain schemes like mailto or tel
        log(`Cannot handle url: ${url}`)
        return null
      }
      return Linking.openURL(url)
    })
    .catch()
