const dataSourceConfig = {
  mode: "local-first",
  googleSheetCsvUrl: "",
  googleSheetCsvUrls: {
    places: "",
    connections: "",
    routes: ""
  },
  fallbackToLocal: true
};

const placesDb = [
  {
    id: "ipoh-railway-station",
    type: "landmark",
    area: "Old Town",
    category: "Heritage",
    tags: ["arrival", "photo", "architecture", "colonial"],
    timeSlots: ["morning", "afternoon", "evening"],
    primaryTimeSlot: "morning",
    name: "Ipoh Railway Station",
    nameEn: "Ipoh Railway Station",
    duration: "25-40 min",
    desc: "A graceful colonial-era arrival point and one of the easiest anchors for starting an Old Town walking route.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Ipoh+Railway+Station",
    imgEmoji: "🚉",
    costType: "free",
    costLabel: "Free",
    estimatedCost: "RM0",
    parking: "Limited roadside and station parking nearby.",
    weatherNote: "Best in morning or golden hour for cooler photos.",
    walkability: "Good Old Town walk starter; shaded sections vary.",
    lastVerified: "2026-06-01",
    connections: [
      {
        id: "concubine-lane",
        relation: "Old Town walk",
        reason: "Pairs the railway landmark with Ipoh's most compact heritage lane experience.",
        distanceNote: "About 1.1 km; 15 min walk.",
        transportMode: "Walk or short e-hailing ride"
      },
      {
        id: "market-lane",
        relation: "Heritage connector",
        reason: "A quieter lane that keeps the route heritage-focused before the busier tourist streets.",
        distanceNote: "About 1 km; 12-15 min walk.",
        transportMode: "Walk"
      },
      {
        id: "kinta-riverfront",
        relation: "Evening extension",
        reason: "Good for turning an arrival-day walk into a relaxed sunset or night stroll.",
        distanceNote: "About 1.2 km; 5-8 min by car.",
        transportMode: "E-hailing or drive"
      }
    ]
  },
  {
    id: "nam-heong-white-coffee",
    type: "food",
    area: "Old Town",
    category: "Coffee",
    tags: ["white coffee", "breakfast", "kopitiam", "local"],
    timeSlots: ["morning", "afternoon"],
    primaryTimeSlot: "morning",
    name: "Nam Heong White Coffee",
    nameEn: "Nam Heong White Coffee",
    duration: "35-60 min",
    desc: "Classic Ipoh white coffee stop with kopitiam energy, best used as a fuel-up before Old Town walking.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Nam+Heong+White+Coffee+Ipoh",
    imgEmoji: "☕",
    costType: "low",
    costLabel: "Low cost",
    estimatedCost: "RM8-RM20 per person",
    parking: "Street parking is competitive during breakfast hours.",
    weatherNote: "Indoor seating helps during heat or rain.",
    walkability: "Excellent link to Concubine Lane and Market Lane.",
    lastVerified: "2026-06-01",
    connections: [
      {
        id: "concubine-lane",
        relation: "After coffee stroll",
        reason: "The lane is close enough to visit before the day gets hot and crowded.",
        distanceNote: "About 250 m; 3-5 min walk.",
        transportMode: "Walk"
      },
      {
        id: "funny-mountain",
        relation: "Dessert chain",
        reason: "Balances coffee and toast with Ipoh's famous tau fu fah dessert.",
        distanceNote: "About 650 m; 8-10 min walk.",
        transportMode: "Walk"
      },
      {
        id: "market-lane",
        relation: "Photo detour",
        reason: "Adds murals and quieter heritage textures without needing transport.",
        distanceNote: "About 300 m; 4 min walk.",
        transportMode: "Walk"
      }
    ]
  },
  {
    id: "concubine-lane",
    type: "street",
    area: "Old Town",
    category: "Heritage",
    tags: ["shopping", "snacks", "heritage", "photo"],
    timeSlots: ["morning", "afternoon"],
    primaryTimeSlot: "morning",
    name: "Concubine Lane",
    nameEn: "Concubine Lane",
    duration: "30-60 min",
    desc: "A narrow heritage lane with snack stalls, souvenir stops, and busy weekend energy.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Concubine+Lane+Ipoh",
    imgEmoji: "🏮",
    costType: "flexible",
    costLabel: "Free to browse",
    estimatedCost: "RM0-RM30 depending on snacks",
    parking: "Use nearby paid lots or walk from Old Town.",
    weatherNote: "Can feel hot and crowded at midday.",
    walkability: "Very walkable but narrow during peak hours.",
    lastVerified: "2026-06-01",
    connections: [
      {
        id: "market-lane",
        relation: "Lane pairing",
        reason: "Market Lane is calmer and gives contrast after the tourist-heavy Concubine Lane.",
        distanceNote: "About 150 m; 2 min walk.",
        transportMode: "Walk"
      },
      {
        id: "mural-arts-lane",
        relation: "Photo route",
        reason: "Keeps the route visual, street-level, and easy for first-time Ipoh visitors.",
        distanceNote: "About 850 m; 10-12 min walk.",
        transportMode: "Walk"
      },
      {
        id: "nam-heong-white-coffee",
        relation: "Kopitiam nearby",
        reason: "A convenient breakfast or coffee stop before browsing the lane.",
        distanceNote: "About 250 m; 3-5 min walk.",
        transportMode: "Walk"
      }
    ]
  },
  {
    id: "market-lane",
    type: "street",
    area: "Old Town",
    category: "Heritage",
    tags: ["mural", "photo", "heritage", "walk"],
    timeSlots: ["morning", "afternoon"],
    primaryTimeSlot: "morning",
    name: "Market Lane",
    nameEn: "Market Lane",
    duration: "20-40 min",
    desc: "A compact Old Town lane with murals and heritage details that works well as a quiet connector.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Market+Lane+Ipoh",
    imgEmoji: "🎨",
    costType: "free",
    costLabel: "Free",
    estimatedCost: "RM0",
    parking: "Best reached on foot from Old Town.",
    weatherNote: "Short stop; easy to fit between rain spells.",
    walkability: "Excellent, especially with Concubine Lane.",
    lastVerified: "2026-06-01",
    connections: [
      {
        id: "concubine-lane",
        relation: "Nearby lane",
        reason: "They form a compact Old Town pair with almost no travel friction.",
        distanceNote: "About 150 m; 2 min walk.",
        transportMode: "Walk"
      },
      {
        id: "ipoh-railway-station",
        relation: "Arrival anchor",
        reason: "Useful if starting from the station and easing into Old Town.",
        distanceNote: "About 1 km; 12-15 min walk.",
        transportMode: "Walk"
      },
      {
        id: "nam-heong-white-coffee",
        relation: "Coffee break",
        reason: "A practical nearby kopitiam stop before or after mural hunting.",
        distanceNote: "About 300 m; 4 min walk.",
        transportMode: "Walk"
      }
    ]
  },
  {
    id: "mural-arts-lane",
    type: "street",
    area: "New Town",
    category: "Art",
    tags: ["murals", "photo", "street art", "walk"],
    timeSlots: ["morning", "afternoon"],
    primaryTimeSlot: "afternoon",
    name: "Mural Art's Lane",
    nameEn: "Mural Art's Lane",
    duration: "30-50 min",
    desc: "A street-art corridor for slower wandering, photo stops, and connecting Old Town appetite to New Town dining.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Mural+Art%27s+Lane+Ipoh",
    imgEmoji: "🖌️",
    costType: "free",
    costLabel: "Free",
    estimatedCost: "RM0",
    parking: "Street parking varies by time of day.",
    weatherNote: "Avoid harsh midday sun if taking photos.",
    walkability: "Walkable, but bring water on hot days.",
    lastVerified: "2026-06-01",
    connections: [
      {
        id: "funny-mountain",
        relation: "Dessert nearby",
        reason: "A cooling tau fu fah stop after mural walking.",
        distanceNote: "About 500 m; 6-8 min walk.",
        transportMode: "Walk"
      },
      {
        id: "lou-wong",
        relation: "Dinner lead-in",
        reason: "Naturally transitions from photo walking to chicken hor fun dinner.",
        distanceNote: "About 600 m; 8 min walk.",
        transportMode: "Walk"
      },
      {
        id: "tong-sui-kai",
        relation: "Night food route",
        reason: "Keeps visitors in New Town for a casual evening food crawl.",
        distanceNote: "About 1 km; 5 min by car.",
        transportMode: "Walk, drive, or e-hailing"
      }
    ]
  },
  {
    id: "funny-mountain",
    type: "food",
    area: "New Town",
    category: "Dessert",
    tags: ["tau fu fah", "dessert", "quick stop", "local"],
    timeSlots: ["morning", "afternoon"],
    primaryTimeSlot: "afternoon",
    name: "Funny Mountain",
    nameEn: "Funny Mountain Soya Bean",
    duration: "10-25 min",
    desc: "A quick, iconic soya bean and tau fu fah stop that fits between walking routes and heavier meals.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Funny+Mountain+Soya+Bean+Ipoh",
    imgEmoji: "🍮",
    costType: "low",
    costLabel: "Low cost",
    estimatedCost: "RM3-RM8 per person",
    parking: "Often easier as a quick stop or walk-in.",
    weatherNote: "Ideal cooling break in hot weather.",
    walkability: "Easy from New Town food and mural stops.",
    lastVerified: "2026-06-01",
    connections: [
      {
        id: "mural-arts-lane",
        relation: "Cooling break",
        reason: "Great after walking under the sun for street-art photos.",
        distanceNote: "About 500 m; 6-8 min walk.",
        transportMode: "Walk"
      },
      {
        id: "lou-wong",
        relation: "Food crawl",
        reason: "A light dessert stop before or after chicken hor fun.",
        distanceNote: "About 350 m; 4-5 min walk.",
        transportMode: "Walk"
      },
      {
        id: "nam-heong-white-coffee",
        relation: "Classic Ipoh pair",
        reason: "Combines two signature Ipoh tastes in a short central route.",
        distanceNote: "About 650 m; 8-10 min walk.",
        transportMode: "Walk"
      }
    ]
  },
  {
    id: "lou-wong",
    type: "food",
    area: "New Town",
    category: "Dinner",
    tags: ["chicken rice", "hor fun", "dinner", "local"],
    timeSlots: ["afternoon", "evening", "night"],
    primaryTimeSlot: "evening",
    name: "Lou Wong",
    nameEn: "Lou Wong Bean Sprout Chicken",
    duration: "45-75 min",
    desc: "A famous bean sprout chicken and hor fun dinner anchor in New Town.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Lou+Wong+Bean+Sprout+Chicken+Ipoh",
    imgEmoji: "🍗",
    costType: "medium",
    costLabel: "Moderate",
    estimatedCost: "RM18-RM40 per person",
    parking: "Busy roadside parking; consider walking from nearby hotel.",
    weatherNote: "Evening is more comfortable than midday.",
    walkability: "Strong New Town food crawl base.",
    lastVerified: "2026-06-01",
    connections: [
      {
        id: "tong-sui-kai",
        relation: "After-dinner dessert",
        reason: "Easy next stop for tong sui, snacks, and a local night-food mood.",
        distanceNote: "About 850 m; 10-12 min walk.",
        transportMode: "Walk or short drive"
      },
      {
        id: "gerbang-malam",
        relation: "Night market add-on",
        reason: "Good after dinner when the night market atmosphere is active.",
        distanceNote: "About 500 m; 6-8 min walk.",
        transportMode: "Walk"
      },
      {
        id: "funny-mountain",
        relation: "Dessert nearby",
        reason: "A classic quick dessert stop if visiting before closing hours.",
        distanceNote: "About 350 m; 4-5 min walk.",
        transportMode: "Walk"
      }
    ]
  },
  {
    id: "tong-sui-kai",
    type: "food",
    area: "New Town",
    category: "Night Food",
    tags: ["dessert", "hawker", "night", "snacks"],
    timeSlots: ["evening", "night"],
    primaryTimeSlot: "night",
    name: "Tong Sui Kai",
    nameEn: "Tong Sui Kai",
    duration: "45-90 min",
    desc: "A night dessert and hawker stretch suited for groups who want variety without formal dining.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Tong+Sui+Kai+Ipoh",
    imgEmoji: "🥣",
    costType: "low",
    costLabel: "Low to moderate",
    estimatedCost: "RM8-RM25 per person",
    parking: "Street parking nearby; ride-hailing is simpler.",
    weatherNote: "Outdoor seating depends on rain.",
    walkability: "Walkable along the food stretch; traffic can be busy.",
    lastVerified: "2026-06-01",
    connections: [
      {
        id: "lou-wong",
        relation: "Dinner pairing",
        reason: "A natural dessert follow-up after bean sprout chicken.",
        distanceNote: "About 850 m; 10-12 min walk.",
        transportMode: "Walk or short drive"
      },
      {
        id: "gerbang-malam",
        relation: "Night walk",
        reason: "Adds browsing and atmosphere after food.",
        distanceNote: "About 750 m; 10 min walk.",
        transportMode: "Walk"
      },
      {
        id: "kinta-riverfront",
        relation: "Wind-down",
        reason: "A calmer riverside stroll after a dense food stop.",
        distanceNote: "About 2.5 km; 8-12 min by car.",
        transportMode: "E-hailing or drive"
      }
    ]
  },
  {
    id: "gerbang-malam",
    type: "market",
    area: "New Town",
    category: "Night Market",
    tags: ["night market", "shopping", "street", "evening"],
    timeSlots: ["evening", "night"],
    primaryTimeSlot: "night",
    name: "Gerbang Malam",
    nameEn: "Gerbang Malam Night Market",
    duration: "30-75 min",
    desc: "A casual night market stretch for browsing, small buys, and extending a New Town dinner route.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Gerbang+Malam+Ipoh",
    imgEmoji: "🌙",
    costType: "flexible",
    costLabel: "Free to browse",
    estimatedCost: "RM0-RM50 depending on purchases",
    parking: "Central parking can be tight at night.",
    weatherNote: "Best in dry weather; stalls vary by night.",
    walkability: "Easy browsing street, but watch traffic edges.",
    lastVerified: "2026-06-01",
    connections: [
      {
        id: "lou-wong",
        relation: "Post-dinner browse",
        reason: "Keeps the evening route compact and lively.",
        distanceNote: "About 500 m; 6-8 min walk.",
        transportMode: "Walk"
      },
      {
        id: "tong-sui-kai",
        relation: "Snack extension",
        reason: "Good if the group wants dessert after market browsing.",
        distanceNote: "About 750 m; 10 min walk.",
        transportMode: "Walk"
      },
      {
        id: "kinta-riverfront",
        relation: "Night scenery",
        reason: "Switches from street bustle to a more scenic night walk.",
        distanceNote: "About 1.8 km; 7-10 min by car.",
        transportMode: "E-hailing or drive"
      }
    ]
  },
  {
    id: "kinta-riverfront",
    type: "landmark",
    area: "Riverfront",
    category: "Scenic",
    tags: ["river", "night", "walk", "lights"],
    timeSlots: ["evening", "night"],
    primaryTimeSlot: "evening",
    name: "Kinta Riverfront",
    nameEn: "Kinta Riverfront",
    duration: "30-60 min",
    desc: "A gentle riverside stop for cooling down the pace, especially after food-heavy routes.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Kinta+Riverfront+Ipoh",
    imgEmoji: "🌉",
    costType: "free",
    costLabel: "Free",
    estimatedCost: "RM0",
    parking: "Hotel and public parking options nearby.",
    weatherNote: "Better after sunset; avoid storms.",
    walkability: "Comfortable short stroll area.",
    lastVerified: "2026-06-01",
    connections: [
      {
        id: "ipoh-railway-station",
        relation: "Scenic arrival loop",
        reason: "Useful for visitors staying near Old Town who want a relaxed evening add-on.",
        distanceNote: "About 1.2 km; 5-8 min by car.",
        transportMode: "E-hailing or drive"
      },
      {
        id: "gerbang-malam",
        relation: "Night contrast",
        reason: "Pairs market bustle with a calmer riverside finish.",
        distanceNote: "About 1.8 km; 7-10 min by car.",
        transportMode: "E-hailing or drive"
      },
      {
        id: "tong-sui-kai",
        relation: "After dessert walk",
        reason: "A light scenic reset after a sweet night-food stop.",
        distanceNote: "About 2.5 km; 8-12 min by car.",
        transportMode: "E-hailing or drive"
      }
    ]
  },
  {
    id: "kek-lok-tong",
    type: "temple",
    area: "Limestone Belt",
    category: "Cave Temple",
    tags: ["cave", "temple", "garden", "nature"],
    timeSlots: ["morning", "afternoon"],
    primaryTimeSlot: "morning",
    name: "Kek Lok Tong",
    nameEn: "Kek Lok Tong Cave Temple",
    duration: "60-90 min",
    desc: "A spacious limestone cave temple with a garden backdrop, best as a calm half-day nature route.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Kek+Lok+Tong+Ipoh",
    imgEmoji: "⛰️",
    costType: "free",
    costLabel: "Free entry",
    estimatedCost: "RM0 excluding transport",
    parking: "On-site parking usually available.",
    weatherNote: "Morning is cooler for the garden area.",
    walkability: "Easy internal walking; transport needed from city center.",
    lastVerified: "2026-06-01",
    connections: [
      {
        id: "sam-poh-tong",
        relation: "Cave temple pair",
        reason: "The two temples make a logical limestone belt route with minimal backtracking.",
        distanceNote: "About 3.5 km; 8-12 min by car.",
        transportMode: "Drive or e-hailing"
      },
      {
        id: "mural-arts-lane",
        relation: "City return",
        reason: "A practical return-to-town option after a cave temple morning.",
        distanceNote: "About 7 km; 15-20 min by car.",
        transportMode: "Drive or e-hailing"
      },
      {
        id: "nam-heong-white-coffee",
        relation: "Breakfast first",
        reason: "Start with coffee in Old Town before heading out to the limestone belt.",
        distanceNote: "About 8 km; 18-25 min by car.",
        transportMode: "Drive or e-hailing"
      }
    ]
  },
  {
    id: "sam-poh-tong",
    type: "temple",
    area: "Limestone Belt",
    category: "Cave Temple",
    tags: ["cave", "temple", "limestone", "culture"],
    timeSlots: ["morning", "afternoon"],
    primaryTimeSlot: "morning",
    name: "Sam Poh Tong",
    nameEn: "Sam Poh Tong Temple",
    duration: "45-75 min",
    desc: "A well-known cave temple stop that works best when grouped with other limestone belt sights.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Sam+Poh+Tong+Ipoh",
    imgEmoji: "🪨",
    costType: "free",
    costLabel: "Free entry",
    estimatedCost: "RM0 excluding transport",
    parking: "Parking is usually available near the temple area.",
    weatherNote: "Morning visits are calmer and cooler.",
    walkability: "Easy temple visit; city transfer requires transport.",
    lastVerified: "2026-06-01",
    connections: [
      {
        id: "kek-lok-tong",
        relation: "Limestone route",
        reason: "Completes a classic cave temple pairing without returning to town between stops.",
        distanceNote: "About 3.5 km; 8-12 min by car.",
        transportMode: "Drive or e-hailing"
      },
      {
        id: "lou-wong",
        relation: "Dinner return",
        reason: "Easy way to end a temple afternoon with a central New Town meal.",
        distanceNote: "About 6.5 km; 15-20 min by car.",
        transportMode: "Drive or e-hailing"
      },
      {
        id: "ipoh-railway-station",
        relation: "Arrival or departure",
        reason: "A transport-friendly endpoint if pairing sightseeing with train arrival or departure.",
        distanceNote: "About 8 km; 18-25 min by car.",
        transportMode: "Drive or e-hailing"
      }
    ]
  }
];

const routesConfig = [
  {
    id: "old-town-first-timer",
    title: "Old Town First-Timer Loop",
    titleZh: "老街初访路线",
    summary: "Start with the railway station, coffee, heritage lanes, murals, and a light dessert stop.",
    placeIds: [
      "ipoh-railway-station",
      "nam-heong-white-coffee",
      "concubine-lane",
      "market-lane",
      "mural-arts-lane",
      "funny-mountain"
    ],
    bestFor: "First visit, photos, light walking",
    costType: "low",
    timeSlot: "morning"
  },
  {
    id: "night-food-walk",
    title: "New Town Night Food Walk",
    titleZh: "新街场夜食路线",
    summary: "A compact evening route for chicken hor fun, dessert stalls, night market browsing, and riverfront cooling down.",
    placeIds: ["lou-wong", "tong-sui-kai", "gerbang-malam", "kinta-riverfront"],
    bestFor: "Dinner groups, night snacks, low planning",
    costType: "medium",
    timeSlot: "night"
  },
  {
    id: "limestone-calm-half-day",
    title: "Limestone Calm Half-Day",
    titleZh: "石灰岩静心半日游",
    summary: "A slower cave-temple route that pairs Kek Lok Tong and Sam Poh Tong before returning to the city for food.",
    placeIds: ["kek-lok-tong", "sam-poh-tong", "lou-wong", "gerbang-malam"],
    bestFor: "Nature, temples, slower pace",
    costType: "flexible",
    timeSlot: "morning"
  }
];

window.dataSourceConfig = dataSourceConfig;
window.placesDb = placesDb;
window.routesConfig = routesConfig;
