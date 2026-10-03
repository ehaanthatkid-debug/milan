/**
 * Every photo used on the site, by name. All are free-to-use Unsplash photos
 * (https://unsplash.com/license). To swap in your own photography later,
 * replace a URL here — or drop a file in /public and use "/your-file.jpg".
 */
const u = (id: string) => `https://images.unsplash.com/${id}`;

export const photos = {
  // Garba & Navratri
  garbaDiyasHero: u("photo-1699637924989-d52e2b18f757"),
  garbaDiyasAlt: u("photo-1699637568981-4a79d177e025"),
  garbaTwirl: u("photo-1754244575428-8123e0d27ef3"),
  garbaSelfie: u("photo-1605029271330-95970e826af3"),
  garbaNightGathering: u("photo-1700539690091-fb8d1678f101"),
  dandiyaGirls: u("photo-1769773650757-0c92db57d9ca"),
  dandiyaGirlRed: u("photo-1716655359683-791d415c3f4c"),
  streetDance: u("photo-1774437897284-b2f7c4638c55"),

  // Diwali
  diyaTray: u("photo-1577083753695-e010191bacb5"),
  diyaRangoli: u("photo-1635192592106-77a5aacbe1a3"),
  diyasWarm: u("photo-1636226942649-ee15d2a7ce04"),
  diyasTrio: u("photo-1636619773834-c7e0762ddfe1"),
  diyaHands: u("photo-1605292356183-a77d0a9c9d1d"),
  sparklers: u("photo-1680459520309-189cf5b22212"),
  sparklerHand: u("photo-1700601589928-8937ebf649fa"),
  festivalCanopy: u("photo-1711301633355-d10a31380c44"),

  // Holi
  holiCrowd: u("photo-1603228254119-e6a4d095dc59"),
  holiBurst: u("photo-1496024840928-4c417adf211d"),
  holiSkyCrowd: u("photo-1468234847176-28606331216a"),
  holiHands: u("photo-1519802772250-a52a9af0eacb"),
  holiPalms: u("photo-1551757891-24a8dabd2708"),
  holiPortrait: u("photo-1610313898425-a5c637a940db"),

  // Dance & performance
  stagePerformance: u("photo-1688820661462-a44e4b2770e8"),
  folkDrumDance: u("photo-1759738102510-ec524f666274"),
  classicalDancers: u("photo-1756370256926-e48ca54c5efe"),
  dancersFestiveLights: u("photo-1645264090488-a019de493023"),
  classicalDuo: u("photo-1463592177119-bab2a00f3ccb"),
  sangeetGathering: u("photo-1587012521796-6359d3678f2a"),
  sangeetMehndiParty: u("photo-1709109566592-2762ab28f207"),

  // Weddings
  mandapOutdoor: u("photo-1587271636175-90d58cdad458"),
  mandapBallroom: u("photo-1587271407850-8d438ca9fdf2"),
  mandapAisle: u("photo-1772127822552-ce9ef537bdcf"),
  mandapGarden: u("photo-1772127822562-a898d9f5733c"),
  coupleGoldenLights: u("photo-1722952934708-749c22eb2e58"),
  coupleGoldenLightsAlt: u("photo-1722952934661-dde241aeb591"),
  coupleRiver: u("photo-1630526720753-aa4e71acf67d"),
  coupleCourtyard: u("photo-1665960213508-48f07086d49c"),
  coupleGarlands: u("photo-1764286954620-28029fbae9b6"),
  coupleForestPath: u("photo-1735052711950-c31c729c2a4e"),
  groomPortrait: u("photo-1735052709798-2abcc8c0d6e1"),
  mehndiHandsHeld: u("photo-1621801306185-8c0ccf9c8eb8"),
  coupleStringLights: u("photo-1677770101470-b1995c36b6b7"),

  // Mehndi
  mehndiHand: u("photo-1525135850648-b42365991054"),
  mehndiHands: u("photo-1525135927526-a01d9e5e9484"),
  mehndiBridal: u("photo-1730003873829-09b4b16444c1"),
  mehndiBangles: u("photo-1583878544826-8f8c418033ed"),
  mehndiFeet: u("photo-1640672692872-146ddcd2f23b"),
  mehndiParty: u("photo-1684813910513-11e6b30adc22"),
  mehndiBrideGreen: u("photo-1684814070823-97e0b9e99c69"),
  mehndiBrideFlowers: u("photo-1702378154233-9b870ff8f1b3"),

  // Dhol
  dholProcession: u("photo-1774438464558-a3f4c6aad0a5"),
  dholSolo: u("photo-1774438019306-bd6fc8cc9502"),
  dholPlayer: u("photo-1774438360852-92c4aba88cb6"),
  dholDuo: u("photo-1774438533232-47277d1466e8"),
  dholParade: u("photo-1774438467127-e5ec0ec19298"),
  dholStreet: u("photo-1774438463761-16c224f52fae"),
  dholWoman: u("photo-1774438358674-8c7aab278b8b"),
  dholWomenGroup: u("photo-1774438534037-c2a5e202366b"),

  // DJs
  djCrowdSmoke: u("photo-1496337589254-7e19d01cec44"),
  djBooth: u("photo-1542628682-88321d2a4828"),
  djLaptop: u("photo-1571266028243-d220c6a7edbf"),
  djRedLight: u("photo-1584352604394-c2c6f06e00c1"),
  djPurple: u("photo-1470225620780-dba8ba36b745"),
  djDecks: u("photo-1544785349-c4a5301826fd"),
  djHands: u("photo-1541126274323-dbac58d14741"),

  // Food
  feastSpread: u("photo-1728910156510-77488f19b152"),
  feastTopDown: u("photo-1682862279256-b2a9e4f3d22c"),
  curriesRice: u("photo-1585937421612-70a008356fbe"),
  samosas: u("photo-1601050690597-df0568f70950"),
  dosaThali: u("photo-1668236543090-82eba5ee5976"),
  dosaLeaf: u("photo-1694849789325-914b71ab4075"),
  bananaLeafMeal: u("photo-1625398407796-82650a8c135f"),
  biryaniPlatter: u("photo-1633945274405-b6c8069047b0"),
  biryaniBowl: u("photo-1631515243349-e0cb75fb8d3a"),
  thali: u("photo-1559561724-732dbca7be1e"),
  mithaiCase: u("photo-1758910536889-43ce7b3199fd"),
  jalebi: u("photo-1760263215450-b13943da7e17"),

  // Decor
  marigoldGarlands: u("photo-1789971649652-ae5dfeeaa7b4"),
  marigoldPile: u("photo-1761886839397-12eeddd162d7"),
  marigoldCloseup: u("photo-1765087910207-c3942f93714a"),
  garlandMarket: u("photo-1763184176470-2115508594d3"),
  lotusGarlands: u("photo-1760192158969-fba5f503404f"),
  diyaTableDecor: u("photo-1700544628901-523c8108d864"),
  stringLightsNight: u("photo-1694726361295-6a188bc577b3"),
  bokehLights: u("photo-1605553739113-787ff90ee423"),

  // Clothing — lehengas & gowns
  lehengaBridalRed: u("photo-1759906760638-eeffcb471e53"),
  lehengaRedDetail: u("photo-1724856604254-f7cf4e9c8f72"),
  lehengaRedEmbroidery: u("photo-1724856605022-106d6dd6e842"),
  lehengaRedHem: u("photo-1724856604403-60304b28906c"),
  lehengaBlush: u("photo-1746372283841-dbb3838f9935"),
  lehengaMustard: u("photo-1767955694884-d4bf352c23c2"),
  lehengaLilac: u("photo-1649930055986-ca57250a7fd4"),
  lehengaYellowSkirt: u("photo-1574847872646-abff244bbd87"),
  gownGarnet: u("photo-1668371679302-a8ec781e876e"),
  jewelryBridalPink: u("photo-1756483560049-e7b2208f99a0"),
  jewelryBridalRose: u("photo-1756483571456-6fa86cb1ae53"),
  jewelrySageSaree: u("photo-1688382654723-a7366006519b"),
  jewelryBlush: u("photo-1740431377901-c2f28d50c759"),
  jewelryTeal: u("photo-1631698532383-97ffe7c223c7"),
  lehengaMagenta: u("photo-1756483492084-05cb91948081"),
  lehengaGreen: u("photo-1756483551860-2b312666ac53"),

  // Clothing — sarees
  sareeRaniPink: u("photo-1617627143750-d86bc21e42bb"),
  sareeSeafoam: u("photo-1679006831648-7c9ea12e5807"),
  sareeIvoryGold: u("photo-1729146768775-3662af38016e"),
  sareeCreamRed: u("photo-1678705730064-a7ecbab4b3fb"),
  sareeViolet: u("photo-1641699862936-be9f49b1c38d"),
  sareeNavyRed: u("photo-1610030469983-98e550d6193c"),
  sareeNavySeated: u("photo-1610189012906-4c0aa9b9781e"),
  sareeBlackPink: u("photo-1610030469839-f909584b43f1"),
  sareePeach: u("photo-1727430228383-aa1fb59db8bf"),
  silkFabrics: u("photo-1717585679395-bbe39b5fb6bc"),

  // Clothing — menswear
  sherwaniIvoryRed: u("photo-1760080838961-4208536db385"),
  sherwaniCreamDoor: u("photo-1783188223239-d27dbdd0b95a"),
  sherwaniCreamDoorAlt: u("photo-1783188223691-8a233ee51cd8"),
  sherwaniGarden: u("photo-1785651524113-ba55badb309b"),
  sherwaniGardenAlt: u("photo-1785651524267-211a77e7d0c1"),
  sherwaniNavy: u("photo-1785613590152-63d713bc94b4"),
  sherwaniAisle: u("photo-1744804298516-991bf12847c8"),
  kurtaMint: u("photo-1727835523545-70ee992b5763"),
  kurtaPink: u("photo-1727835523550-18478cacefa2"),
  kurtaButter: u("photo-1701365676249-9d7ab5022dec"),
  kurtaCobalt: u("photo-1770359993283-a2c2f386584e"),

  // Clothing — kids
  kidsNavyLehenga: u("photo-1785393153500-f7be1fc84271"),
  kidsNavyLehengaAlt: u("photo-1785393153529-107a4729b0d2"),
  kidsRedGold: u("photo-1639563853019-779fb4e41844"),

  // Eid & Ramadan
  eidKids: u("photo-1683155586907-3aa3642fda3e"),
  eidPrayerCrowd: u("photo-1740857116467-d404d73bfa28"),
  lampsBazaar: u("photo-1561314945-0562f5b6d2c6"),
  lanternWall: u("photo-1577214407836-1f3a0604ecb2"),
  lampCorridor: u("photo-1589371315231-096e33e8c55e"),
  lanternTwilight: u("photo-1776663158496-c98cbea8289f"),
  lanternGlow: u("photo-1639918065925-eb39272edda2"),
  iftarSpread: u("photo-1661994215679-cde7c2c5c060"),
  iftarPlate: u("photo-1639664342827-2d68822c55c9"),
  datesTasbih: u("photo-1633677658580-2535af0cfb00"),
  teaPour: u("photo-1615403516105-fa537acc9a4b"),
  banglesWrist: u("photo-1724720790533-160d6280fd81"),
  banglesPile: u("photo-1718878404004-6502a550c23b"),
  mehndiCircle: u("photo-1505932794465-147d1f1b2c97"),

  // Music
  harmoniumFlowers: u("photo-1643287928605-b8e1190615fa"),
  tablaStage: u("photo-1524392749318-209b690c93c6"),
  tablaClose: u("photo-1643098979608-1b22614abe88"),
  concertStage: u("photo-1719650932798-bda508a2b209"),

  // Vaisakhi
  gatkaWheel: u("photo-1777151319380-ddb659c2ccd2"),
  gatkaDuel: u("photo-1777150985666-1c4ab5373dac"),
  vaisakhiCrowd: u("photo-1776804096767-5fbdfc52149c"),
  sikhFriends: u("photo-1776803984741-46e8e544bfb1"),

  // Pohela Boishakh
  boishakhMasks: u("photo-1767330855183-4b7f427a32ed"),
  boishakhMask: u("photo-1767330855011-fc628d33caea"),
  bengaliSaree: u("photo-1726076584498-2064363f8b5a"),
  ilishCurry: u("photo-1654863404432-cac67587e25d"),

  // Christmas
  churchLights: u("photo-1765533505980-27298a6abb46"),
  choirAdvent: u("photo-1790342238884-09d15a853050"),
  paperLanterns: u("photo-1619619779333-acd67539ca06"),

  // Kids
  kidsDrawing: u("photo-1617117206620-b01f2919ff86"),
  kidsCraft: u("photo-1605627079912-97c3810a11a4"),
  girlDancing: u("photo-1763735134294-77268e6f1618"),

  // Clothing — sharara & gharara
  shararaPink: u("photo-1603124552648-00e00e27d774"),
  shararaPistachio: u("photo-1641382161690-0fd2643d9868"),
  shararaPistachioAlt: u("photo-1641382158662-b6ef03d53f53"),

  // Seattle
  seattleSunset: u("photo-1589481169991-40ee02888551"),
  seattleRainier: u("photo-1535581652167-3a26c90bbf86"),
  seattleNight: u("photo-1542223616-740d5dff7f56"),
  pikePlace: u("photo-1556305078-869cc33a1b51"),
  weddingPhotographer: u("photo-1629756048377-09540f52caa1"),
} as const;
