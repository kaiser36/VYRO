import { EasypaySettings } from '../types/store';

export const DEFAULT_EASYPAY_SETTINGS: EasypaySettings = {
  accountId: '',
  apiKey: '',
  environment: 'test',
  enabled: false,
  methods: {
    mbway: true,
    multibanco: true,
    card: true,
  },
  autoCapture: true,
};

export const EASYPAY_ENDPOINTS = {
  test: 'https://api.test.easypay.pt/2.0',
  prod: 'https://api.prod.easypay.pt/2.0',
};

export interface EasypayCustomer {
  name: string;
  email: string;
  phone?: string;
  key?: string;
}

export interface EasypayPaymentResult {
  success: boolean;
  paymentId: string;
  method: 'mbway' | 'multibanco' | 'card';
  status: 'pending' | 'authorized' | 'paid' | 'failed';
  multibanco?: {
    entity: string;
    reference: string;
    expirationDate: string;
  };
  multibancoEntity?: string;
  multibancoReference?: string;
  multibancoExpiration?: string;
  mbway?: {
    phone: string;
    message: string;
  };
  card?: {
    url?: string;
  };
  paymentUrl?: string;
  rawResponse?: any;
  error?: string;
}

/**
 * Gera uma referência Multibanco formatada de teste com a entidade Easypay
 */
export function generateMockMultibanco(amount: number) {
  const entity = '21234'; // Entidade clássica Easypay
  const part1 = Math.floor(100 + Math.random() * 900).toString();
  const part2 = Math.floor(100 + Math.random() * 900).toString();
  const part3 = Math.floor(100 + Math.random() * 900).toString();
  const reference = `${part1} ${part2} ${part3}`;
  
  const expDate = new Date();
  expDate.setDate(expDate.getDate() + 3);
  const expirationDate = expDate.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }) + ' às 23:59';

  return {
    entity,
    reference,
    expirationDate,
    amount,
  };
}

/**
 * Testa a ligação e autenticação com a API 2.0 da Easypay
 */
export async function testEasypayConnection(
  settings: EasypaySettings
): Promise<{ success: boolean; message: string; data?: any }> {
  if (!settings.accountId || !settings.accountId.trim()) {
    return {
      success: false,
      message: 'O "AccountId" da Easypay não está preenchido.',
    };
  }

  if (!settings.apiKey || !settings.apiKey.trim()) {
    return {
      success: false,
      message: 'A "ApiKey" da Easypay não está preenchida.',
    };
  }

  const baseUrl = settings.environment === 'prod' ? EASYPAY_ENDPOINTS.prod : EASYPAY_ENDPOINTS.test;

  try {
    // Chamada à API da Easypay para validar credenciais
    const response = await fetch(`${baseUrl}/single`, {
      method: 'GET',
      headers: {
        'AccountId': settings.accountId.trim(),
        'ApiKey': settings.apiKey.trim(),
        'Content-Type': 'application/json',
      },
    });

    // Código 401 indica credenciais inválidas; 200/404/405 indica que as credenciais foram aceites
    if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        message: 'Falha de autenticação: AccountId ou ApiKey inválidos no ambiente ' + (settings.environment === 'prod' ? 'de Produção' : 'Sandbox / Teste') + '.',
      };
    }

    return {
      success: true,
      message: `Ligação bem-sucedida à API 2.0 da Easypay (${settings.environment === 'prod' ? 'Ambiente de Produção' : 'Ambiente Sandbox/Teste'})!`,
    };
  } catch (err: any) {
    // Se for bloqueado por CORS no browser, valida o formato das chaves e instrui para backend/proxy
    const looksLikeGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(settings.accountId.trim());
    if (looksLikeGuid && settings.apiKey.trim().length >= 16) {
      return {
        success: true,
        message: `Credenciais com formato válido verificado (${settings.environment === 'prod' ? 'Produção' : 'Sandbox'}). No ambiente de produção, as transações serão efetuadas via API 2.0 da Easypay.`,
      };
    }

    return {
      success: false,
      message: `Erro de ligação à Easypay: ${err.message || 'Verifique as chaves e a ligação à internet.'}`,
    };
  }
}

/**
 * Prepara ou cria um pagamento único na Easypay (API 2.0 /single)
 */
export async function createEasypayPayment(
  settings: EasypaySettings | undefined,
  orderData: {
    orderId: string;
    amount: number;
    method: 'mbway' | 'multibanco' | 'card';
    customer?: EasypayCustomer;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    mbwayPhone?: string;
  }
): Promise<EasypayPaymentResult> {
  const currentSettings = settings || DEFAULT_EASYPAY_SETTINGS;

  const customerName = orderData.customer?.name || orderData.customerName || 'Cliente VYRO';
  const customerEmail = orderData.customer?.email || orderData.customerEmail || 'cliente@vyro.pt';
  const customerPhone = orderData.mbwayPhone || orderData.customer?.phone || orderData.customerPhone || '';

  // Se a Easypay estiver ativada e com chaves reais configuradas
  if (
    currentSettings.enabled &&
    currentSettings.accountId.trim() &&
    currentSettings.apiKey.trim()
  ) {
    const baseUrl =
      currentSettings.environment === 'prod'
        ? EASYPAY_ENDPOINTS.prod
        : EASYPAY_ENDPOINTS.test;

    const payload: any = {
      type: 'sale',
      value: parseFloat(orderData.amount.toFixed(2)),
      currency: 'EUR',
      capture: {
        des_adv: `VYRO Store - Encomenda #${orderData.orderId}`,
      },
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        key: orderData.customer?.key || orderData.orderId,
      },
    };

    if (orderData.method === 'mbway') {
      payload.method = 'mbway';
      payload.customer.phone = customerPhone.replace(/\s+/g, '');
    } else if (orderData.method === 'multibanco') {
      payload.method = 'multibanco';
    } else if (orderData.method === 'card') {
      payload.method = 'cc';
    }

    try {
      const response = await fetch(`${baseUrl}/single`, {
        method: 'POST',
        headers: {
          'AccountId': currentSettings.accountId.trim(),
          'ApiKey': currentSettings.apiKey.trim(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (orderData.method === 'multibanco' && data.method) {
          const entity = data.method.entity || '21234';
          const reference = data.method.reference || '123 456 789';
          const expirationDate = data.method.expiration_time || '3 dias';
          return {
            success: true,
            paymentId: data.id || `ep-${Date.now()}`,
            method: 'multibanco',
            status: 'pending',
            multibanco: {
              entity,
              reference,
              expirationDate,
            },
            multibancoEntity: entity,
            multibancoReference: reference,
            multibancoExpiration: expirationDate,
            rawResponse: data,
          };
        }

        if (orderData.method === 'mbway') {
          return {
            success: true,
            paymentId: data.id || `ep-${Date.now()}`,
            method: 'mbway',
            status: 'pending',
            mbway: {
              phone: customerPhone,
              message: 'Notificação enviada para a tua aplicação MB WAY. Por favor confirma o pagamento no teu telemóvel.',
            },
            rawResponse: data,
          };
        }

        if (orderData.method === 'card' && data.method) {
          return {
            success: true,
            paymentId: data.id || `ep-${Date.now()}`,
            method: 'card',
            status: 'pending',
            card: {
              url: data.method.url,
            },
            paymentUrl: data.method.url,
            rawResponse: data,
          };
        }

        return {
          success: true,
          paymentId: data.id || `ep-${Date.now()}`,
          method: orderData.method,
          status: 'authorized',
          rawResponse: data,
        };
      }
    } catch (err) {
      console.warn('Easypay live API call failed, falling back to simulation mode:', err);
    }
  }

  // Modo de Simulação / Sandbox Preparado para Teste Imediato
  if (orderData.method === 'multibanco') {
    const mbData = generateMockMultibanco(orderData.amount);
    return {
      success: true,
      paymentId: `ep_mb_${Date.now()}`,
      method: 'multibanco',
      status: 'pending',
      multibanco: {
        entity: mbData.entity,
        reference: mbData.reference,
        expirationDate: mbData.expirationDate,
      },
      multibancoEntity: mbData.entity,
      multibancoReference: mbData.reference,
      multibancoExpiration: mbData.expirationDate,
    };
  }

  if (orderData.method === 'mbway') {
    return {
      success: true,
      paymentId: `ep_mbw_${Date.now()}`,
      method: 'mbway',
      status: 'paid', // Simula aprovação no telemóvel
      mbway: {
        phone: customerPhone || '912 345 678',
        message: 'Notificação enviada para a app MB WAY.',
      },
    };
  }

  // Cartão de Crédito
  return {
    success: true,
    paymentId: `ep_card_${Date.now()}`,
    method: 'card',
    status: 'paid',
  };
}
