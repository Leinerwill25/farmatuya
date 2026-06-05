'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import { 
  Heart, 
  ShieldCheck, 
  ClipboardCheck, 
  Building2, 
  Users, 
  Sparkles, 
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react'

export default function NosotrosPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-brand-dark font-sans overflow-x-hidden">
      
      {/* HEADER STICKY */}
      <Navbar />

      <main className="flex-grow pt-20">
        
        {/* HERO SECTION */}
        <section className="relative py-24 bg-brand-dark overflow-hidden text-white">
          {/* Decorative gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F3D93] via-[#0A1128] to-[#6EA83B]/40 z-10" />
          <div className="absolute right-[-10%] top-[-10%] w-[50%] h-[120%] bg-white/5 blur-3xl rounded-full transform rotate-12 pointer-events-none" />
          <div className="absolute left-[-5%] bottom-[-20%] w-[40%] h-[80%] bg-brand-green/15 blur-3xl rounded-full pointer-events-none" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 text-center space-y-6">
            <span className="inline-flex items-center gap-2 bg-brand-green/20 border border-brand-green/30 text-brand-green text-xs font-black tracking-widest uppercase px-4 py-2 rounded-full">
              <Sparkles className="h-3.5 w-3.5" />
              Nuestra Esencia
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
              Más que una Empresa, una Visión Cumplida y un Camino por Recorrer
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
              Seis Años de un Sueño Hecho Realidad y un Futuro en Expansión
            </p>
          </div>
        </section>

        {/* NARRATIVA DE LA HISTORIA */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              
              {/* Left Side: Story text */}
              <motion.div className="lg:col-span-7 space-y-6 text-left" variants={itemVariants}>
                <span className="inline-flex items-center gap-1.5 text-brand-green font-black tracking-wider uppercase text-xs">
                  <Award className="h-4 w-4" />
                  El Origen
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-brand-dark tracking-tight">
                  6 Años Tejiendo Sueños, Forjando Futuros
                </h2>
                <h3 className="text-lg font-bold text-brand-blue uppercase tracking-wide">
                  Una Idea que Floreció en el Corazón de Petare
                </h3>
                <div className="w-16 h-1.5 bg-brand-green rounded-full"></div>
                
                <div className="space-y-4 text-gray-600 leading-relaxed font-medium text-sm sm:text-base">
                  <p>
                    Hoy celebramos seis años de Farmatuya. Pero antes de ser esta estructura sólida que conocemos, Farmatuya fue una chispa, una visión, un sueño. Un sueño que nació en la mente y el corazón de un hombre visionario.
                  </p>
                  <p>
                    En un momento donde muchos veían obstáculos, él vio oportunidades. Vio la necesidad de un servicio que podía marcar la diferencia, de una propuesta que podía brindar bienestar. Y con esa convicción inquebrantable, dio el primer paso.
                  </p>
                  <p>
                    El camino del emprendimiento no es el más fácil, lo sabemos. Requiere valentía, perseverancia y una fe profunda en uno mismo. Pero es un camino que nos ofrece algo invaluable: la capacidad de crear nuestro propio destino.
                  </p>
                  <p>
                    Emprender es la respuesta a esa inquietud interna que nos dice: <span className="text-brand-blue font-bold">"Puedo hacerlo mejor, puedo generar un impacto, puedo construir algo propio"</span>. Es tomar las riendas de nuestra vida profesional y personal, y dirigirnos hacia donde realmente queremos ir.
                  </p>
                </div>
              </motion.div>

              {/* Right Side: Visual representation and Quote */}
              <motion.div className="lg:col-span-5 space-y-8" variants={itemVariants}>
                {/* Year Badge */}
                <div className="relative p-8 rounded-3xl bg-brand-muted border border-brand-green/20 flex flex-col items-center justify-center text-center shadow-md overflow-hidden group">
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-brand-green/10 rounded-full blur-xl pointer-events-none group-hover:bg-brand-green/20 transition-colors" />
                  <span className="text-7xl font-black text-brand-blue leading-none">6</span>
                  <span className="text-sm font-black text-brand-green tracking-widest uppercase mt-3">Años de Logros</span>
                  <span className="text-xs text-gray-400 font-bold mt-1">Conectando Salud y Bienestar</span>
                </div>

                {/* Founder Quote Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-tr from-brand-dark to-brand-blue text-white shadow-xl text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                  <p className="text-xs font-bold text-brand-green uppercase tracking-widest mb-3">La Fuerza del Emprendimiento</p>
                  <blockquote className="text-sm italic leading-relaxed text-white/90">
                    "En Farmatuya, este espíritu de emprender fue el combustible que nos impulsó desde el primer día. Fue la decisión de no esperar a que las oportunidades llegaran, sino de crearlas."
                  </blockquote>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* INDEPENDENCIA Y LIBERTAD */}
        <section className="py-20 bg-brand-muted text-brand-dark relative overflow-hidden">
          <div className="absolute -left-16 top-16 w-64 h-64 bg-brand-blue/[0.02] rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              {/* Left Side: Quote Box */}
              <motion.div className="lg:col-span-5 order-2 lg:order-1" variants={itemVariants}>
                <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-lg text-left space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-black text-brand-dark">Propósito e Independencia</h4>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    "Más allá de los números, la independencia financiera es libertad. Es la tranquilidad de saber que nuestras decisiones no están dictadas por la necesidad, sino por la visión y el propósito."
                  </p>
                  <p className="text-xs text-gray-400 font-bold">
                    Es la capacidad de invertir en nuestros sueños, de apoyar a nuestras familias, de reinvertir en nuestro negocio y en nuestra comunidad. Es tener el poder de decir 'sí' a las oportunidades que nos inspiran y 'no' a lo que nos limita.
                  </p>
                </div>
              </motion.div>

              {/* Right Side: Text details */}
              <motion.div className="lg:col-span-7 space-y-6 text-left order-1 lg:order-2" variants={itemVariants}>
                <span className="inline-flex items-center gap-1.5 text-brand-green font-black tracking-wider uppercase text-xs">
                  <Users className="h-4 w-4" />
                  Nuestra Familia
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-brand-dark tracking-tight font-sans">
                  Un Logro Colectivo de Nuestra Gente
                </h2>
                <div className="w-16 h-1.5 bg-brand-green rounded-full"></div>
                
                <div className="space-y-4 text-gray-600 leading-relaxed font-medium text-sm sm:text-base">
                  <p>
                    Desde el inicio en nuestra sede en Petare, cada esfuerzo, cada venta, cada cliente satisfecho, nos ha acercado más a esa independencia. Una independencia que no solo beneficia a nuestro fundador, sino a cada miembro de esta gran familia Farmatuya.
                  </p>
                  <p>
                    Recuerdo los primeros días. Una sede, un sueño, y la determinación de un hombre. Hoy, seis años después, Farmatuya es mucho más que eso. Es un equipo apasionado, es un servicio reconocido, es un motor de crecimiento.
                  </p>
                  <p>
                    Lo que comenzó como una pequeña semilla en Petare, ha germinado y se ha fortalecido. Hemos superado desafíos, hemos aprendido, hemos crecido. Y cada uno de ustedes, nuestro valioso equipo, ha sido fundamental en esta transformación.
                  </p>
                  <p className="font-bold text-brand-blue">
                    Este no es solo el logro de una persona, es el logro colectivo de todos los que hemos creído en esta visión y hemos trabajado incansablemente para hacerla realidad.
                  </p>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* MISIÓN Y VISIÓN DEDICADA */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
            <div className="space-y-3">
              <span className="text-brand-green font-black tracking-wider uppercase text-xs block">Rumbo Estratégico</span>
              <h2 className="text-3xl font-black text-brand-dark tracking-tight">Nuestra Misión & Visión</h2>
              <div className="w-16 h-1.5 bg-brand-green mx-auto rounded-full"></div>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              {/* Misión Card */}
              <motion.div 
                className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-100 hover:border-brand-blue/30 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group text-left space-y-5"
                variants={itemVariants}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/[0.01] rounded-full blur-2xl pointer-events-none group-hover:bg-brand-blue/[0.03] transition-colors" />
                <div className="absolute bottom-0 left-0 h-1.5 bg-brand-blue w-0 group-hover:w-full transition-all duration-500" />
                <span className="text-[10px] font-black text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-4 py-2 rounded-full uppercase tracking-wider block w-fit">
                  ¿Qué hacemos y por qué?
                </span>
                <h3 className="text-2xl font-black text-brand-dark">Misión</h3>
                <p className="text-base text-gray-700 leading-relaxed font-semibold italic border-l-4 border-brand-blue pl-4">
                  "En Farmatuya, nuestra misión es brindar bienestar y soluciones farmacéuticas de alta calidad. Nos comprometemos a la excelencia, la innovación y el servicio accesible, construyendo un legado de confianza."
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  Esta misión refleja nuestro compromiso inquebrantable con ustedes, nuestros clientes, y con cada uno de los miembros de esta gran familia Farmatuya. Es una declaración de lo que somos y, sobre todo, de lo que aspiramos a seguir siendo.
                </p>
              </motion.div>

              {/* Visión Card */}
              <motion.div 
                className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-100 hover:border-brand-green/30 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group text-left space-y-5"
                variants={itemVariants}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/[0.01] rounded-full blur-2xl pointer-events-none group-hover:bg-brand-green/[0.03] transition-colors" />
                <div className="absolute bottom-0 left-0 h-1.5 bg-brand-green w-0 group-hover:w-full transition-all duration-500" />
                <span className="text-[10px] font-black text-brand-green bg-brand-green/10 border border-brand-green/20 px-4 py-2 rounded-full uppercase tracking-wider block w-fit">
                  ¿Hacia dónde nos dirigimos?
                </span>
                <h3 className="text-2xl font-black text-brand-dark">Visión</h3>
                <p className="text-base text-gray-700 leading-relaxed font-semibold italic border-l-4 border-brand-green pl-4">
                  "Aspiramos a ser la red farmacéutica líder en nuestro país, reconocida por nuestra calidad, accesibilidad e impacto positivo en la salud y el bienestar de cada familia. Buscamos expandir nuestra presencia, innovar constantemente en nuestros servicios."
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  Esta visión nos impulsa a pensar en grande, a no conformarnos, a buscar siempre la siguiente meta. Es un recordatorio de que cada paso que damos hoy, nos acerca a ese mañana que soñamos y trabajamos incansablemente por construir.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* VALORES DETALLADOS */}
        <section className="py-20 bg-slate-50 border-t border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
            <div className="space-y-3">
              <span className="text-brand-green font-black tracking-wider uppercase text-xs block">Nuestro ADN</span>
              <h2 className="text-3xl font-black text-brand-dark tracking-tight">Nuestros Valores Corporativos</h2>
              <div className="w-16 h-1.5 bg-brand-green mx-auto rounded-full"></div>
            </div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              {[
                {
                  icon: Sparkles,
                  title: "Espíritu Emprendedor",
                  desc: "Como nació en nuestro fundador, el espíritu emprendedor y la búsqueda constante de nuevas y mejores formas de servir son el motor de nuestro crecimiento."
                },
                {
                  icon: ClipboardCheck,
                  title: "Excelencia y Calidad",
                  desc: "Nos comprometemos a ofrecer productos y servicios de la más alta calidad. La excelencia no es una meta, es nuestro estándar diario, desde la atención al cliente hasta la selección de nuestros productos."
                },
                {
                  icon: ShieldCheck,
                  title: "Integridad y Transparencia",
                  desc: "Actuamos con honestidad, ética y transparencia en todas nuestras operaciones. La confianza de nuestros clientes y colaboradores es nuestro activo más valioso, y la protegemos con la máxima integridad."
                },
                {
                  icon: Heart,
                  title: "Servicio y Vocación de Ayuda",
                  desc: "Nuestra razón de ser es servir. Nos apasiona ayudar a las personas a mejorar su salud y su calidad de vida. Cada interacción es una oportunidad para demostrar nuestra vocación de servicio."
                },
                {
                  icon: Users,
                  title: "Trabajo en Equipo y Colaboración",
                  desc: "Reconocemos que nuestros mayores logros se consiguen juntos. Fomentamos un ambiente de respeto, colaboración y apoyo mutuo, donde cada voz cuenta y cada esfuerzo suma."
                },
                {
                  icon: Building2,
                  title: "Responsabilidad Social y Comunitaria",
                  desc: "Como parte de la comunidad que nos vio nacer, nos sentimos responsables de contribuir a su desarrollo y bienestar. Buscamos generar un impacto positivo y sostenible en la sociedad."
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-brand-green/20 shadow-sm hover:shadow-md flex flex-col items-start text-left group transition-all duration-500 hover:-translate-y-1 border-l-4 border-l-transparent hover:border-l-brand-green"
                  variants={itemVariants}
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-brand-blue group-hover:to-brand-green group-hover:text-white group-hover:scale-105 transition-all duration-500 shadow-sm">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-lg text-brand-dark mb-3 group-hover:text-brand-blue transition-colors">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="max-w-2xl mx-auto p-6 rounded-3xl bg-brand-green/10 border border-brand-green/20 text-brand-green font-bold text-sm sm:text-base leading-relaxed mt-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
            >
              "Estos valores no son solo palabras; son los principios que guían cada decisión que tomamos. Son la base sobre la cual construimos nuestra confianza, nuestra reputación y nuestro futuro."
            </motion.div>
          </div>
        </section>

        {/* EL FUTURO ES AHORA: NUESTRA EXPANSIÓN */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              {/* Left Column: Visual representation */}
              <motion.div className="lg:col-span-5 flex justify-center" variants={itemVariants}>
                <div className="w-full h-80 rounded-3xl bg-brand-dark relative overflow-hidden flex items-center justify-center shadow-lg group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue via-brand-dark/95 to-brand-green/20 z-10" />
                  <div className="absolute inset-0 bg-gray-150 pointer-events-none">
                    <img 
                      src="/catalog_personal.png" 
                      alt="FarmaTuya Expansion" 
                      className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                  </div>
                  <div className="relative z-20 text-center space-y-3 p-6">
                    <span className="text-4xl">🚀</span>
                    <h4 className="text-xl font-black text-white">Nuevas Sedes</h4>
                    <p className="text-xs text-white/75 font-semibold">Llegando a más rincones del país</p>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Content */}
              <motion.div className="lg:col-span-7 space-y-6 text-left" variants={itemVariants}>
                <span className="inline-flex items-center gap-1.5 text-brand-green font-black tracking-wider uppercase text-xs">
                  <BookOpen className="h-4 w-4" />
                  Nuestra Visión de Futuro
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-brand-dark tracking-tight">
                  El Futuro es Ahora: Nuestra Expansión y Nuevas Fronteras
                </h2>
                <div className="w-16 h-1.5 bg-brand-green rounded-full"></div>
                
                <div className="space-y-4 text-gray-600 leading-relaxed font-medium text-sm sm:text-base">
                  <p>
                    Pero la historia de Farmatuya no termina aquí. Este sexto aniversario no es solo una celebración del pasado, es un trampolín hacia el futuro. Nuestro sueño sigue vivo y en constante expansión.
                  </p>
                  <p>
                    Con la misma pasión y determinación de nuestros inicios, estamos abriendo nuevas puertas, alcanzando nuevos mercados y llevando el sello de calidad Farmatuya a más lugares. Cada nueva sede, cada nuevo proyecto, es una extensión de esa visión original.
                  </p>
                  <p className="font-bold text-brand-blue">
                    Estamos construyendo no solo una empresa, sino un legado. Un legado de emprendimiento de servicio a la comunidad.
                  </p>
                  <p>
                    Este recorrido, desde aquella pequeña sede en Petare hasta nuestra expansión actual, nos ha enseñado lecciones. Hemos comprendido profundamente la necesidad que cubrimos, el impacto que generamos y el potencial que aún tenemos.
                  </p>
                  <p>
                    Es por eso que, en este momento crucial de nuestro crecimiento, hemos querido reafirmar nuestra misión, visión y valores. Porque una misión, visión y valores claros son la brújula que nos guía, el propósito que nos une y la fuerza que nos impulsa a dar lo mejor de nosotros día tras día.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* AGRADECIMIENTO & CTA */}
        <section className="py-16 bg-brand-muted text-brand-dark">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
            <span className="text-3xl">🤝</span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-brand-dark">
              Agradecemos Tu Confianza
            </h3>
            <p className="text-sm sm:text-base text-gray-650 max-w-xl mx-auto font-medium leading-relaxed">
              "Quiero agradecer a nuestro fundador por su audacia y su visión. Gracias a cada miembro de nuestro equipo por su dedicación y su trabajo incansable. Gracias a nuestros clientes por su confianza. Farmatuya es una prueba viviente de que los sueños, cuando se persiguen con pasión y se trabajan con constancia, se convierten en logros tangibles y en un futuro prometedor."
            </p>
            <p className="text-sm font-black text-brand-green uppercase tracking-widest">
              Celebremos estos 6 años y alcemos la vista hacia todo lo que aún podemos lograr juntos.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/#catalogos" 
                className="inline-flex items-center justify-center px-8 py-4 bg-brand-blue hover:bg-brand-blue-mid text-white font-bold rounded-full transition-all shadow-md shadow-brand-blue/20 hover:-translate-y-0.5"
              >
                Explorar Catálogos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <a 
                href="https://wa.me/584125040440"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-brand-green hover:bg-brand-green-hover text-white font-bold rounded-full transition-all shadow-md shadow-brand-green/20 hover:-translate-y-0.5"
              >
                Contactar Ventas
                <MessageCircle className="h-4 w-4 ml-2" />
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer id="contacto" className="bg-brand-dark text-white pt-16 pb-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
            
            {/* Columna 1: Branding */}
            <div className="lg:col-span-4 space-y-4 text-left">
              <div className="flex items-center gap-2">
                <div className="bg-white/95 p-2 rounded-2xl inline-block shadow-sm">
                  <div className="relative w-32 h-10">
                    <Image 
                      src="/logo_farmatuya.png" 
                      alt="FarmaTuya Logo" 
                      fill 
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
              <p className="text-white/60 text-xs font-semibold leading-relaxed max-w-sm">
                Comprometidos con tu salud y bienestar familiar. Más de 10 años ofreciendo medicamentos garantizados y atención farmacéutica de primera.
              </p>
              <div className="space-y-2 text-xs font-bold text-white/80">
                <a href="tel:+584125040440" className="flex items-center gap-2 hover:text-brand-green transition-colors">
                  <Phone className="h-4 w-4 text-brand-green" />
                  0412-504-0440
                </a>
                <a href="mailto:contacto@farmatuya.com" className="flex items-center gap-2 hover:text-brand-green transition-colors">
                  <Mail className="h-4 w-4 text-brand-green" />
                  contacto@farmatuya.com
                </a>
              </div>
            </div>

            {/* Columna 2: Tu Cuenta */}
            <div className="lg:col-span-2 text-left">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-brand-green mb-4">Tu Cuenta</h4>
              <ul className="space-y-2.5 text-xs text-white/60 font-semibold">
                <li><Link href="/login" className="hover:text-white transition-colors">Iniciar Sesión</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Crear Cuenta</Link></li>
                <li><Link href="/#inicio" className="hover:text-white transition-colors">Mis Pedidos</Link></li>
                <li><Link href="/#inicio" className="hover:text-white transition-colors">Mis Recetas</Link></li>
              </ul>
            </div>

            {/* Columna 3: Descubre */}
            <div className="lg:col-span-2 text-left">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-brand-green mb-4">Descubre</h4>
              <ul className="space-y-2.5 text-xs text-white/60 font-semibold">
                <li><Link href="/#categorias" className="hover:text-white transition-colors">Medicamentos</Link></li>
                <li><Link href="/#categorias" className="hover:text-white transition-colors">Cuidado Personal</Link></li>
                <li><Link href="/#categorias" className="hover:text-white transition-colors">Línea Infantil</Link></li>
                <li><Link href="/#categorias" className="hover:text-white transition-colors">Salud y Nutrición</Link></li>
              </ul>
            </div>

            {/* Columna 4: FarmaTuya Institucional */}
            <div className="lg:col-span-2 text-left">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-brand-green mb-4">FarmaTuya</h4>
              <ul className="space-y-2.5 text-xs text-white/60 font-semibold">
                <li><Link href="/nosotros" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
                <li><Link href="/#tiendas" className="hover:text-white transition-colors">Nuestras Tiendas</Link></li>
                <li><Link href="/#blog" className="hover:text-white transition-colors">Blog de Salud</Link></li>
                <li><Link href="/#contacto" className="hover:text-white transition-colors">Contacto</Link></li>
              </ul>
            </div>

            {/* Columna 5: Servicios */}
            <div className="lg:col-span-2 text-left">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-brand-green mb-4">Servicios</h4>
              <ul className="space-y-2.5 text-xs text-white/60 font-semibold">
                <li><Link href="/#tiendas" className="hover:text-white transition-colors">Farmacia 24 Horas</Link></li>
                <li><Link href="/#contacto" className="hover:text-white transition-colors">Consulta Farmacéutica</Link></li>
                <li><Link href="/#contacto" className="hover:text-white transition-colors">Toma de Presión</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 gap-4">
            <p>&copy; {new Date().getFullYear()} FarmaTuya, C.A. Todos los derechos reservados. RIF J-50000000-0.</p>
            <div className="flex gap-4">
              <Link href="/#contacto" className="hover:text-white transition-colors">Términos de Servicio</Link>
              <span>•</span>
              <Link href="/#contacto" className="hover:text-white transition-colors">Política de Privacidad</Link>
            </div>
            <div className="flex items-center gap-2">
              <span>Hecho con ♥ para tu salud</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Botón flotante de WhatsApp */}
      <a 
        href="https://wa.me/584125040440?text=Hola%2C%20vengo%20de%20la%20p%C3%A1gina%20web%20de%20FarmaTuya%2C%2520quisiera%20hacer%20una%20consulta." 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 z-50 flex items-center justify-center cursor-pointer hover:shadow-emerald-500/20 animate-bounce"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </a>

    </div>
  )
}
