
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  agentsAPI,
  aiModelsAPI,
  aiVectorsAPI,
  guardrailsAPI,
  guardrailRulesAPI,
  integratorsAPI,
  marketPlacesAPI,
  agentGuardrailMapAPI,
  agentIntegratorMapAPI,
  guardrailRuleMapAPI,
} from '@/services/api';

// Agents hooks
export const useAgents = (params?: { agent_id?: number; agent_name?: string; is_active?: boolean }) =>
  useQuery({
    queryKey: ['agents', params],
    queryFn: () => agentsAPI.get(params || {}),
  });

export const useCreateAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: agentsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
};

export const useUpdateAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: agentsAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
};

export const useDeleteAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: agentsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
};

// AI Models hooks
export const useAiModels = (params?: { aimodel_id?: number; aimodel_name?: string; is_active?: boolean }) =>
  useQuery({
    queryKey: ['aimodels', params],
    queryFn: () => aiModelsAPI.get(params || {}),
  });

export const useCreateAiModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: aiModelsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aimodels'] });
    },
  });
};

export const useUpdateAiModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: aiModelsAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aimodels'] });
    },
  });
};

export const useDeleteAiModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: aiModelsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aimodels'] });
    },
  });
};

// AI Vectors hooks
export const useAiVectors = (params?: { aivector_id?: number; aivector_name?: string; is_active?: boolean }) =>
  useQuery({
    queryKey: ['aivectors', params],
    queryFn: () => aiVectorsAPI.get(params || {}),
  });

export const useCreateAiVector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: aiVectorsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aivectors'] });
    },
  });
};

export const useUpdateAiVector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: aiVectorsAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aivectors'] });
    },
  });
};

export const useDeleteAiVector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: aiVectorsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aivectors'] });
    },
  });
};

// Guardrails hooks
export const useGuardrails = (params?: { guardrail_id?: number; guardrail_name?: string; is_active?: boolean }) =>
  useQuery({
    queryKey: ['guardrails', params],
    queryFn: () => guardrailsAPI.get(params || {}),
  });

export const useCreateGuardrail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardrailsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardrails'] });
    },
  });
};

export const useUpdateGuardrail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardrailsAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardrails'] });
    },
  });
};

export const useDeleteGuardrail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardrailsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardrails'] });
    },
  });
};

// Guardrail Rules hooks
export const useGuardrailRules = (params?: { guardrail_rule_id?: number; guardrail_rule_name?: string; is_active?: boolean }) =>
  useQuery({
    queryKey: ['guardrail-rules', params],
    queryFn: () => guardrailRulesAPI.get(params || {}),
  });

export const useCreateGuardrailRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardrailRulesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardrail-rules'] });
    },
  });
};

export const useUpdateGuardrailRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardrailRulesAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardrail-rules'] });
    },
  });
};

export const useDeleteGuardrailRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardrailRulesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardrail-rules'] });
    },
  });
};

// Integrators hooks
export const useIntegrators = (params?: { integrator_id?: number; integrator_name?: string; is_active?: boolean }) =>
  useQuery({
    queryKey: ['integrators', params],
    queryFn: () => integratorsAPI.get(params || {}),
  });

export const useCreateIntegrator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: integratorsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrators'] });
    },
  });
};

export const useUpdateIntegrator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: integratorsAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrators'] });
    },
  });
};

export const useDeleteIntegrator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: integratorsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrators'] });
    },
  });
};

// Market Places hooks
export const useMarketPlaces = () =>
  useQuery({
    queryKey: ['market-places'],
    queryFn: marketPlacesAPI.get,
  });

// Mapping hooks
export const useAgentGuardrailMap = (params: { agent_id?: number; guardrail_id?: number; is_active?: boolean }) =>
  useQuery({
    queryKey: ['agent-guardrail-map', params],
    queryFn: () => agentGuardrailMapAPI.get(params),
  });

export const useCreateAgentGuardrailMap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: agentGuardrailMapAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-guardrail-map'] });
    },
  });
};

export const useAgentIntegratorMap = (params: { agent_id?: number; integrator_id?: number; is_active?: boolean }) =>
  useQuery({
    queryKey: ['agent-integrator-map', params],
    queryFn: () => agentIntegratorMapAPI.get(params),
  });

export const useCreateAgentIntegratorMap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: agentIntegratorMapAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-integrator-map'] });
    },
  });
};

export const useGuardrailRuleMap = (params: { guardrail_id?: number; guardrail_rule_id?: number; is_active?: boolean }) =>
  useQuery({
    queryKey: ['guardrail-rule-map', params],
    queryFn: () => guardrailRuleMapAPI.get(params),
  });

export const useCreateGuardrailRuleMap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardrailRuleMapAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardrail-rule-map'] });
    },
  });
};
