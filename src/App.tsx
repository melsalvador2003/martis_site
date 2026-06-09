/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sprout, 
  Layers, 
  Thermometer, 
  Activity, 
  Cpu, 
  Droplets, 
  ShieldAlert, 
  ShieldCheck,
  BadgeCheck, 
  Rocket, 
  ChevronRight, 
  Menu, 
  X, 
  Trash2, 
  Edit3, 
  Save, 
  Loader2, 
  Mail, 
  User, 
  CheckCircle,
  Clock,
  ExternalLink,
  Smartphone,
  Sun,
  Moon
} from "lucide-react";
import Greenhouse3D from "./components/Greenhouse3D";
import { WaitlistContact, ProductPillar, HowItWorksStep, BusinessPlan } from "./types";

export default function App() {
  // Theme State (Dark / Light Mode)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("martis-theme");
      return saved !== "light";
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem("martis-theme", darkMode ? "dark" : "light");
    if (darkMode) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [darkMode]);

  // Mobile Header State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Waitlist CRUD States
  const [waitlist, setWaitlist] = useState<WaitlistContact[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Inline editing state for the Waitlist panel
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Modals de Acessibilidade e Notificação (sem alerts nativos)
  const [alertConfig, setAlertConfig] = useState<{ isOpen: boolean; title: string; message: string; type: "success" | "error" }>({
    isOpen: false,
    title: "",
    message: "",
    type: "success"
  });

  const [confirmDeleteConfig, setConfirmDeleteConfig] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  });

  // Load existing waitlist on mount
  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    setLoadingList(true);
    try {
      const response = await fetch("/api/waitlist");
      if (response.ok) {
        const data = await response.json();
        setWaitlist(data);
      }
    } catch (e) {
      console.error("Erro ao carregar lista de espera:", e);
    } finally {
      setLoadingList(false);
    }
  };

  const handleAddWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (!formName || !formEmail) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    setSubmittingForm(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome: formName, email: formEmail }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        setErrorMessage(result.detail || "Erro ao efetuar cadastro.");
      } else {
        setSuccessMessage("Inscrição efetuada com sucesso! Você já está na lista.");
        setFormName("");
        setFormEmail("");
        // Reload list to see changes
        fetchWaitlist();
      }
    } catch (err) {
      setErrorMessage("Erro ao conectar ao servidor. Tente novamente.");
    } finally {
      setSubmittingForm(false);
    }
  };

  const startEdit = (item: WaitlistContact) => {
    setEditingId(item.id);
    setEditName(item.nome);
    setEditEmail(item.email);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  };

  const handleUpdate = async (id: number) => {
    if (!editName || !editEmail) return;
    setActionLoading(id);
    try {
      const response = await fetch(`/api/waitlist/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome: editName, email: editEmail }),
      });

      if (response.ok) {
        setEditingId(null);
        fetchWaitlist();
        setAlertConfig({
          isOpen: true,
          title: "Sucesso!",
          message: "O registro foi atualizado com sucesso na lista de espera local.",
          type: "success"
        });
      } else {
        const err = await response.json();
        setAlertConfig({
          isOpen: true,
          title: "Erro na Edição",
          message: err.detail || "Não foi possível atualizar o registro.",
          type: "error"
        });
      }
    } catch (e) {
      setAlertConfig({
        isOpen: true,
        title: "Problema de Conexão",
        message: "Ocorreu uma falha ao tentar se comunicar com o servidor da API.",
        type: "error"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteConfig({
      isOpen: true,
      id
    });
  };

  const handleConfirmDelete = async () => {
    const id = confirmDeleteConfig.id;
    if (id === null) return;
    
    setConfirmDeleteConfig({ isOpen: false, id: null });
    setActionLoading(id);
    try {
      const response = await fetch(`/api/waitlist/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchWaitlist();
        setAlertConfig({
          isOpen: true,
          title: "Removido",
          message: "A inscrição foi removida com sucesso da lista.",
          type: "success"
        });
      } else {
        setAlertConfig({
          isOpen: true,
          title: "Erro na Remoção",
          message: "Não foi possível excluir o cadastro solicitado.",
          type: "error"
        });
      }
    } catch (e) {
      setAlertConfig({
        isOpen: true,
        title: "Falha de Conexão",
        message: "Não foi possível conectar com o servidor para realizar a exclusão.",
        type: "error"
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Mocked data for structure
  const productPillars: ProductPillar[] = [
    {
      id: "greenhouse",
      title: "Estufa Estanque Modular",
      tagline: "Engenharia estrutural inspirada no ecossistema de Marte",
      description: "Módulos pressurizados expansíveis que podem ser descarregados e montados em apenas 4 horas por uma única pessoa.",
      bullets: [
        "Montagem em trilhos ultra-resistentes",
        "Vedação magnética aeroespacial anti-vazamento",
        "Expansão plug-and-play de área de plantio"
      ]
    },
    {
      id: "aeroponic",
      title: "Nutrição Aeropônica Fechada",
      tagline: "Máxima colheita por gota de água",
      description: "Raízes suspensas e nutridas por névoa computadorizada automatizada. Economiza 95% de água comparado à agricultura de solo comum.",
      bullets: [
        "Consumo zero de solo fértil",
        "Regeneração e reuso de 100% da transpiração de folhas",
        "Aceleração de crescimento em até 3x"
      ]
    },
    {
      id: "biostasis",
      title: "Câmara de Biostase e Liofilização",
      tagline: "Preservação mineral intocada",
      description: "Câmara de resfriamento e liofilização instantânea para selar o valor proteico e vitamínico dos alimentos colhidos.",
      bullets: [
        "Desidratação sob vácuo sem perda de nutrientes",
        "Armazenabilidade por até 25 anos à temperatura ambiente",
        "Mecanismos automatizados de embalagem hermética"
      ]
    },
    {
      id: "thermal",
      title: "Membrana Térmica Multi-Camadas",
      tagline: "Proteção contra variações radicais",
      description: "Inspirada em trajes de caminhada espacial da NASA, a casca externa suporta de -50°C até +70°C sem afetar o clima interno.",
      bullets: [
        "7 camadas protetoras reflexivas de radiação",
        "Vácuo isolante central ultra-fino",
        "Transmissão seletiva de luz natural otimizada"
      ]
    },
    {
      id: "martisos",
      title: "Martis OS + ASTRA-AI",
      tagline: "A inteligência operacional no bolso do produtor",
      description: "Software de gerenciamento agrícola preditivo. A inteligência ASTRA detecta anomalias em folhagens antes que os sintomas surjam fisicamente.",
      bullets: [
        "Offline-first: funcionamento garantido sem internet",
        "Visualização mobile simples pelo WhatsApp ou app",
        "Anticipação preditiva de pragas ou defasagem de micro-nutrientes"
      ]
    }
  ];

  const worksSteps: HowItWorksStep[] = [
    {
      stepNumber: "01",
      title: "Ciclo Fechado Absoluto",
      tagline: "Sustentabilidade em Ambientes Sem Água",
      description: "A umidade gerada pelas plantas é captada, filtrada e retorna aos tanques de atomização aeropônica.",
      detail: "Isso significa que até em climas de extrema seca ou poeira, você produz sem precisar de fontes externas constantes de abastecimento d'água."
    },
    {
      stepNumber: "02",
      title: "Proteção Total e Escudo Ativo",
      tagline: "Imunidade às Condições Climáticas",
      description: "O sistema modular hermético blinda o cultivo contra pragas locais, poluentes do ar e intempéries.",
      detail: "A membrana espacial regula as pressões e a radiação ultravioleta prejudicial, mantendo uma primavera artificial perfeita o ano inteiro."
    },
    {
      stepNumber: "03",
      title: "Super-Comida Cultivada",
      tagline: "Potencial Nutricional Elevado ao Extremo",
      description: "O ambiente controlado aeropônico permite stress biológico regulado, estimulando a produção de mais minerais e antioxidantes.",
      detail: "Colha hortaliças e tubérculos com até 40% mais nutrientes que o mesmo alimento cultivado em solo convencional."
    }
  ];

  const plansList: BusinessPlan[] = [
    {
      id: "pay",
      name: "Pay-as-you-Grow",
      type: "HaaS",
      priceText: "R$ 890",
      period: "por mês",
      description: "Assinatura mensal de Hardware as a Service. Ideal para pequenos produtores familiares modernizarem seu cultivo sem alto investimento inicial.",
      features: [
        "1 Módulo Estufa M1 (15m² de área útil)",
        "Sensores digitais IoT inclusos",
        "App Martis OS com alertas básicos por WhatsApp",
        "Suporte técnico remoto especializado",
        "Reposição de kits nutricionais mensal inclusa"
      ],
      ctaText: "Assinar Pay-as-you-Grow",
      badge: "Inovação Acessível",
      popular: false
    },
    {
      id: "direct",
      name: "Venda Direta Modular",
      type: "Venda",
      priceText: "R$ 48.000",
      period: "preço único",
      description: "Propriedade definitiva dos módulos. Projetado para médios e grandes agricultores e cooperativas que visam escala imediata e segurança produtiva.",
      features: [
        "Estufa Modular Expansível H1 de Alta Produção",
        "Painéis Solares integrados para autossuficiência",
        "Licença Vitalícia ASTRA-AI Premium para 5 usuários",
        "Treinamento operacional completo in-loco (2 dias)",
        "Garantia estrutural aeroespacial de 10 anos"
      ],
      ctaText: "Adquirir Estrutura Completa",
      badge: "Mais Procurado",
      popular: true
    },
    {
      id: "guarantee",
      name: "Parceria Colheita Garantida",
      type: "Risco Mutuo",
      priceText: "Risco Compartilhado",
      period: "taxa sobre lucro",
      description: "Nós fornecemos a estufa e a tecnologia, e você entra com a mão de obra. Dividimos o retorno líquido da produção de forma transparente.",
      features: [
        "Implementação completa com custo de entrada reduzido",
        "Consultoria agrícola dedicada mensal",
        "Acesso prioritário a compradores parceiros Martis",
        "Suporte preferencial e atualizações de hardware gratuitas",
        "Risco compartilhado: só pagamos se você colher!"
      ],
      ctaText: "Aderir à Parceria",
      badge: "Crescimento Mútuo",
      popular: false
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans relative ${
      darkMode ? "bg-cosmic text-[#E7F1F3] selection:bg-mars selection:text-white" : "bg-[#F8FAFC] text-slate-800 selection:bg-mars selection:text-white"
    }`}>
      
      {/* HEADER / NAVIGATION BAR WITH MARS BACKGROUND IMAGE */}
      <header className={`sticky top-0 z-50 w-full backdrop-blur-md border-b transition-all duration-300 overflow-hidden ${
        darkMode ? "bg-[#030510]/85 border-mars/20" : "bg-white/90 border-slate-200 shadow-sm"
      }`}>
        {/* Real-life high-resolution NASA Mars planet background image inside the header */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden opacity-25">
          <img 
            src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1920&auto=format&fit=crop" 
            alt="" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 filter brightness-110 saturate-125"
          />
          <div className={`absolute inset-0 ${
            darkMode 
              ? "bg-gradient-to-r from-[#030510]/95 via-[#030510]/60 to-[#030510]/95" 
              : "bg-gradient-to-r from-white/95 via-white/70 to-white/95"
          }`} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10">
          
          {/* Logo / Brand */}
          <a href="#" className="flex items-center group" aria-label="Martis Tech Home">
            <div className="flex flex-col justify-center">
              {darkMode ? (
                <img 
                  src="/images/Ativo 2.svg" 
                  alt="Martis Logo" 
                  className="w-[144px] h-[24px] object-contain filter drop-shadow-[0_0_8px_rgba(118,194,61,0.5)] mb-1"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <img 
                  src="/images/Ativo 4.svg" 
                  alt="Martis Logo" 
                  className="w-[144px] h-[24px] object-contain mb-1"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center text-sm font-medium">
            <a 
              href="#sobre-nos" 
              className={`transition-colors duration-200 ${
                darkMode ? "text-slate-300 hover:text-neon" : "text-slate-600 hover:text-mars"
              }`}
            >
              Missão
            </a>
            <a 
              href="#produto" 
              className={`transition-colors duration-200 ${
                darkMode ? "text-slate-300 hover:text-neon" : "text-slate-600 hover:text-mars"
              }`}
            >
              O Produto
            </a>
            <a 
              href="#como-funciona" 
              className={`transition-colors duration-200 ${
                darkMode ? "text-slate-300 hover:text-neon" : "text-slate-300 hover:text-[#B04303]"
              }`}
            >
              Como Funciona
            </a>
            <a 
              href="#visualizador-3d" 
              className={`transition-colors duration-200 ${
                darkMode ? "text-slate-300 hover:text-neon" : "text-slate-600 hover:text-mars"
              }`}
            >
              Visualizador 3D
            </a>
            <a 
              href="#planos" 
              className={`transition-colors duration-200 ${
                darkMode ? "text-slate-300 hover:text-neon" : "text-slate-600 hover:text-mars"
              }`}
            >
              Planos
            </a>

            {/* Accessibility / Theme Mode Selector (Tip 2 / Modo Claro e Escuro) */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                darkMode 
                  ? "bg-mars-dark/10 border-mars/30 text-neon hover:bg-mars-dark/25 hover:text-white" 
                  : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:border-slate-400"
              }`}
              title={darkMode ? "Ativar Modo Claro (Acessibilidade)" : "Ativar Modo Escuro (Default)"}
              aria-label={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <a 
              href="https://martis-snack-774606657825.us-west1.run.app" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-mars-dark hover:bg-mars text-white rounded font-display text-xs tracking-wider uppercase border border-mars/30 transition-colors duration-200"
            >
              Acessar o App
            </a>
          </nav>

          {/* Mobile elements */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Accessibility switcher on mobile as well! */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                darkMode 
                  ? "bg-mars-dark/10 border-mars/30 text-neon" 
                  : "bg-slate-150 border-slate-300 text-slate-700"
              }`}
              title={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
              aria-label={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button 
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className={`focus:outline-none p-2 ${
                darkMode ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-slate-900"
              }`}
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu expanded */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-b px-4 py-5 space-y-4 relative z-15 transition-all duration-300 ${
            darkMode ? "bg-[#030510]/95 border-mars/20" : "bg-white border-slate-200 shadow-lg"
          }`}>
            <a 
              href="#sobre-nos" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block font-medium py-2 transition-colors ${
                darkMode ? "text-slate-300 hover:text-neon" : "text-slate-600 hover:text-mars"
              }`}
            >
              Missão
            </a>
            <a 
              href="#produto" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block font-medium py-2 transition-colors ${
                darkMode ? "text-slate-300 hover:text-neon" : "text-slate-600 hover:text-mars"
              }`}
            >
              O Produto
            </a>
            <a 
              href="#como-funciona" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block font-medium py-2 transition-colors ${
                darkMode ? "text-slate-300 hover:text-neon" : "text-slate-600 hover:text-mars"
              }`}
            >
              Como Funciona
            </a>
            <a 
              href="#visualizador-3d" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block font-medium py-2 transition-colors ${
                darkMode ? "text-slate-300 hover:text-neon" : "text-slate-600 hover:text-mars"
              }`}
            >
              Visualizador 3D
            </a>
            <a 
              href="#planos" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block font-medium py-2 transition-colors ${
                darkMode ? "text-slate-300 hover:text-neon" : "text-slate-600 hover:text-mars"
              }`}
            >
              Planos
            </a>
            <a 
              href="https://martis-snack-774606657825.us-west1.run.app" 
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 bg-mars hover:bg-mars-dark text-white rounded font-display text-xs tracking-wider uppercase border border-mars-dark transition-colors duration-200"
            >
              Acessar o App
            </a>
          </div>
        )}
      </header>

      {/* 1. HERO SECTION WITH SPACE MARS BACKGROUND */}
      <section id="hero" className={`relative min-h-[85vh] flex items-center overflow-hidden py-12 md:py-20 z-10 transition-colors duration-300 ${
        darkMode ? "bg-[#030510]" : "bg-gradient-to-br from-[#E6F4F6] via-[#F3F9FA] to-[#F8FAFC]"
      }`}>
        
        {/* Real-life high-resolution NASA Mars planet background image matching the user's reference */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1920&auto=format&fit=crop" 
            alt="Planeta Marte" 
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-center scale-110 transition-all duration-300 ${
              darkMode 
                ? "opacity-50 brightness-95 contrast-105" 
                : "opacity-75 mix-blend-multiply brightness-110 contrast-105 saturate-125"
            }`}
          />
          {/* Vignette and Radial mask to integrate the image seamlessly into our theme */}
          <div className={`absolute inset-0 transition-all duration-300 ${
            darkMode 
              ? "bg-gradient-to-t from-[#030510] via-transparent to-[#030510]/80" 
              : "bg-gradient-to-t from-[#F8FAFC] via-transparent to-[#F8FAFC]/80"
          }`} />
          <div className={`absolute inset-0 transition-all duration-300 ${
            darkMode 
              ? "bg-gradient-to-r from-[#030510] via-[#030510]/35 to-transparent" 
              : "bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/20 to-transparent"
          }`} />
          <div 
            className="absolute inset-0 transition-all duration-300 opacity-70" 
            style={{
              backgroundImage: darkMode 
                ? 'radial-gradient(circle at center, transparent 30%, #030510 85%)' 
                : 'radial-gradient(circle at center, transparent 35%, #F8FAFC 85%)'
            }}
          />
        </div>
        
        {/* Subtle Martian atmospheric backdrops */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-50 z-5" 
          style={{
            backgroundImage: darkMode
              ? 'radial-gradient(circle at center, rgba(176, 67, 3, 0.15) 0%, transparent 65%)'
              : 'radial-gradient(circle at center, rgba(0, 151, 171, 0.22) 0%, transparent 70%)'
          }}
        />
        <div className={`absolute -top-40 right-10 w-[450px] h-[450px] blur-[120px] rounded-full pointer-events-none z-5 ${
          darkMode ? "bg-mars/10" : "bg-neon/15"
        }`} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Context Left */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 bg-mars-dark/30 border border-mars/40 px-3 py-1 rounded-full">
                <Rocket className="w-3.5 h-3.5 text-neon" />
                <span className={`text-[10px] font-mono tracking-widest uppercase transition-colors ${
                  darkMode ? "text-[#E7F1F3]/90" : "text-slate-700 font-semibold"
                }`}>
                  Da Terra a Marte — Agricultura Bioregenerativa
                </span>
              </div>
              
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-[1.1] tracking-tight transition-colors duration-300 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}>
                Alimentos em <span className="text-transparent bg-clip-text bg-gradient-to-r from-mars via-red-500 to-neon font-semibold">qualquer clima</span>, de forma modular.
              </h1>
              
              <p className={`text-base sm:text-lg max-w-xl leading-relaxed transition-colors duration-300 ${
                darkMode ? "text-slate-300" : "text-slate-650"
              }`}>
                Unimos engenharia aeroespacial e inteligência artificial para criar a <strong className="text-neon">Unidade de Produção Bioregenerativa</strong>. Uma estufa física autossuficiente monitorada pelo inovador <strong className={darkMode ? "text-white" : "text-slate-900"}>Martis OS com ASTRA-AI</strong>.
              </p>

              {/* Persona connection elements */}
              <div className={`p-4 rounded-xl border max-w-lg mb-4 flex items-start space-x-3 transition-colors ${
                darkMode ? "bg-[#030510]/60 border-mars-dark/40" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div className="w-10 h-10 rounded-full bg-neon/10 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-neon" />
                </div>
                <div className={`text-xs space-y-1 ${darkMode ? "text-slate-400" : "text-slate-650"}`}>
                  <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>Ideal para o campo:</span> Operação 100% offline-first adaptada para internet rural instável, com suporte facilitado via áudios práticos de WhatsApp e monitoramento inteligente na palma da sua mão.
                </div>
              </div>

              {/* Call to actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a 
                  href="https://martis-snack-774606657825.us-west1.run.app" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-neon hover:bg-neon/90 text-cosmic font-display font-bold text-sm tracking-widest uppercase rounded shadow-lg shadow-neon/15 hover:scale-[1.02] transform transition-all duration-200 text-center cursor-pointer"
                >
                  Acessar o App
                </a>
                <a 
                  href="#sobre-nos" 
                  className={`px-8 py-4 bg-transparent font-display font-semibold text-xs tracking-widest uppercase rounded transition-all duration-200 text-center ${
                    darkMode ? "hover:bg-white/5 text-white border border-slate-500 hover:border-slate-300" : "hover:bg-slate-100 text-slate-700 border border-slate-300 hover:border-slate-400"
                  }`}
                >
                  Saiba mais <ChevronRight className="w-4 h-4 inline ml-1" />
                </a>
              </div>
            </div>

            {/* Quick Feature Dashboard Right */}
            <div className="lg:col-span-5 relative">
              <div className={`relative mx-auto max-w-[340px] md:max-w-[380px] p-6 rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 ${
                darkMode 
                  ? "bg-gradient-to-br from-[#060b1e] to-[#040715] border-mars/40 glow-mars" 
                  : "bg-white border-slate-200 shadow-slate-200/50 text-slate-800"
              }`}>
                {/* Tech HUD decorative backdrop */}
                <div className={`absolute top-0 right-0 p-2 font-mono text-[8px] select-none ${
                  darkMode ? "text-mars/40" : "text-slate-400"
                }`}>
                  MARTIS_SYS_1.0
                </div>

                {/* Simulated Martis OS on mobile device preview */}
                <div className={`flex items-center space-x-2 border-b pb-3 mb-4 ${
                  darkMode ? "border-mars-dark/30" : "border-slate-100"
                }`}>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                  <div className={`text-[10px] font-mono tracking-widest uppercase ${
                    darkMode ? "text-slate-450" : "text-slate-600 font-bold"
                  }`}>Martis OS • Telemetria Pro</div>
                </div>

                <div className="space-y-4">
                  {/* Agricultural state */}
                  <div className="p-3 bg-cosmic/70 rounded border border-mars/20">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Eficiência da Água:</span>
                      <span className="text-neon font-mono font-bold">+95%</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-neon h-full w-[95%]"></div>
                    </div>
                  </div>

                  <div className="p-3 bg-cosmic/70 rounded border border-mars/20">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Escudo Térmico Ativo:</span>
                      <span className="text-orange-500 font-mono font-bold">LIGADO</span>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400 font-mono">
                      Temperatura Interna: <strong className="text-white">22.8°C</strong> (Externo: -15°C)
                    </div>
                  </div>

                  <div className="p-3 bg-cosmic/70 rounded border border-neon/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-neon" />
                        <span className="text-xs text-white font-medium">ASTRA-AI Status</span>
                      </div>
                      <span className="text-[9px] font-mono bg-neon/10 text-neon px-1.5 py-0.5 rounded">Ativo</span>
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400 leading-normal">
                      &quot;Colheita de Alface Crespa segura pelos próximos 9 dias. Temperatura atmosférica estabilizada internamente.&quot;
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-mars-dark/30 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>LATITUDE: 18.4° N</span>
                  <span>MARS GRID 024</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SOBRE NÓS SECTION */}
      <section id="sobre-nos" className={`py-20 border-t transition-colors duration-300 relative ${
        darkMode ? "bg-cosmic border-mars/10" : "bg-slate-50 border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Left */}
            <div className="lg:col-span-5 space-y-4">
              <div className={`p-1.5 rounded-2xl border shadow-2xl relative overflow-hidden group transition-all duration-300 ${
                darkMode ? "bg-[#030510] border-mars-dark/30" : "bg-white border-slate-200 shadow-slate-200/40"
              }`}>
                <div className="absolute inset-0 bg-gradient-to-br from-mars/10 to-transparent pointer-events-none" />
                <div className={`aspect-square flex flex-col items-center justify-center p-8 text-center rounded-xl transition-colors duration-300 ${
                  darkMode ? "bg-gradient-to-tr from-mars-dark to-[#09152C]" : "bg-gradient-to-tr from-orange-100 to-amber-50"
                }`}>
                  {/* Decorative orbital system */}
                  <div className="w-32 h-32 rounded-full border border-mars/20 flex items-center justify-center animate-spin duration-10000 relative">
                    <div className="absolute top-0 left-1/2 -ml-2 w-4 h-4 rounded-full bg-mars border-2 border-[#030510]" />
                    <div className="w-20 h-20 rounded-full border border-neon/20 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-neon/10 flex items-center justify-center text-neon">
                        <Sprout className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 space-y-2">
                    <h4 className={`text-xl font-display font-bold tracking-wide transition-colors ${
                      darkMode ? "text-white" : "text-slate-800"
                    }`}>Plante Onde Quiser</h4>
                    <span className={`text-xs block font-mono transition-colors ${
                      darkMode ? "text-slate-400" : "text-slate-600"
                    }`}>Torno viável o amanhã em locais inviáveis hoje</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Right */}
            <div className="lg:col-span-7 space-y-6">
              <div className="text-neon font-mono text-xs tracking-widest uppercase">Nossa Missão</div>
              
              <h2 className={`text-3xl sm:text-4xl font-display font-medium tracking-tight transition-colors duration-300 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}>
                Alimentar a Terra aprendendo com os desafios de Marte.
              </h2>
              
              <div className={`space-y-4 leading-relaxed transition-colors duration-300 ${
                darkMode ? "text-slate-300" : "text-slate-600"
              }`}>
                <p>
                  A escassez crítica de água, as variações de temperatura imprevisíveis e o empobrecimento rápido dos solos produtivos já são uma realidade dura no semiárido, no cerrado e em diversas regiões agrícolas terrestres. 
                </p>
                <p>
                  Tratamos as crises climáticas da Terra como tratamos o solo marciano: com confinamento produtivo estanque de altíssima eficiência. A nossa missão é empregar tecnologia de trajes de astronautas e controle inteligente computorizado de raízes para <strong className="text-neon">viabilizar alimento fresco sem depender de chuvas regulares, agrotóxicos ou terra preta</strong>.
                </p>
              </div>

              {/* Stat figures for social proof/trust */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className={`p-4 rounded-r transition-colors duration-300 ${
                  darkMode ? "bg-mars-dark/10 border-l-2 border-mars" : "bg-orange-50/60 border-l-2 border-mars"
                }`}>
                  <div className={`text-2xl sm:text-3xl font-display font-bold transition-all duration-300 ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}>95%</div>
                  <div className={`text-[10px] sm:text-xs uppercase tracking-wider mt-1 transition-colors font-mono ${
                    darkMode ? "text-slate-400" : "text-slate-650"
                  }`}>Economia de Água</div>
                </div>
                <div className={`p-4 rounded-r transition-colors duration-300 ${
                  darkMode ? "bg-mars-dark/10 border-l-2 border-mars" : "bg-orange-50/60 border-l-2 border-mars"
                }`}>
                  <div className={`text-2xl sm:text-3xl font-display font-bold transition-all duration-300 ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}>4h</div>
                  <div className={`text-[10px] sm:text-xs uppercase tracking-wider mt-1 transition-colors font-mono ${
                    darkMode ? "text-slate-400" : "text-slate-650"
                  }`}>Montagem Rápida</div>
                </div>
                <div className={`p-4 rounded-r transition-colors duration-300 ${
                  darkMode ? "bg-mars-dark/10 border-l-2 border-mars" : "bg-orange-50/60 border-l-2 border-mars"
                }`}>
                  <div className={`text-2xl sm:text-3xl font-display font-bold transition-all duration-300 ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}>Zero</div>
                  <div className={`text-[10px] sm:text-xs uppercase tracking-wider mt-1 transition-colors font-mono ${
                    darkMode ? "text-slate-400" : "text-slate-650"
                  }`}>Agrotóxicos Usados</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. O PRODUTO SECTION */}
      <section id="produto" className={`py-20 transition-all duration-300 relative ${
        darkMode ? "bg-gradient-to-b from-[#030510] to-[#050818]" : "bg-gradient-to-b from-white to-[#F1F5F9]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="text-neon font-mono text-xs tracking-widest uppercase">Os Pilares Martis</div>
            <h2 className={`text-3xl sm:text-4xl font-display font-semibold transition-colors duration-300 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}>
              A Unidade de Produção Bioregenerativa
            </h2>
            <p className={`text-sm max-w-xl mx-auto transition-colors duration-300 ${
              darkMode ? "text-slate-400" : "text-slate-650"
            }`}>
              Engenharia completa integrando 4 componentes físicos ultra-modernos e 1 sistema digital avançado sob inteligência computorizada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productPillars.map((pillar, idx) => (
              <div 
                key={pillar.id}
                className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.015] flex flex-col justify-between ${
                  pillar.id === "martisos" 
                    ? (darkMode 
                        ? "bg-[#030510]/80 border-neon/40 shadow-lg shadow-neon/5 md:col-span-2 lg:col-span-1" 
                        : "bg-orange-50/40 border-mars shadow-md md:col-span-2 lg:col-span-1 shadow-orange-500/5") 
                    : (darkMode 
                        ? "bg-[#030510]/80 border-mars/30 hover:border-mars" 
                        : "bg-white border-slate-200 hover:border-mars shadow-sm")
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono text-slate-500 uppercase">
                      Pilar {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase ${
                      pillar.id === "martisos" 
                        ? "bg-neon/15 text-neon" 
                        : (darkMode ? "bg-mars-dark/30 text-slate-300 border border-mars/20" : "bg-orange-100 text-slate-800")
                    }`}>
                      {pillar.id === "martisos" ? "Sistema Digital" : "Estrutural Físico"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 mb-2">
                    {pillar.id === "greenhouse" && <Layers className="w-5 h-5 text-mars" />}
                    {pillar.id === "aeroponic" && <Droplets className="w-5 h-5 text-mars" />}
                    {pillar.id === "biostasis" && <Thermometer className="w-5 h-5 text-mars" />}
                    {pillar.id === "thermal" && <Activity className="w-5 h-5 text-mars" />}
                    {pillar.id === "martisos" && <Cpu className="w-5 h-5 text-neon" />}
                    
                    <h3 className={`text-lg font-display font-bold transition-colors ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}>{pillar.title}</h3>
                  </div>

                  <span className={`text-xs font-medium block mb-3 font-mono ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}>{pillar.tagline}</span>
                  <p className={`text-xs leading-relaxed mb-6 ${
                    darkMode ? "text-slate-300" : "text-slate-600"
                  }`}>{pillar.description}</p>
                </div>

                <div className={`border-t pt-4 space-y-2 ${
                  darkMode ? "border-slate-900" : "border-slate-100"
                }`}>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Especificações:</div>
                  {pillar.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className={`flex items-start space-x-2 text-[11px] ${
                      darkMode ? "text-slate-300" : "text-slate-600"
                    }`}>
                      <span className="text-neon mt-0.5">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. COMO FUNCIONA SECTION */}
      <section id="como-funciona" className={`py-20 border-t transition-colors duration-300 relative ${
        darkMode ? "bg-cosmic border-mars/10" : "bg-slate-50 border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Context Introduction */}
            <div className="lg:col-span-4 space-y-5">
              <div className="text-neon font-mono text-xs tracking-widest uppercase">Fluxo Operacional</div>
              <h2 className={`text-3xl sm:text-4xl font-display font-medium tracking-tight transition-colors ${
                darkMode ? "text-white" : "text-slate-900"
              }`}>
                Simples de entender. Seguro de operar.
              </h2>
              <p className={`text-sm leading-relaxed transition-colors ${
                darkMode ? "text-slate-400" : "text-slate-650"
              }`}>
                Sem complexidades teóricas desnecessárias. A Martis desenhou um fluxo intuitivo focado em resultados reais de colheita no campo.
              </p>
              
              <div className={`p-4 border rounded-lg flex items-center space-x-3 transition-colors ${
                darkMode ? "bg-[#050818] border-mars/20" : "bg-white border-slate-205 shadow-sm"
              }`}>
                <BadgeCheck className="w-6 h-6 text-neon shrink-0" />
                <div className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                  <strong className={`block ${darkMode ? "text-white" : "text-slate-900"}`}>Certificação Espacial:</strong> Sistema homologado com tecnologia resistente a desastres climáticos severos.
                </div>
              </div>
            </div>

            {/* Right Steps Progression */}
            <div className="lg:col-span-8 space-y-8">
              {worksSteps.map((step, idx) => (
                <div 
                  key={idx}
                  className={`p-6 rounded-xl border transition-all duration-300 flex flex-col sm:flex-row items-start gap-6 ${
                    darkMode 
                      ? "bg-[#030510]/60 border-mars-dark/30 hover:border-mars/50" 
                      : "bg-white border-slate-200 hover:border-mars/50 shadow-sm"
                  }`}
                >
                  {/* Huge numeric label */}
                  <div className="text-5xl font-display font-bold text-mars font-mono select-none sm:py-2 shrink-0">
                    {step.stepNumber}
                  </div>
                  
                  {/* Step Description */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`text-lg font-display font-semibold transition-colors ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}>{step.title}</h3>
                      <span className="text-[10px] font-mono text-neon bg-neon/10 px-2 py-0.5 rounded">{step.tagline}</span>
                    </div>
                    <p className={`text-xs leading-relaxed font-sans transition-colors ${
                      darkMode ? "text-slate-300" : "text-slate-600"
                    }`}>{step.description}</p>
                    <p className={`text-xs italic ${darkMode ? "text-slate-400" : "text-slate-500"}`}>➔ {step.detail}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE 3D SECTION */}
      <section id="visualizador-3d" className={`border-t border-b overflow-hidden transition-colors duration-300 ${
        darkMode ? "border-mars/20" : "border-slate-200"
      }`}>
        <div className={`w-full transition-colors duration-300 ${darkMode ? "bg-[#030510]" : "bg-slate-100"}`}>
          <Greenhouse3D />
        </div>
      </section>

      {/* 6. PLANOS / PREÇOS SECTION */}
      <section id="planos" className={`py-20 relative transition-all duration-300 ${
        darkMode ? "bg-gradient-to-b from-[#030510] to-[#04081c]" : "bg-gradient-to-b from-[#F1F5F9] to-[#E2E8F0]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="text-neon font-mono text-xs tracking-widest uppercase">Acesso à Tecnologia</div>
            <h2 className={`text-3xl sm:text-4xl font-display font-semibold transition-colors ${
              darkMode ? "text-white" : "text-slate-900"
            }`}>
              Modelos de Negócio Sob Medida
            </h2>
            <p className={`text-sm max-w-xl mx-auto transition-colors ${
              darkMode ? "text-slate-400" : "text-slate-650"
            }`}>
              Desde pequenos produtores rurais até cooperativas industriais ou agricultura de risco. Escolha o formato ideal para crescer.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {plansList.map((plan) => (
              <div 
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.popular 
                    ? (darkMode 
                        ? "bg-gradient-to-b from-[#140c06] to-[#030510] border-2 border-mars shadow-2xl scale-[1.02] lg:-translate-y-2 z-10" 
                        : "bg-white border-2 border-mars shadow-xl scale-[1.02] lg:-translate-y-2 z-10") 
                    : (darkMode 
                        ? "bg-[#030510]/80 border border-slate-800" 
                        : "bg-white border border-slate-200 shadow-sm")
                }`}
              >
                {plan.badge && (
                  <span className={`absolute top-4 right-4 text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-1 rounded ${
                    plan.popular ? "bg-[#B04303] text-white" : "bg-slate-200 text-slate-700 border border-slate-300"
                  }`}>
                    {plan.badge}
                  </span>
                )}

                <div>
                  <span className="text-[10px] font-mono text-neon uppercase tracking-widest">{plan.type}</span>
                  <h3 className={`text-xl font-display font-bold mt-1 transition-colors ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}>{plan.name}</h3>
                  <p className={`text-xs mt-2 min-h-[48px] transition-colors ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}>{plan.description}</p>
                  
                  {/* Price display */}
                  <div className={`my-6 border-t border-b py-4 flex items-baseline ${
                    darkMode ? "border-white/5" : "border-slate-100"
                  }`}>
                    <span className={`text-2xl sm:text-3xl font-display font-extrabold tracking-tight transition-colors ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}>{plan.priceText}</span>
                    <span className={`text-[11px] ml-2 font-mono ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{plan.period}</span>
                  </div>

                  {/* Features list */}
                  <div className="space-y-3 mb-8">
                    <span className={`text-[10px] font-mono tracking-wider uppercase font-semibold ${
                      darkMode ? "text-slate-400" : "text-slate-550"
                    }`}>O que inclui:</span>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className={`flex items-start space-x-2.5 text-xs transition-colors ${
                        darkMode ? "text-slate-300" : "text-slate-600"
                      }`}>
                        <CheckCircle className="w-4 h-4 text-neon shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a 
                  href="#espera-form" 
                  className={`w-full py-3.5 text-center rounded font-display text-xs font-bold tracking-wider uppercase transition-colors duration-200 block ${
                    plan.popular 
                      ? "bg-neon hover:bg-neon/95 text-cosmic font-extrabold shadow-lg shadow-neon/10 cursor-pointer" 
                      : (darkMode 
                          ? "bg-[#04081c] hover:bg-[#09103c] text-white border border-mars/40 hover:border-mars cursor-pointer" 
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 hover:border-slate-400 cursor-pointer")
                  }`}
                >
                  {plan.ctaText}
                </a>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. CTA FINAL & WAITING LIST WITH LIVE CRUD CONSOLE */}
      <section id="espera-form" className={`py-20 border-t transition-colors duration-300 ${
        darkMode ? "border-[#B04303]/20 bg-gradient-to-b from-[#050818] to-cosmic" : "border-slate-200 bg-gradient-to-b from-white to-slate-100"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Form Section Left */}
            <div className={`p-8 rounded-2xl shadow-2xl relative overflow-hidden transition-all duration-300 lg:col-span-5 space-y-6 ${
              darkMode ? "bg-cosmic border border-[#B04303]/30" : "bg-white border border-slate-200 shadow-slate-200/50"
            }`}>
              <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-mars to-neon"></div>
              
              <div className="space-y-2">
                <span className="text-neon tracking-widest font-mono text-[10px] uppercase">Participe da Revolução</span>
                <h3 className={`text-2xl font-display font-semibold transition-colors ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}>Adentrar na Lista de Espera</h3>
                <p className={`text-xs leading-relaxed font-sans transition-colors ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}>
                  Nossas estufas são fabricadas sob demanda programada. Cadastrando seu e-mail e nome hoje, você garante prioridade de reserva no lote de 2026 com condições exclusivas de lançamento.
                </p>
              </div>

              {/* Status and messages */}
              {successMessage && (
                <div id="form-success" className="p-3 bg-neon/10 border border-neon/30 text-neon rounded text-xs flex items-center space-x-2 font-medium">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}
              {errorMessage && (
                <div id="form-error" className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 rounded text-xs flex items-center space-x-2 font-medium">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email Form */}
              <form onSubmit={handleAddWaitlist} className="space-y-4">
                
                <div className="space-y-1">
                  <label htmlFor="user-name" className={`text-[11px] font-mono uppercase block ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}>Qual o seu Nome?</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <input 
                      id="user-name"
                      type="text" 
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ex: José Renato Dornelles"
                      className={`w-full border focus:border-neon px-10 py-3 rounded text-xs outline-none font-sans transition-colors ${
                        darkMode ? "bg-[#030510] border-mars-dark/50 text-white placeholder:text-slate-600" : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="user-email" className={`text-[11px] font-mono uppercase block ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}>Seu Principal E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <input 
                      id="user-email"
                      type="email" 
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="ze.dornelles@ruralnet.com.br"
                      className={`w-full border focus:border-neon px-10 py-3 rounded text-xs outline-none font-sans transition-colors ${
                        darkMode ? "bg-[#030510] border-mars-dark/50 text-white placeholder:text-slate-600" : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                      }`}
                      required
                    />
                  </div>
                </div>

                <button 
                  id="submit-waitlist-btn"
                  type="submit" 
                  disabled={submittingForm}
                  className="w-full py-4 bg-neon hover:bg-neon/90 text-cosmic font-display font-bold text-xs tracking-widest uppercase rounded flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submittingForm ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Cadastrando...</span>
                    </>
                  ) : (
                    <span>Garantir Reserva de Entrada</span>
                  )}
                </button>
              </form>

              <div id="whatapp-notice" className="text-[10px] text-slate-500 font-mono text-center pt-2">
                Suas informações de contato estão 100% seguras.
              </div>
            </div>
            <div className={`p-6 rounded-2xl border space-y-4 lg:col-span-7 transition-all duration-300 ${
              darkMode ? "bg-[#030510]/80 border-[#B04303]/10" : "bg-white border-slate-200 shadow-slate-200/50"
            }`}>
              <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-4 ${
                darkMode ? "border-white/5" : "border-slate-100"
              }`}>
                <div>
                  <h4 className={`text-base font-display font-semibold flex items-center space-x-2 ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}>
                    <Clock className="w-4 h-4 text-neon" />
                    <span>Painel de Registros Recentes (Holo-CRM)</span>
                  </h4>
                  <p className={`text-[11px] mt-0.5 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}>
                    Este console interage em tempo real com os endpoints locais `GET`, `PUT` e `DELETE` em `/api/waitlist`.
                  </p>
                </div>
                
                <button 
                  onClick={fetchWaitlist} 
                  disabled={loadingList}
                  className="px-3 py-1 bg-mars hover:bg-mars/90 text-white text-[10px] font-mono tracking-wider uppercase rounded flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  {loadingList ? <Loader2 className="w-3 h-3 animate-spin" /> : <span>Recarregar</span>}
                </button>
              </div>

              {/* Waitlist list viewport */}
              {loadingList && waitlist.length === 0 ? (
                <div role="status" className="py-20 flex flex-col items-center justify-center space-y-2 text-slate-500 font-mono text-xs">
                  <Loader2 className="w-8 h-8 animate-spin text-mars" />
                  <span>Analisando base de registros...</span>
                </div>
              ) : waitlist.length === 0 ? (
                <div className="py-20 text-center text-slate-500 font-mono text-xs">
                  Nenhum cadastro encontrado. Escreva acima para estrear a lista!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className={`border-b text-[10px] uppercase ${
                        darkMode ? "border-white/5 text-slate-400" : "border-slate-100 text-slate-550"
                      }`}>
                        <th className="py-2 px-3">ID / Data</th>
                        <th className="py-2 px-3">Nome</th>
                        <th className="py-2 px-3">E-mail</th>
                        <th className="py-2 px-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${
                      darkMode ? "divide-white/5 text-slate-300" : "divide-slate-100 text-slate-700"
                    }`}>
                      {waitlist.map((item) => (
                        <tr key={item.id} className={`transition-colors ${
                          darkMode ? "hover:bg-[#050818]/40" : "hover:bg-slate-50"
                        }`}>
                          <td className="py-3 px-3 text-[10px] text-slate-500">
                            #{item.id}
                            <span className="block text-[8px] text-slate-600 mt-0.5 font-sans">
                              {new Date(item.created_at).toLocaleDateString("pt-BR")}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {editingId === item.id ? (
                              <input 
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className={`border px-2 py-1 rounded text-xs uppercase outline-none ${
                                  darkMode ? "bg-cosmic border-neon text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                                }`}
                              />
                            ) : (
                              <span className={`font-sans font-medium ${darkMode ? "text-white" : "text-slate-900"}`}>{item.nome}</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {editingId === item.id ? (
                              <input 
                                type="email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                className={`border px-2 py-1 rounded text-xs outline-none w-full ${
                                  darkMode ? "bg-cosmic border-neon text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                                }`}
                              />
                            ) : (
                              <span className={darkMode ? "text-slate-400" : "text-slate-600"}>{item.email}</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            {editingId === item.id ? (
                              <div className="flex justify-end space-x-1">
                                <button 
                                  onClick={() => handleUpdate(item.id)}
                                  disabled={actionLoading === item.id}
                                  className="p-1 px-2 bg-neon/15 hover:bg-neon text-neon hover:text-cosmic rounded border border-neon/30 text-[9.5px] font-bold duration-150 flex items-center gap-0.5 cursor-pointer"
                                  title="Salvar alterações"
                                >
                                  {actionLoading === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                  <span>Salvar</span>
                                </button>
                                <button 
                                  onClick={cancelEdit}
                                  className="p-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[9.5px] duration-150 cursor-pointer"
                                  title="Cancelar"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end space-x-1">
                                <button 
                                  onClick={() => startEdit(item)}
                                  className={`p-1 rounded border duration-150 cursor-pointer ${
                                    darkMode ? "bg-mars-dark/10 hover:bg-mars/20 border-mars/20 text-slate-300 hover:text-white" : "bg-slate-150 hover:bg-slate-200 border-slate-250 text-slate-700"
                                  }`}
                                  title="Editar inscrição"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(item.id)}
                                  disabled={actionLoading === item.id}
                                  className="p-1 bg-red-955/10 hover:bg-red-900/20 text-red-400 hover:text-red-300 rounded border border-red-900/20 duration-150 cursor-pointer"
                                  title="Excluir inscrição"
                                >
                                  {actionLoading === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className={`border-t text-xs py-12 transition-all duration-300 ${
        darkMode ? "bg-[#02040e] border-mars/20 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: branding */}
            <div className="space-y-4 md:col-span-1">
              <a href="#" className="flex items-center group" aria-label="Martis Tech Home">
                <div className="flex items-center">
                  {darkMode ? (
                    <img 
                      src="/images/Ativo 2.svg" 
                      alt="Martis Logo" 
                      className="w-[144px] h-[24px] object-contain filter drop-shadow-[0_0_6px_rgba(118,194,61,0.4)]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <img 
                      src="/images/Ativo 4.svg" 
                      alt="Martis Logo" 
                      className="w-[144px] h-[24px] object-contain"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </a>
            </div>

            {/* Column 2: links */}
            <div>
              <h5 className="text-[11px] font-mono tracking-widest text-[#B04303] uppercase font-bold mb-4">Seções</h5>
              <ul className={`space-y-2 transition-colors duration-300 ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}>
                <li><a href="#sobre-nos" className="hover:text-neon transition-colors">Nossa Missão</a></li>
                <li><a href="#produto" className="hover:text-neon transition-colors">Os Atributos</a></li>
                <li><a href="#como-funciona" className="hover:text-neon transition-colors">Como Funciona</a></li>
                <li><a href="#visualizador-3d" className="hover:text-neon transition-colors">Modelo Holográfico 3D</a></li>
                <li><a href="#planos" className="hover:text-neon transition-colors">Planos e Preços</a></li>
              </ul>
            </div>

            {/* Column 3: Tech documents */}
            <div>
              <h5 className="text-[11px] font-mono tracking-widest text-[#B04303] uppercase font-bold mb-4">API e Código</h5>
              <ul className={`space-y-2 transition-colors duration-300 ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}>
                <li>
                  <a href="/api/waitlist" target="_blank" className="hover:text-neon transition-colors inline-flex items-center">
                    Express Endpoint API <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
                <li>
                  <span className="hover:text-neon transition-colors block text-slate-500 line-through">
                    FastAPI Render (Mock deployable)
                  </span>
                </li>
                <li>
                  <span className="text-slate-500 text-[11px] block font-mono">
                    Banco de Dados SQLite ativo localmente.
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact links */}
            <div>
              <h5 className="text-[11px] font-mono tracking-widest text-[#B04303] uppercase font-bold mb-4">Canais</h5>
              <p className="text-[11px] text-slate-500 mb-2">Fale com os fundadores ou suporte agronômico:</p>
              <div className={`space-y-1.5 font-mono text-[11px] transition-colors duration-300 ${
                darkMode ? "text-slate-300" : "text-slate-700"
              }`}>
                <div>Email: <span className={darkMode ? "text-white" : "text-slate-900"}>contato@martis-os.tech</span></div>
                <div>Whatsapp: <span className={darkMode ? "text-white" : "text-slate-900"}>+55 (51) 99888-0000</span></div>
                <div>Escritório: Porto Alegre - RS, Brasil</div>
              </div>
            </div>

          </div>

          <div className={`border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono gap-4 transition-colors duration-300 ${
            darkMode ? "border-slate-900 text-slate-600" : "border-slate-200 text-slate-550"
          }`}>
            <p>© 2026 Martis Ltda. Todos os direitos reservados. Plantando o amanhã.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-neon transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-neon transition-colors">Privacidade</a>
            </div>
          </div>

        </div>
      </footer>

      {/* Diálogos e Modais customizados para acessibilidade perfeita (substitutos de alerts/confirms limitados em iframe) */}
      <AnimatePresence>
        {alertConfig.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-sm rounded-2xl p-6 border shadow-2xl ${
                darkMode ? "bg-[#0b0f19] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              <div className="flex items-start space-x-3">
                {alertConfig.type === "success" ? (
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className={`text-sm font-sans font-semibold uppercase tracking-wider ${darkMode ? "text-white" : "text-slate-900"}`}>
                    {alertConfig.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed font-mono">
                    {alertConfig.message}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-1.5 rounded-lg text-xs font-mono tracking-widest text-center cursor-pointer uppercase bg-mars text-neon font-bold hover:opacity-90 transition-opacity"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {confirmDeleteConfig.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-sm rounded-2xl p-6 border shadow-2xl ${
                darkMode ? "bg-[#0b0f19] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-sans font-semibold uppercase tracking-wider ${darkMode ? "text-white" : "text-slate-900"}`}>
                    Cancelar Inscrição?
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed font-mono">
                    Tem certeza de que deseja remover esta inscrição permanentemente do banco de dados local?
                  </p>
                </div>
              </div>
              <div className="mt-5 flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDeleteConfig({ isOpen: false, id: null })}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider cursor-pointer transition-colors ${
                    darkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  Manter
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider cursor-pointer bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors"
                >
                  Remover
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
