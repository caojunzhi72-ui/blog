import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentList from './DocumentList';
import { DocumentContext } from '../pages/DocumentManagement';

describe('DocumentList组件', () => {
  // 模拟上下文值
  const mockContextValue = {
    documents: [
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
      }
    ],
    currentDocument: null,
    editDocument: jest.fn(),
    deleteDocument: jest.fn(),
    addDocument: jest.fn(),
    saveDocument: jest.fn()
  };

  test('应正确渲染文档列表', () => {
    render(
      <DocumentContext.Provider value={mockContextValue}>
        <DocumentList />
      </DocumentContext.Provider>
    );

    // 检查标题
    expect(screen.getByText('文档列表')).toBeInTheDocument();

    // 检查文档项
    expect(screen.getByText('项目计划文档')).toBeInTheDocument();
    expect(screen.getByText('产品需求文档')).toBeInTheDocument();

    // 检查文档状态
    expect(screen.getByText('已完成')).toBeInTheDocument();
    expect(screen.getByText('进行中')).toBeInTheDocument();

    // 检查更新日期
    expect(screen.getByText('更新于: 2026-04-18')).toBeInTheDocument();
    expect(screen.getByText('更新于: 2026-04-19')).toBeInTheDocument();

    // 检查内容预览
    expect(screen.getByText(/这是一个项目计划文档的内容/)).toBeInTheDocument();
    expect(screen.getByText(/这是一个产品需求文档的内容/)).toBeInTheDocument();
  });

  test('点击文档项应调用editDocument函数', () => {
    render(
      <DocumentContext.Provider value={mockContextValue}>
        <DocumentList />
      </DocumentContext.Provider>
    );

    // 点击第一个文档项
    const documentItem = screen.getByText('项目计划文档').closest('.document-item');
    fireEvent.click(documentItem);

    // 检查editDocument是否被调用
    expect(mockContextValue.editDocument).toHaveBeenCalledWith(mockContextValue.documents[0]);
  });

  test('点击删除按钮应显示确认对话框并调用deleteDocument函数', () => {
    // 模拟window.confirm
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);

    render(
      <DocumentContext.Provider value={mockContextValue}>
        <DocumentList />
      </DocumentContext.Provider>
    );

    // 点击第一个文档的删除按钮
    const deleteButtons = screen.getAllByText('删除');
    fireEvent.click(deleteButtons[0]);

    // 检查confirm是否被调用
    expect(window.confirm).toHaveBeenCalledWith('确定要删除这个文档吗？');

    // 检查deleteDocument是否被调用
    expect(mockContextValue.deleteDocument).toHaveBeenCalledWith(1);

    // 恢复原始的confirm
    window.confirm = originalConfirm;
  });

  test('点击删除按钮后取消应不调用deleteDocument函数', () => {
    // 模拟window.confirm
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => false);

    // 重置mock函数
    mockContextValue.deleteDocument.mockReset();

    render(
      <DocumentContext.Provider value={mockContextValue}>
        <DocumentList />
      </DocumentContext.Provider>
    );

    // 点击第一个文档的删除按钮
    const deleteButtons = screen.getAllByText('删除');
    fireEvent.click(deleteButtons[0]);

    // 检查confirm是否被调用
    expect(window.confirm).toHaveBeenCalledWith('确定要删除这个文档吗？');

    // 检查deleteDocument是否未被调用
    expect(mockContextValue.deleteDocument).not.toHaveBeenCalled();

    // 恢复原始的confirm
    window.confirm = originalConfirm;
  });

  test('当前编辑的文档应显示为活动状态', () => {
    const contextValueWithCurrentDocument = {
      ...mockContextValue,
      currentDocument: mockContextValue.documents[0]
    };

    render(
      <DocumentContext.Provider value={contextValueWithCurrentDocument}>
        <DocumentList />
      </DocumentContext.Provider>
    );

    // 检查当前文档是否有active类
    const documentItem = screen.getByText('项目计划文档').closest('.document-item');
    expect(documentItem).toHaveClass('active');
  });

  test('空文档列表应正确渲染', () => {
    const contextValueWithEmptyDocuments = {
      ...mockContextValue,
      documents: []
    };

    render(
      <DocumentContext.Provider value={contextValueWithEmptyDocuments}>
        <DocumentList />
      </DocumentContext.Provider>
    );

    // 检查标题
    expect(screen.getByText('文档列表')).toBeInTheDocument();

    // 检查是否没有文档项
    expect(screen.queryByText('项目计划文档')).not.toBeInTheDocument();
  });
});
