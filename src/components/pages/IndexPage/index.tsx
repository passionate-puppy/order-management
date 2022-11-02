import { exportToFamilyFormat, exportToHomeDeliveryFormat, exportToSevenElevenFormat } from 'modules/exporters'
import { buildBundleMap } from 'modules/helpers'
import { parseBundlesFileToJson, parseOrdersFileToJson } from 'modules/parsers'
import { useRef, useState } from 'react'

function IndexPage() {
  const ordersInputRef = useRef<HTMLInputElement>(null)
  const bundlesInputRef = useRef<HTMLInputElement>(null)

  const [ordersFile, setOrdersFile] = useState<File | null>(null)
  const [bundlesFile, setBundlesFile] = useState<File | null>(null)

  // 控制 711、全家出貨檔案中的「訂單日期」欄位
  const [outputOrderDate, setOutputOrderDate] = useState(
    new Date().toLocaleDateString()
  )

  const onOrdersInputChange = () => {
    if (ordersInputRef.current) {
      const { files } = ordersInputRef.current

      if (files && files.length > 0) {
        setOrdersFile(files[0])
      }
    }
  }

  const onBundlesInputChange = () => {
    if (bundlesInputRef.current) {
      const { files } = bundlesInputRef.current

      if (files && files.length > 0) {
        setBundlesFile(files[0])
      }
    }
  }

  const exportWorkBooks = async (
    target: 'all' | 'family' | 'home-delivery' | 'seven-eleven' = 'all'
  ) => {
    if (!ordersFile || !bundlesFile) {
      return
    }

    const ordersJson = await parseOrdersFileToJson(ordersFile)
    const bundlesJson = await parseBundlesFileToJson(bundlesFile)

    const bundleMapping = buildBundleMap(bundlesJson)

    if (Object.keys(bundleMapping).length === 0) {
      alert('發生錯誤\n請確認是否選了正確的檔案')
      return
    }

    if (target === 'all') {
      exportToFamilyFormat(ordersJson, bundleMapping, outputOrderDate)
      exportToHomeDeliveryFormat(ordersJson, bundleMapping, outputOrderDate)
      exportToSevenElevenFormat(ordersJson, bundleMapping, outputOrderDate)
    }
    if (target === 'family') {
      exportToFamilyFormat(ordersJson, bundleMapping, outputOrderDate)
    }
    if (target === 'home-delivery') {
      exportToHomeDeliveryFormat(ordersJson, bundleMapping, outputOrderDate)
    }
    if (target === 'seven-eleven') {
      exportToSevenElevenFormat(ordersJson, bundleMapping, outputOrderDate)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div>第一步：請選擇「匯出格式」之 Excel 檔案</div>
          <input
            type="file"
            accept=".xls, .xlsx"
            ref={ordersInputRef}
            onChange={onOrdersInputChange}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div>第二步：請選擇「組合檔案」之 Excel 檔案</div>
          <input
            type="file"
            accept=".xls, .xlsx"
            ref={bundlesInputRef}
            onChange={onBundlesInputChange}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div>第三步：訂單日期</div>
          <div>
            <input
              value={outputOrderDate}
              onChange={(e) => {
                setOutputOrderDate(e.target.value)
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          <button
            onClick={() => exportWorkBooks()}
            disabled={!ordersFile || !bundlesFile}
          >
            匯出全部
          </button>
          <button
            onClick={() => exportWorkBooks('family')}
            disabled={!ordersFile || !bundlesFile}
          >
            匯出「全家」出貨
          </button>
          <button
            onClick={() => exportWorkBooks('family')}
            disabled={!ordersFile || !bundlesFile}
          >
            匯出「宅配」出貨
          </button>
          <button
            onClick={() => exportWorkBooks('seven-eleven')}
            disabled={!ordersFile || !bundlesFile}
          >
            匯出「711」出貨
          </button>
        </div>
      </div>
    </div>
  )
}

export default IndexPage
