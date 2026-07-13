import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiApi } from '@/lib/api';

export function useAiDashboard() {
    return useQuery({
        queryKey: ['ai', 'dashboard'],
        queryFn: async () => {
            const response = await aiApi.dashboard();
            return response.data;
        },
    });
}

export function useAIRoadmapMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const response = await aiApi.roadmap(payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai', 'dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['ai', 'roadmap', 'history'] });
        },
    });
}

export function useAIRoadmapHistory() {
    return useQuery({
        queryKey: ['ai', 'roadmap', 'history'],
        queryFn: async () => {
            const response = await aiApi.roadmapHistory();
            return response.data;
        },
    });
}

export function useAIDeleteRoadmapMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const response = await aiApi.deleteRoadmap(id);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai', 'roadmap', 'history'] });
            queryClient.invalidateQueries({ queryKey: ['ai', 'dashboard'] });
        },
    });
}


export function useAIExplainMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const response = await aiApi.explain(payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai', 'dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['ai', 'explain', 'history'] });
        },
    });
}

export function useAIExplainHistory() {
    return useQuery({
        queryKey: ['ai', 'explain', 'history'],
        queryFn: async () => {
            const response = await aiApi.explainHistory();
            return response.data;
        },
    });
}

export function useAIDeleteExplainMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const response = await aiApi.deleteExplain(id);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai', 'explain', 'history'] });
            queryClient.invalidateQueries({ queryKey: ['ai', 'dashboard'] });
        },
    });
}


export function useAIResumeReviewMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData) => {
            const response = await aiApi.resumeReview(formData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai', 'dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['ai', 'resume', 'history'] });
        },
    });
}

export function useAIResumeHistory() {
    return useQuery({
        queryKey: ['ai', 'resume', 'history'],
        queryFn: async () => {
            const response = await aiApi.resumeHistory();
            return response.data;
        },
    });
}

export function useAIDeleteResumeMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const response = await aiApi.deleteResume(id);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai', 'resume', 'history'] });
            queryClient.invalidateQueries({ queryKey: ['ai', 'dashboard'] });
        },
    });
}


export function useAIStartMockMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const response = await aiApi.startMock(payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai', 'dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['ai', 'mock', 'history'] });
        },
    });
}

export function useAIMockHistory() {
    return useQuery({
        queryKey: ['ai', 'mock', 'history'],
        queryFn: async () => {
            const response = await aiApi.mockHistory();
            return response.data;
        },
    });
}

export function useAIDeleteMockMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const response = await aiApi.deleteMock(id);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai', 'mock', 'history'] });
            queryClient.invalidateQueries({ queryKey: ['ai', 'dashboard'] });
        },
    });
}


export function useAIEvaluateMockMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const response = await aiApi.evaluateAnswer(payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai', 'dashboard'] });
        },
    });
}
