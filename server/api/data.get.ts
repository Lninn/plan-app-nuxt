import { JSDOM } from 'jsdom'

export default defineEventHandler(async (event) => {
  const queryParams = getQuery<{ url: string }>(event)

  if (!queryParams.url) {
    throw createError({ status: 400, message: 'url is required' })
  }

  const res = await $fetch(
    queryParams.url,
  ) as string

  const dom = new JSDOM(
    res,
  )
  const _document = dom.window.document
  const elements = _document.querySelectorAll(`head>link[rel*="icon"]`)

  const map: Record<string, string> = {}
  for (const element of elements) {
    const href = element.attributes.getNamedItem('href')
    const sizes = element.attributes.getNamedItem('sizes')

    if (href && sizes) {
      const keyOfsize = parseInt(sizes.value)
      map[keyOfsize] = href.value
    }
    else if (href) {
      map[0] = href.value
    }
  }

  const sizeKeys = Object.keys(map)
  const keyOfMax = Math.max(...sizeKeys.map(key => parseInt(key)))

  let url = ''
  if (!keyOfMax) {
    url = map[sizeKeys[0]]
  }
  else {
    url = map[keyOfMax]
  }

  function getRootUrl(url: string) {
    const urlObj = new URL(url)
    return `${urlObj.protocol}//${urlObj.host}`
  }

  const iSstartWithHttpOrHttps = url.startsWith('http://') || url.startsWith('https://')
  if (url && !iSstartWithHttpOrHttps) {
    const rootUrl = getRootUrl(queryParams.url)
    url = `${rootUrl}${url}`
  }

  return { ok: !!url, url }
})
