import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


export default class RichTextEditor extends Component {
    
    constructor(props) {
        super(props)
        const html = props.detail
        //如果html不为空，转化为文本格式
        if(html){ 
            const contentBlock = htmlToDraft(html)
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState,
            }
        }else{
            //初始化编辑器为空
            this.state = {
                editorState: EditorState.createEmpty(),
              }
        }
      }
    //得到输入文本转化问html格式的标签
    getDetail = ()=>{
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }
    onEditorStateChange = (editorState) => {
        this.setState({
          editorState,
        });
      }
    uploadImageCallBack = (file)=> {
        return new Promise(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/manage/img/upload');
            const data = new FormData();
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
              const response = JSON.parse(xhr.responseText);
              resolve({data:{link:response.data.url}});
            });
            xhr.addEventListener('error', () => {
              const error = JSON.parse(xhr.responseText);
              reject(error);
            });
          }
        );
      }
    render() {
      const { editorState } = this.state;
      return (
        <div>
          <Editor
            editorState={editorState}
            editorStyle={{border:'solid 1px #f0f0f0',minHeight:300,padding:10,color:'gray'}}
            onEditorStateChange={this.onEditorStateChange}
            toolbar={{
                image:{uploadCallback: this.uploadImageCallBack, alt: { present: false, mandatory: false }}
            }}
          />
        </div>
      );
    }
 }  
