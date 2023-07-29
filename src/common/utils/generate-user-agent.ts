import { Fingerprint } from '@common/types'

// "useragent": {
//   "browser": {
//     "family": "Chrome",
//       "version": "50"
//   },
//   "device": {
//     "family": "Other",
//       "version": "0"
//   },
//   "os": {
//     "family": "Mac OS",
//       "major": "10",
//       "minor":"11"
//   },

export const generateUserAgent = (fingerprint: Fingerprint): string => {
  if (fingerprint.components['useragent']) {
    const userAgent: string[] = []

    const { browser, os, device } = fingerprint.components[
      'useragent'
    ] as UserAgent

    userAgent.push(browser.family + '-' + browser.version)
    userAgent.push(os.family)
    userAgent.push(device.family + '-' + device.version)

    return userAgent.join('-')
  }

  return ''
}

export type UserAgent = {
  device: {
    family: string
    version: string
  }
  os: {
    family: string
  }
  browser: {
    family: string
    version: string
  }
}
