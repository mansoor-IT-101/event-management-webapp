// SET FOOTER YEAR
document.getElementById('year').textContent = new Date().getFullYear();

// INITIAL EVENTS DATA
let events = [
  {
    id: 1,
    name: "GDG Peshawar Event",
    date: "2025-08-15",
    desc: "Join us for DevFest Peshawar 2025 - AmplifAI, the region’s biggest developer conference and part of the world’s largest community-led tech movement powered by Google Developer Groups (GDG).."
  },
  {
    id: 2,
    name: "TECHKHA EXPEDITION ",
    date: "2026-05-17",
    desc: "1 DAY TRIP TO MASHKPURI TOP."
  },
   {
    id: 3,
    name: "Final exam ",
    date: "2026-06-28",
    desc: "booring time."
  }
];

//STATE
let nextId = 10;
let searchQuery = '';

function isPast(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function sortEvents(arr) {
  return [...arr].sort((a, b) => new Date(a.date) - new Date(b.date));
}

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// RENDER EVENTS
function renderEvents() {
  const list = document.getElementById('eventList');
  const empty = document.getElementById('emptyState');
  const pill = document.getElementById('countPill');

  list.innerHTML = '';

  // Sort events by date
  let filtered = sortEvents(events);

  // Filter by search query (name or date)
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(e =>
      e.name.toLowerCase().includes(q) || e.date.includes(q)
    );
  }

  // Update the upcoming count pill
  pill.textContent = filtered.filter(e => !isPast(e.date)).length;

  // Show empty state if no results
  if (filtered.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  // Build each event card
  filtered.forEach((ev, i) => {
    const past = isPast(ev.date);

    const card = document.createElement('div');
    card.className = 'event-card' + (past ? ' past' : '');
    card.style.animationDelay = `${i * 0.04}s`;

    card.innerHTML = `
      <div class="${past ? 'past-label' : 'upcoming-label'}">
        ${past ? '● Past' : '● Upcoming'}
      </div>
      <div class="event-name">${escHtml(ev.name)}</div>
      <div class="event-date">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
        ${formatDate(ev.date)}
      </div>
      <div class="event-desc">${escHtml(ev.desc)}</div>
      <button class="btn-delete" onclick="deleteEvent(${ev.id})">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
        Delete
      </button>
    `;

    list.appendChild(card);
  });
}

// ── ADD EVENT ──
function addEvent() {
  const nameInput = document.getElementById('eventName');
  const dateInput = document.getElementById('eventDate');
  const descInput = document.getElementById('eventDesc');
  const warning   = document.getElementById('warning');

  const name = nameInput.value.trim();
  const date = dateInput.value;
  const desc = descInput.value.trim();

  // Validation: all fields required
  if (!name || !date || !desc) {
    warning.textContent = '⚠ All fields are required. Please fill in every field.';
    warning.style.display = 'block';

    // Auto-hide after 3.5 seconds
    setTimeout(() => {
      warning.style.display = 'none';
    }, 3500);

    return;
  }

  // Hide warning if visible
  warning.style.display = 'none';

  // Add new event to array
  events.push({ id: nextId++, name, date, desc });

  // Clear form fields
  nameInput.value = '';
  dateInput.value = '';
  descInput.value = '';

  // Re-render (auto-sorted)
  renderEvents();
}

//DELETE EVENT
function deleteEvent(id) {
  events = events.filter(e => e.id !== id);
  renderEvents();
}

//SEARCH BAR
document.getElementById('searchBar').addEventListener('input', function () {
  searchQuery = this.value.trim();
  renderEvents();
});

//ADD BUTTON CLICK
document.getElementById('addBtn').addEventListener('click', addEvent);

//INITIAL RENDER
renderEvents();
