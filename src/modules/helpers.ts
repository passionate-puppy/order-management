import { BundleRow } from './parsers'

export type BundleMap = Record<
  string, // bundleName
  Array<{
    itemName?: string
    itemNumber?: string
    itemQuantity?: number
    itemNotes?: string
  }>
>

export function buildBundleMap(bundlesJson: Array<BundleRow>): BundleMap {
  const buildBundleMap: BundleMap = {}
  let currentBundleName = null

  for (let i = 1; i < bundlesJson.length; i++) {
    const row = bundlesJson[i]

    if (row['商品編號欄位']) {
      // new bundle
      currentBundleName = row['商品編號欄位']
    }

    if (currentBundleName) {
      if (!(currentBundleName in buildBundleMap)) {
        buildBundleMap[currentBundleName] = []
      }
      buildBundleMap[currentBundleName].push({
        itemName: row.__EMPTY_1,
        itemNotes: row['請忽略'],
        itemNumber: row['組合內容'],
        itemQuantity: row['數量'],
      })
    }
  }

  console.log('*** buildBundleMap', buildBundleMap)
  return buildBundleMap
}

export function isSevenElevenStore(name: string) {
  return typeof name === 'string' && name.startsWith('7-11')
}

export function isFamilyStore(name: string) {
  return typeof name === 'string' && name.startsWith('全家')
}
