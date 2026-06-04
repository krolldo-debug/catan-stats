export const STORAGE_VERSION = 'v3'

export const PLAYERS = {
  dominic: { id: 'dominic', name: 'Dominic', short: 'Dome', color: '#F59E0B', colorDark: '#B45309', colorGlow: 'rgba(245,158,11,0.3)' },
  dante:   { id: 'dante',   name: 'Dante',   short: 'Dante', color: '#EF4444', colorDark: '#991B1B', colorGlow: 'rgba(239,68,68,0.3)' },
  carl:    { id: 'carl',    name: 'Carl',    short: 'Carl',  color: '#14B8A6', colorDark: '#0F766E', colorGlow: 'rgba(20,184,166,0.3)' },
}

// Real game night data — DD.MM.YYYY converted to YYYY-MM-DD.
// Note: Johannes played once (14.05.2025) with 0 wins and never again,
// so he is not tracked as a permanent player.
// The two 14.07.2025 entries are two separate game nights on the same day.
export const INITIAL_GAME_NIGHTS = [
  { id: 'gn001', date: '2025-05-14', dominic: 1, dante: 0, carl: 0 },
  { id: 'gn002', date: '2025-05-20', dominic: 3, dante: 0, carl: 1 },
  { id: 'gn003', date: '2025-05-26', dominic: 2, dante: 2, carl: 1 },
  { id: 'gn004', date: '2025-06-09', dominic: 0, dante: 1, carl: 2 },
  { id: 'gn005', date: '2025-06-10', dominic: 2, dante: 0, carl: 1 },
  { id: 'gn006', date: '2025-06-22', dominic: 0, dante: 1, carl: 2 },
  { id: 'gn007', date: '2025-06-24', dominic: 1, dante: 0, carl: 1 },
  { id: 'gn008', date: '2025-06-26', dominic: 1, dante: 1, carl: 2 },
  { id: 'gn009', date: '2025-07-09', dominic: 1, dante: 0, carl: 2 },
  { id: 'gn010', date: '2025-07-14', dominic: 0, dante: 0, carl: 2 },
  { id: 'gn011', date: '2025-07-14', dominic: 1, dante: 1, carl: 0 },
  { id: 'gn012', date: '2025-07-22', dominic: 1, dante: 0, carl: 1 },
  { id: 'gn013', date: '2025-08-03', dominic: 0, dante: 1, carl: 1 },
  { id: 'gn014', date: '2025-08-06', dominic: 1, dante: 0, carl: 2 },
  { id: 'gn015', date: '2025-08-08', dominic: 2, dante: 0, carl: 0 },
  { id: 'gn016', date: '2025-08-10', dominic: 1, dante: 0, carl: 1 },
  { id: 'gn017', date: '2025-08-15', dominic: 1, dante: 0, carl: 2 },
  { id: 'gn018', date: '2025-08-17', dominic: 0, dante: 0, carl: 1 },
  { id: 'gn019', date: '2025-08-27', dominic: 0, dante: 1, carl: 1 },
  { id: 'gn020', date: '2025-09-21', dominic: 0, dante: 0, carl: 2 },
  { id: 'gn021', date: '2025-09-25', dominic: 0, dante: 1, carl: 2 },
  { id: 'gn022', date: '2025-09-30', dominic: 0, dante: 1, carl: 0 },
  { id: 'gn023', date: '2025-10-07', dominic: 0, dante: 1, carl: 0 },
  { id: 'gn024', date: '2025-10-13', dominic: 0, dante: 0, carl: 1 },
  { id: 'gn025', date: '2025-10-19', dominic: 0, dante: 0, carl: 1 },
  { id: 'gn026', date: '2025-10-27', dominic: 0, dante: 1, carl: 0 },
  { id: 'gn027', date: '2025-10-28', dominic: 1, dante: 1, carl: 0 },
  { id: 'gn028', date: '2026-02-05', dominic: 0, dante: 2, carl: 0 },
  { id: 'gn029', date: '2026-02-08', dominic: 1, dante: 1, carl: 0 },
  { id: 'gn030', date: '2026-02-18', dominic: 2, dante: 0, carl: 0 },
  { id: 'gn031', date: '2026-03-02', dominic: 2, dante: 2, carl: 1 },
  { id: 'gn032', date: '2026-03-10', dominic: 0, dante: 0, carl: 2 },
  { id: 'gn033', date: '2026-03-16', dominic: 1, dante: 0, carl: 0 },
  { id: 'gn034', date: '2026-03-17', dominic: 2, dante: 1, carl: 0 },
  { id: 'gn035', date: '2026-03-19', dominic: 2, dante: 2, carl: 0 },
  { id: 'gn036', date: '2026-03-24', dominic: 2, dante: 1, carl: 0 },
  { id: 'gn037', date: '2026-04-01', dominic: 0, dante: 1, carl: 3 },
  { id: 'gn038', date: '2026-04-02', dominic: 0, dante: 1, carl: 1 },
  { id: 'gn039', date: '2026-04-07', dominic: 1, dante: 0, carl: 0 },
  { id: 'gn040', date: '2026-04-08', dominic: 1, dante: 1, carl: 0 },
  { id: 'gn041', date: '2026-04-10', dominic: 1, dante: 0, carl: 1 },
  { id: 'gn042', date: '2026-04-13', dominic: 0, dante: 2, carl: 1 },
  { id: 'gn043', date: '2026-05-13', dominic: 2, dante: 0, carl: 1 },
  { id: 'gn044', date: '2026-05-14', dominic: 1, dante: 0, carl: 0 },
  { id: 'gn045', date: '2026-05-18', dominic: 0, dante: 3, carl: 0 },
  { id: 'gn046', date: '2026-05-20', dominic: 1, dante: 0, carl: 1 },
]

export const INITIAL_DUO_DOMINIC_CARL = []

export const INITIAL_DUO_DOMINIC_DANTE = []

export const INITIAL_DUO_DANTE_CARL = []
