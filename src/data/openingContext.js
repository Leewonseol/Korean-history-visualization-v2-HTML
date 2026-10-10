/* 별도 연구 코퍼스: 기존 EVENTS·SOURCES·연결 지표에 편입하지 않는다.
   사실 / 명시적 인용 / 2차 해설의 수준과 사건일-기록일을 보존한다.
   1433년 6월 9일 혼천의 진상자는 정초·박연·김진이다. 장영실을 대체하지 않는다. */
export const CONTEXT_EVIDENCE = [
  {
    id:"ASTRO_1432", date:"1432-00-00", precision:"YEAR", domain:"ASTRONOMY",
    title:"천문 관측기구 제작 사업", status:"SECONDARY_SYNTHESIS",
    actors:["장영실","이천","정초","정인지"],
    description:"1432년 세종의 천문기기 제작 사업에 정초·정인지 등이 문헌 연구, 장영실·이천이 기술자 감독으로 참여했다는 연구 해설.",
    source:"https://contents.history.go.kr/mobile/kc/view.do?levelId=kc_n310300",
    limit:"연 단위 사업 설명. 1432년 12월 9일 장영실이 세종에게 직접 보고했다는 증거는 아니다."
  },
  {
    id:"DEF_1432_1209", date:"1432-12-09", precision:"RECORD_DAY", domain:"DEFENSE",
    title:"여연 침입 치보와 조정 논의", status:"PRIMARY",
    actors:["평안도 감사","박초","세종","황희","맹사성","권진","조말생","최사강"],
    description:"평안도 감사의 보고에 여연 침입과 추격 피해가 기록된다. 같은 기사에서 세종이 크게 노하고 대신들과 명에 대한 대응을 논의했다.",
    source:"https://sillok.history.go.kr/id/wda_11412009_003",
    limit:"1432-12-09은 치보를 기록한 실록 날짜. 실제 현장 침입 시점이나 궁중 안에서의 보고 시각은 확정되지 않는다."
  },
  {
    id:"DEF_1432_1211", date:"1432-12-11", precision:"RECORD_DAY", domain:"DEFENSE_TECH",
    title:"화포 운용과 변경 방어 논의", status:"PRIMARY",
    actors:["세종","이천","최윤덕"],
    description:"변경에 배치된 화포의 운용, 기술자·교습과 철환 공급, 방어 시설 등의 대책을 논의했다.",
    source:"https://sillok.history.go.kr/id/kda_11412011_004",
    limit:"1432-12-09의 궁중 보고 장면에서 이미 이 논의가 끝났다는 뜻이 아니다."
  },
  {
    id:"ASTRO_1433_0609", date:"1433-06-09", precision:"RECORD_DAY", domain:"ASTRONOMY",
    title:"새로 만든 혼천의를 진상", status:"PRIMARY",
    actors:["정초","박연","김진"],
    description:"『세종실록』은 정초·박연·김진 등이 새로 만든 혼천의를 올렸다고 기록한다.",
    source:"https://sillok.history.go.kr/id/kda_11506009_003",
    limit:"장영실의 당일 직접 진상이나 같은 장소에서의 북방 치보 동시 도착을 증명하지 않는다."
  },
  {
    id:"DEF_1433_0609", date:"1433-06-09", precision:"RECORD_DAY", domain:"DEFENSE",
    title:"올량합의 여연 침입과 사망자 구휼 기사", status:"PRIMARY_INDEX",
    actors:["올량합","여연 주민","조선 조정"],
    description:"같은 날의 실록 기사목록에 올량합 16명의 여연 침입, 남녀 각 1명 피살, 구휼 조치가 기록되어 있다.",
    source:"https://sillok.history.go.kr/search/inspectionDayList.do?did=kda_11506009&id=kda_115060",
    limit:"1432-12-09 기록의 여연 침입과 다른 사건이다. 기록일이 같은 것과 궁중 전달 시각이 같은 것은 다르다."
  },
  {
    id:"MED_1431_START", date:"1431-00-00", precision:"YEAR", domain:"MEDICINE",
    title:"『향약집성방』 편찬 착수", status:"PRIMARY_RETROSPECTIVE",
    actors:["유효통","노중례","박윤덕"],
    description:"1433년 6월 11일 완성 기록에 수록된 권채의 서문은 1431년 가을 편찬 작업을 명했다고 회고한다.",
    source:"https://sillok.history.go.kr/id/kda_11506011_003",
    limit:"서문의 회고적 기록. 1432-12-09 또는 1433-06-09 국왕에게 진행 상황을 보고했는지는 미확인."
  },
  {
    id:"MED_1433_0611", date:"1433-06-11", precision:"RECORD_DAY", domain:"MEDICINE",
    title:"『향약집성방』 85권 완성", status:"PRIMARY",
    actors:["유효통","노중례","박윤덕","권채"],
    description:"『세종실록』 1433년 6월 11일에는 『향약집성방』이 완성됐다고 기록한다.",
    source:"https://sillok.history.go.kr/id/kda_11506011_003",
    limit:"1433-06-09에 이미 완성됐다고 확정하거나, 북방 전상자 치료에 적용됐다고 추론하지 않는다."
  }
];

export const LATENT_CONSTRUCTS = [
  { id:"L_TECH", name:"국가의 과학기술 동원 역량", indicators:["기술자 감독","천문기기 제작·진상","군사기술 조달"], status:"HYPOTHESIS_ONLY" },
  { id:"L_DEFENSE", name:"군사기술의 생산·운용 역량", indicators:["화포 운용 논의","교습 및 철환 공급","현장 방어·보고"], status:"HYPOTHESIS_ONLY" },
  { id:"L_MEDICAL", name:"의학 지식의 체계화 역량", indicators:["의관·학자 동원","처방 수집·분류","『향약집성방』 완성"], status:"HYPOTHESIS_ONLY" },
  { id:"L_POLICY", name:"정책 집행·조정 역량", indicators:["국왕·관료 정책 논의","인력·물자 배치","현장 정보 수집"], status:"HYPOTHESIS_ONLY" }
];

export const OPENING_SCENARIOS = [
  {
    id:"DEC_1432", date:"1432-12-09", title:"1432년 12월: 첫 여연 침입 치보",
    fixedIds:["ASTRO_1432","DEF_1432_1209","DEF_1432_1211","MED_1431_START"],
    axes:[
      {key:"briefing",label:"치보 장면 앞의 과학기술 보고",options:[
        {key:"none",label:"기술 보고 장면 없이 치보만"},
        {key:"jang",label:"장영실이 작업을 직접 보고(미확인)"},
        {key:"official",label:"기술 담당 관원이 보고(담당자 미확인)"}
      ]},
      {key:"order",label:"치보와 기술 보고의 순서",options:[
        {key:"standalone",label:"치보만 단독 장면"},
        {key:"before",label:"기술 보고 이전에 치보"},
        {key:"during",label:"기술 보고 도중 치보"},
        {key:"after",label:"기술 보고 이후 치보"}
      ]},
      {key:"medicine",label:"의학서 진행 상황",options:[
        {key:"silent",label:"장면에서 언급하지 않음"},
        {key:"inprogress",label:"편찬 중이라고 언급(미확인 대화)"},
        {key:"complete",label:"이미 완성됐다고 언급(사료 날짜 충돌)"}
      ]},
      {key:"prince",label:"왕세자 배석",options:[
        {key:"absent",label:"왕세자 등장 없음"},
        {key:"present",label:"왕세자가 자리에 있음(배석 미확인)"}
      ]}
    ],
    coreNote:"1432년 천문기기 제작 사업은 연 단위로 확인되고, 치보와 왕의 분노·대신 논의는 12월 9일 기사에 보인다. 두 사건이 한 장소·한 시각에 만났다는 기록은 없다."
  },
  {
    id:"JUN_1433", date:"1433-06-09", title:"1433년 6월: 혼천의 진상과 다른 여연 침입",
    fixedIds:["ASTRO_1433_0609","DEF_1433_0609","MED_1433_0611"],
    axes:[
      {key:"presenter",label:"혼천의 진상 장면의 참석자",options:[
        {key:"trio",label:"정초·박연·김진(실록 기재 인물)"},
        {key:"plusjang",label:"정초·박연·김진 + 장영실(장영실 참석 미확인)"},
        {key:"jangonly",label:"장영실만 진상(실록 기재 인물 삭제)"}
      ]},
      {key:"order",label:"혼천의와 여연 소식의 연출 순서",options:[
        {key:"before",label:"여연 소식이 혼천의 진상 전에 도착"},
        {key:"during",label:"혼천의 진상 도중 여연 소식 도착"},
        {key:"after",label:"혼천의 진상 후 여연 소식 도착"}
      ]},
      {key:"medicine",label:"『향약집성방』 상태",options:[
        {key:"silent",label:"의학서 언급 없음"},
        {key:"inprogress",label:"아직 편찬 중으로 대화(대화 미확인)"},
        {key:"complete",label:"6월 9일 이미 완성됐다고 확정"}
      ]},
      {key:"prince",label:"왕세자 배석",options:[
        {key:"absent",label:"왕세자 등장 없음"},
        {key:"present",label:"왕세자가 참석(당일 배석 미확인)"}
      ]}
    ],
    coreNote:"같은 날짜 실록에 혼천의 진상과 올량합 16명의 여연 침입·구휼 기사가 있다. 별개 기사라는 사실 외에 궁중에서의 실제 전달 순서는 확인되지 않는다."
  }
];
