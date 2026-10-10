/* Independent historical opening-worlds panel: CSP combinations, never probabilities. */
import { enumerateOpeningWorlds, worldReadable, worldScenarios } from "../analysis/openingWorlds.js";
import { LATENT_CONSTRUCTS } from "../data/openingContext.js";
import { esc } from "./format.js";

const ui = { scenarioId:"DEC_1432", filter:"accepted", page:0, selected:null };
const PAGE_SIZE = 8;
const e = (v) => esc(String(v ?? ""));
const tags = (tag, items) => "<"+tag+">"+items.join("")+"</"+tag+">";
const btn = (attrs, text) => "<button type=\"button\" class=\"btn btn-sm\" "+attrs+">"+text+"</button>";

export function renderOpeningWorlds(el) {
  const result = enumerateOpeningWorlds(ui.scenarioId);
  const scenario = result.scenario;
  const list = ui.filter === "accepted" ? result.accepted : result.excluded;
  const pages = Math.max(1,Math.ceil(list.length/PAGE_SIZE));
  ui.page=Math.max(0,Math.min(ui.page,pages-1));
  const subset=list.slice(ui.page*PAGE_SIZE,(ui.page+1)*PAGE_SIZE);
  const picked=list.find(w=>w.id===ui.selected)||subset[0]||null;
  ui.selected=picked?.id||null;
  function row(w,i) {
    const label = worldReadable(scenario,w).map(x=>x.choice).join(" / ");
    const status = w.accepted ? ("미확인 가정 "+w.assumptions.length+"건") : ("제외 사유 "+w.errors.length+"건");
    return "<tr><td>"+btn('data-world-id="'+e(w.id)+'"',"W"+(ui.page*PAGE_SIZE+i+1))+"</td><td>"+e(label)+"</td><td>"+e(status)+"</td></tr>";
  }
  const scenarios=worldScenarios().map(s=>"<option value=\""+e(s.id)+"\""+(s.id===ui.scenarioId?" selected":"")+">"+e(s.title)+"</option>").join("");
  const sources=result.anchorEvidence.map(a=>"<li><a href=\""+e(a.source)+"\" target=\"_blank\" rel=\"noopener noreferrer\">"+e(a.title)+"</a>"
    +"<div class=\"muted small\">"+e(a.status)+" · "+e(a.date)+" · "+e(a.limit)+"</div></li>");
  const constructs=LATENT_CONSTRUCTS.map(c=>"<tr><td>"+e(c.name)+"</td><td>"+c.indicators.map(e).join(" · ")+"</td></tr>");
  let selectedMarkup="";
  if(picked) {
    const opts=worldReadable(scenario,picked).map(x=>"<tr><th>"+e(x.axis)+"</th><td>"+e(x.choice)+"</td></tr>");
    const reasons=picked.accepted?picked.assumptions:picked.errors;
    selectedMarkup="<h3>선택한 세계: "+e(picked.id)+"</h3><table class=\"metric-table\">"+opts.join("")+"</table>"
      +"<h4>"+(picked.accepted?"직접 확인되지 않은 각색 요소":"제외된 근거")+"</h4>"
      +(reasons.length?tags("ul",reasons.map(x=>"<li>"+e(x)+"</li>")):"<p class=\"muted small\">추가로 가정한 배석·대화 없음.</p>");
  }
  el.innerHTML = "<h2>오프닝 가능세계 · 과학기술/의료/군사</h2>"
    +"<p class=\"note\">별도 연구용 제약충족 조합 계산기입니다. 기존 검증 사건과 중심성 지표는 변경하지 않습니다. <b>사후확률이나 역사적 발생 가능성을 추정하지 않습니다.</b></p>"
    +"<label for=\"worldScenario\">오프닝 시점</label><select id=\"worldScenario\" style=\"width:100%\">"+scenarios+"</select>"
    +"<p class=\"muted small\">"+e(scenario.coreNote)+"</p>"
    +"<p><b>전체 "+result.allCount+"개</b> · 사료 서술과 양립 "+result.validCount+"개 · 제외 "+result.excludedCount+"개</p>"
    +"<p class=\"muted small\">모든 선택 축 조합을 생성하고 규칙으로 배제합니다. 남은 후보는 미관측 장면이 실제로 일어났음을 증명하지 않습니다.</p>"
    +"<div class=\"btn-row\">"
    +btn('data-world-filter="accepted"'+(ui.filter==="accepted"?' aria-current="true"':""),"남은 후보 "+result.validCount)
    +btn('data-world-filter="excluded"'+(ui.filter==="excluded"?' aria-current="true"':""),"제외된 후보 "+result.excludedCount)+"</div>"
    +"<div style=\"overflow-x:auto\"><table class=\"metric-table\"><tr><th>세계</th><th>선택값</th><th>검증 상태</th></tr>"+subset.map(row).join("")+"</table></div>"
    +"<div class=\"btn-row\">"+btn('data-world-page="-1"'+(ui.page===0?" disabled":""),"이전")
    +"<span class=\"small\">"+(ui.page+1)+" / "+pages+"</span>"
    +btn('data-world-page="1"'+(ui.page>=pages-1?" disabled":""),"다음")+"</div>"
    +selectedMarkup
    +"<h3>사료와 사건 범위</h3>"+tags("ul",sources)
    +"<h3>잠재구성개념 후보 (아직 통계 추정 전)</h3><table class=\"metric-table\"><tr><th>구성개념</th><th>관측 지표</th></tr>"+constructs.join("")+"</table>"
    +"<p class=\"warn small\">표본 수와 식별 제약이 충족되지 않았으므로 요인부하량·영향력·세계별 확률을 산출하지 않습니다. 같은 기사일은 같은 궁중 장면이나 인과관계를 의미하지 않습니다.</p>";
  el.onchange=(ev)=>{
    if(ev.target.id==="worldScenario"){ui.scenarioId=ev.target.value;ui.page=0;ui.selected=null;renderOpeningWorlds(el);}
  };
  el.onclick=(ev)=>{
    const t=ev.target.closest("button"); if(!t) return;
    if(t.dataset.worldFilter){ui.filter=t.dataset.worldFilter;ui.page=0;ui.selected=null;renderOpeningWorlds(el);}
    else if(t.dataset.worldPage){ui.page+=Number(t.dataset.worldPage);ui.selected=null;renderOpeningWorlds(el);}
    else if(t.dataset.worldId){ui.selected=t.dataset.worldId;renderOpeningWorlds(el);}
  };
}
