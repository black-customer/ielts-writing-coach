# Simon 之后 · 写作进阶课

面向已经看过 Simon 或同类基础课，但独立写作仍约 5.5-6.5 的学术类学习者。目标是向 7.5 分以上训练；通过未见题、限时作答与外部评阅检验。

## 直接开始

双击 `index.html`。8 节原创 1080p MP4 共约 30 分钟，中文合成语音讲解，部分英文例句有英文朗读，含烧录字幕。章节可跳转；逐字稿、练习、参考讲评与来源在同一页。视频制作阶段使用网络配音服务，已经导出的视频本地播放不需要联网或 API 密钥。

训练手册在 `output/pdf/simon-after-workbook.pdf`；浏览阅读版为 `handbook.html`。各课编辑源与逐字稿在 `notes/`；机器可读教学源为 `lessons.json`，作者源为 `scripts/content.py`。

先独立尝试，再看示范，改写一个主要问题，最后换题复测。播放器使用独立的 `iwc_course_simon_after_v1` 本机存储键，不修改原写作工具的草稿。导出按钮保存本课原稿、改写和复盘目标；学习数据不会发送到第三方服务。

## 制作状态

- 已制作：首批 8 节进阶核心课、视频与字幕、原创大小作文示范、练习讲评、训练手册、课程播放器。
- 已设计：32 课完整路径中的后续 24 课；尚未制作对应视频。
- 已盘点：173 项研究材料，包含 21 个 Simon 原视频（4.52 小时）与 42 份 PDF。不是 173 项均已精读。
- 已转录：21 个原视频，3323 个 ASR 片段，使用本机缓存 faster-whisper base.en 模型。草稿在被忽略的 `build/source-transcripts/`，不复制进公开课程。未完成逐句音画校对。
- 待完成研究：扫描 PDF 视觉/OCR 精读、原视频全文事实审校、更多官方样卷与未读课程材料的逐项核验。
- 未验证：用户真实提分幅度、7.5 以上达标率。课程没有效果保证或官方范文分数。

## 构建与验收

从项目根目录执行：

```powershell
python -X utf8 course/scripts/content.py
python -X utf8 course/scripts/build_media.py
python -X utf8 course/scripts/build_handbook.py
node course/scripts/export_pdf.cjs
python -X utf8 course/scripts/verify_media.py
node course/scripts/verify_player.cjs
```

视频构建需要 Python、Pillow、edge-tts、FFmpeg 与 Windows 字体；PDF 导出及播放器检查使用项目已有 Playwright 和系统 Edge。媒体音频缓存复用；渲染版本或讲解内容变化需要重新导出相应视频。若声音变更，请清理对应缓存或修改声音版本，不直接删除整个项目目录。

研究清单由 `audit_materials.py` 生成；`transcribe_sources.py` 只使用本机已有模型，不下载模型。原视频和提取文本保留在原位置。

MP4 与 PDF 按仓库现有规则是本地构建产物，Git 不上传它们。代码和原创课件文本可版本管理；当前课程没有集成进原站的部署或离线预缓存，未发布线上站点。不要以公开仓库中的文件列表推断本地原资料不存在。

## 教学质量控制

模拟题与模拟数据明确标记。官方要求、教师脚手架与本项目建议区分记录。例句的改写解释、完整稿的任务一致性、图表数字及比较关系人工核对；自动验收检查音视频流、时长同步、字幕时间、页面交互和分页。视觉样本与记录在 `build/qa/`。这些检查不等于完整听审每秒视频；音色与中英混读仍可进一步改进。

教学依据与访问状态见 `research/sources.json`。设计沿用项目的雾灰、纸白、墨色、深蓝与 Georgia 英文正文。用户现有未提交工作未被覆盖。
