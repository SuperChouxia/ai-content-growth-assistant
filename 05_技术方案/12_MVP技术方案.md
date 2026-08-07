# 巴布 - MVP v0.9 技术方案

- 更新日期：2026-08-07
- 产品版本：`MVP v0.9`
- 里程碑版本：`v2026.08.07.3`
- 下一阶段：模型盲测与最小工程实现
- 当前状态：未来最小实现方案，尚未实施
- 对应需求：`../03_产品方案与PRD/07_PRD_MVP.md`
- 对应原型：`../04_可视化原型/index.html`

## 结论

真实产品建议采用“Web 前端 + 托管认证与数据库 + Serverless API + 模型网关 + 独立搜索服务 + 异步图片任务 + 支付与积分账本”的轻量架构。模型网关只提供国内默认、海外高质量可选和供应商替换，不在第一版做自动多模型竞价或复杂 Agent 编排。

当前仓库中的 `04_可视化原型` 是静态 HTML/CSS/JavaScript 原型，没有真实后端、模型调用、云端存储或小红书平台能力。本方案是下一阶段的工程入口，不表示已实施。

## 技术目标

P0 需要支持：

1. 账号密码登录、会话保持、修改密码、退出确认和用户数据隔离；
2. 多个小红书账号项目及品牌、个人 IP、商品资料；
3. 独立对话的新建、历史、搜索和消息收发；
4. 内容主线和商品主线驱动的创作任务；
5. 1-5 篇只读笔记结果；
6. 按账号查看全部历史笔记；
7. 单篇笔记生成 1-6 张配图；
8. 个人中心展示注册信息，并为充值与消费记录保留产品入口；
9. 任务状态、错误日志、配额和成本限制；
10. 一套月/季/年会员、月度赠送积分、购买积分与消费流水；
11. 微信、支付宝扫码支付、异步回调和到期处理；
12. 标准/高质量文字与图片模式、一次任务一次搜索和生成后质量检查。

P0 不需要支持：

- 小红书登录授权、自动发布、评论和私信；
- 大规模平台抓取、账号库和持续监控；
- 数据看板、发布反馈和自动复盘；
- 团队权限、CRM、多套会员、团队席位和共享账号治理；
- 自动续费、免密支付、优惠券和复杂营销系统；
- 视频生成、复杂图片编辑器和内容转图片卡片；
- 手机端独立应用。

## 推荐技术栈

### Web

推荐 Next.js + TypeScript。

- 同一工程承载页面、服务端 API 和鉴权中间件；
- 适合一人公司维护和小步上线；
- 正式工程应重新实现组件，不继续在单文件原型上堆功能；
- 可保留当前原型作为布局、状态和验收参考。

### 数据与认证

推荐 Supabase：

- Auth：账号密码登录；
- Postgres：结构化业务数据；
- Storage：头像、商品图和生成图片；
- Row Level Security：用户数据隔离。

### API

推荐 Serverless API：

- 前端不接触模型密钥；
- 统一做权限校验、输入校验、内容安全和限流；
- 长耗时图片任务使用队列或异步 Job；
- 每次模型调用记录供应商、模型、Token、耗时和结果状态。

### AI Provider

服务端使用供应商中立接口，并通过别名配置标准与高质量模型。文字、视觉分析和图片生成分别配置，不把供应商名称写进业务代码：

```ts
interface TextProvider {
  chat(input: ChatInput): Promise<ChatOutput>;
  generateNotes(input: NoteGenerationInput): Promise<GeneratedNote[]>;
}

interface VisionProvider {
  analyze(input: VisionAnalysisInput): Promise<VisionAnalysis>;
}

interface ImageProvider {
  generateImages(input: ImageGenerationInput): Promise<GeneratedImage[]>;
}
```

模型别名至少包含 `text.standard`、`text.quality`、`vision.default`、`image.standard`、`image.quality`。候选模型通过盲测确定，生产切换只更新受控配置。第一版不做按请求自动竞价、动态选择最便宜模型、复杂 Agent 编排或工作流市场。

## 系统模块

### 1. 认证

- 登录、修改密码、退出和会话刷新；
- 所有业务数据按 `user_id` 隔离；
- 内测阶段可由管理员预置账号；
- 修改密码必须重新校验当前会话，并由认证服务完成，不在前端保存或比对明文密码；
- 退出登录确认属于前端交互，确认后调用服务端退出并清理本地会话；
- `v0.8` 原型中的充值与消费记录不请求真实账务接口；`v0.9` 工程阶段再接会员与账务服务；
- 注册、找回密码和第三方登录后置。

### 2. 账号项目

- 创建、查看、修改和删除账号项目；
- 保存品牌或个人 IP 资料；
- 品牌账号保存多组商品及每组 1-3 张图片；
- 内容生成读取账号资料的当前版本；
- 商品主线读取商品第一张图作为选择缩略图。

P0 以手动录入为可靠主路径。公开主页解析如果加入，只能是可失败的辅助能力，失败不得阻断账号创建。

### 3. 对话

- 创建和重命名会话；
- 搜索、分页和读取历史会话；
- 保存用户消息和助手消息；
- 流式或分段返回模型回复；
- 保存错误和中断状态；
- 对话与创作任务分开存储。

对话不会自动创建笔记。若后续需要“转为创作”，应新增显式动作并保存来源关系，不在 P0 隐式触发。

### 4. 创作

- 选择账号、主线类型和具体候选项；
- 保存字数档位和生成篇数；
- 通过后端编排生成 1-5 篇笔记；
- 笔记结果保存为不可变输出版本；
- 前端只读展示，不提供草稿状态和编辑保存；
- 创作历史直接查询账号下的笔记结果。

### 5. 图片任务

- 单篇笔记选择 1-6 张；
- 创建异步图片任务；
- 返回 `queued / generating / completed / failed` 状态；
- 完成后保存图片 URL、序号和说明；
- 重新生成创建新批次，当前页面展示最新批次；
- 宽屏展示由前端限制为每行最多三张。

### 6. 搜索与质量检查

- 每个创作任务创建一个搜索批次，1-5 篇笔记共享结构化摘要；
- `SearchService` 负责调用公开搜索或官方 API、去重、摘要、结构化和短期缓存；
- 第一版不实现平台页面抓取或浏览器模拟采集；
- 规则检查始终执行，高质量模式固定执行 AI 审核与最多一次优化；
- 标准模式在事实风险、规则异常或低分时触发轻量 AI 审核；
- 搜索、模型和质检均有超时、错误码、有限重试和成本记录。

### 7. 会员、积分与支付

- 会员计划只有月、季、年三个时长，权益规则共用；
- 月度任务按有效会员逐月发放 1000 赠送积分；
- 积分消费先冻结预计值，任务结束后按成功结果结算或返还；
- 赠送积分与购买积分分账记录，不直接维护一个可随意修改的余额；
- 微信、支付宝订单由服务端创建，只有验签后的支付回调可以发放权益；
- 订单、权益发放和回调处理使用幂等键，重复请求不重复扣费或发放；
- 到期任务冻结购买积分并停止生成，历史读取不受影响。

## 数据模型

### users

| 字段 | 说明 |
| --- | --- |
| id | 用户 ID |
| email | 登录邮箱 |
| created_at | 创建时间 |

### account_projects

| 字段 | 说明 |
| --- | --- |
| id | 账号项目 ID |
| user_id | 所属用户 |
| account_type | `brand / ip` |
| avatar_url | 头像 |
| display_name | 昵称 |
| xhs_id | 小红书号 |
| bio | 简介 |
| positioning_summary | 定位摘要 |
| generated_count | 已生成内容数 |
| created_at / updated_at | 时间 |

### brand_profiles

| 字段 | 说明 |
| --- | --- |
| account_project_id | 账号项目 |
| brand_name | 品牌名 |
| category | 细分方向 |
| positioning | 品牌定位 |
| target_audience | 目标用户 |
| user_problem | 用户问题 |
| tags | 品牌标签 |

### brand_products

| 字段 | 说明 |
| --- | --- |
| id | 商品 ID |
| account_project_id | 所属账号 |
| name | 商品名 |
| price_min / price_max | 价格区间 |
| selling_point | 卖点 |
| consumption_scene | 消费场景 |
| usage_scene | 使用场景 |
| sort_order | 排序 |

### brand_product_images

| 字段 | 说明 |
| --- | --- |
| id | 图片 ID |
| brand_product_id | 商品 ID |
| file_url | 文件地址 |
| sort_order | 1-3 |

### ip_profiles

| 字段 | 说明 |
| --- | --- |
| account_project_id | 账号项目 |
| direction | IP 方向 |
| identity_tags | 身份标签 |
| expertise | 专业能力 |
| experiences | 真实经历 |
| viewpoints | 核心观点 |
| products_or_services | 产品或服务 |
| persona_boundaries | 人设边界 |

### content_pillars

| 字段 | 说明 |
| --- | --- |
| id | 内容主线 ID |
| account_project_id | 所属账号 |
| name | 主线名称 |
| description | 简短说明 |
| sort_order | 排序 |

### conversations

| 字段 | 说明 |
| --- | --- |
| id | 会话 ID |
| user_id | 所属用户 |
| title | 会话标题 |
| summary | 列表摘要 |
| created_at / updated_at | 时间 |

### conversation_messages

| 字段 | 说明 |
| --- | --- |
| id | 消息 ID |
| conversation_id | 会话 ID |
| role | `user / assistant / system` |
| content | 消息内容 |
| status | `completed / failed / interrupted` |
| model | 模型标识 |
| token_usage | Token 用量 |
| created_at | 时间 |

### generation_tasks

| 字段 | 说明 |
| --- | --- |
| id | 创作任务 ID |
| user_id | 所属用户 |
| account_project_id | 所属账号 |
| mainline_type | `content / product` |
| content_pillar_id | 内容主线，可空 |
| brand_product_id | 商品主线，可空 |
| generation_count | 1-5 |
| word_count_level | `short / standard / long` |
| status | `queued / generating / completed / failed` |
| created_at / completed_at | 时间 |

约束：`content_pillar_id` 与 `brand_product_id` 必须根据 `mainline_type` 二选一。

### generated_notes

| 字段 | 说明 |
| --- | --- |
| id | 笔记 ID |
| generation_task_id | 来源任务 |
| account_project_id | 所属账号 |
| title | 标题 |
| body | 正文 |
| topics | 话题数组 |
| cover_url | 历史列表封面，可空 |
| sort_order | 1-5 |
| created_at | 时间 |

笔记结果在 P0 前端只读。若未来支持编辑，应新增版本表，不覆盖原始生成结果。

### image_jobs

| 字段 | 说明 |
| --- | --- |
| id | 图片批次 ID |
| generated_note_id | 笔记 ID |
| requested_count | 1-6 |
| status | `queued / generating / completed / failed` |
| provider / model | 供应商与模型 |
| error_message | 失败原因 |
| created_at / completed_at | 时间 |

### generated_images

| 字段 | 说明 |
| --- | --- |
| id | 图片 ID |
| image_job_id | 图片批次 |
| file_url | Storage 地址 |
| caption | 图片说明 |
| sort_order | 1-6 |

### generation_runs

内部运行记录，与用户可见的 `generated_notes` 分离。

| 字段 | 说明 |
| --- | --- |
| id / generation_task_id | 运行与任务关系 |
| mode | `standard / quality` |
| model_alias / provider_request_id | 模型别名与供应商请求标识 |
| prompt_version / search_snapshot_id | 可追溯版本 |
| quality_result | 规则与 AI 审核摘要 |
| usage / actual_cost | Token、图片与真实成本 |
| status / error_code | 运行结果 |
| created_at / completed_at | 时间 |

### search_snapshots

| 字段 | 说明 |
| --- | --- |
| id / generation_task_id | 一次任务对应一次搜索快照 |
| query_hash | 去重与缓存键 |
| structured_summary | 过滤后的结构化摘要 |
| source_metadata | 来源、时间与 URL 的最小元数据 |
| expires_at | 缓存过期时间 |

### membership_subscriptions

| 字段 | 说明 |
| --- | --- |
| id / user_id | 订阅与用户 |
| plan_period | `month / quarter / year` |
| starts_at / expires_at | 有效期 |
| status | `pending / active / expired / refunded` |
| source_order_id | 来源订单 |

### point_grants

每笔发放独立保存，余额由可用发放减去流水计算。

| 字段 | 说明 |
| --- | --- |
| id / user_id | 发放记录 |
| source_type | `membership / purchase / refund / adjustment` |
| amount / remaining | 发放与剩余积分 |
| available_at / expires_at | 可用与到期时间 |
| status | `available / frozen / expired / depleted` |

### point_ledger

| 字段 | 说明 |
| --- | --- |
| id / user_id | 流水 |
| request_key | 幂等键 |
| type | `grant / reserve / settle / release / expire / freeze / unfreeze` |
| amount | 正负积分变化 |
| point_grant_id | 具体消耗批次 |
| reference_type / reference_id | 订单或生成任务 |
| created_at | 时间 |

### payment_orders

| 字段 | 说明 |
| --- | --- |
| id / user_id | 订单 |
| product_type / product_code | 会员或积分商品 |
| amount_cny | 应付金额 |
| channel | `wechat / alipay` |
| status | `pending / paid / closed / refunded / exception` |
| provider_trade_no | 渠道交易号 |
| expires_at / paid_at | 二维码过期与到账时间 |

## API 草案

### 认证

- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/change-password`
- `GET /auth/session`

### 账号

- `POST /account-projects`
- `GET /account-projects`
- `GET /account-projects/:id`
- `PATCH /account-projects/:id`
- `DELETE /account-projects/:id`
- `POST /brand-products/:id/images`

### 对话

- `POST /conversations`
- `GET /conversations?query=&cursor=`
- `GET /conversations/:id`
- `PATCH /conversations/:id`
- `POST /conversations/:id/messages`

消息接口优先支持流式返回，同时在服务端保存最终消息和调用元数据。

### 创作

- `POST /generation-tasks`
- `GET /generation-tasks/:id`
- `GET /account-projects/:id/generated-notes`
- `GET /generated-notes/:id`

### 图片

- `POST /generated-notes/:id/image-jobs`
- `GET /image-jobs/:id`

### 会员、积分与支付

- `GET /billing/entitlements`
- `GET /billing/point-balance`
- `GET /billing/point-ledger?cursor=`
- `POST /billing/orders`
- `GET /billing/orders/:id`
- `POST /billing/callbacks/wechat`
- `POST /billing/callbacks/alipay`

支付回调接口只接受渠道服务器请求，必须验签、校验金额与商品，并在数据库事务中完成订单更新和权益发放。

## AI 编排

### 对话流程

1. 校验用户和会话权限；
2. 读取最近消息和必要系统约束；
3. 调用聊天模型；
4. 流式返回结果；
5. 保存消息、用量和状态；
6. 更新会话标题、摘要和时间。

### 创作流程

1. 校验会员、积分、账号资料、主线与模式；
2. 冻结本次任务预计积分；
3. 读取账号、品牌/IP、商品和当前账号历史内容；
4. 搜索一次近期公开信息并生成结构化摘要；
5. 根据三层 Prompt、字数档位和篇数调用文字模型；
6. 校验 JSON、标题、正文、话题和篇数；
7. 执行规则检查，并按模式或风险触发 AI 审核与一次优化；
8. 保存不可变笔记结果与内部运行记录；
9. 按成功篇数结算积分，失败则释放冻结积分。

### 图片流程

1. 校验会员、积分、笔记、图片类型、模式和 1-6 张数量；
2. 冻结预计积分；
3. 视觉模型分析商品图与账号视觉资料；
4. 生成每张图的用途和提示词；
5. 创建异步图片任务并轮询或推送状态；
6. 检查 3:4 尺寸、可用性、商品一致性和乱码；
7. 下载或转存成功结果到自有 Storage，封面按需叠加系统中文文字层；
8. 保存图片顺序和内部运行记录；
9. 按成功张数结算，失败张数释放积分。

## 权限与安全

- 所有业务表通过 `user_id` 或账号关系做 RLS；
- 服务端再次校验会话和资源所有权；
- 模型密钥只存在服务端环境变量；
- 上传文件校验 MIME、大小和扩展名；
- 生成接口做速率限制、每日额度和并发限制；
- 日志不记录明文密码、完整会话密钥和敏感上传内容；
- 修改密码后撤销旧会话或按认证服务能力要求重新登录；
- 允许用户删除对话、账号和对应生成数据；
- 平台资料以用户主动提供和公开合规信息为限。
- 首次使用海外高质量模式保存明确同意记录；
- 支付回调验签、金额与商品校验全部在服务端完成；
- 积分账本只追加，不直接改写历史流水；
- 用户可见资产与内部运行记录使用不同访问权限和保留策略；
- 不将用户账号资料和历史内容用于公共模型训练或跨账号生成。
- 方案 A 不保存完整账号/商品快照、完整 Prompt 或原始搜索网页作为长期历史；普通运行日志建议 30 天后清理，财务账本按独立规则保留。

## 可观测性与成本

每次模型调用至少记录：

- 用户、功能和任务 ID；
- Provider、模型和版本；
- 输入输出 Token；
- 图片数量和尺寸；
- 搜索调用次数与缓存命中；
- 规则检查、AI 审核和优化次数；
- 耗时、状态和错误；
- 可重试次数；
- 预估积分、实际积分和真实人民币成本。

成本控制：

- 对话限制上下文长度并按需摘要；
- 创作单次最多 5 篇；
- 图片单次最多 6 张；
- 默认标准正文和 3 篇；
- 图片任务限制并发和每日额度；
- 失败重试有上限，不做无限自动重试。
- 一次任务只搜索一次并共享结果；
- 会员赠送积分按月发放，不一次性发放季度或年度额度；
- 年会员月均直接成本目标不超过 20 元，综合毛利目标不低于 65%；
- 成本超线时通过积分参数和新周期权益调整，不静默降低模型质量。

## 部署

MVP 内测建议：

- Web 与 API 部署到 Vercel 或同类平台；
- Supabase 承载 Auth、Postgres 和 Storage；
- 预览、测试和生产使用不同环境；
- 数据库迁移纳入版本控制；
- 密钥通过平台环境变量管理；
- 正式上线前补充备份、恢复和删除流程。

## 技术里程碑

### 阶段 0：当前原型基线

- 产品需求、产品设计和技术方案一致；
- 静态原型覆盖核心流程；
- 不接真实服务。

### 阶段 1：认证与账号

- 建立正式工程；
- 接入登录、修改密码、退出、RLS、账号和商品资料；
- 个人中心只接注册信息和安全操作，充值与消费记录继续保持不可用；
- 完成上传和多账号切换。

### 阶段 2：对话

- 接入会话和消息持久化；
- 支持流式回复、历史搜索和错误状态；
- 增加用量记录和限流。

### 阶段 3：创作与历史

- 接入内容/商品主线和 1-5 篇生成；
- 保存只读笔记；
- 按账号展示历史笔记。

### 阶段 4：图片

- 接入 1-6 张异步生图；
- 保存图片批次和结果；
- 完成失败重试和成本限制。

### 阶段 5：内测稳定

- 补齐日志、监控、备份和删除；
- 完成权限、成本、错误和内容安全测试；
- 小范围用户连续使用。

### 阶段 6：会员与支付

- 接入月、季、年会员和月度积分发放；
- 接入微信、支付宝扫码订单与幂等回调；
- 接入积分冻结、结算、返还、到期和续费恢复；
- 完成订单、支付渠道、权益与积分账本对账；
- 支付能力与真实生成成本通过后再开放正式付费。

## 技术验收

- 不同用户的数据无法互相读取；
- 修改密码不在前端处理明文凭据，退出后旧会话不可继续访问业务数据；
- 对话、账号、创作和图片四个模块边界清晰；
- 对话历史和创作历史使用不同数据对象；
- 生成笔记只读展示，原始结果不会被前端覆盖；
- 图片数量在服务端强制限制为 1-6；
- 失败时保留用户输入并提供可重试状态；
- 所有模型调用可追踪用量和错误；
- 当前原型和未来工程边界在文档中明确。
- 用户可见历史与内部模型、搜索、质检和成本记录分离；
- 同一任务只产生一份搜索快照，1-5 篇共享；
- 重复支付回调、重复生成请求不会重复发放或扣减；
- 失败任务释放冻结积分，成功任务按实际结果结算；
- 会员到期停止生成但不阻断历史读取；
- 充值和消费记录在未进入支付阶段前没有可调用的真实入口。

## 下一步

1. 先用原型完成真实用户走查；
2. 用 3-5 名试用者和 30-50 个盲测任务选择模型并验证 80% 直接可用门槛；
3. 用真实供应商账单验证年会员月均直接成本不超过 20 元；
4. 评审会员、积分、支付、退款和数据保留设计后再拆工程任务；
5. 未进入工程阶段前，不部署真实账号、模型、支付或平台能力。
