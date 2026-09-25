const STAGES = ["Prospectado","Respondeu","Em atendimento","Interessado","Orçamento / negociação","Venda fechada","Não avançou"];
const SERVICES = [
  {name:"Sites profissionais",icon:"▣",description:"Sites personalizados para apresentar empresas, serviços, produtos e formas de contato.",note:"Escopo, prazo e preço definidos com Igor."},
  {name:"Sites expressos",icon:"⌘",description:"Projetos digitais mais simples, com escopo definido e foco em uma entrega objetiva.",note:"Condições comerciais a confirmar."},
  {name:"Artes para Instagram",icon:"▧",description:"Materiais visuais para promoções, divulgação de produtos e comunicação comercial.",note:"Quantidade e formatos a combinar."},
  {name:"Cardápios e catálogos digitais",icon:"▤",description:"Apresentação organizada de produtos, serviços, opções e informações para clientes.",note:"Conteúdo fornecido e revisado com o cliente."},
  {name:"Planilhas personalizadas",icon:"▦",description:"Planilhas de organização, acompanhamento e controle para necessidades de pequenos negócios.",note:"Funcionalidades definidas conforme a necessidade."}
];
const initialLeads = [
 {id:1,company:"Oficina Exemplo",phone:"(41) 99999-1001",segment:"Automotivo",service:"Sites profissionais",stage:"Interessado",source:"Google Maps",updated:"2026-09-22",replied:true,notes:"Pediu para conhecer um exemplo demonstrativo.",value:0},
 {id:2,company:"Estética Modelo",phone:"(41) 99999-1002",segment:"Estética",service:"Artes para Instagram",stage:"Respondeu",source:"Indicação",updated:"2026-09-21",replied:true,notes:"Perguntou sobre opções de artes.",value:0},
 {id:3,company:"Mercado Fictício",phone:"(41) 99999-1003",segment:"Varejo",service:"Catálogos digitais",stage:"Prospectado",source:"Google Maps",updated:"2026-09-20",replied:false,notes:"Contato de demonstração.",value:0},
 {id:4,company:"Studio Demonstração",phone:"(41) 99999-1004",segment:"Serviços",service:"Sites expressos",stage:"Orçamento / negociação",source:"Instagram",updated:"2026-09-19",replied:true,notes:"Solicitou detalhes para orçamento; Igor deve assumir.",value:0},
 {id:5,company:"Café Ilustrativo",phone:"(41) 99999-1005",segment:"Alimentação",service:"Sites profissionais",stage:"Não avançou",source:"Google Maps",updated:"2026-09-18",replied:true,notes:"Exemplo fictício de oportunidade encerrada.",value:0},
 {id:6,company:"Comercial Teste",phone:"(41) 99999-1006",segment:"Comércio",service:"Planilhas personalizadas",stage:"Venda fechada",source:"Indicação",updated:"2026-09-17",replied:true,notes:"Venda fictícia apenas para demonstrar os indicadores.",value:400}
];
let leads = loadLeads();
let activeView = "dashboard";
function loadLeads(){try{const saved=localStorage.getItem("ig-sites-crm-leads");return saved?JSON.parse(saved):structuredClone(initialLeads)}catch{return structuredClone(initialLeads)}}
function save(){localStorage.setItem("ig-sites-crm-leads",JSON.stringify(leads))}
function money(n){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(n||0)}
function escapeHTML(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function initials(s){return s.split(/\s+/).slice(0,2).map(x=>x[0]||"").join("").toUpperCase()}
function stageClass(stage){if(stage==="Venda fechada")return"green";if(stage==="Interessado")return"purple";if(stage==="Respondeu"||stage==="Em atendimento")return"teal";if(stage==="Orçamento / negociação")return"blue";return""}
function countStage(stage){return leads.filter(x=>x.stage===stage).length}
function render(){
 document.getElementById("nav-client-count").textContent=leads.length;
 document.getElementById("stat-total").textContent=leads.length;
 document.getElementById("stat-replied").textContent=leads.filter(x=>x.replied).length;
 document.getElementById("stat-interested").textContent=leads.filter(x=>["Interessado","Orçamento / negociação"].includes(x.stage)).length;
 document.getElementById("stat-sales").textContent=countStage("Venda fechada");
 renderBars("dashboard-funnel",["Prospectado","Respondeu","Em atendimento","Interessado","Orçamento / negociação","Venda fechada"]);
 renderRecent();renderClients();renderPipeline();renderCatalog();renderReports();
}
function renderBars(id,stages){
 const max=Math.max(1,...stages.map(countStage));
 document.getElementById(id).innerHTML=stages.map((s,i)=>`<div class="funnel-row"><span>${escapeHTML(s)}</span><div class="bar-track"><div class="bar-fill" style="width:${countStage(s)/max*100}%"></div></div><strong>${countStage(s)}</strong></div>`).join("");
}
function renderRecent(){
 const arr=[...leads].sort((a,b)=>b.updated.localeCompare(a.updated)).slice(0,5);
 document.getElementById("recent-list").innerHTML=arr.length?arr.map(x=>`<div class="recent-item"><div class="company-avatar">${escapeHTML(initials(x.company))}</div><div class="recent-info"><strong>${escapeHTML(x.company)}</strong><small>${escapeHTML(x.service)} · ${escapeHTML(x.updated)}</small></div><span class="status-tag ${stageClass(x.stage)}">${escapeHTML(x.stage)}</span></div>`).join(""):`<p class="muted">Nenhum contato cadastrado.</p>`;
}
function populateStages(){
 const opts=STAGES.map(s=>`<option value="${escapeHTML(s)}">${escapeHTML(s)}</option>`).join("");
 document.getElementById("stage-filter").innerHTML='<option value="">Todas as etapas</option>'+opts;
 document.getElementById("form-stage").innerHTML=opts;
 document.getElementById("service-select").innerHTML=SERVICES.map(s=>`<option>${escapeHTML(s.name)}</option>`).join("");
}
function renderClients(){
 const q=(document.getElementById("client-search").value||"").toLowerCase();
 const stage=document.getElementById("stage-filter").value;
 const filtered=leads.filter(x=>(!stage||x.stage===stage)&&[x.company,x.phone,x.service,x.segment].some(v=>(v||"").toLowerCase().includes(q)));
 document.getElementById("clients-table").innerHTML=filtered.map(x=>`<tr><td><div class="table-company"><div class="company-avatar">${escapeHTML(initials(x.company))}</div><div><strong>${escapeHTML(x.company)}</strong><small>${escapeHTML(x.phone||"Telefone não informado")} · ${escapeHTML(x.segment||"Segmento não informado")}</small></div></div></td><td>${escapeHTML(x.service)}</td><td><select class="stage-select" aria-label="Etapa de ${escapeHTML(x.company)}" data-stage-id="${x.id}">${STAGES.map(s=>`<option ${s===x.stage?"selected":""}>${escapeHTML(s)}</option>`).join("")}</select></td><td>${escapeHTML(x.updated)}</td><td><button class="icon-btn" data-detail="${x.id}" title="Ver observações">•••</button></td></tr>`).join("");
 document.getElementById("empty-clients").classList.toggle("hidden",filtered.length!==0);
}
function renderPipeline(){
 const columns=["Prospectado","Respondeu","Interessado","Orçamento / negociação","Venda fechada","Não avançou"];
 document.getElementById("pipeline-board").innerHTML=columns.map(stage=>`<div class="pipeline-column"><div class="column-head"><span>${escapeHTML(stage)}</span><span>${countStage(stage)}</span></div>${leads.filter(x=>x.stage===stage).map(x=>`<div class="lead-card"><strong>${escapeHTML(x.company)}</strong><p>${escapeHTML(x.service)}<br>${escapeHTML(x.phone||"Sem telefone")}</p><select data-stage-id="${x.id}" aria-label="Alterar etapa">${STAGES.map(s=>`<option ${s===x.stage?"selected":""}>${escapeHTML(s)}</option>`).join("")}</select></div>`).join("")||'<p class="muted">Sem oportunidades nesta etapa.</p>'}</div>`).join("");
}
function renderCatalog(){document.getElementById("catalog-grid").innerHTML=SERVICES.map(s=>`<article class="service-card"><div class="service-icon">${s.icon}</div><h3>${escapeHTML(s.name)}</h3><p>${escapeHTML(s.description)}</p><div class="service-note">${escapeHTML(s.note)}</div></article>`).join("")}
function renderReports(){
 const total=leads.length, replied=leads.filter(x=>x.replied).length, interested=leads.filter(x=>["Interessado","Orçamento / negociação","Venda fechada"].includes(x.stage)).length, sales=leads.filter(x=>x.stage==="Venda fechada"), revenue=sales.reduce((n,x)=>n+(Number(x.value)||0),0);
 const pct=n=>total?Math.round(n/total*100)+"%":"0%";
 document.getElementById("report-response").textContent=pct(replied);
 document.getElementById("report-interest").textContent=pct(interested);
 document.getElementById("report-conversion").textContent=pct(sales.length);
 document.getElementById("report-revenue").textContent=money(revenue);
 renderBars("report-stages",STAGES);
 const noPhone=leads.filter(x=>!x.phone).length, noSegment=leads.filter(x=>!x.segment).length, human=leads.filter(x=>["Interessado","Orçamento / negociação"].includes(x.stage)).length;
 document.getElementById("data-quality").innerHTML=[["Contatos sem telefone",noPhone],["Contatos sem segmento",noSegment],["Oportunidades para Igor acompanhar",human],["Vendas registradas",sales.length]].map(([a,b])=>`<div class="quality-row"><span>${a}</span><strong>${b}</strong></div>`).join("");
}
function setView(view){
 activeView=view;document.querySelectorAll(".view").forEach(el=>el.classList.toggle("active",el.id==="view-"+view));
 document.querySelectorAll(".nav-link").forEach(el=>el.classList.toggle("active",el.dataset.view===view));
 const label={dashboard:"Visão geral",clients:"Clientes",pipeline:"Funil de vendas",catalog:"Catálogo",reports:"Relatórios",settings:"Configurações"};
 document.getElementById("page-crumb").textContent=label[view]||"Visão geral";
 document.getElementById("sidebar").classList.remove("open");
}
function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600)}
function openDialog(){document.getElementById("client-form").reset();document.getElementById("client-dialog").showModal()}
document.addEventListener("click",e=>{
 const nav=e.target.closest("[data-view]");if(nav)setView(nav.dataset.view);
 const go=e.target.closest("[data-go]");if(go)setView(go.dataset.go);
 if(e.target.closest("[data-open-add]"))openDialog();
 const detail=e.target.closest("[data-detail]");if(detail){const x=leads.find(a=>a.id===Number(detail.dataset.detail));alert(`${x.company}\n${x.phone||"Sem telefone"}\nEtapa: ${x.stage}\nOrigem: ${x.source||"Não informada"}\n\nObservações:\n${x.notes||"Nenhuma"}`)}
});
document.addEventListener("change",e=>{
 if(e.target.matches("[data-stage-id]")){const x=leads.find(a=>a.id===Number(e.target.dataset.stageId));if(x){x.stage=e.target.value;x.updated=new Date().toISOString().slice(0,10);if(x.stage==="Respondeu"||x.stage==="Interessado"||x.stage==="Orçamento / negociação"||x.stage==="Venda fechada")x.replied=true;save();render();toast("Etapa atualizada.")}}
});
document.getElementById("client-search").addEventListener("input",renderClients);
document.getElementById("stage-filter").addEventListener("change",renderClients);
document.getElementById("client-form").addEventListener("submit",e=>{
 e.preventDefault();const f=new FormData(e.currentTarget);const company=(f.get("company")||"").trim();if(!company)return;
 leads.unshift({id:Date.now(),company,phone:(f.get("phone")||"").trim(),segment:(f.get("segment")||"").trim(),service:f.get("service"),stage:f.get("stage"),source:(f.get("source")||"").trim(),updated:new Date().toISOString().slice(0,10),replied:["Respondeu","Em atendimento","Interessado","Orçamento / negociação","Venda fechada"].includes(f.get("stage")),notes:(f.get("notes")||"").trim(),value:0});
 save();render();document.getElementById("client-dialog").close();setView("clients");toast("Cliente cadastrado neste navegador.");
});
document.getElementById("close-dialog").addEventListener("click",()=>document.getElementById("client-dialog").close());
document.getElementById("cancel-dialog").addEventListener("click",()=>document.getElementById("client-dialog").close());
document.getElementById("mobile-menu").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("reset-demo").addEventListener("click",()=>{if(confirm("Restaurar os dados fictícios? Os registros adicionados neste navegador serão removidos.")){leads=structuredClone(initialLeads);save();render();toast("Dados fictícios restaurados.")}});
document.getElementById("export-csv").addEventListener("click",()=>{
 const cols=["Empresa","Telefone","Segmento","Serviço","Etapa","Origem","Atualizado","Respondeu","Observações","Valor"];
 const rows=leads.map(x=>[x.company,x.phone,x.segment,x.service,x.stage,x.source,x.updated,x.replied?"Sim":"Não",x.notes,x.value]);
 const csv=[cols,...rows].map(row=>row.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(";")).join("\r\n");
 const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="ig-sites-crm-contatos.csv";a.click();URL.revokeObjectURL(url);toast("Arquivo CSV exportado.");
});
populateStages();render();