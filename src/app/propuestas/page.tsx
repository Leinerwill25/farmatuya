'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  CalendarX2, 
  CalendarCheck2, 
  Database, 
  Ban, 
  Users, 
  Calculator,
  ChevronRight,
  MessageCircle,
  Zap,
  Check,
  Megaphone,
  Star,
  CheckCircle
} from 'lucide-react'

export default function PropuestasPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-foreground font-sans pb-20">
      
      {/* Header Minimalista */}
      <header className="bg-white border-b border-gray-100 py-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex flex-col">
            <div className="h-12 w-28 relative overflow-hidden flex items-center justify-center">
              <Image
                src="/logon_transparent.png"
                alt="2N Logo"
                fill
                sizes="112px"
                className="object-contain"
                style={{
                  transform: 'scale(2.2)',
                  transformOrigin: 'center 46%'
                }}
              />
            </div>
          </div>
          <a href="/" className="text-sm font-medium text-brand-dark/70 hover:text-brand-orange transition-colors">
            Volver al inicio
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <div className="mb-10 text-center sm:text-left">
            <p className="text-sm font-semibold tracking-wider text-brand-orange uppercase mb-2">Propuesta comercial v2 • Mayo 2026</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-3">Sistema de Gestión Digital</h1>
            <p className="text-lg text-brand-dark/70">Preparado exclusivamente para Casa de Representación 2N, C.A.</p>
          </div>

          {/* DEFINICIÓN DE MODIFICACIÓN */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-12">
            <h2 className="text-lg font-bold text-brand-dark mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
              <FileText className="h-5 w-5 text-brand-blue" />
              Definición oficial de "modificación" (Aplica a todas las propuestas)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-4">Sí cuenta como modificación</p>
                <ul className="space-y-3">
                  {[
                    "Cambios de texto, colores o imágenes en páginas existentes",
                    "Ajustes de diseño o layout en secciones ya construidas",
                    "Agregar o quitar un campo en un formulario existente",
                    "Actualizar datos de contacto, redes sociales o textos",
                    "Reordenar o renombrar secciones existentes",
                    "Cambios simples de comportamiento sin tocar base de datos (máx. 2h)"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">NO cuenta (se cotiza aparte)</p>
                <ul className="space-y-3">
                  {[
                    "Crear una nueva página o módulo inexistente",
                    "Cambios en la estructura de la base de datos",
                    "Nuevas integraciones con terceros (pagos, APIs externas)",
                    "Módulos nuevos del panel admin (facturación, reportes)",
                    "Lógica de negocio nueva que no existe hoy",
                    "Cualquier cambio que requiera más de 2 horas de desarrollo"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-8 pt-5 border-t border-gray-50 bg-gray-50/50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 leading-relaxed">
                Cada solicitud de modificación debe enviarse por escrito (WhatsApp o email). El proveedor confirma si aplica o no al paquete antes de ejecutarla. Las modificaciones no utilizadas no son acumulables ni reembolsables.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            
            {/* PROPUESTA 1 */}
            <motion.div variants={fadeIn} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gray-50/80 p-6 sm:p-8 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3">Propuesta 01 — Licencia perpetua</span>
                    <h3 className="text-2xl font-bold text-brand-dark">Pago único</h3>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-3xl font-black text-brand-dark">$700 <span className="text-lg text-gray-500 font-medium">USD</span></p>
                    <p className="text-sm text-gray-500">Sin recurrencia obligatoria</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Incluye</p>
                    <ul className="space-y-3">
                      {[
                        "Sistema completo entregado y configurado",
                        "1 sesión de capacitación (hasta 2h, remota)",
                        "10 modificaciones menores (según definición)",
                        "Manual de uso básico en PDF",
                        "30 días de garantía contra errores técnicos"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-brand-dark/80">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">No incluye</p>
                    <ul className="space-y-3">
                      {[
                        "Soporte técnico mensual",
                        "Dominio personalizado",
                        "Actualizaciones futuras de funciones",
                        "Corrección de errores tras los 30 días"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-500">
                          <XCircle className="h-5 w-5 text-red-300 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Al firmar el contrato</p>
                    <p className="text-lg font-bold text-brand-dark">$350 USD</p>
                    <p className="text-xs text-gray-500">50% en divisas (transferencia)</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Al entregar el sistema</p>
                    <p className="text-lg font-bold text-brand-dark">Bs equiv. $350</p>
                    <p className="text-xs text-gray-500">A tasa BCV del día de pago</p>
                  </div>
                </div>

                <div className="bg-blue-50 text-blue-800 rounded-xl p-4 flex gap-3 text-sm">
                  <Calculator className="h-5 w-5 shrink-0 text-blue-600" />
                  <p><strong>Soporte técnico opcional tras la entrega:</strong> $70 USD/mes — contratación libre, sin compromiso de permanencia. Sin soporte activo, las incidencias fuera de garantía se cotizan por hora.</p>
                </div>
              </div>
            </motion.div>

            {/* PROPUESTA 2 */}
            <motion.div variants={fadeIn} className="bg-white rounded-3xl shadow-lg border-2 border-brand-orange overflow-hidden relative">
              <div className="bg-brand-orange text-white text-center py-2 text-xs font-bold uppercase tracking-widest">
                Mejor relación costo-beneficio a largo plazo
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-white p-6 sm:p-8 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider rounded-full mb-3">Propuesta 02 — SaaS mensual</span>
                    <h3 className="text-2xl font-bold text-brand-dark">Servicio continuo</h3>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-3xl font-black text-brand-orange">$150 <span className="text-lg text-brand-orange/70 font-medium">USD/mes</span></p>
                    <p className="text-sm text-gray-500">Sin pago inicial. Pagadero en Bs</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-4">Incluye cada mes</p>
                    <ul className="space-y-3">
                      {[
                        "Sistema activo y operativo",
                        "Soporte técnico L–V 8am–5pm",
                        "Corrección de errores del sistema",
                        "Actualizaciones menores incluidas",
                        "1 modificación menor al mes",
                        "Capacitación inicial (1 sesión remota)"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-brand-dark/80">
                          <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Política de suspensión</p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-sm text-gray-600">
                        <CalendarX2 className="h-5 w-5 text-red-400 shrink-0" />
                        <span>Si el pago no se recibe antes del día 5, el acceso se suspende.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-gray-600">
                        <CalendarCheck2 className="h-5 w-5 text-green-500 shrink-0" />
                        <span>Al regularizar, el acceso se reactiva en &lt; 24h hábiles.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-gray-600">
                        <Ban className="h-5 w-5 text-red-500 shrink-0" />
                        <span>Los meses pagados no son reembolsables.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-blue-100">
                  <h4 className="font-bold text-brand-blue flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5" />
                    Programa de referidos
                  </h4>
                  <p className="text-sm text-brand-dark/80 mb-3">
                    Si 2N refiere a una casa de representación que contrate el mismo sistema y paga su primer mes, <strong className="text-brand-blue">2N recibe $50 USD de crédito</strong> descontados de su factura.
                  </p>
                  <p className="text-xs text-brand-dark/60">
                    Con 3 referidos activos: crédito de $150 = 1 mes gratuito para 2N.
                  </p>
                </div>

                <div className="bg-amber-50 text-amber-800 rounded-xl p-4 text-sm border border-amber-100">
                  <strong>Sin costo de entrada ni penalidad por salida.</strong> Cancelación con 15 días de aviso. Al cancelar, se entrega un respaldo completo en CSV/Excel.
                </div>
              </div>
            </motion.div>

            {/* PROPUESTA 3 */}
            <motion.div variants={fadeIn} className="bg-[#0D1B4B] text-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow relative">
              <div className="p-6 sm:p-8 border-b border-white/10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-bold uppercase tracking-wider rounded-full mb-3">Propuesta 03 — Plan completo</span>
                    <h3 className="text-2xl font-bold text-white">Máxima tranquilidad</h3>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-3xl font-black text-white">$1,200 <span className="text-lg text-white/60 font-medium">USD</span></p>
                    <p className="text-sm text-white/60">Pago en 2 cuotas (15 días)</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <div className="bg-white/5 rounded-xl p-4 mb-8 text-sm text-white/80 border border-white/10 flex gap-3">
                  <Calculator className="h-5 w-5 shrink-0 text-white/60" />
                  <p><strong>¿Por qué $1,200?</strong> Los 6 meses de soporte incluidos equivalen a $420 reales ($70 × 6). Para 2N sigue siendo más económico que contratar el desarrollo y luego soporte por separado, garantizando medio año de cobertura total.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Incluye</p>
                    <ul className="space-y-3">
                      {[
                        "Sistema completo entregado y configurado",
                        "Capacitación al equipo (1 sesión, hasta 3h)",
                        "6 meses de soporte técnico L–V 8am–5pm",
                        "20 modificaciones menores",
                        "Dominio .com por 1 año gestionado",
                        "Manual de administración completo en PDF"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-white/90">
                          <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Forma de pago</p>
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-xs text-white/60 mb-1">Cuota 1 — Al firmar el contrato</p>
                        <p className="text-lg font-bold text-white">$600 USD</p>
                        <p className="text-xs text-white/50">$300 en divisas + Bs equiv. $300</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-xs text-white/60 mb-1">Cuota 2 — A los 15 días</p>
                        <p className="text-lg font-bold text-white">$600 USD</p>
                        <p className="text-xs text-white/50">$300 en divisas + Bs equiv. $300</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/10 text-amber-200 rounded-xl p-4 text-sm border border-amber-500/20 mb-4">
                  <strong>Condición:</strong> el sistema se entrega funcional solo después de la Cuota 1. La Cuota 2 vence exactamente a los 15 días — si no se recibe, el acceso admin queda suspendido (el catálogo público permanece activo).
                </div>
                
                <p className="text-xs text-white/50">
                  Al vencer los 6 meses, 2N puede renovar el soporte por $70/mes o adquirir bloques de modificaciones. El dominio se renueva por cuenta del cliente al año siguiente.
                </p>
              </div>
            </motion.div>
          </div>

        </motion.div>

        {/* NUEVA SECCIÓN: PROPUESTA ESPECIAL */}
        <section id="propuesta-especial-2026" className="mt-24 space-y-16">
          {/* ENCABEZADO DE SECCIÓN */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-semibold text-brand-orange uppercase tracking-widest">
                Propuesta Especial
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="bg-brand-dark rounded-2xl p-8 text-white text-center">
              <span className="text-xs text-white/50 block mb-2">Emitida el 22 de mayo de 2026</span>
              <h2 className="text-3xl font-bold mb-2">
                Ecosistema Digital
                <span className="text-brand-orange"> 2N + FarmaTuya</span>
              </h2>
              <p className="text-white/70 text-sm max-w-xl mx-auto">
                Propuesta diseñada para integrar ambas marcas del grupo en un mismo ecosistema
                digital, con presencia web independiente y participación en la red de salud ASHIRA.
              </p>
            </div>
          </div>

          {/* BLOQUE: QUÉ INCLUYE CADA PÁGINA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tarjeta izquierda — Casa de Representación 2N, C.A. */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                  Distribuidora farmacéutica
                </span>
                <h3 className="text-xl font-bold text-brand-dark mb-2">Casa de Representación 2N, C.A.</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Portal corporativo de la casa de representación, catálogo completo de líneas terapéuticas, panel de gestión de inventario y recepción de mercancía.
                </p>
                
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">¿Qué incluye?</p>
                <ul className="space-y-3">
                  {[
                    "Landing page con identidad de marca 2N",
                    "Catálogo de 15+ líneas terapéuticas y 110+ productos",
                    "Panel administrativo completo (inventario, recepción, usuarios)",
                    "Precios multimoneda en tiempo real (USD / EUR / Bs BCV)",
                    "Gestión de usuarios con roles y permisos",
                    "Alertas de inventario bajo stock",
                    "Fichas técnicas imprimibles por producto",
                    "Integración WhatsApp para cotizaciones"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Tarjeta derecha — FarmaTuya */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                  Farmacia afiliada
                </span>
                <h3 className="text-xl font-bold text-brand-dark mb-2">FarmaTuya</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Portal público de FarmaTuya con catálogo de productos disponibles, sistema de gestión de inventario independiente e integración en la red ASHIRA.
                </p>
                
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">¿Qué incluye?</p>
                <ul className="space-y-3">
                  {[
                    "Landing page con identidad y colores propios de FarmaTuya",
                    "Catálogo de productos con disponibilidad y precios actualizados",
                    "Panel administrativo independiente para gestión de inventario",
                    "Precios multimoneda en tiempo real (USD / EUR / Bs BCV)",
                    "Ficha de producto con botón de consulta por WhatsApp",
                    "Diseño 100% responsivo y adaptado para móviles",
                    "Aparición en el directorio farmacéutico de ASHIRA"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* BLOQUE: DOS OPCIONES DE CONTRATACIÓN */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-brand-dark mb-2">Elige la modalidad que mejor se adapta</h3>
              <p className="text-sm text-gray-500">Dos opciones de contratación adaptadas a los objetivos comerciales del grupo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* OPCIÓN A — Con integración ASHIRA */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl shadow-lg border-2 border-brand-blue overflow-hidden relative flex flex-col justify-between"
              >
                <div>
                  <div className="bg-brand-blue text-white text-center py-2 text-xs font-bold uppercase tracking-widest">
                    Precio de socio fundador
                  </div>
                  
                  <div className="p-6 sm:p-8 border-b border-gray-100 bg-blue-50/30">
                    <span className="inline-block px-3 py-1 bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                      Opción A — Con integración ASHIRA
                    </span>
                    <h4 className="text-3xl font-black text-brand-dark mb-1">
                      $1,200 USD
                    </h4>
                    <p className="text-brand-orange font-bold text-lg mb-1">+ $20 USD / mes</p>
                    <p className="text-xs text-gray-500">Tarifa fundadora · mínimo 10 meses de permanencia</p>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Ambas páginas web incluyen:</p>
                      <ul className="space-y-2">
                        {[
                          "Capacitación al equipo (1 sesión remota por marca)",
                          "6 meses de soporte técnico para ambas plataformas",
                          "10 modificaciones menores por página (20 en total)",
                          "Dominio .com por 1 año para cada plataforma",
                          "Manual de administración en PDF"
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-brand-dark/80">
                            <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs font-bold text-brand-blue uppercase tracking-widest mb-3">FarmaTuya en ASHIRA incluye:</p>
                      <ul className="space-y-2">
                        {[
                          "Aparición en el directorio farmacéutico de ASHIRA",
                          "Los pacientes pueden consultar disponibilidad y precio de medicamentos",
                          "Enlace directo al portal web de FarmaTuya desde ASHIRA",
                          "Gestión del catálogo visible en ASHIRA desde el panel admin de FarmaTuya",
                          "Acceso para hasta 3 usuarios internos en ASHIRA"
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-brand-dark/80">
                            <CheckCircle2 className="h-4.5 w-4.5 text-brand-blue shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 text-blue-800 rounded-xl p-4 text-xs border border-blue-100 leading-relaxed">
                      <strong>FarmaTuya se convierte en la primera farmacia del directorio ASHIRA</strong> — una red de salud en expansión donde los médicos y pacientes encontrarán dónde adquirir sus medicamentos recetados.
                    </div>

                    <div className="bg-gray-50 border-l-4 border-brand-orange p-4 text-[11px] text-gray-500 rounded-r-xl leading-relaxed">
                      <strong>Condición de permanencia:</strong> la tarifa de socio fundador de $20/mes aplica durante los primeros 10 meses continuos. En caso de discontinuar la suscripción ASHIRA antes de cumplir ese período, se aplicará un ajuste proporcional sobre el precio de las páginas web, el cual se detallará en el contrato formal.
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 bg-gray-50/50 border-t border-gray-100 space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Forma de pago</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                      <p className="text-gray-500 mb-0.5">Cuota 1 (Al firmar)</p>
                      <p className="font-bold text-brand-dark">$600 USD</p>
                      <p className="text-[10px] text-gray-400">50% divisas + 50% Bs BCV</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                      <p className="text-gray-500 mb-0.5">Cuota 2 (15 días de la entrega)</p>
                      <p className="font-bold text-brand-dark">$600 USD</p>
                      <p className="text-[10px] text-gray-400">50% divisas + 50% Bs BCV</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100 text-xs">
                    <p className="text-gray-500 mb-0.5">Suscripción mensual ASHIRA</p>
                    <p className="font-bold text-brand-blue">$20 USD/mes</p>
                    <p className="text-[10px] text-gray-400">A partir del primer mes de activación, pagaderos en Bs a tasa BCV.</p>
                  </div>
                </div>
              </motion.div>

              {/* OPCIÓN B — Solo páginas web, sin ASHIRA */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative flex flex-col justify-between"
              >
                <div>
                  <div className="h-8 bg-transparent" />
                  
                  <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/30">
                    <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                      Opción B — Solo páginas web, sin ASHIRA
                    </span>
                    <h4 className="text-3xl font-black text-brand-dark mb-1">
                      $2,000 USD
                    </h4>
                    <p className="text-sm text-gray-500">Precio completo sin vinculación a suscripción mensual</p>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Lo que incluye:</p>
                      <ul className="space-y-2">
                        {[
                          "Ambas páginas web completas con panel admin independiente",
                          "Capacitación al equipo (1 sesión remota por marca)",
                          "6 meses de soporte técnico para ambas plataformas",
                          "20 modificaciones menores por página (40 en total)",
                          "Dominio .com por 1 año para cada plataforma",
                          "Manual de administración en PDF"
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-brand-dark/80">
                            <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                        <li className="flex items-start gap-2.5 text-sm text-gray-400">
                          <XCircle className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
                          <span>No incluye presencia en el directorio farmacéutico ASHIRA</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 text-orange-950 rounded-xl p-4 text-xs border border-orange-100 leading-relaxed">
                      Esta opción entrega las dos plataformas completas sin compromisos de permanencia adicionales. El soporte técnico aplica para ambas páginas simultáneamente durante 6 meses desde la fecha de entrega de la última plataforma en ser completada.
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 bg-gray-50/50 border-t border-gray-100 space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Forma de pago</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                      <p className="text-gray-500 mb-0.5">Cuota 1 (Al firmar)</p>
                      <p className="font-bold text-brand-dark">$1,000 USD</p>
                      <p className="text-[10px] text-gray-400">50% divisas + 50% Bs BCV</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                      <p className="text-gray-500 mb-0.5">Cuota 2 (30 días de la entrega)</p>
                      <p className="font-bold text-brand-dark">$1,000 USD</p>
                      <p className="text-[10px] text-gray-400">50% divisas + 50% Bs BCV</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* BLOQUE 3 — COMPROMISOS DE FARMATUYA CON ASHIRA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-widest block">
                Solo aplica para la Opción A
              </span>
              <h3 className="text-3xl font-extrabold text-brand-dark tracking-tight">
                Compromisos de FarmaTuya con ASHIRA
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mx-auto">
                Para acceder al precio especial de <span className="font-semibold text-brand-dark">$1,200 USD</span> por ambas plataformas y a la tarifa fundadora de <span className="font-semibold text-brand-dark">$20/mes</span> en ASHIRA, FarmaTuya se compromete a cumplir los siguientes puntos durante los primeros 10 meses de la alianza.
              </p>
            </div>

            <div className="space-y-8">
              {/* Sub-bloque A — Visibilidad y comunicación pública */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  {/* Left Column: Group Header */}
                  <div className="md:w-1/3 flex flex-col items-start shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-4">
                      <Megaphone className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-bold text-brand-dark">Visibilidad pública de la alianza</h4>
                    <span className="inline-block px-2.5 py-0.5 bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-wider rounded-full mt-2">
                      Sub-bloque A
                    </span>
                  </div>
                  
                  {/* Right Column: Items List */}
                  <div className="md:w-2/3 space-y-6 md:space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold shrink-0">
                          1
                        </span>
                        <h5 className="text-sm sm:text-base font-bold text-brand-dark">Anuncio oficial de la afiliación</h5>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed pl-10">
                        FarmaTuya publicará en sus redes sociales (Instagram y WhatsApp Business) un anuncio oficial informando que se encuentra afiliada a la red de salud ASHIRA. Este anuncio debe ser un post permanente en el feed de Instagram — no una story — realizado dentro de los primeros 7 días desde la activación del sistema. ASHIRA hará lo propio en sus canales, presentando a FarmaTuya como el primer aliado farmacéutico de la red.
                      </p>
                    </div>
                    
                    <div className="space-y-2 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold shrink-0">
                          2
                        </span>
                        <h5 className="text-sm sm:text-base font-bold text-brand-dark">Menciones mensuales en redes sociales</h5>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed pl-10">
                        Durante los primeros 6 meses, FarmaTuya publicará un mínimo de 2 posts al mes en Instagram mencionando su integración con ASHIRA. Los posts deben ser publicaciones permanentes en el feed, con mención (@) a la cuenta oficial de ASHIRA. El contenido puede ser propuesto por cualquiera de las partes y debe ser aprobado mutuamente antes de publicarse.
                      </p>
                    </div>

                    <div className="space-y-2 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold shrink-0">
                          3
                        </span>
                        <h5 className="text-sm sm:text-base font-bold text-brand-dark">Logo de ASHIRA en el sitio web de FarmaTuya</h5>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed pl-10">
                        El footer del portal web de FarmaTuya incluirá el logo de ASHIRA con el texto "Afiliada a la red de salud ASHIRA" y un enlace al sitio oficial de ASHIRA. Este elemento permanecerá activo mientras dure la suscripción.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-bloque B — Referidos y red de médicos */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  {/* Left Column: Group Header */}
                  <div className="md:w-1/3 flex flex-col items-start shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-4">
                      <Users className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-bold text-brand-dark">Embajadores ante la red médica</h4>
                    <span className="inline-block px-2.5 py-0.5 bg-brand-orange/10 text-brand-orange text-[10px] font-bold uppercase tracking-wider rounded-full mt-2">
                      Sub-bloque B
                    </span>
                  </div>
                  
                  {/* Right Column: Items List */}
                  <div className="md:w-2/3 space-y-6 md:space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold shrink-0">
                          4
                        </span>
                        <h5 className="text-sm sm:text-base font-bold text-brand-dark">Recomendación de ASHIRA a médicos aliados</h5>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed pl-10">
                        FarmaTuya interactúa diariamente con médicos que recetan medicamentos a sus pacientes. Como parte de esta alianza, FarmaTuya se compromete a presentar ASHIRA a los médicos de su red como una herramienta de gestión de consulta médica. Esta recomendación puede hacerse de forma presencial, por WhatsApp o a través de los canales que FarmaTuya considere convenientes — sin presión ni guión obligatorio.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-bloque C — Materiales de crecimiento para ASHIRA */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  {/* Left Column: Group Header */}
                  <div className="md:w-1/3 flex flex-col items-start shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-4">
                      <Star className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-bold text-brand-dark">Apoyo al crecimiento del ecosistema</h4>
                    <span className="inline-block px-2.5 py-0.5 bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-wider rounded-full mt-2">
                      Sub-bloque C
                    </span>
                  </div>
                  
                  {/* Right Column: Items List */}
                  <div className="md:w-2/3 space-y-6 md:space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold shrink-0">
                          5
                        </span>
                        <h5 className="text-sm sm:text-base font-bold text-brand-dark">Autorización como caso de estudio</h5>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed pl-10">
                        FarmaTuya autoriza a ASHIRA a utilizar su nombre comercial, logo y métricas generales de uso (sin datos privados de pacientes) en presentaciones comerciales, pitch decks y materiales de marketing dirigidos a otras farmacias y clínicas interesadas en unirse a la red. Esta autorización aplica durante toda la duración de la alianza.
                      </p>
                    </div>
                    
                    <div className="space-y-2 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold shrink-0">
                          6
                        </span>
                        <h5 className="text-sm sm:text-base font-bold text-brand-dark">Testimonio grabado</h5>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed pl-10">
                        Durante los primeros 3 meses de operación, la Gerente General u otro representante designado de FarmaTuya grabará un testimonio en video de 60 a 90 segundos sobre su experiencia con el sistema y con ASHIRA. El video es de uso libre para ASHIRA en sus canales digitales, presentaciones y materiales de venta. El guión y formato serán acordados entre ambas partes.
                      </p>
                    </div>

                    <div className="space-y-2 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold shrink-0">
                          7
                        </span>
                        <h5 className="text-sm sm:text-base font-bold text-brand-dark">Sesiones de retroalimentación mensual</h5>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed pl-10">
                        Como primera farmacia del directorio ASHIRA, FarmaTuya participará en sesiones de retroalimentación mensual de 30 minutos durante los primeros 6 meses. El objetivo es identificar oportunidades de mejora en el módulo de directorio farmacéutico. Esta retroalimentación contribuye directamente al desarrollo del ecosistema del que FarmaTuya forma parte y al que tiene acceso preferencial.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-dark rounded-xl p-6 shadow-sm">
              <p className="text-white/85 text-sm text-center font-medium leading-relaxed max-w-3xl mx-auto">
                Estos compromisos no implican costos adicionales para FarmaTuya. Representan la contraprestación no monetaria que hace viable el precio especial de esta alianza. Todos los puntos serán formalizados en el contrato de servicios antes del inicio del desarrollo.
              </p>
            </div>
          </motion.div>

          {/* BLOQUE 4 — TABLA COMPARATIVA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-widest block mb-2">
                Comparativa
              </span>
              <h3 className="text-3xl font-extrabold text-brand-dark mb-2">
                ¿Qué incluye cada opción?
              </h3>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse text-left">
                  <thead>
                    <tr className="bg-brand-dark text-white">
                      <th className="px-6 py-4 font-bold">Característica</th>
                      <th className="px-6 py-4 font-bold text-center">Opción A — Con ASHIRA</th>
                      <th className="px-6 py-4 font-bold text-center">Opción B — Sin ASHIRA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr className="bg-white">
                      <td className="px-6 py-4 font-medium">Precio páginas web</td>
                      <td className="px-6 py-4 text-center font-semibold text-brand-dark">$1,200 USD</td>
                      <td className="px-6 py-4 text-center font-semibold text-brand-dark">$2,200 USD</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-6 py-4 font-medium">Suscripción mensual</td>
                      <td className="px-6 py-4 text-center font-semibold text-brand-dark">$20 USD/mes <span className="text-gray-500 font-normal text-xs">(mín. 10 meses)</span></td>
                      <td className="px-6 py-4 text-center text-gray-400">No aplica</td>
                    </tr>
                    <tr className="bg-brand-blue/5 font-semibold">
                      <td className="px-6 py-4 text-brand-blue">Inversión total mínima</td>
                      <td className="px-6 py-4 text-center font-semibold text-brand-dark">$1,400 USD</td>
                      <td className="px-6 py-4 text-center font-semibold text-brand-dark">$2,200 USD</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-6 py-4 font-medium">Páginas web desarrolladas</td>
                      <td className="px-6 py-4 text-center">2 completas</td>
                      <td className="px-6 py-4 text-center">2 completas</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-6 py-4 font-medium">Soporte técnico</td>
                      <td className="px-6 py-4 text-center">6 meses — ambas plataformas</td>
                      <td className="px-6 py-4 text-center">6 meses — ambas plataformas</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-6 py-4 font-medium">Modificaciones incluidas</td>
                      <td className="px-6 py-4 text-center">10 por página (20 total)</td>
                      <td className="px-6 py-4 text-center">20 por página (40 total)</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-6 py-4 font-medium">Dominio .com</td>
                      <td className="px-6 py-4 text-center">1 año por plataforma</td>
                      <td className="px-6 py-4 text-center">1 año por plataforma</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-6 py-4 font-medium">Directorio farmacéutico ASHIRA</td>
                      <td className="px-6 py-4 text-center text-green-600 font-medium">✓ Sí</td>
                      <td className="px-6 py-4 text-center text-gray-400">✗ No</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-6 py-4 font-medium">Visibilidad ante red de médicos</td>
                      <td className="px-6 py-4 text-center text-green-600 font-medium">✓ Sí</td>
                      <td className="px-6 py-4 text-center text-gray-400">✗ No</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-6 py-4 font-medium">Tarifa de socio fundador</td>
                      <td className="px-6 py-4 text-center text-green-600 font-medium">✓ Congelada 10 meses</td>
                      <td className="px-6 py-4 text-center text-gray-400">✗ No aplica</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-6 py-4 font-medium">Compromisos de permanencia</td>
                      <td className="px-6 py-4 text-center">Suscripción ASHIRA 10 meses</td>
                      <td className="px-6 py-4 text-center text-gray-400">Ninguno</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* BLOQUE 5 — DEFINICIÓN DE MODIFICACIÓN */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-brand-dark mb-1">¿Qué cuenta como modificación en esta propuesta?</h3>
              <p className="text-xs text-gray-500">La misma definición aplica de forma independiente para cada una de las dos plataformas.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md inline-block tracking-wider uppercase mb-4">
                  Modificación menor (incluida)
                </span>
                <ul className="space-y-3">
                  {[
                    "Cambios de texto, colores o imágenes en secciones existentes",
                    "Ajustes de diseño en componentes ya construidos",
                    "Agregar o quitar un campo en formularios existentes",
                    "Actualizar datos de contacto, redes o información corporativa",
                    "Reordenar o renombrar secciones de la página",
                    "Cambios que no superen 2 horas de desarrollo"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-md inline-block tracking-wider uppercase mb-4">
                  Desarrollo adicional (se cotiza aparte)
                </span>
                <ul className="space-y-3">
                  {[
                    "Crear una nueva página o módulo inexistente",
                    "Cambios en la estructura de la base de datos",
                    "Nuevas integraciones con servicios de terceros",
                    "Lógica de negocio nueva no contemplada en el sistema actual",
                    "Cualquier desarrollo que supere 2 horas de trabajo"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-8 pt-5 border-t border-gray-50 bg-gray-50/50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                Cada solicitud de modificación debe enviarse por escrito vía WhatsApp o correo electrónico. El equipo confirmará si aplica al paquete antes de ejecutar cualquier cambio. Las modificaciones no utilizadas no son acumulables ni reembolsables.
              </p>
            </div>
          </motion.div>

          {/* BLOQUE 6 — PRÓXIMOS PASOS (CIERRE) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-brand-dark rounded-2xl p-8 md:p-12 text-center text-white"
          >
            <span className="text-xs font-bold text-brand-orange uppercase tracking-widest block mb-2">
              ¿Todo claro?
            </span>
            <h3 className="text-3xl font-bold text-white mb-3">¿Listos para comenzar?</h3>
            <p className="text-white/70 text-sm max-w-xl mx-auto mb-8">El primer paso es seleccionar la modalidad. El desarrollo inicia en menos de 72 horas desde la firma del acuerdo y el abono de la primera cuota.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 max-w-3xl mx-auto text-center">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-brand-orange text-white flex items-center justify-center text-lg font-bold mb-3">
                  01
                </div>
                <h4 className="text-base font-bold text-white mb-2">Seleccionar opción</h4>
                <p className="text-xs text-white/60 leading-relaxed max-w-xs">Confirmar si se elige la Opción A (con ASHIRA) o la Opción B (sin ASHIRA).</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-brand-orange text-white flex items-center justify-center text-lg font-bold mb-3">
                  02
                </div>
                <h4 className="text-base font-bold text-white mb-2">Firmar y abonar</h4>
                <p className="text-xs text-white/60 leading-relaxed max-w-xs font-normal">Se formaliza el acuerdo y se realiza el pago de la primera cuota.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-brand-orange text-white flex items-center justify-center text-lg font-bold mb-3">
                  03
                </div>
                <h4 className="text-base font-bold text-white mb-2">Inicio del desarrollo</h4>
                <p className="text-xs text-white/60 leading-relaxed max-w-xs">El equipo comienza el desarrollo en menos de 72 horas hábiles.</p>
              </div>
            </div>
            
            <a 
              href="https://wa.me/584242070878?text=Hola,%20revisé%20la%20propuesta%20especial%20del%2022%20de%20mayo%20y%20quiero%20continuar%20con%20el%20proceso."
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold py-3.5 px-8 rounded-full transition-all inline-flex items-center gap-2 mb-6 shadow-lg shadow-brand-orange/20"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Confirmar por WhatsApp</span>
            </a>
            
            <p className="text-white/40 text-xs mt-4">
              Casa de Representación 2N, C.A. · J-502058125 · casaderepresentacion2nventas@gmail.com · 0412-504-0440
            </p>
          </motion.div>
        </section>

      </main>

      <footer className="max-w-4xl mx-auto px-4 mt-20 pt-8 border-t border-gray-200 text-center sm:text-left">
        <p className="text-xs text-gray-500">
          Casa de Representación 2N, C.A. • J-502058125<br className="sm:hidden" />
          <span className="hidden sm:inline"> • </span>Chacao, Caracas, Venezuela<br className="sm:hidden" />
          <span className="hidden sm:inline"> • </span>casaderepresentacion2nventas@gmail.com<br className="sm:hidden" />
          <span className="hidden sm:inline"> • </span>0412-504-0440
        </p>
      </footer>
    </div>
  )
}
