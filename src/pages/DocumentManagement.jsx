import React, { useState, createContext, useContext } from 'react';
import DocumentList from '../components/DocumentList';
import DocumentEditor from '../components/DocumentEditor';

// 创建文档上下文
export const DocumentContext = createContext();

function DocumentManagement() {
  // 文档数据状态
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: '项目计划文档',
      content: '这是一个项目计划文档的内容...',
      status: '已完成',
      createdAt: '2026-04-15',
      updatedAt: '2026-04-18'
    },
    {
      id: 2,
      title: '产品需求文档',
      content: '这是一个产品需求文档的内容...',
      status: '进行中',
      createdAt: '2026-04-16',
      updatedAt: '2026-04-19'
    },
    {
      id: 3,
      title: '技术架构文档',
      content: '这是一个技术架构文档的内容...',
      status: '待开始',
      createdAt: '2026-04-17',
      updatedAt: '2026-04-17'
    }
  ]);

  // 当前编辑的文档
  const [currentDocument, setCurrentDocument] = useState(null);

  // 添加新文档
  const addDocument = () => {
    const newDoc = {
      id: Date.now(),
      title: '新文档',
      content: '',
      status: '待开始',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [...prev, newDoc]);
    setCurrentDocument(newDoc);
  };

  // 编辑文档
  const editDocument = (doc) => {
    setCurrentDocument(doc);
  };

  // 保存文档
  const saveDocument = (updatedDoc) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === updatedDoc.id ? { ...updatedDoc, updatedAt: new Date().toISOString().split('T')[0] } : doc
    ));
  };

  // 删除文档
  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    if (currentDocument && currentDocument.id === id) {
      setCurrentDocument(null);
    }
  };

  return (
    <DocumentContext.Provider value={{ 
      documents, 
      currentDocument, 
      addDocument, 
      editDocument, 
      saveDocument, 
      deleteDocument 
    }}>
      <div className="document-management">
        <header className="document-header">
          <h1>文档管理系统</h1>
          <button className="add-document-btn" onClick={addDocument}>+ 新建文档</button>
        </header>
        <div className="document-content">
          <DocumentList />
          <DocumentEditor />
        </div>
      </div>
    </DocumentContext.Provider>
  );
}

// 导出上下文钩子
export const useDocument = () => useContext(DocumentContext);

export default DocumentManagement;