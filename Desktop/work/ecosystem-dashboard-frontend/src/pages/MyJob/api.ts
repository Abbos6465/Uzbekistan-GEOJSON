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
type SilkSheetsApiType = {
    "end_date": string
    "start_date": string
    "fio": string
    "number": string
    "organization_gave": string
    "reason_name": string,
    "reason_name_ru": string
    "reason_name_uz": string
    "series": string,
    "validFrom": string
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

const MyJobApi = {
    async getRewardsApi(): Promise<RewardsApiType[]> {
        return await axiosInstance
            .get('api/v1/workbook/rewards/list')
            .then(({ data }) => data.result.data);
    },
    async getSickSheetsApi(params = {}): Promise<SilkSheetsApiType[]> {
        return await axiosInstance
            .get('api/v1/users/person-sickleave', {
                params
            })
            .then(({ data }) => data.result.data);
    },

    async getDisciplinaryActionsApi(): Promise<DisciplinaryActionsApiType[]> {
        return await axiosInstance
            .get('api/v1/workbook/penalties/list')
            .then(({ data }) => data.result.data);
    },

    async getSalaryByOrgApi(params: SalaryByOrgPayloadType): Promise<SalaryByOrgMonthsType[]> {
        return await axiosInstance
            .get('api/v1/users/own/person-salary', {
                params
            })
            .then(({data}) => data.result.data.months);
    },

    // Applications
    async getApplicationTypesApi(): Promise<LaborLeaveTypesType[]> {
        return await axiosInstance
            .get('api/v1/cabinet/get-application-types')
            .then(({data}) => data.result.data);
    },

    async getLaborLeaveTypesApi(): Promise<LaborLeaveTypesType[]> {
        return await axiosInstance
            .get('api/v1/cabinet/get-labor-leave-types')
            .then(({data}) => data.result.data);
    },

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
    },

    // Contracts
    async getContractsApi(params: {}): Promise<ContractType[]> {
        return await axiosInstance
            .get('api/v1/workbook/contracts/list', { params })
            .then(({data}) => data.result.data);
    },

    async getContractDocApi(transaction_id: string | number) {
        return await axiosInstance
            .get('api/v1/workbook/contract-show', {params: {transaction_id}})
            .then(({data}) => data.result.data);
    },

    async confirmSignTransactionApi(payload: ConfirmSignTransactionType) {
        return await axiosInstance.put('api/v1/workbook/confirm-sign-transactions', payload)
    },

    // Orders
    async getOrdersApi(params: {}): Promise<OrderType[]> {
        return await axiosInstance
            .get('api/v1/workbook/orders/list', { params })
            .then(({data}) => data.result.data);
    },

    async getOrderFileApi(id: string | number): Promise<string> {
        return await axiosInstance
            .get('api/v1/workbook/order/get-file', {
                params: {
                    transaction_id: id
                }
            })
            .then(({data}) => data.result.data);
    },

    async changeOrderSeenApi(id: string | number) {
        return await axiosInstance
            .put('api/v1/workbook/orders/seen', {transaction_id: id})
    },

    // Attorneys
    async getAttorneyApi() {
        return await axiosInstance
            .get('api/v1/users/proxies/by-pin')
            .then(({data}) => data.result.data);
    }
}

export default MyJobApi;