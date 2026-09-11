import { Order, BrevoSettings } from '../types/store';

export const DEFAULT_BREVO_SETTINGS: BrevoSettings = {
  apiKey: import.meta.env.VITE_BREVO_API_KEY || '',
  senderEmail: import.meta.env.VITE_BREVO_SENDER_EMAIL || 'vyrosocks@gmail.com',
  senderName: import.meta.env.VITE_BREVO_SENDER_NAME || 'VYRO Store',
  enabled: true,
};

interface SendEmailParams {
  apiKey?: string;
  senderEmail?: string;
  senderName?: string;
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
}

/**
 * Envia um email transacional através da API v3 da Brevo.
 * Tenta primeiro através do proxy de desenvolvimento (/api/brevo) e fallback direto para a API da Brevo.
 */
export async function sendBrevoEmail(params: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = params.apiKey || DEFAULT_BREVO_SETTINGS.apiKey;
  const senderEmail = params.senderEmail || DEFAULT_BREVO_SETTINGS.senderEmail;
  const senderName = params.senderName || DEFAULT_BREVO_SETTINGS.senderName;

  if (!apiKey || !params.toEmail) {
    console.warn('[Brevo] Envio abortado: Chave API ou email de destino não configurados.');
    return { success: false, error: 'Chave API ou email do destinatário em falta' };
  }

  const payload = {
    sender: {
      name: senderName,
      email: senderEmail,
    },
    to: [
      {
        email: params.toEmail,
        name: params.toName || params.toEmail.split('@')[0],
      },
    ],
    subject: params.subject,
    htmlContent: params.htmlContent,
  };

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'api-key': apiKey,
  };

  // 1. Tentar via proxy do Vite / backend endpoint
  try {
    const proxyResponse = await fetch('/api/brevo/smtp/email', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (proxyResponse.ok) {
      const data = await proxyResponse.json();
      console.log('[Brevo] Email enviado com sucesso via proxy:', data);
      return { success: true, messageId: data.messageId };
    }

    // Se o proxy retornar erro 404 (ex: em produção sem proxy), tenta direto
    if (proxyResponse.status !== 404) {
      const errData = await proxyResponse.json().catch(() => ({}));
      console.error('[Brevo] Erro na API Brevo (proxy):', errData);
      return { success: false, error: errData.message || `Erro ${proxyResponse.status}` };
    }
  } catch (err: any) {
    console.warn('[Brevo] Falha ao tentar enviar por proxy local, tentando endpoint direto...', err);
  }

  // 2. Fallback direto para o endpoint oficial da Brevo
  try {
    const directResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (directResponse.ok) {
      const data = await directResponse.json();
      console.log('[Brevo] Email enviado com sucesso diretamente:', data);
      return { success: true, messageId: data.messageId };
    }

    const errData = await directResponse.json().catch(() => ({}));
    console.error('[Brevo] Erro na API Brevo direta:', errData);
    return { success: false, error: errData.message || `Erro ${directResponse.status}` };
  } catch (err: any) {
    console.error('[Brevo] Falha de rede ao conectar à API da Brevo:', err);
    return { success: false, error: err.message || 'Erro de rede' };
  }
}

/**
 * Template base de email com branding premium VYRO
 */
function wrapEmailTemplate(title: string, preheader: string, contentHtml: string): string {
  return `
  <!DOCTYPE html>
  <html lang="pt">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body { margin: 0; padding: 0; background-color: #0c0d0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6; }
      .wrapper { max-width: 600px; margin: 0 auto; background-color: #121417; border-radius: 16px; overflow: hidden; border: 1px solid #23272f; margin-top: 24px; margin-bottom: 24px; }
      .header { background: linear-gradient(180deg, #181c24 0%, #121417 100%); padding: 32px 28px; text-align: center; border-bottom: 1px solid #23272f; }
      .logo { font-size: 26px; font-weight: 900; letter-spacing: 3px; color: #ffffff; text-decoration: none; display: inline-block; }
      .logo span { color: #00f2fe; }
      .badge { display: inline-block; padding: 4px 12px; background: rgba(0, 242, 254, 0.12); color: #00f2fe; border: 1px solid rgba(0, 242, 254, 0.3); border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 12px; }
      .content { padding: 32px 28px; }
      h1 { font-size: 22px; font-weight: 700; color: #ffffff; margin: 0 0 12px 0; }
      p { font-size: 14px; line-height: 1.6; color: #9ca3af; margin: 0 0 16px 0; }
      .order-box { background-color: #1a1e26; border-radius: 12px; border: 1px solid #282f3c; padding: 20px; margin: 24px 0; }
      .item-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #262c37; font-size: 13px; }
      .item-row:last-child { border-bottom: none; }
      .total-row { display: flex; justify-content: space-between; padding-top: 14px; font-size: 16px; font-weight: bold; color: #ffffff; border-top: 1px solid #323b49; }
      .tracking-card { background: linear-gradient(135deg, rgba(0, 242, 254, 0.08) 0%, rgba(2, 132, 199, 0.05) 100%); border: 1px solid rgba(0, 242, 254, 0.3); border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
      .tracking-code { font-family: monospace; font-size: 20px; font-weight: 800; letter-spacing: 2px; color: #00f2fe; background: #0c0d0e; padding: 10px 20px; border-radius: 8px; display: inline-block; margin: 12px 0; border: 1px dashed rgba(0, 242, 254, 0.4); }
      .button { display: inline-block; background: #00f2fe; color: #000000 !important; font-weight: 700; font-size: 13px; padding: 12px 28px; border-radius: 9999px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 14px rgba(0, 242, 254, 0.3); }
      .footer { background-color: #0d0f12; padding: 24px 28px; text-align: center; border-top: 1px solid #23272f; font-size: 12px; color: #6b7280; }
    </style>
  </head>
  <body>
    <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
      ${preheader}
    </div>
    <div class="wrapper">
      <div class="header">
        <div class="logo">VYRO<span>.</span></div>
        <div><span class="badge">Performance Engineered</span></div>
      </div>
      <div class="content">
        ${contentHtml}
      </div>
      <div class="footer">
        <p style="margin-bottom: 8px; color: #9ca3af;">VYRO Athletic Socks • Engenharia de Meias Técnicas</p>
        <p style="margin: 0; font-size: 11px;">Se tiveres alguma dúvida sobre o teu pedido, responde a este email ou contacta <a href="mailto:vyrosocks@gmail.com" style="color:#00f2fe; text-decoration:none;">vyrosocks@gmail.com</a></p>
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Envia email de confirmação quando uma encomenda é criada
 */
export async function sendOrderConfirmationEmail(order: Order, settings?: BrevoSettings) {
  if (settings && !settings.enabled) return;

  const itemsHtml = order.items
    .map(
      (item) => `
      <div style="padding: 10px 0; border-bottom: 1px solid #282f3c; display: table; width: 100%;">
        <div style="display: table-cell; vertical-align: middle; color: #f3f4f6; font-size: 13px;">
          <strong>${item.productName}</strong><br>
          <span style="color: #9ca3af; font-size: 11px;">Tamanho: ${item.size} • Cor: ${item.colorName} • Qtd: ${item.quantity}</span>
        </div>
        <div style="display: table-cell; vertical-align: middle; text-align: right; color: #ffffff; font-weight: bold; font-size: 13px;">
          €${(item.price * item.quantity).toFixed(2)}
        </div>
      </div>
    `
    )
    .join('');

  const contentHtml = `
    <h1>Encomenda Confirmada! 🎉</h1>
    <p>Olá <strong>${order.customerName}</strong>,</p>
    <p>Recebemos o teu pedido com sucesso e já está a ser processado pela nossa equipa de expedição. Abaixo tens todos os detalhes da tua encomenda.</p>
    
    <div class="order-box">
      <div style="display: table; width: 100%; margin-bottom: 16px; border-bottom: 1px solid #282f3c; padding-bottom: 10px;">
        <div style="display: table-cell; color: #9ca3af; font-size: 12px;">
          Nº Encomenda: <strong style="color: #00f2fe;">${order.id}</strong><br>
          Data: <span style="color: #ffffff;">${new Date(order.createdAt).toLocaleDateString('pt-PT')}</span>
        </div>
        <div style="display: table-cell; text-align: right; color: #9ca3af; font-size: 12px;">
          Estado: <strong style="color: #10b981;">✓ ${order.status}</strong><br>
          Pagamento: <span style="color: #ffffff; text-transform: uppercase;">${order.paymentMethod}</span>
        </div>
      </div>

      <div style="margin: 14px 0;">
        ${itemsHtml}
      </div>

      <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #374151; display: table; width: 100%;">
        <div style="display: table-cell; font-size: 15px; font-weight: bold; color: #ffffff;">
          Total Pago:
        </div>
        <div style="display: table-cell; text-align: right; font-size: 18px; font-weight: 800; color: #00f2fe;">
          €${order.totalAmount.toFixed(2)}
        </div>
      </div>
    </div>

    <p style="font-size: 13px; color: #9ca3af;">
      Assim que a tua encomenda for expedida com a transportadora, receberás um novo email com o código de rastreio para seguires a entrega em tempo real.
    </p>
  `;

  const html = wrapEmailTemplate(
    `Confirmação da Encomenda ${order.id} - VYRO`,
    `A tua encomenda ${order.id} na VYRO foi confirmada com sucesso!`,
    contentHtml
  );

  return sendBrevoEmail({
    apiKey: settings?.apiKey,
    senderEmail: settings?.senderEmail,
    senderName: settings?.senderName,
    toEmail: order.customerEmail,
    toName: order.customerName,
    subject: `Encomenda Confirmada #${order.id} - VYRO Store`,
    htmlContent: html,
  });
}

/**
 * Envia email sempre que o estado da encomenda é alterado
 */
export async function sendOrderStatusUpdateEmail(
  order: Order,
  newStatus: Order['status'],
  settings?: BrevoSettings
) {
  if (settings && !settings.enabled) return;

  let statusTitle = `Atualização da tua Encomenda ${order.id}`;
  let statusBadge = newStatus;
  let statusDescription = '';
  let trackingSection = '';

  switch (newStatus) {
    case 'Em Preparação':
      statusTitle = `A tua encomenda está em preparação! ⏳`;
      statusDescription = `A nossa equipa já está a separar e a embalar os teus artigos VYRO com todo o cuidado no centro logístico.`;
      break;

    case 'Enviado - aguarda tracking':
      statusTitle = `A tua encomenda foi enviada! 🚚`;
      statusDescription = `O teu pedido já foi despachado para a transportadora. Estamos a aguardar a geração do código de seguimento pelo operador logístico e atualizaremos a tua encomenda muito em breve.`;
      break;

    case 'Enviado - com tracking':
      statusTitle = `A tua encomenda está a caminho! 📦`;
      statusDescription = `O teu pedido já está em trânsito com a transportadora. Podes acompanhar a entrega passo a passo através do código de rastreio abaixo.`;
      
      const carrierText = order.trackingCarrier ? `Transportadora: <strong>${order.trackingCarrier}</strong><br>` : '';
      const trackingCode = order.trackingNumber || 'Disponível na tua conta';
      const trackingLink = order.trackingUrl || '#';

      trackingSection = `
        <div class="tracking-card">
          <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af;">
            ${carrierText}Código de Envio / Rastreio
          </p>
          <div class="tracking-code">${trackingCode}</div>
          ${order.trackingUrl ? `
            <div style="margin-top: 14px;">
              <a href="${trackingLink}" target="_blank" class="button">
                Seguir Entrega da Encomenda &rarr;
              </a>
            </div>
          ` : ''}
        </div>
      `;
      break;

    case 'Concluído':
      statusTitle = `Encomenda Concluída! 🏁`;
      statusDescription = `A tua encomenda foi marcada como entregue e concluída. Esperamos que desfrutes do conforto e performance das tuas meias VYRO em cada treino!`;
      break;

    case 'Cancelado':
      statusTitle = `Encomenda Cancelada`;
      statusDescription = `Informamos que o pedido ${order.id} foi cancelado. Se precisares de mais informações ou de apoio, responde diretamente a esta mensagem.`;
      break;

    case 'Pago':
    default:
      statusTitle = `Pagamento Confirmado! ✓`;
      statusDescription = `O pagamento da tua encomenda foi verificado com sucesso. Estamos a preparar os teus artigos para envio.`;
      break;
  }

  const contentHtml = `
    <h1>${statusTitle}</h1>
    <p>Olá <strong>${order.customerName}</strong>,</p>
    <p>${statusDescription}</p>

    ${trackingSection}

    <div class="order-box">
      <div style="font-size: 12px; color: #9ca3af; margin-bottom: 8px;">
        Resumo do Pedido: <strong style="color: #ffffff;">${order.id}</strong> • Total: <strong style="color: #00f2fe;">€${order.totalAmount.toFixed(2)}</strong>
      </div>
      <div style="font-size: 12px; color: #9ca3af;">
        Novo Estado: <strong style="color: #00f2fe;">${statusBadge}</strong>
      </div>
    </div>

    <p style="font-size: 12px; color: #6b7280; margin-top: 24px;">
      Podes também verificar o histórico e detalhes atualizados da tua encomenda entrando na tua área de cliente no site da VYRO.
    </p>
  `;

  const html = wrapEmailTemplate(
    `${statusTitle} - VYRO Store`,
    `A tua encomenda ${order.id} foi atualizada para o estado: ${newStatus}`,
    contentHtml
  );

  return sendBrevoEmail({
    apiKey: settings?.apiKey,
    senderEmail: settings?.senderEmail,
    senderName: settings?.senderName,
    toEmail: order.customerEmail,
    toName: order.customerName,
    subject: `${statusTitle} #${order.id} - VYRO Store`,
    htmlContent: html,
  });
}

/**
 * Envia email de teste para verificar a conectividade com a Brevo
 */
export async function testBrevoEmail(settings: BrevoSettings, testRecipientEmail: string) {
  const html = wrapEmailTemplate(
    'Teste de Conexão Brevo - VYRO Store',
    'A tua integração com a Brevo está a funcionar a 100%!',
    `
      <h1>Integração Brevo Operacional! 🚀</h1>
      <p>Este é um email de teste enviado a partir do Backoffice da <strong>VYRO Store</strong>.</p>
      <div class="order-box">
        <p style="margin: 0; color: #10b981; font-weight: bold;">✓ Chave de API v3 validada com sucesso</p>
        <p style="margin: 6px 0 0 0; color: #9ca3af; font-size: 12px;">Remetente Configurado: <strong>${settings.senderName}</strong> &lt;${settings.senderEmail}&gt;</p>
      </div>
      <p style="font-size: 13px; color: #9ca3af;">
        A partir de agora, os teus clientes receberão emails automáticos no ato da compra e sempre que atualizares o estado de qualquer encomenda.
      </p>
    `
  );

  return sendBrevoEmail({
    apiKey: settings.apiKey,
    senderEmail: settings.senderEmail,
    senderName: settings.senderName,
    toEmail: testRecipientEmail,
    subject: `[Teste de Sucesso] Integração de Email Brevo - VYRO Store`,
    htmlContent: html,
  });
}
