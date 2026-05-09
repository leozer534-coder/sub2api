import type { LoginAgreementDocument, PublicSettings } from '@/types'

const originalBrandNames = ['Sub2API']
const originalSubtitles = ['Subscription to API Conversion Platform', 'AI API Gateway Platform']

export const businessBrand = {
  name: (import.meta.env.VITE_BRAND_NAME || 'LeoAPI').trim(),
  subtitle: (import.meta.env.VITE_BRAND_SUBTITLE || '个人 AI API 中转服务').trim(),
  productLine: 'AI API 中转站',
  supportContact: (import.meta.env.VITE_BRAND_SUPPORT || '').trim(),
  sourceRepository: 'https://github.com/leozer534-coder/sub2api',
}

function shouldUseBusinessDefault(value: string | undefined, originalValues: string[]): boolean {
  const normalized = (value || '').trim()
  return !normalized || originalValues.includes(normalized)
}

export function resolveBusinessSiteName(siteName?: string): string {
  return shouldUseBusinessDefault(siteName, originalBrandNames)
    ? businessBrand.name
    : siteName!.trim()
}

export function resolveBusinessSiteSubtitle(siteSubtitle?: string): string {
  return shouldUseBusinessDefault(siteSubtitle, originalSubtitles)
    ? businessBrand.subtitle
    : siteSubtitle!.trim()
}

export function withBusinessBrandDefaults(config: PublicSettings): PublicSettings {
  const siteName = resolveBusinessSiteName(config.site_name)
  const contactInfo = (config.contact_info || businessBrand.supportContact).trim()
  const existingDocuments = config.login_agreement_documents ?? []
  const documents = hasMeaningfulLegalDocuments(existingDocuments)
    ? existingDocuments
    : buildBusinessLegalDocuments(siteName, contactInfo)

  return {
    ...config,
    site_name: siteName,
    site_subtitle: resolveBusinessSiteSubtitle(config.site_subtitle),
    contact_info: contactInfo,
    login_agreement_documents: documents,
  }
}

export function hasMeaningfulLegalDocuments(docs?: LoginAgreementDocument[]): boolean {
  return Array.isArray(docs) && docs.some((doc) => doc.content_md?.trim())
}

export function buildBusinessLegalDocuments(siteName = businessBrand.name, contactInfo = ''): LoginAgreementDocument[] {
  const supportText = contactInfo.trim() || '请通过站内公告或管理员公布的联系方式处理'

  return [
    {
      id: 'terms',
      title: '服务条款',
      content_md: `# 服务条款

欢迎使用 ${siteName}。${siteName} 是面向个人和小团队的 AI API 中转服务，提供账号管理、API Key 分发、用量统计、余额或套餐管理等能力。

## 服务性质

- ${siteName} 不是 OpenAI、Anthropic、Google 或其他上游服务商的官方网站，也不代表与上述服务商存在授权、赞助或合作关系。
- 平台会根据管理员接入的上游资源、套餐规则和风控策略提供转发服务。上游服务的可用性、模型能力、速率限制和价格规则可能变化。
- 用户应自行确认自己的使用场景符合所在地区法律法规及上游服务商的适用条款。

## 账户与使用

- 用户应妥善保管自己的登录账号和 API Key，不得公开泄露、倒卖、滥用或用于攻击、爬取、垃圾信息、违法内容等用途。
- 平台有权根据异常请求、欠费、风控命中、上游限制或服务安全需要，暂停或限制相关账号、密钥、分组或套餐。
- 平台展示的用量、余额、扣费和请求记录是结算与排障的重要依据。若发现明显异常，请及时联系支持。

## 费用与变更

- 套餐、余额、倍率、并发、速率限制和模型可用范围以平台页面或管理员说明为准。
- 因上游价格、资源成本或服务策略变化，平台可能调整套餐或计费规则，并尽量通过公告、页面提示或客服渠道提前说明。

## 联系方式

如需处理账号、充值、套餐、退款、风控申诉或服务故障，请联系平台支持：${supportText}。`,
    },
    {
      id: 'usage-policy',
      title: '使用规则',
      content_md: `# 使用规则

为保证 ${siteName} 的稳定性和长期可用，用户需要遵守以下规则。

## 禁止用途

- 不得用于违法、欺诈、攻击、恶意扫描、撞库、垃圾信息、侵权、绕过安全限制等场景。
- 不得批量转售账号、共享密钥、公开密钥、搭建无风控的二级中转或让未知第三方直接滥用平台资源。
- 不得尝试绕过平台并发、余额、套餐、地区、风控或上游安全限制。
- 不得提交自己无权处理的敏感数据、隐私数据、商业机密或受特殊监管的数据。

## 资源使用

- 高并发、自动化任务、长时间批处理和商业客户接入前，请先与平台支持确认额度和使用方式。
- 若请求导致上游账号异常、服务质量下降或影响其他用户，平台可能临时限速、切换分组或暂停相关 API Key。
- 用户应对自己账号下的全部请求负责，包括通过自己 API Key 发出的请求。

## 风险处理

平台可根据服务安全、上游反馈、异常消耗、投诉或合规风险采取限制措施。严重违规可能导致账号停用、余额冻结、套餐终止或拒绝继续服务。`,
    },
    {
      id: 'privacy-policy',
      title: '隐私说明',
      content_md: `# 隐私说明

${siteName} 会尽量少收集信息，但为提供账号、计费、风控和排障能力，仍需要处理必要数据。

## 我们可能处理的信息

- 账户信息：邮箱、昵称、登录来源、绑定状态、账号状态。
- 服务信息：API Key 标识、分组、套餐、余额、并发、请求时间、模型、Token、费用、错误码等用量数据。
- 支付信息：订单号、金额、支付状态、退款状态、支付渠道返回的必要字段。
- 支持信息：用户主动提供给客服的联系方式、问题描述和截图。

## 请求内容

用户通过 API 提交的内容会被转发给对应上游模型服务商处理。平台可能记录必要的请求元数据用于计费、排障和风控，但不建议用户提交身份证件、银行卡、密码、医疗病历、商业机密等高度敏感内容。

## 数据使用

数据主要用于提供服务、计算费用、展示用量、排查故障、防止滥用、处理退款和满足必要的合规要求。若上游服务商对数据处理有单独条款，用户也应同时遵守其规则。

## 联系方式

如需查询、修正或处理账号数据，请联系平台支持：${supportText}。`,
    },
    {
      id: 'refund-policy',
      title: '退款说明',
      content_md: `# 退款说明

${siteName} 提供的是数字化 API 中转服务，资源一旦被消耗通常无法从上游撤回，因此退款会按实际情况审核。

## 可申请的情况

- 误充值、重复支付且余额未使用。
- 平台侧长期故障导致服务不可用，且无法通过补偿额度或延期解决。
- 管理员明确承诺可退款的套餐或订单。

## 通常不支持的情况

- 已经消耗的余额、Token、套餐天数或专属资源。
- 因用户配置错误、密钥泄露、客户端滥用、违反使用规则导致的损失。
- 上游服务商临时限制、模型下线、地区限制、风控限制等非平台完全可控因素。

## 处理方式

退款申请需要提供账号邮箱、订单号、支付金额、申请原因和必要截图。平台会结合订单状态、余额变化、用量记录和服务日志审核。请联系平台支持：${supportText}。`,
    },
    {
      id: 'supported-regions',
      title: '支持地区与限制',
      content_md: `# 支持地区与限制

${siteName} 面向允许访问相关 AI 服务和支付服务的地区提供能力。不同上游模型、账号类型、支付渠道和网络环境可能存在地区限制。

用户应确认自己所在地区、业务主体、最终用户和使用场景符合适用法律法规、出口管制、制裁规则以及上游服务商条款。若某些地区或场景被上游服务商限制，平台可能无法提供或继续提供相关服务。`,
    },
    {
      id: 'service-specific-terms',
      title: '服务特定条款',
      content_md: `# 服务特定条款

不同模型和能力可能对应不同规则。

- OpenAI、Claude、Gemini、Antigravity 等能力的可用性取决于平台接入的上游资源和对应服务商规则。
- 图像、代码、文件、联网、实时语音、长上下文等能力可能有单独价格、速率、地区和安全限制。
- 平台可能根据账号池健康度、套餐等级、风控状态和成本变化调整可用模型、并发、倍率或路由策略。

${siteName} 会尽量保持服务稳定，但不承诺任何特定模型、特定账号或特定上游能力永久可用。`,
    },
  ]
}
