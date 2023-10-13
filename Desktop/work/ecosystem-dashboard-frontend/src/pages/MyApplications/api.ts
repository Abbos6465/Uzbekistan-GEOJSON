import axiosInstance from "@/api/axiosInstance";
import type {
    ApplicationType,
    LaborLeaveTypesType,
    NewApplicationFormType,
    ContractType, ConfirmSignTransactionType, OrderType, SalaryByOrgPayloadType, SalaryByOrgMonthsType
} from "@/pages/MyJob/types";

type RewardsApiType = {
    "amount": string
    "created_by": string
    "first_name": string
    "given_date": string
    "id": number,
    "kpi_percentage": string
    "last_name": string
    "manual": null,
    "middle_name": null,
    "percentage": string
    "pin": number,
    "position": string
    "reward_kpi_url": string
    "reward_order_url": string
    "reward_type": string
    "reward_type_ru": string
    "status": number
}
type DisciplinaryActionsApiType = {
    "contract_number": null,
    "created_by": string
    "date_stop": null,
    "declined_by": null,
    "declined_reason": null,
    "declined_sign": null,
    "expired_at": string
    "first_name": string
    "given_date": string
    "id": number,
    "last_name": string
    "manual_reason": null,
    "middle_name": null,
    "order_url": string
    "penalty_reason": string
    "penalty_reason_ru": string
    "penalty_type": string
    "penalty_type_ru": string
    "percentage": string
    "pin": number,
    "position": string
    "sign_bool": boolean,
    "status": number
}

const MyApplicationsApi = {
    // Applications

    async getApplicationApi(params: {}): Promise<ApplicationType> {
        return await axiosInstance
            .get('api/v1/cabinet/applications', { params })
            .then(({data}) => data.result.data);
    },

    async createApplicationApi(body: NewApplicationFormType): Promise<ApplicationType> {
        return await axiosInstance
            .post('api/v1/cabinet/applications', body)
            .then(({data}) => data.result.result);
    },

    async cancelApplicationApi(id: number, status: number | string): Promise<any> {
        return await axiosInstance.put(`api/v1/cabinet/rejected-application/${id}`, {status})
    }
}

export default MyApplicationsApi;