const KEY="garage_perso_v1";
const empty={vehicles:[],maintenance:[],fuel:[],expenses:[],deadlines:[]};
let data=JSON.parse(localStorage.getItem(KEY)||"null")||empty;
let modalType=null, editId=null;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const money=n=>new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR"}).format(Number(n)||0);
const dateFmt=d=>d?new Date(d).toLocaleDateString("fr-FR"):"—";
function save(){localStorage.setItem(KEY,JSON.stringify(data));renderAll()}
function vehicleName(id){return data.vehicles.find(v=>v.id===id)?.name||"Véhicule supprimé"}
function showPage(page){
  $$(".page").forEach(x=>x.classList.toggle("active",x.id===page));
  $$(".nav-btn").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
  $("#pageTitle").textContent={dashboard:"Tableau de bord",vehicles:"Mes véhicules",maintenance:"Entretiens",fuel:"Carburant",expenses:"Dépenses",deadlines:"Échéances"}[page];
}
$$(".nav-btn").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
$$("[data-page-link]").forEach(b=>b.onclick=()=>showPage(b.dataset.pageLink));
$("#quickAdd").onclick=$("#addVehicleBtn").onclick=()=>openModal("vehicle");
$("#addMaintenanceBtn").onclick=()=>openModal("maintenance");
$("#addFuelBtn").onclick=()=>openModal("fuel");
$("#addExpenseBtn").onclick=()=>openModal("expense");
$("#addDeadlineBtn").onclick=()=>openModal("deadline");

function vehicleOptions(selected=""){return `<option value="">Choisir...</option>`+data.vehicles.map(v=>`<option value="${v.id}" ${v.id===selected?"selected":""}>${esc(v.name)}</option>`).join("")}
function openModal(type,id=null){
  modalType=type;editId=id;
  const obj=id?data[type==="vehicle"?"vehicles":type==="maintenance"?"maintenance":type==="fuel"?"fuel":type==="expense"?"expenses":"deadlines"].find(x=>x.id===id):{};
  $("#modalTitle").textContent=(id?"Modifier ":"Ajouter ")+({vehicle:"un véhicule",maintenance:"un entretien",fuel:"un plein",expense:"une dépense",deadline:"une échéance"}[type]);
  const bodies={
  vehicle:`<div class="form-grid">
    ${field("Nom / modèle","name",obj.name||"","ex: C4 1.6 HDi 90")}
    ${field("Immatriculation","plate",obj.plate||"","AB-123-CD")}
    ${field("Marque","brand",obj.brand||"","Citroën")}
    ${field("Modèle","model",obj.model||"","C4")}
    ${field("Année","year",obj.year||"","2005","number")}
    ${field("Kilométrage actuel","km",obj.km||"","346000","number")}
    ${field("Carburant","fuelType",obj.fuelType||"Diesel","","select",["Diesel","Essence","Hybride","Électrique","GPL","Autre"])}
    ${field("Puissance (ch)","power",obj.power||"","90","number")}
  </div>`,
  maintenance:`<div class="form-grid">
    ${field("Véhicule","vehicleId",obj.vehicleId||"","","select",null,vehicleOptions(obj.vehicleId))}
    ${field("Date","date",obj.date||new Date().toISOString().slice(0,10),"","date")}
    ${field("Intervention","title",obj.title||"","Vidange, freins...")}
    ${field("Kilométrage","km",obj.km||"","200000","number")}
    ${field("Coût","cost",obj.cost||"","150","number")}
    ${field("Notes","notes",obj.notes||"","Pièces changées...","text",null,"",true)}
  </div>`,
  fuel:`<div class="form-grid">
    ${field("Véhicule","vehicleId",obj.vehicleId||"","","select",null,vehicleOptions(obj.vehicleId))}
    ${field("Date","date",obj.date||new Date().toISOString().slice(0,10),"","date")}
    ${field("Litres","liters",obj.liters||"","50","number")}
    ${field("Prix / litre","price",obj.price||"","1.60","number")}
    ${field("Kilométrage","km",obj.km||"","200000","number")}
  </div>`,
  expense:`<div class="form-grid">
    ${field("Véhicule","vehicleId",obj.vehicleId||"","","select",null,vehicleOptions(obj.vehicleId))}
    ${field("Date","date",obj.date||new Date().toISOString().slice(0,10),"","date")}
    ${field("Catégorie","category",obj.category||"Entretien","","select",["Carburant","Entretien","Réparation","Assurance","Contrôle technique","Pneus","Pièces","Autre"])}
    ${field("Description","description",obj.description||"","Ex: assurance annuelle")}
    ${field("Montant","amount",obj.amount||"","500","number")}
  </div>`,
  deadline:`<div class="form-grid">
    ${field("Véhicule","vehicleId",obj.vehicleId||"","","select",null,vehicleOptions(obj.vehicleId))}
    ${field("Échéance","title",obj.title||"","Contrôle technique")}
    ${field("Date","date",obj.date||"","", "date")}
    ${field("Notes","notes",obj.notes||"","Rappel important...","text",null,"",true)}
  </div>`};
  $("#modalBody").innerHTML=bodies[type]; $("#modal").showModal();
}
function field(label,name,value="",placeholder="",type="text",opts=null,custom="",full=false){
  let control=custom|| (type==="select" ? `<select name="${name}">${opts?opts.map(o=>`<option ${o===value?"selected":""}>${o}</option>`).join(""):""}</select>`:`<input type="${type}" name="${name}" value="${esc(value)}" placeholder="${placeholder}">`);
  return `<div class="field ${full?"full":""}"><label>${label}</label>${control}</div>`;
}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
$("#modalForm").addEventListener("submit",e=>{
 e.preventDefault(); const fd=new FormData(e.currentTarget), o=Object.fromEntries(fd.entries());
 o.id=editId||uid();
 if(modalType==="fuel")o.total=Number(o.liters||0)*Number(o.price||0);
 if(modalType==="vehicle"){o.km=Number(o.km||0);const i=data.vehicles.findIndex(x=>x.id===o.id);i>=0?data.vehicles[i]=o:data.vehicles.push(o)}
 else {const key={maintenance:"maintenance",fuel:"fuel",expense:"expenses",deadline:"deadlines"}[modalType]; const i=data[key].findIndex(x=>x.id===o.id);i>=0?data[key][i]=o:data[key].push(o)}
 $("#modal").close();save();
});
function remove(type,id){if(!confirm("Supprimer cet élément ?"))return;data[type]=data[type].filter(x=>x.id!==id);save()}
function renderAll(){renderDashboard();renderVehicles();renderMaintenance();renderFuel();renderExpenses();renderDeadlines()}
function renderDashboard(){
 const totalExp=data.expenses.reduce((a,x)=>a+Number(x.amount||0),0)+data.fuel.reduce((a,x)=>a+Number(x.total||0),0);
 $("#kpis").innerHTML=[["Véhicules",data.vehicles.length,"dans ton parc"],["Dépenses totales",money(totalExp),"toutes catégories"],["Entretiens",data.maintenance.length,"enregistrés"],["Kilométrage total",data.vehicles.reduce((a,x)=>a+Number(x.km||0),0).toLocaleString("fr-FR")+" km","cumul indiqué"]].map(k=>`<div class="kpi"><span>${k[0]}</span><strong>${k[1]}</strong><span>${k[2]}</span></div>`).join("");
 const ds=[...data.deadlines].sort((a,b)=>String(a.date).localeCompare(String(b.date))).slice(0,5);
 $("#dashDeadlines").innerHTML=ds.length?ds.map(d=>`<div class="list-item"><div><strong>${esc(d.title)}</strong><div class="muted">${vehicleName(d.vehicleId)}</div></div><span>${dateFmt(d.date)}</span></div>`).join(""):`<div class="empty">Aucune échéance.</div>`;
 const ms=[...data.maintenance].sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,5);
 $("#dashMaintenance").innerHTML=ms.length?ms.map(m=>`<div class="list-item"><div><strong>${esc(m.title)}</strong><div class="muted">${vehicleName(m.vehicleId)} · ${Number(m.km||0).toLocaleString("fr-FR")} km</div></div><span>${money(m.cost)}</span></div>`).join(""):`<div class="empty">Aucun entretien.</div>`;
}
function renderVehicles(){
 $("#vehicleGrid").innerHTML=data.vehicles.length?data.vehicles.map(v=>`<article class="vehicle-card"><div class="vehicle-icon">🚘</div><h3>${esc(v.name)}</h3><p>${esc(v.plate||"Sans immatriculation")}</p><div class="vehicle-meta"><div class="meta"><small>Kilométrage</small><b>${Number(v.km||0).toLocaleString("fr-FR")} km</b></div><div class="meta"><small>Carburant</small><b>${esc(v.fuelType||"—")}</b></div><div class="meta"><small>Puissance</small><b>${v.power||"—"} ch</b></div><div class="meta"><small>Année</small><b>${v.year||"—"}</b></div></div><div class="card-actions"><button class="secondary" onclick="openModal('vehicle','${v.id}')">Modifier</button><button class="danger" onclick="remove('vehicles','${v.id}')">Supprimer</button></div></article>`).join(""):`<div class="panel empty">Aucun véhicule. Ajoute ton premier véhicule pour commencer.</div>`;
}
function renderMaintenance(){$("#maintenanceTable").innerHTML=data.maintenance.length?data.maintenance.sort((a,b)=>String(b.date).localeCompare(String(a.date))).map(m=>`<tr><td>${dateFmt(m.date)}</td><td>${esc(vehicleName(m.vehicleId))}</td><td>${esc(m.title)}</td><td>${Number(m.km||0).toLocaleString("fr-FR")} km</td><td>${money(m.cost)}</td><td><button class="delete" onclick="remove('maintenance','${m.id}')">Supprimer</button></td></tr>`).join(""):`<tr><td colspan="6" class="empty">Aucun entretien.</td></tr>`}
function renderFuel(){
 const total=data.fuel.reduce((a,x)=>a+Number(x.total||0),0), liters=data.fuel.reduce((a,x)=>a+Number(x.liters||0),0);
 $("#fuelStats").innerHTML=[["Total carburant",money(total)],["Litres",liters.toFixed(1)+" L"],["Prix moyen/L",liters?money(total/liters):"—"]].map(k=>`<div class="kpi"><span>${k[0]}</span><strong>${k[1]}</strong></div>`).join("");
 $("#fuelTable").innerHTML=data.fuel.length?data.fuel.sort((a,b)=>String(b.date).localeCompare(String(a.date))).map(f=>`<tr><td>${dateFmt(f.date)}</td><td>${esc(vehicleName(f.vehicleId))}</td><td>${f.liters} L</td><td>${money(f.price)}</td><td>${money(f.total)}</td><td>${Number(f.km||0).toLocaleString("fr-FR")} km</td><td><button class="delete" onclick="remove('fuel','${f.id}')">Supprimer</button></td></tr>`).join(""):`<tr><td colspan="7" class="empty">Aucun plein enregistré.</td></tr>`;
}
function renderExpenses(){
 const total=data.expenses.reduce((a,x)=>a+Number(x.amount||0),0);
 $("#expenseStats").innerHTML=[["Dépenses",money(total)],["Nombre",data.expenses.length],["Moyenne",data.expenses.length?money(total/data.expenses.length):"—"]].map(k=>`<div class="kpi"><span>${k[0]}</span><strong>${k[1]}</strong></div>`).join("");
 $("#expenseTable").innerHTML=data.expenses.length?data.expenses.sort((a,b)=>String(b.date).localeCompare(String(a.date))).map(x=>`<tr><td>${dateFmt(x.date)}</td><td>${esc(vehicleName(x.vehicleId))}</td><td>${esc(x.category)}</td><td>${esc(x.description)}</td><td>${money(x.amount)}</td><td><button class="delete" onclick="remove('expenses','${x.id}')">Supprimer</button></td></tr>`).join(""):`<tr><td colspan="6" class="empty">Aucune dépense.</td></tr>`;
}
function renderDeadlines(){
 const now=new Date(), grid=data.deadlines.map(d=>{const days=Math.ceil((new Date(d.date)-now)/86400000);const cls=days<0?"overdue":days<=30?"soon":"";return `<article class="deadline ${cls}"><span class="muted">${esc(vehicleName(d.vehicleId))}</span><h3>${esc(d.title)}</h3><div class="date">${dateFmt(d.date)}</div><span>${days<0?`En retard de ${Math.abs(days)} jours`:days===0?"Aujourd'hui":`Dans ${days} jours`}</span><div style="margin-top:14px"><button class="delete" onclick="remove('deadlines','${d.id}')">Supprimer</button></div></article>`}).join("");
 $("#deadlineGrid").innerHTML=grid||`<div class="panel empty">Aucune échéance.</div>`;
}
$("#exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="garage-perso-sauvegarde.json";a.click();URL.revokeObjectURL(a.href)};
$("#importInput").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{data=JSON.parse(r.result);save();alert("Données importées.")}catch{alert("Fichier invalide.")}};r.readAsText(f)};
$("#resetBtn").onclick=()=>{if(confirm("Effacer toutes les données locales ?")){data=structuredClone(empty);save()}};
renderAll();
