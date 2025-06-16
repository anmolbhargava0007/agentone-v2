
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Generic API utility functions
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.msg || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
};

// Agent Guardrail Map APIs
export const agentGuardrailMapAPI = {
  create: (data: { agent_id: number; guardrail_ids: number[]; is_active: boolean }) =>
    apiRequest('/agent-guardrail-map', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  get: (params: { agent_id?: number; guardrail_id?: number; is_active?: boolean }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });
    return apiRequest(`/agent-guardrail-map?${queryParams}`);
  },
  
  delete: (id: number) =>
    apiRequest(`/agent-guardrail-map/${id}`, { method: 'DELETE' }),
};

// Agent Integrator Map APIs
export const agentIntegratorMapAPI = {
  create: (data: { agent_id: number; integrator_ids: number[]; is_active: boolean }) =>
    apiRequest('/agent-integrator-map', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  get: (params: { agent_id?: number; integrator_id?: number; is_active?: boolean }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });
    return apiRequest(`/agent-integrator-map?${queryParams}`);
  },
  
  delete: (id: number) =>
    apiRequest(`/agent-integrator-map/${id}`, { method: 'DELETE' }),
};

// Agents APIs
export const agentsAPI = {
  create: (data: {
    agent_name: string;
    descriptions: string;
    agents_status: string;
    aimodel_id: number;
    aivector_id: number;
    is_active: boolean;
  }) =>
    apiRequest('/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  get: (params: { agent_id?: number; agent_name?: string; is_active?: boolean }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });
    return apiRequest(`/agents?${queryParams}`);
  },
  
  update: (data: {
    agent_id: number;
    agent_name: string;
    descriptions: string;
    agents_status: string;
    aimodel_id: number;
    aivector_id: number;
    is_active: boolean;
  }) =>
    apiRequest('/agents', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest(`/agents/${id}`, { method: 'DELETE' }),
  
  checkDuplicate: (name: string) =>
    apiRequest(`/agents-isduplicate?agent_name=${encodeURIComponent(name)}`),
};

// AI Models APIs
export const aiModelsAPI = {
  create: (data: {
    aimodel_name: string;
    descriptions: string;
    provider_name: string;
    parameters: string;
    context_token: number;
    is_active: boolean;
  }) =>
    apiRequest('/aimodels', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  get: (params: { aimodel_id?: number; aimodel_name?: string; is_active?: boolean }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });
    return apiRequest(`/aimodels?${queryParams}`);
  },
  
  update: (data: {
    aimodel_id: number;
    aimodel_name: string;
    descriptions: string;
    provider_name: string;
    parameters: string;
    context_token: number;
    is_active: boolean;
  }) =>
    apiRequest('/aimodels', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest(`/aimodels/${id}`, { method: 'DELETE' }),
  
  checkDuplicate: (name: string) =>
    apiRequest(`/aimodels-isduplicate?aimodel_name=${encodeURIComponent(name)}`),
};

// AI Vectors APIs
export const aiVectorsAPI = {
  create: (data: {
    aivector_name: string;
    descriptions: string;
    is_active: boolean;
  }) =>
    apiRequest('/aivectors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  get: (params: { aivector_id?: number; aivector_name?: string; is_active?: boolean }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });
    return apiRequest(`/aivectors?${queryParams}`);
  },
  
  update: (data: {
    aivector_id: number;
    aivector_name: string;
    descriptions: string;
    is_active: boolean;
  }) =>
    apiRequest('/aivectors', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest(`/aivectors/${id}`, { method: 'DELETE' }),
  
  checkDuplicate: (name: string) =>
    apiRequest(`/aivectors-isduplicate?aivector_name=${encodeURIComponent(name)}`),
};

// Guardrail Rule Map APIs
export const guardrailRuleMapAPI = {
  create: (data: { guardrail_id: number; guardrail_rule_ids: number[]; is_active: boolean }) =>
    apiRequest('/guardrail-rule-map', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  get: (params: { guardrail_id?: number; guardrail_rule_id?: number; is_active?: boolean }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });
    return apiRequest(`/guardrail-rule-map?${queryParams}`);
  },
  
  delete: (id: number) =>
    apiRequest(`/guardrail-rule-map/${id}`, { method: 'DELETE' }),
};

// Guardrail Rules APIs
export const guardrailRulesAPI = {
  create: (data: {
    guardrail_rule_name: string;
    descriptions: string;
    conditions: string;
    actions: string;
    is_active: boolean;
  }) =>
    apiRequest('/guardrail-rules', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  get: (params: { guardrail_rule_id?: number; guardrail_rule_name?: string; is_active?: boolean }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });
    return apiRequest(`/guardrail-rules?${queryParams}`);
  },
  
  update: (data: {
    guardrail_rule_id: number;
    guardrail_rule_name: string;
    descriptions: string;
    conditions: string;
    actions: string;
    is_active: boolean;
  }) =>
    apiRequest('/guardrail-rules', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest(`/guardrail-rules/${id}`, { method: 'DELETE' }),
  
  checkDuplicate: (name: string) =>
    apiRequest(`/guardrail-rules-isduplicate?guardrail_rule_name=${encodeURIComponent(name)}`),
};

// Guardrails APIs
export const guardrailsAPI = {
  create: (data: {
    guardrail_name: string;
    descriptions: string;
    guardrail_type: string;
    is_active: boolean;
  }) =>
    apiRequest('/guardrails', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  get: (params: { guardrail_id?: number; guardrail_name?: string; is_active?: boolean }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });
    return apiRequest(`/guardrails?${queryParams}`);
  },
  
  update: (data: {
    guardrail_id: number;
    guardrail_name: string;
    descriptions: string;
    guardrail_type: string;
    is_active: boolean;
  }) =>
    apiRequest('/guardrails', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest(`/guardrails/${id}`, { method: 'DELETE' }),
  
  checkDuplicate: (name: string) =>
    apiRequest(`/guardrails-isduplicate?guardrail_name=${encodeURIComponent(name)}`),
};

// Integrators APIs
export const integratorsAPI = {
  create: (data: {
    integrator_name: string;
    descriptions: string;
    integrator_type: string;
    provider_name: string;
    auth_type: string;
    is_connected: boolean;
    icon_name: string;
    is_active: boolean;
  }) =>
    apiRequest('/integrators', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  get: (params: { integrator_id?: number; integrator_name?: string; is_active?: boolean }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });
    return apiRequest(`/integrators?${queryParams}`);
  },
  
  update: (data: {
    integrator_id: number;
    integrator_name: string;
    descriptions: string;
    integrator_type: string;
    provider_name: string;
    auth_type: string;
    is_connected: boolean;
    icon_name: string;
    is_active: boolean;
  }) =>
    apiRequest('/integrators', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest(`/integrators/${id}`, { method: 'DELETE' }),
  
  checkDuplicate: (name: string) =>
    apiRequest(`/integrators-isduplicate?integrator_name=${encodeURIComponent(name)}`),
};

// Market Places APIs
export const marketPlacesAPI = {
  get: () => apiRequest('/market-places'),
};
