# 代米手把手教你写雅思写作高分文章

第一集采用25–35分钟的单篇Task 2连续实战形式，从空白稿到最终文章，含中文旁白、英文朗读、逐词输入、可见修改与双语字幕。

本系列为AI创作的教学模拟。旁白是供学习的简短写作说明，不是考生或AI内部思维的实录。视频计时为播放进度，具体文章没有官方考官分数。

## 本地观看

打开 `episode-001/index.html`，或直接播放 `episode-001/media/episode-001.mp4`。播放器可以按阶段跳转，最终文章默认折叠。MP4包含烧录字幕及内嵌字幕轨，另附SRT与VTT。全屏观看正文更清楚。

## 编辑与重新导出

在项目根目录执行：

```powershell
python -X utf8 video-series/episode-001/content.py
python -X utf8 video-series/episode-001/render.py --prepare-only
python -X utf8 video-series/episode-001/render.py --encode-only --preview
python -X utf8 video-series/episode-001/render.py --encode-only
python -X utf8 video-series/episode-001/build_player.py
python -X utf8 video-series/episode-001/verify.py
```

依赖本机已有Pillow、edge-tts、FFmpeg、Windows字体。制作配音需要联网，只发送本集旁白文本；已导出的播放器与视频本地离线可用。构建缓存按声音、语速、正文内容的哈希复用。不要用旧的媒体清单推断修改后的内容已经重新导出。

`content.py`按事件顺序生成文章及画面状态，`render.py`根据语音词边界安排英文输入，检查阶段显示旧词和新词。`episode.json`保留整个可见过程，`quality-report.json`记录实际媒体验收。内容变更后先重新执行前两条命令，再导出。

当前交付为第一集试播，尚未批量制作整个系列；没有发布到任何外部平台。后续可根据观看体验调整旁白密度、输入速度、音色与画面字号。目标分数不作为文章已获分数，也不作为观看后的提分保证。
