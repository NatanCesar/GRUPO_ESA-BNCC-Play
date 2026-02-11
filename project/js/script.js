const roles = ["Frontend","Backend","DevOps","QA","UX/UI","Dados","Segurança"];


const demands = [
{t:"API de pagamentos lenta", r:"Backend", tip:"Backend cuida de APIs"},
{t:"Layout quebrado no mobile", r:"Frontend", tip:"Frontend ajusta interface"},
{t:"Pipeline de deploy falhou", r:"DevOps", tip:"DevOps mantém deploy"},
{t:"Usuários confusos na tela", r:"UX/UI", tip:"UX/UI melhora usabilidade"},
{t:"Testar nova feature", r:"QA", tip:"QA executa testes"},
{t:"Analisar padrão de vendas", r:"Dados", tip:"Dados analisa métricas"},
{t:"Falha de autenticação", r:"Segurança", tip:"Segurança protege acesso"}
];


let score=0, idx=0, maxRounds=5, timeLeft=0, timer=null;


function go(id){
document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
document.getElementById(id).classList.add('active');
}


function startGame(rounds,time){
score=0; idx=0; maxRounds=rounds; timeLeft=time;
document.getElementById('score').innerText=score;
renderRoles();
nextDemand();
go('game');
if(timer) clearInterval(timer);
if(time>0){
timer=setInterval(()=>{
timeLeft--;
document.getElementById('time').innerText=timeLeft;
if(timeLeft<=0) endGame();
},1000);
}
}


function renderRoles(){
const box=document.getElementById('roles');
box.innerHTML='';
roles.forEach(r=>{
const d=document.createElement('div');
d.className='role';
d.draggable=true;
d.innerText=r;
d.ondragstart=e=>e.dataTransfer.setData('text',r);
box.appendChild(d);
});
}


function nextDemand(){
if(idx>=maxRounds){ endGame(); return; }
const d=demands[idx%demands.length];
document.getElementById('demandText').innerText=d.t;
document.getElementById('round').innerText=idx+1;
go('game');
}


function dropRole(ev){
const role=ev.dataTransfer.getData('text');
const d=demands[idx%demands.length];
let correct = role===d.r;
if(correct){ score+=100; showFb(true,d.tip); }
else { score-=30; showFb(false,`Correto: ${d.r} — ${d.tip}`); }
document.getElementById('score').innerText=score;
idx++;
}


function showFb(ok,text){
document.getElementById('fbTitle').innerText = ok? '✔ Correto':'✖ Incorreto';
document.getElementById('fbText').innerText = text;
go('feedback');
}


function endGame(){
if(timer) clearInterval(timer);
document.getElementById('finalScore').innerText=score;
go('result');
}