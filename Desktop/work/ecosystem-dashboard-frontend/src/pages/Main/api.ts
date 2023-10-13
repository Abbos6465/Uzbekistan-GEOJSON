import axiosInstance from "@/api/axiosInstance";
import type { OurSystemsType, SalaryApiType } from "@/pages/Main/types";

type DateType = {
    "month": string
    "summ": string
}

type INPSApiType = {
    "birth_day": string
    "code": string
    "fio": string
    "inps": string
    "msg": [],
    total: number,
    "orgs": {
        "dates": DateType | DateType[],
        "inn": string
        "name": string
    }[],
    "pas_num": string
    "pas_seria": string
}

type DisabilityInfoApiType = {
    "address": string
    "birth_date": string
    "city_soato": number,
    "disability_date_end": string | null,
    "disability_date_start": string
    "disability_group": number,
    "disability_percentage": number,
    "disability_reason": string
    "epdate": string
    "n_blind": number,
    "name": string
    "parasport_recom": null,
    "partonym": string
    "passport_number": string
    "pinfl": string
    "profession_recom": null,
    "reference_number": string
    "sex": number,
    "surname": string
    "which_organization": string
}

type YouthBookApiType = {
    "address": string
    "areaCode": number,
    "benefit_amount": null,
    "benefit_date": string
    "districtCode": number,
    "end_date": string
    "fio_debtor": string
    "firstName": string
    "in_reason": {
        "child_field_id": null,
        "child_field_name": null,
        "service_id": number,
        "service_name": string
    },
    "lastName": string
    "middleName": string
    "out_reason": {
        "child_name": null,
        "child_reason_id": null,
        "name": string
        "reason_id": number
    },
    "passport_num": string
    "passport_sn": string
    "phone": string
    "pinfl_debtor": number,
    "reason_id": number,
    "reason_introduction": string
    "start_date": string
    "status": number,
    "streetName": null,
    "villageCode": number
}

type WomensBookApiType = {
    "address": string
    "deregistration_date": string,
    "direction_name": string
    "entered_date": string
    "fullname": string
    "passport_sn": string
    "pinfl": number,
    "status": string
    "status_code": number
}

type UnifiedRegisterOfSocialProtectionApiType = {
    "Allocation": number,
    "ApplicationDate": string
    "ApplicationID": number,
    "EligibilityDate": string
    "FullName": string
    "PinFL": string
    "ProgrammeID": number,
    "TwoYearsChildren": number,
    "ValidityDate": string
}

export type OnlineFairsType = {
    "closest_fair": FairType
    "days": {
        [key: string]: {
            "current": boolean,
            "fair": FairType,
            "name": string
        },
    }
}

export type FairType = {
    "city": string
    "duration": {
        "h": number,
        "m": number
    },
    "end": string
    "fixed_date": string
    "id": number,
    "region": string
    "start": string
    "status": string
    "theme": string
    "thumbnails": {
        "default": {
            "height": number,
            "url": string
            "width": number
        },
        "high": {
            "height": number,
            "url": string
            "width": number
        },
        "medium": {
            "height": number,
            "url": string
            "width": number
        }
    },
    "video_id": string
}

export default {
    async getTotalExperienceApi() {
        const { data } = await axiosInstance.get('api/v1/workbook/total-experience');
        return data.result.data.experience;
    },

    async getINPSApi(): Promise<INPSApiType> {
        const { data } = await axiosInstance.get('api/v1/users/get-inps');
        return data.result.data;
    },

    async getDownloadINPSApi() {
        const { data } = await axiosInstance.get('api/v1/users/download-inps');
        return data.result.data;
    },

    async getUnifiedRegisterOfSocialProtectionApi(): Promise<UnifiedRegisterOfSocialProtectionApiType> {
        const { data } = await axiosInstance.post('api/v1/cabinet/resources/get-social-resstr-by-pin')
        return data.result.result;
    },

    async getIronBookApi() {
        const { data } = await axiosInstance.post('api/v1/cabinet/resources/check-iron-notebook-by-pin')
        return data.result.result;
    },

    async getWomensBookApi(): Promise<WomensBookApiType[]> {
        const { data } = await axiosInstance.post('api/v1/cabinet/resources/check-women-notebook-by-pin')
        return data.result.result;
    },

    async getDisabilityInfoApi(): Promise<DisabilityInfoApiType> {
        const { data } = await axiosInstance.post('api/v1/cabinet/resources/get-invalid-by-pin')
        return data.result.result;
    },

    async getYouthBookApi(): Promise<YouthBookApiType> {
        const { data } = await axiosInstance.post('/api/v1/cabinet/resources/check-young-notebook-by-pin')
        return data.result.result;
    },

    async getSalaryApi(): Promise<SalaryApiType[]> {
        const { data } = await axiosInstance.get('/api/v1/users/person-salary');
        return data.result.data;
    },

    async getOurSystemsApi(): Promise<OurSystemsType[]> {
        return await axiosInstance
            .get('api/v1/ecosys/OS/flags', {
                params: {
                    PerPage: 250
                }
            })
            .then(({data}) => data.result.data);
    },

    async getOnlineFairsApi(params: any = {}): Promise<OnlineFairsType> {
        return await axiosInstance
            .get('api/v1/ecosys/online-fairs/with-days', {
                params: {
                    device: 'web',
                    ...params
                }
            })
            .then(({data}) => data.result.data);
    }
}