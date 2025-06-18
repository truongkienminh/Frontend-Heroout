import { useState, useEffect } from "react";
import ApiService from "../services/apiService";

// Custom hook để sử dụng API calls
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Hook cho các API calls với parameters
export const useApiWithParams = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiFunction, ...params) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...params);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
};

// Specific hooks cho từng loại API
export const useBlogs = () => {
  return useApi(() => ApiService.getBlogs());
};

export const useBlog = (id) => {
  return useApi(() => ApiService.getBlog(id), [id]);
};

export const useConsultants = () => {
  return useApi(() => ApiService.getConsultants());
};

export const useConsultant = (id) => {
  return useApi(() => ApiService.getConsultant(id), [id]);
};

export const useAppointments = () => {
  return useApi(() => ApiService.getAppointments());
};

export const useSchedules = () => {
  return useApi(() => ApiService.getSchedules());
};

export const useSlots = () => {
  return useApi(() => ApiService.getSlots());
};
