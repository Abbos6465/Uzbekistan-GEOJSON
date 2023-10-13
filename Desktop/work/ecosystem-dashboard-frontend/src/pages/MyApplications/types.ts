export enum StatusTypes {
    confirmed = 'CONFIRMED',
    rejected = 'REJECTED',
    sent = 'SENT'
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