// Check the rates table in the second Supabase instance
const RATES_URL = 'https://ddkpebcfienaertknqmp.supabase.co'
const RATES_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRka3BlYmNmaWVuYWVydGtucW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MDY0ODcsImV4cCI6MjA3ODQ4MjQ4N30.Iumg8e4bjvFIi6H057V-6pBRda9qZpifvQqPK2suERc'

const headers = {
  'apikey': RATES_KEY,
  'Authorization': `Bearer ${RATES_KEY}`,
}

async function main() {
  console.log('\n🔍 VERIFICANDO TABLA RATES (Supabase secundario)')
  console.log('='.repeat(55))

  const res = await fetch(`${RATES_URL}/rest/v1/rates?limit=3&select=*&order=rate_datetime.desc`, { headers })
  const status = res.status

  if (status === 200) {
    const data = await res.json()
    console.log(`✅ Tabla "rates" EXISTE - HTTP ${status}`)
    console.log(`   Registros de muestra: ${data.length}`)
    if (data.length > 0) {
      data.forEach(r => console.log(`   → ${r.code}: ${r.rate} Bs (${r.curr_date})`))
    } else {
      console.log('   ⚠️  La tabla existe pero está VACÍA - las tasas no cargarán')
    }
  } else {
    const err = await res.json()
    console.log(`❌ Tabla "rates" NO EXISTE - HTTP ${status}`)
    console.log(`   Error: ${err.message || JSON.stringify(err)}`)
  }
}

main()
