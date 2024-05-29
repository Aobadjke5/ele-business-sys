import { Upload, message } from "antd";
import { useEffect, useState } from "react";
import { fileUploadApi } from "../../api/File/UploadApi";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import ImgCrop from 'antd-img-crop';

export default function MyUpload(props) {
  const [imageUrl, setImageUrl] = useState(props.imageURL === "" ? "" : import.meta.env.VITE_API_BASE_URL + props.imageURL)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setImageUrl(props.imageURL === "" ? "" : import.meta.env.VITE_API_BASE_URL + props.imageURL)
  }, [props.imageURL])

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('图片格式错误！')
      return false
    }

    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('上传图片最大不能超过2MB!')
      return false
    }
    return true
  }

  const handleUpload = (options) => {
    const { onSuccess, onError, file } = options
    setLoading(true)
    fileUploadApi(file, props.type).then(res => {
      console.log(res)
      props.getNewImageURL(res.data.FileURL)
      setImageUrl(import.meta.env.VITE_API_BASE_URL + res.data.FileURL)
      setLoading(false)
      onSuccess(res.data, file)
    }).catch(err => {
      if (err.code === 40004) {
        navigate("/login")
      }
      setLoading(false)
      onError(err)
    })
  }

  const onPreview = async (file) => {
    console.log(file)
    let src = file.url
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  return (
    <>
      <ImgCrop rotationSlider>
        <Upload
          className={props.className}
          listType="picture-card"
          showUploadList={false}
          beforeUpload={beforeUpload}
          customRequest={handleUpload}
          onPreview={onPreview}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="image" style={{ width: '100%' }} />
          ) : (
            <div>
              {loading ? <LoadingOutlined /> : <PlusOutlined />}
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </ImgCrop>
    </>
  )
}
