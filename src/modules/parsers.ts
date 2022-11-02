import XLSX from 'xlsx'

export type OrderRow = {
  訂單編號?: any
  商品編號?: any
  商品名稱?: any
  數量?: any
  姓名?: any
  手機?: any
  地址?: any
  門市代號?: any
  門市名稱?: any
  物流編號?: any
}

export async function parseOrdersFileToJson(ordersFile: File) {
  const ordersData = await ordersFile.arrayBuffer()
  const ordersWorkBook = XLSX.read(ordersData)
  const ordersJson = XLSX.utils.sheet_to_json<OrderRow>(
    ordersWorkBook.Sheets[ordersWorkBook.SheetNames[0]]
  )

  console.log('*** ordersJson', ordersJson)
  return ordersJson
}

export type BundleRow = {
  商品編號欄位: any // bundleName
  __EMPTY_1?: any // itemName
  請忽略?: any // itemNotes (訂單備註)
  組合內容?: any // itemNumber
  數量?: any // itemQuantity
}

export async function parseBundlesFileToJson(bundlesFile: File) {
  const bundlesData = await bundlesFile.arrayBuffer()
  const bundlesWorkBook = XLSX.read(bundlesData)
  const bundlesJson = XLSX.utils.sheet_to_json<BundleRow>(
    bundlesWorkBook.Sheets[bundlesWorkBook.SheetNames[0]]
  )

  console.log('*** bundlesJson', bundlesJson)
  return bundlesJson
}
