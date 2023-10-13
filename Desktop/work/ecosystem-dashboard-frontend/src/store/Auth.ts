import { defineStore } from "pinia";
import axiosInstance from "@/api/axiosInstance";
import { eraseCookie, getCookie, setCookie } from "@/utils/cookiesManager";
import type { AuthInfoType } from "@/types";
import useLoading from "@/composables/useLoading";

const ACCESS_TOKEN_COOKIE = '_access_token';

type StateType = {
    isAuth: boolean
    authInfo: AuthInfoType | null
}

export const useAuthStore = defineStore('auth', {
    state: (): StateType => ({
        // isAuth: !!getCookie(ACCESS_TOKEN_COOKIE),
        isAuth: !!localStorage.getItem('accessToken'),
        authInfo: null
    }),
    getters: {
        fullName(): string {
            return `${this.authInfo?.person_surname} ${this.authInfo?.person_name} ${this.authInfo?.person_patronymic}`
        }
    },
    actions: {
        async getAuthInfo() {
            if(!this.isAuth) return;

            const {changeIsRequestLoading} = useLoading();

            changeIsRequestLoading('getAuthInfo', true);

            return await axiosInstance.get('/api/v1/auth-user/get-info')
                .then(({data}) => {
                    if(data) this.authInfo = data.result;
                })
                .finally(() => {
                    changeIsRequestLoading('getAuthInfo', false);
                })
        },

        async signIn(code: string) {
            const {data} = await axiosInstance.post('/auth/oneid/login', {code});

            if(data.success) {
                const token = 'Bearer ' + data.result.access_token;

                setCookie(ACCESS_TOKEN_COOKIE, token);
                localStorage.setItem('accessToken', token);

                this.isAuth = true;

                if(this.router.currentRoute.value.query.code) {
                    await this.router.push({
                        name: this.router.currentRoute.value.name
                    })
                        .then(() => {
                            this.getAuthInfo()
                        })
                }
            }
        },

        signOut() {
            eraseCookie(ACCESS_TOKEN_COOKIE);
            localStorage.removeItem('accessToken');
            this.isAuth = false;
            this.authInfo = null;
            if(!window.location.href.includes('localhost') || !window.location.href.includes('ecosystem-dashboard-frontend.vercel.app')) window.location.href = import.meta.env.VITE_WEB;
        }
    }
})