/* 生活氛围人格测试
 *
 * 想换题目：改 QUESTIONS。
 * 想换结果：改 RESULTS。选项 scores 里的键要和 RESULTS 的 id 一致。
 * 想接统计：改 STATS_CONFIG.provider。失败不会影响测试。
 *
 * 计分：把每题所选选项的 scores 累加，取得分最高的结果。
 * 并列时，RESULTS 数组里更靠前的结果胜出。
 */

const SHARE_URL = "https://ftgcewfs123-pixel.github.io/personality-test/";

/**
 * provider:
 *   "none"         只使用本机 localStorage，不请求外部服务
 *   "busuanzi"     不蒜子，页面上显示本站访问次数
 *   "umami"        需要填写 src 和 websiteId
 *   "goatcounter"  需要填写 src（计数接口地址）
 *   "ga"           需要填写 measurementId，例如 G-XXXX
 */
const STATS_CONFIG = {
  provider: "none",
  storageKey: "personality-test-stats-v1",
  busuanzi: {
    script: "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js",
  },
  umami: {
    src: "",
    websiteId: "",
  },
  goatcounter: {
    src: "",
    script: "https://gc.zgo.at/count.js",
  },
  ga: {
    measurementId: "",
  },
};

const QUESTIONS = [
  {
    text: "周末早上醒来，窗外是难得的好天气。你的第一件事是？",
    options: [
      { text: "先给自己热一杯喝的，在阳台慢慢醒过来", scores: { cozy: 2 } },
      { text: "打开地图，看附近有没有没去过的地方", scores: { explore: 2 } },
      { text: "把今天想做的事，安进时间里", scores: { plan: 2 } },
      { text: "先把这束光拍下来，再决定出不出门", scores: { aesthetic: 2 } },
    ],
  },
  {
    text: "朋友发来消息：「现在有空吗？出来走走。」",
    options: [
      { text: "好呀，换双舒服的鞋就出门", scores: { social: 2 } },
      { text: "先问清去哪、待多久、怎么回来", scores: { plan: 2 } },
      { text: "今天想把自己留给自己", scores: { solo: 2 } },
      { text: "可以，但想换一条没走过的小路", scores: { explore: 2 } },
    ],
  },
  {
    text: "如果今天只能发一条动态，你更想写哪句？",
    options: [
      { text: "「光落在杯沿上的时候，世界很安静。」", scores: { aesthetic: 2 } },
      { text: "「和喜欢的人，把一个下午过没了。」", scores: { social: 2 } },
      { text: "「一个人把这条街走完，也很好。」", scores: { solo: 2 } },
      { text: "「被子晒好了，房间里有太阳的味道。」", scores: { cozy: 2 } },
    ],
  },
  {
    text: "挑一家店坐下，你最先看什么？",
    options: [
      { text: "座位舒不舒服，店里会不会太吵", scores: { cozy: 2 } },
      { text: "菜单上有没有没试过的味道", scores: { explore: 2 } },
      { text: "距离、评分，还要不要排队", scores: { plan: 2 } },
      { text: "墙的颜色，还有杯子的形状", scores: { aesthetic: 2 } },
    ],
  },
  {
    text: "出门旅行，行李箱里你一定会留下位置给？",
    options: [
      { text: "耳机。路上也想拥有自己的声音", scores: { solo: 2 } },
      { text: "一张可以涂涂画画的小地图", scores: { explore: 2 } },
      { text: "充电器和一份备用方案", scores: { plan: 2 } },
      { text: "一件只为那张照片准备的衣服", scores: { aesthetic: 2 } },
    ],
  },
  {
    text: "弹出一条 60 秒的语音，你通常会？",
    options: [
      { text: "马上听完，再回一段差不多长的", scores: { social: 2 } },
      { text: "转成文字，看完要点再回复", scores: { plan: 2 } },
      { text: "先标起来，等想说话的时候再听", scores: { solo: 2 } },
      { text: "把手机扣下，先把这杯喝完", scores: { cozy: 2 } },
    ],
  },
  {
    text: "计划好的出门，被一场雨临时取消。你更接近？",
    options: [
      { text: "觉得刚好，窝着本来就很幸福", scores: { cozy: 2 } },
      { text: "改去一家下雨也值得去的室内店", scores: { explore: 2 } },
      { text: "叫上朋友，雨天也要有人一起耗着", scores: { social: 2 } },
      { text: "站到窗边，看雨把街道洗干净", scores: { aesthetic: 2 } },
    ],
  },
  {
    text: "和刚认识的人坐在一起，你更常是？",
    options: [
      { text: "三两句就热起来，话题自己会往前长", scores: { social: 2 } },
      { text: "追问对方最近发现了什么好玩的", scores: { explore: 2 } },
      { text: "听得多，说得少，但记得很清楚", scores: { solo: 2 } },
      { text: "把气氛照顾得刚好，不冷场也不抢话", scores: { cozy: 2 } },
    ],
  },
  {
    text: "你心里那种「今天很完整」的晚上，更接近？",
    options: [
      { text: "一点香气、一条毯子，一部看过也不腻的电影", scores: { cozy: 2 } },
      { text: "把灯调暗，谁也不必马上回复", scores: { solo: 2 } },
      { text: "明天最重要的三件事写下来，心才落地", scores: { plan: 2 } },
      { text: "饭桌从日落坐到店家开始收椅子", scores: { social: 2 } },
    ],
  },
  {
    text: "如果只能留下一种收藏，你会留？",
    options: [
      { text: "一本只写给自己看的笔记本", scores: { solo: 2 } },
      { text: "票根、印章，和那些奇怪的地址", scores: { explore: 2 } },
      { text: "按年份整理好的相册", scores: { plan: 2 } },
      { text: "好看、却说不上用途的小东西", scores: { aesthetic: 2 } },
    ],
  },
  {
    text: "遇到两难的选择，你最后通常听谁的？",
    options: [
      { text: "朋友那句「你开心就好」", scores: { social: 2 } },
      { text: "脑子里已经出现的那个画面", scores: { aesthetic: 2 } },
      { text: "利弊摊开以后，更清楚的一边", scores: { plan: 2 } },
      { text: "身体先松下来的那个选项", scores: { cozy: 2 } },
    ],
  },
  {
    text: "如果用一种天气形容现在的你？",
    options: [
      { text: "清亮、不必解释的月光", scores: { solo: 2 } },
      { text: "一下子就能把人晒暖的午后", scores: { social: 2 } },
      { text: "薄雾散开后，颜色刚刚好的黄昏", scores: { aesthetic: 2 } },
      { text: "说变就变、还带着尘土味的风", scores: { explore: 2 } },
    ],
  },
];

const RESULTS = [
  {
    id: "cozy",
    short: "治愈",
    emoji: "🍵",
    label: "治愈系生活家",
    tagline: "你把日子过成了温热的。",
    description:
      "你擅长把普通的一天安顿好：一杯热的、一床晒过的被子、一段不赶时间的话。别人觉得你柔软，其实你很清楚自己需要什么。和你在一起，世界会放慢半拍。",
    shareText:
      "🍵 我是「治愈系生活家」\n把日子过成温热的那种人。\n\n你也来测测，看看自己是哪种让人想收藏的气质：\n{url}",
  },
  {
    id: "aesthetic",
    short: "氛围",
    emoji: "🌸",
    label: "氛围感收藏家",
    tagline: "你记得住光，也记得住心情。",
    description:
      "你容易被颜色、句子和刚刚好的瞬间击中。别人在赶路的时候，你在确认这一帧值不值得留下来。你不是浮在表面，你只是坚持生活要有质地。",
    shareText:
      "🌸 我是「氛围感收藏家」\n会为了一束光停下来的人。\n\n你也来测测，看看自己是哪种让人想收藏的气质：\n{url}",
  },
  {
    id: "social",
    short: "热络",
    emoji: "☀️",
    label: "人间小太阳",
    tagline: "你出现的地方，空气会热一点。",
    description:
      "你乐于把人聚到一起，也真心喜欢那种越聊越亮的感觉。你不是非要被看见，你是愿意先把温暖递出去。朋友里，你常常是那个说「来嘛」的人。",
    shareText:
      "☀️ 我是「人间小太阳」\n负责把空气捂热的那种人。\n\n你也来测测，看看自己是哪种让人想收藏的气质：\n{url}",
  },
  {
    id: "explore",
    short: "探索",
    emoji: "🧭",
    label: "城市探险家",
    tagline: "没去过的路口，对你最有吸引力。",
    description:
      "你对新鲜的味道、陌生的街角和临时起意没什么抵抗力。安稳很好，但你更想知道拐过去还有什么。你的生活不太靠清单推进，更靠好奇心。",
    shareText:
      "🧭 我是「城市探险家」\n没走过的路会先向我招手。\n\n你也来测测，看看自己是哪种让人想收藏的气质：\n{url}",
  },
  {
    id: "solo",
    short: "自洽",
    emoji: "🌙",
    label: "独自发光体",
    tagline: "你的电量，在一个人的时候最满。",
    description:
      "你不是冷淡，你只是需要一块不被打扰的地方，把想法放回原位。你可以很好地陪着别人，也懂得把自己完整地留下来。安静，是你发光的方式。",
    shareText:
      "🌙 我是「独自发光体」\n一个人的时候，电量最满。\n\n你也来测测，看看自己是哪种让人想收藏的气质：\n{url}",
  },
  {
    id: "plan",
    short: "清醒",
    emoji: "📐",
    label: "清醒规划师",
    tagline: "你让混乱的一天变得可被握住。",
    description:
      "你习惯在出发前先把路看清：时间、距离，还有一套备选。别人靠感觉往前冲，你靠结构把事情落地。这不是无趣，是你对自己和时间的尊重。",
    shareText:
      "📐 我是「清醒规划师」\n出发之前，心里已经有地图。\n\n你也来测测，看看自己是哪种让人想收藏的气质：\n{url}",
  },
];

const OPTION_KEYS = ["A", "B", "C", "D"];

const state = {
  view: "home",
  index: 0,
  answers: [],
  locked: false,
};

let toastTimer = 0;

function validateData() {
  try {
    const ids = new Set(RESULTS.map((item) => item.id));
    if (ids.size !== RESULTS.length) console.warn("RESULTS 里有重复的 id");
    QUESTIONS.forEach((question, index) => {
      if (!question.options || question.options.length !== 4) {
        console.warn("第 " + (index + 1) + " 题不是 4 个选项");
      }
      (question.options || []).forEach((option) => {
        Object.keys(option.scores || {}).forEach((key) => {
          if (!ids.has(key)) console.warn("未知的人格 id：" + key);
        });
      });
    });
  } catch (error) {
    console.warn(error);
  }
}

function blankAnswers() {
  return QUESTIONS.map(() => null);
}

function primaryKey(scores) {
  let best = "";
  let bestValue = -1;
  Object.entries(scores || {}).forEach(([key, value]) => {
    if (value > bestValue) {
      best = key;
      bestValue = value;
    }
  });
  return best;
}

function tally(answers) {
  const totals = {};
  RESULTS.forEach((item) => {
    totals[item.id] = 0;
  });
  answers.forEach((optionIndex, questionIndex) => {
    if (optionIndex == null) return;
    const option = QUESTIONS[questionIndex].options[optionIndex];
    if (!option) return;
    Object.entries(option.scores || {}).forEach(([key, value]) => {
      totals[key] = (totals[key] || 0) + value;
    });
  });
  return totals;
}

function pickResult(totals) {
  let chosen = RESULTS[0];
  let best = -1;
  RESULTS.forEach((item) => {
    const score = totals[item.id] || 0;
    if (score > best) {
      chosen = item;
      best = score;
    }
  });
  return chosen;
}

function resolveShareText(result) {
  const raw = String(result.shareText || "")
    .split("{url}")
    .join(SHARE_URL)
    .trim();
  if (raw.indexOf(SHARE_URL) !== -1) return raw;
  return raw + "\n\n你也来测测：\n" + SHARE_URL;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function showToast(message, method) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.dataset.method = method || "";
  toast.classList.add("is-on");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-on");
  }, 2600);
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard
      .writeText(text)
      .then(() => "clipboard")
      .catch(() => fallbackCopy(text));
  }
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text) {
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.left = "0";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.focus();
    area.select();
    area.setSelectionRange(0, area.value.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok ? "fallback" : "failed";
  } catch (error) {
    console.warn(error);
    return "failed";
  }
}

function render() {
  const view = document.getElementById("view");
  if (!view) return;
  try {
    view.replaceChildren();
    if (state.view === "quiz") renderQuiz(view);
    else if (state.view === "result") renderResult(view);
    else renderHome(view);
    document.title = documentTitle();
    window.scrollTo(0, 0);
  } catch (error) {
    console.error(error);
    view.textContent = "页面渲染出错了，请刷新后再试。";
  }
}

function documentTitle() {
  if (state.view === "quiz") {
    return "第 " + (state.index + 1) + " 题 · 生活氛围人格测试";
  }
  if (state.view === "result") {
    const result = pickResult(tally(state.answers));
    return "你是" + result.label + " · 生活氛围人格测试";
  }
  return "生活氛围人格测试";
}

function renderHome(view) {
  const screen = el("div", "screen stack");

  const hero = el("section", "card hero");
  hero.appendChild(el("p", "eyebrow", QUESTIONS.length + " 道轻问题 · 约 2 分钟"));
  const title = el("h1");
  title.appendChild(document.createTextNode("你的生活"));
  title.appendChild(document.createElement("br"));
  title.appendChild(el("span", "mark", "氛围人格"));
  hero.appendChild(title);
  hero.appendChild(
    el(
      "p",
      "lede",
      "没有标准答案。按第一感觉选下去，把藏在日常选择里的气质，叫出一个好听的名字。"
    )
  );
  const pills = el("ul", "pills");
  [QUESTIONS.length + " 道单选", RESULTS.length + " 种结果", "做完可分享"].forEach((item) => {
    pills.appendChild(el("li", "", item));
  });
  hero.appendChild(pills);
  const start = el("button", "btn btn-primary", "开始测试");
  start.type = "button";
  start.id = "start";
  start.addEventListener("click", startQuiz);
  hero.appendChild(start);
  screen.appendChild(hero);

  const stepsCard = el("section", "card");
  stepsCard.appendChild(el("p", "section-label", "怎么测"));
  const steps = el("ol", "steps");
  ["按第一感觉选，不必想太久", "一次只看一题，想改可以返回", "结束复制一段文案，发给朋友"].forEach(
    (item, index) => {
      const li = el("li");
      li.appendChild(el("span", "", String(index + 1)));
      li.appendChild(document.createTextNode(item));
      steps.appendChild(li);
    }
  );
  stepsCard.appendChild(steps);
  screen.appendChild(stepsCard);

  const preview = el("section", "card");
  preview.appendChild(el("p", "section-label", "测完会遇到其中一种"));
  const grid = el("div", "emoji-grid");
  RESULTS.forEach((item) => grid.appendChild(el("span", "", item.emoji)));
  preview.appendChild(grid);
  preview.appendChild(el("p", "hint", "名字先保密，答完再揭晓。"));
  screen.appendChild(preview);

  view.appendChild(screen);
}

function startQuiz() {
  state.answers = blankAnswers();
  state.index = 0;
  state.view = "quiz";
  state.locked = false;
  render();
}

function renderQuiz(view) {
  const question = QUESTIONS[state.index];
  const screen = el("div", "screen");
  const card = el("section", "card quiz-card");
  card.dataset.questionIndex = String(state.index);

  const meta = el("div", "progress-meta");
  meta.appendChild(el("strong", "", "第 " + (state.index + 1) + " 题"));
  meta.appendChild(el("span", "", state.index + 1 + " / " + QUESTIONS.length));
  card.appendChild(meta);

  const bar = el("div", "bar");
  const fill = el("span", "bar-fill");
  fill.style.width = ((state.index + 1) / QUESTIONS.length) * 100 + "%";
  bar.appendChild(fill);
  card.appendChild(bar);

  const heading = el("h2", "question", question.text);
  heading.id = "question-text";
  card.appendChild(heading);

  const group = el("div", "options");
  group.setAttribute("role", "radiogroup");
  group.setAttribute("aria-label", "请选择一个答案");

  question.options.forEach((option, optionIndex) => {
    const button = el("button", "option");
    button.type = "button";
    button.setAttribute("role", "radio");
    const selected = state.answers[state.index] === optionIndex;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-checked", selected ? "true" : "false");
    button.dataset.primary = primaryKey(option.scores);
    button.appendChild(el("span", "opt-key", OPTION_KEYS[optionIndex] || String(optionIndex + 1)));
    button.appendChild(el("span", "opt-text", option.text));
    button.addEventListener("click", () => choose(optionIndex));
    group.appendChild(button);
  });
  card.appendChild(group);

  const nav = el("div", "quiz-nav");
  const prev = el("button", "btn-text", "上一题");
  prev.type = "button";
  prev.id = "prev";
  prev.disabled = state.index === 0;
  prev.addEventListener("click", goBack);
  nav.appendChild(prev);
  nav.appendChild(el("span", "quiz-note", "点选后进入下一题"));
  card.appendChild(nav);

  screen.appendChild(card);
  view.appendChild(screen);
}

function choose(optionIndex) {
  if (state.locked || state.view !== "quiz") return;
  state.locked = true;
  state.answers[state.index] = optionIndex;
  document.querySelectorAll(".option").forEach((button, index) => {
    const selected = index === optionIndex;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-checked", selected ? "true" : "false");
    button.disabled = true;
  });
  const prev = document.getElementById("prev");
  if (prev) prev.disabled = true;

  window.setTimeout(() => {
    if (state.index >= QUESTIONS.length - 1) {
      state.view = "result";
      try {
        recordComplete();
      } catch (error) {
        console.warn(error);
      }
    } else {
      state.index += 1;
    }
    state.locked = false;
    render();
  }, 260);
}

function goBack() {
  if (state.locked || state.index === 0) return;
  state.index -= 1;
  render();
}

function renderResult(view) {
  const totals = tally(state.answers);
  const result = pickResult(totals);
  const shareText = resolveShareText(result);
  const screen = el("div", "screen stack");

  const card = el("section", "card result-card");
  card.dataset.resultId = result.id;
  card.appendChild(el("p", "eyebrow", "测试完成"));
  card.appendChild(el("div", "result-badge", result.emoji));
  const title = el("h1", "", result.label);
  title.id = "result-label";
  card.appendChild(title);
  if (result.tagline) card.appendChild(el("p", "tagline", result.tagline));
  card.appendChild(el("p", "desc", result.description));

  const meters = el("div", "meters");
  const ranked = RESULTS.map((item) => ({
    item: item,
    score: totals[item.id] || 0,
  }));
  const maxScore = ranked.reduce((max, entry) => Math.max(max, entry.score), 1);
  ranked.forEach((entry) => {
    const row = el("div", "meter" + (entry.item.id === result.id ? " is-top" : ""));
    row.appendChild(el("span", "meter-label", entry.item.short || entry.item.label));
    const track = el("span", "meter-track");
    const fill = el("span", "meter-fill");
    fill.style.width = Math.round((entry.score / maxScore) * 100) + "%";
    track.appendChild(fill);
    row.appendChild(track);
    row.appendChild(el("span", "meter-score", String(entry.score)));
    meters.appendChild(row);
  });
  card.appendChild(meters);
  screen.appendChild(card);

  const share = el("section", "card share-card");
  share.appendChild(el("p", "section-label", "发给朋友的这段话"));
  const preview = el("p", "share-preview", shareText);
  preview.id = "share-text";
  share.appendChild(preview);

  const actions = el("div", "actions");
  const copy = el("button", "btn btn-primary", "复制分享文案");
  copy.type = "button";
  copy.id = "copy";
  copy.addEventListener("click", () => copyShare(shareText, preview));
  const retry = el("button", "btn btn-ghost", "再测一次");
  retry.type = "button";
  retry.id = "retry";
  retry.addEventListener("click", startQuiz);
  actions.appendChild(copy);
  actions.appendChild(retry);
  share.appendChild(actions);
  screen.appendChild(share);

  view.appendChild(screen);
}

function copyShare(shareText, preview) {
  copyText(shareText).then((method) => {
    if (method === "failed") {
      showToast("没有复制成功，请长按上方文案手动复制", method);
      try {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(preview);
        selection.removeAllRanges();
        selection.addRange(range);
      } catch (error) {
        console.warn(error);
      }
      return;
    }
    showToast("已复制，快去分享给朋友吧", method);
    const button = document.getElementById("copy");
    if (button) {
      button.textContent = "已复制";
      window.setTimeout(() => {
        if (button.isConnected) button.textContent = "复制分享文案";
      }, 1600);
    }
  });
}

function readStats() {
  try {
    const raw = localStorage.getItem(STATS_CONFIG.storageKey);
    const data = raw ? JSON.parse(raw) : {};
    return {
      visits: Number(data.visits) || 0,
      completions: Number(data.completions) || 0,
    };
  } catch (error) {
    console.warn(error);
    return { visits: 0, completions: 0 };
  }
}

function writeStats(data) {
  try {
    localStorage.setItem(STATS_CONFIG.storageKey, JSON.stringify(data));
  } catch (error) {
    console.warn(error);
  }
}

function renderLocalStats() {
  const node = document.getElementById("local-stats");
  if (!node) return;
  const data = readStats();
  node.textContent = "本机访问 " + data.visits + " 次 · 完成测试 " + data.completions + " 次";
}

function emitStats(event, detail) {
  try {
    if (typeof window.PERSONALITY_TEST_STATS_HOOK === "function") {
      window.PERSONALITY_TEST_STATS_HOOK({ event: event, detail: detail });
    }
  } catch (error) {
    console.warn("统计钩子执行失败", error);
  }
}

function recordVisit() {
  const data = readStats();
  data.visits += 1;
  writeStats(data);
  renderLocalStats();
  emitStats("visit", data);
}

function recordComplete() {
  const data = readStats();
  data.completions += 1;
  writeStats(data);
  renderLocalStats();
  emitStats("complete", data);
}

function loadScript(src, attributes) {
  try {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = () => console.warn("统计脚本加载失败");
    Object.entries(attributes || {}).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });
    document.head.appendChild(script);
  } catch (error) {
    console.warn(error);
  }
}

function initExternalStats() {
  try {
    const provider = STATS_CONFIG.provider;
    const slot = document.getElementById("external-stats");
    if (!provider || provider === "none") return;

    if (provider === "busuanzi") {
      if (slot) {
        const wrap = document.createElement("span");
        wrap.id = "busuanzi_container_site_pv";
        wrap.style.display = "none";
        wrap.appendChild(document.createTextNode("本站访问 "));
        const value = document.createElement("span");
        value.id = "busuanzi_value_site_pv";
        wrap.appendChild(value);
        wrap.appendChild(document.createTextNode(" 次"));
        slot.appendChild(wrap);
      }
      loadScript(STATS_CONFIG.busuanzi.script);
      return;
    }

    if (provider === "umami") {
      if (!STATS_CONFIG.umami.src || !STATS_CONFIG.umami.websiteId) {
        console.warn("Umami 未配置 src 或 websiteId，已跳过");
        return;
      }
      loadScript(STATS_CONFIG.umami.src, {
        defer: "",
        "data-website-id": STATS_CONFIG.umami.websiteId,
      });
      return;
    }

    if (provider === "goatcounter") {
      if (!STATS_CONFIG.goatcounter.src) {
        console.warn("GoatCounter 未配置 src，已跳过");
        return;
      }
      loadScript(STATS_CONFIG.goatcounter.script, {
        "data-goatcounter": STATS_CONFIG.goatcounter.src,
      });
      return;
    }

    if (provider === "ga") {
      const id = STATS_CONFIG.ga.measurementId;
      if (!id) {
        console.warn("GA 未配置 measurementId，已跳过");
        return;
      }
      loadScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id));
      const inline = document.createElement("script");
      inline.textContent =
        "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config'," +
        JSON.stringify(id) +
        ");";
      document.head.appendChild(inline);
      return;
    }

    console.warn("未知的统计 provider：" + provider);
  } catch (error) {
    console.warn("统计模块初始化失败", error);
  }
}

function boot() {
  validateData();
  state.answers = blankAnswers();
  try {
    recordVisit();
  } catch (error) {
    console.warn(error);
  }
  try {
    initExternalStats();
  } catch (error) {
    console.warn(error);
  }
  render();
  renderLocalStats();
}

boot();
