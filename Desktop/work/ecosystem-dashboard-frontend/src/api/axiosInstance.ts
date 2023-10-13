import axios from 'axios';
import type {AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { useAuthStore } from "@/store/Auth";
import { activeLang } from "@/i18n";
import useToast from "@/components/UI/AppToast/useToast";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
});

axiosInstance.interceptors.request.use( (request: AxiosRequestConfig) => {
    if (localStorage.getItem('accessToken')) {
        request.headers!.Authorization = localStorage.getItem('accessToken');
    }

    request.headers!['lang'] = activeLang;
    request.headers!['Accept-Language'] = activeLang;

    return request;
});

axiosInstance.interceptors.response.use(
    null,
    async (error: AxiosError) => {
        const AuthStore = useAuthStore();
        const { toast } = useToast();

        toast.error(error.response!.data?.error_message ?? error.response!.data?.message ?? error.response!.data);

        if(error.response.data.status === 401) {
            toast.error('sign out', 6666666)
            AuthStore.signOut();
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;