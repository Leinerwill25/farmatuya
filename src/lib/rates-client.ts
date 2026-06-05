import { createClient } from '@supabase/supabase-js';

const RATES_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL_RATES;
const RATES_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_RATES;

// Cliente de Supabase para la base de datos de tasas
export const ratesSupabase = RATES_SUPABASE_URL && RATES_SUPABASE_ANON_KEY
	? createClient(RATES_SUPABASE_URL, RATES_SUPABASE_ANON_KEY)
	: null;

export interface Rate {
	id: string;
	code: string; // Ejemplo: 'USD'
	rate: number; // Tasa de cambio (ej: 36.5 Bs por 1 USD)
	curr_date: string; // Fecha de la tasa
	curr_time: string; // Hora de la tasa
	insert_datetime: string;
	rate_datetime: string;
	created_at: string;
}

/**
 * Obtiene la tasa de cambio más reciente para un código de moneda
 */
export async function getLatestRate(code: string = 'USD'): Promise<Rate | null> {
	if (!ratesSupabase) {
		console.error('[Rates Client] Cliente de tasas no inicializado');
		return null;
	}

	try {
		const { data, error } = await ratesSupabase
			.from('rates')
			.select('*')
			.eq('code', code.toUpperCase())
			.order('rate_datetime', { ascending: false })
			.limit(1)
			.maybeSingle();

		if (error) {
			console.error('[Rates Client] Error obteniendo tasa:', error);
			return null;
		}

		return data as Rate | null;
	} catch (err) {
		console.error('[Rates Client] Excepción obteniendo tasa:', err);
		return null;
	}
}
