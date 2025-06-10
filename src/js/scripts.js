// === Atualiza barra de progresso do formulário ===
function atualizarProgresso() {
  const form = document.getElementById("vistoriaForm");
  const inputs = form.querySelectorAll("input[required], select[required]");
  let preenchidos = 0;

  inputs.forEach(input => {
    if (input.type === "radio") {
      const radios = form.querySelectorAll(`input[name="${input.name}"]`);
      if ([...radios].some(radio => radio.checked)) preenchidos++;
    } else if (input.value.trim() !== "") {
      preenchidos++;
    }
  });

  const porcentagem = (preenchidos / inputs.length) * 100;
  document.getElementById("progressFill").style.width = `${porcentagem}%`;
}

// === Gera o resumo do formulário ===
function gerarResumo() {
  const form = document.getElementById("vistoriaForm");
  const formData = new FormData(form);

  let resumo = `🏠 *RELATÓRIO DE VISTORIA TÉCNICA - ICE SOLAR*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  resumo += `
👤 *DADOS DO CLIENTE*
• Nome: ${formData.get("cliente_nome") || "Não informado"}
• Contato: ${formData.get("cliente_contato") || "Não informado"}
• Endereço: ${formData.get("cliente_endereco") || "Não informado"}
• Cidade: ${formData.get("cliente_cidade") || "Não informado"}
• Estado: ${formData.get("cliente_estado") || "Não informado"}
• Potência (kWp): ${formData.get("potencia_kwp") || "Não informado"}

📅 *VISITA TÉCNICA*
• Data: ${formData.get("visita_data") || "Não informado"}
• Horário: ${formData.get("visita_horario") || "Não informado"}
• Consultor Técnico: ${formData.get("consultor_tecnico") || "Não informado"}
• Acompanhante: ${formData.get("acompanhante") || "Não informado"}
• Vistoria com Drone: ${formData.get("vistoria_drone") || "Não informado"}

📍 *LOCALIZAÇÃO*
• Coordenadas: ${formData.get("coordenadas") || "Não informado"}

⚡ *PADRÃO DE ENTRADA (PDE)*
• Padrão da rede: ${formData.get("padrao_rede") || "Não informado"}
• Tensão da rede: ${formData.get("tensao_rede") || "Não informado"}
• Tipo de entrada: ${formData.get("tipo_entrada") || "Não informado"}
• PDE externo: ${formData.get("pde_externo") || "Não informado"}
• Número do medidor: ${formData.get("numero_medidor") || "Não informado"}
• Corrente disjuntor PDE: ${formData.get("corrente_disjuntor_pde") || "Não informado"}A

🔌 *QUADRO GERAL (QGBT)*
• Corrente do disjuntor: ${formData.get("qgbt_corrente_disjuntor") || "Não informado"}A
• Bitola dos condutores: ${formData.get("qgbt_bitola_condutores") || "Não informado"}mm²
• Espaço disponível: ${formData.get("qgbt_espaco") || "Não informado"}
• Localização: ${formData.get("qgbt_localizacao") || "Não informado"}

🔧 *INVERSOR E STRING BOX*
• Localização sugerida: ${formData.get("local_inversor") || "Não informado"}
• Internet no local: ${formData.get("internet_local") || "Não informado"}

📏 *DISTÂNCIAS*
• Painéis ↔ Inversor: ${formData.get("dist_paineis_inversor") || "N/I"}m
• Inversor ↔ QGBT: ${formData.get("dist_inversor_qgbt") || "N/I"}m
• Inversor ↔ PDE: ${formData.get("dist_inversor_pde") || "N/I"}m
• QGBT ↔ PDE: ${formData.get("dist_qgbt_pde") || "N/I"}m

🏠 *CONDIÇÕES DO TELHADO*
• Condições de acesso ao telhado: ${formData.get("acesso_telhado") || "Não informado"}
• Tamanho do Telhado: ${formData.get("tamanho_telhado") || "Não informado"}
• Existe espaço suficiente para instalação (Módulos): ${formData.get("espaco_modulos") || "Não informado"}
• Tipo de telha: ${formData.get("tipo_telha") || "Não informado"}
• Tipo de telhado: ${formData.get("tipo_telhado") || "Não informado"}
• Precisa manutenção: ${formData.get("telhado_manutencao") || "Não informado"}
• Telhas quebradas: ${formData.get("telhas_quebradas") || "Não informado"}

🏗️ *ESTRUTURA*
• Tipo de estrutura: ${formData.get("estrutura_telhado") || "Não informado"}
• Fissuras na alvenaria: ${formData.get("fissuras") || "Não informado"}
• Presença de cupim: ${formData.get("cupim") || "Não informado"}
• Infiltração: ${formData.get("infiltracao") || "Não informado"}

🌳 *SOMBREAMENTOS*
• Fontes de sombreamento: ${formData.get("sombreamento") || "Não informado"}
`;

  const fontesSombra = formData.getAll("fontes_sombra");
  if (fontesSombra.length > 0) resumo += `• Tipos: ${fontesSombra.join(", ")}\n`;

  if (formData.get("grupo_gerador") === "sim") {
    resumo += `
⚡ *GRUPO GERADOR*
• Presente: Sim
• Bitola: ${formData.get("bitola_gerador") || "N/I"}
• Corrente: ${formData.get("corrente_gerador") || "N/I"}A
`;
  }

  const obs = formData.get("observacoes_gerais");
  if (obs) resumo += `\n📋 *OBSERVAÇÕES GERAIS*\n${obs}\n`;

  resumo += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 *ICE SOLAR* - Vistoria Técnica Profissional
📅 Relatório gerado em: ${new Date().toLocaleString("pt-BR")}
`;

  const resumoConteudo = document.getElementById("resumoConteudo");
  const resumoModal = document.getElementById("resumoModal");
  if (resumoConteudo && resumoModal) {
    resumoConteudo.innerHTML = `<pre style="white-space: pre-wrap; font-family: inherit; line-height: 1.5;">${resumo}</pre>`;
    resumoModal.style.display = "block";
  }

  window.resumoVistoria = resumo;
}

// === Fecha modal do resumo ===
function fecharResumo() {
  const resumoModal = document.getElementById("resumoModal");
  if (resumoModal) resumoModal.style.display = "none";
}

// === Envia o resumo via WhatsApp ===
function enviarWhatsApp() {
  if (!window.resumoVistoria) gerarResumo();

  const numero = prompt("Digite o número do WhatsApp (código do país, sem espaços): Ex: 5511999999999");

  if (!numero) return;

  const mensagem = encodeURIComponent(window.resumoVistoria);
  const url = `https://api.whatsapp.com/send/?phone=${numero}&text=${mensagem}&type=phone_number&app_absent=0`;

  window.open(url, "_blank");
}

// === Eventos ===
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("vistoriaForm");
  if (form) {
    form.addEventListener("input", atualizarProgresso);
  }

  const btnGerarResumo = document.getElementById("btnGerarResumo");
  if (btnGerarResumo) {
    btnGerarResumo.addEventListener("click", e => {
      e.preventDefault();
      gerarResumo();
    });
  }

  const btnEnviarWhatsapp = document.getElementById("btnEnviarWhatsapp");
  if (btnEnviarWhatsapp) {
    btnEnviarWhatsapp.addEventListener("click", e => {
      e.preventDefault();
      enviarWhatsApp();
    });
  }

  const btnFecharResumo = document.getElementById("btnFecharResumo");
  if (btnFecharResumo) {
    btnFecharResumo.addEventListener("click", fecharResumo);
  }

  atualizarProgresso();
});
