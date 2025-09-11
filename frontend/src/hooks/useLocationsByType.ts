import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createLocation, deleteLocation, fetchLocationsByType, updateLocation } from '../services/Location.service';

export interface Location {
  id: number | string;
  label: string;
  parentId: number | string;
  type: string;
}

export interface LocationInput {
  id?: number | string;
  label: string;
  type?: 'STATE' | 'CITY' | 'DISTRICT' | 'COUNTRY';
  parentId?: number | string;
}

// ✅ REACT QUERY VERSION
export function useLocationsByType(
  type: 'STATE' | 'CITY' | 'DISTRICT' | 'COUNTRY',
  parentId?: number | string,
  limit?: number,
  page?: number,
  refreshKey?: number
) {
  const enabled =
    !(type === 'CITY' && !parentId) &&
    !(type === 'DISTRICT' && !parentId);

  const query = useQuery({
    queryKey: ['locations', type, parentId, limit, page, refreshKey],
    queryFn: () =>
      fetchLocationsByType({
        locationType: type,
        parentId,
        limit,
        page,
      }).then((res) => {
        const resp = res?.data?.data;
        if (Array.isArray(resp.data)) {
          return { data: resp.data, total: resp.totalPages ?? 1 };
        }
        throw new Error('فرمت پاسخ نامعتبر است');
      }),
    enabled,
  });

  return {
    data: query.data?.data || [],
    loading: query.isLoading,
    error: query.isError ? 'خطا در دریافت داده‌ها' : null,
    total: query.data?.total || 1,
  };
}

// ✅ MUTATIONS VERSION
export function useLocationsMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (input: LocationInput) => {
      if (input.parentId == null || input.type == null) {
        throw new Error("parentId and type are required");
      }
      return createLocation({
        parentId: input.parentId,
        type: input.type,
        label: input.label,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  const update = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string | number;
      input: LocationInput;
    }) => {
      if (input.parentId == null || input.type == null) {
        throw new Error("parentId and type are required");
      }
      return updateLocation(id, {
        parentId: input.parentId,
        type: input.type,
        label: input.label,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string | number) => deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  return {
    create: (input: LocationInput) => create.mutate(input),
    update: (id: string | number, input: LocationInput) =>
      update.mutate({ id, input }),
    remove: (id: string | number) => remove.mutate(id),
    mutating: create.isPending || update.isPending || remove.isPending,
    error:
      create.isError || update.isError || remove.isError
        ? "خطا در انجام عملیات"
        : null,
  };
}
