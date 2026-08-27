// IPO Estimator Pro - Client-side Interactions

// Active action filter state per section
const sectionActionFilters = {
  'open': 'all',
  'pending': 'all',
  'recently-listed': 'all',
  'past': 'all'
};

function filterAction(section, action, btn) {
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.pill-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  sectionActionFilters[section] = action;
  filterSection(section);
}

function filterSection(section) {
  const actionCrit = sectionActionFilters[section] || 'all';
  
  const sectorSelect = document.getElementById('sector-' + section);
  const sectorCrit = sectorSelect ? sectorSelect.value : 'all';
  
  const searchInput = document.getElementById('search-' + section);
  const searchCrit = searchInput ? searchInput.value.toLowerCase().trim() : '';

  const rowClass = (section === 'open') ? '.open-row' :
                   (section === 'pending') ? '.pending-row' :
                   (section === 'recently-listed') ? '.recently-listed-row' : '.past-row';

  document.querySelectorAll(rowClass).forEach(row => {
    const rec = row.getAttribute('data-rec') || '';
    const strat = row.getAttribute('data-strat') || '';
    const sector = row.getAttribute('data-sector') || '';
    const text = row.innerText.toLowerCase();

    // 1. Action filter check
    let matchesAction = (actionCrit === 'all' || rec === actionCrit || strat === actionCrit);

    // 2. Sector filter check
    let matchesSector = (sectorCrit === 'all' || sector === sectorCrit);

    // 3. Search query check
    let matchesSearch = (!searchCrit || text.includes(searchCrit));

    if (matchesAction && matchesSector && matchesSearch) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Backwards-compatible legacy helpers
function filterOpen(crit, btn) { filterAction('open', crit, btn); }
function searchOpen() { filterSection('open'); }
function filterPending(crit, btn) { filterAction('pending', crit, btn); }
function searchPending() { filterSection('pending'); }
function searchRecentlyListed() { filterSection('recently-listed'); }
function searchPast() { filterSection('past'); }

// ==============================================================================
// INTERACTIVE TABLE COLUMN SORTING
// ==============================================================================

const sortStates = {};

function sortTable(tableId, colIndex, isNum) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  if (rows.length === 0) return;

  const key = tableId + '_' + colIndex;
  const currentAsc = sortStates[key] === 'asc';
  const newAsc = !currentAsc;
  sortStates[key] = newAsc ? 'asc' : 'desc';

  // Update header indicators
  table.querySelectorAll('th').forEach((th, idx) => {
    th.classList.remove('sort-asc', 'sort-desc');
    if (idx === colIndex) {
      th.classList.add(newAsc ? 'sort-asc' : 'sort-desc');
    }
  });

  function parseCellVal(cell) {
    if (!cell) return 0;
    const txt = cell.innerText.trim();
    if (!txt || txt === '—' || txt === '--' || txt === 'n/a') return -999999;
    if (isNum) {
      const clean = txt.replace(/₹/g, '').replace(/,/g, '').replace(/%/g, '').replace(/x/g, '').replace(/Cr/g, '').replace(/\+/g, '').trim();
      const n = parseFloat(clean);
      return isNaN(n) ? -999999 : n;
    }
    return txt.toLowerCase();
  }

  rows.sort((rowA, rowB) => {
    const cellA = rowA.children[colIndex];
    const cellB = rowB.children[colIndex];
    const valA = parseCellVal(cellA);
    const valB = parseCellVal(cellB);

    if (valA < valB) return newAsc ? -1 : 1;
    if (valA > valB) return newAsc ? 1 : -1;
    return 0;
  });

  rows.forEach(r => tbody.appendChild(r));
}

// ==============================================================================
// DENSITY TOGGLE (Compact vs Ultra-Compact)
// ==============================================================================

function toggleDensity() {
  const isUltra = document.body.classList.toggle('ultra-compact');
  const btn = document.getElementById('density-btn');
  if (btn) {
    btn.textContent = isUltra ? 'Density: Standard' : 'Density: Ultra-Compact';
  }
  try {
    localStorage.setItem('ipo_density', isUltra ? 'ultra' : 'compact');
  } catch (e) {}
}

function initDensity() {
  try {
    const saved = localStorage.getItem('ipo_density');
    if (saved === 'ultra') {
      document.body.classList.add('ultra-compact');
      const btn = document.getElementById('density-btn');
      if (btn) btn.textContent = 'Density: Standard';
    }
  } catch (e) {}
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

function initPage() {
  initDensity();
  if (document.getElementById('lm-cards-container')) {
    applyLmFilters();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
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
