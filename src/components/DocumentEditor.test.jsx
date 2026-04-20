import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentEditor from './DocumentEditor';
import { DocumentContext } from '../pages/DocumentManagement';

describe('DocumentEditor组件', () => {
  // 模拟上下文值
  const mockContextValue = {
    currentDocument: null,
    saveDocument: jest.fn(),
    documents: [],
    addDocument: jest.fn(),
    editDocument: jest.fn(),
    deleteDocument: jest.fn()
  };

  const mockDocument = {
    id: 1,
    title: '项目计划文档',
    content: '这是一个项目计划文档的内容...',
    status: '已完成',
    createdAt: '2026-04-15',
    updatedAt: '2026-04-18'
  };

  test('当没有选中文档时应显示占位符', () => {
    render(
      <DocumentContext.Provider value={mockContextValue}>
        <DocumentEditor />
      </DocumentContext.Provider>
    );

    // 检查标题
    expect(screen.getByText('文档编辑器')).toBeInTheDocument();

    // 检查占位符
    expect(screen.getByTestId('editor-placeholder')).toBeInTheDocument();
    expect(screen.getByText('请从左侧选择一个文档进行编辑，或点击"新建文档"创建新文档')).toBeInTheDocument();
  });

  test('当选中文档时应显示编辑表单', () => {
    const contextValueWithDocument = {
      ...mockContextValue,
      currentDocument: mockDocument
    };

    render(
      <DocumentContext.Provider value={contextValueWithDocument}>
        <DocumentEditor />
      </DocumentContext.Provider>
    );

    // 检查标题
    expect(screen.getByText('文档编辑器')).toBeInTheDocument();

    // 检查表单
    expect(screen.getByLabelText('文档标题')).toBeInTheDocument();
    expect(screen.getByLabelText('文档内容')).toBeInTheDocument();
    expect(screen.getByLabelText('文档状态')).toBeInTheDocument();

    // 检查表单值
    expect(screen.getByDisplayValue('项目计划文档')).toBeInTheDocument();
    expect(screen.getByDisplayValue('这是一个项目计划文档的内容...')).toBeInTheDocument();
    expect(screen.getByDisplayValue('已完成')).toBeInTheDocument();

    // 检查文档元信息
    expect(screen.getByText('创建于: 2026-04-15')).toBeInTheDocument();
    expect(screen.getByText('更新于: 2026-04-18')).toBeInTheDocument();
  });

  test('表单输入应正确更新', () => {
    const contextValueWithDocument = {
      ...mockContextValue,
      currentDocument: mockDocument
    };

    render(
      <DocumentContext.Provider value={contextValueWithDocument}>
        <DocumentEditor />
      </DocumentContext.Provider>
    );

    // 测试标题输入
    const titleInput = screen.getByLabelText('文档标题');
    fireEvent.change(titleInput, { target: { value: '更新的标题' } });
    expect(titleInput.value).toBe('更新的标题');

    // 测试内容输入
    const contentInput = screen.getByLabelText('文档内容');
    fireEvent.change(contentInput, { target: { value: '更新的内容' } });
    expect(contentInput.value).toBe('更新的内容');

    // 测试状态选择
    const statusSelect = screen.getByLabelText('文档状态');
    fireEvent.change(statusSelect, { target: { value: '进行中' } });
    expect(statusSelect.value).toBe('进行中');
  });

  test('提交表单应调用saveDocument函数', () => {
    const contextValueWithDocument = {
      ...mockContextValue,
      currentDocument: mockDocument
    };

    render(
      <DocumentContext.Provider value={contextValueWithDocument}>
        <DocumentEditor />
      </DocumentContext.Provider>
    );

    // 更新表单值
    const titleInput = screen.getByLabelText('文档标题');
    fireEvent.change(titleInput, { target: { value: '更新的标题' } });

    const contentInput = screen.getByLabelText('文档内容');
    fireEvent.change(contentInput, { target: { value: '更新的内容' } });

    const statusSelect = screen.getByLabelText('文档状态');
    fireEvent.change(statusSelect, { target: { value: '进行中' } });

    // 提交表单
    const saveButton = screen.getByText('保存文档');
    fireEvent.click(saveButton);

    // 检查saveDocument是否被调用，并且传递了正确的参数
    expect(mockContextValue.saveDocument).toHaveBeenCalledWith({
      ...mockDocument,
      title: '更新的标题',
      content: '更新的内容',
      status: '进行中'
    });
  });

  test('切换文档应更新表单内容', () => {
    // 初始渲染时没有文档
    const { rerender } = render(
      <DocumentContext.Provider value={mockContextValue}>
        <DocumentEditor />
      </DocumentContext.Provider>
    );

    // 检查占位符
    expect(screen.getByTestId('editor-placeholder')).toBeInTheDocument();

    // 重新渲染，传入一个文档
    const contextValueWithDocument = {
      ...mockContextValue,
      currentDocument: mockDocument
    };

    rerender(
      <DocumentContext.Provider value={contextValueWithDocument}>
        <DocumentEditor />
      </DocumentContext.Provider>
    );

    // 检查表单是否显示文档内容
    expect(screen.getByDisplayValue('项目计划文档')).toBeInTheDocument();

    // 重新渲染，传入另一个文档
    const anotherDocument = {
      id: 2,
      title: '产品需求文档',
      content: '这是一个产品需求文档的内容...',
      status: '待开始',
      createdAt: '2026-04-16',
      updatedAt: '2026-04-16'
    };

    const contextValueWithAnotherDocument = {
      ...mockContextValue,
      currentDocument: anotherDocument
    };

    rerender(
      <DocumentContext.Provider value={contextValueWithAnotherDocument}>
        <DocumentEditor />
      </DocumentContext.Provider>
    );

    // 检查表单是否显示新文档内容
    expect(screen.getByDisplayValue('产品需求文档')).toBeInTheDocument();
    expect(screen.getByDisplayValue('待开始')).toBeInTheDocument();
  });
});
