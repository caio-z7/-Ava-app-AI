// Ava — front-end demo (vanilla JS SPA)
// Author: generated
(function(){
  // Helpers & state
  const qs = s => document.querySelector(s);
  const qsa = s => Array.from(document.querySelectorAll(s));
  const storage = window.localStorage;
  const state = {
    meds: JSON.parse(storage.getItem('ava:meds')||'[]'),
    appts: JSON.parse(storage.getItem('ava:appts')||'[]'),
    symptoms: JSON.parse(storage.getItem('ava:symptoms')||'[]'),
    moods: JSON.parse(storage.getItem('ava:moods')||'[]'),
    profile: JSON.parse(storage.getItem('ava:profile')||'{}'),
    chatHistory: JSON.parse(storage.getItem('ava:chat')||'[]'),
    voiceEnabled: storage.getItem('ava:voiceEnabled') !== 'false'
  };

  // UI elements
  const screens = { home: qs('#home'), treatment: qs('#treatment'), symptoms: qs('#symptoms'), emotions: qs('#emotions'), more: qs('#more') };
  const tabs = qsa('.tab-btn');
  const title = qs('#screenTitle');

  // Onboarding
  const onboarding = qs('#onboarding');
  const profileForm = qs('#profileForm');
  const skipOnboarding = qs('#skipOnboarding');

  function saveState(){
    storage.setItem('ava:meds', JSON.stringify(state.meds));
    storage.setItem('ava:appts', JSON.stringify(state.appts));
    storage.setItem('ava:symptoms', JSON.stringify(state.symptoms));
    storage.setItem('ava:moods', JSON.stringify(state.moods));
    storage.setItem('ava:profile', JSON.stringify(state.profile));
    storage.setItem('ava:chat', JSON.stringify(state.chatHistory));
    storage.setItem('ava:voiceEnabled', state.voiceEnabled ? 'true' : 'false');
  }

  // Simple router by tab
  function showScreen(name){
    Object.keys(screens).forEach(k => screens[k].classList.toggle('hidden', k !== name));
    tabs.forEach(t => t.classList.toggle('active', t.dataset.target === name));
    title.textContent = name === 'home' ? 'Painel' : (name.charAt(0).toUpperCase() + name.slice(1));
  }

  qsa('.tab-btn').forEach(btn => {
    btn.addEventListener('click', ()=> showScreen(btn.dataset.target));
  });

  // Onboarding flow
  function openOnboarding(){
    const p = state.profile || {};
    qs('#profileName').value = p.name || '';
    qs('#profileAge').value = p.age || '';
    qs('#profileStage').value = p.stage || 'diagnosis';
    qs('#profileKids').value = p.kids || 'unknown';
    onboarding.classList.remove('hidden');
  }
  profileForm.addEventListener('submit', e=>{
    e.preventDefault();
    state.profile = {
      name: qs('#profileName').value || '',
      age: qs('#profileAge').value || '',
      stage: qs('#profileStage').value || 'diagnosis',
      kids: qs('#profileKids').value || 'unknown'
    };
    saveState();
    onboarding.classList.add('hidden');
    renderAll();
  });
  skipOnboarding.addEventListener('click', ()=>{
    onboarding.classList.add('hidden');
  });

  // Meds
  const medModal = qs('#medModal');
  qs('#quickAddMed').addEventListener('click', ()=> openMedModal());
  qs('#addMedButton').addEventListener('click', ()=> openMedModal());
  qs('#closeMedModal').addEventListener('click', ()=> medModal.classList.add('hidden'));
  qs('#saveMed').addEventListener('click', ()=>{
    const name = qs('#medName').value.trim();
    const dose = qs('#medDose').value.trim();
    const time = qs('#medTime').value;
    if(!name) return alert('Nome do medicamento requerido');
    state.meds.push({id:Date.now(), name, dose, time});
    saveState();
    medModal.classList.add('hidden');
    qs('#medName').value = qs('#medDose').value = qs('#medTime').value = '';
    renderMeds();
  });
  function openMedModal(){ medModal.classList.remove('hidden') }

  function renderMeds(){
    const el = qs('#medList');
    const el2 = qs('#treatmentMedList');
    el.innerHTML = '';
    el2.innerHTML = '';
    if(state.meds.length===0){
      el.innerHTML = '<p class="hint">Nenhum medicamento registrado</p>';
      el2.innerHTML = '<p class="hint">Nenhum medicamento registrado</p>';
      return;
    }
    state.meds.forEach(m=>{
      const item = document.createElement('div'); item.className='med-item';
      item.innerHTML = `<div><strong>${m.name}</strong><div class="meta">${m.dose} • ${m.time || 'horário não definido'}</div></div>`;
      const btn = document.createElement('button'); btn.className='btn secondary'; btn.textContent='Tomei';
      btn.addEventListener('click', ()=>{
        addChatMessage({role:'system', text:`Registro: ${state.profile.name || 'Usuária'} confirmou que tomou ${m.name} às ${new Date().toLocaleTimeString()}`});
        btn.textContent='OK ✓';
        setTimeout(()=>btn.textContent='Tomei',1200);
      });
      item.appendChild(btn);
      el.appendChild(item);
      // Treatment list copy
      const item2 = item.cloneNode(true);
      el2.appendChild(item2);
    });
  }

  // Appointments
  const apptModal = qs('#apptModal');
  qs('#addAppointment').addEventListener('click', ()=> apptModal.classList.remove('hidden'));
  qs('#closeApptModal').addEventListener('click', ()=> apptModal.classList.add('hidden'));
  qs('#saveAppt').addEventListener('click', ()=>{
    const desc = qs('#apptDesc').value.trim();
    const date = qs('#apptDate').value;
    const time = qs('#apptTime').value;
    if(!desc || !date){ return alert('Descrição e data são requeridos');}
    state.appts.push({id:Date.now(), desc, date, time});
    saveState();
    apptModal.classList.add('hidden');
    qs('#apptDesc').value='';qs('#apptDate').value='';qs('#apptTime').value='';
    renderAppts();
  });
  function renderAppts(){
    const list = qs('#appointmentsList');
    const cal = qs('#appointmentsCalendar');
    list.innerHTML='';cal.innerHTML='';
    if(state.appts.length===0){ list.innerHTML='<li class="hint">Nenhum agendamento</li>'; cal.innerHTML='<li class="hint">Nenhum agendamento</li>'; return; }
    state.appts.forEach(a=>{
      const li = document.createElement('li');
      li.innerHTML = `<strong>${a.desc}</strong><div class="meta">${a.date} ${a.time||''}</div>`;
      list.appendChild(li);
      const li2 = li.cloneNode(true); cal.appendChild(li2);
    });
  }

  // Symptoms
  qs('#saveSymptom').addEventListener('click', ()=>{
    const name = qs('#symptomName').value.trim();
    const intensity = qs('#symptomScale').value;
    const notes = qs('#symptomNotes').value.trim();
    if(!name) return alert('Identifique o sintoma');
    state.symptoms.push({id:Date.now(), name, intensity, notes, date:new Date().toISOString()});
    saveState(); qs('#symptomName').value='';qs('#symptomNotes').value='';qs('#symptomScale').value=5;
    renderSymptoms();
  });
  function renderSymptoms(){
    const el = qs('#symptomList');
    el.innerHTML='';
    if(state.symptoms.length===0){ el.innerHTML='<li class="hint">Nenhum sintoma registrado</li>'; return; }
    state.symptoms.slice().reverse().forEach(s=>{
      const li = document.createElement('li');
      li.innerHTML = `<strong>${s.name}</strong> <span class="meta">intensidade: ${s.intensity}</span><div>${s.notes||''}</div>`;
      el.appendChild(li);
    });
  }

  // Mood
  qsa('#quickMood .mood').forEach(b=>{
    b.addEventListener('click', ()=> {
      const val = b.dataset.mood;
      state.moods.push({id:Date.now(), mood:val, note:'', date:new Date().toISOString()});
      saveState(); renderMoods();
    });
  });
  qs('#saveMood').addEventListener('click', ()=>{
    const note = qs('#moodNote').value.trim();
    const scale = qs('#moodScale').value;
    state.moods.push({id:Date.now(), mood:scale, note, date:new Date().toISOString()});
    qs('#moodNote').value='';qs('#moodScale').value=3;
    saveState(); renderMoods();
  });
  function renderMoods(){
    const el = qs('#moodList');
    el.innerHTML='';
    if(state.moods.length===0){ el.innerHTML='<li class="hint">Nenhum registro de humor</li>'; return; }
    state.moods.slice().reverse().forEach(m=>{
      const li = document.createElement('li');
      li.innerHTML = `<strong>Humor: ${m.mood}/5</strong> <div class="meta">${new Date(m.date).toLocaleString()}</div><div>${m.note||''}</div>`;
      el.appendChild(li);
    });
  }

  // Simple Ava responses (rule-based empathy + safety)
  function avaRespond(userText){
    // Basic safety checks
    const text = (userText||'').toLowerCase();
    const warnings = ['suic', 'morrer', 'desist', 'quero morrer', 'tirar minha vida'];
    if(warnings.some(w=> text.includes(w))){
      const msg = "Sinto muito que você esteja passando por isso. Se você estiver em perigo imediato, procure emergência agora. Se possível, ligue para o CVV no 188 (Brasil) ou procure um serviço de apoio imediato. Posso ajudar a encontrar contatos locais e ligar? Não fique sozinha.";
      addChatMessage({role:'ava', text:msg});
      return msg;
    }
    // Symptom/medical triggers
    const urgent = ['febre', 'sangramento intenso', 'dor muito forte', 'dor insuportável', 'confusão'];
    if(urgent.some(w=> text.includes(w))){
      const msg = "Se você está com sintomas graves como febre alta, sangramento intenso ou dor extrema, é importante procurar emergência ou contatar seu médico imediatamente. Não posso substituir avaliação médica.";
      addChatMessage({role:'ava', text:msg});
      return msg;
    }
    // Empathy and practical suggestions
    const empathyPatterns = ['triste', 'ansios', 'medo', 'preocup', 'culp', 'raiva'];
    if(empathyPatterns.some(w=> text.includes(w))){
      const msg = `Obrigada por compartilhar. Sinto muito que você esteja sentindo isso. Posso te ajudar com uma técnica breve de respiração ou você prefere conversar sobre o que está acontecendo? Lembre-se: sou uma IA de apoio, não substituo sua equipe de saúde.`;
      addChatMessage({role:'ava', text:msg});
      return msg;
    }
    // Default
    const defaultReplies = [
      "Entendi. Conte-me um pouco mais para que eu possa apoiar melhor.",
      "Obrigado por compartilhar. Quer que eu sugira uma técnica de relaxamento agora (respiração diafragmática simples)?",
      "Posso ajudar registrando isso no seu diário de sintomas ou humor. O que prefere?"
    ];
    const pick = defaultReplies[Math.floor(Math.random()*defaultReplies.length)];
    addChatMessage({role:'ava', text:pick});
    return pick;
  }

  // Chat UI
  const chatMessages = qs('#chatMessages');
  const chatInput = qs('#chatInput');
  const sendChat = qs('#sendChat');
  const listenLast = qs('#listenLast');
  const speakWithAvaBtn = qs('#speakWithAva');
  const sttStatus = qs('#sttStatus');

  function addChatMessage(msg){
    state.chatHistory.push(msg);
    saveState();
    renderChat();
    if(msg.role === 'ava' && state.voiceEnabled) speakText(msg.text);
  }

  function renderChat(){
    chatMessages.innerHTML='';
    state.chatHistory.slice().forEach(m=>{
      const div = document.createElement('div');
      div.className = 'msg ' + (m.role === 'user' ? 'user' : (m.role === 'ava' ? 'ava' : 'system'));
      div.innerHTML = `<div>${escapeHtml(m.text)}</div>`;
      if(m.role === 'ava'){
        const listen = document.createElement('button');
        listen.className='btn secondary';
        listen.textContent='Ouvir resposta da Ava';
        listen.addEventListener('click', ()=> speakText(m.text));
        div.appendChild(listen);
      }
      chatMessages.appendChild(div);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHtml(str){ return String(str).replace(/[&<>\"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }

  sendChat.addEventListener('click', ()=>{
    const txt = chatInput.value.trim();
    if(!txt) return;
    addChatMessage({role:'user', text:txt});
    chatInput.value='';
    setTimeout(()=>{ avaRespond(txt); }, 400);
  });
  chatInput.addEventListener('keypress', e=> { if(e.key==='Enter') sendChat.click(); });

  listenLast.addEventListener('click', ()=>{
    const last = state.chatHistory.slice().reverse().find(m=> m.role === 'ava');
    if(last) speakText(last.text);
    else alert('Nenhuma resposta da Ava para ouvir ainda.');
  });

  // TTS
  function speakText(text){
    if(!('speechSynthesis' in window)) return alert('TTS não suportado neste navegador.');
    if(!state.voiceEnabled) return;
    const utter = new SpeechSynthesisUtterance(text);
    // try pick a female, Brazilian Portuguese voice
    const voices = speechSynthesis.getVoices();
    // prefer pt-BR female
    let chosen = voices.find(v=> /pt-BR|pt_BR|Brazilian/i.test(v.lang) && /female|Female|Feminine|Mulher/i.test(v.name)) ||
                 voices.find(v=> /pt-BR|pt_BR/i.test(v.lang)) ||
                 voices.find(v=> /female/i.test(v.name)) ||
                 voices[0];
    if(chosen) utter.voice = chosen;
    utter.lang = chosen ? chosen.lang : 'pt-BR';
    utter.rate = 0.95;
    utter.pitch = 1;
    speechSynthesis.cancel(); // stop others
    speechSynthesis.speak(utter);
  }

  // STT (SpeechRecognition)
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition;
  if(SpeechRecognition){
    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = ()=> sttStatus.textContent = 'Ouvindo...';
    recognition.onresult = (e)=> {
      const text = e.results[0][0].transcript;
      sttStatus.textContent = `Transcrição: ${text}`;
      addChatMessage({role:'user', text});
      setTimeout(()=>avaRespond(text), 300);
    };
    recognition.onerror = (e)=> { sttStatus.textContent = `Erro: ${e.error}`; };
    recognition.onend = ()=> {
      if(sttStatus.textContent.startsWith('Ouvindo')) sttStatus.textContent = '';
    };
  } else {
    sttStatus.textContent = 'STT não suportado neste navegador';
  }
  speakWithAvaBtn.addEventListener('click', ()=>{
    if(!recognition) return alert('STT não disponível neste navegador. Tente no Chrome/Edge com microfone habilitado.');
    try { recognition.start(); } catch(e){ console.warn(e); }
  });

  // Profile icon opens onboarding for editing
  qs('#openProfile').addEventListener('click', ()=> openOnboarding());

  // Settings toggles
  qs('#notifToggle').addEventListener('change', e=>{
    // placeholder for notifications
    alert('Notificações configuradas (demo).');
  });
  qs('#voiceToggle').addEventListener('change', e=>{
    state.voiceEnabled = e.target.checked;
    saveState();
  });

  // Utility to preload some sample data for demo if empty
  function seedDemo(){
    if(!state.meds.length){
      state.meds.push({id:1,name:'Progesterona',dose:'200 mg',time:'08:00'});
      state.meds.push({id:2,name:'Ácido fólico',dose:'5 mg',time:'20:00'});
    }
    if(!state.appts.length){
      state.appts.push({id:1,desc:'Consulta oncológica',date:new Date().toISOString().slice(0,10),time:'14:00'});
    }
    saveState();
  }

  // Initialize
  function renderAll(){
    renderMeds(); renderAppts(); renderSymptoms(); renderMoods(); renderChat();
    qs('#notifToggle').checked = true;
    qs('#voiceToggle').checked = state.voiceEnabled;
  }

  // Add system message util
  function addSystemMessage(text){
    addChatMessage({role:'system', text});
  }

  // Add chat message programmatically
  function addUserMessage(text){ addChatMessage({role:'user', text}); }

  // Quick Ava entry bottom sheet simulation
  qs('#openAvaQuick').addEventListener('click', ()=>{
    showScreen('emotions');
    setTimeout(()=> qs('#chatInput').focus(), 400);
  });

  // initialize
  seedDemo();
  renderAll();

  // If no profile, open onboarding
  if(!state.profile || !state.profile.name) openOnboarding();

  // Helpful system messages at start
  addSystemMessage("Aviso: Ava é uma IA de apoio emocional. Não substitui sua equipe de saúde. Em situações graves, procure atendimento médico.");

  // expose for debugging (optional)
  window.__ava_state = state;

})();
