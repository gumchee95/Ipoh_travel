(function () {
  const dictionary = {
    en: {
      siteTitle: "Ipoh Travel Route Explorer",
      siteSubtitle: "怡保旅游路线资料库",
      contribute: "Contribute",
      eyebrow: "CSV-first civic route database",
      heroTitle: "Understand Ipoh by following connected places.",
      heroCopy: "Pick a place, then see the next realistic stops by distance, time, type, and route logic. Map failure never breaks the cards.",
      startExploring: "Start exploring",
      dataMethod: "How data works",
      sampleRoute: "Sample point-to-point route",
      aboutEyebrow: "Not official. Not ranking-for-sale.",
      aboutTitle: "A lightweight public travel map for Ipoh.",
      csvFirst: "CSV first",
      csvFirstCopy: "Places, bus stops, routes and sponsors load from CSV files first. JSON remains a fallback.",
      routeLogic: "Route logic",
      routeLogicCopy: "Recommendations use distance, manual route links, time slot, category and tags. Sponsors never change scores.",
      busCare: "Bus references",
      busCareCopy: "BAS.MY / Pink Bus references are clearly marked as inferred or needing verification unless officially checked.",
      explorerTitle: "Choose a place to build a route.",
      explorerHint: "Tip: click any place icon on the map to switch the route focus.",
      search: "Search",
      area: "Area",
      time: "Time",
      type: "Type",
      cost: "Cost",
      places: "Places",
      routeGraph: "Nearby star map",
      pointToPoint: "Distance first",
      nearbyHelp: "Closest places appear first. Similar category is not the main ranking rule.",
      legendSelected: "Selected",
      legendNearby: "Nearby place",
      legendBus: "Bus reference",
      busStops: "Nearby bus references",
      footerDisclaimer: "Community guide only. Verify opening hours, fares, routes, safety and official transport information before travelling.",
      deploymentDocs: "Deployment docs",
      contributionDocs: "Contribution guide",
      allAreas: "All areas",
      allTypes: "All types",
      allTimes: "All times",
      allCosts: "All costs",
      selected: "Selected",
      whyNext: "Why next",
      distance: "Distance",
      transport: "Transport",
      bestTime: "Best time",
      duration: "Duration",
      viewMap: "Open map",
      dataLocal: "Using CSV guide data",
      dataProblem: "Data unavailable. If opened from file://, run a small local server or deploy to GitHub Pages.",
      mapProblem: "Map could not load, but route cards still work.",
      noResults: "No places match the filters.",
      noRoutes: "No connected route found yet. Try another place or clear filters.",
      verification: "Verification",
      nearestStop: "Nearest stop reference",
      sponsorRule: "Sponsor data is disclosure-only and does not affect ranking.",
      currentFocus: "Current focus",
      nextStops: "next stops",
      busRefs: "bus refs",
      mapPlaces: "map places",
      sortedDistance: "Recommendations are sorted by nearby distance.",
      clickSwitch: "Click a card or map icon to switch focus.",
      submitTitle: "Contribute a place or correction",
      submitCopy: "This static site cannot write directly to the database. Your draft is prepared for manual review.",
      draftReady: "Draft ready for manual review.",
      copyDraft: "Copy draft",
      clear: "Clear"
    },
    zh: {
      siteTitle: "Ipoh Travel Route Explorer",
      siteSubtitle: "怡保旅游路线资料库",
      contribute: "贡献资料",
      eyebrow: "CSV 优先的社区路线资料库",
      heroTitle: "用“地点连接地点”的方式理解怡保。",
      heroCopy: "选择一个地点，就能看到按距离、时间、类型和路线逻辑推荐的下一站。地图载入失败也不会影响卡片。",
      startExploring: "开始探索",
      dataMethod: "资料如何运作",
      sampleRoute: "示例点到点路线",
      aboutEyebrow: "非官方。不会因赞助改变排序。",
      aboutTitle: "一个轻量的怡保公共旅游地图。",
      csvFirst: "CSV 优先",
      csvFirstCopy: "地点、巴士站、路线和赞助资料会优先从 CSV 载入，JSON 只作为备用。",
      routeLogic: "路线逻辑",
      routeLogicCopy: "推荐依据距离、人工路线、时间、类别和标签。赞助不会改变分数。",
      busCare: "巴士参考",
      busCareCopy: "BAS.MY / Pink Bus 参考会清楚标示推断或待核实，除非已由官方确认。",
      explorerTitle: "选择一个地点，建立路线。",
      explorerHint: "提示：点击地图上的地点图标，就能切换当前路线焦点。",
      search: "搜索",
      area: "区域",
      time: "时间",
      type: "类型",
      cost: "费用",
      places: "地点",
      routeGraph: "附近星点图",
      pointToPoint: "距离优先",
      nearbyHelp: "最近的地点优先显示；同类型不再是主要排序规则。",
      legendSelected: "已选择",
      legendNearby: "附近地点",
      legendBus: "巴士参考",
      busStops: "附近巴士参考",
      footerDisclaimer: "社区指南，仅供参考。出行前请确认营业时间、费用、路线、安全和官方交通资讯。",
      deploymentDocs: "部署说明",
      contributionDocs: "贡献指南",
      allAreas: "全部区域",
      allTypes: "全部类型",
      allTimes: "全部时间",
      allCosts: "全部费用",
      selected: "已选择",
      whyNext: "为什么推荐",
      distance: "距离",
      transport: "交通",
      bestTime: "适合时间",
      duration: "建议停留",
      viewMap: "打开地图",
      dataLocal: "正在使用 CSV 指南资料",
      dataProblem: "资料无法载入。如果你用 file:// 打开，请改用本地小服务器或部署到 GitHub Pages。",
      mapProblem: "地图无法载入，但路线卡片仍可使用。",
      noResults: "没有符合筛选的地点。",
      noRoutes: "暂时没有连接路线。请换一个地点或清除筛选。",
      verification: "核实状态",
      nearestStop: "最近站点参考",
      sponsorRule: "赞助资料只作披露，不影响排序。",
      currentFocus: "当前焦点",
      nextStops: "个下一站",
      busRefs: "个巴士参考",
      mapPlaces: "个地图地点",
      sortedDistance: "推荐会优先按附近距离排序。",
      clickSwitch: "点击卡片或地图图标即可切换焦点。",
      submitTitle: "贡献地点或修正",
      submitCopy: "这个静态网站不会直接写入数据库。你提交的是给人工审核的草稿。",
      draftReady: "草稿已准备好，可人工审核。",
      copyDraft: "复制草稿",
      clear: "清空"
    }
  };

  let language = localStorage.getItem("ipohLanguage") || "en";

  function t(key) {
    return (dictionary[language] && dictionary[language][key]) || dictionary.en[key] || key;
  }

  function getLanguage() {
    return language;
  }

  function setLanguage(nextLanguage) {
    language = nextLanguage === "zh" ? "zh" : "en";
    localStorage.setItem("ipohLanguage", language);
    applyTranslations();
  }

  function toggleLanguage() {
    setLanguage(language === "en" ? "zh" : "en");
  }

  function applyTranslations(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });
    const button = document.getElementById("languageToggle");
    if (button) button.textContent = language === "en" ? "中文" : "EN";
    document.documentElement.lang = language === "zh" ? "zh" : "en";
  }

  window.IpohI18n = { t, getLanguage, setLanguage, toggleLanguage, applyTranslations };
})();
