import axiosInstance from "@/api/axiosInstance";
import type {
    DrivingExperienceType, HobbyType,
    LanguageLevelType,
    LanguageType, NewCVType,
    PersonalQualityType, SocialMediaType,
    WorkType
} from "@/pages/CV/types";
import axios from "axios";

const CVApi = {
    async getCVApi(id: string) {
        return await axiosInstance
            .get(`api/v1/cabinet/my-resumes/${id}`)
            .then(({data}) => data.result.data);
    },

    async createCVApi(payload: NewCVType) {
        return await axiosInstance
            .post('api/v1/cabinet/my-resumes', payload)
    },

    async updateCVApi(id: string, payload: NewCVType) {
        return await axiosInstance.put(`api/v1/cabinet/my-resumes/${id}`, payload)
    },

    async deleteCVApi(id: number | string) {
        return await axiosInstance.delete(`api/v1/cabinet/my-resumes/${id}`)
    },

    async changeCVStatusApi(id: string) {
        return await axiosInstance.post(`api/v1/cabinet/my-resumes/${id}/change-status`);
    },

    async getWorkTypesApi(): Promise<WorkType[]> {
        return await axiosInstance
            .get('api/v1/cabinet/work-types')
            .then(({data}) => data.result.data);
    },

    async getDrivingExperienceApi(): Promise<DrivingExperienceType[]> {
        return await axiosInstance
            .get('api/v1/cabinet/driving-experience')
            .then(({data}) => data.result.data);
    },

    async getLanguagesApi(): Promise<LanguageType[]> {
        return await axiosInstance
            .get('api/v1/cabinet/languages')
            .then(({data}) => data.result.data);
    },

    async getLanguageLevelsApi(): Promise<LanguageLevelType[]> {
        return await axiosInstance
            .get('api/v1/cabinet/language-levels')
            .then(({data}) => data.result.data);
    },

    async getPersonalQualitiesApi(): Promise<PersonalQualityType[]> {
        return await axiosInstance
            .get('api/v1/cabinet/personal-qualities')
            .then(({data}) => data.result.data);
    },

    async getSocialMediasApi(): Promise<SocialMediaType[]> {
        return await axiosInstance
            .get('api/v1/cabinet/social-medias')
            .then(({data}) => data.result.data);
    },

    async getHobbiesApi(): Promise<HobbyType[]> {
        return await axiosInstance
            .get('api/v1/cabinet/resume-hobbies/tree')
            .then(({data}) => data.result.data);
    }
}

export default CVApi;