# 个人博客项目 - 产品需求文档

## Overview
- **Summary**: 个人博客前后端分离项目，包含前端内容展示和管理系统，实现文档管理和内容发布功能，UI/UX设计参考极简风格。
- **Purpose**: 解决个人内容创作和管理的需求，为用户提供简洁、美观的博客展示和管理平台。
- **Target Users**: 个人博主，需要一个易用的内容管理系统来发布和管理文章。

## Goals
- 构建符合极简设计风格的前端展示界面
- 实现完整的内容管理系统，支持文章和文档的管理
- 提供响应式设计，适配不同设备
- 实现深色模式切换功能
- 提供良好的用户体验和交互效果

## Non-Goals (Out of Scope)
- 不包含用户注册系统（仅管理员登录）
- 不实现评论功能的审核系统
- 不集成第三方社交媒体分享
- 不支持多语言切换（仅中文）

## Background & Context
- 参考设计：[MyBlog-极简博客.html](file:///workspace/MyBlog-极简博客.html)
- 设计风格：极简主义，使用蓝色主色调，支持深色模式
- 技术栈：前端使用React + Tailwind CSS，后端使用Express + PostgreSQL

## Functional Requirements
- **FR-1**: 前端展示功能，包括首页、文章列表、文章详情页
- **FR-2**: 管理系统功能，包括登录、文章管理、文档管理
- **FR-3**: 文章管理功能，支持创建、编辑、发布、下架文章
- **FR-4**: 文档管理功能，支持创建、编辑、删除文档
- **FR-5**: 响应式设计，适配桌面端、平板和移动端
- **FR-6**: 深色模式切换功能
- **FR-7**: 搜索功能，支持文章和文档的搜索

## Non-Functional Requirements
- **NFR-1**: 页面加载速度快，首屏加载时间不超过2秒
- **NFR-2**: 响应式设计，在不同设备上显示正常
- **NFR-3**: 代码结构清晰，易于维护
- **NFR-4**: 安全性，包括密码哈希存储、JWT验证

## Constraints
- **Technical**: React 18 + Tailwind CSS 3 + Express 4 + PostgreSQL
- **Design**: 严格遵循参考HTML的设计风格和配色方案
- **Time**: 项目开发周期为2周

## Assumptions
- 管理员账户通过后端数据库初始化
- 文章和文档存储在数据库中
- 图片存储使用本地文件系统

## Acceptance Criteria

### AC-1: 首页展示
- **Given**: 用户访问网站首页
- **When**: 页面加载完成
- **Then**: 显示最新文章列表，包含标题、摘要、发布日期、分类标签，设计风格与参考HTML一致
- **Verification**: `human-judgment`

### AC-2: 文章详情页
- **Given**: 用户点击文章标题
- **When**: 进入文章详情页
- **Then**: 显示完整文章内容，包含评论区，设计风格与参考HTML一致
- **Verification**: `human-judgment`

### AC-3: 管理员登录
- **Given**: 管理员访问登录页面
- **When**: 输入正确的邮箱和密码
- **Then**: 成功登录并进入管理系统
- **Verification**: `programmatic`

### AC-4: 文章管理
- **Given**: 管理员在管理系统中
- **When**: 点击文章管理
- **Then**: 显示所有文章列表，可进行编辑、发布、下架操作
- **Verification**: `human-judgment`

### AC-5: 内容编辑
- **Given**: 管理员创建或编辑文章
- **When**: 使用富文本编辑器
- **Then**: 可编辑文章内容，支持图片上传，实时预览
- **Verification**: `human-judgment`

### AC-6: 文档管理
- **Given**: 管理员在管理系统中
- **When**: 点击文档管理
- **Then**: 显示文档列表，可进行创建、编辑、删除操作
- **Verification**: `human-judgment`

### AC-7: 发布/下架功能
- **Given**: 管理员在文章管理中
- **When**: 点击发布/下架按钮
- **Then**: 文章状态切换，前端显示/隐藏该文章
- **Verification**: `programmatic`

### AC-8: 深色模式
- **Given**: 用户点击设置按钮
- **When**: 切换深色模式开关
- **Then**: 网站整体切换到深色主题，设计风格与参考HTML一致
- **Verification**: `human-judgment`

### AC-9: 响应式设计
- **Given**: 用户在不同设备上访问网站
- **When**: 调整屏幕尺寸
- **Then**: 网站布局自动适配，移动端显示汉堡菜单
- **Verification**: `human-judgment`

## Open Questions
- [ ] 是否需要支持Markdown编辑？
- [ ] 文件存储是使用本地还是云存储？
- [ ] 是否需要添加评论审核功能？
- [ ] 是否需要添加SEO优化功能？