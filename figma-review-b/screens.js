const A = "../04_可视化原型/assets";
const icon = (name) => `<img src="${A}/icons/${name}.svg" alt="" />`;
const homeImage = (name) => `${A}/home/${name}.webp`;
const logo = `${A}/brand/babu-logo-primary.png`;

const accounts = [
  { name: "爪边生活", meta: "养猫或小型犬，重视家里整洁", img: homeImage("cat-smart-feeder"), time: "10:20" },
  { name: "超级番茄", meta: "AI 不是替你创作，而是放大判断", img: homeImage("cat-sofa"), time: "昨天" },
  { name: "AI 实战笔记", meta: "内容运营与 AI 工作流", img: homeImage("cat-litter-box"), time: "周一" },
];

function rail(active = "account") {
  return `<aside class="rail">
    <div class="rail-logo"><img src="${A}/brand/babu-app-icon.png" alt="巴布" /></div>
    <div class="rail-nav">
      <div class="rail-item">${icon("message-circle")}<span>对话</span></div>
      <div class="rail-item ${active === "create" ? "active" : ""}">${icon("sparkles")}<span>创作</span></div>
      <div class="rail-item ${active === "account" ? "active" : ""}">${icon("users-round")}<span>账号</span></div>
    </div>
    <div class="rail-bottom">
      <div class="rail-item credit">${icon("zap")}<span>积分</span><strong>100</strong></div>
      <div class="rail-item">${icon("user-round")}<span>个人资料</span></div>
    </div>
  </aside>`;
}

function context(active = 0, empty = false, mode = "account") {
  const title = mode === "create" ? "创作" : "账号";
  return `<aside class="context">
    <h2>${title}</h2>
    <div class="search"><span>在当前列表搜索</span>${icon("search")}</div>
    ${mode === "account" ? `<button class="context-create">＋ 创建账号</button>` : ""}
    <div class="context-title">${mode === "create" ? "选择创作账号" : "我的账号"}</div>
    ${empty ? `<div class="context-empty">暂无账号</div>` : `<div class="account-list">${accounts.map((a,i) => `<div class="account-item ${i===active?"active":""}"><img src="${a.img}" /><div><strong>${a.name}</strong><small>${a.meta}</small></div><time>${a.time}</time></div>`).join("")}</div>`}
  </aside>`;
}

function shell(content, opts = {}) {
  return `<section class="screen"><div class="shell">${rail(opts.active || "account")}${context(opts.account || 0, opts.empty || false, opts.context || "account")}<section class="workspace">${content}</section></div><span class="screen-tag">巴布 · 方案 B 审核稿</span></section>`;
}

function pageHead(title, copy, action = "") {
  return `<header class="page-head"><div><h1>${title}</h1>${copy ? `<p>${copy}</p>` : ""}</div>${action}</header>`;
}

function home() {
  const caps = [
    ["user-round","账号定位解析","明确用户、价值和内容方向。","账号定位与人设画像"],
    ["target","对标账号拆解","提炼值得借鉴的内容方法。","对标拆解与差异洞察"],
    ["search","内容搜索","围绕账号方向寻找选题线索。","选题清单与内容参考"],
    ["file-pen-line","文案生成","输出标题、正文和推荐话题。","可发布文案草稿"],
    ["image","图片生成","生成配图或笔记封面及图片。","配图方案与封面图"],
  ];
  return `<section class="screen home"><header class="home-header"><img class="brand-logo" src="${logo}" /></header><main class="home-main">
    <section class="home-hero"><div class="hero-copy"><p class="home-audience">给品牌主、小团队和个人 IP</p><h1 class="title-xl"><span>巴布，</span><br/>你的自媒体运营助理</h1><p class="home-desc">录入账号和资料，整理账号定位和内容方向<br/>生成可发布的小红书笔记和图片</p><button class="primary">立即开始 →</button></div>
    <div class="hero-map"><div class="map-row"><div class="map-box"><span class="label">先录入</span><strong>账号 / 产品 / 专业资料</strong><ul><li>公开账号信息</li><li>品牌或个人 IP 定位</li><li>产品与服务资料</li></ul></div><div class="map-core">B</div><div class="map-box result"><span class="label">得到结果</span><strong>从定位到发布内容</strong><ul><li>账号定位与内容方向</li><li>笔记标题、正文、话题</li><li>封面与配图方案</li></ul></div></div></div></section>
    <section class="capability-grid">${caps.map(c=>`<article class="capability">${icon(c[0])}<h3>${c[1]}</h3><p>${c[2]}</p><small>输出：${c[3]}</small></article>`).join("")}</section>
    <section class="outcome-strip"><div><strong>录入账号 / 产品 / 专业资料</strong><span>一次录入，后续创作持续复用。</span></div><div><strong>整理账号定位和内容方向</strong><span>先把方向说清，再开始生成。</span></div><div><strong>生成标题、正文、话题和图片方案</strong><span>得到可以继续修改发布的完整内容。</span></div></section>
  </main></section>`;
}

function login() {
  return `${home().replace('</section>', '<div class="overlay"><div class="login-card"><div class="login-top"><div><img src="'+logo+'" /><h2>进入巴布工作台</h2><p class="caption">继续管理账号和创作记录</p></div><button class="close">×</button></div><label class="field"><span>账号</span><div class="input">demo@babu.ai</div></label><label class="field"><span>密码</span><div class="input">••••••••</div></label><button class="primary dark wide">登录</button></div></div></section>')}`;
}

function accountEmpty() {
  return shell(`${pageHead("账号", "添加并管理用于创作的小红书账号。")}
    <div class="main-panel"><div class="empty-account"><div class="empty-primary"><div class="empty-icon">${icon("users-round")}</div><span class="status warn" style="width:max-content;margin-bottom:14px">当前没有账号</span><h2>添加你的第一个账号</h2><p>粘贴小红书账号链接，再补充品牌或个人 IP 资料。巴布会根据这些信息整理定位和内容方向。</p><div><button class="primary">＋ 添加第一个账号</button></div></div><aside class="empty-path"><h3>添加账号后，可以继续</h3><div class="path-step"><b>1</b><div><strong>解析公开资料</strong><span>获取头像、昵称和账号数据</span></div></div><div class="path-step"><b>2</b><div><strong>补充账号定位</strong><span>填写品牌、产品或个人能力</span></div></div><div class="path-step"><b>3</b><div><strong>开始内容创作</strong><span>选择主线，生成笔记和图片</span></div></div></aside></div></div>`, { empty:true });
}

function parseSuccess() {
  return shell(`${pageHead("创建账号", "先解析账号公开信息，再选择账号类型。", '<span class="status ok">账号解析成功</span>')}
    <div class="main-panel"><div class="form-stage"><div class="form-body"><div class="form-section"><div class="step-label">账号信息</div><h2 class="title-md">粘贴小红书账号链接</h2><div class="link-row" style="margin-top:14px"><div class="input">https://www.xiaohongshu.com/user/profile/zaobianlife</div><button class="primary dark small-btn">解析</button></div><div class="profile-card"><img class="avatar" src="${homeImage("cat-smart-feeder")}"/><div class="profile-copy"><strong>爪边生活</strong><span>小红书号：zaobianlife</span><p>分享养宠家庭的清洁、收纳和宠物用品使用经验，让进食区更清爽。</p></div><div class="stats"><div class="stat"><small>关注</small><strong>128</strong></div><div class="stat"><small>粉丝</small><strong>2,846</strong></div><div class="stat"><small>获赞与收藏</small><strong>1.8万</strong></div></div></div></div><div class="divider"></div><div class="form-section" style="margin-top:18px"><div class="step-label">账号类型</div><h2 class="title-md">这个账号属于哪一类？</h2><div class="type-choice"><div class="type-card active"><strong>品牌</strong><span>适合有品牌、商品、门店或产品的人。</span></div><div class="type-card"><strong>个人 IP</strong><span>适合有专业能力、经历、观点或服务的人。</span></div></div></div></div><footer class="form-actions"><button class="secondary">取消</button><button class="primary">下一步</button></footer></div></div>`, {empty:true});
}

function parseFailed() {
  return shell(`${pageHead("创建账号", "解析失败不会阻断账号创建。", '<span class="status warn">需要手动填写</span>')}
    <div class="main-panel"><div class="form-stage"><div class="form-body"><div class="form-section"><div class="step-label">账号信息</div><h2 class="title-md">没有解析到公开资料</h2><div class="link-row" style="margin-top:14px"><div class="input">https://www.xiaohongshu.com/user/profile/example</div><button class="primary dark small-btn">重新解析</button></div><div class="manual-card"><div class="manual-card-head"><strong>请手动补充账号信息</strong><span class="caption">填写后仍可继续创建</span></div><div class="form-grid"><label class="field"><span>昵称</span><div class="input">爪边生活</div></label><label class="field"><span>小红书号</span><div class="input">zaobianlife</div></label><label class="field"><span>关注数</span><div class="input">128</div></label><label class="field"><span>粉丝数</span><div class="input">2,846</div></label><label class="field"><span>获赞与收藏</span><div class="input">1.8万</div></label><label class="field span-2"><span>账号简介</span><div class="textarea">分享养宠家庭的清洁、收纳和宠物用品使用经验，让进食区更清爽。</div></label></div></div></div></div><footer class="form-actions"><button class="secondary">取消</button><button class="primary">下一步</button></footer></div></div>`, {empty:true});
}

function brandForm() {
  return shell(`${pageHead("创建品牌账号", "补充品牌定位和商品资料。", '<span class="status ok">公开资料已保存</span>')}
    <div class="main-panel"><div class="form-stage"><div class="form-body"><div class="form-grid"><section class="form-section"><h3>基础信息</h3><label class="field"><span>品牌名（必填）</span><div class="input">爪边生活</div></label><div class="field"><span>细分方向（单选）</span><div class="choice-row"><span class="chip active">宠物</span><span class="chip">餐饮</span><span class="chip">美妆</span><span class="chip">母婴</span><span class="chip">本地生活</span><span class="chip">其他</span></div></div></section><section class="form-section"><h3>账号定位</h3><div class="field-row"><label class="field"><span>目标用户年龄</span><div class="select">25 岁　至　40 岁</div></label><div class="field"><span>目标用户地域（多选）</span><div class="choice-row"><span class="chip active">一线城市</span><span class="chip active">二线城市</span><span class="chip">三线城市</span><span class="chip">小城市</span></div></div></div><label class="field"><span>解决用户问题</span><div class="textarea">养猫或小型犬，重视家里整洁和宠物用品颜值，但进食区总是有水渍、粮渣和味道。</div></label></section><section class="form-section span-2"><h3>品牌资料</h3><label class="field"><span>品牌定位</span><div class="input">给养宠家庭提供更整洁、更好清理、更适合家居场景的宠物用品。</div></label><div class="product-box"><div class="product-box-head"><strong>商品 1 · 可水洗防滑宠物餐垫</strong><span class="caption">商品可以添加多组</span></div><div class="form-grid"><div><span class="field-label">商品图（1–3 张）</span><div class="upload-row" style="margin-top:7px"><div class="upload photo" style="background-image:url('${homeImage("pet-bowl-detail")}')">主图</div><div class="upload">＋ 添加图 2</div><div class="upload">＋ 添加图 3</div></div></div><label class="field"><span>商品定价</span><div class="select">10 元　至　50 元</div></label><label class="field"><span>商品卖点</span><div class="textarea">高边挡水、可冲洗、底部防滑、颜色适合家居环境。</div></label><label class="field"><span>消费场景</span><div class="textarea">养猫家庭、小型犬家庭、多宠家庭，想把进食区整理得更清爽。</div></label></div></div></section></div></div><footer class="form-actions"><button class="secondary">上一步</button><button class="secondary">＋ 添加商品</button><button class="primary">保存账号</button></footer></div></div>`, {empty:true});
}

function ipForm() {
  return shell(`${pageHead("创建个人 IP 账号", "补充个人能力、经历和表达边界。", '<span class="status ok">公开资料已保存</span>')}
    <div class="main-panel"><div class="form-stage"><div class="form-body"><div class="form-grid"><section class="form-section span-2"><h3>个人资料</h3><div class="field"><span>IP 方向（单选）</span><div class="choice-row"><span class="chip">教育</span><span class="chip">科技</span><span class="chip">知识付费</span><span class="chip">职场成长</span><span class="chip">商业 / 创业</span><span class="chip active">AI 工具 / 效率</span><span class="chip">运营 / 营销</span><span class="chip">其他</span></div></div></section><section class="form-section"><div class="field"><span>身份标签（多选）</span><div class="choice-row"><span class="chip active">一人公司</span><span class="chip">品牌主</span><span class="chip">创业者</span><span class="chip">自由职业者</span><span class="chip active">内容创作者</span><span class="chip active">运营 / 营销</span></div></div><label class="field"><span>专业能力（最多 10 个）</span><div class="keyword-box"><span class="chip">市场判断</span><span class="chip">产品文档</span><span class="chip">运营复盘</span><span class="chip">AI 工作流</span></div></label><label class="field"><span>真实经历</span><div class="textarea">用 AI 辅助完成项目定位、公众号内容、小红书卡片和知识库整理。</div></label></section><section class="form-section"><label class="field"><span>核心观点</span><div class="textarea">AI 不是替你创作，而是放大你的判断、流程和复盘能力。</div></label><label class="field"><span>产品或服务</span><div class="textarea">知识库搭建、内容工作流咨询或 AI 实战陪跑。</div></label><div class="field"><span>人设边界（多选）</span><div class="choice-row"><span class="chip active">不装专家</span><span class="chip active">不夸大</span><span class="chip active">不制造焦虑</span><span class="chip active">不做绝对承诺</span><span class="chip">不晒收入</span></div></div></section></div></div><footer class="form-actions"><button class="secondary">上一步</button><button class="primary">保存账号</button></footer></div></div>`, {empty:true});
}

function accountHero(tab = "profile") {
  return `<div class="profile-layout"><section class="account-hero"><img class="avatar" src="${homeImage("cat-sofa")}"/><div><div class="account-name-row"><h2>超级番茄</h2><span class="chip red">个人 IP</span></div><span class="caption">小红书号：2384834834</span><p class="bio">深耕行业 7 年的产品人｜现 AI 产品经理<br/>持续分享 AI 咨询干货、产品知识和真实实践<br/>希望用易懂的语言传播知识，一起交流学习</p><div class="inline-stats"><span>粉丝 <strong>2,846</strong></span><span>关注 <strong>128</strong></span><span>获赞与收藏 <strong>1.8万</strong></span></div></div><button class="primary">编辑资料</button></section><nav class="tabs"><span class="tab ${tab==="profile"?"active":""}">账号资料</span><span class="tab ${tab==="products"?"active":""}">商品</span><span class="tab">最近笔记</span></nav>`;
}

function accountProfile() {
  return shell(`${pageHead("账号详情", "资料完整度 86% · 可以开始创作", '<button class="primary dark">开始创作</button>')}<div class="main-panel">${accountHero("profile")}<div class="profile-content"><div class="data-list"><div class="data-item"><span>账号定位</span><strong>用真实实践拆解 AI 工具、产品方法和一人公司工作流。</strong></div><div class="data-item"><span>IP 方向</span><p>AI 工具 / 效率</p></div><div class="data-item"><span>身份标签</span><p>一人公司　内容创作者　产品经理</p></div><div class="data-item"><span>专业能力</span><p>市场判断　产品文档　运营复盘　AI 工作流</p></div><div class="data-item"><span>核心观点</span><p>AI 不是替你创作，而是放大你的判断、流程和复盘能力。</p></div><div class="data-item"><span>人设边界</span><p>不装专家　不夸大　不制造焦虑　不做绝对承诺</p></div></div></div></div></div>`, {account:1});
}

function accountProducts() {
  return shell(`${pageHead("账号详情", "资料完整度 86% · 可以开始创作", '<button class="primary dark">开始创作</button>')}<div class="main-panel">${accountHero("products")}<div class="profile-content"><div class="product-gallery"><div><h3 style="margin:0 0 12px;font-size:16px">可水洗防滑宠物餐垫</h3><div class="product-images"><img src="${homeImage("pet-bowl-detail")}"/><img src="${homeImage("cat-smart-feeder")}"/><img src="${homeImage("cat-litter-box")}"/></div></div><div class="product-info"><div class="panel-head"><h3>商品资料</h3><button class="secondary small-btn">＋ 添加商品</button></div><dl><dt>定价</dt><dd>10 元 – 50 元</dd><dt>商品卖点</dt><dd>高边挡水、可冲洗、底部防滑、颜色适合家居环境。</dd><dt>消费场景</dt><dd>养猫家庭、小型犬家庭、多宠家庭，想把宠物进食区整理得更清爽。</dd><dt>使用场景</dt><dd>猫狗吃饭、喝水、湿粮喂食、地面水渍和粮渣集中清理。</dd></dl></div></div></div></div></div>`, {account:0});
}

function production(results = false) {
  const noteCards = [
    ["猫碗旁边总是脏？先别急着怪猫","以前我一直以为是猫咪吃饭太急，后来才发现，真正麻烦的是餐垫边缘和地面之间的缝隙……",["#新手养猫","#宠物用品"]],
    ["吃完饭少擦一次地，我只换了这个","养宠家庭最烦的不是脏一次，而是每天都要收拾一圈。猫粮、喝水印、碗底残留……",["#养宠日常","#家居清洁"]],
    ["宠物餐垫怎么选？这 3 点更重要","餐垫不是越厚越好。对小户型来说，好冲洗、不乱滑、颜色不突兀反而更重要。",["#宠物餐垫","#养宠避坑"]],
  ];
  return shell(`${pageHead("创作", "选择账号和内容主线，生成一组可继续修改的笔记。")}
    <div class="main-panel"><div class="production-wrap"><div class="production-bar"><div class="account-switch"><img src="${homeImage("cat-smart-feeder")}"/><div><strong>爪边生活</strong><small>品牌 · 宠物</small></div><span class="label">切换 ▾</span></div><div class="mode-tabs"><span class="active">主线</span><span>对话</span></div><span class="label" style="text-align:right">历史记录 →</span></div><div class="production-body"><div class="setup-grid"><section class="panel panel-pad"><div class="panel-head"><h3>选择内容主线</h3><span class="status ok">单选</span></div><div class="pillar-list"><div class="pillar-card active"><strong>宠物进食区清洁</strong><span>场景痛点、清理前后、简单解决方案。</span></div><div class="pillar-card"><strong>新手养宠家居避坑</strong><span>避坑清单、用品选择、家里更好收拾。</span></div><div class="pillar-card"><strong>宠物用品真实测评</strong><span>真实测试、适合谁、不适合谁。</span></div></div></section><section class="panel panel-pad"><div class="panel-head"><h3>生成参数</h3></div><div class="parameter-block"><strong>正文字数档位</strong><div class="choice-row"><span class="chip">精简 200–400 字</span><span class="chip active">标准 500–700 字</span><span class="chip">长图 800–1000 字</span></div></div><div class="parameter-block"><strong>生成笔记数</strong><div class="number-row"><span class="chip">1 篇</span><span class="chip">2 篇</span><span class="chip active">3 篇</span><span class="chip">4 篇</span><span class="chip">5 篇</span></div></div><button class="primary dark wide">生成笔记</button></section></div>${results ? `<section class="note-preview panel panel-pad"><div class="panel-head"><h3>笔记预览</h3><span class="status ok">已生成 3 篇</span></div><div class="note-list">${noteCards.map((n,i)=>`<article class="note-card ${i===0?"saved":""}"><span class="status ok">笔记 ${i+1}</span><h4>${n[0]}</h4><p>${n[1]}</p><div class="topic-row">${n[2].map(t=>`<span>${t}</span>`).join("")}</div></article>`).join("")}</div></section>` : ""}</div></div></div>`, {active:"create",context:"create"});
}

function noteDetail() {
  return shell(`${pageHead("创作", "笔记详情会保留本次选择的账号和生成参数。", '<button class="secondary">返回笔记预览</button>')}
    <div class="main-panel"><div class="note-detail"><div class="crumb"><span>爪边生活</span><span>›</span><span>宠物进食区清洁</span><span>›</span><strong style="color:var(--ink)">猫碗旁边总是脏？</strong><span class="status ok" style="margin-left:auto">已保存</span></div><div class="detail-grid"><section class="panel editor"><div class="panel-head"><h3>笔记正文</h3><span class="caption">标准正文 · 500–700 字</span></div><label class="field"><span>标题</span><div class="input">猫碗旁边总是脏？先别急着怪猫</div><div class="input-help"><span>标题建议控制在 20 字以内</span><span>16 / 20 字</span></div></label><label class="field"><span>正文</span><div class="textarea">以前我一直以为猫碗旁边脏，是猫咪吃饭太急。后来才发现，真正麻烦的是粮渣、水渍和地板缝隙叠在一起。\n\n如果每天都要擦一圈，养宠的幸福感很容易被这些小事消耗。现在我会把碗、饮水机和餐垫放在同一区域，餐垫选择高边、可冲洗、底部防滑的，脏了直接拿走冲洗。\n\n它不会让家里永远不脏，但至少能让清理范围更集中，也少擦一次地。</div><div class="input-help"><span>正文不使用绝对承诺，保留真实体验</span><span>286 / 1000 字</span></div></label><label class="field"><span>推荐话题</span><div class="input">#新手养猫　#宠物用品　#家居清洁　#养宠日常</div></label></section><aside class="side-stack"><section class="panel panel-pad"><div class="panel-head"><h3>发布前提示</h3></div><div class="check-list"><div class="check">标题长度符合小红书建议</div><div class="check">正文符合标准档位</div><div class="check">已包含推荐话题</div><div class="check">无销量、涨粉、爆款承诺</div></div></section><section class="panel panel-pad"><div class="panel-head"><h3>生成图片</h3></div><div class="image-options"><div class="image-option active">生成配图</div><div class="image-option">内容变成图片</div></div><div class="image-plan"><div class="image-thumb">封面</div><div><strong style="font-size:12px">猫碗旁边总是脏？</strong><p class="caption" style="margin:5px 0 0">真实脏乱场景 + 清理后对比</p></div></div><div class="image-plan"><div class="image-thumb">配图 1</div><div><strong style="font-size:12px">粮渣和水渍局部图</strong><p class="caption" style="margin:5px 0 0">展示每天遇到的具体问题</p></div></div><button class="primary wide">生成图片</button></section><button class="primary dark wide">保存</button></aside></div></div></div>`, {active:"create",context:"create"});
}

function history() {
  return shell(`${pageHead("创作历史", "查看生成记录，继续编辑已经保存的笔记。", '<button class="primary dark">新建创作</button>')}
    <div class="main-panel"><div class="main-scroll"><div class="panel-head"><h3>最近任务</h3><div class="choice-row"><span class="chip active">全部</span><span class="chip">已保存</span><span class="chip">待编辑</span></div></div><table class="history-table"><thead><tr><th>生成时间</th><th>账号</th><th>内容主线</th><th>生成参数</th><th>笔记</th><th>状态</th><th></th></tr></thead><tbody><tr><td>今天 10:24</td><td>爪边生活</td><td class="history-title">宠物进食区清洁</td><td>标准正文 · 3 篇</td><td>猫碗旁边总是脏？先别急着怪猫</td><td><span class="status ok">已保存 1 篇</span></td><td>查看 →</td></tr><tr><td>昨天 16:08</td><td>超级番茄</td><td class="history-title">AI 工具真实体验</td><td>精简正文 · 2 篇</td><td>真正省时间的三个习惯</td><td><span class="status warn">待编辑</span></td><td>查看 →</td></tr><tr><td>7 月 20 日</td><td>AI 实战笔记</td><td class="history-title">一人公司工作流</td><td>标准正文 · 5 篇</td><td>我的低成本效率清单</td><td><span class="status ok">已保存 5 篇</span></td><td>查看 →</td></tr></tbody></table></div></div>`, {active:"create",context:"create"});
}

const screens = {
  "01-home": home,
  "02-login": login,
  "03-account-empty": accountEmpty,
  "04-create-parse-success": parseSuccess,
  "05-create-parse-failed": parseFailed,
  "06-create-brand": brandForm,
  "07-create-ip": ipForm,
  "08-account-profile": accountProfile,
  "09-account-products": accountProducts,
  "10-production-setup": () => production(false),
  "11-production-results": () => production(true),
  "12-note-detail": noteDetail,
  "13-history": history,
};

const key = new URLSearchParams(location.search).get("screen") || "01-home";
document.getElementById("app").innerHTML = (screens[key] || home)();
