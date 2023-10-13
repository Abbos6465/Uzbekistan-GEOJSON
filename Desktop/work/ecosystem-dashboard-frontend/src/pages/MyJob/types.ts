export enum StatusTypes {
    sent = 'SENT',
    rejected = 'REJECTED',
    confirmed = 'CONFIRMED'
}

export type LaborLeaveTypesType = {
    "id": number
    "name": string
}

export type ApplicationType = {
    "current_page"?: number,
    "data": {
        "accepted_by": number,
        "comment": string
        "company_tin": string
        "created_at": string
        "date_start": string
        "date_stop": string
        "id": number,
        "labor_leave_type": number,
        "mark_date_stop": true,
        "person_pin": string
        "status": number,
        "type": number,
        "updated_at": string
    }[]
    ,
    "from"?: number,
    "last_page"?: number,
    "per_page"?: number,
    "to"?: number,
    "total"?: number
}

export type NewApplicationFormType = {
    company_tin: string
    type: string | number
    date_start: string
    date_stop: string
    comment: string
    labor_leave_type?: string
}

export type ContractType = {
    "company": {
        "name": string
        "tin": string
    },
    "contract_date": string
    "contract_number": string
    "created_at": string
    "id": number,
    "order_number": null,
    "person_pin": string
    "status": number,
    "transaction_id": null
}

export type OrderType = {
    "company": {
        "name": string
        "tin": string
    },
    "company_tin": string
    "contract_date": string
    "contract_number": string
    "id": number,
    "order_date": string
    "order_number": string
    "order_seen": boolean,
    "person_pin": string
    "status": number,
    "transaction_id": number
    file?: string
}

export type ContactDocType = {
    "action_type_id": number,
    "birth_date": null,
    "comment_reason": null,
    "company": {
        "created_at": string
        "created_by": null,
        "data": {
            "ACC_PHONE": null,
            "ACRON_UZ": string
            "ADDR": string
            "AUTH_CAPITAL": number,
            "AUTH_CAPITAL_US": [],
            "BILLING_ADDR": {
                "cadastreNumber": null,
                "countryCode": number,
                "flat": null,
                "house": null,
                "postcode": string
                "sectorCode": number,
                "soato": number,
                "streetName": string
                "villageCode": string
            },
            "EMAIL": null,
            "EMP_AVR": string
            "HEAD_NM": string
            "HEAD_PASSPORT": string
            "HEAD_PIN": string
            "HEAD_TIN": string
            "KFS_CD": number,
            "KFS_DESC_EN": [],
            "KFS_DESC_RU": string
            "KFS_DESC_UZ": string
            "KOPF_CD": number,
            "KOPF_DESC_EN": [],
            "KOPF_DESC_RU": string
            "KOPF_DESC_UZ": string
            "LE_ID": string
            "LE_NM_UZ": string
            "LE_STATUS": number,
            "LE_TYP": number,
            "LE_TYP_CURRENCY": string
            "LIQ_DATE": null,
            "LIQ_NO": [],
            "OKED_CD": string
            "OKED_DESC_EN": [],
            "OKED_DESC_RU": string
            "OKED_DESC_UZ": string
            "OKONH_CD": string
            "OKONH_DESC_EN": [],
            "OKONH_DESC_RU": string
            "OKONH_DESC_UZ": string
            "OKPO": string
            "PHONE": string
            "REG_DATE": string
            "REG_NO": string
            "SMALL_BIZ": string
            "SOATO_CD": number,
            "SOATO_DESC_EN": [],
            "SOATO_DESC_RU": string
            "SOATO_DESC_UZ": string
            "SOOGU_CD": string
            "SOOGU_DESC_EN": [],
            "SOOGU_DESC_RU": string
            "SOOGU_DESC_UZ": string
            "TAX_CD": null,
            "TIN": string
            "ZIP": string
        },
        "date_start": string
        "date_stop": string
        "emails": null,
        "full_text": string
        "is_yatt": boolean,
        "name": string
        "oked": string
        "parent_tin": null,
        "phones": string[],
        "profile_data": {
            "actual_address":string
            "actual_address_district": number,
            "actual_address_region": number,
            "actual_address_street": string
            "address": string
            "address_district": number,
            "address_region": number,
            "address_street": string
            "director": string
            "director_pin": string
            "director_tin":string
            "phone_vacancies": string
        },
        "profile_name": string
        "soato_code": string
        "soogu": string
        "status": number,
        "system_type": number,
        "tin": string
        "updated_at": string
        "updated_by": null
    },
    "company_signed_at": null,
    "company_tin": string,
    "contract_data": {
        "1": [],
        "3": [],
        "4": [],
        "5": [],
        "6": [],
        "7": [],
        "8": [],
        "2.1": [],
        "2.2": [],
        "acting_basis": number,
        "additional_paid_leave_days": number,
        "annual_leave_days": number,
        "employer_name": string
        "employer_type": number,
        "generalPosition": {
            "limitationOfContract": null,
            "perpetualContract": boolean
        },
        "lunch_break_end": string
        "lunch_break_start": string
        "payment_times": number,
        "selectedDays": string[],
        "trial_period": number,
        "work_activity": string
        "working_hour_end": string
        "working_hour_start": string
    },
    "contract_date": string
    "contract_number": string
    "contract_rate": string
    "created_at": string
    "created_by": number,
    "date_start": string
    "date_stop": string
    "deleted_at": null,
    "employee_signed_at": null,
    "expat_type": null,
    "hide_salary": boolean,
    "id": number,
    "individ": {
        "active": boolean,
        "avatar_path": null,
        "birth_date": string
        "company_tin": null,
        "created_at": string
        "data": {
            "birth_country": string
            "birth_country_id": string
            "birth_date": string
            "birth_place": string
            "citizenship": string
            "citizenship_id": string
            "date_begin_document": string
            "date_end_document": string
            "doc_give_place": string
            "doc_give_place_id": string
            "document": string
            "livestatus": string
            "name_engl": string
            "name_latin": string
            "nationality": string
            "nationality_id": string
            "patronym_latin": string
            "person_sex": boolean,
            "pin": string
            "sex": string
            "soliq": {
                "address": string
                "birth_date": string
                "error": number,
                "gender": string
                "name": string
                "ns10_code_id": string
                "ns11_code_id": string
                "patronymic": string
                "surname": string
                "tin_soliq": string
            },
            "surname_engl": string
            "surname_latin": string
            "work_type": number
        },
        "education_confirmation": null,
        "education_data": null,
        "education_status": number,
        "education_updated_at": string
        "email": string
        "expat_type": null,
        "home_phone": null,
        "id": number,
        "login": string
        "minzto_soato_code": null,
        "mobile_phone": number,
        "nationality": string
        "ns10": number,
        "ns11": number,
        "persion_data": null,
        "persion_type": number,
        "persion_updated_at": string
        "person_name": string
        "person_passport": string
        "person_patronymic": string
        "person_pin": string
        "person_sex": boolean,
        "person_surname": string
        "person_tin": string
        "residential_address": string
        "resolution_date": null,
        "resolution_number": null,
        "rights": {
            "transactions": {
                "edu": {
                    "create": boolean
                },
                "lc": {
                    "create": boolean
                }
            }
        },
        "structure_id": null,
        "type": number,
        "updated_at": string
    },
    "order_date": null,
    "order_number": null,
    "order_seen": boolean,
    "person_name": string
    "person_passport": string
    "person_patronymic": string
    "person_pin": string
    "person_surname": string
    "position_id": number,
    "position_name": string
    "position_name_ru": string
    "salary": null,
    "sign_json": {
        "pkcs7_64": string
    },
    "status": number,
    "structure_id": number,
    "structure_name": string
    "structure_name_ru": string
    "transaction_id": null,
    "updated_at": string
    "work_type": number
}

export type ConfirmSignTransactionType = {
    "accept": boolean,
    "comment_reason": string
    "sign_transaction_id": number
}

export type SalaryByOrgPayloadType = {
    company_tin: string
    year: string
}

export type SalaryByOrgMonthsType = {
    "company_tin": string
    "month": number
    "salary": string
}