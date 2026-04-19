import React from 'react';
import { useDocument } from '../pages/DocumentManagement';

function DocumentList() {
  const { documents, editDocument, deleteDocument, currentDocument } = useDocument();

  return (
    <div className="document-list">
      <h2>文档列表</h2>
      <div className="documents-container">
        {documents.map(doc => (
          <div 
            key={doc.id} 
            className={`document-item ${currentDocument?.id === doc.id ? 'active' : ''}`}
            onClick={() => editDocument(doc)}
          >
            <div className="document-item-header">
              <h3>{doc.title}</h3>
              <div className="document-item-actions">
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('确定要删除这个文档吗？')) {
                      deleteDocument(doc.id);
                    }
                  }}
                >
                  删除
                </button>
              </div>
            </div>
            <div className="document-item-meta">
              <span className={`status-badge ${doc.status}`}>{doc.status}</span>
              <span className="date">更新于: {doc.updatedAt}</span>
            </div>
            <div className="document-item-preview">
              {doc.content.substring(0, 100)}...
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DocumentList;