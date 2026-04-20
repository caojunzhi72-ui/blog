import React, { useState, useEffect } from 'react';
import { useDocument } from '../pages/DocumentManagement';

function DocumentEditor() {
  const { currentDocument, saveDocument } = useDocument();
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    status: '待开始'
  });

  // 当当前文档变化时，更新编辑表单
  useEffect(() => {
    if (currentDocument) {
      setEditForm({
        title: currentDocument.title,
        content: currentDocument.content,
        status: currentDocument.status
      });
    }
  }, [currentDocument]);

  // 处理表单输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentDocument) {
      saveDocument({
        ...currentDocument,
        ...editForm
      });
    }
  };

  if (!currentDocument) {
    return (
      <div className="document-editor">
        <h2>文档编辑器</h2>
        <div className="editor-placeholder" data-testid="editor-placeholder">
          <p>请从左侧选择一个文档进行编辑，或点击"新建文档"创建新文档</p>
        </div>
      </div>
    );
  }

  return (
    <div className="document-editor">
      <h2>文档编辑器</h2>
      <form onSubmit={handleSubmit} className="editor-form">
        <div className="form-group">
          <label htmlFor="title">文档标题</label>
          <input
            type="text"
            id="title"
            name="title"
            value={editForm.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">文档内容</label>
          <textarea
            id="content"
            name="content"
            value={editForm.content}
            onChange={handleChange}
            rows={10}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="status">文档状态</label>
          <select
            id="status"
            name="status"
            value={editForm.status}
            onChange={handleChange}
          >
            <option value="待开始">待开始</option>
            <option value="进行中">进行中</option>
            <option value="已完成">已完成</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="save-btn">保存文档</button>
        </div>
      </form>
      <div className="document-meta-info">
        <p>创建于: {currentDocument.createdAt}</p>
        <p>更新于: {currentDocument.updatedAt}</p>
      </div>
    </div>
  );
}

export default DocumentEditor;