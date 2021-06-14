import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { reqDeleteImg } from '../../api';
import { BASE_IMG_URL } from '../../utils/constants';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {
    static propTypes = {
        imgs:PropTypes.array //图片必须为数组但可以为空
    }
    constructor(props){
        super(props)
        let fileList = []
        const {imgs} = props
        if(imgs && imgs.length>0){
            fileList = imgs.map((img,index)=>{
                return {
                    uid: -index,
                    name: img,
                    status: 'done',
                    url: BASE_IMG_URL+img,
                  }
            })
        }
        this.state = {
            previewVisible: false, //是否显示大图
            previewImage: '', //大图的URL
            fileList //上传的文件列表
        }
    }
  

  
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      //previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  //file:当前操作的文件对象,可能是是正在删除的图或上传的图
  handleChange =  async ({ file,fileList }) => {

    if(file.status === 'done'){
        const result = file.response
        if(result.status === 0){
            message.success('图片上传成功！')
            const {name,url} = result.data
            file = fileList[fileList.length - 1] // 将file引用指向fileList
            file.name = name
            file.url = url
        }else
            message.error('图片上传失败')
    }else if(file.status === 'removed'){
        const result = await reqDeleteImg(file.name)
        if(result.status === 0){
            message.success('图片删除成功啦！')
        }else{
            message.error('图片删除失败！')
        }
    }
    this.setState({ fileList })
    //console.log(file,fileList)
  };
  //获取后端图片设置名保存数组
  getImgs = ()=>{
      const {fileList} = this.state
      return fileList.map(file=>{
          return file.name
      })
  }
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>上传</div>
      </div>
    );
    return (
      <>
        <Upload
          action="/manage/img/upload" // 上传请求接口
          accept='image/*'//上传文件类型
          name='image' //请求参数名
          listType="picture-card"
          fileList={fileList} //上传文件数量
          onPreview={this.handlePreview} // 图片显示大图的回调
          onChange={this.handleChange}  // 图片上传过程中的回调
        >
          {fileList.length >= 2 ? null : uploadButton} 
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
