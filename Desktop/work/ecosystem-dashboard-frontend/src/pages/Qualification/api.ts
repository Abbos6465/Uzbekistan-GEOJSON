import axiosInstance from "@/api/axiosInstance";
import axios from "axios";

type MyCoursesApiType = {
    id: number;
    direction_name: string;
    start_date: string;
    end_date: string;
    institution_name: string;
    parent_structure_name: string;
    status: string;
    structure_name: string;
};

type AppealPaidCourseType = {
    id: number,
    status: string,
    institution_name: string,
    direction_name: string,
    period_weeks: number,
    created_at: string
};

type VideosType = {
    id: number,
    name_uz: string,
    name_ru: string,
    category_name_uz: string,
    category_name_ru: string,
    duration_time: string,
    parent_id: number,
    rate: number,
    url: string,
    view_count: number
};

type RateModuleType = {
    id: number,
    video_id: number,
    pin: number,
    rate: number
}

type DirectionsType = {
    id: number,
    direction_id: number,
    region_id: number,
    region_name_ru: string,
    region_name_uz: string,
    city_name_ru: string,
    city_name_uz: string,
    city_soato: number,
    count_citizens: number,
    direction_name_ru: string,
    direction_name_uz: string,
    info: string,
    organization_name: string,
    rate: number
}

type ShowDirectionType = {
    id: number,
    direction_name_uz: string,
    direction_name_ru: string,
    company_tin: number,
    info: string,
    count_citizens: number,
    weekly: number,
    hourly: number,
    rate: number
}

type OrganizationType = {
    id: number,
    name: string,
    rate: number,
    leader_pin: number,
    tin: number,
    phone: string,
    status: number,
    oked: number,
    founder_name: string,
    director_name: string,
    address_us: string,
    opf: string,
    PaidCourseStudentCount: number,
    direction_organizations_count: number
}

type RegionsType = {
    "ADDRESS": string | number,
    "BANK_ACCOUNT": string | number,
    "CHAIRPERSON": string | number,
    "COEFFICIENT": string | number,
    "DIRECTOR_FULLNAME": string,
    "ENCOUNTER": string | number,
    "LABOR_INSPECTOR": string | number,
    "MAIN_SPECIALIST": string | number,
    "MEMBER": string | number,
    "ORDER": number,
    "PHONE": string,
    "SOATO": number,
    "SPEAKER": string | number,
    "STRUCTURE_DEPARTMENT": string | number,
    "STRUCTURE_ID": number,
    "STRUCTURE_LEAF": string | number,
    "STRUCTURE_NAME_OZ": string,
    "STRUCTURE_NAME_RU": string,
    "STRUCTURE_NAME_UZ": string,
    "STRUCTURE_PARENT_ID": number,
    "STRUCTURE_PATH": string | number,
    "TIN": number,
    "VICE_CHAIRPERSON": string | number,
    "city_special": boolean,
    "role_name": string
}

type CitiesType = {
    "ADDRESS": string,
    "BANK_ACCOUNT": number,
    "CHAIRPERSON": string | number,
    "COEFFICIENT": string | number,
    "DIRECTOR_FULLNAME": string,
    "ENCOUNTER": string,
    "LABOR_INSPECTOR": string | number,
    "MAIN_SPECIALIST": string | number,
    "MEMBER": string,
    "ORDER": number,
    "PHONE": string,
    "SOATO": number,
    "SPEAKER": string,
    "STRUCTURE_DEPARTMENT": string | number,
    "STRUCTURE_ID": number,
    "STRUCTURE_LEAF": boolean,
    "STRUCTURE_NAME_OZ": string,
    "STRUCTURE_NAME_RU": string,
    "STRUCTURE_NAME_UZ": string,
    "STRUCTURE_PARENT_ID": number,
    "STRUCTURE_PATH": string,
    "TIN": number,
    "VICE_CHAIRPERSON": string,
    "city_special": boolean,
    "role_name": string
}

type appealCourseType = {
    "pin": number| string,
    "passport": string| number,
    "birth_date": string,
    "gender": string | number,
    "l_name": string,
    "f_name": string,
    "m_name": string,
    "period_weeks": number|string,
    "phone": string | number,
    "company_tin": string | number,
    "parent_structure_soato": string|number,
    "structure_parent_id": number|string,
    "direction_id": number| string
}

type resourceOrganizationType = {
    "id": number,
    "name": string,
    "rate": number,
    "confirmed_at": number|string,
    "leader_pin": number,
    "tin": number|string,
    "phone": string,
    "status": number,
    "type_of_institution": number,
    "registrationDate": string,
    "oked": number|string,
    "founder_name": string,
    "director_name": string,
    "address": string,
    "city_soato": number|string,
    "opf": number|string,
    "region_id": number,
    "region_name_uz": string,
    "region_name_ru": string,
    "region_address_longitude": number|string,
    "region_address_latitude": number|string
}

type resourceDirectionsType = {
    "city_name_ru": string,
    "city_name_uz": string,
    "city_soato": number,
    "count_citizens": number,
    "direction_id": number,
    "direction_name_ru": string,
    "direction_name_uz": string,
    "id": 6413,
    "info": null,
    "organization_name": string,
    "rate": number,
    "region_id": number,
    "region_name_ru": string,
    "region_name_uz": string
}

type mapCountOrganizationsType = {
    "id": number,
    "tin": number|string,
    "region_id": number,
    "city_soato": number,
    "phone": string|number,
    "address_latitude": string|number,
    "address_longitude": string|number
}

const QualificationApi = {
    async getMyCoursesApi(params = {}): Promise<MyCoursesApiType[]> {
        return await axiosInstance
            .get('api/v1/cabinet/course-by-citizen', {params})
            .then(({data}) => data.result.data)
            .catch(err => err);
    },

    async getAppealPaidCourse(params = {}): Promise<AppealPaidCourseType[]> {
        return await axiosInstance
            .post('api/v1/cabinet/appeal-paid-course', {params})
            .then(({data}) => data.result.data)
            .catch(err => err);
    },

    async getVideos(params = {}): Promise<VideosType[]> {
        return await axiosInstance
            .get('api/v1/cabinet/get-videos', {params})
            .then(({data}) => data.result.data.results)
            .catch(err => err);
    },

    async saveRateModule(params = {}): Promise<RateModuleType> {
        return await axiosInstance
            .post('/api/v1/cabinet/save-rate-module', params)
            .then(({data}) => data.result.data)
            .catch(err => err);
    },

    async getDirections(params = {}): Promise<DirectionsType> {
        return await axiosInstance
            .get('/api/v1/cabinet/get-directions', params)
            .then(({data}) => data.result.data)
            .catch(err => err);
    },

    async getVideo(id = {}): Promise<void | VideosType> {
        return await axiosInstance
            .get(`/api/v1/cabinet/get-video/${id}`)
            .then(({data}) => data.result.data)
            .catch(err => err);
    },

    async showByOrganization(company_tin = null): Promise<OrganizationType> {
        return await axiosInstance
            .get(`/api/v1/cabinet/show-by-organization/${company_tin}`)
            .then(({data}) => data.result.data)
            .catch(err => err);
    },

    async resourcesRegions(params = {}): Promise<RegionsType> {
        return await axiosInstance
            .get(`api/v1/cabinet/resources/regions`, {params})
            .then(({data}) => data.result)
            .catch(err => err);
    },

    async resourcesCities(STRUCTURE_PARENT_ID = null): Promise<CitiesType> {
        return await axiosInstance
            .get(`/api/v1/cabinet/resources/cities/${STRUCTURE_PARENT_ID}`)
            .then(({data}) => data.result)
            .catch(err => err);
    },

    async resourceOrganization(params = {}): Promise<resourceOrganizationType> {
      return await axiosInstance
          .get(`/api/v1/cabinet/get-organizations`, {params})
          .then(({data})=> data.result.data)
          .catch(err => err);
    },

    async resourceDirections(params = {}): Promise<resourceDirectionsType> {
        return await axiosInstance
            .get(`api/v1/cabinet/get-directions`, {params})
            .then(({data})=> data.result.data)
            .catch(err => console.log(err));
    },

    async mapCountOrganizations(params = {}): Promise<mapCountOrganizationsType>{
        console.log(params);
        return axios.get(`https://sertifikat.mehnat.uz/api/api/profession/get-map-count-organizations`, {params})
            .then(({data}) => data.data)
            .catch(err=> err);
    },

    async storeAppealCourse(data = {}): Promise<appealCourseType> {
        return await axiosInstance
            .post('/api/v1/cabinet/store-appeal-course', data)
            .then(({data}) => data.result)
    }
};

export default QualificationApi;
