// IPO Estimator Pro - Client-side Interactions
function filterOpen(crit, btn) {
  btn.parentElement.querySelectorAll('.pill-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.open-row').forEach(row => {
    const rec = row.getAttribute('data-rec');
    const strat = row.getAttribute('data-strat');
    if (crit === 'all' || rec === crit || strat === crit) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function searchOpen() {
  const q = document.getElementById('search-open').value.toLowerCase();
  document.querySelectorAll('.open-row').forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
}

function filterPending(crit, btn) {
  btn.parentElement.querySelectorAll('.pill-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.pending-row').forEach(row => {
    const rec = row.getAttribute('data-rec');
    const strat = row.getAttribute('data-strat');
    if (crit === 'all' || rec === crit || strat === crit) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function searchPending() {
  const q = document.getElementById('search-pending').value.toLowerCase();
  document.querySelectorAll('.pending-row').forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
}

function searchRecentlyListed() {
  const q = document.getElementById('search-recently-listed').value.toLowerCase();
  document.querySelectorAll('.recently-listed-row').forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
}

function searchPast() {
  const q = document.getElementById('search-past').value.toLowerCase();
  document.querySelectorAll('.past-row').forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
}

let currentLmFilter = 'all';
let currentLmSearch = '';
let lmPage = 1;
const LM_PAGE_SIZE = 24;

function filterCards(crit, btn) {
  document.querySelectorAll('.pill-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentLmFilter = crit;
  applyLmFilters();
}

function searchCards() {
  currentLmSearch = (document.getElementById('search-lm').value || '').toLowerCase().trim();
  applyLmFilters();
}

function applyLmFilters() {
  const allCards = Array.from(document.querySelectorAll('.lm-card'));
  allCards.forEach(card => {
    const status = card.getAttribute('data-status') || '';
    const tier = card.getAttribute('data-tier') || '';
    const mb = parseInt(card.getAttribute('data-mb') || '0', 10);
    const sme = parseInt(card.getAttribute('data-sme') || '0', 10);
    const text = card.innerText.toLowerCase();

    let matchesFilter = true;
    if (currentLmFilter === 'OPEN' || currentLmFilter === 'RECENT_CLOSED') {
      matchesFilter = (status === currentLmFilter);
    } else if (currentLmFilter === 'tier1') {
      matchesFilter = (tier === 'tier1');
    } else if (currentLmFilter === 'mb_active') {
      matchesFilter = (mb >= 5);
    } else if (currentLmFilter === 'sme_active') {
      matchesFilter = (sme >= 5);
    }

    let matchesSearch = (!currentLmSearch || text.includes(currentLmSearch));
    if (matchesFilter && matchesSearch) {
      card.setAttribute('data-matched', 'true');
    } else {
      card.setAttribute('data-matched', 'false');
    }
  });

  resetPagination();
}

function updatePagination() {
  const matchedCards = Array.from(document.querySelectorAll('.lm-card[data-matched="true"]'));
  const totalVisible = matchedCards.length;
  const showing = Math.min(lmPage * LM_PAGE_SIZE, totalVisible);

  document.querySelectorAll('.lm-card[data-matched="false"]').forEach(card => {
    card.style.display = 'none';
  });

  let count = 0;
  matchedCards.forEach(card => {
    count++;
    card.style.display = count <= showing ? '' : 'none';
  });

  const btn = document.getElementById('lm-load-more');
  const info = document.getElementById('lm-page-info');
  if (btn) btn.style.display = (showing < totalVisible) ? 'inline-flex' : 'none';
  if (info) info.textContent = 'Showing ' + showing + ' of ' + totalVisible + ' bankers';
}

function resetPagination() {
  lmPage = 1;
  updatePagination();
}

function loadMoreLMs() {
  lmPage++;
  updatePagination();
}

function initLmPage() {
  if (document.getElementById('lm-cards-container')) {
    applyLmFilters();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLmPage);
} else {
  initLmPage();
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function inspectLM(btn) {
  const name = btn.getAttribute('data-name');
  const hist = JSON.parse(btn.getAttribute('data-hist') || '[]');
  document.getElementById('modal-title').textContent = (name || '') + ' — Deal History (' + hist.length + ' IPOs)';
  let html = '<table style="width:100%"><thead><tr><th>IPO Name</th><th>Year</th><th>Segment</th><th class="num">Listing Gain</th><th class="num">Post-Listing Return</th></tr></thead><tbody>';
  hist.forEach(h => {
    const gainNum = typeof h.gain === 'number' ? h.gain : parseFloat(h.gain) || 0;
    const gCol = (gainNum > 0) ? '#10b981' : ((gainNum < 0) ? '#ef4444' : '#e2e8f0');
    const pCol = (h.post_ret > 0) ? '#10b981' : ((h.post_ret < 0) ? '#ef4444' : '#94a3b8');
    const pStr = (h.post_ret !== null && typeof h.post_ret !== 'undefined') ? (h.post_ret >= 0 ? '+' : '') + Number(h.post_ret).toFixed(1) + '%' : '<span style="color:#64748b">—</span>';
    html += '<tr><td><b>' + esc(h.name) + '</b></td><td>' + esc(h.year||'—') + '</td><td><span class="badge-rec" style="background:#1e293b;color:#94a3b8">' + esc(h.seg||'—') + '</span></td><td class="num" style="color:' + gCol + '"><b>' + (gainNum>=0?'+':'') + gainNum.toFixed(1) + '%</b></td><td class="num" style="color:' + pCol + '"><b>' + pStr + '</b></td></tr>';
  });
  html += '</tbody></table>';
  document.getElementById('modal-body').innerHTML = html;
  document.getElementById('lm-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('lm-modal').style.display = 'none';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const m = document.getElementById('lm-modal');
    if (m) m.style.display = 'none';
  }
});
