import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ClientService } from '../model/types';

export type CreateClientServiceDto = Omit<ClientService, 'id' | 'createdAt' | 'updatedAt'>;

interface ServicesStore {
    services: ClientService[];
    isLoading: boolean;
    error: string | null;

    addService: (service: CreateClientServiceDto) => void;
    removeService: (id: string) => void;
    updateService: (id: string, data: Partial<CreateClientServiceDto>) => void;
    clearServices: () => void;
    setServices: (services: ClientService[]) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useServicesStore = create<ServicesStore>()(
    persist(
        (set) => ({
            services: [],
            isLoading: false,
            error: null,

            addService: (serviceData) => {
                const newService: ClientService = {
                    ...serviceData,
                    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
                    createdAt: new Date(),
                    updatedAt: null,
                    isActive: true,
                };

                set((state) => ({
                    services: [...state.services, newService],
                    error: null,
                }));
            },

            removeService: (id) => {
                set((state) => ({
                    services: state.services.filter(service => service.id !== id),
                    error: null,
                }));
            },

            updateService: (id, data) => {
                set((state) => ({
                    services: state.services.map(service =>
                        service.id === id
                            ? { ...service, ...data, updatedAt: new Date() }
                            : service
                    ),
                    error: null,
                }));
            },

            clearServices: () => {
                set({ services: [], error: null });
            },

            setServices: (services) => {
                set({ services, error: null });
            },

            setLoading: (isLoading) => {
                set({ isLoading });
            },

            setError: (error) => {
                set({ error });
            },
        }),
        {
            name: 'company-services-storage',
            partialize: (state) => ({ services: state.services }),
        }
    )
);