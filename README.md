# 上课点名与刮刮乐抽奖工具

一个帮助老师在课堂上进行随机点名和刮刮乐抽奖的Web应用工具。

## 功能特点

### 随机点名功能

- **学生名单管理**：支持手动输入学生名单或从文件导入（支持CSV、TXT和Excel格式）
- **随机点名**：一键随机抽取学生进行点名
- **动画效果**：点名时有动态切换效果和庆祝动画
- **历史记录**：保存已点名学生的历史记录，避免重复点名
- **本地存储**：自动保存学生名单和点名记录

### 刮刮乐抽奖功能

- **真实刮刮卡体验**：使用鼠标或触摸屏刮开涂层查看奖励
- **奖品自定义**：可以自定义奖品内容和中奖概率
- **视觉和音效**：中奖时触发庆祝粒子效果和音效
- **触摸屏支持**：完全兼容触摸设备操作

## 使用方法

### 安装和运行

1. 克隆或下载本项目代码
2. 直接在浏览器中打开`index.html`文件即可使用

### 随机点名

1. 在左侧文本框中输入学生名单，每行一个名字
2. 或者点击"导入名单文件"上传CSV、TXT或Excel文件
3. 点击"保存名单"按钮保存学生列表
4. 点击"随机点名"按钮开始点名
5. 点名结果将显示在中间区域，同时记录到历史记录
6. 需要重置点名记录时，点击"重置已点名单"按钮

### 刮刮乐抽奖

1. 在设置区域可以自定义奖品内容和中奖概率
2. 点击"保存设置"按钮保存设置
3. 点击"新刮刮卡"按钮生成一张新的刮刮卡
4. 用鼠标或手指刮开涂层查看是否中奖
5. 中奖时将自动显示庆祝效果

## 技术实现

- 纯原生HTML、CSS和JavaScript开发
- 使用Canvas API实现刮刮乐效果
- 使用CSS动画和JavaScript实现粒子特效
- 使用localStorage实现本地数据存储
- 使用Web Audio API实现音效

## 浏览器兼容性

支持所有现代浏览器：
- Chrome
- Firefox
- Edge
- Safari
- 移动浏览器

## 本地存储说明

本应用使用浏览器的localStorage存储以下数据：
- 学生名单
- 已点名学生记录
- 刮刮乐设置（奖品内容和中奖概率）

清空浏览器缓存会导致这些数据丢失。

## 许可证

MIT许可证 