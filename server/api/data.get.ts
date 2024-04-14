import { JSDOM } from 'jsdom'

export default defineEventHandler(async (event) => {
  const queryParams = getQuery<{ url: string }>(event)

  if (!queryParams.url) {
    throw createError({ status: 400, message: 'url is required' })
  }

  let res = ''
  try {
    res = await $fetch(
      queryParams.url,
    ) as string
  }
  catch (error) {
    console.log(
      (error instanceof Error) && error.message,
    )
    // throw createError({ status: 400, message: error.message })
  }

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

  const iSstartWithHttpOrHttps = url ? url.startsWith('http://') || url.startsWith('https://') : false
  if (url && !iSstartWithHttpOrHttps) {
    let rootUrl = getRootUrl(queryParams.url)
    if (rootUrl.endsWith('/')) {
      rootUrl = rootUrl.slice(0, -1)
    }
    url = `${rootUrl}/${url}`
  }

  if (!url) {
    const tryUrl = `${getRootUrl(queryParams.url)}/favicon.ico`
    try {
      await $fetch(tryUrl)
      return { ok: true, url: tryUrl }
    }
    catch (error) {
      //
    }
  }

  return { ok: !!url, url }
})
