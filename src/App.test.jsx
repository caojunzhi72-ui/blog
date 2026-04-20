import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('文档管理系统集成测试', () => {
  test('完整的文档管理流程', async () => {
    render(<App />);

    // 1. 初始状态 - 检查文档列表和编辑器占位符
    expect(screen.getByText('文档管理系统')).toBeInTheDocument();
    expect(screen.getByText('+ 新建文档')).toBeInTheDocument();
    expect(screen.getByText('文档列表')).toBeInTheDocument();
    expect(screen.getByText('文档编辑器')).toBeInTheDocument();
    expect(screen.getByText('请从左侧选择一个文档进行编辑，或点击"新建文档"创建新文档')).toBeInTheDocument();

    // 2. 测试新建文档
    fireEvent.click(screen.getByText('+ 新建文档'));
    
    // 检查新文档是否在编辑器中打开
    expect(screen.getByLabelText('文档标题')).toBeInTheDocument();
    expect(screen.getByDisplayValue('新文档')).toBeInTheDocument();

    // 3. 测试编辑文档
    const titleInput = screen.getByLabelText('文档标题');
    fireEvent.change(titleInput, { target: { value: '测试文档' } });

    const contentInput = screen.getByLabelText('文档内容');
    fireEvent.change(contentInput, { target: { value: '这是测试文档的内容' } });

    const statusSelect = screen.getByLabelText('文档状态');
    fireEvent.change(statusSelect, { target: { value: '进行中' } });

    // 4. 测试保存文档
    fireEvent.click(screen.getByText('保存文档'));

    // 5. 测试文档是否出现在列表中
    expect(screen.getByText('测试文档')).toBeInTheDocument();
    // 检查文档状态，使用更具体的选择器
    const testDocumentItem = screen.getByText('测试文档').closest('.document-item');
    expect(testDocumentItem).toBeInTheDocument();

    // 6. 测试选择文档进行编辑
    fireEvent.click(testDocumentItem);

    // 检查文档是否在编辑器中打开
    expect(screen.getByDisplayValue('测试文档')).toBeInTheDocument();
    expect(screen.getByDisplayValue('这是测试文档的内容')).toBeInTheDocument();
    expect(screen.getByDisplayValue('进行中')).toBeInTheDocument();

    // 7. 测试删除文档
    // 模拟window.confirm
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);

    // 找到测试文档的删除按钮
    const deleteButton = testDocumentItem.querySelector('.delete-btn');
    fireEvent.click(deleteButton);

    // 检查文档是否被删除
    expect(screen.queryByText('测试文档')).not.toBeInTheDocument();

    // 恢复原始的confirm
    window.confirm = originalConfirm;
  });

  test('编辑现有文档', () => {
    render(<App />);

    // 选择一个现有文档
    const existingDocument = screen.getByText('项目计划文档').closest('.document-item');
    fireEvent.click(existingDocument);

    // 检查文档是否在编辑器中打开
    expect(screen.getByDisplayValue('项目计划文档')).toBeInTheDocument();
    expect(screen.getByDisplayValue('这是一个项目计划文档的内容...')).toBeInTheDocument();
    expect(screen.getByDisplayValue('已完成')).toBeInTheDocument();

    // 编辑文档
    const titleInput = screen.getByLabelText('文档标题');
    fireEvent.change(titleInput, { target: { value: '更新的项目计划文档' } });

    // 保存文档
    fireEvent.click(screen.getByText('保存文档'));

    // 检查文档是否被更新
    expect(screen.getByText('更新的项目计划文档')).toBeInTheDocument();
  });

  test('删除现有文档', () => {
    render(<App />);

    // 模拟window.confirm
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);

    // 找到第一个文档的删除按钮
    const firstDocument = screen.getByText('项目计划文档').closest('.document-item');
    const deleteButton = firstDocument.querySelector('.delete-btn');
    fireEvent.click(deleteButton);

    // 检查文档是否被删除
    expect(screen.queryByText('项目计划文档')).not.toBeInTheDocument();

    // 恢复原始的confirm
    window.confirm = originalConfirm;
  });
});
