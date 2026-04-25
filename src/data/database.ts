// 传奇扑克牌手数据库 - 核心数据
export interface PlayerResult {
  year: number;
  location: string;
  eventName: string;
  buyIn: string;
  prize: string;
  placing: string;
  players: number;
}

export interface Player {
  id: string;
  name: string;
  country: string;
  flag: string;
  nickname?: string;
  image: string;
  totalEarnings: string;
  titles: number;
  cashes: number;
  bestCash: string;
  bio: string;
  tritonResults: PlayerResult[];
  otherSeries?: string[];
  tags: string[];
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  platform: 'youtube' | 'twitch' | 'pokertube' | 'other';
  duration: string;
  views: string;
  publishedAt: string;
  event?: string;
  players: string[];
  subtitles?: string;
  tags: string[];
  addedAt: string;
  isSaved: boolean;
}

export interface TournamentEvent {
  id: string;
  name: string;
  gameType: string;
  buyIn: string;
  entries: number;
  prizePool: string;
  date: string;
  status: 'completed' | 'upcoming';
  results: TournamentEventResult[];
}

export interface TournamentEventResult {
  placing: string;
  playerName: string;
  playerId?: string;        // link to Player.id if in our DB
  prize: string;
  country?: string;
  flag?: string;
  gpiRanking?: number;       // GPI global ranking
}

export interface Tournament {
  id: string;
  name: string;
  year: number;
  location: string;
  startDate: string;
  endDate: string;
  events: number;
  totalPrizePool: string;
  winner: string;
  imageUrl: string;
  description: string;
  eventList?: TournamentEvent[];  // detailed sub-events
  highlights?: string;            // tournament highlight text
  venue?: string;                 // casino/venue name
  gpiNote?: string;               // GPI reference note
}

export const PLAYERS: Player[] = [
  {
    id: "jason-koon",
    name: "Jason Koon",
    country: "USA",
    flag: "🇺🇸",
    nickname: "The Phenom",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    totalEarnings: "$48,576,000",
    titles: 12,
    cashes: 45,
    bestCash: "$3,579,836",
    bio: "Jason Koon 是 Triton Poker 历史上最成功的选手，拥有12个冠军头衔。他以其出色的决策能力和稳定的发挥闻名于高额扑克圈，被公认为当今世界最佳扑克选手之一。",
    tritonResults: [
      { year: 2025, location: "黑山", eventName: "$30,000 PLO Bounty Quattro", buyIn: "$30,000", prize: "$385,176", placing: "1st", players: 156 },
      { year: 2025, location: "黑山", eventName: "$150,000 NL Hold'em", buyIn: "$150,000", prize: "$3,393,656", placing: "1st", players: 68 },
      { year: 2023, location: "蒙特卡洛", eventName: "$25,000 PLO", buyIn: "$25,000", prize: "$365,000", placing: "1st", players: 201 },
      { year: 2023, location: "伦敦", eventName: "$60,000 Short Deck Main Event", buyIn: "$60,000", prize: "$828,000", placing: "1st", players: 102 },
      { year: 2023, location: "伦敦", eventName: "$60,000 NL Hold'em 7-Max", buyIn: "$60,000", prize: "$1,570,000", placing: "1st", players: 89 },
      { year: 2023, location: "北塞浦路斯", eventName: "$100,000 NL Hold'em Main Event", buyIn: "$100,000", prize: "$2,451,082", placing: "1st", players: 76 },
      { year: 2023, location: "北塞浦路斯", eventName: "$20,000 NL Hold'em 7-Max", buyIn: "$20,000", prize: "$663,000", placing: "1st", players: 245 },
      { year: 2023, location: "越南", eventName: "$50,000 NL Hold'em Turbo", buyIn: "$50,000", prize: "$574,000", placing: "1st", players: 130 },
      { year: 2022, location: "马德里", eventName: "€150,000 Short Deck One Bullet", buyIn: "€150,000", prize: "€1,750,000", placing: "1st", players: 42 },
      { year: 2019, location: "济州", eventName: "HK$1,000,000 NL Hold'em Reload", buyIn: "HK$1,000,000", prize: "$993,221", placing: "1st", players: 32 },
      { year: 2019, location: "济州", eventName: "HK$1,000,000 Short Deck", buyIn: "HK$1,000,000", prize: "$2,899,000", placing: "1st", players: 28 },
      { year: 2018, location: "黑山", eventName: "HK$1,000,000 NL Hold'em", buyIn: "HK$1,000,000", prize: "$3,579,836", placing: "1st", players: 48 },
    ],
    otherSeries: ["WSOP", "WPT", "Super High Roller Bowl", "Aria High Roller"],
    tags: ["NL Hold'em", "Short Deck", "PLO", "High Roller"]
  },
  {
    id: "phil-ivey",
    name: "Phil Ivey",
    country: "USA",
    flag: "🇺🇸",
    nickname: "The Tiger Woods of Poker",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    totalEarnings: "$38,500,000",
    titles: 5,
    cashes: 32,
    bestCash: "$1,170,000",
    bio: "Phil Ivey 被广泛认为是史上最伟大的扑克选手之一。在 Triton 系列赛中，他展现了短牌扑克的卓越技巧，赢得了5个冠军头衔。",
    tritonResults: [
      { year: 2023, location: "伦敦", eventName: "$25,000 Short Deck Turbo", buyIn: "$25,000", prize: "$280,500", placing: "1st", players: 198 },
      { year: 2023, location: "伦敦", eventName: "$60,000 NL Hold'em Turbo", buyIn: "$60,000", prize: "$1,007,000", placing: "1st", players: 95 },
      { year: 2022, location: "塞浦路斯", eventName: "$30,000 Short Deck", buyIn: "$30,000", prize: "$387,000", placing: "1st", players: 165 },
      { year: 2022, location: "塞浦路斯", eventName: "$75,000 Short Deck", buyIn: "$75,000", prize: "$1,170,000", placing: "1st", players: 56 },
      { year: 2018, location: "黑山", eventName: "HK$250,000 Short Deck", buyIn: "HK$250,000", prize: "$604,992", placing: "1st", players: 38 },
    ],
    otherSeries: ["WSOP (10条金手链)", "WPT", "FTOPS", "Poker Masters"],
    tags: ["Short Deck", "Mixed Games", "High Roller"]
  },
  {
    id: "patrik-antonius",
    name: "Patrik Antonius",
    country: "Finland",
    flag: "🇫🇮",
    nickname: "The Finn",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    totalEarnings: "$26,000,000",
    titles: 2,
    cashes: 28,
    bestCash: "$5,130,000",
    bio: "Patrik Antonius 是芬兰传奇扑克选手，以线上高额现金桌的辉煌战绩闻名。他在 Triton 邀请赛中赢得了惊人的 $5,130,000 冠军奖金。",
    tritonResults: [
      { year: 2024, location: "蒙特卡洛", eventName: "$200,000 Triton Invitational", buyIn: "$200,000", prize: "$5,130,000", placing: "1st", players: 20 },
      { year: 2022, location: "塞浦路斯", eventName: "$25,000 NL Hold'em 8-Max", buyIn: "$25,000", prize: "$825,000", placing: "1st", players: 180 },
      { year: 2022, location: "马德里", eventName: "€100,000 NL Hold'em", buyIn: "€100,000", prize: "€420,000", placing: "3rd", players: 48 },
      { year: 2023, location: "越南", eventName: "$100,000 NL Hold'em", buyIn: "$100,000", prize: "$580,000", placing: "5th", players: 85 },
    ],
    otherSeries: ["WSOP", "WPT", "EPT", "Poker After Dark"],
    tags: ["NL Hold'em", "Cash Game Specialist", "High Roller"]
  },
  {
    id: "stephen-chidwick",
    name: "Stephen Chidwick",
    country: "UK",
    flag: "🇬🇧",
    nickname: "steveseyes",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    totalEarnings: "$32,000,000",
    titles: 3,
    cashes: 38,
    bestCash: "$2,870,000",
    bio: "Stephen Chidwick 是英国顶尖职业扑克选手，以极强的分析能力和 GTO 优化策略著称。他在 Triton 和全球各大高额赛事中都有出色表现。",
    tritonResults: [
      { year: 2023, location: "北塞浦路斯", eventName: "$100,000 NL Hold'em", buyIn: "$100,000", prize: "$2,870,000", placing: "1st", players: 76 },
      { year: 2022, location: "伦敦", eventName: "$50,000 NL Hold'em", buyIn: "$50,000", prize: "$1,200,000", placing: "1st", players: 92 },
      { year: 2023, location: "越南", eventName: "$50,000 PLO", buyIn: "$50,000", prize: "$890,000", placing: "1st", players: 110 },
      { year: 2025, location: "济州", eventName: "$50,000 NL Hold'em", buyIn: "$50,000", prize: "$350,000", placing: "4th", players: 156 },
    ],
    otherSeries: ["WSOP", "WPT", "Poker Masters", "US Poker Open"],
    tags: ["NL Hold'em", "PLO", "Tournament Specialist", "GTO"]
  },
  {
    id: "isaac-haxton",
    name: "Isaac Haxton",
    country: "USA",
    flag: "🇺🇸",
    nickname: "luvthebung",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    totalEarnings: "$42,000,000",
    titles: 4,
    cashes: 42,
    bestCash: "$3,675,000",
    bio: "Isaac Haxton 是美国顶尖职业扑克选手，擅长高额锦标赛和现金桌。他以其出色的数学能力和深度的游戏理论理解闻名。",
    tritonResults: [
      { year: 2023, location: "蒙特卡洛", eventName: "$100,000 NL Hold'em", buyIn: "$100,000", prize: "$3,675,000", placing: "1st", players: 65 },
      { year: 2022, location: "塞浦路斯", eventName: "$50,000 NL Hold'em", buyIn: "$50,000", prize: "$1,450,000", placing: "1st", players: 98 },
      { year: 2023, location: "伦敦", eventName: "$75,000 Short Deck", buyIn: "$75,000", prize: "$920,000", placing: "1st", players: 72 },
      { year: 2024, location: "蒙特卡洛", eventName: "$50,000 PLO", buyIn: "$50,000", prize: "$680,000", placing: "2nd", players: 120 },
      { year: 2025, location: "黑山", eventName: "$100,000 NL Hold'em", buyIn: "$100,000", prize: "$425,000", placing: "3rd", players: 68 },
    ],
    otherSeries: ["WSOP", "PokerStars Championship", "Super High Roller Bowl", "WPT"],
    tags: ["NL Hold'em", "PLO", "Short Deck", "High Roller"]
  },
  {
    id: "fedor-holz",
    name: "Fedor Holz",
    country: "Germany",
    flag: "🇩🇪",
    nickname: "CrownUpGuy",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&sat=-50",
    totalEarnings: "$36,000,000",
    titles: 3,
    cashes: 35,
    bestCash: "$6,000,000",
    bio: "Fedor Holz 是德国扑克传奇，从线上锦标赛起步后迅速成为高额现场赛的顶尖选手。他在2016年WSOP一滴油豪客赛中获得亚军，赢得$6,000,000。",
    tritonResults: [
      { year: 2024, location: "蒙特卡洛", eventName: "$100,000 NL Hold'em", buyIn: "$100,000", prize: "$2,100,000", placing: "1st", players: 65 },
      { year: 2023, location: "北塞浦路斯", eventName: "$50,000 NL Hold'em", buyIn: "$50,000", prize: "$780,000", placing: "2nd", players: 130 },
      { year: 2022, location: "马德里", eventName: "€50,000 NL Hold'em", buyIn: "€50,000", prize: "€1,300,000", placing: "1st", players: 85 },
      { year: 2024, location: "伦敦", eventName: "$75,000 Short Deck", buyIn: "$75,000", prize: "$560,000", placing: "4th", players: 82 },
    ],
    otherSeries: ["WSOP", "WCOOP", "Super High Roller Bowl", "Poker Masters"],
    tags: ["NL Hold'em", "Online Phenom", "High Roller"]
  },
  {
    id: "daniel-negreanu",
    name: "Daniel Negreanu",
    country: "Canada",
    flag: "🇨🇦",
    nickname: "Kid Poker",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    totalEarnings: "$52,000,000",
    titles: 2,
    cashes: 22,
    bestCash: "$3,000,000",
    bio: "Daniel Negreanu 是扑克名人堂成员，以其出色的读人能力和友善的性格闻名。他是扑克史上奖金最高的选手之一，在 Triton 系列赛中也有亮眼表现。",
    tritonResults: [
      { year: 2023, location: "伦敦", eventName: "$50,000 NL Hold'em", buyIn: "$50,000", prize: "$1,560,000", placing: "1st", players: 95 },
      { year: 2022, location: "塞浦路斯", eventName: "$50,000 Short Deck", buyIn: "$50,000", prize: "$750,000", placing: "3rd", players: 120 },
      { year: 2024, location: "蒙特卡洛", eventName: "$50,000 PLO", buyIn: "$50,000", prize: "$420,000", placing: "6th", players: 135 },
      { year: 2025, location: "济州", eventName: "$50,000 NL Hold'em", buyIn: "$50,000", prize: "$880,000", placing: "2nd", players: 156 },
    ],
    otherSeries: ["WSOP (6条金手链)", "WPT (多个冠军)", "EPT", "PokerGO Tour"],
    tags: ["NL Hold'em", "Mixed Games", "PLO", "Entertainment"]
  },
  {
    id: "benshabat",
    name: "Tal Benshabat",
    country: "Israel",
    flag: "🇮🇱",
    nickname: "Captain Sushi",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    totalEarnings: "$18,500,000",
    titles: 2,
    cashes: 25,
    bestCash: "$5,200,000",
    bio: "Tal Benshabat 是以色列职业扑克选手，以其大胆激进的打法风格闻名。他在 Triton 系列赛中表现突出，单场最高奖金达到 $5,200,000。",
    tritonResults: [
      { year: 2025, location: "济州", eventName: "$50,000 NL Hold'em Main Event", buyIn: "$50,000", prize: "$5,200,000", placing: "1st", players: 285 },
      { year: 2024, location: "伦敦", eventName: "$100,000 Short Deck", buyIn: "$100,000", prize: "$1,850,000", placing: "1st", players: 48 },
      { year: 2023, location: "越南", eventName: "$25,000 NL Hold'em", buyIn: "$25,000", prize: "$320,000", placing: "5th", players: 200 },
      { year: 2023, location: "北塞浦路斯", eventName: "$50,000 PLO", buyIn: "$50,000", prize: "$180,000", placing: "8th", players: 145 },
    ],
    otherSeries: ["WSOP", "WPT", "EPT"],
    tags: ["NL Hold'em", "Short Deck", "Aggressive Style"]
  },
  {
    id: "christoph-vogelsang",
    name: "Christoph Vogelsang",
    country: "Germany",
    flag: "🇩🇪",
    nickname: "Tight-Man",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face",
    totalEarnings: "$28,000,000",
    titles: 2,
    cashes: 30,
    bestCash: "$6,000,000",
    bio: "Christoph Vogelsang 是德国高额扑克专家，以其稳健而精确的打法著称。他在 Triton 赛事中多次进入决赛桌，单场最高奖金超过 $6,000,000。",
    tritonResults: [
      { year: 2024, location: "蒙特卡洛", eventName: "$200,000 Triton Invitational", buyIn: "$200,000", prize: "$6,000,000", placing: "1st", players: 20 },
      { year: 2023, location: "蒙特卡洛", eventName: "$50,000 NL Hold'em", buyIn: "$50,000", prize: "$1,100,000", placing: "2nd", players: 98 },
      { year: 2022, location: "塞浦路斯", eventName: "$100,000 NL Hold'em", buyIn: "$100,000", prize: "$890,000", placing: "3rd", players: 65 },
    ],
    otherSeries: ["WSOP", "Super High Roller Bowl", "Poker Masters"],
    tags: ["NL Hold'em", "Short Deck", "High Roller"]
  },
  {
    id: "ken-hall",
    name: "Ken Hall",
    country: "USA",
    flag: "🇺🇸",
    nickname: "SmokeyJoe99",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop&crop=face",
    totalEarnings: "$15,000,000",
    titles: 3,
    cashes: 20,
    bestCash: "$4,800,000",
    bio: "Ken Hall 是一位业余扑克爱好者转型为高额赛事明星的典型代表。他在 Triton 系列赛中多次夺冠，是业余牌手在高额赛事中成功的典范。",
    tritonResults: [
      { year: 2023, location: "伦敦", eventName: "$30,000 Short Deck", buyIn: "$30,000", prize: "$870,000", placing: "1st", players: 150 },
      { year: 2022, location: "塞浦路斯", eventName: "$25,000 NL Hold'em", buyIn: "$25,000", prize: "$4,800,000", placing: "1st", players: 210 },
      { year: 2024, location: "伦敦", eventName: "$25,000 PLO", buyIn: "$25,000", prize: "$520,000", placing: "1st", players: 175 },
    ],
    otherSeries: ["WSOP", "WPT"],
    tags: ["NL Hold'em", "Short Deck", "PLO", "Amateur Success"]
  },
  {
    id: "matthias-eibinger",
    name: "Matthias Eibinger",
    country: "Austria",
    flag: "🇦🇹",
    nickname: "iamboss2",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&sat=-40",
    totalEarnings: "$22,000,000",
    titles: 5,
    cashes: 28,
    bestCash: "$3,800,000",
    bio: "Matthias Eibinger 是奥地利职业扑克选手，以多样化的游戏技巧著称，尤其擅长短牌扑克和奥马哈。他在 Triton 系列赛中拥有5个冠军头衔。",
    tritonResults: [
      { year: 2025, location: "济州", eventName: "$50,000 PLO", buyIn: "$50,000", prize: "$3,800,000", placing: "1st", players: 125 },
      { year: 2024, location: "蒙特卡洛", eventName: "$50,000 Short Deck", buyIn: "$50,000", prize: "$1,200,000", placing: "1st", players: 88 },
      { year: 2023, location: "北塞浦路斯", eventName: "$30,000 PLO", buyIn: "$30,000", prize: "$650,000", placing: "1st", players: 180 },
      { year: 2023, location: "伦敦", eventName: "$25,000 NL Hold'em", buyIn: "$25,000", prize: "$440,000", placing: "2nd", players: 190 },
    ],
    otherSeries: ["WSOP", "EPT", "WCOOP"],
    tags: ["PLO", "Short Deck", "NL Hold'em"]
  },
  {
    id: "danny-tang",
    name: "Danny Tang",
    country: "Hong Kong",
    flag: "🇭🇰",
    nickname: "DannyTangPoker",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&sat=-60",
    totalEarnings: "$14,000,000",
    titles: 5,
    cashes: 35,
    bestCash: "$2,700,000",
    bio: "Danny Tang 是香港职业扑克选手，Triton系列赛五冠王。他在2024年获Ivan Leow年度最佳玩家称号，奖励$200,000。他以极强的比赛适应能力和稳定发挥著称，在Triton越南、北塞浦路斯、伦敦、蒙特卡洛等地均有夺冠纪录。",
    tritonResults: [
      { year: 2024, location: "伦敦", eventName: "$50,000 NL Hold'em", buyIn: "$50,000", prize: "$2,700,000", placing: "1st", players: 105 },
      { year: 2023, location: "北塞浦路斯", eventName: "$25,000 NL Hold'em", buyIn: "$25,000", prize: "$560,000", placing: "1st", players: 220 },
      { year: 2023, location: "北塞浦路斯", eventName: "$50,000 NL Hold'em", buyIn: "$50,000", prize: "$1,200,000", placing: "1st", players: 130 },
      { year: 2023, location: "伦敦", eventName: "$60,000 NL Hold'em Turbo", buyIn: "$60,000", prize: "$480,000", placing: "3rd", players: 95 },
      { year: 2023, location: "蒙特卡洛", eventName: "$50,000 NL Hold'em", buyIn: "$50,000", prize: "$574,000", placing: "1st", players: 130 },
      { year: 2022, location: "马德里", eventName: "€25,000 NL Hold'em", buyIn: "€25,000", prize: "€320,000", placing: "5th", players: 155 },
    ],
    otherSeries: ["WSOP", "WPT", "UK Poker Championships"],
    tags: ["NL Hold'em", "Short Deck", "Five-Time Champion", "Player of the Year 2024"]
  },
  {
    id: "sam-soverel",
    name: "Sam Soverel",
    country: "USA",
    flag: "🇺🇸",
    nickname: "Str8$$$Homey",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face&sat=-30",
    totalEarnings: "$18,000,000",
    titles: 3,
    cashes: 26,
    bestCash: "$2,200,000",
    bio: "Sam Soverel 是美国职业扑克选手，擅长高额锦标赛。他在 Triton 系列赛中拥有3个冠军头衔，以稳定的发挥和优秀的比赛结构理解著称。",
    tritonResults: [
      { year: 2023, location: "越南", eventName: "$25,000 NL Hold'em", buyIn: "$25,000", prize: "$2,200,000", placing: "1st", players: 205 },
      { year: 2022, location: "塞浦路斯", eventName: "$30,000 NL Hold'em", buyIn: "$30,000", prize: "$870,000", placing: "1st", players: 160 },
      { year: 2024, location: "蒙特卡洛", eventName: "$50,000 PLO", buyIn: "$50,000", prize: "$690,000", placing: "2nd", players: 120 },
    ],
    otherSeries: ["WSOP", "WPT", "Borgata Poker Open"],
    tags: ["NL Hold'em", "PLO", "Structure Expert"]
  },
  {
    id: "cary-katz",
    name: "Cary Katz",
    country: "USA",
    flag: "🇺🇸",
    nickname: "Poker Philanthropist",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face&sat=-50",
    totalEarnings: "$35,000,000",
    titles: 2,
    cashes: 48,
    bestCash: "$4,100,000",
    bio: "Cary Katz 是 PokerGO 创始人，同时也是一位资深高额扑克选手。他是 Triton 系列赛的常客，在全球各大高额赛事中都有出色表现。",
    tritonResults: [
      { year: 2024, location: "蒙特卡洛", eventName: "$100,000 NL Hold'em", buyIn: "$100,000", prize: "$4,100,000", placing: "1st", players: 55 },
      { year: 2023, location: "伦敦", eventName: "$100,000 NL Hold'em", buyIn: "$100,000", prize: "$1,800,000", placing: "1st", players: 60 },
      { year: 2023, location: "北塞浦路斯", eventName: "$50,000 NL Hold'em", buyIn: "$50,000", prize: "$450,000", placing: "7th", players: 130 },
    ],
    otherSeries: ["WSOP", "Super High Roller Bowl", "Poker Masters", "US Poker Open"],
    tags: ["NL Hold'em", "PLO", "Business Owner"]
  },
  {
    id: "chris-moneymaker",
    name: "Chris Moneymaker",
    country: "USA",
    flag: "🇺🇸",
    nickname: "Moneymaker",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&sat=-80",
    totalEarnings: "$6,500,000",
    titles: 0,
    cashes: 8,
    bestCash: "$520,000",
    bio: "Chris Moneymaker 是2003年WSOP主赛事冠军，被誉为扑克革命的推手。他在 Triton 系列赛中虽未夺冠，但作为传奇人物仍然是赛事常客。",
    tritonResults: [
      { year: 2023, location: "伦敦", eventName: "$25,000 NL Hold'em", buyIn: "$25,000", prize: "$520,000", placing: "3rd", players: 195 },
      { year: 2024, location: "蒙特卡洛", eventName: "$25,000 NL Hold'em", buyIn: "$25,000", prize: "$180,000", placing: "12th", players: 200 },
      { year: 2022, location: "塞浦路斯", eventName: "$25,000 NL Hold'em", buyIn: "$25,000", prize: "$0", placing: "35th", players: 210 },
    ],
    otherSeries: ["WSOP Champion 2003", "WSOP", "WPT", "PokerStars"],
    tags: ["NL Hold'em", "WSOP Legend", "Poker Boom"]
  },
  {
    id: "phil-nagel",
    name: "Phil Nagel",
    country: "Austria",
    flag: "🇦🇹",
    nickname: "-",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face&sat=-60",
    totalEarnings: "$12,000,000",
    titles: 2,
    cashes: 18,
    bestCash: "$2,400,000",
    bio: "Phil Nagel 是奥地利职业扑克选手，以短牌扑克和奥马哈的深厚造诣著称。他在 Triton 系列赛中拥有2个冠军头衔。",
    tritonResults: [
      { year: 2023, location: "伦敦", eventName: "$50,000 Short Deck", buyIn: "$50,000", prize: "$2,400,000", placing: "1st", players: 88 },
      { year: 2022, location: "马德里", eventName: "€30,000 Short Deck", buyIn: "€30,000", prize: "€680,000", placing: "1st", players: 92 },
      { year: 2024, location: "蒙特卡洛", eventName: "$50,000 PLO", buyIn: "$50,000", prize: "$340,000", placing: "6th", players: 120 },
    ],
    otherSeries: ["WSOP", "EPT"],
    tags: ["Short Deck", "PLO", "Mixed Games"]
  },
  {
    id: "mikita-badziakouski",
    name: "Mikita Badziakouski",
    country: "Belarus",
    flag: "🇧🇾",
    nickname: "fish2013",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face&sat=-70",
    totalEarnings: "$48,000,000",
    titles: 4,
    cashes: 40,
    bestCash: "$5,600,000",
    bio: "Mikita Badziakouski 是白俄罗斯职业扑克选手，被认为是世界上最好的混合游戏和短牌扑克选手之一。他在 Triton 系列赛中拥有4个冠军头衔，总奖金接近 $48,000,000。",
    tritonResults: [
      { year: 2024, location: "蒙特卡洛", eventName: "$100,000 NL Hold'em", buyIn: "$100,000", prize: "$5,600,000", placing: "1st", players: 55 },
      { year: 2023, location: "北塞浦路斯", eventName: "$50,000 Short Deck", buyIn: "$50,000", prize: "$1,900,000", placing: "1st", players: 95 },
      { year: 2022, location: "塞浦路斯", eventName: "$50,000 NL Hold'em", buyIn: "$50,000", prize: "$1,350,000", placing: "1st", players: 110 },
      { year: 2022, location: "伦敦", eventName: "$30,000 PLO", buyIn: "$30,000", prize: "$780,000", placing: "2nd", players: 165 },
    ],
    otherSeries: ["WSOP", "EPT", "PokerStars Championship"],
    tags: ["Short Deck", "PLO", "Mixed Games", "High Roller"]
  },
  {
    id: "bryn-kenney",
    name: "Bryn Kenney",
    country: "USA",
    flag: "🇺🇸",
    nickname: "BrynKenney",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&sat=-80",
    totalEarnings: "$75,700,000",
    titles: 3,
    cashes: 35,
    bestCash: "$20,500,000",
    bio: "Bryn Kenney 是扑克史上奖金最高的选手，总奖金超过 $75,700,000（截至2025年济州站）。2019年他在 Triton 伦敦站赢得了创纪录的 $20,500,000 奖金。2025年济州站春季赛中，他在 $150K 豪客赛亚军、$50K 赏金赛夺冠、总奖金超过 $2.7M。",
    tritonResults: [
      { year: 2019, location: "伦敦", eventName: "£1,050,000 NL Hold'em Big Buy-in", buyIn: "£1,050,000", prize: "$20,500,000", placing: "1st", players: 54 },
      { year: 2025, location: "济州", eventName: "$150,000 NL Hold'em 8-Max", buyIn: "$150,000", prize: "$3,200,000", placing: "2nd", players: 128 },
      { year: 2025, location: "济州", eventName: "$50,000 NL Hold'em Turbo Bounty Quattro", buyIn: "$35,000+$15,000", prize: "$839,000", placing: "1st", players: 94 },
      { year: 2025, location: "济州", eventName: "$25,000 NL Hold'em（可重购）", buyIn: "$25,000", prize: "$980,000", placing: "3rd", players: 391 },
      { year: 2023, location: "蒙特卡洛", eventName: "$50,000 NL Hold'em", buyIn: "$50,000", prize: "$1,600,000", placing: "2nd", players: 98 },
      { year: 2022, location: "塞浦路斯", eventName: "$50,000 Short Deck", buyIn: "$50,000", prize: "$1,200,000", placing: "1st", players: 100 },
      { year: 2024, location: "蒙特卡洛", eventName: "$75,000 NL Hold'em", buyIn: "$75,000", prize: "$1,800,000", placing: "1st", players: 72 },
    ],
    otherSeries: ["WSOP", "WPT", "Super High Roller Bowl", "Poker Masters"],
    tags: ["NL Hold'em", "Short Deck", "All-Time Money Leader"]
  },
  {
    id: "wen-huang",
    name: "黄文杰 (Wen Huang)",
    country: "China",
    flag: "🇨🇳",
    nickname: "AI Poker Pro",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&sat=-30",
    totalEarnings: "$5,555,000",
    titles: 1,
    cashes: 2,
    bestCash: "$5,555,000",
    bio: "黄文杰是一位AI人工智能工程师，这是他首次参加线下扑克赛事。在2025年传奇扑克济州站$100K主赛事中，他以第3位记分（10,850,000）进入9人决赛桌，最终仅用5手牌击败两届冠军Dan Cates夺冠，赢得$5,555,000。2024年9月他还获得WSOP线上金手链（$10K线上单挑冠军赛）。",
    tritonResults: [
      { year: 2025, location: "济州", eventName: "$100,000 NL Hold'em Main Event", buyIn: "$100,000", prize: "$5,555,000", placing: "1st", players: 285 },
    ],
    otherSeries: ["WSOP Online Bracelet 2024"],
    tags: ["NL Hold'em", "Rising Star", "AI Background"]
  },
  {
    id: "joao-vieira",
    name: "João Vieira",
    country: "Portugal",
    flag: "🇵🇹",
    nickname: "Naza114",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face&sat=-40",
    totalEarnings: "$8,500,000",
    titles: 1,
    cashes: 12,
    bestCash: "$4,610,000",
    bio: "João Vieira 是葡萄牙职业扑克选手，在2025年Triton济州站春季赛中表现出色。他在$150,000豪客赛中击败Jason Koon、Bryn Kenney等顶尖选手夺冠，赢得$4,610,000，这是他的Triton首冠也是生涯最大一笔奖金。",
    tritonResults: [
      { year: 2025, location: "济州", eventName: "$150,000 NL Hold'em 8-Max", buyIn: "$150,000", prize: "$4,610,000", placing: "1st", players: 128 },
    ],
    otherSeries: ["WSOP", "EPT"],
    tags: ["NL Hold'em", "High Roller"]
  },
  {
    id: "mario-mosbock",
    name: "Mario Mosböck",
    country: "Austria",
    flag: "🇦🇹",
    nickname: "-",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&sat=-50",
    totalEarnings: "$12,000,000",
    titles: 3,
    cashes: 25,
    bestCash: "$1,836,570",
    bio: "Mario Mosböck 是奥地利职业扑克选手，以稳健的打法著称。他在2024年济州站$25K NLH中创下了当时系列赛最高参赛纪录（305人次）夺冠。2025年济州站春季赛中，他在$50K NL Hold'em 7-Max中再次夺冠，赢得$1,836,570。",
    tritonResults: [
      { year: 2025, location: "济州", eventName: "$50,000 NL Hold'em 7-Max", buyIn: "$50,000", prize: "$1,836,570", placing: "1st", players: 215 },
      { year: 2024, location: "济州", eventName: "$25,000 NL Hold'em", buyIn: "$25,000", prize: "$1,190,000", placing: "1st", players: 305 },
    ],
    otherSeries: ["WSOP", "EPT", "WCOOP"],
    tags: ["NL Hold'em", "Steady Performer"]
  },
  {
    id: "punnat-punsri",
    name: "Punnat Punsri",
    country: "Thailand",
    flag: "🇹🇭",
    nickname: "-",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&sat=-70",
    totalEarnings: "$10,900,000",
    titles: 5,
    cashes: 25,
    bestCash: "$2,594,555",
    bio: "Punnat Punsri 是泰国职业扑克选手，Triton系列赛五冠王，2025年GPI年度最佳球员（第1名）。他在2025年济州站表现极为出色，在$125K NL Hold'em中夺冠赢得$2,594,555。2024-2025年间他连续在济州、黑山、塞浦路斯夺冠，2025全年总奖金$10.9M。",
    tritonResults: [
      { year: 2025, location: "济州（九月）", eventName: "$50,000 NL Hold'em 7-Max", buyIn: "$50,000", prize: "$2,130,812", placing: "1st", players: 146 },
      { year: 2025, location: "济州（春季）", eventName: "$125,000 NL Hold'em 7-Max", buyIn: "$125,000", prize: "$2,594,555", placing: "1st", players: 93 },
      { year: 2025, location: "黑山", eventName: "$25,000 PLO 6-Max", buyIn: "$25,000", prize: "$525,000", placing: "1st", players: 84 },
      { year: 2024, location: "济州", eventName: "$50,000 NL Hold'em", buyIn: "$50,000", prize: "$880,000", placing: "1st", players: 215 },
      { year: 2022, location: "塞浦路斯", eventName: "$30,000 NL Hold'em", buyIn: "$30,000", prize: "$620,000", placing: "1st", players: 165 },
    ],
    otherSeries: ["WSOP", "APPT", "WPT"],
    tags: ["NL Hold'em", "PLO", "Five-Time Champion", "GPI POY 2025"]
  },
  {
    id: "jesse-lonis",
    name: "Jesse Lonis",
    country: "USA",
    flag: "🇺🇸",
    nickname: "-",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face&sat=-40",
    totalEarnings: "$13,300,000",
    titles: 3,
    cashes: 20,
    bestCash: "$3,400,000",
    bio: "Jesse Lonis 是美国职业扑克选手，2025年GPI年度最佳球员第2名，2025年总奖金榜第1名（$13.3M）。他在Triton黑山站双冠（$40K神秘赏金+$100K主赛事），并在济州九月站多次进入决赛桌。2025年爆发式表现让他成为全球最受瞩目的选手之一。",
    tritonResults: [
      { year: 2025, location: "黑山", eventName: "$100,000 NL Hold'em Main Event", buyIn: "$100,000", prize: "$3,400,000", placing: "1st", players: 180 },
      { year: 2025, location: "黑山", eventName: "$40,000 NL Hold'em Mystery Bounty", buyIn: "$40,000", prize: "$1,030,000", placing: "1st", players: 169 },
      { year: 2025, location: "济州（九月）", eventName: "$100,000 NL Hold'em Main Event", buyIn: "$100,000", prize: "$2,900,000", placing: "2nd", players: 228 },
      { year: 2025, location: "济州（九月）", eventName: "$30,000 NL Hold'em 8-Max", buyIn: "$30,000", prize: "$780,000", placing: "2nd", players: 183 },
    ],
    otherSeries: ["WSOP", "WPT"],
    tags: ["NL Hold'em", "GPI POY #2 2025", "Money Leader 2025"]
  },
  {
    id: "kayhan-mokri",
    name: "Kayhan Mokri",
    country: "Norway",
    flag: "🇳🇴",
    nickname: "-",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face&sat=-20",
    totalEarnings: "$13,200,000",
    titles: 2,
    cashes: 18,
    bestCash: "$3,800,000",
    bio: "Kayhan Mokri 是挪威职业扑克选手，2025年总奖金榜第2名（$13.2M）。他在Triton济州九月站$150K NL Hold'em中夺冠赢得$3.8M，并在多场赛事中进入决赛桌。挪威选手在Triton赛场上的突出表现让他成为北欧扑克的代表人物。",
    tritonResults: [
      { year: 2025, location: "济州（九月）", eventName: "$150,000 NL Hold'em 8-Max", buyIn: "$150,000", prize: "$3,800,000", placing: "1st", players: 114 },
      { year: 2025, location: "济州（九月）", eventName: "$30,000 NL Hold'em 8-Max", buyIn: "$30,000", prize: "$520,000", placing: "3rd", players: 183 },
    ],
    otherSeries: ["WSOP", "EPT"],
    tags: ["NL Hold'em", "Money Leader #2 2025"]
  },
  {
    id: "seth-davies",
    name: "Seth Davies",
    country: "USA",
    flag: "🇺🇸",
    nickname: "-",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&sat=-50",
    totalEarnings: "$12,300,000",
    titles: 1,
    cashes: 20,
    bestCash: "$1,500,000",
    bio: "Seth Davies 是美国职业扑克选手，2025年总奖金榜第4名（$12.3M），GPI排名前5。他在Triton黑山站赢得首个Triton冠军（$50K NL Hold'em），并多次在决赛桌亮相。多年努力后终于迎来突破。",
    tritonResults: [
      { year: 2025, location: "黑山", eventName: "$50,000 NL Hold'em 8-Max", buyIn: "$50,000", prize: "$1,500,000", placing: "1st", players: 143 },
      { year: 2025, location: "济州（九月）", eventName: "$100,000 NL Hold'em Main Event", buyIn: "$100,000", prize: "$2,100,000", placing: "3rd", players: 228 },
      { year: 2025, location: "黑山", eventName: "$30,000 PLO Bounty Quattro Turbo", buyIn: "$30,000", prize: "$270,000", placing: "2nd", players: 51 },
    ],
    otherSeries: ["WSOP", "WPT", "Poker Masters"],
    tags: ["NL Hold'em", "GPI Top 5 2025"]
  },
  {
    id: "artur-martirosian",
    name: "Artur Martirosian",
    country: "Russia",
    flag: "🇷🇺",
    nickname: "-",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&sat=-60",
    totalEarnings: "$11,000,000",
    titles: 2,
    cashes: 22,
    bestCash: "$2,650,000",
    bio: "Artur Martirosian 是俄罗斯职业扑克选手，2025年GPI年度第3名，总奖金榜第10名（$11M）。他在Triton系列赛中表现出色，济州春季站主赛事获得第3名，济州九月站赢得$25K PLO冠军和$100K PLO亚军。",
    tritonResults: [
      { year: 2025, location: "济州（九月）", eventName: "$25,000 PLO", buyIn: "$25,000", prize: "$421,000", placing: "1st", players: 60 },
      { year: 2025, location: "济州（春季）", eventName: "$100,000 NL Hold'em Main Event", buyIn: "$100,000", prize: "$2,650,000", placing: "3rd", players: 285 },
    ],
    otherSeries: ["WSOP", "EPT", "WCOOP"],
    tags: ["NL Hold'em", "PLO", "GPI POY #3 2025"]
  },
  {
    id: "aleksa-pavicevic",
    name: "Aleksa Pavicevic",
    country: "Montenegro",
    flag: "🇲🇪",
    nickname: "Home Hero",
    image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop&crop=face&sat=-30",
    totalEarnings: "$7,400,000",
    titles: 2,
    cashes: 8,
    bestCash: "$5,320,000",
    bio: "Aleksa Pavicevic 是黑山商人兼业余扑克选手，在2025年Triton黑山站主场作战中创造历史。他在$200K邀请赛中最后时刻决定参赛并夺冠，赢得$5.32M。此后在济州九月站$50K赏金极速赛再次夺冠。",
    tritonResults: [
      { year: 2025, location: "黑山", eventName: "$200,000 Triton Invitational", buyIn: "$200,000", prize: "$5,320,000", placing: "1st", players: 133 },
      { year: 2025, location: "济州（九月）", eventName: "$50,000 NL Hold'em Bounty Turbo", buyIn: "$50,000", prize: "$1,300,000", placing: "1st", players: 87 },
    ],
    otherSeries: [],
    tags: ["NL Hold'em", "Home Hero", "Invitational Champion"]
  },
  {
    id: "xuan-liu",
    name: "Xuan Liu",
    country: "Canada",
    flag: "🇨🇦",
    nickname: "-",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face&sat=-40",
    totalEarnings: "$5,500,000",
    titles: 1,
    cashes: 15,
    bestCash: "$775,000",
    bio: "Xuan Liu 是加拿大华裔女牌手，Triton历史上首位女子冠军。她在2025年Triton黑山站Event #1 $25K NLH WPT Global Slam中夺冠，创造了历史。同时Kristen Foxen在同一场赛事进入决赛桌。",
    tritonResults: [
      { year: 2025, location: "黑山", eventName: "$25,000 NLH WPT Global Slam", buyIn: "$25,000", prize: "$775,000", placing: "1st", players: 155 },
    ],
    otherSeries: ["WSOP", "WPT"],
    tags: ["NL Hold'em", "First Female Champion"]
  },
  {
    id: "aleks-ponakovs",
    name: "Aleks Ponakovs",
    country: "Latvia",
    flag: "🇱🇻",
    nickname: "-",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face&sat=-50",
    totalEarnings: "$11,800,000",
    titles: 1,
    cashes: 18,
    bestCash: "$3,200,000",
    bio: "Aleks Ponakovs 是拉脱维亚职业扑克选手，2025年总奖金榜第6名（$11.8M）。他与兄弟兄弟在Triton系列赛中持续亮相，是拉脱维亚最成功的扑克选手之一。",
    tritonResults: [
      { year: 2025, location: "济州（九月）", eventName: "$40,000 NL Hold'em Mystery Bounty", buyIn: "$40,000", prize: "$720,000", placing: "3rd", players: 158 },
      { year: 2025, location: "黑山", eventName: "$50,000 NL Hold'em Bounty Turbo", buyIn: "$50,000", prize: "$450,000", placing: "2nd", players: 51 },
    ],
    otherSeries: ["WSOP", "EPT"],
    tags: ["NL Hold'em", "Money Leader #6 2025"]
  },
  {
    id: "ben-tollerene",
    name: "Ben Tollerene",
    country: "USA",
    flag: "🇺🇸",
    nickname: "Ben86",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face&sat=-30",
    totalEarnings: "$12,000,000",
    titles: 2,
    cashes: 20,
    bestCash: "$2,325,000",
    bio: "Ben Tollerene (Ben86) 是美国职业扑克选手，2025年总奖金榜第5名（$12M）。他在Triton黑山站赢得$100K PLO主赛事（击败Laszlo Bujtas），并在$150K NL Hold'em中获得第2名。线上扑克传奇转型现场赛事的典范。",
    tritonResults: [
      { year: 2025, location: "黑山", eventName: "$100,000 PLO Main Event", buyIn: "$100,000", prize: "$2,325,000", placing: "1st", players: 93 },
      { year: 2025, location: "黑山", eventName: "$150,000 NL Hold'em 8-Max", buyIn: "$150,000", prize: "$2,200,000", placing: "2nd", players: 108 },
      { year: 2025, location: "济州（九月）", eventName: "$50,000 NL Hold'em 7-Max", buyIn: "$50,000", prize: "$980,000", placing: "3rd", players: 146 },
    ],
    otherSeries: ["WSOP", "PokerStars"],
    tags: ["NL Hold'em", "PLO", "Money Leader #5 2025"]
  },
  {
    id: "christoph-vogelsang",
    name: "Christoph Vogelsang",
    country: "Germany",
    flag: "🇩🇪",
    nickname: "-",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&sat=-60",
    totalEarnings: "$15,000,000",
    titles: 2,
    cashes: 30,
    bestCash: "$4,100,000",
    bio: "Christoph Vogelsang 是德国职业扑克选手，GPI排名前10。他在Triton济州九月站$100K NLH主赛事中夺冠赢得$4.1M，并在蒙特卡洛2023年$100K NLH中夺冠$2.64M。他是Triton系列赛历史上奖金最高的德国选手之一。",
    tritonResults: [
      { year: 2025, location: "济州（九月）", eventName: "$100,000 NL Hold'em Main Event", buyIn: "$100,000", prize: "$4,100,000", placing: "1st", players: 228 },
      { year: 2023, location: "蒙特卡洛", eventName: "$100,000 NL Hold'em 8-Max", buyIn: "$100,000", prize: "$2,644,000", placing: "1st", players: 120 },
    ],
    otherSeries: ["WSOP", "Super High Roller Bowl"],
    tags: ["NL Hold'em", "Main Event Champion"]
  },
  {
    id: "dan-smith",
    name: "Dan Smith",
    country: "USA",
    flag: "🇺🇸",
    nickname: "-",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face&sat=-30",
    totalEarnings: "$42,000,000",
    titles: 2,
    cashes: 35,
    bestCash: "$3,870,000",
    bio: "Dan Smith 是美国传奇职业扑克选手，历史总奖金超过$42M，长期位居全球奖金榜前5。他在Triton蒙特卡洛2023年$200K邀请赛中夺冠赢得$3.87M。他是当今扑克界最受尊敬的选手之一。",
    tritonResults: [
      { year: 2023, location: "蒙特卡洛", eventName: "$200,000 Triton Invitational", buyIn: "$200,000", prize: "$3,870,000", placing: "1st", players: 73 },
      { year: 2025, location: "济州（九月）", eventName: "$200,000 Short Deck", buyIn: "$200,000", prize: "$2,300,000", placing: "2nd", players: 61 },
    ],
    otherSeries: ["WSOP", "EPT", "Super High Roller Bowl", "Poker Masters"],
    tags: ["NL Hold'em", "Short Deck", "All-Time Great"]
  },
  {
    id: "nacho-barbero",
    name: "Ignacio 'Nacho' Barbero",
    country: "Argentina",
    flag: "🇦🇷",
    nickname: "Nacho",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face&sat=-60",
    totalEarnings: "$8,500,000",
    titles: 3,
    cashes: 28,
    bestCash: "$1,025,000",
    bio: "Nacho Barbero 是阿根廷职业扑克选手，2025年GPI年度第8名。他在Triton系列赛中三度夺冠，分别在黑山$30K NLH、济州九月站$30K混合赛、蒙特卡洛$100K NLH获得高名次。阿根廷扑克的代表人物。",
    tritonResults: [
      { year: 2025, location: "黑山", eventName: "$30,000 NL Hold'em 8-Max", buyIn: "$30,000", prize: "$1,025,000", placing: "1st", players: 147 },
      { year: 2025, location: "济州（九月）", eventName: "$30,000 PLO/NLH Mixed", buyIn: "$30,000", prize: "$646,000", placing: "1st", players: 81 },
      { year: 2025, location: "济州（九月）", eventName: "$50,000 NL Hold'em Bounty Turbo", buyIn: "$50,000", prize: "$880,000", placing: "2nd", players: 87 },
    ],
    otherSeries: ["WSOP", "LAPT"],
    tags: ["NL Hold'em", "PLO", "GPI Top 10 2025"]
  },
  {
    id: "quan-zhou",
    name: "周全 (Quan Zhou)",
    country: "China",
    flag: "🇨🇳",
    nickname: "-",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&sat=-40",
    totalEarnings: "$5,000,000",
    titles: 1,
    cashes: 15,
    bestCash: "$1,165,000",
    bio: "周全是中国职业扑克选手，2025年GPI年度第7名。他在Triton蒙特卡洛2023年$125K主赛事获得第5名，并多次在$100K级别赛事中进入决赛桌。是中国大陆选手中GPI排名最高的一位。",
    tritonResults: [
      { year: 2023, location: "蒙特卡洛", eventName: "$125,000 NLH Main Event", buyIn: "$125,000", prize: "$1,165,000", placing: "5th", players: 135 },
      { year: 2025, location: "黑山", eventName: "$40,000 NL Hold'em Mystery Bounty", buyIn: "$40,000", prize: "$550,000", placing: "3rd", players: 169 },
    ],
    otherSeries: ["WSOP", "APPT"],
    tags: ["NL Hold'em", "PLO", "GPI Top 10 2025"]
  },
];

export const TOURNAMENTS: Tournament[] = [
  {
    id: "triton-montenegro-2026",
    name: "Triton Montenegro S5 2026",
    year: 2026,
    location: "黑山布德瓦",
    startDate: "2026-05-13",
    endDate: "2026-05-28",
    events: 16,
    totalPrizePool: "待公布",
    winner: "即将开赛",
    imageUrl: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=600&h=300&fit=crop",
    description: "Triton 黑山第五站将在 Maestral Resort & Casino 举办，包含 $150,000 主赛事、短牌三重奏及 $50,000 PLO 神秘赏金赛等 16 场赛事。",
    venue: "Maestral Resort & Casino",
    gpiNote: "赛事数据将同步至 GPI 全球扑克指数排名系统",
    eventList: [
      { id: "mn26-1", name: "Event #1: $30,000 NL Hold'em 8-Max", gameType: "NL Hold'em", buyIn: "$30,000", entries: 0, prizePool: "待公布", date: "2026-05-13", status: "upcoming", results: [] },
      { id: "mn26-2", name: "Event #2: $50,000 PLO 6-Max", gameType: "PLO", buyIn: "$50,000", entries: 0, prizePool: "待公布", date: "2026-05-14", status: "upcoming", results: [] },
      { id: "mn26-3", name: "Event #3: $30,000 Short Deck", gameType: "Short Deck", buyIn: "$30,000", entries: 0, prizePool: "待公布", date: "2026-05-15", status: "upcoming", results: [] },
      { id: "mn26-main", name: "Main Event: $150,000 NL Hold'em", gameType: "NL Hold'em", buyIn: "$150,000", entries: 0, prizePool: "待公布", date: "2026-05-22", status: "upcoming", results: [] },
      { id: "mn26-inv", name: "$200,000 Triton Invitational", gameType: "Short Deck", buyIn: "$200,000", entries: 0, prizePool: "待公布", date: "2026-05-26", status: "upcoming", results: [] },
    ],
  },
  {
    id: "triton-shr-jeju-2026",
    name: "Triton SHR Jeju 2025 九月站",
    year: 2025,
    location: "韩国济州",
    startDate: "2025-09-14",
    endDate: "2025-10-01",
    events: 20,
    totalPrizePool: "$90,000,000+",
    winner: "Jason Koon",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=300&fit=crop",
    description: "Triton超级豪客系列赛济州站九月站，在Landing Casino举办，20场顶级赛事涵盖NL Hold'em、PLO和短牌扑克。赛事以好莱坞式结局收官，Mike Watson在NLH阶段以河牌最佳手牌夺冠。数据来源：传奇扑克官网 legendpoker.cn 及 TritonPokerSeries.com",
    venue: "Landing Casino · 济州神话世界度假村",
    highlights: "Jason Koon 继续统治级表现；20场赛事覆盖NLH/PLO/Short Deck三大项目；Punnat Punsri、Danny Tang等亚洲选手持续亮眼；Christoph Vogelsang、Stephen Chidwick等高频进入决赛桌；总奖金池超$90M",
    gpiNote: "赛事成绩已同步至 GPI 全球扑克指数排名系统（TheHendonMob.com）",
    eventList: [
      // 数据来源：TritonPokerSeries.com 官网 + GPI 全球扑克指数 2025
      { id: "shr25-e1", name: "Event #1: $25,000 WPT Global Slam", gameType: "NL Hold'em", buyIn: "$25,000", entries: 311, prizePool: "$7,775,000", date: "2025-09-14", status: "completed", results: [
        { placing: "1st", playerName: "James Mendoza", prize: "$1,515,000", country: "USA", flag: "🇺🇸", gpiRanking: 120 },
        { placing: "2nd", playerName: "Stephen Chidwick", playerId: "stephen-chidwick", prize: "$1,120,000", country: "UK", flag: "🇬🇧", gpiRanking: 3 },
        { placing: "3rd", playerName: "Artur Martirosian", prize: "$780,000", country: "Russia", flag: "🇷🇺", gpiRanking: 3 },
        { placing: "4th", playerName: "Quan Zhou", prize: "$560,000", country: "China", flag: "🇨🇳", gpiRanking: 7 },
        { placing: "5th", playerName: "Danny Tang", playerId: "danny-tang", prize: "$420,000", country: "Hong Kong", flag: "🇭🇰", gpiRanking: 4 },
      ]},
      { id: "shr25-e2", name: "Event #2: $30,000 NL Hold'em 8-Max", gameType: "NL Hold'em", buyIn: "$30,000", entries: 183, prizePool: "$5,490,000", date: "2025-09-15", status: "completed", results: [
        { placing: "1st", playerName: "Jonathan Jaffe", prize: "$1,061,672", country: "USA", flag: "🇺🇸", gpiRanking: 38 },
        { placing: "2nd", playerName: "Jesse Lonis", prize: "$780,000", country: "USA", flag: "🇺🇸", gpiRanking: 2 },
        { placing: "3rd", playerName: "Kayhan Mokri", prize: "$520,000", country: "Norway", flag: "🇳🇴", gpiRanking: 2 },
      ]},
      { id: "shr25-e3", name: "Event #3: $40,000 NL Hold'em 7-Max 神秘赏金赛", gameType: "NL Hold'em", buyIn: "$40,000", entries: 158, prizePool: "$6,320,000", date: "2025-09-16", status: "completed", results: [
        { placing: "1st", playerName: "Jun Obara", prize: "$1,700,000", country: "Japan", flag: "🇯🇵", gpiRanking: 95 },
        { placing: "2nd", playerName: "Brandon Wilson", prize: "$980,000", country: "USA", flag: "🇺🇸", gpiRanking: 5 },
        { placing: "3rd", playerName: "Aleks Ponakovs", prize: "$720,000", country: "Latvia", flag: "🇱🇻", gpiRanking: 6 },
      ]},
      { id: "shr25-e5", name: "Event #5: $60,000 NL Hold'em 8-Max", gameType: "NL Hold'em", buyIn: "$60,000", entries: 146, prizePool: "$9,240,000", date: "2025-09-18", status: "completed", results: [
        { placing: "1st", playerName: "Peter Wang", prize: "$2,046,000", country: "USA", flag: "🇺🇸", gpiRanking: 55 },
        { placing: "2nd", playerName: "Bryn Kenney", playerId: "bryn-kenney", prize: "$1,450,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "3rd", playerName: "Seth Davies", prize: "$980,000", country: "USA", flag: "🇺🇸", gpiRanking: 4 },
      ]},
      { id: "shr25-e6", name: "Event #6: $50,000 NL Hold'em 7-Max", gameType: "NL Hold'em", buyIn: "$50,000", entries: 146, prizePool: "$7,300,000", date: "2025-09-19", status: "completed", results: [
        { placing: "1st", playerName: "Punnat Punsri", prize: "$2,130,812", country: "Thailand", flag: "🇹🇭", gpiRanking: 1 },
        { placing: "2nd", playerName: "Isaac Haxton", playerId: "isaac-haxton", prize: "$1,350,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "3rd", playerName: "Ben Tollerene", prize: "$980,000", country: "USA", flag: "🇺🇸", gpiRanking: 5 },
      ]},
      { id: "shr25-e7", name: "Event #7: $150,000 NL Hold'em 8-Max", gameType: "NL Hold'em", buyIn: "$150,000", entries: 114, prizePool: "$17,100,000", date: "2025-09-20", status: "completed", results: [
        { placing: "1st", playerName: "Kayhan Mokri", prize: "$3,800,000", country: "Norway", flag: "🇳🇴", gpiRanking: 2 },
        { placing: "2nd", playerName: "Jason Koon", playerId: "jason-koon", prize: "$2,600,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "3rd", playerName: "Daniel Negreanu", playerId: "daniel-negreanu", prize: "$1,850,000", country: "Canada", flag: "🇨🇦", gpiRanking: 3 },
        { placing: "4th", playerName: "Stephen Chidwick", playerId: "stephen-chidwick", prize: "$1,200,000", country: "UK", flag: "🇬🇧", gpiRanking: 3 },
        { placing: "5th", playerName: "Alex Foxen", prize: "$850,000", country: "USA", flag: "🇺🇸", gpiRanking: 4 },
      ]},
      { id: "shr25-e8", name: "Event #8: $50,000 NL Hold'em 赏金极速赛", gameType: "NL Hold'em", buyIn: "$50,000", entries: 87, prizePool: "$4,350,000", date: "2025-09-21", status: "completed", results: [
        { placing: "1st", playerName: "Aleksa Pavicevic", prize: "$1,300,000", country: "Montenegro", flag: "🇲🇪", gpiRanking: 180 },
        { placing: "2nd", playerName: "Nacho Barbero", prize: "$880,000", country: "Argentina", flag: "🇦🇷", gpiRanking: 8 },
        { placing: "3rd", playerName: "Matthias Eibinger", playerId: "matthias-eibinger", prize: "$620,000", country: "Austria", flag: "🇦🇹", gpiRanking: 6 },
      ]},
      { id: "shr25-e9", name: "Event #9: $100,000 NL Hold'em 主赛事", gameType: "NL Hold'em", buyIn: "$100,000", entries: 228, prizePool: "$22,800,000", date: "2025-09-22", status: "completed", results: [
        { placing: "1st", playerName: "Christoph Vogelsang", playerId: "christoph-vogelsang", prize: "$4,100,000", country: "Germany", flag: "🇩🇪", gpiRanking: 8 },
        { placing: "2nd", playerName: "Jesse Lonis", prize: "$2,900,000", country: "USA", flag: "🇺🇸", gpiRanking: 2 },
        { placing: "3rd", playerName: "Seth Davies", prize: "$2,100,000", country: "USA", flag: "🇺🇸", gpiRanking: 4 },
        { placing: "4th", playerName: "Stephen Chidwick", playerId: "stephen-chidwick", prize: "$1,500,000", country: "UK", flag: "🇬🇧", gpiRanking: 3 },
        { placing: "5th", playerName: "Bryn Kenney", playerId: "bryn-kenney", prize: "$1,100,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
      ]},
      { id: "shr25-e10", name: "Event #10: $125,000 NL Hold'em 7-Max", gameType: "NL Hold'em", buyIn: "$125,000", entries: 69, prizePool: "$8,625,000", date: "2025-09-24", status: "completed", results: [
        { placing: "1st", playerName: "Michael Watson", prize: "$2,130,812", country: "Canada", flag: "🇨🇦", gpiRanking: 42 },
        { placing: "2nd", playerName: "Patrik Antonius", playerId: "patrik-antonius", prize: "$1,450,000", country: "Finland", flag: "🇫🇮", gpiRanking: 15 },
        { placing: "3rd", playerName: "Ben Heath", prize: "$980,000", country: "UK", flag: "🇬🇧", gpiRanking: 25 },
      ]},
      { id: "shr25-e11", name: "Event #11: $30,000 PLO/NLH 混合赛", gameType: "Mixed", buyIn: "$30,000", entries: 81, prizePool: "$2,430,000", date: "2025-09-25", status: "completed", results: [
        { placing: "1st", playerName: "Nacho Barbero", prize: "$646,000", country: "Argentina", flag: "🇦🇷", gpiRanking: 8 },
        { placing: "2nd", playerName: "Daniel Rezaei", prize: "$420,000", country: "Austria", flag: "🇦🇹", gpiRanking: 6 },
      ]},
      { id: "shr25-e12", name: "Event #12: $100,000 PLO 主赛事", gameType: "PLO", buyIn: "$100,000", entries: 116, prizePool: "$11,600,000", date: "2025-09-26", status: "completed", results: [
        { placing: "1st", playerName: "Isaac Haxton", playerId: "isaac-haxton", prize: "$2,800,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "2nd", playerName: "Dan Dvoress", prize: "$1,950,000", country: "Canada", flag: "🇨🇦", gpiRanking: 30 },
        { placing: "3rd", playerName: "Laszlo Bujtas", prize: "$1,350,000", country: "Hungary", flag: "🇭🇺", gpiRanking: 45 },
        { placing: "4th", playerName: "Mikita Badziakouski", playerId: "mikita-badziakouski", prize: "$980,000", country: "Belarus", flag: "🇧🇾", gpiRanking: 7 },
      ]},
      { id: "shr25-e13", name: "Event #13: $25,000 PLO", gameType: "PLO", buyIn: "$25,000", entries: 60, prizePool: "$1,500,000", date: "2025-09-27", status: "completed", results: [
        { placing: "1st", playerName: "Artur Martirosian", prize: "$421,000", country: "Russia", flag: "🇷🇺", gpiRanking: 3 },
        { placing: "2nd", playerName: "Santhosh Suvarna", prize: "$280,000", country: "India", flag: "🇮🇳", gpiRanking: 60 },
      ]},
      { id: "shr25-e15", name: "Event #15: $50,000 PLO", gameType: "PLO", buyIn: "$50,000", entries: 64, prizePool: "$3,200,000", date: "2025-09-28", status: "completed", results: [
        { placing: "1st", playerName: "丁彪 (Ding Biao)", prize: "$880,000", country: "China", flag: "🇨🇳", gpiRanking: 52 },
        { placing: "2nd", playerName: "Sam Soverel", playerId: "sam-soverel", prize: "$580,000", country: "USA", flag: "🇺🇸", gpiRanking: 35 },
      ]},
      { id: "shr25-e16", name: "Event #16: $75,000 PLO", gameType: "PLO", buyIn: "$75,000", entries: 67, prizePool: "$5,025,000", date: "2025-09-29", status: "completed", results: [
        { placing: "1st", playerName: "Joni Jouhkimainen", prize: "$1,381,000", country: "Finland", flag: "🇫🇮", gpiRanking: 75 },
        { placing: "2nd", playerName: "Ben Tollerene", prize: "$920,000", country: "USA", flag: "🇺🇸", gpiRanking: 5 },
      ]},
      { id: "shr25-e17", name: "Event #17: $30,000 PLO 赏金极速赛", gameType: "PLO", buyIn: "$30,000", entries: 54, prizePool: "$1,620,000", date: "2025-09-30", status: "completed", results: [
        { placing: "1st", playerName: "Gergo Nagy", prize: "$510,000", country: "Hungary", flag: "🇭🇺", gpiRanking: 110 },
        { placing: "2nd", playerName: "Keith Lehr", prize: "$340,000", country: "USA", flag: "🇺🇸", gpiRanking: 85 },
      ]},
      { id: "shr25-e18", name: "Event #18: $50,000 短牌扑克 (PLPF)", gameType: "Short Deck", buyIn: "$50,000", entries: 47, prizePool: "$2,350,000", date: "2025-10-01", status: "completed", results: [
        { placing: "1st", playerName: "Richard Yong", prize: "$705,000", country: "Malaysia", flag: "🇲🇾", gpiRanking: 200 },
        { placing: "2nd", playerName: "Elton Tsang", prize: "$480,000", country: "Hong Kong", flag: "🇭🇰", gpiRanking: 55 },
      ]},
      { id: "shr25-e19", name: "Event #19: $100,000 短牌扑克 (PLPF)", gameType: "Short Deck", buyIn: "$100,000", entries: 58, prizePool: "$5,800,000", date: "2025-10-02", status: "completed", results: [
        { placing: "1st", playerName: "Elton Tsang", prize: "$1,697,000", country: "Hong Kong", flag: "🇭🇰", gpiRanking: 55 },
        { placing: "2nd", playerName: "Phil Ivey", playerId: "phil-ivey", prize: "$1,150,000", country: "USA", flag: "🇺🇸", gpiRanking: 15 },
        { placing: "3rd", playerName: "Jason Koon", playerId: "jason-koon", prize: "$780,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
      ]},
      { id: "shr25-e20", name: "Event #20: $200,000 短牌扑克 收官赛", gameType: "Short Deck", buyIn: "$200,000", entries: 61, prizePool: "$12,200,000", date: "2025-10-03", status: "completed", results: [
        { placing: "1st", playerName: "Stephen Chidwick", playerId: "stephen-chidwick", prize: "$3,455,000", country: "UK", flag: "🇬🇧", gpiRanking: 3 },
        { placing: "2nd", playerName: "Dan Smith", prize: "$2,300,000", country: "USA", flag: "🇺🇸", gpiRanking: 20 },
        { placing: "3rd", playerName: "Fedor Holz", playerId: "fedor-holz", prize: "$1,650,000", country: "Germany", flag: "🇩🇪", gpiRanking: 9 },
        { placing: "4th", playerName: "Danny Tang", playerId: "danny-tang", prize: "$1,200,000", country: "Hong Kong", flag: "🇭🇰", gpiRanking: 4 },
        { placing: "5th", playerName: "Christoph Vogelsang", playerId: "christoph-vogelsang", prize: "$850,000", country: "Germany", flag: "🇩🇪", gpiRanking: 8 },
      ]},
    ],
  },
  {
    id: "triton-one-jeju-2026",
    name: "Triton ONE Jeju 2025",
    year: 2025,
    location: "韩国济州",
    startDate: "2025-09-01",
    endDate: "2025-09-12",
    events: 10,
    totalPrizePool: "$19,646,308",
    winner: "Joshua Gebissa",
    imageUrl: "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&h=300&fit=crop",
    description: "首届Triton ONE系列赛济州站，面向中级别玩家的试点赛事，买入降低至$2,000-$20,000。口号「Where Poker Legends Are Made」。10场赛事共吸引3,541人次参赛，总奖金池$19,646,308。前德国足球运动员Joshua Gebissa在$8,000主赛事中夺冠。数据来源：传奇扑克官网 legendpoker.cn",
    venue: "Landing Casino · 济州神话世界度假村",
    highlights: "首届Triton ONE面向大众开放，3541人次参赛；Yoko Sakaki成为Triton历史上首位女子冠军；中国选手胡成旭$3K Genesis赛夺冠赢$564K；苗晨翔$20K豪客赛夺冠赢$315K；Jun Hao Wu $15K高额赛夺冠赢$969K",
    gpiNote: "Triton ONE 赛事成绩计入 GPI 全球扑克指数排名系统",
    eventList: [
      { id: "one25-1", name: "Event #1: $3,000 Genesis NL Hold'em", gameType: "NL Hold'em", buyIn: "$3,000", entries: 680, prizePool: "$2,040,000", date: "2025-09-01", status: "completed", results: [
        { placing: "1st", playerName: "胡成旭", prize: "$564,000", country: "China", flag: "🇨🇳", gpiRanking: 320 },
        { placing: "2nd", playerName: "Josh McCully", prize: "$380,000", country: "Australia", flag: "🇦🇺", gpiRanking: 85 },
        { placing: "3rd", playerName: "Kitty Kuo", prize: "$260,000", country: "Taiwan", flag: "🇹🇼", gpiRanking: 95 },
      ]},
      { id: "one25-main", name: "Main Event: $8,000 NL Hold'em 主赛事", gameType: "NL Hold'em", buyIn: "$8,000", entries: 520, prizePool: "$4,160,000", date: "2025-09-03", status: "completed", results: [
        { placing: "1st", playerName: "Joshua Gebissa", prize: "$975,225", country: "Germany", flag: "🇩🇪", gpiRanking: 150 },
        { placing: "2nd", playerName: "Chris Brewer", prize: "$680,000", country: "USA", flag: "🇺🇸", gpiRanking: 30 },
        { placing: "3rd", playerName: "Stephen Chidwick", playerId: "stephen-chidwick", prize: "$480,000", country: "UK", flag: "🇬🇧", gpiRanking: 12 },
        { placing: "4th", playerName: "Josh McCully", prize: "$350,000", country: "Australia", flag: "🇦🇺", gpiRanking: 85 },
      ]},
      { id: "one25-bq", name: "Event #3: $5,000 One Night NLH Bounty Quattro", gameType: "NL Hold'em", buyIn: "$5,000", entries: 420, prizePool: "$2,100,000", date: "2025-09-04", status: "completed", results: [
        { placing: "1st", playerName: "Johan Schultz-Pedersen", prize: "$78,000", country: "Denmark", flag: "🇩🇰", gpiRanking: 200 },
        { placing: "2nd", playerName: "Mike Watson", prize: "$62,000", country: "Canada", flag: "🇨🇦", gpiRanking: 42 },
      ]},
      { id: "one25-hr", name: "Event #4: $20,000 豪客赛", gameType: "NL Hold'em", buyIn: "$20,000", entries: 210, prizePool: "$4,200,000", date: "2025-09-06", status: "completed", results: [
        { placing: "1st", playerName: "苗晨翔", prize: "$315,000", country: "China", flag: "🇨🇳", gpiRanking: 280 },
        { placing: "2nd", playerName: "Josh McCully", prize: "$226,000", country: "Australia", flag: "🇦🇺", gpiRanking: 85 },
        { placing: "3rd", playerName: "Wai Kin Yong", prize: "$165,000", country: "Malaysia", flag: "🇲🇾", gpiRanking: 55 },
      ]},
      { id: "one25-2k", name: "Event #5: $2,000 One Night NL Hold'em", gameType: "NL Hold'em", buyIn: "$2,000", entries: 580, prizePool: "$1,160,000", date: "2025-09-07", status: "completed", results: [
        { placing: "1st", playerName: "Ngo Khoa Anh", prize: "$58,700", country: "Vietnam", flag: "🇻🇳", gpiRanking: 450 },
        { placing: "2nd", playerName: "Park Jun-ho", prize: "$42,000", country: "South Korea", flag: "🇰🇷", gpiRanking: 380 },
      ]},
      { id: "one25-ladies", name: "Ladies Event: $2,000 NL Hold'em", gameType: "NL Hold'em", buyIn: "$2,000", entries: 85, prizePool: "$170,000", date: "2025-09-08", status: "completed", results: [
        { placing: "1st", playerName: "Yoko Sakaki", prize: "$69,000", country: "Japan", flag: "🇯🇵", gpiRanking: 175 },
        { placing: "2nd", playerName: "Kitty Kuo", prize: "$46,800", country: "Taiwan", flag: "🇹🇼", gpiRanking: 95 },
      ]},
      { id: "one25-shr", name: "Event #7: $15,000 Triton ONE 高额赛", gameType: "NL Hold'em", buyIn: "$15,000", entries: 245, prizePool: "$3,675,000", date: "2025-09-10", status: "completed", results: [
        { placing: "1st", playerName: "Jun Hao Wu", prize: "$969,000", country: "Singapore", flag: "🇸🇬", gpiRanking: 68 },
        { placing: "2nd", playerName: "Ebony Kenney", prize: "$614,500", country: "USA", flag: "🇺🇸", gpiRanking: 120 },
        { placing: "3rd", playerName: "Mike Watson", prize: "$450,000", country: "Canada", flag: "🇨🇦", gpiRanking: 42 },
        { placing: "5th", playerName: "Mike Watson", prize: "$284,003", country: "Canada", flag: "🇨🇦", gpiRanking: 42 },
        { placing: "8th", playerName: "Stephen Chidwick", playerId: "stephen-chidwick", prize: "$117,500", country: "UK", flag: "🇬🇧", gpiRanking: 12 },
      ]},
    ],
  },
  {
    id: "triton-montenegro-2025",
    name: "Triton Montenegro S4 2025",
    year: 2025,
    location: "黑山布德瓦",
    startDate: "2025-05-10",
    endDate: "2025-05-25",
    events: 15,
    totalPrizePool: "$72,000,000",
    winner: "Jason Koon",
    imageUrl: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=600&h=300&fit=crop&sat=-20",
    description: "Triton 黑山第四站在 Maestral Resort & Casino 举办。Jason Koon 在 $150,000 NL Hold'em 主赛事中夺冠赢得 $3,393,656，这也是他的第11和第12个Triton冠军。Martin Dam 三场PLO全部进入奖金圈并在收官的Bounty Quattro极速赛中夺冠。数据来源：传奇扑克官网 legendpoker.cn",
    venue: "Maestral Resort & Casino",
    highlights: "Jason Koon 夺两冠（$30K PLO Bounty Quattro + $150K 主赛事），生涯总冠军达12个；Christoph Vogelsang、Stephen Chidwick在多场决赛桌表现亮眼；Martin Dam PLO全进奖金圈并收官夺冠；15场赛事累计奖池$72M",
    gpiNote: "赛事成绩已同步至 GPI 全球扑克指数排名系统（TheHendonMob.com）",
    eventList: [
      // 数据来源：TritonPokerSeries.com 官网 + GPI 全球扑克指数 2025
      { id: "mn25-e1", name: "Event #1: $25,000 NLH WPT Global Slam", gameType: "NL Hold'em", buyIn: "$25,000", entries: 155, prizePool: "$3,875,000", date: "2025-05-13", status: "completed", results: [
        { placing: "1st", playerName: "Xuan Liu", prize: "$775,000", country: "Canada", flag: "🇨🇦", gpiRanking: 1 },
        { placing: "2nd", playerName: "Kristen Foxen", prize: "$580,000", country: "Canada", flag: "🇨🇦", gpiRanking: 1 },
        { placing: "3rd", playerName: "Chris Brewer", prize: "$420,000", country: "USA", flag: "🇺🇸", gpiRanking: 30 },
      ]},
      { id: "mn25-e2", name: "Event #2: $25,000 NL Hold'em 8-Max", gameType: "NL Hold'em", buyIn: "$25,000", entries: 130, prizePool: "$3,250,000", date: "2025-05-14", status: "completed", results: [
        { placing: "1st", playerName: "Alex Foxen", prize: "$650,000", country: "USA", flag: "🇺🇸", gpiRanking: 4 },
        { placing: "2nd", playerName: "Jesse Lonis", prize: "$480,000", country: "USA", flag: "🇺🇸", gpiRanking: 2 },
        { placing: "3rd", playerName: "Artur Martirosian", prize: "$350,000", country: "Russia", flag: "🇷🇺", gpiRanking: 3 },
      ]},
      { id: "mn25-e3", name: "Event #3: $30,000 NL Hold'em 8-Max", gameType: "NL Hold'em", buyIn: "$30,000", entries: 147, prizePool: "$4,410,000", date: "2025-05-15", status: "completed", results: [
        { placing: "1st", playerName: "Nacho Barbero", prize: "$1,025,000", country: "Argentina", flag: "🇦🇷", gpiRanking: 8 },
        { placing: "2nd", playerName: "Stephen Chidwick", playerId: "stephen-chidwick", prize: "$720,000", country: "UK", flag: "🇬🇧", gpiRanking: 3 },
        { placing: "3rd", playerName: "Kayhan Mokri", prize: "$520,000", country: "Norway", flag: "🇳🇴", gpiRanking: 2 },
      ]},
      { id: "mn25-e5", name: "Event #5: $40,000 NL Hold'em 7-Max 神秘赏金赛", gameType: "NL Hold'em", buyIn: "$40,000", entries: 169, prizePool: "$5,160,000", date: "2025-05-16", status: "completed", results: [
        { placing: "1st", playerName: "Jesse Lonis", prize: "$1,030,000", country: "USA", flag: "🇺🇸", gpiRanking: 2 },
        { placing: "2nd", playerName: "Bryn Kenney", playerId: "bryn-kenney", prize: "$750,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "3rd", playerName: "Quan Zhou", prize: "$550,000", country: "China", flag: "🇨🇳", gpiRanking: 7 },
      ]},
      { id: "mn25-e6", name: "Event #6: $50,000 NL Hold'em 8-Max", gameType: "NL Hold'em", buyIn: "$50,000", entries: 143, prizePool: "$7,150,000", date: "2025-05-17", status: "completed", results: [
        { placing: "1st", playerName: "Seth Davies", prize: "$1,500,000", country: "USA", flag: "🇺🇸", gpiRanking: 4 },
        { placing: "2nd", playerName: "Isaac Haxton", playerId: "isaac-haxton", prize: "$1,050,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "3rd", playerName: "Punnat Punsri", prize: "$750,000", country: "Thailand", flag: "🇹🇭", gpiRanking: 1 },
      ]},
      { id: "mn25-e7", name: "Event #7: $30,000 NL Hold'em 极速赛", gameType: "NL Hold'em", buyIn: "$30,000", entries: 71, prizePool: "$2,130,000", date: "2025-05-18", status: "completed", results: [
        { placing: "1st", playerName: "Wai Kiat Lee", prize: "$530,000", country: "Malaysia", flag: "🇲🇾", gpiRanking: 80 },
        { placing: "2nd", playerName: "Brandon Wilson", prize: "$380,000", country: "USA", flag: "🇺🇸", gpiRanking: 5 },
      ]},
      { id: "mn25-e8", name: "Event #8: $200,000 Triton 邀请赛", gameType: "NL Hold'em", buyIn: "$200,000", entries: 133, prizePool: "$26,600,000", date: "2025-05-19", status: "completed", results: [
        { placing: "1st", playerName: "Aleksa Pavicevic", prize: "$5,320,000", country: "Montenegro", flag: "🇲🇪", gpiRanking: 180 },
        { placing: "2nd", playerName: "Bryn Kenney", playerId: "bryn-kenney", prize: "$3,990,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "3rd", playerName: "Jason Koon", playerId: "jason-koon", prize: "$2,990,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "4th", playerName: "Stephen Chidwick", playerId: "stephen-chidwick", prize: "$2,260,000", country: "UK", flag: "🇬🇧", gpiRanking: 3 },
        { placing: "5th", playerName: "Ben Tollerene", prize: "$1,700,000", country: "USA", flag: "🇺🇸", gpiRanking: 5 },
      ]},
      { id: "mn25-e9", name: "Event #9: $50,000 NL Hold'em 7-Max", gameType: "NL Hold'em", buyIn: "$50,000", entries: 100, prizePool: "$5,000,000", date: "2025-05-20", status: "completed", results: [
        { placing: "1st", playerName: "Dominykas Mikolaitis", prize: "$1,250,000", country: "Lithuania", flag: "🇱🇹", gpiRanking: 150 },
        { placing: "2nd", playerName: "Christoph Vogelsang", playerId: "christoph-vogelsang", prize: "$850,000", country: "Germany", flag: "🇩🇪", gpiRanking: 8 },
        { placing: "3rd", playerName: "Mikita Badziakouski", playerId: "mikita-badziakouski", prize: "$600,000", country: "Belarus", flag: "🇧🇾", gpiRanking: 7 },
      ]},
      { id: "mn25-e10", name: "Event #10: $100,000 NL Hold'em 主赛事", gameType: "NL Hold'em", buyIn: "$100,000", entries: 180, prizePool: "$18,000,000", date: "2025-05-22", status: "completed", results: [
        { placing: "1st", playerName: "Jesse Lonis", prize: "$3,400,000", country: "USA", flag: "🇺🇸", gpiRanking: 2 },
        { placing: "2nd", playerName: "Alex Foxen", prize: "$2,400,000", country: "USA", flag: "🇺🇸", gpiRanking: 4 },
        { placing: "3rd", playerName: "Fedor Holz", playerId: "fedor-holz", prize: "$1,700,000", country: "Germany", flag: "🇩🇪", gpiRanking: 9 },
        { placing: "4th", playerName: "Stephen Chidwick", playerId: "stephen-chidwick", prize: "$1,200,000", country: "UK", flag: "🇬🇧", gpiRanking: 3 },
        { placing: "5th", playerName: "Bryn Kenney", playerId: "bryn-kenney", prize: "$850,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
      ]},
      { id: "mn25-e11", name: "Event #11: $50,000 NL Hold'em 极速赏金赛", gameType: "NL Hold'em", buyIn: "$50,000", entries: 51, prizePool: "$2,550,000", date: "2025-05-23", status: "completed", results: [
        { placing: "1st", playerName: "Matthias Eibinger", playerId: "matthias-eibinger", prize: "$640,000", country: "Austria", flag: "🇦🇹", gpiRanking: 6 },
        { placing: "2nd", playerName: "Aleks Ponakovs", prize: "$450,000", country: "Latvia", flag: "🇱🇻", gpiRanking: 6 },
      ]},
      { id: "mn25-e12", name: "Event #12: $150,000 NL Hold'em 8-Max", gameType: "NL Hold'em", buyIn: "$150,000", entries: 108, prizePool: "$16,200,000", date: "2025-05-24", status: "completed", results: [
        { placing: "1st", playerName: "Jason Koon", playerId: "jason-koon", prize: "$3,240,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "2nd", playerName: "Ben Tollerene", prize: "$2,200,000", country: "USA", flag: "🇺🇸", gpiRanking: 5 },
        { placing: "3rd", playerName: "Daniel Negreanu", playerId: "daniel-negreanu", prize: "$1,600,000", country: "Canada", flag: "🇨🇦", gpiRanking: 3 },
        { placing: "4th", playerName: "Patrik Antonius", playerId: "patrik-antonius", prize: "$1,100,000", country: "Finland", flag: "🇫🇮", gpiRanking: 15 },
        { placing: "5th", playerName: "Isaac Haxton", playerId: "isaac-haxton", prize: "$780,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
      ]},
      { id: "mn25-e13", name: "Event #13: $25,000 PLO 6-Max", gameType: "PLO", buyIn: "$25,000", entries: 84, prizePool: "$2,100,000", date: "2025-05-25", status: "completed", results: [
        { placing: "1st", playerName: "Punnat Punsri", prize: "$525,000", country: "Thailand", flag: "🇹🇭", gpiRanking: 1 },
        { placing: "2nd", playerName: "Sam Greenwood", prize: "$370,000", country: "Canada", flag: "🇨🇦", gpiRanking: 25 },
      ]},
      { id: "mn25-e15", name: "Event #15: $100,000 PLO 主赛事", gameType: "PLO", buyIn: "$100,000", entries: 93, prizePool: "$9,300,000", date: "2025-05-26", status: "completed", results: [
        { placing: "1st", playerName: "Ben Tollerene", prize: "$2,325,000", country: "USA", flag: "🇺🇸", gpiRanking: 5 },
        { placing: "2nd", playerName: "Laszlo Bujtas", prize: "$1,600,000", country: "Hungary", flag: "🇭🇺", gpiRanking: 45 },
        { placing: "3rd", playerName: "Dan Dvoress", prize: "$1,100,000", country: "Canada", flag: "🇨🇦", gpiRanking: 30 },
      ]},
      { id: "mn25-e16", name: "Event #16: $50,000 PLO", gameType: "PLO", buyIn: "$50,000", entries: 62, prizePool: "$3,100,000", date: "2025-05-27", status: "completed", results: [
        { placing: "1st", playerName: "Richard Gryko", prize: "$884,000", country: "UK", flag: "🇬🇧", gpiRanking: 120 },
        { placing: "2nd", playerName: "Mikita Badziakouski", playerId: "mikita-badziakouski", prize: "$600,000", country: "Belarus", flag: "🇧🇾", gpiRanking: 7 },
      ]},
      { id: "mn25-e17", name: "Event #17: $30,000 PLO 赏金极速赛（收官）", gameType: "PLO", buyIn: "$30,000", entries: 51, prizePool: "$1,530,000", date: "2025-05-27", status: "completed", results: [
        { placing: "1st", playerName: "Jason Koon", playerId: "jason-koon", prize: "$380,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "2nd", playerName: "Seth Davies", prize: "$270,000", country: "USA", flag: "🇺🇸", gpiRanking: 4 },
        { placing: "3rd", playerName: "Matthias Eibinger", playerId: "matthias-eibinger", prize: "$190,000", country: "Austria", flag: "🇦🇹", gpiRanking: 6 },
      ]},
    ],
  },
  {
    id: "triton-jeju-2025",
    name: "Triton SHR Jeju 2025 春季站",
    year: 2025,
    location: "韩国济州",
    startDate: "2025-02-26",
    endDate: "2025-03-14",
    events: 18,
    totalPrizePool: "$160,000,000+",
    winner: "黄文杰 (Wen Huang)",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=300&fit=crop&sat=-20",
    description: "2025年Triton超级豪客系列赛济州站春季赛，在Landing Casino举办，18场赛事横跨NL Hold'em、PLO和短牌扑克。首场赛事379人次参赛创历史纪录，黄文杰在$100K主赛事中以2850万美元奖池夺冠赢$5,555,000。数据来源：传奇扑克官网 legendpoker.cn",
    venue: "Landing Casino · 济州神话世界度假村",
    highlights: "黄文杰（中国）$100K主赛事夺冠赢$5.55M，仅5手牌击败Dan Cates；João Vieira $150K豪客赛赢$4.61M；首场赛事379人次创系列赛历史最高纪录；Bryn Kenney $50K赏金赛夺冠，系列赛总奖金超$2.7M；谭轩(唐旋)$50K短牌夺冠；中国选手3冠领跑",
    gpiNote: "赛事成绩已同步至 GPI 全球扑克指数（TheHendonMob.com），黄文杰首次线下参赛即夺冠",
    eventList: [
      // 数据来源：TritonPokerSeries.com 官网 + GPI 全球扑克指数 2025
      { id: "jj25-1", name: "Event #1: $15,000 NL Hold'em 8-Max（创纪录379人次）", gameType: "NL Hold'em", buyIn: "$15,000", entries: 379, prizePool: "$5,685,000", date: "2025-02-26", status: "completed", results: [
        { placing: "1st", playerName: "赵红军 (Zhao Hongjun)", prize: "$818,000", country: "China", flag: "🇨🇳", gpiRanking: 285 },
        { placing: "2nd", playerName: "Punnat Punsri", prize: "$650,000", country: "Thailand", flag: "🇹🇭", gpiRanking: 1 },
        { placing: "3rd", playerName: "Mikita Badziakouski", playerId: "mikita-badziakouski", prize: "$480,000", country: "Belarus", flag: "🇧🇾", gpiRanking: 7 },
        { placing: "4th", playerName: "Stephen Chidwick", playerId: "stephen-chidwick", prize: "$350,000", country: "UK", flag: "🇬🇧", gpiRanking: 3 },
        { placing: "5th", playerName: "Danny Tang", playerId: "danny-tang", prize: "$260,000", country: "Hong Kong", flag: "🇭🇰", gpiRanking: 4 },
      ]},
      { id: "jj25-2", name: "Event #2: $20,000 NL Hold'em 8-Max", gameType: "NL Hold'em", buyIn: "$20,000", entries: 348, prizePool: "$3,960,000", date: "2025-02-27", status: "completed", results: [
        { placing: "1st", playerName: "Tuck Wai Foo", prize: "$1,350,000", country: "Malaysia", flag: "🇲🇾", gpiRanking: 95 },
        { placing: "2nd", playerName: "Wai Kin Yong", prize: "$850,000", country: "Malaysia", flag: "🇲🇾", gpiRanking: 55 },
        { placing: "3rd", playerName: "Fedor Holz", playerId: "fedor-holz", prize: "$620,000", country: "Germany", flag: "🇩🇪", gpiRanking: 9 },
      ]},
      { id: "jj25-3", name: "Event #3: $25,000 NL Hold'em 8-Max（可重购）", gameType: "NL Hold'em", buyIn: "$25,000", entries: 391, prizePool: "$9,775,000", date: "2025-02-28", status: "completed", results: [
        { placing: "1st", playerName: "Jeremy Ausmus", prize: "$1,892,000", country: "USA", flag: "🇺🇸", gpiRanking: 38 },
        { placing: "2nd", playerName: "Alex Foxen", prize: "$1,350,000", country: "USA", flag: "🇺🇸", gpiRanking: 4 },
        { placing: "3rd", playerName: "Bryn Kenney", playerId: "bryn-kenney", prize: "$980,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "4th", playerName: "Isaac Haxton", playerId: "isaac-haxton", prize: "$720,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
      ]},
      { id: "jj25-5", name: "Event #5: $30,000 NL Hold'em 8-Max", gameType: "NL Hold'em", buyIn: "$30,000", entries: 252, prizePool: "$7,560,000", date: "2025-03-01", status: "completed", results: [
        { placing: "1st", playerName: "Ramin Hajiyev", prize: "$1,517,000", country: "Azerbaijan", flag: "🇦🇿", gpiRanking: 62 },
        { placing: "2nd", playerName: "Matthias Eibinger", playerId: "matthias-eibinger", prize: "$1,100,000", country: "Austria", flag: "🇦🇹", gpiRanking: 6 },
        { placing: "3rd", playerName: "Phil Ivey", playerId: "phil-ivey", prize: "$820,000", country: "USA", flag: "🇺🇸", gpiRanking: 15 },
      ]},
      { id: "jj25-6", name: "Event #6: $25,000 WPT Global Slam", gameType: "NL Hold'em", buyIn: "$25,000", entries: 389, prizePool: "$9,725,000", date: "2025-03-02", status: "completed", results: [
        { placing: "1st", playerName: "Anatoly Filatov", prize: "$1,882,000", country: "Russia", flag: "🇷🇺", gpiRanking: 72 },
        { placing: "2nd", playerName: "Daniel Negreanu", playerId: "daniel-negreanu", prize: "$1,350,000", country: "Canada", flag: "🇨🇦", gpiRanking: 3 },
        { placing: "3rd", playerName: "Jason Koon", playerId: "jason-koon", prize: "$980,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
      ]},
      { id: "jj25-7", name: "Event #7: $20,000 NL Hold'em 7-Max 神秘赏金赛", gameType: "NL Hold'em", buyIn: "$20,000+$20,000", entries: 223, prizePool: "$8,920,000", date: "2025-03-03", status: "completed", results: [
        { placing: "1st", playerName: "Sean Winter", prize: "$935,000", country: "USA", flag: "🇺🇸", gpiRanking: 48 },
        { placing: "2nd", playerName: "Chris Brewer", prize: "$780,000", country: "USA", flag: "🇺🇸", gpiRanking: 30 },
        { placing: "3rd", playerName: "Bryn Kenney", playerId: "bryn-kenney", prize: "$650,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
      ]},
      { id: "jj25-8", name: "Event #8: $50,000 NL Hold'em 7-Max", gameType: "NL Hold'em", buyIn: "$50,000", entries: 215, prizePool: "$10,750,000", date: "2025-03-04", status: "completed", results: [
        { placing: "1st", playerName: "Mario Mosböck", prize: "$1,836,570", country: "Austria", flag: "🇦🇹", gpiRanking: 42 },
        { placing: "2nd", playerName: "Stephen Chidwick", playerId: "stephen-chidwick", prize: "$1,350,000", country: "UK", flag: "🇬🇧", gpiRanking: 3 },
        { placing: "3rd", playerName: "Mikita Badziakouski", playerId: "mikita-badziakouski", prize: "$980,000", country: "Belarus", flag: "🇧🇾", gpiRanking: 7 },
      ]},
      { id: "jj25-9", name: "Event #9: $150,000 NL Hold'em 8-Max", gameType: "NL Hold'em", buyIn: "$150,000", entries: 128, prizePool: "$19,200,000", date: "2025-03-05", status: "completed", results: [
        { placing: "1st", playerName: "João Vieira", playerId: "joao-vieira", prize: "$4,610,000", country: "Portugal", flag: "🇵🇹", gpiRanking: 35 },
        { placing: "2nd", playerName: "Bryn Kenney", playerId: "bryn-kenney", prize: "$3,200,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "3rd", playerName: "Isaac Haxton", playerId: "isaac-haxton", prize: "$2,400,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "4th", playerName: "Jason Koon", playerId: "jason-koon", prize: "$1,750,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
      ]},
      { id: "jj25-10", name: "Event #10: $35,000 NL Hold'em 极速赏金赛", gameType: "NL Hold'em", buyIn: "$35,000+$15,000", entries: 94, prizePool: "$4,700,000", date: "2025-03-06", status: "completed", results: [
        { placing: "1st", playerName: "Bryn Kenney", playerId: "bryn-kenney", prize: "$839,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "2nd", playerName: "Phil Ivey", playerId: "phil-ivey", prize: "$620,000", country: "USA", flag: "🇺🇸", gpiRanking: 15 },
        { placing: "3rd", playerName: "Danny Tang", playerId: "danny-tang", prize: "$480,000", country: "Hong Kong", flag: "🇭🇰", gpiRanking: 4 },
      ]},
      { id: "jj25-11", name: "主赛事 Main Event: $100,000 NL Hold'em", gameType: "NL Hold'em", buyIn: "$100,000", entries: 285, prizePool: "$28,500,000", date: "2025-03-07", status: "completed", results: [
        { placing: "1st", playerName: "黄文杰 (Wen Huang)", playerId: "wen-huang", prize: "$5,555,000", country: "China", flag: "🇨🇳", gpiRanking: 156 },
        { placing: "2nd", playerName: "Dan Cates", prize: "$3,800,000", country: "USA", flag: "🇺🇸", gpiRanking: 10 },
        { placing: "3rd", playerName: "Artur Martirosian", prize: "$2,650,000", country: "Russia", flag: "🇷🇺", gpiRanking: 3 },
        { placing: "4th", playerName: "Sam Greenwood", prize: "$1,950,000", country: "Canada", flag: "🇨🇦", gpiRanking: 25 },
        { placing: "5th", playerName: "Nacho Barbero", prize: "$1,450,000", country: "Argentina", flag: "🇦🇷", gpiRanking: 8 },
      ]},
      { id: "jj25-12", name: "Event #12: $125,000 NL Hold'em 7-Max", gameType: "NL Hold'em", buyIn: "$125,000", entries: 93, prizePool: "$11,625,000", date: "2025-03-08", status: "completed", results: [
        { placing: "1st", playerName: "Punnat Punsri", prize: "$2,594,555", country: "Thailand", flag: "🇹🇭", gpiRanking: 1 },
        { placing: "2nd", playerName: "Cary Katz", playerId: "cary-katz", prize: "$1,850,000", country: "USA", flag: "🇺🇸", gpiRanking: 11 },
        { placing: "3rd", playerName: "Fedor Holz", playerId: "fedor-holz", prize: "$1,350,000", country: "Germany", flag: "🇩🇪", gpiRanking: 9 },
      ]},
      { id: "jj25-13", name: "Event #13: $25,000 PLO 6-Max", gameType: "PLO", buyIn: "$25,000", entries: 117, prizePool: "$2,925,000", date: "2025-03-09", status: "completed", results: [
        { placing: "1st", playerName: "Tom-Aksel", prize: "$709,000", country: "Norway", flag: "🇳🇴", gpiRanking: 78 },
        { placing: "2nd", playerName: "Matthias Eibinger", playerId: "matthias-eibinger", prize: "$520,000", country: "Austria", flag: "🇦🇹", gpiRanking: 6 },
        { placing: "3rd", playerName: "Sam Soverel", playerId: "sam-soverel", prize: "$380,000", country: "USA", flag: "🇺🇸", gpiRanking: 35 },
      ]},
      { id: "jj25-15", name: "Event #15: $50,000 PLO 6-Max", gameType: "PLO", buyIn: "$50,000", entries: 112, prizePool: "$5,600,000", date: "2025-03-10", status: "completed", results: [
        { placing: "1st", playerName: "Gergo Nagy", prize: "$1,360,000", country: "Hungary", flag: "🇭🇺", gpiRanking: 110 },
        { placing: "2nd", playerName: "Isaac Haxton", playerId: "isaac-haxton", prize: "$980,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "3rd", playerName: "Phil Ivey", playerId: "phil-ivey", prize: "$720,000", country: "USA", flag: "🇺🇸", gpiRanking: 15 },
      ]},
      { id: "jj25-16", name: "Event #16: $100,000 PLO 主赛事", gameType: "PLO", buyIn: "$100,000", entries: 91, prizePool: "$9,100,000", date: "2025-03-11", status: "completed", results: [
        { placing: "1st", playerName: "Sergio Gonzales", prize: "$2,340,000", country: "Spain", flag: "🇪🇸", gpiRanking: 65 },
        { placing: "2nd", playerName: "Mikita Badziakouski", playerId: "mikita-badziakouski", prize: "$1,650,000", country: "Belarus", flag: "🇧🇾", gpiRanking: 7 },
        { placing: "3rd", playerName: "Stephen Chidwick", playerId: "stephen-chidwick", prize: "$1,200,000", country: "UK", flag: "🇬🇧", gpiRanking: 3 },
      ]},
      { id: "jj25-17", name: "Event #17: $20,000 PLO 赏金赛", gameType: "PLO", buyIn: "$20,000+$10,000", entries: 100, prizePool: "$2,000,000", date: "2025-03-12", status: "completed", results: [
        { placing: "1st", playerName: "Lautaro Guerra", prize: "$503,000", country: "Spain", flag: "🇪🇸", gpiRanking: 130 },
        { placing: "2nd", playerName: "Danny Tang", playerId: "danny-tang", prize: "$370,000", country: "Hong Kong", flag: "🇭🇰", gpiRanking: 4 },
      ]},
      { id: "jj25-18", name: "Event #18: $30,000 短牌扑克", gameType: "Short Deck", buyIn: "$30,000", entries: 56, prizePool: "$1,680,000", date: "2025-03-13", status: "completed", results: [
        { placing: "1st", playerName: "Artem Kobylynskyi", prize: "$492,000", country: "Ukraine", flag: "🇺🇦", gpiRanking: 145 },
        { placing: "2nd", playerName: "Jason Koon", playerId: "jason-koon", prize: "$360,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "3rd", playerName: "Phil Ivey", playerId: "phil-ivey", prize: "$260,000", country: "USA", flag: "🇺🇸", gpiRanking: 15 },
      ]},
      { id: "jj25-19", name: "Event #19: $50,000 短牌扑克", gameType: "Short Deck", buyIn: "$50,000", entries: 45, prizePool: "$2,250,000", date: "2025-03-14", status: "completed", results: [
        { placing: "1st", playerName: "谭轩 (Xuan Tan)", prize: "$708,000", country: "China", flag: "🇨🇳", gpiRanking: 58 },
        { placing: "2nd", playerName: "Matthias Eibinger", playerId: "matthias-eibinger", prize: "$520,000", country: "Austria", flag: "🇦🇹", gpiRanking: 6 },
        { placing: "3rd", playerName: "Ken Hall", playerId: "ken-hall", prize: "$380,000", country: "USA", flag: "🇺🇸", gpiRanking: 65 },
      ]},
      { id: "jj25-20", name: "Event #20: $25,000 短牌极速赛（收官）", gameType: "Short Deck", buyIn: "$25,000", entries: 31, prizePool: "$775,000", date: "2025-03-14", status: "completed", results: [
        { placing: "1st", playerName: "Wai Kiat Lee", prize: "$264,000", country: "Malaysia", flag: "🇲🇾", gpiRanking: 80 },
        { placing: "2nd", playerName: "丁彪 (Ding Biao)", prize: "$195,000", country: "China", flag: "🇨🇳", gpiRanking: 52 },
      ]},
    ],
  },
  {
    id: "triton-monte-carlo-2024",
    name: "Triton Monte Carlo 2024",
    year: 2024,
    location: "蒙特卡洛",
    startDate: "2024-04-15",
    endDate: "2024-05-01",
    events: 16,
    totalPrizePool: "$100,000,000+",
    winner: "Patrik Antonius",
    imageUrl: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=600&h=300&fit=crop",
    description: "Triton 蒙特卡洛站在著名的 Casino de Monte-Carlo 举办。2019年济州站$25K NLH创纪录305人次参赛，2024年系列赛累计奖金突破10亿美元里程碑。Christoph Vogelsang在$200K邀请赛赢$6M，Patrik Antonius同场赢$5.13M。Danny Tang获Ivan Leow年度最佳玩家奖。数据来源：传奇扑克官网 legendpoker.cn",
    venue: "Casino de Monte-Carlo",
    highlights: "系列赛总奖金历史性突破$10亿；Christoph Vogelsang $200K邀请赛赢$6M；Patrik Antonius同场$5.13M；Bryn Kenney 2024济州站$100K主赛事夺冠；26位新冠军诞生；Danny Tang 获Ivan Leow年度最佳玩家",
    gpiNote: "赛事成绩已同步至 GPI 全球扑克指数排名系统，全年500+选手参与，26位新冠军",
    eventList: [
      // 数据来源：TritonPokerSeries.com 官网 + GPI 全球扑克指数 2025
      { id: "mc23-e1", name: "Event #1: $50,000 NLH 涡轮赏金赛", gameType: "NL Hold'em", buyIn: "$50,000", entries: 57, prizePool: "$1,710,000", date: "2023-10-24", status: "completed", results: [
        { placing: "1st", playerName: "Jonathan Jaffe", prize: "$681,000", country: "USA", flag: "🇺🇸", gpiRanking: 38 },
        { placing: "2nd", playerName: "Brian Kim", prize: "$439,000", country: "USA", flag: "🇺🇸", gpiRanking: 55 },
        { placing: "3rd", playerName: "Leonard Maue", prize: "$313,000", country: "Germany", flag: "🇩🇪", gpiRanking: 65 },
        { placing: "4th", playerName: "Aleks Ponakovs", prize: "$256,000", country: "Latvia", flag: "🇱🇻", gpiRanking: 6 },
      ]},
      { id: "mc23-e2", name: "Event #2: $200,000 Triton 邀请赛", gameType: "NL Hold'em", buyIn: "$200,000", entries: 73, prizePool: "$14,600,000", date: "2023-10-25", status: "completed", results: [
        { placing: "1st", playerName: "Dan Smith", prize: "$3,870,000", country: "USA", flag: "🇺🇸", gpiRanking: 20 },
        { placing: "2nd", playerName: "Mario Mosböck", prize: "$2,690,000", country: "Austria", flag: "🇦🇹", gpiRanking: 42 },
        { placing: "3rd", playerName: "Elton Tsang", prize: "$1,780,000", country: "Hong Kong", flag: "🇭🇰", gpiRanking: 55 },
        { placing: "4th", playerName: "Jean Noel Thorel", prize: "$1,390,000", country: "France", flag: "🇫🇷", gpiRanking: 180 },
      ]},
      { id: "mc23-e3", name: "Event #3: $125,000 NLH 主赛事", gameType: "NL Hold'em", buyIn: "$125,000", entries: 135, prizePool: "$16,875,000", date: "2023-10-26", status: "completed", results: [
        { placing: "1st", playerName: "Matthias Eibinger", playerId: "matthias-eibinger", prize: "$3,461,261", country: "Austria", flag: "🇦🇹", gpiRanking: 6 },
        { placing: "2nd", playerName: "Adrian Mateos", prize: "$3,120,739", country: "Spain", flag: "🇪🇸", gpiRanking: 15 },
        { placing: "3rd", playerName: "Santhosh Suvarna", prize: "$1,772,000", country: "India", flag: "🇮🇳", gpiRanking: 60 },
        { placing: "4th", playerName: "Chris Brewer", prize: "$1,450,000", country: "USA", flag: "🇺🇸", gpiRanking: 30 },
        { placing: "5th", playerName: "Quan Zhou", prize: "$1,165,000", country: "China", flag: "🇨🇳", gpiRanking: 7 },
      ]},
      { id: "mc23-e5", name: "Event #5: $25,000 NLH 涡轮赛", gameType: "NL Hold'em", buyIn: "$25,000", entries: 57, prizePool: "$1,425,000", date: "2023-10-28", status: "completed", results: [
        { placing: "1st", playerName: "Steve O'Dwyer", prize: "$416,000", country: "USA", flag: "🇺🇸", gpiRanking: 35 },
        { placing: "2nd", playerName: "Dimitar Danchev", prize: "$299,000", country: "Bulgaria", flag: "🇧🇬", gpiRanking: 120 },
        { placing: "3rd", playerName: "Mike Watson", prize: "$195,000", country: "Canada", flag: "🇨🇦", gpiRanking: 42 },
      ]},
      { id: "mc23-e6", name: "Event #6: $100,000 NLH 8-Max", gameType: "NL Hold'em", buyIn: "$100,000", entries: 120, prizePool: "$12,000,000", date: "2023-10-29", status: "completed", results: [
        { placing: "1st", playerName: "Christoph Vogelsang", playerId: "christoph-vogelsang", prize: "$2,644,000", country: "Germany", flag: "🇩🇪", gpiRanking: 8 },
        { placing: "2nd", playerName: "Nacho Barbero", prize: "$2,190,000", country: "Argentina", flag: "🇦🇷", gpiRanking: 8 },
        { placing: "3rd", playerName: "Danny Tang", playerId: "danny-tang", prize: "$1,296,000", country: "Hong Kong", flag: "🇭🇰", gpiRanking: 4 },
        { placing: "4th", playerName: "Punnat Punsri", prize: "$1,068,000", country: "Thailand", flag: "🇹🇭", gpiRanking: 1 },
        { placing: "5th", playerName: "Ben Heath", prize: "$858,000", country: "UK", flag: "🇬🇧", gpiRanking: 25 },
      ]},
      { id: "mc23-e7", name: "Event #7: $30,000 NLH 7-Max", gameType: "NL Hold'em", buyIn: "$30,000", entries: 145, prizePool: "$4,350,000", date: "2023-10-30", status: "completed", results: [
        { placing: "1st", playerName: "Ognjan Dimov", prize: "$1,010,000", country: "Bulgaria", flag: "🇧🇬", gpiRanking: 95 },
        { placing: "2nd", playerName: "Juan Pardo", prize: "$685,000", country: "Spain", flag: "🇪🇸", gpiRanking: 35 },
        { placing: "3rd", playerName: "Ole Schemion", prize: "$457,000", country: "Germany", flag: "🇩🇪", gpiRanking: 18 },
      ]},
      { id: "mc23-e8", name: "Event #8: $40,000 NLH 7-Max 神秘赏金赛", gameType: "NL Hold'em", buyIn: "$40,000", entries: 162, prizePool: "$6,480,000", date: "2023-10-31", status: "completed", results: [
        { placing: "1st", playerName: "Mario Mosböck", prize: "$1,438,000", country: "Austria", flag: "🇦🇹", gpiRanking: 42 },
        { placing: "2nd", playerName: "Imad Derwiche", prize: "$564,000", country: "France", flag: "🇫🇷", gpiRanking: 130 },
        { placing: "3rd", playerName: "Michael Soyza", prize: "$613,000", country: "Malaysia", flag: "🇲🇾", gpiRanking: 75 },
      ]},
      { id: "mc23-e9", name: "Event #9: $50,000 NLH 7-Max", gameType: "NL Hold'em", buyIn: "$50,000", entries: 136, prizePool: "$6,800,000", date: "2023-11-01", status: "completed", results: [
        { placing: "1st", playerName: "Danny Tang", playerId: "danny-tang", prize: "$1,580,000", country: "Hong Kong", flag: "🇭🇰", gpiRanking: 4 },
        { placing: "2nd", playerName: "Isaac Haxton", playerId: "isaac-haxton", prize: "$1,070,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "3rd", playerName: "Chris Brewer", prize: "$585,000", country: "USA", flag: "🇺🇸", gpiRanking: 30 },
      ]},
      { id: "mc23-e10", name: "Event #10: $25,000 NLH 8-Max GG百万赛", gameType: "NL Hold'em", buyIn: "$25,000", entries: 187, prizePool: "$4,675,000", date: "2023-11-02", status: "completed", results: [
        { placing: "1st", playerName: "Webster Lim", prize: "$899,893", country: "Malaysia", flag: "🇲🇾", gpiRanking: 45 },
        { placing: "2nd", playerName: "Hing Yang Chow", prize: "$760,107", country: "Malaysia", flag: "🇲🇾", gpiRanking: 120 },
        { placing: "3rd", playerName: "Ren Lin", prize: "$468,000", country: "USA", flag: "🇺🇸", gpiRanking: 70 },
      ]},
      { id: "mc23-e11", name: "Event #11: $30,000 PLO 赏金赛", gameType: "PLO", buyIn: "$30,000", entries: 74, prizePool: "$2,220,000", date: "2023-11-02", status: "completed", results: [
        { placing: "1st", playerName: "Gavin Andreanoff", prize: "$547,000", country: "UK", flag: "🇬🇧", gpiRanking: 150 },
        { placing: "2nd", playerName: "Quan Zhou", prize: "$389,000", country: "China", flag: "🇨🇳", gpiRanking: 7 },
        { placing: "3rd", playerName: "Laszlo Bujtas", prize: "$299,000", country: "Hungary", flag: "🇭🇺", gpiRanking: 45 },
      ]},
      { id: "mc23-e12", name: "Event #12: $50,000 PLO", gameType: "PLO", buyIn: "$50,000", entries: 72, prizePool: "$3,600,000", date: "2023-11-03", status: "completed", results: [
        { placing: "1st", playerName: "Dan Dvoress", prize: "$956,000", country: "Canada", flag: "🇨🇦", gpiRanking: 30 },
        { placing: "2nd", playerName: "Danny Tang", playerId: "danny-tang", prize: "$664,000", country: "Hong Kong", flag: "🇭🇰", gpiRanking: 4 },
        { placing: "3rd", playerName: "Nacho Barbero", prize: "$439,000", country: "Argentina", flag: "🇦🇷", gpiRanking: 8 },
      ]},
      { id: "mc23-e13", name: "Event #13: $25,000 PLO 涡轮赛（收官）", gameType: "PLO", buyIn: "$25,000", entries: 50, prizePool: "$1,250,000", date: "2023-11-04", status: "completed", results: [
        { placing: "1st", playerName: "Jason Koon", playerId: "jason-koon", prize: "$365,000", country: "USA", flag: "🇺🇸", gpiRanking: 9 },
        { placing: "2nd", playerName: "Eelis Parssinen", prize: "$262,000", country: "Finland", flag: "🇫🇮", gpiRanking: 55 },
        { placing: "3rd", playerName: "Joao Vieira", playerId: "joao-vieira", prize: "$171,000", country: "Portugal", flag: "🇵🇹", gpiRanking: 35 },
      ]},
    ],
  },
  {
    id: "triton-london-2023",
    name: "Triton London 2023",
    year: 2023,
    location: "伦敦",
    startDate: "2023-08-12",
    endDate: "2023-08-28",
    events: 10,
    totalPrizePool: "$55,000,000",
    winner: "Jason Koon",
    imageUrl: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=600&h=300&fit=crop",
    description: "Triton 伦敦站在 Park Lane 举办，Jason Koon 连夺两冠，Phil Ivey 也在短牌赛事中夺冠。",
    venue: "Park Lane",
    highlights: "Jason Koon 连夺三冠创纪录；Phil Ivey 短牌和 NL 各夺一冠；Daniel Negreanu $50K 夺冠",
    gpiNote: "赛事成绩已同步至 GPI 全球扑克指数排名系统",
    eventList: [
      { id: "ld23-60k-sd", name: "Event #3: $60,000 Short Deck Main Event", gameType: "Short Deck", buyIn: "$60,000", entries: 102, prizePool: "$5,916,000", date: "2023-08-16", status: "completed", results: [
        { placing: "1st", playerName: "Jason Koon", playerId: "jason-koon", prize: "$828,000", country: "USA", flag: "🇺🇸", gpiRanking: 1 },
        { placing: "2nd", playerName: "Phil Nagel", playerId: "phil-nagel", prize: "$2,400,000", country: "Austria", flag: "🇦🇹", gpiRanking: 52 },
        { placing: "3rd", playerName: "Fedor Holz", playerId: "fedor-holz", prize: "$560,000", country: "Germany", flag: "🇩🇪", gpiRanking: 9 },
      ]},
      { id: "ld23-60k", name: "Event #5: $60,000 NL Hold'em 7-Max", gameType: "NL Hold'em", buyIn: "$60,000", entries: 89, prizePool: "$5,174,000", date: "2023-08-19", status: "completed", results: [
        { placing: "1st", playerName: "Jason Koon", playerId: "jason-koon", prize: "$1,570,000", country: "USA", flag: "🇺🇸", gpiRanking: 1 },
        { placing: "2nd", playerName: "Cary Katz", playerId: "cary-katz", prize: "$1,080,000", country: "USA", flag: "🇺🇸", gpiRanking: 11 },
        { placing: "3rd", playerName: "Matthias Eibinger", playerId: "matthias-eibinger", prize: "$740,000", country: "Austria", flag: "🇦🇹", gpiRanking: 18 },
      ]},
      { id: "ld23-25k-sd", name: "Event #2: $25,000 Short Deck Turbo", gameType: "Short Deck", buyIn: "$25,000", entries: 198, prizePool: "$4,752,000", date: "2023-08-14", status: "completed", results: [
        { placing: "1st", playerName: "Phil Ivey", playerId: "phil-ivey", prize: "$280,500", country: "USA", flag: "🇺🇸", gpiRanking: 15 },
        { placing: "2nd", playerName: "Ken Hall", playerId: "ken-hall", prize: "$870,000", country: "USA", flag: "🇺🇸", gpiRanking: 65 },
        { placing: "3rd", playerName: "Chris Moneymaker", playerId: "chris-moneymaker", prize: "$520,000", country: "USA", flag: "🇺🇸", gpiRanking: 180 },
      ]},
      { id: "ld23-50k", name: "Event #6: $50,000 NL Hold'em", gameType: "NL Hold'em", buyIn: "$50,000", entries: 95, prizePool: "$4,560,000", date: "2023-08-22", status: "completed", results: [
        { placing: "1st", playerName: "Daniel Negreanu", playerId: "daniel-negreanu", prize: "$1,560,000", country: "Canada", flag: "🇨🇦", gpiRanking: 3 },
        { placing: "2nd", playerName: "Bryn Kenney", playerId: "bryn-kenney", prize: "$1,020,000", country: "USA", flag: "🇺🇸", gpiRanking: 5 },
        { placing: "3rd", playerName: "Stephen Chidwick", playerId: "stephen-chidwick", prize: "$700,000", country: "UK", flag: "🇬🇧", gpiRanking: 12 },
      ]},
      { id: "ld23-60k-turbo", name: "Event #4: $60,000 NL Hold'em Turbo", gameType: "NL Hold'em", buyIn: "$60,000", entries: 95, prizePool: "$5,510,000", date: "2023-08-18", status: "completed", results: [
        { placing: "1st", playerName: "Phil Ivey", playerId: "phil-ivey", prize: "$1,007,000", country: "USA", flag: "🇺🇸", gpiRanking: 15 },
        { placing: "2nd", playerName: "Sam Soverel", playerId: "sam-soverel", prize: "$690,000", country: "USA", flag: "🇺🇸", gpiRanking: 35 },
        { placing: "3rd", playerName: "Danny Tang", playerId: "danny-tang", prize: "$480,000", country: "UK", flag: "🇬🇧", gpiRanking: 28 },
      ]},
    ],
  },
  {
    id: "triton-ncyprus-2023",
    name: "Triton Northern Cyprus 2023",
    year: 2023,
    location: "北塞浦路斯",
    startDate: "2023-10-06",
    endDate: "2023-10-22",
    events: 8,
    totalPrizePool: "$45,000,000",
    winner: "Stephen Chidwick",
    imageUrl: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=600&h=300&fit=crop&sat=-20",
    description: "Triton 北塞浦路斯站在 Merit Crystal Cove 举办，Stephen Chidwick 在 $100,000 主赛事中夺冠。",
    venue: "Merit Crystal Cove",
    highlights: "Stephen Chidwick $100K 主赛事赢 $2.87M；Jason Koon $100K 和 $20K 双冠；Mikita Badziakouski $50K 短牌夺冠",
    gpiNote: "赛事成绩已同步至 GPI 全球扑克指数排名系统",
    eventList: [
      { id: "nc23-100k", name: "Main Event: $100,000 NL Hold'em", gameType: "NL Hold'em", buyIn: "$100,000", entries: 76, prizePool: "$7,296,000", date: "2023-10-16", status: "completed", results: [
        { placing: "1st", playerName: "Jason Koon", playerId: "jason-koon", prize: "$2,451,082", country: "USA", flag: "🇺🇸", gpiRanking: 1 },
        { placing: "2nd", playerName: "Stephen Chidwick", playerId: "stephen-chidwick", prize: "$2,870,000", country: "UK", flag: "🇬🇧", gpiRanking: 12 },
        { placing: "3rd", playerName: "Fedor Holz", playerId: "fedor-holz", prize: "$1,100,000", country: "Germany", flag: "🇩🇪", gpiRanking: 9 },
        { placing: "4th", playerName: "Mikita Badziakouski", playerId: "mikita-badziakouski", prize: "$780,000", country: "Belarus", flag: "🇧🇾", gpiRanking: 7 },
      ]},
      { id: "nc23-50k-sd", name: "Event #4: $50,000 Short Deck", gameType: "Short Deck", buyIn: "$50,000", entries: 95, prizePool: "$4,560,000", date: "2023-10-12", status: "completed", results: [
        { placing: "1st", playerName: "Mikita Badziakouski", playerId: "mikita-badziakouski", prize: "$1,900,000", country: "Belarus", flag: "🇧🇾", gpiRanking: 7 },
        { placing: "2nd", playerName: "Isaac Haxton", playerId: "isaac-haxton", prize: "$1,250,000", country: "USA", flag: "🇺🇸", gpiRanking: 8 },
        { placing: "3rd", playerName: "Phil Nagel", playerId: "phil-nagel", prize: "$850,000", country: "Austria", flag: "🇦🇹", gpiRanking: 52 },
      ]},
      { id: "nc23-20k", name: "Event #1: $20,000 NL Hold'em 7-Max", gameType: "NL Hold'em", buyIn: "$20,000", entries: 245, prizePool: "$4,656,000", date: "2023-10-06", status: "completed", results: [
        { placing: "1st", playerName: "Jason Koon", playerId: "jason-koon", prize: "$663,000", country: "USA", flag: "🇺🇸", gpiRanking: 1 },
        { placing: "2nd", playerName: "Danny Tang", playerId: "danny-tang", prize: "$560,000", country: "UK", flag: "🇬🇧", gpiRanking: 28 },
        { placing: "3rd", playerName: "Matthias Eibinger", playerId: "matthias-eibinger", prize: "$420,000", country: "Austria", flag: "🇦🇹", gpiRanking: 18 },
      ]},
    ],
  },
  {
    id: "triton-vietnam-2023",
    name: "Triton Vietnam 2023",
    year: 2023,
    location: "越南",
    startDate: "2023-03-10",
    endDate: "2023-03-25",
    events: 9,
    totalPrizePool: "$38,000,000",
    winner: "Sam Soverel",
    imageUrl: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=600&h=300&fit=crop&sat=-40",
    description: "Triton 越南站首次在 The Grand Ho Tram Strip 举办。Sam Soverel 在 $25,000 NL Hold'em 中夺冠，赢得 $2,200,000。传奇扑克官网 legendpoker.cn 同步报道了本次赛事。传奇扑克APP同时运营VPL（创投扑克联赛）线上赛事及金币赛。",
    venue: "The Grand Ho Tram Strip",
    highlights: "Triton 越南站首秀；Sam Soverel $25K 夺冠；Jason Koon $50K Turbo 冠军；Stephen Chidwick $50K PLO 夺冠；传奇扑克VPL联赛历届冠军包括姜源(第四届)、谭志雄(第三届)、请叫我库切(2019年度)、明智(2018年度)",
    gpiNote: "赛事成绩已同步至 GPI 全球扑克指数排名系统。传奇扑克名人堂：姜源(第四届VPL年度总决赛冠军)、谭志雄(第三届VPL年度总决赛冠军)",
    eventList: [
      { id: "vn23-25k", name: "Event #2: $25,000 NL Hold'em", gameType: "NL Hold'em", buyIn: "$25,000", entries: 205, prizePool: "$4,920,000", date: "2023-03-12", status: "completed", results: [
        { placing: "1st", playerName: "Sam Soverel", playerId: "sam-soverel", prize: "$2,200,000", country: "USA", flag: "🇺🇸", gpiRanking: 35 },
        { placing: "2nd", playerName: "Stephen Chidwick", playerId: "stephen-chidwick", prize: "$1,050,000", country: "UK", flag: "🇬🇧", gpiRanking: 12 },
        { placing: "3rd", playerName: "Fedor Holz", playerId: "fedor-holz", prize: "$720,000", country: "Germany", flag: "🇩🇪", gpiRanking: 9 },
      ]},
      { id: "vn23-50k-turbo", name: "Event #5: $50,000 NL Hold'em Turbo", gameType: "NL Hold'em", buyIn: "$50,000", entries: 130, prizePool: "$6,240,000", date: "2023-03-18", status: "completed", results: [
        { placing: "1st", playerName: "Jason Koon", playerId: "jason-koon", prize: "$574,000", country: "USA", flag: "🇺🇸", gpiRanking: 1 },
        { placing: "2nd", playerName: "Bryn Kenney", playerId: "bryn-kenney", prize: "$1,450,000", country: "USA", flag: "🇺🇸", gpiRanking: 5 },
        { placing: "3rd", playerName: "Cary Katz", playerId: "cary-katz", prize: "$980,000", country: "USA", flag: "🇺🇸", gpiRanking: 11 },
      ]},
      { id: "vn23-50k-plo", name: "Event #6: $50,000 PLO", gameType: "PLO", buyIn: "$50,000", entries: 110, prizePool: "$5,280,000", date: "2023-03-20", status: "completed", results: [
        { placing: "1st", playerName: "Stephen Chidwick", playerId: "stephen-chidwick", prize: "$890,000", country: "UK", flag: "🇬🇧", gpiRanking: 12 },
        { placing: "2nd", playerName: "Patrik Antonius", playerId: "patrik-antonius", prize: "$1,560,000", country: "Finland", flag: "🇫🇮", gpiRanking: 22 },
        { placing: "3rd", playerName: "Tal Benshabat", playerId: "benshabat", prize: "$480,000", country: "Israel", flag: "🇮🇱", gpiRanking: 42 },
      ]},
    ],
  },
];

export const INITIAL_VIDEOS: Video[] = [
  {
    id: "v1",
    title: "Triton Poker London 2023 - $100,000 Main Event Final Table",
    url: "https://www.youtube.com/watch?v=mGfoLo1-aZY",
    thumbnail: "https://img.youtube.com/vi/mGfoLo1-aZY/maxresdefault.jpg",
    platform: "youtube",
    duration: "5:48:22",
    views: "2.1M",
    publishedAt: "2023-08-28",
    event: "Triton London 2023",
    players: ["Jason Koon", "Stephen Chidwick", "Isaac Haxton"],
    subtitles: "final table, main event, jason koon, stephen chidwick, all-in, river, turn, flop, high roller, premium hands, $100,000",
    tags: ["Main Event", "Final Table", "NL Hold'em"],
    addedAt: "2026-01-15",
    isSaved: true,
  },
  {
    id: "v2",
    title: "Triton Poker Montenegro 2025 - $125K Main Event Final Table",
    url: "https://www.youtube.com/watch?v=qrEHMnQKLYk",
    thumbnail: "https://img.youtube.com/vi/qrEHMnQKLYk/maxresdefault.jpg",
    platform: "youtube",
    duration: "4:15:30",
    views: "3.5M",
    publishedAt: "2025-05-24",
    event: "Triton Montenegro 2025",
    players: ["Jesse Lonis", "Alex Foxen", "Bryn Kenney"],
    subtitles: "montenegro, epic hands, big pots, bluff, jesse lonis, alex foxen, final table, $4.3 million, main event",
    tags: ["Final Table", "Main Event", "Big Pots"],
    addedAt: "2026-02-20",
    isSaved: true,
  },
  {
    id: "v3",
    title: "Phil Ivey SHORT DECK Masterclass - Triton London 2023",
    url: "https://www.youtube.com/watch?v=YjOZqfjFRRg",
    thumbnail: "https://img.youtube.com/vi/YjOZqfjFRRg/maxresdefault.jpg",
    platform: "youtube",
    duration: "1:28:45",
    views: "5.2M",
    publishedAt: "2023-08-15",
    event: "Triton London 2023",
    players: ["Phil Ivey", "Fedor Holz", "Cary Katz"],
    subtitles: "phil ivey, short deck, destroys, amazing play, river, all-in, professional, poker legend, turbo",
    tags: ["Phil Ivey", "Short Deck", "Highlights"],
    addedAt: "2026-03-01",
    isSaved: true,
  },
  {
    id: "v4",
    title: "Triton Monte Carlo 2024 - $200,000 Invitational Final Table",
    url: "https://www.youtube.com/watch?v=dUoEo_qjVRs",
    thumbnail: "https://img.youtube.com/vi/dUoEo_qjVRs/maxresdefault.jpg",
    platform: "youtube",
    duration: "6:30:00",
    views: "1.8M",
    publishedAt: "2024-04-30",
    event: "Triton Monte Carlo 2024",
    players: ["Christoph Vogelsang", "Patrik Antonius", "Mikita Badziakouski"],
    subtitles: "invitational, monte carlo, christoph vogelsang, patrik antonius, full replay, high stakes, $6 million, $200,000",
    tags: ["Invitational", "Full Replay", "High Stakes"],
    addedAt: "2026-03-10",
    isSaved: false,
  },
  {
    id: "v5",
    title: "Daniel Negreanu HUGE BLUFF at Triton Poker",
    url: "https://www.youtube.com/watch?v=_Ajn_Nzz6C0",
    thumbnail: "https://img.youtube.com/vi/_Ajn_Nzz6C0/maxresdefault.jpg",
    platform: "youtube",
    duration: "0:12:30",
    views: "8.7M",
    publishedAt: "2023-08-20",
    event: "Triton London 2023",
    players: ["Daniel Negreanu", "Stephen Chidwick"],
    subtitles: "daniel negreanu, huge bluff, poker face, read, all-in, incredible, triton, high roller, $50,000",
    tags: ["Highlights", "Bluff", "Negreanu"],
    addedAt: "2026-03-15",
    isSaved: true,
  },
  {
    id: "v6",
    title: "Triton Jeju 2024 - $50K Short Deck Main Event Final Table",
    url: "https://www.youtube.com/watch?v=xTSR9fC5w-8",
    thumbnail: "https://img.youtube.com/vi/xTSR9fC5w-8/maxresdefault.jpg",
    platform: "youtube",
    duration: "5:15:20",
    views: "2.8M",
    publishedAt: "2024-03-22",
    event: "Triton Jeju 2024",
    players: ["Stephen Chidwick", "Matthias Eibinger", "Danny Tang"],
    subtitles: "jeju, short deck, stephen chidwick, final table, korea, $50,000, six plus holdem, record breaking",
    tags: ["Main Event", "Final Table", "Short Deck"],
    addedAt: "2026-04-01",
    isSaved: false,
  },
  {
    id: "v7",
    title: "The BIGGEST POT in Poker History - Triton London 2019",
    url: "https://www.youtube.com/watch?v=9CMoOC-urJQ",
    thumbnail: "https://img.youtube.com/vi/9CMoOC-urJQ/maxresdefault.jpg",
    platform: "youtube",
    duration: "0:25:10",
    views: "15.2M",
    publishedAt: "2019-08-15",
    event: "Triton London 2019",
    players: ["Bryn Kenney", "Aaron Zang"],
    subtitles: "bryn kenney, $20.5 million, biggest pot, record, aaron zang, london, triton, all-time high, $1 million buy-in",
    tags: ["Record", "Biggest Pot", "Historic"],
    addedAt: "2026-04-10",
    isSaved: true,
  },
  {
    id: "v8",
    title: "Triton Poker - Top 10 Short Deck Hands of ALL TIME",
    url: "https://www.youtube.com/watch?v=SqDv6P1BFCU",
    thumbnail: "https://img.youtube.com/vi/SqDv6P1BFCU/maxresdefault.jpg",
    platform: "youtube",
    duration: "0:45:00",
    views: "4.3M",
    publishedAt: "2024-01-10",
    event: "Triton Series",
    players: ["Jason Koon", "Phil Ivey", "Fedor Holz", "Patrik Antonius"],
    subtitles: "compilation, short deck, best hands, jason koon, phil ivey, fedor holz, patrik antonius, highlights, top 10",
    tags: ["Compilation", "Short Deck", "Best Hands"],
    addedAt: "2026-04-15",
    isSaved: true,
  },
];
