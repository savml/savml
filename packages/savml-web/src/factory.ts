import { v0, CrossFetchProvider, UrlLoader } from 'savml'

export function getFactory() {
  let factory = v0()
  let loader = factory.getLoaderFactory()
  loader.useLoaderProvider(new UrlLoader([ { url: '//unpkg.visionacademy.cn' }], new CrossFetchProvider()))
  return factory
}
