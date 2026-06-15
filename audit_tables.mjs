// Audit script - checks which tables exist in Supabase
// Run: node audit_tables.mjs

const SUPABASE_URL = 'https://rhwelwvqmpiwicaryfbm.supabase.co'
const SUPABASE_KEY = 'sb_publishable_IbvBttiuglm8pOgXiIfayg_zbywa13K'

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
}

// All tables the admin modules require
const REQUIRED_TABLES = [
  'productos',
  'catalogos',
  'profiles',
  'videos_promocionales',
  'descuentos_visuales',
  'banners_promocionales',
  'tiendas',
  'receptions',
  'product_logs',
  'tasas_cambio',
]

async function checkTable(tableName) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${tableName}?limit=1&select=*`,
      { headers }
    )
    if (res.status === 200) {
      const data = await res.json()
      return { table: tableName, exists: true, rows: data.length, status: res.status }
    } else {
      const err = await res.json()
      return { table: tableName, exists: false, status: res.status, error: err.message || err.hint || JSON.stringify(err) }
    }
  } catch (e) {
    return { table: tableName, exists: false, status: 'network_error', error: e.message }
  }
}

async function main() {
  console.log('\n🔍 AUDITORIA DE TABLAS - SUPABASE FARMATUYA')
  console.log('='.repeat(55))

  const results = await Promise.all(REQUIRED_TABLES.map(checkTable))

  const existing = results.filter(r => r.exists)
  const missing = results.filter(r => !r.exists)

  console.log('\n✅ TABLAS EXISTENTES:')
  existing.forEach(r => console.log(`   ✓ ${r.table.padEnd(25)} [HTTP ${r.status}]`))

  console.log('\n❌ TABLAS FALTANTES:')
  if (missing.length === 0) {
    console.log('   Ninguna - todas las tablas existen.')
  } else {
    missing.forEach(r => console.log(`   ✗ ${r.table.padEnd(25)} → ${r.error}`))
  }

  console.log('\n' + '='.repeat(55))
  console.log(`RESUMEN: ${existing.length}/${REQUIRED_TABLES.length} tablas OK, ${missing.length} faltantes\n`)

  if (missing.length > 0) {
    console.log('📋 SQL PARA CREAR TABLAS FALTANTES:')
    missing.forEach(r => console.log(`   → Ver SQL de "${r.table}" en el reporte`))
  }
}

main()
