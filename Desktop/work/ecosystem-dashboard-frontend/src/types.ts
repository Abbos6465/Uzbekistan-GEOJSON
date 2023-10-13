export type AuthInfoType = {
    "status": number,
    "type": number,
    "person_passport": string,
    "person_pin": string,
    "soato_code": null,
    "email": string,
    "person_name": string,
    "person_surname": string,
    "person_patronymic": string,
    person_phone: string
    "birth_date": string,
    "gender": string,
    "data": null,
    "login": null
}

export type ProfileInfoType = {
    documentId: string
    name: string
    surname: string
    fullName: string
    patronymic: string
    nationality: string
    birthdate: string
    birthCountry: string
    birthCity: string
    citizenship: string
    pin: string
    tin: string
    address: string
    documentFrom: string
    documentUntil: string
    documentGivenFrom: string
    gender: 'male' | 'female'
}

export type VacanciesType = {
    company_name: string
    company_oked: string
    created_at: string | number
    position_name: string
    position_name_ru: string
    position_duties: string
    position_salary: string | null
    hide_salary: boolean
}

export type WomenServicesType = {
    service_name: string;
    start_date: string;
    end_date: string | null;
    status: string | null;
}
export type YouthListType = {
    child_help_type_id: number | null;
    child_help_type_name: string | null;
    help_date: string;
    help_type_id: number;
    help_type_name: string;
    helped_date: string | null;
    pin: number;
}
export type WorkbookPrintApiType = {
    "action_type_id": number,
    "actual_company_profile_name": string
    "company_profile_name": string
    "company_tin": string
    "date_start": string
    "date_stop": string
    "id": number,
    "order_date": string
    "order_number": string
    "parent_id": null,
    "position_name": string
    "position_name_ru": string
    "structure_change": null,
    "structure_name": null,
    "structure_name_ru": null,
    "work_type": number
}

export type WorkBookSingleType = {
    "action": boolean,
    "action_type_id": number,
    "active": boolean,
    "actual_company_name": string
    "actual_company_profile_name": string
    "company": {
        "name": string
        "profile_name": string
        "system_type": number,
        "tin": string
    },
    "company_name": string
    "company_tin": string
    "contract_data": {
        "child_action_type_id": number,
        "generalPosition": {
            "limitationOfContract": string
        }
    },
    "contract_date": string
    "contract_number": string
    "contract_rate": string
    "created_by_fio": null,
    "date_start": string
    "date_stop": string
    "disability": null,
    "error_id": null,
    "id": number,
    "kodp_nskz_code": string
    "kodp_personal_category": string
    "kodp_pn": string
    "level": number,
    "mark_confirmation": number,
    "mark_historical": null,
    "order_date": string
    "order_number": string
    "parent": null,
    "parent_id": null,
    "person_pin": string
    "person_sex": boolean,
    "position_id": null,
    "position_name": string
    "position_name_ru": string
    "reserved_types": null,
    "structure_id": number,
    "structure_name": string
    "structure_name_ru": string
    "transaction_type_id": number,
    "work_type": number
    children: WorkBookSingleType[]
}

export type DiplomaType = {
    order: number
    degree_name: string
    institution_name: string
    speciality_name: string
    edu_starting_date: string
    edu_finishing_date: string
    diploma_serial: string
    diploma_given_date: string
    status_name: string
}

export type TotalStatsType = {
    "contracts": string | null,
    "orders": string | null
}

export type NotificationsType = {
    "description": string
    "id": number,
    "title": string
    is_read: boolean
}