# Product
<!-- impeccable:product-schema 1 -->

## Platform
web

本项目默认面向电脑端浏览器。不规划、不开发手机端 App，手机端专项设计、适配和验收不纳入默认开发范围。只有项目所有者明确重新提出手机端需求时，才能调整此约束。不得因通用最佳实践、工具建议或框架能力而自行扩展手机端开发范围。

## Users
个人雅思写作学习者，主要在电脑上连续写作、阅读反馈和改写。

## Product Purpose
让用户更快提升雅思写作：独立作答、诊断、针对性改写、间隔换题验证。

## Operating Context
现有静态 HTML/CSS/JavaScript 本地工具，支持直接打开和离线站点。AI 使用用户配置的 DeepSeek API；内置题库、范文和教学可以离线使用。

## Capabilities and Constraints
保留 Task 1 / Task 2、模考、逐段教学、闪卡、知识库、复测和数据备份。学习数据存于浏览器的 iwc_ 命名空间；旧草稿和记录必须兼容。主要验收电脑端 1280 / 1440 / 1600px、明暗主题与 125% 浏览器缩放。发布通过现有 GitHub Actions 与 Pages 完成。

## Product Principles
- 学习任务先于内容数量。
- 保存和反馈状态真实可见。
- 作文与诊断快照绑定，不能串文。
- 自查和 AI 分数分别表达。

## Brand Commitments
用户确认“安静、精密的写作工作台”，雾灰、纸白、墨色和深蓝；直接开发真实页面。
