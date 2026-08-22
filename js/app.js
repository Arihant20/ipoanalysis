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

function filterCards(crit, btn) {
  document.querySelectorAll('.pill-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.lm-card').forEach(card => {
    const status = card.getAttribute('data-status');
    const tier = card.getAttribute('data-tier');
    const mb = parseInt(card.getAttribute('data-mb') || '0');
    const sme = parseInt(card.getAttribute('data-sme') || '0');

    if (crit === 'all') {
      card.style.display = '';
    } else if (crit === 'OPEN' || crit === 'RECENT_CLOSED') {
      card.style.display = (status === crit) ? '' : 'none';
    } else if (crit === 'tier1') {
      card.style.display = (tier === 'tier1') ? '' : 'none';
    } else if (crit === 'mb_active') {
      card.style.display = (mb >= 5) ? '' : 'none';
    } else if (crit === 'sme_active') {
      card.style.display = (sme >= 5) ? '' : 'none';
    } else {
      card.style.display = '';
    }
  });
}

function searchCards() {
  const q = document.getElementById('search-lm').value.toLowerCase();
  document.querySelectorAll('.lm-card').forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
}

function inspectLM(btn) {
  const name = btn.getAttribute('data-name');
  const hist = JSON.parse(btn.getAttribute('data-hist') || '[]');
  document.getElementById('modal-title').innerText = name + ' — Deal History (' + hist.length + ' IPOs)';
  let html = '<table style="width:100%"><thead><tr><th>IPO Name</th><th>Year</th><th>Segment</th><th class="num">Listing Gain</th><th class="num">Post-Listing Return</th></tr></thead><tbody>';
  hist.forEach(h => {
    const gCol = (h.gain > 0) ? '#10b981' : ((h.gain < 0) ? '#ef4444' : '#e2e8f0');
    const pCol = (h.post_ret > 0) ? '#10b981' : ((h.post_ret < 0) ? '#ef4444' : '#94a3b8');
    const pStr = (h.post_ret !== null) ? (h.post_ret >= 0 ? '+' : '') + h.post_ret.toFixed(1) + '%' : '<span style="color:#64748b">—</span>';
    html += '<tr><td><b>' + h.name + '</b></td><td>' + (h.year||'—') + '</td><td><span class="badge-rec" style="background:#1e293b;color:#94a3b8">' + (h.seg||'—') + '</span></td><td class="num" style="color:' + gCol + '"><b>' + (h.gain>=0?'+':'') + h.gain.toFixed(1) + '%</b></td><td class="num" style="color:' + pCol + '"><b>' + pStr + '</b></td></tr>';
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
