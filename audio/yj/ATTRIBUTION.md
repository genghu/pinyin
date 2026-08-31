# 音节发音音频 — 来源与许可 / Syllable Audio — Source & License

本目录（`资源/汉语拼音(mp3)/音节/`）中的 **1,688 个 mp3 文件**为带声调的完整拼音音节
（如 `kou3.mp3`、`shui3.mp3`、`mu4.mp3`），用于逐字发音教学。

**仅含一至四声**（422 个音节基 × 4 声调）。上游的 19 个 "tone5" 文件经核查
**并非单音节录音**（时长与体积明显偏大，7.6–41.6 KB，而正常单音节为 8–14 KB），
已全部删除，详见下文「轻声」一节。

This directory contains **1,688 MP3 files** of tone-marked Mandarin syllables
(e.g. `kou3.mp3`) — **tones 1–4 only** (422 syllable bases × 4 tones).
The upstream "tone5" files were found **not to be single-syllable recordings**
(7.6–41.6 KB vs. the 8–14 KB norm) and have been removed; see the neutral-tone
section below.

---

## 许可 / License

**CC-BY-SA-3.0** — Creative Commons Attribution-ShareAlike 3.0
https://creativecommons.org/licenses/by-sa/3.0/

### 必须署名 / Required attribution

> Chen Wang 王琛, Hugo Lopez, Nicolas Vion — CC-BY-SA-3.0 (2013)

任何展示或再分发这些音频的界面都必须保留上述署名。
Any interface that plays or redistributes this audio must preserve the
attribution above.

### ShareAlike 说明 / ShareAlike note

ShareAlike 条款作用于**音频文件本身**：再分发时这些文件必须继续以
CC-BY-SA-3.0 提供。它**不要求**本项目的源代码采用该许可。

The ShareAlike clause applies to **the audio files themselves** — if
redistributed they must remain under CC-BY-SA-3.0. It does **not** require the
application's source code to adopt that license.

---

## 出处 / Provenance

| 项目 | 内容 |
| --- | --- |
| 原始项目 | Shtooka Project — SWAC 合集 `cmn-caen-tan`（`shtooka.net` 现已下线） |
| 获取来源 | https://github.com/hugolpz/audio-cmn （`64k/syllabs/`） |
| 发音人 | Chen Wang 王琛，女，1972 年生，江苏人，录制于巴黎 |
| 录制时间 | 2013-11-22 |
| 格式 | MP3, 64 kbps |
| 上游文件名 | `cmn-{音节}.mp3` → 本目录已去掉 `cmn-` 前缀以匹配既有命名 |

许可信息同时**内嵌在每个 mp3 的 ID3 标签中**（`SWAC_COLL_LICENSE = CC-BY-SA-3.0`），
已逐个校验：1,688 / 1,688 个文件均含该标签，且 `SWAC_TEXT` 与文件名完全一致，
无损坏文件。

License metadata is also **embedded in every file's ID3 tag**
(`SWAC_COLL_LICENSE = CC-BY-SA-3.0`); verified on all 1,688 files, with
`SWAC_TEXT` matching every filename exactly and no corrupt files.

---

## 已评估但未采用的来源 / Sources evaluated and rejected

| 来源 | 原因 |
| --- | --- |
| `davinfifield/mp3-chinese-pinyin-sound` | 仓库标注 Unlicense，但音频实际来自佛蒙特大学 Dr. John Jinghua Yin 的页面，**原作者从未放弃版权**，该 Unlicense 声明无效。 |
| `zispace/hanyu-pinyin-audio` | README 明确说明音频抓取自 Yabla、YoyoChinese 等**商业产品**。 |
| `shikangkai/Chinese-Pinyin-Audio` | 无许可；女声部分转载自上面第一项，男声同样来自 lost-theory.org / UVM。 |
| Wikimedia Commons `Zh-*.ogg` | 同一分类下**许可不统一**（CC-BY-2.0-FR 与 CC-BY-SA-3.0 混杂），且音节覆盖不完整。 |
| OpenSLR（THCHS-30、AISHELL 等） | 均为连续语音语料，**没有**孤立音节录音。 |

---

## 覆盖率 / Coverage

以 `resources/hanzi/` 中出现的全部读音为准（1,133 个不同读音）：

| 读音类别 | 数量 | 本目录覆盖 |
| --- | --- | --- |
| 一至四声 | 1,114 | **1,113（99.9%）** |
| 轻声 | 19 | 0（见下） |

补充前 `所有有拼音/` 仅覆盖 122 个（10.8%）。

### 仍缺的一至四声：仅 1 个

`ju4`（句／具／剧／据／巨／聚）——上游确实缺失，仅有 `ju1/ju2/ju3`，已实测返回 404。

### 轻声：19 个读音无音频

```
a5 ba5 de5 guo5 hng5 jia5 jie5 la5 le5 lie5
ma5 me5 na5 ne5 shi5 tou5 wa5 ya5 zhe5
```

上游虽有 19 个名为 `*5.mp3` 的文件，但经核查**不是单音节录音**：
正常单音节体积为 8–14 KB，而这些文件为 7.6–41.6 KB（`ban5` 达 41 KB，约 4 秒），
时长与体积均不符，已全部删除。

**未使用替代音频。** 用一声录音冒充轻声会教错声调，因此轻声宁缺勿代——
这 19 个读音应回退到数字人 TTS。

Upstream ships 19 files named `*5.mp3`, but they are **not single-syllable
recordings** (7.6–41.6 KB against an 8–14 KB norm; `ban5` is ~4 seconds).
They were removed. **No substitutions were made** — serving a tone-1 recording
for a neutral tone teaches the wrong tone, so these 19 fall back to the avatar TTS.

---

## 与既有目录的关系 / Relationship to existing folders

| 目录 | 文件数 | 内容 |
| --- | --- | --- |
| `声母/` | 23 | 声母 |
| `韵母/` | 23 | 韵母 |
| `所有有拼音/` | 216 | 54 个音节基 × 4 声调（拼读教学用，来源不明，**无轻声**） |
| **`音节/`** | **1,688** | **完整带调音节（本目录，CC-BY-SA-3.0，单一发音人，仅一至四声）** |

新音频放在**独立子目录**中，以免覆盖既有教学录音，并使许可与署名边界清晰。
经核对，本目录与 `所有有拼音/` **无文件名冲突**。

**逐字发音只需查本目录**——本目录已覆盖 `所有有拼音/` 中的全部音节，
且发音人一致（`所有有拼音/` 为另一位发音人，来源与许可不明，
建议仅继续用于拼读教学；该目录同样**不含任何轻声**）。

Kept in a **separate subdirectory** so the existing recordings are not
overwritten and the licensing boundary stays unambiguous. Verified: **no
filename collisions** with `所有有拼音/`.

**Per-character pronunciation should read from this folder only** — it now
supersedes every syllable in `所有有拼音/` and uses a single consistent
speaker. The legacy folder has a different speaker, unknown provenance, and
**contains no neutral tones either**; keep it for phonics drills.

### 附注：28 个下划线前缀文件

`_hm* _hng* _m* _n* _ng*`（叹词类音节，如 嗯／哼／呣）以及 `_lvan* _nia*`
共 28 个文件带 `_` 前缀，表示**非标准 CV 音节**。本语料**均未用到**，
保留不影响使用；其中 `_lvan`、`_nia` 并非规范普通话音节，如需精简可删除。
