/* ==========================================================
   Teste DISC · lógica do quiz, resultado, planilha e PDF
   ========================================================== */
(() => {
  'use strict';

  const CFG = window.DISC_CONFIG || {};
  const QUESTIONS = window.DISC_QUESTIONS;
  const PROFILES = window.DISC_PROFILES;
  const FULL = window.DISC_FULL_ANALYSIS;
  const ORDER = ['D', 'I', 'S', 'C'];
  const KEYS = ['A', 'B', 'C', 'D'];

  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  document.querySelectorAll('[data-cfg]').forEach((el) => { el.textContent = CFG[el.dataset.cfg] || ''; });

  /* ---------- Ícones dos perfis ---------- */
  const ICONS = {
    D: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.6 2.2c.4 3-1 4.6-2.4 6.2C8.7 10 7 11.8 7 14.8 7 18.2 9.3 21 12.5 21s5.5-2.6 5.5-6c0-2.7-1.4-4.4-2.3-5.4-.2 1.6-.9 2.8-2 3.3.6-3.4-.2-7.3-1.1-9.7z"/></svg>',
    I: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" opacity=".8"/></svg>',
    S: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-8-4.9-8-11a4.6 4.6 0 0 1 8-3.1A4.6 4.6 0 0 1 20 10c0 6.1-8 11-8 11z"/></svg>',
    C: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 3h10l4 6-9 12L3 9z" opacity=".95"/><path d="M3 9h18M12 21L8.5 9 12 3l3.5 6z" fill="none" stroke="#fff" stroke-width="1.1" opacity=".55"/></svg>'
  };
  const WA_ICON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4a.5.5 0 0 0 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.4-.3z"/></svg>';
  const ARROW = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const CHECK = '<svg class="check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---------- Estado ---------- */
  const uid = () => 'DISC-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const params = new URLSearchParams(location.search);
  const origem = ['utm_source', 'utm_medium', 'utm_campaign'].map((k) => params.get(k)).filter(Boolean).join(' / ');

  const state = {
    id: uid(),
    nome: '', whatsapp: '', email: '', consent: false,
    answers: new Array(QUESTIONS.length).fill(null),
    optionOrder: QUESTIONS.map((q) => shuffle(q.o)),
    leadSent: false
  };

  const firstName = () => (state.nome.trim().split(/\s+/)[0] || '');

  /* ---------- Envio para a planilha ---------- */
  function send(payload, beacon) {
    const data = Object.assign({ id: state.id, evento: CFG.EVENT_NAME || '', origem }, payload);
    if (!CFG.SHEETS_ENDPOINT) { console.info('[DISC → planilha]', data); return; }
    const body = JSON.stringify(data);
    try {
      if (beacon && navigator.sendBeacon) {
        navigator.sendBeacon(CFG.SHEETS_ENDPOINT, new Blob([body], { type: 'text/plain;charset=utf-8' }));
        return;
      }
      fetch(CFG.SHEETS_ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body, keepalive: true }).catch(() => {});
    } catch (e) { /* silencioso */ }
  }

  /* ---------- Sequência de telas ---------- */
  const steps = [{ t: 'welcome' }, { t: 'nome' }, { t: 'whatsapp' }, { t: 'email' }, { t: 'intro' }];
  QUESTIONS.forEach((_, i) => {
    steps.push({ t: 'q', i });
    if (i === Math.floor(QUESTIONS.length / 2) - 1) steps.push({ t: 'half' });
  });
  steps.push({ t: 'loading' });

  let cur = 0;
  let busy = false;
  const stage = $('#stage');
  const navbar = $('#navbar');
  const btnBack = $('#btnBack');
  const btnNext = $('#btnNext');

  function go(to, dir = 1) {
    if (busy || to < 0 || to >= steps.length) return;
    busy = true;
    const old = stage.firstElementChild;
    const done = () => { cur = to; render(dir); busy = false; };
    if (old) {
      old.classList.add(dir > 0 ? 'leave-up' : 'leave-down');
      setTimeout(done, 300);
    } else done();
  }
  const next = () => go(cur + 1, 1);
  const back = () => {
    let to = cur - 1;
    if (steps[to] && steps[to].t === 'half') to--;
    go(to, -1);
  };

  function updateChrome() {
    const s = steps[cur];
    const total = steps.length - 1;
    $('#progressBar').style.width = Math.round((cur / total) * 100) + '%';
    const hideNav = s.t === 'welcome' || s.t === 'loading';
    navbar.classList.toggle('hide', hideNav);
    btnBack.disabled = cur <= 1;
    btnNext.disabled = !canSkipForward();
    const qi = s.t === 'q' ? s.i : -1;
    $('#navCount').textContent = qi >= 0 ? `${qi + 1} de ${QUESTIONS.length}` : '';
  }
  function canSkipForward() {
    const s = steps[cur];
    if (s.t === 'q') return state.answers[s.i] !== null;
    if (s.t === 'nome') return !!state.nome;
    if (s.t === 'whatsapp') return !!state.whatsapp;
    if (s.t === 'email') return !!state.email;
    return s.t === 'intro' || s.t === 'half';
  }

  function render(dir) {
    const s = steps[cur];
    const el = document.createElement('section');
    el.className = 'screen' + (dir < 0 ? ' from-top' : '');
    el.innerHTML = VIEWS[s.t](s);
    stage.innerHTML = '';
    stage.appendChild(el);
    updateChrome();
    (BIND[s.t] || (() => {}))(el, s);
  }

  /* ---------- Views ---------- */
  const qLabel = (n) => `<div class="q-num">${n} ${ARROW}</div>`;
  const okRow = (label = 'OK') => `<div class="cta-row"><button type="button" class="btn btn-rose" data-ok>${label} <svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></button><span class="hint">pressione <b>Enter ↵</b></span></div>`;

  const VIEWS = {
    welcome: () => `
      <div class="welcome">
        <span class="chip"><i></i>${esc(CFG.EVENT_NAME || 'Teste DISC')}</span>
        <h1>Que tipo de <em>amiga</em><br>você é?</h1>
        <p class="lead">Descubra seu perfil comportamental DISC e entenda como você se conecta nas amizades e nos relacionamentos.</p>
        <div class="disc-letters" aria-hidden="true"><span>D</span><span>I</span><span>S</span><span>C</span></div>
        <div class="cta-row"><button type="button" class="btn btn-lg" data-ok>Quero descobrir ${ARROW}</button></div>
        <div class="meta-row"><span>⏱ 3 minutos</span><span>✦ 16 perguntas rápidas</span><span>♡ Resultado na hora</span></div>
      </div>`,

    nome: () => `
      ${qLabel(1)}
      <h2 class="q-title">Antes de tudo: como você gosta de ser chamada?</h2>
      <div class="field"><input id="in" type="text" autocomplete="given-name" placeholder="Digite seu nome" value="${esc(state.nome)}" maxlength="60"><span class="bar"></span></div>
      <div data-err></div>
      ${okRow()}`,

    whatsapp: () => `
      ${qLabel(2)}
      <h2 class="q-title">Prazer, ${esc(firstName())}! Qual é o seu WhatsApp?</h2>
      <p class="q-sub">Com DDD. Prometemos não lotar seu celular.</p>
      <div class="field"><input id="in" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="(61) 99999-9999" value="${esc(state.whatsapp)}" maxlength="16"><span class="bar"></span></div>
      <div data-err></div>
      ${okRow()}`,

    email: () => `
      ${qLabel(3)}
      <h2 class="q-title">E o seu melhor e-mail?</h2>
      <div class="field"><input id="in" type="email" inputmode="email" autocomplete="email" placeholder="voce@email.com" value="${esc(state.email)}" maxlength="120"><span class="bar"></span></div>
      <label class="consent"><input type="checkbox" id="consent" ${state.consent ? 'checked' : ''}><span>Autorizo o uso dos meus dados para receber meu resultado e o contato da ${esc(CFG.ANALYST_NAME || 'analista')} sobre a Análise DISC completa.</span></label>
      <div data-err></div>
      ${okRow('Começar o teste')}`,

    intro: () => `
      <div class="interlude">
        <span class="big-emoji">🌸</span>
        <h2 class="q-title">Agora é com você, ${esc(firstName())}.</h2>
        <p class="q-sub">Não existe resposta certa nem errada. Escolha a opção que mais tem a ver com você <b>na maioria das vezes</b>, sem pensar demais.</p>
        <div class="cta-row"><button type="button" class="btn btn-rose" data-ok>Vamos lá ${ARROW}</button></div>
      </div>`,

    half: () => `
      <div class="interlude">
        <span class="big-emoji">✨</span>
        <h2 class="q-title">Metade do caminho!</h2>
        <p class="q-sub">Você está indo muito bem, ${esc(firstName())}. Faltam só ${QUESTIONS.length / 2} perguntas para descobrir o seu perfil.</p>
        <div class="cta-row"><button type="button" class="btn btn-rose" data-ok>Continuar ${ARROW}</button></div>
      </div>`,

    q: (s) => {
      const q = QUESTIONS[s.i];
      const opts = state.optionOrder[s.i];
      return `
        <div class="q-num">Pergunta ${s.i + 1} de ${QUESTIONS.length} ${ARROW}</div>
        <h2 class="q-title">${esc(q.q)}</h2>
        <div class="options" role="radiogroup">
          ${opts.map((o, j) => `<button type="button" class="opt${state.answers[s.i] === o.k ? ' selected' : ''}" data-k="${o.k}" role="radio" aria-checked="${state.answers[s.i] === o.k}"><span class="key">${KEYS[j]}</span><span class="txt">${esc(o.t)}</span>${CHECK}</button>`).join('')}
        </div>`;
    },

    loading: () => `
      <div class="loading">
        <div class="orbit" aria-hidden="true"><span>D</span><span>I</span><span>S</span><span>C</span></div>
        <h2 class="q-title">Analisando suas respostas…</h2>
        <ul class="loading-steps">
          <li>Calculando seus 4 fatores DISC</li>
          <li>Identificando seu perfil predominante</li>
          <li>Preparando sua análise, ${esc(firstName())}</li>
        </ul>
      </div>`
  };

  /* ---------- Comportamentos ---------- */
  function showErr(el, msg) {
    const box = $('[data-err]', el);
    box.innerHTML = msg ? `<span class="error">⚠ ${esc(msg)}</span>` : '';
  }
  function bindField(el, validate) {
    const input = $('#in', el);
    setTimeout(() => input.focus({ preventScroll: true }), 450);
    const submit = () => { const err = validate(input.value); if (err) { showErr(el, err); input.focus(); } else next(); };
    $('[data-ok]', el).addEventListener('click', submit);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
    input.addEventListener('input', () => showErr(el, ''));
    return input;
  }
  const maskPhone = (v) => {
    const d = v.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '').slice(0, 11);
    if (d.length <= 2) return d ? '(' + d : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  const BIND = {
    welcome: (el) => { $('[data-ok]', el).addEventListener('click', next); },
    intro: (el) => { $('[data-ok]', el).addEventListener('click', next); },
    half: (el) => { $('[data-ok]', el).addEventListener('click', next); },

    nome: (el) => bindField(el, (v) => {
      const n = v.trim().replace(/\s+/g, ' ');
      if (n.length < 2) return 'Conta pra gente o seu nome 😊';
      state.nome = n.replace(/(^|\s)\S/g, (c) => c.toUpperCase());
      return '';
    }),

    whatsapp: (el) => {
      const input = bindField(el, (v) => {
        const d = v.replace(/\D/g, '');
        if (d.length < 10 || d.length > 11) return 'Confira o número com DDD, ex.: (61) 99999-9999';
        state.whatsapp = maskPhone(v);
        return '';
      });
      input.addEventListener('input', () => { input.value = maskPhone(input.value); });
    },

    email: (el) => {
      const cb = $('#consent', el);
      cb.addEventListener('change', () => { state.consent = cb.checked; showErr(el, ''); });
      bindField(el, (v) => {
        const e = v.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return 'Esse e-mail parece incompleto. Pode conferir?';
        if (!cb.checked) return 'Marque a autorização para continuar.';
        state.email = e; state.consent = true;
        if (!state.leadSent) {
          state.leadSent = true;
          send({ acao: 'lead', nome: state.nome, whatsapp: state.whatsapp, email: state.email });
        }
        return '';
      });
    },

    q: (el, s) => {
      const box = $('.options', el);
      const pick = (btn) => {
        if (box.classList.contains('locked')) return;
        box.classList.add('locked');
        box.querySelectorAll('.opt').forEach((b) => { b.classList.remove('selected'); b.setAttribute('aria-checked', 'false'); });
        btn.classList.add('selected', 'blink');
        btn.setAttribute('aria-checked', 'true');
        state.answers[s.i] = btn.dataset.k;
        updateChrome();
        setTimeout(next, 520);
      };
      box.addEventListener('click', (e) => { const b = e.target.closest('.opt'); if (b) pick(b); });
      el._pick = (idx) => { const b = box.querySelectorAll('.opt')[idx]; if (b) pick(b); };
    },

    loading: (el) => {
      const items = el.querySelectorAll('.loading-steps li');
      items.forEach((li, i) => setTimeout(() => li.classList.add('done'), 600 + i * 750));
      setTimeout(showResult, 600 + items.length * 750 + 350);
    }
  };

  btnBack.addEventListener('click', back);
  btnNext.addEventListener('click', () => { if (canSkipForward()) next(); });

  document.addEventListener('keydown', (e) => {
    if (document.body.classList.contains('mode-result')) return;
    const s = steps[cur];
    const tag = (e.target.tagName || '').toLowerCase();
    if (s.t === 'q' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const idx = KEYS.indexOf(e.key.toUpperCase());
      if (idx >= 0) { stage.firstElementChild._pick && stage.firstElementChild._pick(idx); return; }
    }
    if (e.key === 'Enter' && tag !== 'input' && ['welcome', 'intro', 'half'].includes(s.t)) { e.preventDefault(); next(); }
  });

  /* ---------- Cálculo ---------- */
  function compute() {
    const count = { D: 0, I: 0, S: 0, C: 0 };
    state.answers.forEach((k) => { if (k) count[k]++; });
    const total = state.answers.filter(Boolean).length || 1;
    // porcentagens que somam 100 (maior resto)
    const raw = ORDER.map((k) => ({ k, v: (count[k] / total) * 100 }));
    const pct = {};
    let sum = 0;
    raw.forEach((r) => { pct[r.k] = Math.floor(r.v); sum += pct[r.k]; });
    raw.slice().sort((a, b) => (b.v % 1) - (a.v % 1)).slice(0, 100 - sum).forEach((r) => pct[r.k]++);
    // desempate: autodescrição (pergunta 11), depois última resposta dada
    const tieBreak = [state.answers[10], ...state.answers.slice().reverse()];
    const rank = ORDER.slice().sort((a, b) => {
      if (count[b] !== count[a]) return count[b] - count[a];
      return tieBreak.indexOf(a) === -1 ? 1 : tieBreak.indexOf(b) === -1 ? -1 : tieBreak.indexOf(a) - tieBreak.indexOf(b);
    });
    return { count, pct, primary: rank[0], secondary: count[rank[1]] > 0 ? rank[1] : null, rank };
  }

  /* ---------- Resultado ---------- */
  let RESULT = null;

  function waLink(r) {
    const p = PROFILES[r.primary];
    const msg = `Oi, ${CFG.ANALYST_NAME || ''}! Sou a ${firstName()} e fiz o teste DISC no ${CFG.EVENT_NAME || 'evento'}. Meu perfil deu ${p.nome} (${p.apelido}, ${r.pct[r.primary]}%). Quero saber mais sobre a Análise DISC completa! 💛`;
    return `https://wa.me/${CFG.WHATSAPP}?text=${encodeURIComponent(msg)}`;
  }

  function barsHTML(r) {
    return `<div class="bars">${r.rank.map((k) => `
      <div class="bar-row">
        <span class="l" style="background:var(--${k})">${k}</span>
        <span class="track"><span class="fill" data-w="${r.pct[k]}" style="background:var(--${k})"></span></span>
        <span class="v" data-count="${r.pct[k]}">0%</span>
        <span class="n">${PROFILES[k].nome} · ${PROFILES[k].apelido}</span>
      </div>`).join('')}</div>`;
  }
  const mixHTML = (r) => r.secondary
    ? `<div class="mix">Sua segunda força é o perfil <b>${PROFILES[r.secondary].nome}</b>: ${PROFILES[r.secondary].secundario}</div>`
    : '';
  const listHTML = (arr, cls = '') => `<ul class="list ${cls}">${arr.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;
  const connectCards = (r, extraCls = '') => ORDER.map((k) => {
    const p = PROFILES[k];
    const me = k === r.primary;
    return `<div class="cc ${extraCls}${me ? ' me' : ''}" style="--c:${p.cor}">
      ${me ? '<span class="me-tag">VOCÊ</span>' : ''}
      <span class="ic">${ICONS[k]}</span>
      <h4>${p.apelido}</h4>
      <span class="nm">Perfil ${p.nome} (${k})</span>
      <p>${esc(p.conviver)}</p>
    </div>`;
  }).join('');

  function showResult() {
    const r = compute();
    RESULT = r;
    const p = PROFILES[r.primary];
    const name = esc(firstName());

    send({
      acao: 'resultado',
      nome: state.nome, whatsapp: state.whatsapp, email: state.email,
      perfil: `${p.nome} (${r.primary})`,
      secundario: r.secondary ? `${PROFILES[r.secondary].nome} (${r.secondary})` : '',
      D: r.pct.D, I: r.pct.I, S: r.pct.S, C: r.pct.C,
      respostas: state.answers.map((k, i) => `${i + 1}:${k}`).join(' ')
    });

    const res = $('#result');
    res.style.setProperty('--pc', p.cor);
    res.style.setProperty('--ps', p.corSoft);
    const photo = CFG.ANALYST_PHOTO ? `<img src="${esc(CFG.ANALYST_PHOTO)}" alt="${esc(CFG.ANALYST_NAME)}">` : esc((CFG.ANALYST_NAME || 'A')[0]);

    res.innerHTML = `
      <div class="wrap">
        <header class="r-hero">
          <span class="r-kicker">Seu resultado DISC</span>
          <div class="r-badge" style="background:${p.cor}">${ICONS[r.primary]}</div>
          <p class="r-hello">${name}, você é…</p>
          <h1 class="r-title"><em>${p.apelido}</em></h1>
          <div class="r-sub">Perfil predominante: ${p.nome} (${r.primary}) · ${r.pct[r.primary]}%</div>
          <p class="r-tagline">“${p.tagline}”</p>
        </header>

        <div class="r-grid">
          <div class="card r-desc reveal">
            <h3 class="h3"><small>Quem você é</small>Seu jeito de se relacionar</h3>
            <p>${esc(p.descricao)}</p>
            <div class="tags">${p.tracos.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
          </div>
          <div class="card reveal">
            <h3 class="h3"><small>Sua composição</small>Seus 4 fatores DISC</h3>
            ${barsHTML(r)}
            ${mixHTML(r)}
          </div>
        </div>

        <div class="r-sections">
          <div class="card reveal">
            <h3 class="h3"><small>Nas amizades</small>Seus superpoderes</h3>
            ${listHTML(p.superpoderes)}
          </div>
          <div class="card reveal">
            <h3 class="h3"><small>O que te faz bem</small>O que você precisa de uma amiga</h3>
            ${listHTML(p.precisa, 'heart')}
          </div>
        </div>

        <div class="facts">
          <div class="card fact reveal"><span class="k">Sob pressão</span><p>${esc(p.pressao)}</p></div>
          <div class="card fact reveal"><span class="k">Como você decide</span><p>${esc(p.decisao)}</p></div>
          <div class="card fact reveal"><span class="k">Seu maior receio</span><p>${esc(p.medo)}</p></div>
        </div>

        <div class="r-sections" style="grid-template-columns:1fr">
          <div class="card reveal">
            <h3 class="h3"><small>Para crescer</small>Pontos de atenção nas suas relações</h3>
            ${listHTML(p.atencao, 'warn')}
          </div>
        </div>

        <section class="connect">
          <div class="sec-head reveal">
            <span class="r-kicker">Inteligência interpessoal</span>
            <h2>Como se conectar com cada tipo de amiga</h2>
            <p>Olhe ao seu redor: neste evento tem mulheres dos quatro perfis. Veja como cada uma gosta de ser tratada.</p>
          </div>
          <div class="connect-grid reveal">${connectCards(r)}</div>
        </section>

        <div class="challenge reveal">
          <span class="em">🎯</span>
          <div>
            <span class="r-kicker">Seu desafio de amizade</span>
            <h3>${esc(p.desafio)}</h3>
          </div>
        </div>

        <div class="card download reveal">
          <div class="txt">
            <span class="pdf-ic"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg></span>
            <div><h4>Leve sua análise com você</h4><p>Baixe o PDF com seu perfil completo para guardar e compartilhar.</p></div>
          </div>
          <div class="btns">
            ${navigator.share ? '<button type="button" class="btn btn-ghost" id="btnShare">Compartilhar</button>' : ''}
            <button type="button" class="btn btn-rose" id="btnPdf">Baixar minha análise (PDF)</button>
          </div>
        </div>
      </div>

      <section class="pitch">
        <div class="wrap">
          <div class="pitch-box">
            <div class="reveal">
              <span class="r-kicker">E agora, ${name}?</span>
              <h2>Isso é só a <em>ponta</em> de quem você é.</h2>
              <p class="intro">Este teste mostra o seu estilo predominante. Mas ninguém é um perfil só: você é uma combinação única dos quatro, e essa combinação muda conforme o que a vida, o trabalho e os relacionamentos exigem de você.</p>
              <p class="intro" style="margin-top:14px">A <b>Análise DISC completa</b> revela essa mistura com profundidade, e mostra onde você está se adaptando demais e deixando de ser você.</p>
              <div class="iceberg" aria-hidden="true">
                <div class="tip"><b>16</b>perguntas deste teste</div>
                <div class="deep"><b>+ de 25</b>gráficos e índices na análise completa, com devolutiva individual</div>
              </div>
            </div>
            <div class="reveal">
              <ul class="full-list">
                ${FULL.map(([t, d], i) => `<li><span class="n">${i + 1}</span><div><h5>${esc(t)}</h5><p>${esc(d)}</p></div></li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="analyst reveal">
            <div class="avatar">${photo}</div>
            <div>
              <h4>${esc(CFG.ANALYST_NAME || '')}</h4>
              <span class="role">${esc(CFG.ANALYST_ROLE || '')}</span>
              <p>Chame no WhatsApp e conte que você é ${esc(p.apelido)}. Ela te explica como funciona a Análise DISC completa.</p>
            </div>
            <a class="btn btn-wa btn-lg" id="btnWa" href="${waLink(r)}" target="_blank" rel="noopener">${WA_ICON} Quero minha análise completa</a>
          </div>
          <p class="wa-note">Você vai falar direto com a ${esc(CFG.ANALYST_NAME || '')}. A mensagem já vai com o seu resultado.</p>
        </div>
      </section>

      <footer class="foot">
        <p>Este teste é uma ferramenta rápida de autoconhecimento inspirada na teoria DISC (William Moulton Marston, 1928). Não substitui o mapeamento comportamental completo.</p>
        <button type="button" class="restart" id="btnRestart">Refazer o teste</button>
      </footer>`;

    document.body.classList.remove('mode-quiz');
    document.body.classList.add('mode-result');
    res.hidden = false;
    window.scrollTo(0, 0);
    document.title = `${p.apelido} · Meu perfil DISC`;

    confetti(p.cor);
    animateBars(res);
    setupReveal(res);

    $('#btnPdf').addEventListener('click', downloadPdf);
    $('#btnWa').addEventListener('click', () => send({ acao: 'whatsapp' }, true));
    $('#btnRestart').addEventListener('click', () => { location.href = location.pathname + location.search; });
    const sh = $('#btnShare');
    if (sh) sh.addEventListener('click', () => {
      navigator.share({
        title: 'Que tipo de amiga você é?',
        text: `Fiz o teste DISC e descobri que sou ${p.apelido} (${p.nome})! Faça o seu:`,
        url: location.origin + location.pathname
      }).catch(() => {});
    });
  }

  function animateBars(root) {
    setTimeout(() => {
      root.querySelectorAll('.fill').forEach((f) => { f.style.width = f.dataset.w + '%'; });
      root.querySelectorAll('[data-count]').forEach((el) => {
        const end = +el.dataset.count; const t0 = Date.now();
        const h = setInterval(() => {
          const k = Math.min(1, (Date.now() - t0) / 1400);
          el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + '%';
          if (k >= 1) clearInterval(h);
        }, 30);
      });
    }, 500);
  }

  function setupReveal(root) {
    const els = root.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: .12 });
    els.forEach((e) => io.observe(e));
  }

  function confetti(main) {
    const box = document.createElement('div');
    box.className = 'confetti';
    const colors = [main, '#DD5A7B', '#F2B8C6', '#C99545', '#E25C4B', '#EE9D22', '#4FA383', '#7470D6'];
    for (let i = 0; i < 70; i++) {
      const c = document.createElement('i');
      c.style.left = Math.random() * 100 + '%';
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = 2.2 + Math.random() * 2.2 + 's';
      c.style.animationDelay = Math.random() * .6 + 's';
      c.style.transform = `rotate(${Math.random() * 360}deg)`;
      if (i % 3 === 0) c.style.borderRadius = '50%';
      box.appendChild(c);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 5200);
  }

  function toast(msg) {
    let t = $('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    setTimeout(() => t.classList.add('show'), 20);
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 3200);
  }

  /* ---------- PDF ---------- */
  function loadScript(src) {
    return new Promise((ok, fail) => {
      if (document.querySelector(`script[src="${src}"]`)) return ok();
      const s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = fail;
      document.head.appendChild(s);
    });
  }

  function pdfPages(r) {
    const p = PROFILES[r.primary];
    const today = new Date().toLocaleDateString('pt-BR');
    const head = `<div class="pdf-head"><span><b>Teste DISC</b> · ${esc(CFG.EVENT_NAME || '')}</span><span>${today}</span></div>`;
    const foot = (n) => `<div class="pdf-foot"><span>Ferramenta de autoconhecimento inspirada na teoria DISC. Não substitui o mapeamento completo.</span><span>${n}/2</span></div>`;
    const deco = `<span class="pg-deco" style="width:340px;height:340px;background:${p.corSoft};right:-120px;top:-120px"></span><span class="pg-deco" style="width:260px;height:260px;background:#FBE3E9;left:-110px;bottom:-90px"></span>`;
    const avatar = CFG.ANALYST_PHOTO ? `<img src="${esc(CFG.ANALYST_PHOTO)}" alt="">` : esc((CFG.ANALYST_NAME || 'A')[0]);
    const waNum = String(CFG.WHATSAPP || '').replace(/^55(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');

    return `
      <div class="pdf-page" style="--ps:${p.corSoft}">
        ${deco}${head}
        <div class="pdf-hero">
          <div class="pdf-badge" style="background:${p.cor}">${ICONS[r.primary]}</div>
          <div>
            <div class="hi">${esc(state.nome)}, você é</div>
            <h1 style="color:${p.cor}">${p.apelido}</h1>
            <div class="tg">“${p.tagline}” · Perfil ${p.nome} (${r.primary}) · ${r.pct[r.primary]}%</div>
          </div>
        </div>
        <div class="pdf-row">
          <div class="pdf-box"><h3>Seu jeito de se relacionar</h3><p>${esc(p.descricao)}</p>
            <div class="tags">${p.tracos.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div></div>
          <div class="pdf-box"><h3>Seus 4 fatores DISC</h3>${barsHTML(r)}${mixHTML(r)}</div>
        </div>
        <div class="pdf-two">
          <div class="pdf-box"><h3>Seus superpoderes nas amizades</h3>${listHTML(p.superpoderes)}</div>
          <div class="pdf-box"><h3>O que você precisa de uma amiga</h3>${listHTML(p.precisa, 'heart')}</div>
        </div>
        <div class="pdf-facts">
          <div class="pdf-box"><span class="k">Sob pressão</span><p>${esc(p.pressao)}</p></div>
          <div class="pdf-box"><span class="k">Como você decide</span><p>${esc(p.decisao)}</p></div>
          <div class="pdf-box"><span class="k">Seu maior receio</span><p>${esc(p.medo)}</p></div>
        </div>
        ${foot(1)}
      </div>
      <div class="pdf-page" style="--ps:${p.corSoft}">
        ${deco}${head}
        <div class="pdf-box" style="margin-top:30px"><h3>Pontos de atenção nas suas relações</h3>${listHTML(p.atencao, 'warn')}</div>
        <h2 class="pdf-h2">Como se conectar com cada tipo de amiga</h2>
        <p class="pdf-sub">Cada mulher se sente acolhida de um jeito. Use isso a seu favor nas suas relações.</p>
        <div class="pdf-cc">${connectCards(r)}</div>
        <div class="pdf-chal"><span class="em">🎯</span><div><small>Seu desafio de amizade</small><p>${esc(p.desafio)}</p></div></div>
        <div class="pdf-cta">
          <div class="avatar">${avatar}</div>
          <div>
            <h4>Quer ir além? Faça a Análise DISC completa</h4>
            <p>Perfil natural x adaptado, pontos fortes x limitantes, índices de flexibilidade e autoestima, motivadores e devolutiva individual com a ${esc(CFG.ANALYST_NAME || '')}, ${esc(CFG.ANALYST_ROLE || '')}.</p>
            <span class="wa">${WA_ICON} WhatsApp ${esc(waNum)}</span>
          </div>
        </div>
        ${foot(2)}
      </div>`;
  }

  async function downloadPdf() {
    const btn = $('#btnPdf');
    const label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Gerando seu PDF…';
    try {
      await Promise.all([
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
      ]);
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const root = $('#pdfRoot');
      root.innerHTML = pdfPages(RESULT);
      root.querySelectorAll('.fill').forEach((f) => { f.style.width = f.dataset.w + '%'; });
      root.querySelectorAll('[data-count]').forEach((el) => { el.textContent = el.dataset.count + '%'; });

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pages = root.querySelectorAll('.pdf-page');
      for (let i = 0; i < pages.length; i++) {
        const canvas = await window.html2canvas(pages[i], { scale: 2, backgroundColor: '#FFFBF8', useCORS: true, logging: false });
        if (i > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
      }
      const slug = firstName().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-') || 'minha';
      pdf.save(`Analise-DISC-${slug}.pdf`);
      root.innerHTML = '';
      send({ acao: 'pdf' });
      toast('Pronto! Sua análise foi baixada 💛');
    } catch (err) {
      console.error(err);
      toast('Não foi possível gerar o PDF agora. Tente novamente.');
    } finally {
      btn.disabled = false; btn.textContent = label;
    }
  }

  /* ---------- Início ---------- */
  render(1);
})();
