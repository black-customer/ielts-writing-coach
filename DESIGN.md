---
name: "IELTS Writing Coach — Desktop Workbench"
description: "安静、精密的电脑端写作工作台"
colors:
  primary: "#294D73"
  primary-hover: "#203F5E"
  primary-soft: "#E8EEF4"
  primary-ink: "#234363"
  fog: "#F3F5F7"
  paper: "#FFFFFF"
  ink: "#202936"
  muted: "#647080"
  line: "#DCE2E8"
  line-strong: "#BDC7D2"
  accent-bg: "#EEF2F6"
  ok: "#267054"
  ok-bg: "#EDF5F0"
  ok-border: "#C7DDCF"
  warn: "#85602B"
  warn-bg: "#F7F2E9"
  warn-border: "#E6D7BB"
  bad: "#A23F43"
  bad-bg: "#FAEFEF"
  bad-border: "#EACFD0"
typography:
  headline:
    fontFamily: "'Segoe UI', 'Microsoft YaHei', -apple-system, sans-serif"
    fontSize: "27px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  title:
    fontFamily: "'Segoe UI', 'Microsoft YaHei', -apple-system, sans-serif"
    fontSize: "19px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Segoe UI', 'Microsoft YaHei', -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "'Segoe UI', 'Microsoft YaHei', -apple-system, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.7
  essay:
    fontFamily: "Georgia, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.8
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  sp-1: "4px"
  sp-2: "8px"
  sp-3: "12px"
  sp-4: "16px"
  sp-5: "24px"
  sp-6: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "9px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.paper}"
  button-primary-active:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.paper}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "9px 16px"
  input-text:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
  navigation-item:
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
    width: "100%"
  navigation-item-active:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
  chip-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "5px 14px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "24px"
  editor-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.essay}"
    rounded: "{rounded.md}"
    padding: "32px 40px"
  annotation-mark:
    backgroundColor: "{colors.warn-bg}"
    textColor: "{colors.ink}"
    padding: "1px 0"
  save-status:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
---

# Design System: IELTS Writing Coach — Desktop Workbench

## Overview

**Creative North Star: "安静、精密的写作工作台"**

安静、精密的写作工作台。界面退后、内容向前：雾灰工作区衬托纸面式编辑区，墨色承载正文，深蓝标记操作与定位。系统 UI 字体组织中文界面，Georgia 承载英文作文与参考文本。

密度服务持续写作、阅读反馈与改写。细线分隔、克制圆角和色调层次建立秩序；保存与反馈状态用明确文字呈现，可定位批注把问题与原句连接起来。此文是对已确认方向和当前实现的刷新，数值以 frontmatter 与现有 CSS 为准。

**Key Characteristics:**

- 雾灰、纸白、墨色与深蓝组成工作环境。
- 系统 UI 字体与 Georgia 分担界面和英文阅读。
- 平面容器、细线分隔、可见焦点与真实状态。
- 桌面正文与辅助栏并行，允许手动收起辅助栏。

## Colors

色彩在雾灰与纸白的中性背景上组织阅读，深蓝负责操作强调。frontmatter 记录默认浅色主题的可复用值；深色替换值、预览色阶和主题行为记录于 `.impeccable/design.json`。

### Primary

- **深蓝**（`primary`）：主按钮、激活筛选、链接与键盘焦点；按钮悬停使用 `primary-hover`。
- **浅蓝纸面**（`primary-soft`）：导航激活底与选中批注；`primary-ink` 用于适合软底的强调文字。

### Neutral

- **雾灰**（`fog`）退为页面背景；**纸白**（`paper`）承载卡片、编辑纸张和侧栏。
- **墨色**（`ink`）承载正文；**辅助灰**（`muted`）承载提示与次级信息。
- **分隔灰**（`line` / `line-strong`）区分容器和输入描边；**浅灰蓝**（`accent-bg`）用于悬停、次级信息和选中批注条目。

### Semantic

成功、警告、错误分别使用 `ok`、`warn`、`bad` 及对应背景与描边。原文高亮与收藏星标使用警告色；颜色伴随标签、文字或图形含义。

**The One Accent Rule.** 深蓝承担操作和选中强调；成功、警告与错误色只表达对应状态，不承担装饰。

设计源是先加载的 `tool/css/style.css` 与后加载的 `tool/css/workbench.css`。后者覆盖工作台主色与组件；基础层仍保留部分旧教学语义色，不能把这次提取解释成所有旧值已被替换。深色主题由 `body.dark` 切换：蓝黑背景、较深纸面、浅蓝强调色、独立语义色，而非简单反色。

## Typography

系统无衬线字体组织中文界面；Georgia 与 Times New Roman 回退承载英文参考文本。连续作文编辑、诊断原稿和个人改写使用 frontmatter 的 `essay` 角色。并非所有英文片段都强制使用同一字号。

补充字号角色：17px 用于范文正文，16px 用于选题区域标题和引用证据，13px 用于搜索提示和列表预览，11px 用于批注类型和页脚。连续阅读保持约 72ch 行宽；搜索结果数使用等宽数字。

- **Headline**：页面标题，旁边可放一行说明和次级统计。
- **Title**：章节标题；较小小节标题使用现有实现（15px / 600）。
- **Body**：常规界面文本。导航为较紧凑字号（13px），品牌为较大字号（17px）。
- **Label**：提示、编辑区标签与保存状态。默认表单字段在基础层仍为（15.5px），写作题目字段另用（14px）。
- **Essay**：连续编辑与原稿阅读。主作文编辑器和诊断原稿限制行宽（72ch）；逐段训练的文本区没有单独的 72ch CSS 上限。
- 计时器与统计在已声明的组件中使用等宽数字；不要推断为所有数字的全局设置。

各册练习覆盖数字使用（19px）与强调文字色；覆盖数量只表达该册练习完成情况，不代替写作分数。

**The Essay First Rule.** 界面文字使用系统无衬线字体，连续作文与诊断原稿使用 Georgia；正文可读性优先于界面装饰。

## Layout

本项目默认面向电脑端浏览器。不规划、不开发手机端 App，手机端专项设计、适配和验收不纳入默认开发范围。只有项目所有者明确重新提出手机端需求时，才能调整此约束。不得因通用最佳实践、工具建议或框架能力而自行扩展手机端开发范围。

主要验收电脑端（1280 / 1440 / 1600px）、明暗主题和 125% 浏览器缩放。保留现有窄屏回退，不安排手机端专项开发或验收。

桌面边界在（1000px）启用固定侧栏（216px）和主区左偏移。主区上限为（1480px），常规内边距为（38px 36px 64px）；（1500px）起水平内边距增至（52px）。在（1000–1199px）区间主区内边距收紧为（32px 24px），辅助栏从（336px）缩至（300px）。

写作区由弹性正文与教学栏组成，常规列间距（24px）；教学栏在滚动时保持于顶部偏移（24px），并可内部滚动。工具按钮允许用户手动收起教学栏，正文随之占满可用宽度。独立写作的题目留在正文上方；正文后的底部状态与操作条集中呈现字数、句数、计时器及其开始/重置控制、保存状态与写作操作。该条位于正常文档流中，随页面滚动，不固定于屏幕底部。计时控制在栏内横向排列，分组名称为“写作计时”，计时读数使用 timer 语义与 aria-live="off"，避免逐秒播报；引导训练的计时行为沿用现有实现。

诊断区是弹性原稿加辅助批注栏（336px），间距（32px）。并排改写时变为两等分正文栏，批注移至下方通栏。专注模式隐藏侧栏、页标题、页脚与教学栏，主区居中并限制为（980px）；Escape 退出。当前实现记录并恢复编辑器选区，不把该行为推广为所有操作永不转移焦点。

**The Explicit Panel Rule.** 教学面板由用户手动切换；不要把现有桌面布局描述为自动收起面板。

## Elevation & Depth

层次主要由纸面、浅底与细线建立。常驻卡片、题目卡、编辑纸张和教学栏不带投影；嵌套内容通常用顶部或底部分隔线展开。通知作为临时浮层使用中性投影（`0 8px 28px rgba(0,0,0,.15)`）；原生对话框用遮罩（`rgba(15,25,35,.45)`）区分模态状态。

**The Flat Surface Rule.** 常驻卡片与编辑纸张用边框和色调区分层级，不通过彩色发光或悬停抬升制造深度。

## Shapes

按钮、输入框和导航使用轻柔小圆角（`sm`）；纸张、主容器和诊断工作区使用较大圆角（`md`）；现有闪卡保留更宽圆角（`lg`）。筛选标签为胶囊，正文高亮仅用微小圆角（2px）。通知和对话框另保留当前形状（10px / 14px）。训练覆盖进度条使用小圆角（`sm`），高度为（12px）。边框通常为细线（1px），原文高亮用下边线建立可定位含义。

## Components

### Buttons, inputs and navigation

按钮默认高度下限（36px），小按钮为（32px）；今日学习的部分操作沿用（44px）下限。主按钮使用深蓝与纸白，次级按钮使用纸面与细线描边，具体页面保持清楚的主要动作层级。深色主按钮转为浅蓝底与深墨文字。导航左对齐并配细线 SVG，激活时软色底与加重字重；筛选和分页选中态采用实色强调底。

主按钮按压态在浅色主题沿用较深悬停底色；深色主题提供独立的浅蓝按压底（#BBD2E9）与深墨前景（#172432），悬停底为较浅蓝色（#C6DBF0）。这些状态值记录于 sidecar，不构成完整对比度认证。

按钮与导航保留悬停、键盘焦点和禁用状态。普通可聚焦操作使用（2px）强调色 outline 与（3px）偏移；输入框聚焦用边框变色与软色 outline。编辑纸张聚焦时外框变色，作文文本区本身无额外描边。图标是内联 SVG（18px / 1.6 线宽 / currentColor）；星标使用语义色 SVG。

### Cards and editor sheet

卡片使用纸面、细线与内部留白；内部内容避免继续堆叠完整卡片外框。纸张式编辑区有舒展内边距，标签在上方，Georgia 作文在下方。教学内容以分隔线和较淡的信息底组织，不抢占正文的视觉主位。

### Annotation workbench

批注原文使用警告软底与下边线，选中时转为强调软底。点击批注定位原句，点击原文标记选择对应批注；重复引文提供出现位置选择。前三项展开，其余进入“其他检查项”折叠区。输入变更后，旧反馈显示版本提示文字。并排改写改变布局，而不是用新的浮层覆盖原稿。

同一原句的反馈合并为一项，类型以文字区分明确错误、需要核对和可选建议。首要修改目标给出证据、原因、动作与折叠自查标准；参考改写默认折叠，评分详情不重复罗列句子批注。

### Search and continuation

搜索框、筛选和清除按钮在同一区域，结果数量位于列表之前。范文每页 12 篇，题库与 Simon 范文沿用每页 15 项；无结果提供缩短关键词或清除筛选的建议。详情返回恢复列表位置和触发项焦点。

首页默认收起完整选题列表，继续草稿和当前修改任务优先呈现。整篇草稿与段落训练分别命名；换题保留的原稿通过现有首页折叠区恢复。引导使用原生 dialog，Escape 与跳过均记住完成状态。

### Save status, notices and dialogs

保存状态用内联文字区分保存中、已保存与失败，失败文字使用错误色。状态条保留重试或复制相关出口，具体持久化行为由功能实现和测试确认。非阻塞通知固定在右下角（24px / 最大宽度 430px），普通提示自动消失，错误提示保留；关闭、重试等按钮可以获得焦点。删除或覆盖等确认由原生 `dialog` 承担，可达性名称为“确认操作”（aria-label），取消和关闭后恢复先前焦点。

“关于本工具”也使用原生对话框和同一纸面、边框与遮罩，内容宽度上限扩展为（560px），实际宽度为（100vw − 48px）；普通确认对话框的宽度上限为（480px）。底部错误横幅使用错误色背景与纸面色文字（`bad` / `paper`），横跨视口；它与正常文档流的作文保存状态条是不同控件。

**The Visible State Rule.** 保存中、保存成功、保存失败与旧版反馈必须使用可见文字；不要只依赖颜色。

按钮颜色过渡与通知入场使用（180ms）；通知轻移（6px），不以大幅移动干扰写作。页面切换不播放旧入场动画。减少动态效果时关闭动画、过渡与平滑滚动。通知使用 status/alert，保存状态与旧反馈提示使用 status 语义；仍需通过实际浏览器检查具体辅助技术体验。

现有复核截图位于 `.impeccable/review/`，包括首页、三档写作宽度、深色写作、诊断、并排改写、Task 1 与进度页。本文提取了 CSS、交互和两张写作截图中的事实；它不是新的完整可达性认证。功能与视觉验收结果以本轮实际测试和最终复核记录为准。

## Do's and Don'ts

### 今日训练的讲解与验证（v1.3）

沿用现有纸面、细线与字体。打开练习时收起首页的任务摘要与辅助入口，使当前作答成为主要动作。讲解放在可展开的区域中，用较弱写法、改进写法和原因组织阅读；英语例子使用现有正文样式，假设图表数据在示例前说明。

自查在提交作答后展开，只要求当前证据原句和成功标准，补充说明可选。已提交的独立原作答与之后使用帮助的改写分开记录。完整答卷提供可选计时及文字状态，草稿、计时和复盘跨刷新恢复。保持明暗主题、可见键盘焦点和窄屏换行。

### Do:

- Do 沿用已确认的雾灰、纸白、墨色和深蓝，以及对应深色主题。
- Do 为中文界面使用系统 UI 字体，为连续英文作文与诊断原稿使用 Georgia。
- Do 保持可见键盘焦点，并用文字说明保存、错误和反馈版本状态。
- Do 用细线分隔容器内部内容，并保留用户手动收起教学面板的控制。
- Do 在本次桌面验收范围（1280 / 1440 / 1600px）分别复核布局、明暗主题和交互。

### Don't:

- Don't 添加装饰性 emoji、大面积渐变、紫色装饰或彩色发光阴影。
- Don't 用新的卡片边框和投影反复套住已有卡片内部内容。
- Don't 以阻塞式 alert/confirm 替代现有通知和原生确认对话框。
- Don't 把保存状态条写成固定或吸底控件，也不要声称面板会自动收起。
- Don't 将桌面验收推广为移动端设计保证，或声称未经逐项证明的完整 WCAG AA 合规。
