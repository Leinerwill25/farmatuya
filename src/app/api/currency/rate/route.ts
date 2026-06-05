import { NextRequest, NextResponse } from 'next/server';
import { getLatestRate } from '@/lib/rates-client'; // Ajusta la ruta según tu proyecto

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const code = searchParams.get('code') || 'USD';

		const rate = await getLatestRate(code);

		if (!rate) {
			return NextResponse.json({ error: 'No se encontró tasa de cambio' }, { status: 404 });
		}

		return NextResponse.json({ success: true, rate });
	} catch (error: any) {
		console.error('[Currency Rate API] Error:', error);
		return NextResponse.json({ error: error.message || 'Error obteniendo tasa de cambio' }, { status: 500 });
	}
}
