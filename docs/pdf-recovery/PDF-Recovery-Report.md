# CATTI PDF Content Recovery

本轮逐个读取资料包中的 15 个 PDF，使用 pdfjs text layer 提取页面文本；不补写无法辨认内容。
恢复记录共 22 条，其中实务 21 条（英译汉 12，汉译英 9），综合能力 1 条。

| PDF filename | Year | Session | Type | PDF type | Pages | Extraction method | Recovered | Reference | Status | Failure reason |
|---|---:|---|---|---|---:|---|---:|---:|---|---|
| 2021上半年-综合实务.pdf | 2021 | 上半年/5月 | 实务 | text | 6 | pdfjs text layer | 4 | 0 | partial | — |
| 2021下半年-实务.pdf | 2021 | 下半年/11月 | 实务 | text | 5 | pdfjs text layer | 2 | 0 | partial | — |
| 2022上半年-汉译英.pdf | 2022 | 上半年/5月 | 实务 | text | 3 | pdfjs text layer | 2 | 0 | partial | — |
| 2022上半年-英译汉.pdf | 2022 | 上半年/5月 | 实务 | text | 3 | pdfjs text layer | 2 | 0 | partial | — |
| 527158_2018下半年catti二级笔译英译汉真题.pdf.pdf | 2018 | 下半年/11月 | 实务 | text | 3 | pdfjs text layer | 1 | 0 | partial | — |
| 527159_2018下半年翻译考试catti二级笔译真题.pdf.pdf | 2018 | 下半年/11月 | 实务 | text | 4 | pdfjs text layer | 2 | 0 | partial | — |
| 527160_2018下半年CATTI二级笔译综合阅读真题.pdf.pdf | 2018 | 下半年/11月 | 综合能力 | text | 3 | pdfjs text layer | 1 | 0 | partial | — |
| 528333_2020年翻译资格二级笔译实务真题英译汉第一篇：世界经济发展.pdf.pdf | 2020 | 未标注 | 实务 | text | 2 | pdfjs text layer | 1 | 0 | partial | — |
| 528334_2020年翻译资格二级笔译实务真题英译汉第二篇：社交媒体虚假消息传播.pdf.pdf | 2020 | 未标注 | 实务 | text | 2 | pdfjs text layer | 1 | 0 | partial | — |
| 528888_2020年翻译资格二级笔译实务真题汉译英第一篇：抗击新冠疫情.pdf.pdf | 2020 | 未标注 | 实务 | text | 1 | pdfjs text layer | 1 | 0 | partial | — |
| 528889_2020年翻译资格二级笔译实务真题汉译英第二篇：农业问题(生猪保价稳供).pdf.pdf | 2020 | 未标注 | 实务 | text | 1 | pdfjs text layer | 1 | 0 | partial | — |
| 617636_2021年6月翻译资格《二级笔译》英译汉话题一：劳动力利用不足与经济增长.pdf.pdf | 2021 | 6月 | 实务 | text | 2 | pdfjs text layer | 1 | 0 | partial | — |
| 617637_2021年6月翻译资格《二级笔译》英译汉话题二：隐喻.pdf.pdf | 2021 | 6月 | 实务 | text | 1 | pdfjs text layer | 1 | 0 | partial | — |
| 617638_2021年6月翻译资格《二级笔译》汉译英话题一：国产肺炎球菌疫苗.pdf.pdf | 2021 | 6月 | 实务 | text | 1 | pdfjs text layer | 1 | 0 | partial | — |
| 617639_2021年6月翻译资格《二级笔译》汉译英话题二：土地荒漠化.pdf.pdf | 2021 | 6月 | 实务 | text | 1 | pdfjs text layer | 1 | 0 | partial | — |

成功解析（含部分恢复）：15
完全失败：0
实务 Passage：21
英译汉：12
汉译英：9
综合能力 items：1
参考译文：0
提取方法：pdfjs text layer（15/15）
与已有 HTML 正文的精确内容重复合并：0（PDF 与 HTML 版本未达到规范化全文完全相同，保留为来源版本）
最终资料库可训练实务 Passage：37
最终资料库可训练综合能力：2
最终资料库可训练条目：39
