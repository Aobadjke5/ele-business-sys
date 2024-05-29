import { Button, Form, Input, InputNumber, Table, Tag } from "antd"
import style from "./ProductDetailTable.module.scss"
import { useEffect, useState } from "react"
import MyUpload from "../MyUpload/MyUpload"

export default function ProductDetailTable(props) {
  const [tableData, setTableData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [form] = Form.useForm()

  const tableItemEdit = (record) => {
    form.setFieldsValue({ ...record })
    setEditingKey(record.key)
  }
  const tableItemDelete = (key) => {
    let newTableData = [...tableData]
    newTableData = newTableData.filter((item) => key !== item.key)
    setTableData(newTableData)
    props.getNewProductDetails(newTableData)
  }
  const tableItemSave = (key) => {
    const formItem = form.getFieldsValue()
    let newTableData = [...tableData]
    const index = newTableData.findIndex((item) => key === item.key)
    const newItem = {
      ...newTableData[index],
      ...formItem
    }
    newTableData.splice(index, 1, newItem)
    setTableData(newTableData)
    props.getNewProductDetails(newTableData)
    setEditingKey("")
  }
  const tableItemCancer = () => {
    setEditingKey("")
  }

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const tableDeleteArr = () => {
    let newTableData = [...tableData]
    newTableData = newTableData.filter((item) => !selectedRowKeys.includes(item.key))
    setTableData(newTableData)
    props.getNewProductDetails(newTableData)
    setSelectedRowKeys([])
  }
  const tableAddItem = () => {
    let newTableData = [...tableData]
    newTableData.push({ ProductName: "newType", key: Date.now(), ProductImage: "", ProductCnt: 0, ProductPrice: 9.9 })
    setTableData(newTableData)
    props.getNewProductDetails(newTableData)
  }

  useEffect(() => {
    setTableData(props.productDetails.map((item, index) => {
      return {
        ProductName: item.productName,
        key: index,
        ProductImage: item.productImage,
        ProductCnt: item.productCnt,
        ProductPrice: item.productPrice
      }
    }))
  }, [props.productDetails])

  const setNewImage = (newImageURL, record) => {
    let newTableData = [...tableData]
    const index = newTableData.findIndex((item) => record.key === item.key)
    const newItem = {
      ...newTableData[index],
      ProductImage: newImageURL
    }
    newTableData.splice(index, 1, newItem)
    setTableData(newTableData)
    props.getNewProductDetails(newTableData)
  }

  const tableColums = [
    {
      title: "", key: "image", dataIndex: "ProductImage", width: "150px", align: "center",
      render: (text, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <MyUpload type="product" imageURL={text} getNewImageURL={(newImageURL) => setNewImage(newImageURL, record)}/>
          </div>
        )
      }
    },
    { title: "类别名称", key: "name", dataIndex: "ProductName", width: "140px", align: "center", editable: true },
    { title: "库存数量", key: "cnt", dataIndex: "ProductCnt", width: "140px", align: "center", editable: true },
    { title: "商品定价", key: "price", dataIndex: "ProductPrice", width: "140px", align: "center", editable: true },
    {
      title: "操作", key: "options", align: "center", width: "230px",
      render: (_, record) => {
        const editable = editingKey === record.key
        return editable ? (
          <div className={style.tableButton}>
            <Button onClick={() => tableItemSave(record.key)}>
              保存
            </Button>
            <Button onClick={() => tableItemCancer()}>
              取消
            </Button>
          </div>
        ) : (
          <div className={style.tableButton}>
            <Button disabled={editingKey !== ""} onClick={() => tableItemEdit(record)}>
              编辑
            </Button>
            <Button disabled={editingKey !== ""} onClick={() => tableItemDelete(record.key)}>
              删除
            </Button>
          </div>
        )
      }
    },
  ]

  const mergedColumns = tableColums.map(col => {
    if (!col.editable) return col
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'ProductName' ? 'text' : 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: editingKey === record.key,
      })
    }
  })

  const EditableCell = ({
    dataIndex,
    editing,
    children,
    inputType,
    ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />
    return (
      <td {...restProps}>
        {
          editing ? (
            <div className={style.tableInput}>
              <Form.Item name={dataIndex} style={{ margin: 0 }}>
                {inputNode}
              </Form.Item>
            </div>
          ) : (
            children
          )
        }
      </td>
    )
  }

  return (
    <div className={style.Table}>
      <div className={style.header}>
        <div className={style.headerLabel}>商品类别</div>
        <div className={style.headerTaps}>
          {
            tableData.map((item, index) => <Tag key={index} style={{marginTop: "5px", marginBottom: "5px"}}>{item.ProductName}</Tag>)
          }
        </div>
      </div>
      <div className={style.content}>
        <Form form={form} component={false}>
          <Table
            components={{ body: { cell: EditableCell } }}
            rowSelection={editingKey === "" ? rowSelection : ""}
            columns={mergedColumns}
            dataSource={tableData}
            pagination={false}
          />
        </Form>
      </div>
      <div className={style.tableOption}>
        <div className={style.footerLeft}>
          <Button disabled={selectedRowKeys.length === 0} onClick={() => tableDeleteArr()}>批量删除</Button>
          {selectedRowKeys.length > 0 && <div className={style.cntNum}>共{selectedRowKeys.length}条数据</div>}
        </div>
        <div>
          <Button onClick={() => tableAddItem()}>添加新项</Button>
        </div>
      </div>
    </div>
  )
}
