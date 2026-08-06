const screenTitles = {
  login: "首页",
  projects: "账号",
  create: "创建账号",
  home: "账号概览",
  knowledge: "编辑账号",
  positioning: "定位与主线",
  chat: "对话",
  production: "创作",
  history: "创作历史",
  note: "笔记详情",
};

const mainMenuByScreen = {
  login: "login",
  projects: "projects",
  create: "projects",
  home: "projects",
  knowledge: "projects",
  positioning: "projects",
  chat: "chat",
  production: "production",
  history: "production",
  note: "production",
};

let currentScreen = "login";
let navigationStack = [];
let prototypeState = {
  scenario: "first",
  project: false,
  knowledge: false,
  records: false,
};
const createStepsByType = {
  brand: ["account", "brand", "product"],
  ip: ["account", "ip"],
};
const createStepLabels = {
  account: "账号",
  brand: "品牌",
  product: "商品",
  ip: "IP",
};
let currentCreateStep = "account";
let currentAccountType = "brand";
let detailImageGenerationTimer = null;
let projectIdSeed = 0;
let savedAccounts = [];
let selectedAccountId = null;
let currentAccountDetailTab = "overview";
let selectedAccountProductIndex = 0;
let currentCreationSource = "content";
let selectedProductMainlineIndex = 0;
let editingAccountId = null;
let selectedHistoryNote = null;
let selectedConversationId = "chat-1";
let conversationIdSeed = 4;
let chatReplyingConversationId = null;
let chatReplyTimer = null;
const loginSessionKey = "babu-prototype-logged-in";
let isLoggedIn = readLoginSession();
let toastTimer = null;
const accountParseTimers = new WeakMap();
let restoredFormValues = [];
let persistFrame = null;

const generatedNoteBodies = {
  "猫碗旁边总是脏": "以前我一直以为猫碗旁边脏，是猫吃饭太急。后来才发现，真正麻烦的是粮渣、喝水带出来的水渍和地板缝隙叠在一起。尤其是木地板，天天擦还是容易留下一圈印子。现在我会把猫碗和水碗固定在一张高边餐垫上，吃完把碎屑集中收掉，有水就直接冲洗晾干。进食区清爽了不少，也不用每次都追着猫碗擦地。适合家里空间不大、又想把养宠区收拾得利落一点的人。",
  "吃完饭少擦一次地": "养宠家庭最累的，不是偶尔脏一次，而是每天都要把同一个地方重新收拾一遍。猫粮掉出来、喝水留下水印、碗底还会带着一点残留，分散在地板上就很难一次清干净。把进食区固定下来后，粮渣和水渍都落在餐垫范围里，吃完顺手擦一下就行。少擦一次地不是什么大变化，但每天省下一点重复劳动，家里真的会轻松很多。",
  "宠物餐垫怎么选": "宠物餐垫不是越厚越好，也不是功能越多越实用。日常真正影响使用体验的，是能不能稳住碗、边缘能不能接住水、清洗后会不会一直湿着。小户型还要看颜色和尺寸，太抢眼反而让进食区显得更乱。选的时候可以优先看防滑、好冲洗和收纳方便这三点，再根据猫碗或水碗的数量决定大小。",
  "猫粮渣总扫不干净": "猫粮渣最麻烦的地方，是它很容易卡在碗边、地板缝和墙角。每天追着扫，看起来忙了很久，进食区还是不够干净。后来我把猫碗位置固定下来，再用一张有边缘的餐垫接住掉出来的碎屑，清理范围一下就小了。吃完抖掉粮渣，脏了直接冲洗，比在地上来回找碎屑省事很多。",
  "小户型养宠更怕乱": "小户型养宠，最怕的不是东西多，而是每个角落都留着一点宠物用品。猫碗、水碗和清洁工具如果没有固定位置，房间很快就会显得杂乱。把进食区集中在一处，尺寸控制在日常动线之外，再选颜色简单、容易清洗的用品，视觉上会清爽很多。空间没有变大，但日常收拾会更有秩序。",
};

const detailGeneratedImages = [
  { src: "./assets/home/pet-bowl-detail.webp", label: "进食区细节" },
  { src: "./assets/home/cat-smart-feeder.webp", label: "日常喂食场景" },
  { src: "./assets/home/pet-cleaning-plan.png", label: "清洁步骤" },
  { src: "./assets/home/pet-cleaning-dog.png", label: "使用场景" },
  { src: "./assets/home/cat-sofa.webp", label: "居家养宠场景" },
  { src: "./assets/home/cat-litter-box.webp", label: "清爽空间" },
];

const historyNoteLibrary = {
  zaobianlife: [
    {
      title: "猫碗旁边总是脏",
      body: generatedNoteBodies["猫碗旁边总是脏"],
      topics: ["#新手养猫", "#宠物用品", "#家居清洁"],
      image: "./assets/home/pet-bowl-detail.webp",
      time: "今天 14:32",
    },
    {
      title: "吃完饭少擦一次地",
      body: generatedNoteBodies["吃完饭少擦一次地"],
      topics: ["#养宠日常", "#猫咪用品", "#生活好物"],
      image: "./assets/home/cat-smart-feeder.webp",
      time: "昨天 19:08",
    },
    {
      title: "宠物餐垫怎么选",
      body: generatedNoteBodies["宠物餐垫怎么选"],
      topics: ["#宠物餐垫", "#养宠避坑", "#小户型养宠"],
      image: "./assets/home/pet-cleaning-plan.png",
      time: "8 月 5 日 10:16",
    },
    {
      title: "猫粮渣总扫不干净",
      body: generatedNoteBodies["猫粮渣总扫不干净"],
      topics: ["#猫咪日常", "#家居收纳", "#养宠清洁"],
      image: "./assets/home/cat-sofa.webp",
      time: "8 月 3 日 16:40",
    },
    {
      title: "小户型养宠更怕乱",
      body: generatedNoteBodies["小户型养宠更怕乱"],
      topics: ["#小户型养宠", "#宠物用品", "#生活清洁"],
      image: "./assets/home/cat-litter-box.webp",
      time: "8 月 1 日 09:25",
    },
  ],
  "ai-work-note": [
    {
      title: "我把运营拆成 3 个 AI 任务",
      body: "以前做一天运营，我经常在找选题、写草稿、检查发布内容之间来回切换。后来我把流程拆成三个固定任务：先整理素材，再生成初稿，最后只做事实和口吻检查。AI 没有替我决定写什么，但它把重复整理的时间压了下来。真正省下来的不是写字时间，而是反复进入状态的成本。",
      topics: ["#AI工具", "#一人公司", "#内容运营"],
      image: "./assets/home/cat-sofa.webp",
      time: "今天 11:20",
    },
    {
      title: "一个人做内容先固定这一步",
      body: "一个人做内容最容易累在每次都从零开始。我现在会先把真实经历、用户问题和产品资料放进同一个素材区，再从里面选一个最值得写的场景。这样写出来的内容更具体，也不会为了赶更新硬凑观点。",
      topics: ["#一人公司", "#内容工作流", "#自媒体运营"],
      image: "./assets/home/ai-content-flow.png",
      time: "8 月 6 日 18:05",
    },
    {
      title: "AI 写初稿后我只检查三件事",
      body: "AI 给出初稿后，我不会从头重写，而是只检查三件事：事实有没有错，场景是不是我真实经历过，表达有没有像模板。把检查项固定下来，比凭感觉来回修改更快，也更容易保留自己的口吻。",
      topics: ["#AI写作", "#内容复盘", "#效率工具"],
      image: "./assets/home/pet-cleaning-plan.png",
      time: "8 月 4 日 15:12",
    },
  ],
  superfanqie: [
    {
      title: "我的低成本效率清单",
      body: "我以前总以为提高效率要换更贵的工具，后来发现最有效的反而是几个很小的习惯：固定每天最重要的一件事，把临时想法放进同一个入口，晚上只花十分钟整理第二天。没有复杂系统，也不用重新学一套方法，但每天少被打断几次，时间就慢慢省下来了。",
      topics: ["#效率清单", "#生活方式", "#时间管理"],
      image: "./assets/home/cat-litter-box.webp",
      time: "今天 09:46",
    },
    {
      title: "真正省时间的三个习惯",
      body: "真正省时间的习惯通常不显眼。第一是把常用物品放回固定位置，第二是相似的小事集中处理，第三是给每天留一段不接收消息的时间。它们不会让一天突然多出几个小时，但会减少很多找东西、切换任务和重新进入状态的消耗。",
      topics: ["#生活效率", "#习惯养成", "#日常分享"],
      image: "./assets/home/cat-sofa.webp",
      time: "8 月 5 日 20:18",
    },
    {
      title: "周末整理不用做满一整天",
      body: "周末整理最怕一开始就想把全屋收拾完。我现在只选一个最影响日常的区域，定二十分钟，把留下、移动和丢弃分开处理。结束后就停，不把休息日变成新的任务清单。",
      topics: ["#周末整理", "#轻量生活", "#居家日常"],
      image: "./assets/home/pet-cleaning-plan.png",
      time: "8 月 2 日 17:30",
    },
    {
      title: "下班后别急着安排第二场工作",
      body: "下班后最需要的不是立刻开始另一份计划，而是先让注意力慢下来。我会给自己留半小时，不处理消息，也不安排学习任务，只做吃饭、散步或者简单收拾。休息不是浪费时间，恢复之后再决定晚上要不要继续。",
      topics: ["#下班生活", "#松弛感", "#生活方式"],
      image: "./assets/home/pet-cleaning-dog.png",
      time: "7 月 30 日 21:06",
    },
    {
      title: "桌面清爽后我少找了很多东西",
      body: "桌面乱的时候，我每天都在重复找同一支笔、同一根充电线。后来我只保留正在用的东西，其余按使用频率放进两个固定抽屉。桌面没有变成样板间，但开始工作时少了一段无意义的寻找。",
      topics: ["#桌面整理", "#效率提升", "#简单生活"],
      image: "./assets/home/cat-smart-feeder.webp",
      time: "7 月 28 日 12:42",
    },
  ],
};

let chatConversations = [
  {
    id: "chat-1",
    title: "给宠物餐垫找新选题",
    preview: "先从真实使用场景拆，避免又回到功能罗列。",
    updated: "刚刚",
    group: "今天",
    messages: [
      { role: "user", text: "我想给宠物餐垫找一组不那么像广告的小红书选题。" },
      { role: "assistant", text: "可以先从真实使用场景拆，避免又回到“防滑、易洗、颜值高”的功能罗列。\n\n1. 猫喝完水后，地板为什么总有一圈印\n2. 每天少擦一次地，我只改了猫碗这个位置\n3. 小户型的宠物进食区，怎么放才不显乱\n\n这三个都是问题在前、产品在后，比较适合爪边生活现在的口吻。" },
      { role: "user", text: "第二个可以，再给我一个更生活化的开头。" },
      { role: "assistant", text: "可以这样开头：\n\n“养猫后我才发现，家里最容易脏的不是猫砂盆，而是猫碗旁边那一小块地。猫粮渣、水印和碗底的残留混在一起，看着不多，却每天都要重新擦一遍。”\n\n开头先让养宠用户认出自己的日常，暂时不提产品。" },
    ],
  },
  {
    id: "chat-2",
    title: "把正文改得更像真实分享",
    preview: "去掉总结感，保留你真的做过的细节。",
    updated: "1 小时前",
    group: "今天",
    messages: [
      { role: "user", text: "这段正文太像产品介绍了，想改得像我自己用过之后的分享。" },
      { role: "assistant", text: "可以。把原文发给我，我会去掉总结感和功能堆叠，保留你真的做过的细节。" },
    ],
  },
  {
    id: "chat-3",
    title: "AI 工具账号定位梳理",
    preview: "把受众收窄到一人公司和内容从业者。",
    updated: "昨天",
    group: "昨天",
    messages: [
      { role: "user", text: "AI 实战笔记这个账号的定位还是有点宽。" },
      { role: "assistant", text: "可以先把受众收窄到一人公司和内容从业者，内容只讲真正用进日常工作的 AI 流程，不做泛工具盘点。" },
    ],
  },
  {
    id: "chat-4",
    title: "本周内容安排",
    preview: "一篇真实使用、一篇问题拆解、一篇选购判断。",
    updated: "8 月 5 日",
    group: "更早",
    messages: [
      { role: "user", text: "给爪边生活排三篇这周的内容。" },
      { role: "assistant", text: "这周可以用一篇真实使用、一篇问题拆解、一篇选购判断来组合，避免三篇都在介绍同一个商品。" },
    ],
  },
];

function getPrototypeSessionKey() {
  const demoMode = new URLSearchParams(window.location.search).get("demo") || "default";
  return `babu-prototype-session-v1:${demoMode}`;
}

function getPersistentFieldKey(field, index) {
  return field.id || `${field.name || field.tagName.toLowerCase()}:${index}`;
}

function captureFormValues() {
  return [...document.querySelectorAll("input, textarea, select")].flatMap((field, index) => {
    if (["file", "password"].includes(field.type)) return [];

    return [{
      key: getPersistentFieldKey(field, index),
      value: field.value,
      checked: "checked" in field ? field.checked : undefined,
    }];
  });
}

function restoreFormValues(fields = []) {
  const values = new Map(fields.map((item) => [item.key, item]));

  [...document.querySelectorAll("input, textarea, select")].forEach((field, index) => {
    if (["file", "password"].includes(field.type)) return;

    const saved = values.get(getPersistentFieldKey(field, index));
    if (!saved) return;

    field.value = saved.value ?? "";
    if (typeof saved.checked === "boolean") field.checked = saved.checked;
  });
}

function readPrototypeSession() {
  try {
    const value = window.sessionStorage.getItem(getPrototypeSessionKey());
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function persistPrototypeSession() {
  try {
    window.sessionStorage.setItem(getPrototypeSessionKey(), JSON.stringify({
      currentScreen,
      navigationStack,
      prototypeState,
      currentCreateStep,
      currentAccountType,
      projectIdSeed,
      savedAccounts,
      selectedAccountId,
      currentAccountDetailTab,
      selectedAccountProductIndex,
      currentCreationSource,
      selectedProductMainlineIndex,
      editingAccountId,
      selectedConversationId,
      conversationIdSeed,
      chatConversations,
      formValues: captureFormValues(),
    }));
  } catch {
    // Session persistence is best effort in the local prototype.
  }
}

function applyPrototypeSession(session) {
  if (!session) return false;

  currentScreen = screenTitles[session.currentScreen] ? session.currentScreen : "login";
  navigationStack = Array.isArray(session.navigationStack) ? session.navigationStack : [];
  prototypeState = { ...prototypeState, ...(session.prototypeState || {}) };
  currentCreateStep = session.currentCreateStep || currentCreateStep;
  currentAccountType = session.currentAccountType || currentAccountType;
  projectIdSeed = Number(session.projectIdSeed) || 0;
  savedAccounts = Array.isArray(session.savedAccounts) ? session.savedAccounts : savedAccounts;
  selectedAccountId = session.selectedAccountId ?? null;
  currentAccountDetailTab = session.currentAccountDetailTab || currentAccountDetailTab;
  selectedAccountProductIndex = Number(session.selectedAccountProductIndex) || 0;
  currentCreationSource = session.currentCreationSource || currentCreationSource;
  selectedProductMainlineIndex = Number(session.selectedProductMainlineIndex) || 0;
  editingAccountId = session.editingAccountId ?? null;
  selectedConversationId = session.selectedConversationId || selectedConversationId;
  conversationIdSeed = Number(session.conversationIdSeed) || conversationIdSeed;
  if (Array.isArray(session.chatConversations) && session.chatConversations.length) {
    chatConversations = session.chatConversations;
  }
  restoredFormValues = Array.isArray(session.formValues) ? session.formValues : [];
  return true;
}

function schedulePrototypeSessionPersist() {
  if (persistFrame) window.cancelAnimationFrame(persistFrame);

  persistFrame = window.requestAnimationFrame(() => {
    persistFrame = null;
    persistPrototypeSession();
  });
}

function readLoginSession() {
  try {
    return window.sessionStorage.getItem(loginSessionKey) === "true";
  } catch {
    return false;
  }
}

function setLoggedIn(value) {
  isLoggedIn = Boolean(value);
  try {
    window.sessionStorage.setItem(loginSessionKey, String(isLoggedIn));
    if (!isLoggedIn) window.sessionStorage.removeItem(getPrototypeSessionKey());
  } catch {
    // The prototype still works when storage is unavailable.
  }
}

const titleEl = document.getElementById("screenTitle");
const backBtn = document.querySelector("[data-action='go-back']");
const loginModal = document.querySelector("[data-login-modal]");

const demoAccounts = {
  brand: {
    type: "brand",
    typeLabel: "品牌",
    avatar: "爪",
    avatarSrc: "./assets/home/cat-smart-feeder.webp",
    name: "爪边生活",
    xhsId: "zaobianlife",
    following: "128",
    followers: "2,846",
    likes: "1.8万",
    bio: "分享养宠家庭的清洁、收纳和宠物用品使用经验，让进食区更清爽。",
    tags: ["宠物", "品牌名：爪边生活"],
    positioning: "面向养猫和小型犬家庭，解决宠物进食区脏乱、难清理和颜值不协调问题。",
    knowledge: true,
    contentCount: 3,
    recentNotes: ["猫碗旁边总是脏", "吃完饭少擦一次地", "宠物餐垫怎么选"],
  },
  ip: {
    type: "ip",
    typeLabel: "个人 IP",
    avatar: "AI",
    avatarSrc: "./assets/home/cat-sofa.webp",
    name: "AI 实战笔记",
    xhsId: "ai-work-note",
    following: "86",
    followers: "920",
    likes: "4,320",
    bio: "记录一人公司如何用 AI 做市场、产品、内容和运营复盘。",
    tags: ["AI 工具/效率", "一人公司"],
    positioning: "面向一人公司和自媒体运营者，分享 AI 实战工作流和内容增长经验。",
    knowledge: true,
    contentCount: 0,
    recentNotes: [],
  },
};

const homeStudioAccounts = {
  pet: {
    name: "爪边生活",
    positioning: "养宠家庭的清洁好物助手",
    count: "12 篇笔记",
    title: "每天扫猫粮？先别怪它贪吃",
    body: "猫粮、水渍和地板缝隙叠在一起，才是进食区难清理的原因。从餐垫边缘到每天清洁，这篇一次说清。",
    topics: ["#新手养猫", "#宠物好物", "#家居清洁"],
    image: "./assets/home/cat-smart-feeder.webp",
    prompt: "围绕宠物进食区清洁，生成一篇可发布的小红书笔记",
  },
  ip: {
    name: "AI 实战笔记",
    positioning: "一人公司的 AI 工作流实测者",
    count: "8 篇笔记",
    title: "我把一天的运营工作，拆成了 3 个 AI 任务",
    body: "先别着急把所有工作交给 AI。我从选题、草稿到发布前检查各拆了一步，一天下来真正省掉的，是反复切换思路的时间。",
    topics: ["#AI工具", "#一人公司", "#内容运营"],
    image: "./assets/home/cat-sofa.webp",
    prompt: "用真实经验的口吻，写一篇 AI 提高内容运营效率的笔记",
  },
  local: {
    name: "新手养宠指南",
    positioning: "帮新手少走弯路的养宠经验号",
    count: "21 篇笔记",
    title: "猫砂盆别急着买大号，先看家里这个位置",
    body: "猫砂盆好不好用，不只看尺寸。通风、动线和每天清理时的空间，都会决定你后面会不会想换掉它。",
    topics: ["#新手养宠", "#猫砂盆", "#养猫避坑"],
    image: "./assets/home/cat-litter-box.webp",
    prompt: "写一篇新手选猫砂盆的避坑笔记，少讲参数，多讲使用场景",
  },
};

const homeStudioPhases = [
  { key: "account", label: "正在读取账号资料", progress: 18, statusStep: 0 },
  { key: "positioning", label: "正在匹配账号定位", progress: 38, statusStep: 1 },
  { key: "title", label: "正在生成笔记标题", progress: 58, statusStep: 2 },
  { key: "body", label: "正在撰写正文与话题", progress: 82, statusStep: 2 },
  { key: "image", label: "正在匹配图片方案", progress: 96, statusStep: 2 },
  { key: "complete", label: "已生成，可继续编辑", progress: 100, statusStep: 3 },
];

let homeStudioTimer = null;
let homeStudioPhaseIndex = 0;

const productionPillars = {
  brand: [
    ["宠物进食区清洁", "场景痛点、清理前后、简单解决方案。"],
    ["新手养宠家居避坑", "避坑清单、用品选择、家里更好收拾。"],
    ["宠物用品真实测评", "真实测试、适合谁、不适合谁。"],
  ],
  ip: [
    ["AI 工具真实实测", "用真实任务验证工具能力、成本和限制。"],
    ["一人公司工作流", "拆解从市场、产品到内容交付的完整过程。"],
    ["自媒体运营复盘", "记录一次运营动作、结果和下一步调整。"],
  ],
};

const brandProducts = [
  {
    name: "可水洗防滑宠物餐垫",
    images: ["./assets/home/pet-bowl-detail.webp"],
    price: "10 元 - 50 元",
    sellingPoint: "高边挡水、可冲洗、底部防滑，颜色适合家居环境。",
    consumerScene: "养猫家庭、小型犬家庭、多宠家庭，希望把宠物进食区整理得更清爽。",
    useScene: "猫狗吃饭、喝水、湿粮喂食，以及地面水渍和粮渣集中清理。",
  },
  {
    name: "智能宠物饮水机",
    images: ["./assets/home/cat-smart-feeder.webp"],
    price: "89 元 - 199 元",
    sellingPoint: "循环过滤、静音出水，日常拆洗方便，适合长时间放在家中使用。",
    consumerScene: "需要改善宠物饮水习惯、白天经常不在家的养宠家庭。",
    useScene: "客厅、阳台或宠物固定饮水区，满足猫狗日常饮水。",
  },
  {
    name: "封闭式猫砂盆",
    images: ["./assets/home/cat-litter-box.webp"],
    price: "99 元 - 299 元",
    sellingPoint: "减少带砂和异味扩散，入口宽敞，清理结构简单。",
    consumerScene: "重视居家整洁、空间有限或同时养多只猫的家庭。",
    useScene: "卫生间、阳台或独立猫砂区，便于日常铲砂和深度清洁。",
  },
];

const ipServices = [
  {
    name: "AI 运营陪跑",
    image: "./assets/home/cat-sofa.webp",
    price: "按服务方案沟通",
    sellingPoint: "围绕真实业务梳理 AI 工作流，把内容想法转成可执行任务。",
    consumerScene: "一人公司、自媒体运营者和需要提高内容效率的小团队。",
    useScene: "账号定位、内容规划、工具选择与阶段复盘。",
  },
];

function copyAccount(account, overrides = {}) {
  projectIdSeed += 1;
  return {
    ...account,
    ...overrides,
    tags: [...(overrides.tags || account.tags || [])],
    recentNotes: [...(overrides.recentNotes || account.recentNotes || [])],
    id: `account-${projectIdSeed}`,
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getSelectedChipText(root, selector = ".option-chip.selected") {
  return root?.querySelector(selector)?.textContent.trim() || "";
}

function getSelectedChipTexts(root, selector = ".option-chip.selected") {
  return [...(root?.querySelectorAll(selector) || [])].map((el) => el.textContent.trim()).filter(Boolean);
}

function formatAccountNumber(value, fallback) {
  const text = String(value || "").trim();
  if (!text) return fallback;
  const number = Number.parseInt(text.replaceAll(",", ""), 10);
  return Number.isFinite(number) && number >= 1000 ? number.toLocaleString("zh-CN") : text;
}

function openLoginModal() {
  if (!loginModal) return;
  loginModal.hidden = false;
}

function closeLoginModal() {
  if (!loginModal) return;
  loginModal.hidden = true;
}

function showToast(message) {
  const toast = document.querySelector("[data-app-toast]");
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3000);
}

function renderAuthState() {
  document.querySelectorAll("[data-auth-show]").forEach((el) => {
    const shouldShow = el.dataset.authShow === (isLoggedIn ? "loggedIn" : "loggedOut");
    el.hidden = !shouldShow;
  });

  const homePrimary = document.querySelector("[data-home-primary]");
  if (homePrimary) {
    const label = homePrimary.querySelector("span");
    if (label) label.textContent = isLoggedIn ? "进入工作台" : "立即开始";
    else homePrimary.textContent = isLoggedIn ? "进入工作台" : "立即开始";
  }
}

function renderHomeStudioAccount(key) {
  const account = homeStudioAccounts[key];
  if (!account) return;

  document.querySelectorAll("[data-home-studio-account]").forEach((button) => {
    button.classList.toggle("active", button.dataset.homeStudioAccount === key);
  });

  const values = {
    "[data-home-studio-name]": account.name,
    "[data-home-studio-position]": account.positioning,
    "[data-home-studio-count]": account.count,
    "[data-home-studio-title]": account.title,
    "[data-home-studio-body]": account.body,
  };

  Object.entries(values).forEach(([selector, value]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  });

  const topics = document.querySelector("[data-home-studio-topics]");
  if (topics) topics.innerHTML = account.topics.map((topic) => `<span>${escapeHtml(topic)}</span>`).join("");

  const image = document.querySelector("[data-home-studio-image]");
  if (image) image.src = account.image;

  const prompt = document.querySelector("[data-home-studio-prompt]");
  if (prompt) prompt.value = account.prompt;

  homeStudioPhaseIndex = 0;
  applyHomeStudioPhase(homeStudioPhaseIndex);
  scheduleHomeStudioPhase();
}

function applyHomeStudioPhase(index) {
  const phase = homeStudioPhases[index];
  if (!phase) return;

  const flowSteps = document.querySelectorAll("[data-home-flow-step]");
  if (flowSteps.length) {
    const preview = document.querySelector("[data-home-preview]");
    const status = document.querySelector("[data-home-studio-status]");
    const progressBar = document.querySelector("[data-home-studio-progress-bar]");
    const continuousStatus = document.querySelector("[data-home-flow-status]");
    const activeStep = phase.key === "complete" ? flowSteps.length : Math.min(index, flowSteps.length - 1);

    if (preview) preview.dataset.phase = phase.key;
    if (status) status.textContent = phase.key === "complete" ? "内容已生成，下一篇继续准备中" : phase.label;
    if (progressBar) progressBar.style.width = `${phase.progress}%`;
    if (continuousStatus) continuousStatus.textContent = phase.key === "complete" ? "本篇已完成" : phase.label;

    flowSteps.forEach((step, stepIndex) => {
      step.classList.toggle("active", phase.key !== "complete" && stepIndex === activeStep);
      step.classList.toggle("complete", phase.key === "complete" || stepIndex < activeStep);
    });
    return;
  }

  const composer = document.querySelector(".ai-composer");
  const canvas = document.querySelector("[data-home-studio-canvas]");
  const status = document.querySelector("[data-home-studio-status]");
  const progress = document.querySelector("[data-home-studio-progress]");
  const progressBar = document.querySelector("[data-home-studio-progress-bar]");
  if (!composer || !canvas || !status || !progress || !progressBar) return;

  canvas.dataset.phase = phase.key;
  status.textContent = phase.label;
  progress.textContent = `${phase.progress}%`;
  progressBar.style.width = `${phase.progress}%`;
  composer.classList.toggle("is-running", phase.key !== "complete");

  document.querySelectorAll("[data-home-generation-step]").forEach((step) => {
    const stepIndex = Number(step.dataset.homeGenerationStep);
    step.classList.toggle("active", stepIndex === index);
    step.classList.toggle("complete", stepIndex < index || phase.key === "complete");
  });

  document.querySelectorAll("[data-home-status-step]").forEach((step) => {
    const stepIndex = Number(step.dataset.homeStatusStep);
    step.classList.toggle("active", stepIndex === phase.statusStep);
    step.classList.toggle("complete", stepIndex < phase.statusStep || phase.key === "complete");
  });
}

function scheduleHomeStudioPhase() {
  window.clearTimeout(homeStudioTimer);
  if (currentScreen !== "login" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const delay = homeStudioPhases[homeStudioPhaseIndex]?.key === "complete" ? 2800 : 1200;
  homeStudioTimer = window.setTimeout(() => {
    homeStudioPhaseIndex = (homeStudioPhaseIndex + 1) % homeStudioPhases.length;
    applyHomeStudioPhase(homeStudioPhaseIndex);
    scheduleHomeStudioPhase();
  }, delay);
}

function startHomeStudioAnimation() {
  homeStudioPhaseIndex = 0;
  applyHomeStudioPhase(homeStudioPhaseIndex);
  scheduleHomeStudioPhase();
}

function stopHomeStudioAnimation() {
  window.clearTimeout(homeStudioTimer);
  homeStudioTimer = null;
}

function runHomeStudioDemo() {
  const composer = document.querySelector(".ai-composer");
  if (!composer) return;

  composer.classList.add("is-running");
  startHomeStudioAnimation();
}

function renderWorkbenchGuide() {
  const guide = document.querySelector("[data-workbench-guide]");
  if (!guide) return;

  guide.textContent = prototypeState.project
    ? "选择一个账号继续创作，或添加新的账号。"
    : "先添加一个账号，巴布会帮你沉淀定位、资料和内容。";
}

function goHome() {
  closeLoginModal();
  closeInlineNoteDetail();
  navigationStack = [];
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.hash}`);
  navigate("login", { skipHistory: true });
}

function logout() {
  setLoggedIn(false);
  selectedAccountId = null;
  syncProjectState();
  goHome();
}

function routeAfterLogin() {
  syncProjectState();
  selectedAccountId = null;
  navigationStack = [];
  navigate(savedAccounts.length > 0 ? "production" : "projects", { skipHistory: true });
}

function syncProjectState() {
  prototypeState.project = savedAccounts.length > 0;
  prototypeState.knowledge = savedAccounts.some((account) => account.knowledge);
}

function ensureDemoAccount(knowledge = true) {
  if (savedAccounts.length > 0) return;
  savedAccounts = [copyAccount(demoAccounts.brand, {
    knowledge,
    contentCount: knowledge ? 3 : 0,
    recentNotes: knowledge ? demoAccounts.brand.recentNotes : [],
  })];
  syncProjectState();
}

function renderProjectCards() {
  const detail = document.querySelector("[data-account-detail]");
  if (!detail) return;

  const accountMode = ["projects", "create", "knowledge", "home"].includes(currentScreen);
  if (accountMode && savedAccounts.length > 0 && !savedAccounts.some((account) => account.id === selectedAccountId)) {
    selectedAccountId = savedAccounts[0].id;
  }

  const account = savedAccounts.find((item) => item.id === selectedAccountId);
  detail.hidden = !account;
  if (!account) {
    detail.innerHTML = "";
    return;
  }

  const displayTags = account.tags
    .map((tag) => tag.replace(/^品牌名：/, ""))
    .filter((tag) => tag && tag !== account.name);
  if (account.type === "brand" && !displayTags.includes("猫")) displayTags.push("猫");
  const tags = displayTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  const image = account.avatarSrc
    ? `<img src="${escapeHtml(account.avatarSrc)}" alt="${escapeHtml(account.name)}" />`
    : `<span>${escapeHtml(account.avatar)}</span>`;
  const profileRows = account.type === "ip"
    ? `
      <div><dt>账号定位</dt><dd>${escapeHtml(account.positioning)}</dd></div>
      <div><dt>IP 方向</dt><dd>${escapeHtml(account.tags[0] || "AI 工具与效率")}</dd></div>
      <div><dt>身份标签</dt><dd>${escapeHtml(displayTags.join("、") || "内容创作者")}</dd></div>
      <div><dt>专业能力</dt><dd>产品设计、内容运营、AI 工作流</dd></div>
      <div><dt>核心观点</dt><dd>AI 不是替你创作，而是帮助你把真实经验整理得更清楚。</dd></div>
      <div><dt>产品或服务</dt><dd>${escapeHtml(ipServices.map((service) => service.name).join("、") || "暂未填写")}</dd></div>
      <div><dt>人设边界</dt><dd>不装专家、不夸大、不制造焦虑</dd></div>
    `
    : `
      <div><dt>账号定位</dt><dd>${escapeHtml(account.positioning)}</dd></div>
      <div><dt>品牌名</dt><dd>${escapeHtml(account.name)}</dd></div>
      <div><dt>标签</dt><dd class="account-profile-tag-list">${tags || "<span>品牌</span>"}</dd></div>
      <div><dt>目标用户年龄</dt><dd>25 岁 - 40 岁</dd></div>
      <div><dt>目标用户地域</dt><dd>一线城市、二线城市</dd></div>
      <div><dt>解决用户痛点</dt><dd>养宠家庭重视家里整洁和宠物用品颜值，希望减少进食区的水渍、粮渣和异味。</dd></div>
    `;
  const isBrandAccount = account.type === "brand";
  const availableTabs = isBrandAccount ? ["overview", "profile", "products"] : ["overview", "profile"];
  if (!availableTabs.includes(currentAccountDetailTab)) currentAccountDetailTab = "overview";

  const products = isBrandAccount ? brandProducts : [];
  const selectedProduct = products[Math.min(selectedAccountProductIndex, products.length - 1)] || products[0];
  const productTabs = products.map((product, index) => `
    <button class="account-product-tab${index === selectedAccountProductIndex ? " active" : ""}" type="button" role="tab" data-account-product-index="${index}" aria-selected="${index === selectedAccountProductIndex}" aria-controls="account-selected-product-detail">
      ${escapeHtml(product.name)}
    </button>
  `).join("");
  const selectedProductImages = (selectedProduct?.images || []).slice(0, 3).map((src, index) => `
    <figure class="account-product-gallery-item">
      <img src="${escapeHtml(src)}" alt="${escapeHtml(selectedProduct.name)}商品图 ${index + 1}" />
    </figure>
  `).join("");
  const recentNotes = Array.isArray(account.recentNotes) ? account.recentNotes.slice(0, 3) : [];
  const generatedCount = Number(account.contentCount || recentNotes.length || 0);
  const completeness = account.knowledge ? (isBrandAccount ? 92 : 88) : 64;
  const overviewPositioning = isBrandAccount
    ? `品牌 · ${displayTags[0] || "待补充方向"}`
    : `个人 IP · ${account.tags[0] || "待补充方向"}`;
  const overviewAge = isBrandAccount ? "25 岁 - 40 岁" : "21 岁 - 35 岁";
  const overviewDirection = isBrandAccount
    ? `${displayTags.join(" / ") || "品牌内容"} / 场景经验`
    : `${displayTags.join(" / ") || "专业经验"} / 工作方法`;
  const recentNoteRows = recentNotes.length
    ? recentNotes.map((note, index) => {
      const noteTitle = typeof note === "string" ? note : note.title || `笔记 ${index + 1}`;
      const noteMeta = typeof note === "object" && note.meta ? note.meta : "标准正文 · 500-700 字";
      const thumbnail = account.avatarSrc
        ? `<img src="${escapeHtml(account.avatarSrc)}" alt="" />`
        : `<span>${escapeHtml(account.avatar)}</span>`;
      return `
        <article class="account-recent-note">
          <span class="account-recent-note-thumb">${thumbnail}</span>
          <span class="account-recent-note-copy">
            <strong>${escapeHtml(noteTitle)}</strong>
            <small>${escapeHtml(noteMeta)}</small>
          </span>
        </article>
      `;
    }).join("")
    : `
      <div class="account-recent-empty">
        <strong>还没有生成内容</strong>
        <span>完成第一次创作后，最近内容会显示在这里。</span>
      </div>
    `;
  const detailTabs = [
    ["overview", "概览"],
    ["profile", "资料"],
    ...(isBrandAccount ? [["products", "商品"]] : []),
  ].map(([key, label]) => `
    <button class="${currentAccountDetailTab === key ? "active" : ""}" type="button" role="tab" aria-selected="${currentAccountDetailTab === key}" data-account-detail-tab="${key}">${label}</button>
  `).join("");
  const productsPanel = isBrandAccount && selectedProduct ? `
    <section class="account-profile-panel account-products-panel" data-account-detail-panel="products"${currentAccountDetailTab === "products" ? "" : " hidden"}>
      <div class="account-product-list" role="tablist" aria-label="选择商品">${productTabs}</div>
      <section class="account-product-detail" id="account-selected-product-detail" role="tabpanel" aria-live="polite">
        <div class="account-product-gallery" aria-label="${escapeHtml(selectedProduct.name)}商品图片">
          ${selectedProductImages}
        </div>
        <dl class="account-product-fields">
          <div><dt>定价</dt><dd>${escapeHtml(selectedProduct.price)}</dd></div>
          <div><dt>卖点</dt><dd>${escapeHtml(selectedProduct.sellingPoint)}</dd></div>
          <div><dt>消费场景</dt><dd>${escapeHtml(selectedProduct.consumerScene)}</dd></div>
          <div><dt>使用场景</dt><dd>${escapeHtml(selectedProduct.useScene)}</dd></div>
        </dl>
      </section>
    </section>
  ` : "";

  detail.innerHTML = `
    <button class="primary-btn account-profile-edit" type="button" data-action="edit-account">
      <img src="./assets/icons/pencil.svg" alt="" />
      <span>编辑</span>
    </button>
    <header class="account-profile-hero">
      <div class="account-profile-avatar">${image}</div>
      <div class="account-profile-intro">
        <div class="account-profile-name-row">
          <h2>${escapeHtml(account.name)}</h2>
          <span>${escapeHtml(account.typeLabel)}</span>
        </div>
        <p class="account-profile-id">小红书号：${escapeHtml(account.xhsId)}</p>
        <p class="account-profile-bio">${escapeHtml(account.bio)}</p>
      </div>
    </header>
    <div class="account-profile-content">
      <div class="account-profile-tabs" role="tablist" aria-label="账号详情">
        ${detailTabs}
      </div>
      <section class="account-profile-panel account-overview-panel" data-account-detail-panel="overview"${currentAccountDetailTab === "overview" ? "" : " hidden"}>
        <div class="account-overview-status">
          <div class="account-completeness-block">
            <span class="account-overview-label">账号完整度</span>
            <div class="account-completeness-ring" style="--account-completeness: ${completeness}%">
              <strong>${completeness}%</strong>
            </div>
          </div>
          <div class="account-generated-block">
            <span class="account-overview-label">内容已生成</span>
            <strong>${generatedCount}<small>篇</small></strong>
            <span>${generatedCount > 0 ? "最近更新：今天 10:25" : "最近更新：暂无"}</span>
          </div>
        </div>
        <div class="account-overview-main">
          <section class="account-overview-summary">
            <h3>摘要</h3>
            <dl>
              <div><dt>账号定位</dt><dd>${escapeHtml(overviewPositioning)}</dd></div>
              <div><dt>目标用户年龄</dt><dd>${escapeHtml(overviewAge)}</dd></div>
              <div><dt>内容方向</dt><dd>${escapeHtml(overviewDirection)}</dd></div>
            </dl>
          </section>
          <section class="account-recent-content">
            <header>
              <h3>近期内容</h3>
              ${recentNotes.length ? '<button type="button" data-go="history">查看全部</button>' : ""}
            </header>
            <div class="account-recent-list">${recentNoteRows}</div>
          </section>
        </div>
      </section>
      <section class="account-profile-panel" data-account-detail-panel="profile"${currentAccountDetailTab === "profile" ? "" : " hidden"}>
        <dl class="account-profile-fields">${profileRows}</dl>
      </section>
      ${productsPanel}
    </div>
  `;
}

function renderContextSidebar() {
  const title = document.querySelector("[data-context-title]");
  const search = document.querySelector(".context-search");
  const searchInput = document.querySelector("[data-account-search]");
  const createButton = document.querySelector("[data-context-create]");
  const inlineCreateButton = document.querySelector("[data-context-add-inline]");
  const generationSettings = document.querySelector("[data-context-generation-settings]");
  const sectionTitle = document.querySelector("[data-context-section-title]");
  const list = document.querySelector("[data-context-account-list]");
  const empty = document.querySelector("[data-context-empty]");
  if (!title || !createButton || !sectionTitle || !list || !empty) return;

  const chatMode = currentScreen === "chat";
  const creationMode = ["production", "history", "note"].includes(currentScreen);
  const createMode = currentScreen === "create";

  if (chatMode) {
    title.textContent = "对话";
    sectionTitle.textContent = "历史对话";
    if (search) search.hidden = false;
    if (searchInput) {
      if (searchInput.dataset.mode !== "chat") searchInput.value = "";
      searchInput.dataset.mode = "chat";
      searchInput.disabled = false;
      searchInput.placeholder = "搜索历史对话";
    }
    createButton.hidden = false;
    createButton.disabled = false;
    createButton.setAttribute("aria-disabled", "false");
    createButton.classList.remove("is-current", "has-accounts");
    createButton.dataset.state = "enabled";
    createButton.removeAttribute("data-go");
    createButton.dataset.action = "new-chat";
    const createLabel = createButton.querySelector("span");
    if (createLabel) createLabel.textContent = "新建对话";
    if (inlineCreateButton) inlineCreateButton.hidden = true;
    if (generationSettings) generationSettings.hidden = true;

    const query = searchInput?.value.trim().toLowerCase() || "";
    const conversations = chatConversations.filter((conversation) => {
      if (!query) return true;
      return [conversation.title, conversation.preview].join(" ").toLowerCase().includes(query);
    });
    empty.hidden = conversations.length > 0;
    empty.textContent = "没有匹配的对话";

    let previousGroup = "";
    list.innerHTML = conversations.map((conversation) => {
      const group = conversation.group || "更早";
      const groupLabel = group !== previousGroup
        ? `<div class="chat-history-group-label">${escapeHtml(group)}</div>`
        : "";
      previousGroup = group;
      return `${groupLabel}
        <button class="chat-history-item${conversation.id === selectedConversationId ? " active" : ""}" type="button" data-chat-id="${escapeHtml(conversation.id)}">
          <strong>${escapeHtml(conversation.title)}</strong>
          <time>${escapeHtml(conversation.updated)}</time>
          <span>${escapeHtml(conversation.preview || "暂无消息")}</span>
        </button>`;
    }).join("");
    return;
  }

  if (searchInput) {
    if (searchInput.dataset.mode !== "account") searchInput.value = "";
    searchInput.dataset.mode = "account";
  }
  createButton.removeAttribute("data-action");
  createButton.dataset.go = "create";
  const createLabel = createButton.querySelector("span");
  if (createLabel) createLabel.textContent = "创建账号";
  title.textContent = creationMode ? "创作" : "账号";
  sectionTitle.textContent = creationMode ? "选择账号" : "我的账号";
  if (search) search.hidden = creationMode;
  if (searchInput) {
    const hasAccounts = savedAccounts.length > 0;
    searchInput.disabled = !hasAccounts;
    searchInput.placeholder = hasAccounts ? "在当前列表搜索" : "暂无账号可搜索";
    if (!hasAccounts) searchInput.value = "";
  }
  createButton.hidden = creationMode;
  createButton.disabled = createMode;
  createButton.setAttribute("aria-disabled", String(createMode));
  createButton.classList.toggle("is-current", createMode);
  const canCreateAdditionalAccount = savedAccounts.length > 0 && !createMode;
  createButton.classList.toggle("has-accounts", canCreateAdditionalAccount);
  createButton.dataset.state = canCreateAdditionalAccount ? "enabled" : "muted";
  if (inlineCreateButton) inlineCreateButton.hidden = !creationMode;
  if (generationSettings) {
    generationSettings.hidden = !(
      currentScreen === "production"
      && selectedAccountId
      && !document.body.classList.contains("note-detail-open")
    );
  }

  const query = document.querySelector("[data-account-search]")?.value.trim().toLowerCase() || "";
  const accounts = savedAccounts.filter((account) => {
    if (!query) return true;
    return [account.name, account.xhsId, account.typeLabel, ...account.tags].join(" ").toLowerCase().includes(query);
  });

  empty.hidden = accounts.length > 0;
  empty.textContent = savedAccounts.length === 0 ? "暂无账号" : "没有匹配的账号";
  list.innerHTML = accounts.map((account) => {
    const selected = account.id === selectedAccountId;
    const image = account.avatarSrc
      ? `<img src="${escapeHtml(account.avatarSrc)}" alt="" />`
      : `<span>${escapeHtml(account.avatar)}</span>`;
    const selectAttr = creationMode
      ? `data-select-creation-account="${escapeHtml(account.id)}"`
      : `data-select-project-account="${escapeHtml(account.id)}"`;
    return `
      <button class="context-account-item${selected ? " active" : ""}" type="button" ${selectAttr}>
        <span class="context-account-avatar">${image}</span>
        <span class="context-account-copy">
          <strong>${escapeHtml(account.name)}</strong>
          <small>${escapeHtml(account.tags[0] || account.typeLabel)} · ${escapeHtml(account.xhsId)}</small>
        </span>
        <span class="context-account-meta">${escapeHtml(account.contentCount)} 条</span>
      </button>
    `;
  }).join("");
}

function getSelectedConversation() {
  let conversation = chatConversations.find((item) => item.id === selectedConversationId);
  if (!conversation && chatConversations.length) {
    [conversation] = chatConversations;
    selectedConversationId = conversation.id;
  }
  return conversation || null;
}

function updateChatComposerState() {
  const input = document.querySelector("[data-chat-input]");
  const sendButton = document.querySelector("[data-action='send-chat']");
  if (!input || !sendButton) return;
  const replying = chatReplyingConversationId === selectedConversationId;
  sendButton.disabled = replying || !input.value.trim();
}

function resizeChatInput() {
  const input = document.querySelector("[data-chat-input]");
  if (!input) return;
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 150)}px`;
}

function renderChatScreen(options = {}) {
  const title = document.querySelector("[data-chat-title]");
  const updated = document.querySelector("[data-chat-updated]");
  const messages = document.querySelector("[data-chat-messages]");
  const thread = document.querySelector("[data-chat-thread]");
  if (!title || !updated || !messages || !thread) return;

  const conversation = getSelectedConversation();
  if (!conversation) return;
  title.textContent = conversation.title;
  updated.textContent = conversation.updated;

  if (conversation.messages.length === 0) {
    messages.innerHTML = `
      <div class="chat-empty-state">
        <div class="chat-empty-brand">
          <img src="./assets/brand/babu-app-icon.png" alt="" />
          <h2>今天想一起做什么？</h2>
        </div>
        <div class="chat-suggestion-grid">
          <button class="chat-suggestion" type="button" data-chat-suggestion="帮我为爪边生活找 3 个本周可写的选题">帮我找 3 个本周可写的选题</button>
          <button class="chat-suggestion" type="button" data-chat-suggestion="把这段正文改得更像真实使用分享">把正文改得更像真实使用分享</button>
          <button class="chat-suggestion" type="button" data-chat-suggestion="帮我梳理 AI 实战笔记的账号定位">梳理 AI 实战笔记的账号定位</button>
          <button class="chat-suggestion" type="button" data-chat-suggestion="帮我看看这个选题有没有广告感">看看这个选题有没有广告感</button>
        </div>
      </div>`;
  } else {
    messages.innerHTML = conversation.messages.map((message) => {
      if (message.role === "user") {
        return `<article class="chat-message user"><div class="chat-message-content">${escapeHtml(message.text)}</div></article>`;
      }
      return `
        <article class="chat-message assistant">
          <span class="chat-message-avatar"><img src="./assets/brand/babu-app-icon.png" alt="" /></span>
          <div class="chat-message-content">${escapeHtml(message.text)}</div>
        </article>`;
    }).join("");

    if (chatReplyingConversationId === conversation.id) {
      messages.insertAdjacentHTML("beforeend", `
        <article class="chat-message assistant is-typing" aria-label="正在回复">
          <span class="chat-message-avatar"><img src="./assets/brand/babu-app-icon.png" alt="" /></span>
          <div class="chat-message-content"><i></i><i></i><i></i></div>
        </article>`);
    }
  }

  updateChatComposerState();
  if (options.scrollToEnd) {
    window.requestAnimationFrame(() => {
      thread.scrollTop = thread.scrollHeight;
    });
  }
}

function createNewConversation() {
  const selected = getSelectedConversation();
  if (selected?.messages.length === 0) {
    document.querySelector("[data-chat-input]")?.focus();
    return;
  }

  conversationIdSeed += 1;
  const conversation = {
    id: `chat-${conversationIdSeed}`,
    title: "新对话",
    preview: "暂无消息",
    updated: "刚刚",
    group: "今天",
    messages: [],
  };
  chatConversations.unshift(conversation);
  selectedConversationId = conversation.id;
  renderContextSidebar();
  renderChatScreen();
  document.querySelector("[data-chat-input]")?.focus();
}

function buildChatReply(message) {
  if (/改|改写|优化|正文/.test(message)) {
    return "可以。把原文贴过来，我会优先保留真实细节，去掉空泛总结、功能堆叠和太像广告的表达。";
  }
  if (/选题|主题|写什么/.test(message)) {
    return "可以先用三种角度来拆：\n\n1. 一个用户每天都会遇到的小麻烦\n2. 一个使用前后的真实变化\n3. 一个选购时容易忽略的判断\n\n你告诉我账号和想写的产品，我可以继续收窄成具体标题。";
  }
  if (/定位|账号/.test(message)) {
    return "可以从三件事开始：你最想服务哪类人、他们反复遇到什么问题、你能用哪些真实经历回答。先把这三项写清楚，定位会比“分享干货”更具体。";
  }
  return "收到。我先按真实场景、用户问题和可执行细节来梳理，不急着下结论。你可以再补充一下对应的账号或原始素材。";
}

function sendChatMessage() {
  const input = document.querySelector("[data-chat-input]");
  const conversation = getSelectedConversation();
  const message = input?.value.trim();
  if (!input || !conversation || !message || chatReplyingConversationId === conversation.id) return;

  conversation.messages.push({ role: "user", text: message });
  if (conversation.title === "新对话") {
    conversation.title = message.length > 20 ? `${message.slice(0, 20)}...` : message;
  }
  conversation.preview = message;
  conversation.updated = "刚刚";
  conversation.group = "今天";
  input.value = "";
  resizeChatInput();
  chatReplyingConversationId = conversation.id;
  renderContextSidebar();
  renderChatScreen({ scrollToEnd: true });

  window.clearTimeout(chatReplyTimer);
  const replyingId = conversation.id;
  chatReplyTimer = window.setTimeout(() => {
    const target = chatConversations.find((item) => item.id === replyingId);
    if (!target) return;
    const reply = buildChatReply(message);
    target.messages.push({ role: "assistant", text: reply });
    target.preview = reply.replaceAll("\n", " ").slice(0, 54);
    target.updated = "刚刚";
    chatReplyingConversationId = null;
    renderContextSidebar();
    if (currentScreen === "chat" && selectedConversationId === replyingId) {
      renderChatScreen({ scrollToEnd: true });
    }
    persistPrototypeSession();
  }, 1100);
}

function getHistoryNotes(account) {
  if (!account) return [];
  const notes = historyNoteLibrary[account.xhsId] || [];
  const baseCountByAccount = { zaobianlife: 3, "ai-work-note": 0, superfanqie: 2 };
  const totalCount = Math.max(0, Number(account.contentCount) || 0);
  const baseCount = Math.min(totalCount, baseCountByAccount[account.xhsId] ?? notes.length, notes.length);
  const baseNotes = notes.slice(0, baseCount);
  const generatedCount = Math.max(0, totalCount - baseNotes.length);
  const recentTitles = account.recentNotes?.length ? account.recentNotes : notes.map((note) => note.title);
  const allTemplates = Object.values(historyNoteLibrary).flat();
  const generatedNotes = Array.from({ length: generatedCount }, (_, index) => {
    const title = recentTitles[index % Math.max(1, recentTitles.length)] || `历史笔记 ${index + 1}`;
    const template = allTemplates.find((note) => note.title === title);
    if (template) return { ...template, time: index === 0 ? "刚刚" : `${index + 1} 分钟前` };
    return {
      title,
      body: generatedNoteBodies[title] || "这篇笔记记录了一个真实使用场景、具体问题和可执行的处理方法。",
      topics: (account.tags || []).slice(0, 3).map((tag) => `#${tag.replace(/^#/, "")}`),
      image: detailGeneratedImages[index % detailGeneratedImages.length].src,
      time: index === 0 ? "刚刚" : `${index + 1} 分钟前`,
    };
  });
  return [...generatedNotes, ...baseNotes].slice(0, totalCount);
}

function renderHistoryNotes() {
  const title = document.querySelector("[data-history-account-title]");
  const countLabel = document.querySelector("[data-history-note-count]");
  const head = document.querySelector(".history-note-list-head");
  const list = document.querySelector("[data-history-note-list]");
  const empty = document.querySelector("[data-history-notes-empty]");
  if (!title || !countLabel || !head || !list || !empty) return;

  let account = savedAccounts.find((item) => item.id === selectedAccountId);
  if (!account && savedAccounts.length > 0) {
    [account] = savedAccounts;
    selectedAccountId = account.id;
  }

  const notes = getHistoryNotes(account);
  title.textContent = account ? `${account.name}的历史笔记` : "历史笔记";
  countLabel.textContent = `共 ${notes.length} 篇`;
  head.hidden = notes.length === 0;
  empty.hidden = notes.length > 0;
  list.innerHTML = notes.map((note, index) => `
    <button class="history-note-row" type="button" data-history-note-index="${index}">
      <img class="history-note-cover" src="${escapeHtml(note.image)}" alt="" />
      <span class="history-note-copy">
        <strong>${escapeHtml(note.title)}</strong>
        <small>${escapeHtml(note.body)}</small>
      </span>
      <span class="history-note-topics">${note.topics.map((topic) => `<span>${escapeHtml(topic)}</span>`).join("")}</span>
      <time class="history-note-time">${escapeHtml(note.time)}</time>
      <span class="history-note-action">查看详情</span>
    </button>
  `).join("");
}

function renderHistoryNoteDetail() {
  const detail = document.querySelector("[data-history-note-detail]");
  if (!detail) return;

  const account = savedAccounts.find((item) => item.id === selectedAccountId);
  const notes = getHistoryNotes(account);
  const note = notes.find((item) => (
    item.title === selectedHistoryNote?.title && item.time === selectedHistoryNote?.time
  )) || notes[0];
  if (!note) return;

  selectedHistoryNote = note;
  detail.querySelector("[data-history-detail-heading]").textContent = note.title;
  detail.querySelector("[data-history-detail-title]").textContent = note.title;
  detail.querySelector("[data-history-detail-body]").textContent = note.body;
  renderDetailTopics(detail.querySelector("[data-history-detail-topics]"), note.topics.join(" "));
  resetDetailImageGeneration(detail);
}

function renderCreationAccountSelector() {
  const list = document.querySelector("[data-creation-account-list]");
  const content = document.querySelector("[data-creation-account-content]");
  const empty = document.querySelector("[data-creation-select-empty]");
  const stack = document.querySelector("[data-account-avatar-stack]");
  const label = document.querySelector("[data-account-switcher-label]");
  const meta = document.querySelector("[data-account-switcher-meta]");
  const trigger = document.querySelector("[data-action='toggle-account-switcher']");
  if (!list || !content) return;

  const selectedAccount = savedAccounts.find((account) => account.id === selectedAccountId);
  list.innerHTML = savedAccounts.map((account) => {
    const active = account.id === selectedAccountId;
    const image = account.avatarSrc
      ? `<img src="${escapeHtml(account.avatarSrc)}" alt="" />`
      : `<span>${escapeHtml(account.avatar)}</span>`;
    return `
      <button class="creation-account-option${active ? " active" : ""}" type="button" data-select-creation-account="${escapeHtml(account.id)}">
        <span class="creation-account-avatar">${image}</span>
        <span class="creation-account-copy">
          <strong>${escapeHtml(account.name)}</strong>
          <small>${escapeHtml(account.typeLabel)} · ${escapeHtml(account.xhsId)}</small>
        </span>
        <span class="creation-account-count">${escapeHtml(account.contentCount)} 条</span>
      </button>
    `;
  }).join("");

  if (stack) {
    const stackAccounts = selectedAccount
      ? [selectedAccount, ...savedAccounts.filter((account) => account.id !== selectedAccount.id)]
      : savedAccounts;
    const visibleAccounts = stackAccounts.slice(0, 3);
    stack.innerHTML = visibleAccounts.map((account) => {
      if (account.avatarSrc) {
        return `<img src="${escapeHtml(account.avatarSrc)}" alt="" />`;
      }
      return `<span>${escapeHtml(account.avatar)}</span>`;
    }).join("");
    if (stackAccounts.length > 3) {
      stack.insertAdjacentHTML("beforeend", `<b>+${stackAccounts.length - 3}</b>`);
    }
  }

  if (label) {
    const otherAccountCount = selectedAccount ? Math.max(0, savedAccounts.length - 1) : 0;
    label.textContent = selectedAccount
      ? `${selectedAccount.name}${otherAccountCount > 0 ? ` +${otherAccountCount}` : ""}`
      : "选择账号";
  }
  if (meta) {
    meta.textContent = selectedAccount
      ? `${selectedAccount.typeLabel} · ${selectedAccount.xhsId}`
      : savedAccounts.length > 0 ? `共 ${savedAccounts.length} 个账号` : "还没有已保存账号";
  }
  if (trigger) trigger.classList.toggle("has-account", Boolean(selectedAccount));

  content.hidden = !selectedAccount;
  if (empty) empty.hidden = Boolean(selectedAccount);
  if (!selectedAccount) return;

  renderProductionPillars(selectedAccount);
}

function attachProductionSettings() {
  updateNoteCountDisplay();
}

function setAccountSwitcherOpen(shouldOpen) {
  const popover = document.querySelector("[data-account-switcher-popover]");
  const trigger = document.querySelector(".production-account-trigger");
  if (!popover || !trigger) return;

  popover.hidden = !shouldOpen;
  trigger.setAttribute("aria-expanded", String(shouldOpen));
}

function toggleAccountSwitcher() {
  const popover = document.querySelector("[data-account-switcher-popover]");
  if (!popover) return;
  setAccountSwitcherOpen(popover.hidden);
}

function updateNoteCountDisplay() {
  const value = document.querySelector("[data-note-count-value]");
  if (value) value.textContent = String(getSelectedNoteCount());
}

function adjustNoteCount(delta) {
  const buttons = [...document.querySelectorAll(".note-count-group .option-chip")];
  if (!buttons.length) return;

  const currentIndex = Math.max(0, buttons.findIndex((button) => button.classList.contains("selected")));
  const nextIndex = Math.max(0, Math.min(buttons.length - 1, currentIndex + delta));
  buttons.forEach((button, index) => button.classList.toggle("selected", index === nextIndex));
  updateNoteCountDisplay();
  resetProductionPreview();
}

function getCreationProducts(account) {
  const products = Array.isArray(account?.products) && account.products.length
    ? account.products
    : brandProducts;
  return products.map((product, index) => ({
    ...product,
    name: product?.name || product?.productName || product?.title || `商品 ${index + 1}`,
  }));
}

function renderProductMainlines(account) {
  const container = document.querySelector("[data-product-mainline-options]");
  if (!container) return;

  const products = getCreationProducts(account);
  selectedProductMainlineIndex = Math.min(selectedProductMainlineIndex, Math.max(0, products.length - 1));
  container.replaceChildren(
    ...products.map((product, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `product-mainline-option${index === selectedProductMainlineIndex ? " selected" : ""}`;
      button.dataset.productMainlineIndex = String(index);
      button.textContent = product.name;
      return button;
    }),
  );
}

function setCreationSource(source, accountArg, shouldReset = false) {
  const account = accountArg || savedAccounts.find((item) => item.id === selectedAccountId);
  const isBrand = account?.type === "brand";
  currentCreationSource = isBrand && source === "product" ? "product" : "content";

  document.querySelectorAll("[data-creation-source]").forEach((button) => {
    const isProduct = button.dataset.creationSource === "product";
    button.hidden = isProduct && !isBrand;
    button.classList.toggle("active", button.dataset.creationSource === currentCreationSource);
  });
  document.querySelectorAll("[data-creation-source-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.creationSourcePanel !== currentCreationSource;
  });
  if (currentCreationSource === "product") renderProductMainlines(account);
  if (shouldReset) resetProductionPreview();
}

function renderProductionPillars(account) {
  const group = document.querySelector(".pillar-option-group");
  if (!group || !account) return;

  const accountChanged = group.dataset.accountId !== account.id;
  if (accountChanged) {
    const items = productionPillars[account.type] || productionPillars.brand;
    group.querySelectorAll(".pillar-option").forEach((button, index) => {
      const item = items[index] || items[0];
      const title = button.querySelector("strong");
      const description = button.querySelector("span");
      if (title) title.textContent = item[0];
      if (description) description.textContent = item[1];
      button.classList.toggle("selected", index === 0);
    });
    group.dataset.accountId = account.id;
    currentCreationSource = "content";
    selectedProductMainlineIndex = 0;
  }
  setCreationSource(currentCreationSource, account);
}

function resetProductionPreview() {
  document.querySelectorAll("[data-generated-preview]").forEach((preview) => {
    preview.hidden = true;
  });
  const empty = document.querySelector("[data-production-preview-empty]");
  if (empty) empty.hidden = false;
  closeInlineNoteDetail();
}

function getAccountPublicInfo(parser) {
  const manual = parser?.querySelector("[data-parse-manual]");
  const manualSaved = parser?.dataset.manualSaved === "true";
  if (manual && manualSaved) {
    const avatar = manual.querySelector("[data-manual-avatar-preview]");
    return {
      name: manual.querySelector("[data-manual-name]")?.value.trim() || "未命名账号",
      xhsId: manual.querySelector("[data-manual-xhs-id]")?.value.trim()
        || getXhsIdFromLink(parser?.querySelector("[data-account-link]")?.value)
        || "未填写",
      following: "0",
      followers: "0",
      likes: "0",
      bio: manual.querySelector("[data-manual-bio]")?.value.trim() || "暂未填写账号简介。",
      avatarSrc: avatar?.dataset.uploadedSrc || "",
    };
  }

  const preview = parser?.querySelector("[data-parse-success]");
  const name = preview?.querySelector("[data-public-name]")?.textContent.trim() || "超级番茄";
  const xhsText = preview?.querySelector("[data-public-id]")?.textContent.trim() || "小红书号：2384834834";
  return {
    name,
    xhsId: xhsText.replace("小红书号：", "").trim() || "2384834834",
    following: preview?.querySelector("[data-public-following]")?.textContent.trim() || "1",
    followers: preview?.querySelector("[data-public-followers]")?.textContent.trim() || "0",
    likes: preview?.querySelector("[data-public-likes]")?.textContent.trim() || "0",
    bio: preview?.querySelector("[data-public-bio]")?.textContent.trim() || "持续分享行业经验和专业知识。",
    avatarSrc: preview?.querySelector("[data-public-avatar]")?.getAttribute("src") || "",
  };
}

function getXhsIdFromLink(link = "") {
  const match = String(link).match(/\/user\/profile\/([^/?#]+)/i);
  return match?.[1] || "";
}

function buildAccountFromCreateForm() {
  const createScreen = document.querySelector("[data-view='create']");
  const parser = createScreen?.querySelector("[data-account-parser]");
  const publicInfo = getAccountPublicInfo(parser);
  const type = currentAccountType;
  const typeLabel = type === "ip" ? "个人 IP" : "品牌";
  const section = createScreen?.querySelector(`[data-account-section="${type}"]`);

  if (type === "ip") {
    const textareas = section?.querySelectorAll("textarea") || [];
    const selectedDirection = getSelectedChipText(section, ".option-group.single .option-chip.selected");
    const customDirection = section?.querySelector("[data-other-direction-input]")?.value.trim();
    const direction = selectedDirection === "其他"
      ? customDirection || "其他"
      : selectedDirection || "个人 IP";
    const identityTags = getSelectedChipTexts(section?.querySelector(".option-group.multi")).slice(0, 2);
    const positioning = textareas[1]?.value.trim() || textareas[0]?.value.trim() || "围绕个人经历、专业能力和服务方向，持续输出可信内容。";
    return copyAccount(demoAccounts.ip, {
      type,
      typeLabel,
      avatar: "IP",
      name: publicInfo.name,
      xhsId: publicInfo.xhsId,
      avatarSrc: publicInfo.avatarSrc || demoAccounts.ip.avatarSrc,
      following: publicInfo.following,
      followers: publicInfo.followers,
      likes: publicInfo.likes,
      bio: publicInfo.bio,
      tags: [direction, ...identityTags].filter(Boolean),
      positioning,
      knowledge: true,
      contentCount: 0,
      recentNotes: [],
    });
  }

  const inputs = section?.querySelectorAll("input") || [];
  const textareas = section?.querySelectorAll("textarea") || [];
  const brandName = inputs[0]?.value.trim() || publicInfo.name || "未命名品牌";
  const selectedDirection = getSelectedChipText(section, ".option-group.single .option-chip.selected");
  const customDirection = section?.querySelector("[data-other-direction-input]")?.value.trim();
  const direction = selectedDirection === "其他"
    ? customDirection || "其他"
    : selectedDirection || "品牌";
  const positioning = textareas[1]?.value.trim() || textareas[0]?.value.trim() || "围绕目标用户问题和产品场景，持续输出可发布的小红书内容。";

  return copyAccount(demoAccounts.brand, {
    type,
    typeLabel,
    avatar: brandName.slice(0, 1) || "B",
    name: brandName,
    xhsId: publicInfo.xhsId,
    avatarSrc: publicInfo.avatarSrc || demoAccounts.brand.avatarSrc,
    following: publicInfo.following,
    followers: publicInfo.followers,
    likes: publicInfo.likes,
    bio: publicInfo.bio,
    tags: [direction, `品牌名：${brandName}`].filter(Boolean),
    positioning,
    knowledge: true,
    contentCount: 0,
    recentNotes: [],
  });
}

function hasInlineNoteDetailOpen() {
  const detail = document.querySelector("[data-inline-note-detail]");
  return Boolean(detail && !detail.hidden);
}

function updateBackButton() {
  const canGoBack = currentScreen !== "login" && currentScreen !== "projects" && (navigationStack.length > 0 || hasInlineNoteDetailOpen());
  document.querySelectorAll("[data-action='go-back']").forEach((button) => {
    button.hidden = !canGoBack;
    button.textContent = ["history", "note"].includes(currentScreen) ? "返回" : "返回上一步";
  });
}

function navigate(screen, options = {}) {
  if (!options.skipHistory && currentScreen && currentScreen !== screen) {
    navigationStack.push(currentScreen);
  }

  if (currentScreen === "note" && screen !== "note") {
    resetDetailImageGeneration(document.querySelector("[data-history-note-detail]"));
  }

  currentScreen = screen;
  document.body.dataset.currentScreen = screen;
  renderState();
  document.querySelectorAll(".screen").forEach((el) => {
    el.hidden = el.dataset.view !== screen;
  });
  document.querySelector(`.screen[data-view="${screen}"]`)?.scrollTo({ left: 0, top: 0, behavior: "auto" });

  const activeMainMenu = mainMenuByScreen[screen];
  document.querySelectorAll(".nav-item, .workspace-nav-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.screen === activeMainMenu);
  });

  titleEl.textContent = screenTitles[screen] || "巴布";
  document.querySelectorAll("[data-action='cancel-create']").forEach((button) => {
    button.hidden = screen !== "create";
  });
  document.body.classList.toggle("home-mode", screen === "login");
  document.body.classList.toggle("workspace-mode", isLoggedIn && screen !== "login");
  document.body.classList.toggle("create-mode", isLoggedIn && screen === "create");
  if (screen === "login") startHomeStudioAnimation();
  else stopHomeStudioAnimation();
  if (screen === "create") {
    currentCreateStep = "account";
    currentAccountType = "brand";
    const parser = document.querySelector("[data-view='create'] [data-account-parser]");
    if (parser) {
      if (!editingAccountId) {
        const linkInput = parser.querySelector("[data-account-link]");
        const nameInput = parser.querySelector("[data-manual-name]");
        const xhsIdInput = parser.querySelector("[data-manual-xhs-id]");
        const bioInput = parser.querySelector("[data-manual-bio]");
        if (linkInput) linkInput.value = "";
        if (nameInput) nameInput.value = "";
        if (xhsIdInput) xhsIdInput.value = "";
        if (bioInput) bioInput.value = "";
        parser.dataset.manualSaved = "false";
      }
      setAccountParseState(parser, parser.classList.contains("direct-account-entry") ? "manual" : "idle");
    }
    renderAccountType();
    renderCreateStep();
  }
  if (screen === "knowledge") {
    renderAccountType();
  }
  updateBackButton();
  window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
}

function goBack() {
  if (hasInlineNoteDetailOpen()) {
    closeInlineNoteDetail();
    return;
  }

  const previousScreen = navigationStack.pop();
  if (!previousScreen) return;
  navigate(previousScreen, { skipHistory: true });
}

function setScenario(scenario) {
  savedAccounts = [];
  if (scenario === "first") {
    prototypeState = { scenario, project: false, knowledge: false, records: false };
  } else if (scenario === "noKnowledge") {
    prototypeState = { scenario, project: true, knowledge: false, records: false };
    ensureDemoAccount(false);
  } else {
    prototypeState = { scenario, project: true, knowledge: true, records: true };
    savedAccounts = [
      copyAccount(demoAccounts.brand),
      copyAccount(demoAccounts.ip),
      copyAccount(demoAccounts.brand, {
        avatar: "番",
        avatarSrc: "./assets/home/cat-litter-box.webp",
        name: "超级番茄",
        xhsId: "superfanqie",
        tags: ["生活方式", "个人品牌"],
        positioning: "面向希望提升生活效率的年轻用户，分享真实体验、实用方法和日常选择。",
        contentCount: 2,
        recentNotes: ["我的低成本效率清单", "真正省时间的三个习惯"],
      }),
    ];
  }
  syncProjectState();
}

function getStateFlags() {
  return {
    noProject: !prototypeState.project,
    hasProject: prototypeState.project,
    knowledgeEmpty: prototypeState.project && !prototypeState.knowledge,
    knowledgeSaved: prototypeState.project && prototypeState.knowledge,
    projectNoKnowledge: prototypeState.project && !prototypeState.knowledge,
    projectReady: prototypeState.project && prototypeState.knowledge,
    completeOnly: prototypeState.scenario === "complete",
    productionLocked: !prototypeState.knowledge,
    productionReady: prototypeState.knowledge,
    noRecords: !prototypeState.records,
    hasRecords: prototypeState.records,
  };
}

function renderState() {
  syncProjectState();
  renderProjectCards();
  renderCreationAccountSelector();
  renderContextSidebar();
  renderHistoryNotes();
  if (currentScreen === "chat") renderChatScreen({ scrollToEnd: true });
  if (currentScreen === "note") renderHistoryNoteDetail();
  renderAuthState();
  renderWorkbenchGuide();
  const flags = getStateFlags();
  document.body.dataset.projectState = flags.noProject ? "empty" : "ready";
  document.querySelectorAll("[data-state-show]").forEach((el) => {
    const key = el.dataset.stateShow;
    el.hidden = !flags[key];
  });

  const creationNav = document.querySelector(".workspace-nav-item[data-screen='production']");
  if (creationNav) creationNav.disabled = false;

  document.querySelectorAll("[data-progress='knowledge']").forEach((el) => {
    el.style.width = prototypeState.knowledge ? "82%" : "18%";
  });
}

function switchKnowledgeTab(tab) {
  document.querySelectorAll("[data-knowledge-tab]").forEach((el) => {
    el.classList.toggle("active", el.dataset.knowledgeTab === tab);
  });

  document.querySelectorAll("[data-knowledge-panel]").forEach((el) => {
    el.hidden = el.dataset.knowledgePanel !== tab;
  });
}

function switchGenerationMode(mode) {
  document.querySelectorAll("[data-generation-mode]").forEach((el) => {
    el.classList.toggle("active", el.dataset.generationMode === mode);
  });

  document.querySelectorAll("[data-generation-panel]").forEach((el) => {
    el.hidden = el.dataset.generationPanel !== mode;
  });

  closeInlineNoteDetail();
}

function getCreateSteps() {
  return createStepsByType[currentAccountType] || createStepsByType.brand;
}

function renderCreateProgress(steps, currentIndex) {
  const progress = document.querySelector("[data-create-progress]");
  if (!progress) return;

  progress.style.setProperty("--create-step-count", steps.length);
  progress.replaceChildren();

  steps.forEach((step, index) => {
    const item = document.createElement("div");
    const state = index < currentIndex ? "done" : index === currentIndex ? "active" : "pending";
    item.className = "create-progress-item";
    item.dataset.state = state;

    const marker = document.createElement("span");
    marker.className = "create-progress-marker";
    marker.setAttribute("aria-hidden", "true");

    const label = document.createElement("strong");
    label.textContent = createStepLabels[step] || step;

    item.append(marker, label);
    progress.append(item);
  });
}

function renderCreateStep() {
  const createSteps = getCreateSteps();
  if (!createSteps.includes(currentCreateStep)) currentCreateStep = createSteps[0];
  const currentIndex = createSteps.indexOf(currentCreateStep);

  renderCreateProgress(createSteps, currentIndex);

  document.querySelectorAll("[data-create-step]").forEach((el) => {
    const stepIndex = createSteps.indexOf(el.dataset.createStep);
    el.classList.toggle("active", el.dataset.createStep === currentCreateStep);
    el.classList.toggle("done", stepIndex >= 0 && stepIndex < currentIndex);
  });

  document.querySelectorAll("[data-create-panel]").forEach((el) => {
    el.hidden = el.dataset.createPanel !== currentCreateStep;
  });

  document.querySelectorAll("[data-create-prev]").forEach((el) => {
    el.hidden = currentIndex <= 0;
  });

  document.querySelectorAll("[data-create-next]").forEach((el) => {
    el.hidden = currentIndex >= createSteps.length - 1;
    if (!el.hidden) {
      const parser = document.querySelector("[data-view='create'] [data-create-parser]");
      el.disabled = currentCreateStep === "account" && parser?.dataset.parseState !== "success";
    }
  });

  document.querySelectorAll("[data-view='create'] [data-action='create-project']").forEach((el) => {
    el.hidden = currentIndex < createSteps.length - 1;
  });
}

function renderAccountType() {
  document.querySelectorAll("[data-account-type]").forEach((el) => {
    el.classList.toggle("active", el.dataset.accountType === currentAccountType);
  });

  document.querySelectorAll("[data-account-section]").forEach((el) => {
    el.hidden = el.dataset.accountSection !== currentAccountType;
  });

}

function setCreateStep(step) {
  const createSteps = getCreateSteps();
  if (!createSteps.includes(step)) return;
  currentCreateStep = step;
  renderCreateStep();
  document.querySelector(".screen[data-view='create']")?.scrollTo({ left: 0, top: 0, behavior: "auto" });
}

function moveCreateStep(direction) {
  const createSteps = getCreateSteps();
  const currentIndex = createSteps.indexOf(currentCreateStep);
  const nextIndex = Math.max(0, Math.min(createSteps.length - 1, currentIndex + direction));
  setCreateStep(createSteps[nextIndex]);
}

function setAccountParseState(parser, state, message = "") {
  const status = parser.querySelector("[data-parse-status]");
  const loading = parser.querySelector("[data-parse-loading]");
  const success = parser.querySelector("[data-parse-success]");
  const manual = parser.querySelector("[data-parse-manual]");
  const messageEl = parser.querySelector("[data-parse-message]");
  const isCreateParser = parser.matches("[data-create-parser]");

  if (isCreateParser) {
    const linkInput = parser.querySelector("[data-account-link]");
    const parseButton = parser.querySelector("[data-action='parse-account']");
    const typePanel = parser.closest("[data-view='create']")?.querySelector("[data-account-type-panel]");
    const hasLink = Boolean(linkInput?.value.trim());

    if (parser.classList.contains("direct-account-entry")) {
      const name = parser.querySelector("[data-manual-name]")?.value.trim();
      const bio = parser.querySelector("[data-manual-bio]")?.value.trim();
      const isReady = state === "success" || Boolean(name && bio);
      parser.dataset.parseState = isReady ? "success" : "manual";
      parser.dataset.manualSaved = isReady ? "true" : "false";
      if (loading) loading.hidden = true;
      if (success) success.hidden = true;
      if (manual) manual.hidden = false;
      if (typePanel) typePanel.hidden = false;
      renderCreateStep();
      return;
    }

    parser.dataset.parseState = state;
    if (state !== "success") parser.dataset.manualSaved = "false";
    if (loading) loading.hidden = state !== "loading";
    if (success) success.hidden = state !== "success";
    if (manual) manual.hidden = state !== "manual";
    if (typePanel) typePanel.hidden = state !== "success";

    if (parseButton) {
      parseButton.classList.toggle("is-complete", state === "success");
      parseButton.classList.toggle("is-failed", state === "manual");
      if (state === "loading") parseButton.textContent = "解析中";
      else if (state === "success") parseButton.textContent = "解析完成";
      else if (state === "manual") parseButton.textContent = "解析失败";
      else parseButton.textContent = "解析";
      parseButton.disabled = state === "loading" || state === "success" || (!hasLink && state !== "manual");
    }

    if (messageEl && message) messageEl.textContent = message;
    renderCreateStep();
    return;
  }

  if (status) {
    status.className = "status-pill";
    if (state === "idle") {
      status.classList.add("muted");
      status.textContent = "待解析";
    }
    if (state === "loading") {
      status.classList.add("loading");
      status.textContent = "解析中";
    }
    if (state === "success") {
      status.textContent = "已解析成功";
    }
    if (state === "manual") {
      status.classList.add("error");
      status.textContent = "需手动填写";
    }
  }

  if (loading) loading.hidden = state !== "loading";
  if (success) success.hidden = state !== "success";
  if (manual) manual.hidden = state !== "manual";
  if (messageEl && message) messageEl.textContent = message;
}

function parseAccount(actionBtn, shouldFail = false) {
  const parser = actionBtn.closest("[data-account-parser]");
  if (!parser) return;

  const linkInput = parser.querySelector("[data-account-link]");
  const link = linkInput?.value.trim();
  if (!link) {
    setAccountParseState(parser, "idle");
    return;
  }

  window.clearTimeout(accountParseTimers.get(parser));
  setAccountParseState(parser, "loading");

  const timer = window.setTimeout(() => {
    const validProfileLink = /xiaohongshu\.com\/user\/profile\//i.test(link);
    if (shouldFail || !validProfileLink || /fail/i.test(link)) {
      setAccountParseState(parser, "manual", "没有解析到账号公开信息，请手动填写后继续。");
    } else {
      setAccountParseState(parser, "success");
    }
  }, 900);

  accountParseTimers.set(parser, timer);
}

function saveManualAccount(actionBtn) {
  const parser = actionBtn.closest("[data-create-parser]");
  if (!parser) return;

  const nameInput = parser.querySelector("[data-manual-name]");
  const bioInput = parser.querySelector("[data-manual-bio]");
  const name = nameInput?.value.trim() || "";
  const bio = bioInput?.value.trim() || "";
  if (!name || !bio) return;

  const preview = parser.querySelector("[data-parse-success]");
  const manualAvatar = parser.querySelector("[data-manual-avatar-preview]");
  const publicAvatar = preview?.querySelector("[data-public-avatar]");
  const xhsId = getXhsIdFromLink(parser.querySelector("[data-account-link]")?.value) || "未填写";
  if (preview) {
    const publicName = preview.querySelector("[data-public-name]");
    const publicId = preview.querySelector("[data-public-id]");
    const publicBio = preview.querySelector("[data-public-bio]");
    const publicFollowers = preview.querySelector("[data-public-followers]");
    const publicFollowing = preview.querySelector("[data-public-following]");
    const publicLikes = preview.querySelector("[data-public-likes]");
    if (publicName) publicName.textContent = name;
    if (publicId) publicId.textContent = `小红书号：${xhsId}`;
    if (publicBio) publicBio.textContent = bio;
    if (publicFollowers) publicFollowers.textContent = "0";
    if (publicFollowing) publicFollowing.textContent = "0";
    if (publicLikes) publicLikes.textContent = "0";
  }
  if (manualAvatar?.dataset.uploadedSrc && publicAvatar) {
    publicAvatar.src = manualAvatar.dataset.uploadedSrc;
  }
  parser.dataset.manualSaved = "true";
  setAccountParseState(parser, "success");
  parser.dataset.manualSaved = "true";
}

function createProject() {
  let account = buildAccountFromCreateForm();
  if (editingAccountId) {
    savedAccounts = savedAccounts.map((item) => item.id === editingAccountId
      ? {
          ...account,
          id: item.id,
          contentCount: item.contentCount,
          recentNotes: item.recentNotes,
        }
      : item);
    selectedAccountId = editingAccountId;
  } else {
    const duplicateCount = savedAccounts.filter((item) => item.xhsId === account.xhsId).length;
    if (duplicateCount > 0) {
      account = account.type === "ip"
        ? {
            ...account,
            name: demoAccounts.ip.name,
            xhsId: demoAccounts.ip.xhsId,
            bio: demoAccounts.ip.bio,
            avatar: demoAccounts.ip.avatar,
          }
        : {
            ...account,
            name: `${account.name} ${duplicateCount + 1}`,
            xhsId: `${account.xhsId}-${duplicateCount + 1}`,
          };
    }
    savedAccounts.push(account);
    selectedAccountId = account.id;
  }
  editingAccountId = null;
  prototypeState.scenario = "first-created";
  syncProjectState();
  navigate("projects");
}

function saveKnowledge() {
  ensureDemoAccount(true);
  savedAccounts = savedAccounts.map((account, index) => {
    const shouldUpdate = selectedAccountId ? account.id === selectedAccountId : index === 0;
    return shouldUpdate ? { ...account, knowledge: true } : account;
  });
  syncProjectState();
  navigate("projects");
}

function generateNotes() {
  if (!prototypeState.knowledge) {
    navigate("production");
    return;
  }
  prototypeState.records = true;
  const activeMode = document.querySelector("[data-generation-mode].active")?.dataset.generationMode || "pillar";
  const preview = document.querySelector(`[data-generated-preview="${activeMode}"]`);
  const count = activeMode === "pillar" ? getSelectedNoteCount() : 1;
  if (selectedAccountId) {
    const generatedTitles = [...(preview?.querySelectorAll("[data-note-preview] h4") || [])]
      .slice(0, count)
      .map((item) => item.textContent.trim());
    savedAccounts = savedAccounts.map((account) => account.id === selectedAccountId
      ? {
          ...account,
          contentCount: account.contentCount + count,
          recentNotes: [...generatedTitles, ...account.recentNotes].slice(0, 5),
        }
      : account);
    renderContextSidebar();
  }
  if (preview) {
    renderNotePreviewCount(preview, count);
    preview.hidden = false;
  }
  const empty = document.querySelector("[data-production-preview-empty]");
  if (empty) empty.hidden = true;
  closeInlineNoteDetail();
  document.querySelector(".screen[data-view='production']")?.scrollTo({ left: 0, top: 0, behavior: "smooth" });
}

function getSelectedNoteCount() {
  const selected = document.querySelector(".note-count-group .option-chip.selected");
  const count = Number.parseInt(selected?.textContent || "3", 10);
  return Number.isFinite(count) ? Math.max(1, Math.min(5, count)) : 3;
}

function renderNotePreviewCount(preview, count) {
  const label = preview.querySelector("[data-generated-count-label]");
  if (label) label.textContent = `已生成 ${count} 篇`;

  preview.querySelectorAll("[data-note-preview]").forEach((card) => {
    const index = Number.parseInt(card.dataset.notePreview || "1", 10);
    card.hidden = Number.isFinite(index) && index > count;
    card.classList.remove("active");
  });
}

function getTopicsFromCard(card) {
  return [...card.querySelectorAll(".topic-list em")].map((el) => el.textContent.trim()).join(" ");
}

function getSelectedGenerationSummary() {
  const activeMode = document.querySelector("[data-generation-mode].active")?.dataset.generationMode || "pillar";
  if (activeMode === "chat") {
    return {
      pillar: "对话生成",
      sourceLabel: "生成方式",
      params: "标准正文 500-700 字 · 1 篇",
    };
  }

  const account = savedAccounts.find((item) => item.id === selectedAccountId);
  const isProductSource = account?.type === "brand" && currentCreationSource === "product";
  const pillar = isProductSource
    ? getCreationProducts(account)[selectedProductMainlineIndex]?.name || "未选择商品"
    : document.querySelector(".pillar-option.selected strong")?.textContent.trim() || "宠物进食区清洁";
  const wordCount = document.querySelector(".generation-grid .control-block .option-chip.selected")?.textContent.trim() || "标准正文 500-700 字";
  const noteCount = document.querySelector(".note-count-group .option-chip.selected")?.textContent.trim() || "3 篇";
  return {
    pillar,
    sourceLabel: isProductSource ? "商品主线" : "内容主线",
    params: `${wordCount} · ${noteCount}`,
  };
}

function renderCollapsedSummary() {
  const summary = getSelectedGenerationSummary();
  const collapsed = document.querySelector("[data-collapsed-content]");
  if (!collapsed) return;

  const sourceLabelEl = collapsed.querySelector("[data-summary-source-label]");
  const pillarEl = collapsed.querySelector("[data-summary-pillar]");
  const paramsEl = collapsed.querySelector("[data-summary-params]");
  if (sourceLabelEl) sourceLabelEl.textContent = summary.sourceLabel || "内容主线";
  if (pillarEl) pillarEl.textContent = summary.pillar;
  if (paramsEl) paramsEl.textContent = summary.params;
  collapsed.hidden = false;
}

function renderDetailTopics(container, topics) {
  if (!container) return;
  const values = topics.split(/\s+/).filter(Boolean);
  container.replaceChildren(...values.map((topic) => {
    const tag = document.createElement("span");
    tag.textContent = topic;
    return tag;
  }));
}

function resetDetailImageGeneration(detail) {
  if (!detail) return;
  window.clearTimeout(detailImageGenerationTimer);
  detailImageGenerationTimer = null;

  const button = detail.querySelector("[data-action='generate-detail-images']");
  const count = detail.querySelector("[data-detail-image-count]");
  const empty = detail.querySelector("[data-detail-image-empty]");
  const loading = detail.querySelector("[data-detail-image-loading]");
  const grid = detail.querySelector("[data-detail-image-grid]");

  if (button) {
    button.disabled = false;
    button.textContent = "生成配图";
  }
  if (count) count.value = "3";
  if (empty) empty.hidden = false;
  if (loading) loading.hidden = true;
  if (grid) {
    grid.hidden = true;
    grid.replaceChildren();
  }
}

function generateDetailImages(button) {
  const detail = button.closest("[data-note-detail-shell]");
  if (!detail) return;

  const count = Math.min(6, Math.max(1, Number(detail.querySelector("[data-detail-image-count]")?.value) || 3));
  const empty = detail.querySelector("[data-detail-image-empty]");
  const loading = detail.querySelector("[data-detail-image-loading]");
  const grid = detail.querySelector("[data-detail-image-grid]");
  if (!loading || !grid) return;

  window.clearTimeout(detailImageGenerationTimer);
  button.disabled = true;
  button.textContent = "生成中...";
  if (empty) empty.hidden = true;
  grid.hidden = true;
  grid.replaceChildren();
  loading.hidden = false;

  detailImageGenerationTimer = window.setTimeout(() => {
    const items = detailGeneratedImages.slice(0, count).map((item, index) => {
      const figure = document.createElement("figure");
      figure.className = "generated-image-item";

      const image = document.createElement("img");
      image.src = item.src;
      image.alt = `${item.label}，配图 ${index + 1}`;

      const caption = document.createElement("figcaption");
      caption.textContent = `配图 ${index + 1} · ${item.label}`;

      figure.append(image, caption);
      return figure;
    });

    grid.replaceChildren(...items);
    loading.hidden = true;
    grid.hidden = false;
    button.disabled = false;
    button.textContent = "重新生成";
    detailImageGenerationTimer = null;
  }, 2200);
}

function openInlineNoteDetail(card) {
  const detail = document.querySelector("[data-inline-note-detail]");
  if (!detail) return;

  const title = card.querySelector("h4")?.textContent.trim() || "猫碗旁边总是脏";
  const body = generatedNoteBodies[title] || card.querySelector("p")?.textContent.trim().replace(/\.\.\.$/, "。") || "";
  const topics = getTopicsFromCard(card);

  detail.querySelector("[data-detail-heading]").textContent = title;
  detail.querySelector("[data-detail-title]").textContent = title;
  detail.querySelector("[data-detail-body]").textContent = body;
  renderDetailTopics(detail.querySelector("[data-detail-topics]"), topics);
  resetDetailImageGeneration(detail);

  document.querySelectorAll("[data-note-preview]").forEach((el) => el.classList.remove("active"));
  card.classList.add("active");
  document.querySelectorAll("[data-content-collapsible]").forEach((el) => {
    el.hidden = true;
  });
  document.body.classList.add("note-detail-open");
  renderContextSidebar();
  renderCollapsedSummary();
  detail.hidden = false;
  updateBackButton();
  detail.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeInlineNoteDetail() {
  const detail = document.querySelector("[data-inline-note-detail]");
  const collapsed = document.querySelector("[data-collapsed-content]");
  resetDetailImageGeneration(detail);
  if (detail) detail.hidden = true;
  if (collapsed) collapsed.hidden = true;
  document.querySelectorAll("[data-content-collapsible]").forEach((el) => {
    el.hidden = false;
  });
  document.body.classList.remove("note-detail-open");
  renderContextSidebar();
  document.querySelectorAll("[data-note-preview]").forEach((el) => el.classList.remove("active"));
  updateBackButton();
}

document.addEventListener("click", (event) => {
  if (loginModal && event.target === loginModal) {
    closeLoginModal();
    return;
  }

  if (event.target.closest("[data-home-preview]")) return;

  if (!event.target.closest(".production-account-switcher")) {
    setAccountSwitcherOpen(false);
  }

  const goBtn = event.target.closest("[data-go]");
  if (goBtn) {
    if (goBtn.disabled || goBtn.getAttribute("aria-disabled") === "true") return;
    if (goBtn.dataset.go === "create") editingAccountId = null;
    if (goBtn.dataset.selectAccount) selectedAccountId = goBtn.dataset.selectAccount;
    navigate(goBtn.dataset.go);
    return;
  }

  const historyNoteBtn = event.target.closest("[data-history-note-index]");
  if (historyNoteBtn) {
    const account = savedAccounts.find((item) => item.id === selectedAccountId);
    selectedHistoryNote = getHistoryNotes(account)[Number(historyNoteBtn.dataset.historyNoteIndex)] || null;
    if (selectedHistoryNote) navigate("note");
    return;
  }

  const chatHistoryBtn = event.target.closest("[data-chat-id]");
  if (chatHistoryBtn) {
    selectedConversationId = chatHistoryBtn.dataset.chatId;
    renderContextSidebar();
    renderChatScreen({ scrollToEnd: true });
    return;
  }

  const chatSuggestionBtn = event.target.closest("[data-chat-suggestion]");
  if (chatSuggestionBtn) {
    const input = document.querySelector("[data-chat-input]");
    if (!input) return;
    input.value = chatSuggestionBtn.dataset.chatSuggestion;
    resizeChatInput();
    updateChatComposerState();
    input.focus();
    return;
  }

  const navBtn = event.target.closest("[data-screen]");
  if (navBtn) {
    if (navBtn.dataset.screen === "production" && savedAccounts.length === 0) {
      showToast("当前暂无账号");
      return;
    }
    navigate(navBtn.dataset.screen);
    return;
  }

  const creationAccountBtn = event.target.closest("[data-select-creation-account]");
  if (creationAccountBtn) {
    selectedAccountId = creationAccountBtn.dataset.selectCreationAccount;
    selectedHistoryNote = null;
    renderCreationAccountSelector();
    renderContextSidebar();
    if (currentScreen === "history") renderHistoryNotes();
    if (currentScreen === "note") navigate("history");
    setAccountSwitcherOpen(false);
    if (currentScreen === "production") resetProductionPreview();
    return;
  }

  const projectAccountBtn = event.target.closest("[data-select-project-account]");
  if (projectAccountBtn) {
    selectedAccountId = projectAccountBtn.dataset.selectProjectAccount;
    currentAccountDetailTab = "overview";
    selectedAccountProductIndex = 0;
    if (currentScreen !== "projects") {
      navigate("projects");
    } else {
      renderProjectCards();
      renderContextSidebar();
    }
    return;
  }

  const accountDetailTabBtn = event.target.closest("[data-account-detail-tab]");
  if (accountDetailTabBtn) {
    currentAccountDetailTab = accountDetailTabBtn.dataset.accountDetailTab;
    renderProjectCards();
    return;
  }

  const accountProductBtn = event.target.closest("[data-account-product-index]");
  if (accountProductBtn) {
    selectedAccountProductIndex = Number(accountProductBtn.dataset.accountProductIndex) || 0;
    renderProjectCards();
    return;
  }

  const loginBtn = event.target.closest("[data-login-scenario]");
  if (loginBtn) {
    setLoggedIn(true);
    closeLoginModal();
    routeAfterLogin();
    return;
  }

  const createStepBtn = event.target.closest("[data-create-step]");
  if (createStepBtn) {
    setCreateStep(createStepBtn.dataset.createStep);
    return;
  }

  const createPrevBtn = event.target.closest("[data-create-prev]");
  if (createPrevBtn) {
    moveCreateStep(-1);
    return;
  }

  const createNextBtn = event.target.closest("[data-create-next]");
  if (createNextBtn) {
    moveCreateStep(1);
    return;
  }

  const generationModeBtn = event.target.closest("[data-generation-mode]");
  if (generationModeBtn) {
    switchGenerationMode(generationModeBtn.dataset.generationMode);
    return;
  }

  const accountTypeBtn = event.target.closest("[data-account-type]");
  if (accountTypeBtn) {
    currentAccountType = accountTypeBtn.dataset.accountType;
    currentCreateStep = "account";
    renderAccountType();
    renderCreateStep();
    return;
  }

  const creationSourceBtn = event.target.closest("[data-creation-source]");
  if (creationSourceBtn) {
    setCreationSource(creationSourceBtn.dataset.creationSource, undefined, true);
    return;
  }

  const productMainlineBtn = event.target.closest("[data-product-mainline-index]");
  if (productMainlineBtn) {
    selectedProductMainlineIndex = Number(productMainlineBtn.dataset.productMainlineIndex);
    renderProductMainlines(savedAccounts.find((item) => item.id === selectedAccountId));
    resetProductionPreview();
    return;
  }

  const choiceBtn = event.target.closest("[data-choice]");
  if (choiceBtn) {
    const group = choiceBtn.closest(".option-group");
    if (choiceBtn.dataset.choice === "single" && group) {
      group.querySelectorAll("[data-choice]").forEach((el) => el.classList.remove("selected"));
      choiceBtn.classList.add("selected");
      const otherField = group.parentElement?.querySelector("[data-other-direction]");
      if (otherField) {
        const showOtherField = choiceBtn.hasAttribute("data-other-choice");
        otherField.hidden = !showOtherField;
        if (!showOtherField) {
          const otherInput = otherField.querySelector("[data-other-direction-input]");
          if (otherInput) otherInput.value = "";
        }
      }
      if (group.classList.contains("pillar-option-group")) resetProductionPreview();
    } else {
      choiceBtn.classList.toggle("selected");
    }
    return;
  }

  const actionBtn = event.target.closest("[data-action]");
  if (actionBtn) {
    const action = actionBtn.dataset.action;
    if (action === "open-login-modal") {
      openLoginModal();
      return;
    }
    if (action === "toggle-account-switcher") {
      toggleAccountSwitcher();
      return;
    }
    if (action === "home-primary") {
      if (isLoggedIn) {
        routeAfterLogin();
      } else {
        openLoginModal();
      }
      return;
    }
    if (action === "go-home") {
      goHome();
      return;
    }
    if (action === "logout") {
      logout();
      return;
    }
    if (action === "close-login-modal") {
      closeLoginModal();
      return;
    }
    if (action === "go-back") {
      goBack();
      return;
    }
    if (action === "new-chat") {
      createNewConversation();
      return;
    }
    if (action === "send-chat") {
      sendChatMessage();
      return;
    }
    if (action === "cancel-create") {
      editingAccountId = null;
      navigationStack.length = 0;
      navigate("projects", { skipHistory: true });
      return;
    }
    if (action === "edit-account") {
      const account = savedAccounts.find((item) => item.id === selectedAccountId);
      if (!account) return;
      editingAccountId = account.id;
      navigate("create");
      currentAccountType = account.type;
      currentCreateStep = account.type === "ip" ? "ip" : "brand";
      renderAccountType();
      renderCreateStep();
      titleEl.textContent = "编辑账号";
      return;
    }
    if (action === "clear-creation-account") {
      selectedAccountId = null;
      renderCreationAccountSelector();
      return;
    }
    if (action === "decrease-note-count") {
      adjustNoteCount(-1);
      return;
    }
    if (action === "increase-note-count") {
      adjustNoteCount(1);
      return;
    }
    if (action === "parse-account" || action === "parse-account-fail") {
      parseAccount(actionBtn, action === "parse-account-fail");
      return;
    }
    if (action === "save-manual-account") {
      saveManualAccount(actionBtn);
      return;
    }
    if (action === "add-product") {
      const productList = actionBtn.closest(".product-list");
      const hiddenGroup = productList?.querySelector("[data-product-extra][hidden]");
      if (!productList) return;

      if (hiddenGroup) {
        hiddenGroup.hidden = false;
      } else {
        const groups = [...productList.querySelectorAll(".product-group")];
        const template = groups[groups.length - 1];
        if (!template) return;

        const nextIndex = groups.length + 1;
        const clone = template.cloneNode(true);
        clone.hidden = false;
        clone.removeAttribute("data-product-extra");

        const title = clone.querySelector(".product-group-head strong");
        if (title) title.textContent = `商品 ${nextIndex}`;

        clone.querySelectorAll("input").forEach((input) => {
          if (input.type !== "file") input.value = "";
        });
        clone.querySelectorAll("textarea").forEach((textarea) => {
          textarea.value = "";
        });
        clone.querySelectorAll(".upload-tile").forEach((tile, index) => {
          tile.classList.remove("filled");
          if (tile.firstChild) tile.firstChild.textContent = `添加图 ${index + 1}`;
        });

        template.after(clone);
      }
      actionBtn.textContent = "继续添加商品";
      return;
    }
    if (action === "create-project") createProject();
    if (action === "save-knowledge") saveKnowledge();
    if (action === "generate-notes") generateNotes();
    if (action === "generate-detail-images") generateDetailImages(actionBtn);
    if (action === "return-content-form") closeInlineNoteDetail();
    return;
  }

  const notePreview = event.target.closest("[data-note-preview]");
  if (notePreview && !notePreview.hidden) {
    openInlineNoteDetail(notePreview);
    return;
  }

  const knowledgeTabBtn = event.target.closest("[data-knowledge-tab]");
  if (knowledgeTabBtn) {
    switchKnowledgeTab(knowledgeTabBtn.dataset.knowledgeTab);
    return;
  }

});

document.querySelector("[data-account-search]")?.addEventListener("input", renderContextSidebar);

document.querySelector("[data-chat-input]")?.addEventListener("input", () => {
  resizeChatInput();
  updateChatComposerState();
});

document.querySelector("[data-chat-input]")?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
  event.preventDefault();
  sendChatMessage();
});

document.querySelector("[data-view='create'] [data-account-link]")?.addEventListener("input", (event) => {
  const parser = event.target.closest("[data-create-parser]");
  if (!parser || parser.dataset.parseState === "loading") return;
  setAccountParseState(parser, event.target.value.trim() ? "ready" : "idle");
});

document.querySelector("[data-view='create'] [data-parse-manual]")?.addEventListener("input", (event) => {
  const manual = event.currentTarget;
  const saveButton = manual.querySelector("[data-action='save-manual-account']");
  const name = manual.querySelector("[data-manual-name]")?.value.trim();
  const bio = manual.querySelector("[data-manual-bio]")?.value.trim();
  const parser = manual.closest("[data-create-parser]");
  if (parser?.classList.contains("direct-account-entry")) {
    setAccountParseState(parser, name && bio ? "success" : "manual");
    return;
  }
  if (saveButton) saveButton.disabled = !name || !bio;
});

document.querySelector("[data-manual-avatar-upload]")?.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  const preview = event.target.closest(".manual-avatar-upload")?.querySelector("[data-manual-avatar-preview]");
  if (!file || !preview || file.size > 5 * 1024 * 1024) return;
  const objectUrl = URL.createObjectURL(file);
  preview.src = objectUrl;
  preview.dataset.uploadedSrc = objectUrl;
  preview.classList.add("has-image");
});

switchKnowledgeTab("basic");
switchGenerationMode("pillar");
attachProductionSettings();

document.addEventListener("input", schedulePrototypeSessionPersist);
document.addEventListener("change", schedulePrototypeSessionPersist);
document.addEventListener("click", () => window.setTimeout(persistPrototypeSession, 0));
window.addEventListener("beforeunload", persistPrototypeSession);

const demoMode = new URLSearchParams(window.location.search).get("demo");
const restoredSession = readPrototypeSession();
if (restoredSession && applyPrototypeSession(restoredSession)) {
  const restoredScreen = currentScreen;
  currentScreen = "";
  navigate(restoredScreen, { skipHistory: true });
  window.requestAnimationFrame(() => restoreFormValues(restoredFormValues));
} else if (demoMode === "complete") {
  setScenario("complete");
  setLoggedIn(true);
  selectedAccountId = savedAccounts[0]?.id || null;
  navigate("production", { skipHistory: true });
} else if (demoMode === "account") {
  setScenario("complete");
  setLoggedIn(true);
  selectedAccountId = savedAccounts[0]?.id || null;
  currentAccountDetailTab = "overview";
  selectedAccountProductIndex = 0;
  navigate("projects", { skipHistory: true });
} else if (demoMode === "empty") {
  savedAccounts = [];
  setLoggedIn(true);
  selectedAccountId = null;
  navigate("projects", { skipHistory: true });
} else if (demoMode === "create") {
  savedAccounts = [];
  setLoggedIn(true);
  selectedAccountId = null;
  editingAccountId = null;
  navigate("create", { skipHistory: true });
} else {
  navigate(isLoggedIn ? "projects" : "login");
}
window.setTimeout(persistPrototypeSession, 0);
