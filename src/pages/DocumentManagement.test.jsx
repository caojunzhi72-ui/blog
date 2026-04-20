import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentManagement, { DocumentContext } from './DocumentManagement';

// 模拟子组件的导入
jest.mock('../components/DocumentList', () => {
  return function MockDocumentList() {
    return (
      <div data-testid="document-list">
        <h2>文档列表</h2>
        <div data-testid="document-item-1">
          <h3>项目计划文档</h3>
          <button data-testid="edit-btn-1">编辑</button>
          <button data-testid="delete-btn-1">删除</button>
        </div>
        <div data-testid="document-item-2">
          <h3>产品需求文档</h3>
          <button data-testid="edit-btn-2">编辑</button>
          <button data-testid="delete-btn-2">删除</button>
        </div>
        <div data-testid="document-item-3">
          <h3>技术架构文档</h3>
          <button data-testid="edit-btn-3">编辑</button>
          <button data-testid="delete-btn-3">删除</button>
        </div>
      </div>
    );
  };
});

jest.mock('../components/DocumentEditor', () => {
  return function MockDocumentEditor() {
    return (
      <div data-testid="document-editor">
        <h2>文档编辑器</h2>
        <div data-testid="editor-placeholder">
          <p>请从左侧选择一个文档进行编辑，或点击"新建文档"创建新文档</p>
        </div>
      </div>
    );
  };
});

describe('DocumentManagement组件', () => {
  test('初始渲染时应显示文档列表和编辑器占位符', () => {
    render(<DocumentManagement />);
    
    // 检查标题
    expect(screen.getByText('文档管理系统')).toBeInTheDocument();
    
    // 检查新建文档按钮
    expect(screen.getByText('+ 新建文档')).toBeInTheDocument();
    
    // 检查文档列表
    expect(screen.getByTestId('document-list')).toBeInTheDocument();
    
    // 检查初始文档
    expect(screen.getByTestId('document-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('document-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('document-item-3')).toBeInTheDocument();
    
    // 检查编辑器占位符
    expect(screen.getByTestId('editor-placeholder')).toBeInTheDocument();
  });

  test('点击新建文档按钮应添加新文档并显示在编辑器中', () => {
    render(<DocumentManagement />);
    
    // 点击新建文档按钮
    fireEvent.click(screen.getByText('+ 新建文档'));
    
    // 检查新文档是否在编辑器中显示
    expect(screen.getByTestId('current-document')).toBeInTheDocument();
  });

  test('点击编辑按钮应在编辑器中显示对应文档', () => {
    render(<DocumentManagement />);
    
    // 点击第一个文档的编辑按钮
    fireEvent.click(screen.getByTestId('edit-btn-1'));
    
    // 检查文档是否在编辑器中显示
    expect(screen.getByTestId('current-document')).toBeInTheDocument();
    expect(screen.getByText('项目计划文档')).toBeInTheDocument();
  });

  test('点击删除按钮应删除对应文档', () => {
    render(<DocumentManagement />);
    
    // 点击第一个文档的删除按钮
    fireEvent.click(screen.getByTestId('delete-btn-1'));
    
    // 检查文档是否被删除
    expect(screen.queryByTestId('document-item-1')).not.toBeInTheDocument();
  });


});
