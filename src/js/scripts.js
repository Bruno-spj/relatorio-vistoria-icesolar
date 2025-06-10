// Variáveis globais para armazenar fotos
let fotosVistoria = [];

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

// Função para processar upload de fotos
function processarFotos(input) {
  const files = Array.from(input.files);
  fotosVistoria = []; // Limpar fotos anteriores
  
  if (files.length === 0) return;

  // Criar preview das fotos
  const previewContainer = document.createElement('div');
  previewContainer.className = 'fotos-preview';
  previewContainer.innerHTML = '<h4>📸 Fotos Selecionadas:</h4>';
  
  // Remover preview anterior se existir
  const previewExistente = input.parentElement.querySelector('.fotos-preview');
  if (previewExistente) {
    previewExistente.remove();
  }

  files.forEach((file, index) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        // Comprimir e redimensionar imagem
        comprimirImagem(e.target.result, file.name, (imagemComprimida) => {
          fotosVistoria.push({
            nome: file.name,
            dados: imagemComprimida,
            tamanho: file.size
          });

          // Criar preview
          const preview = document.createElement('div');
          preview.className = 'foto-preview-item';
          preview.innerHTML = `
            <img src="${imagemComprimida}" alt="${file.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; margin: 5px;">
            <small>${file.name}</small>
          `;
          previewContainer.appendChild(preview);
        });
      };
      
      reader.readAsDataURL(file);
    }
  });

  input.parentElement.appendChild(previewContainer);
  
  // Mostrar contador de fotos
  const contador = document.createElement('p');
  contador.innerHTML = `<strong>✅ ${files.length} foto(s) selecionada(s)</strong>`;
  contador.style.color = '#4CAF50';
  input.parentElement.appendChild(contador);
}

// Função para comprimir imagem
function comprimirImagem(src, nome, callback) {
  const img = new Image();
  img.onload = function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Definir tamanho máximo (reduzir para otimizar envio)
    const maxWidth = 800;
    const maxHeight = 600;
    
    let { width, height } = img;
    
    // Calcular novas dimensões mantendo proporção
    if (width > height) {
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Desenhar imagem redimensionada
    ctx.drawImage(img, 0, 0, width, height);
    
    // Converter para base64 com qualidade reduzida
    const imagemComprimida = canvas.toDataURL('image/jpeg', 0.7);
    callback(imagemComprimida);
  };
  
  img.src = src;
}

// Adicionar listeners para atualizar progresso
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("vistoriaForm");
  form.addEventListener("input", atualizarProgresso);
  form.addEventListener("change", atualizarProgresso);
  
  // Adicionar listener para upload de fotos
  const fotoInput = document.querySelector('input[name="fotos_vistoria"]');
  if (fotoInput) {
    fotoInput.addEventListener('change', function() {
      processarFotos(this);
    });
  }
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
• Existe espaço suficiente para instalação (Modulos): ${formData.get("espaco_modulos") || "Não informado"}
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

  // Adicionar fontes de sombra se existirem
  const fontesSombra = formData.getAll("fontes_sombra");
  if (fontesSombra.length > 0) {
    resumo += `• Tipos: ${fontesSombra.join(', ')}\n`;
  }

  // Adicionar grupo gerador se existir
  if (formData.get("grupo_gerador") === "sim") {
    resumo += `\n⚡ *GRUPO GERADOR*\n• Presente: Sim\n• Bitola: ${formData.get("bitola_gerador") || "N/I"}\n• Corrente: ${formData.get("corrente_gerador") || "N/I"}A\n`;
  }

  // Adicionar informações sobre fotos
  if (fotosVistoria.length > 0) {
    resumo += `\n📸 *FOTOS DA VISTORIA*\n• Quantity: ${fotosVistoria.length} foto(s)\n• Fotos: ${fotosVistoria.map(f => f.nome).join(', ')}\n`;
  }

  // Adicionar observações gerais
  const observacoes = formData.get("observacoes_gerais");
  if (observacoes) {
    resumo += `\n📋 *OBSERVAÇÕES GERAIS*\n${observacoes}\n`;
  }

  resumo += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🏢 *ICE SOLAR* - Vistoria Técnica Profissional\n📅 Relatório gerado em: ${new Date().toLocaleString("pt-BR")}`;

  // Mostrar no modal
  document.getElementById("resumoConteudo").innerHTML = `<pre style="white-space: pre-wrap; font-family: inherit; line-height: 1.5;">${resumo}</pre>`;
  document.getElementById("resumoModal").style.display = "block";

  // Salvar resumo globalmente
  window.resumoVistoria = resumo;
}

function fecharResumo() {
  document.getElementById("resumoModal").style.display = "none";
}

// Função para enviar via WhatsApp com fotos
function enviarWhatsApp() {
  if (!window.resumoVistoria) {
    gerarResumo(); // Gera o resumo se ainda não existir
  }

  const numero = prompt(
    "Digite o número do WhatsApp (com código do país, sem espaços):\nExemplo: 5511999999999"
  );

  if (numero) {
    // Enviar texto primeiro
    const mensagem = encodeURIComponent(window.resumoVistoria);
    const url = `https://api.whatsapp.com/send/?phone=${numero}&text=${mensagem}&type=phone_number&app_absent=0`;
    
    // Abrir WhatsApp com o texto
    window.open(url, "_blank");
    
    // Se houver fotos, mostrar instruções para envio
    if (fotosVistoria.length > 0) {
      setTimeout(() => {
        mostrarModalFotos(numero);
      }, 2000);
    }
  }
}

// Função para mostrar modal com fotos para envio
function mostrarModalFotos(numero) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;
  
  const conteudo = document.createElement('div');
  conteudo.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 90%;
    max-height: 90%;
    overflow-y: auto;
  `;
  
  let htmlFotos = `
    <h3>📸 Envio de Fotos - WhatsApp</h3>
    <p>O texto foi enviado! Agora clique nas fotos abaixo para baixá-las e envie manualmente no WhatsApp:</p>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
  `;
  
  fotosVistoria.forEach((foto, index) => {
    htmlFotos += `
      <div style="text-align: center; border: 1px solid #ddd; padding: 10px; border-radius: 8px;">
        <img src="${foto.dados}" alt="${foto.nome}" style="width: 100%; max-width: 200px; height: 150px; object-fit: cover; border-radius: 5px;">
        <p style="margin: 10px 0 5px 0; font-size: 12px;">${foto.nome}</p>
        <button onclick="baixarFoto('${foto.dados}', '${foto.nome}')" style="background: #25D366; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">
          📥 Baixar
        </button>
      </div>
    `;
  });
  
  // Função global para fechar modal
  window.fecharModalFotos = function() {
    document.body.removeChild(modal);
  };
}

// Função para baixar foto individual
function baixarFoto(dadosBase64, nome) {
  const link = document.createElement('a');
  link.href = dadosBase64;
  link.download = nome;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Função para abrir WhatsApp para envio sequencial de fotos
function enviarFotosSequencial(numero) {
  const mensagemFotos = encodeURIComponent(`📸 Fotos da Vistoria - ${fotosVistoria.length} imagens anexas`);
  const url = `https://api.whatsapp.com/send/?phone=${numero}&text=${mensagemFotos}&type=phone_number&app_absent=0`;
  window.open(url, "_blank");
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