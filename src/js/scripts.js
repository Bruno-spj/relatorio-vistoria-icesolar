// Atualizar barra de progresso
function atualizarProgresso() {
  const form = document.getElementById("vistoriaForm");
  const inputs = form.querySelectorAll("input[required], select[required]");
  let preenchidos = 0;

  inputs.forEach((input) => {
    if (input.type === "radio") {
      const radioGroup = form.querySelectorAll(`input[name="${input.name}"]`);
      const isChecked = Array.from(radioGroup).some((radio) => radio.checked);
      if (isChecked) preenchidos++;
    } else if (input.value.trim() !== "") {
      preenchidos++;
    }
  });

  const porcentagem = (preenchidos / inputs.length) * 100;
  document.getElementById("progressFill").style.width = porcentagem + "%";
}

// Adicionar listeners para atualizar progresso
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("vistoriaForm");
  form.addEventListener("input", atualizarProgresso);
  form.addEventListener("change", atualizarProgresso);
});

function gerarResumo() {
  const form = document.getElementById("vistoriaForm");
  const formData = new FormData(form);

  let resumo = `
      🏠 *RELATÓRIO DE VISTORIA TÉCNICA - ICE SOLAR*
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
      • Consultor Técnico: ${
        formData.get("consultor_tecnico") || "Não informado"
      }
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
      • Corrente disjuntor PDE: ${
        formData.get("corrente_disjuntor_pde") || "Não informado"
      }A

      🔌 *QUADRO GERAL (QGBT)*
      • Corrente do disjuntor: ${
        formData.get("qgbt_corrente_disjuntor") || "Não informado"
      }A
      • Bitola dos condutores: ${
        formData.get("qgbt_bitola_condutores") || "Não informado"
      }mm²
      • Espaço disponível: ${formData.get("qgbt_espaco") || "Não informado"}
      • Localização: ${formData.get("qgbt_localizacao") || "Não informado"}

      🔧 *INVERSOR E STRING BOX*
      • Localização sugerida: ${
        formData.get("inversor_localizacao") || "Não informado"
      }
      • Internet no local: ${formData.get("internet_local") || "Não informado"}

      📏 *DISTÂNCIAS*
      • Painéis ↔ Inversor: ${formData.get("dist_paineis_inversor") || "N/I"}m
      • Inversor ↔ QGBT: ${formData.get("dist_inversor_qgbt") || "N/I"}m
      • Inversor ↔ PDE: ${formData.get("dist_inversor_pde") || "N/I"}m
      • QGBT ↔ PDE: ${formData.get("dist_qgbt_pde") || "N/I"}m

      🏠 *CONDIÇÕES DO TELHADO*
      • Tipo de telha: ${formData.get("tipo_telha") || "Não informado"}
      • Tipo de telhado: ${formData.get("tipo_telhado") || "Não informado"}
      • Precisa manutenção: ${
        formData.get("telhado_manutencao") || "Não informado"
      }
      • Telhas quebradas: ${formData.get("telhas_quebradas") || "Não informado"}
      
      🏗️ *ESTRUTURA*
      • Tipo de estrutura: ${
        formData.get("estrutura_telhado") || "Não informado"
      }
      • Fissuras na alvenaria: ${formData.get("fissuras") || "Não informado"}
      • Presença de cupim: ${formData.get("cupim") || "Não informado"}
      • Infiltração: ${formData.get("infiltracao") || "Não informado"}

      🌳 *SOMBREAMENTOS*
      • Fontes de sombreamento: ${
        formData.get("sombreamento") || "Não informado"
      }
      `;

  // Adicionar fontes de sombra se existirem
  const fontesSombra = formData.getAll("fontes_sombra");
  if (fontesSombra.length > 0) {
    resumo += `• Tipos: ${fontes} Sombra.join(', ')}\n`;
  }

  // Adicionar grupo gerador se existir
  if (formData.get("grupo_gerador") === "sim") {
    resumo += `\n⚡ *GRUPO GERADOR*\n• Presente: Sim\n• Bitola: ${
      formData.get("bitola_gerador") || "N/I"
    }\n• Corrente: ${formData.get("corrente_gerador") || "N/I"}A\n`;
  }

  // Adicionar observações gerais
  const observacoes = formData.get("observacoes_gerais");
  if (observacoes) {
    resumo += `\n📋 *OBSERVAÇÕES GERAIS*\n${observacoes}\n`;
  }

  resumo += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🏢 *ICE SOLAR* - Vistoria Técnica Profissional\n📅 Relatório gerado em: ${new Date().toLocaleString(
    "pt-BR"
  )}`;

  // Mostrar no modal
  document.getElementById(
    "resumoConteudo"
  ).innerHTML = `<pre style="white-space: pre-wrap; font-family: inherit; line-height: 1.5;">${resumo}</pre>`;
  document.getElementById("resumoModal").style.display = "block";

  // Salvar resumo globalmente
  window.resumoVistoria = resumo;
}

function fecharResumo() {
  document.getElementById("resumoModal").style.display = "none";
}

function enviarWhatsApp() {
  if (!window.resumoVistoria) {
    gerarResumo(); // Gera o resumo se ainda não existir
  }

  const numero = prompt(
    "Digite o número do WhatsApp (com código do país, sem espaços):\nExemplo: 5511999999999"
  );

  if (numero) {
    const mensagem = encodeURIComponent(window.resumoVistoria);
    const url = `https://api.whatsapp.com/send/?phone=${numero}&text=${mensagem}&type=phone_number&app_absent=0`;
    window.open(url, "_blank");
  }
}
// Fechar modal ao clicar fora
document.getElementById("resumoModal").addEventListener("click", function (e) {
  if (e.target === this) {
    fecharResumo();
  }
});

// Adicionar máscara para números de telefone
document.addEventListener("DOMContentLoaded", function () {
  const contatoInput = document.querySelector('input[name="cliente_contato"]');
  if (contatoInput) {
    contatoInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      }
      if (value.length === 14) {
        e.target.value = value;
      }
    });
  }
});
