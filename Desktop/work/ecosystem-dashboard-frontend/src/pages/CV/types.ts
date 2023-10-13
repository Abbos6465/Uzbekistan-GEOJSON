export type NewCVType = {
    id?: string
    first_name: string
    middle_name: string
    surname: string
    phone_number: string
    birth_date: string
    "avatar"?: string
    "about": string
    "active"?: boolean,
    "address": string
    position_name: string
    "driving_experience": string[],
    "education_histories": {
            "edu_type_id": string,
            "education_name": string,
            "faculty_name": string,
            "position": string,
            "specialty_name": string,
            "start_year": string,
            "stop_year": string
        }[],
    "email": string,
    "has_car": boolean,
    "hobbies": number[],
    "languages": {
            "language_id": number,
            "level_id": number
        }[],
    "native_language_id": number | null,
    "personal_qualities": string[],
    "salary": string,
    "social_medias": {
            "link": string,
            "social_media_id": number
        }[],
    "work_histories": {
        "company_name": string,
        "company_tin": string,
        "date_start": string,
        "date_stop": string,
        "position": string,
        "work_type_id": string
    }[],
    "work_type_id": string | number
}

export type OrganizationDataType = {
    id?: number | string
    "company_name": string,
    "company_tin": string | null,
    "date_start": string,
    "date_stop": string | null,
    "position": string,
    "work_type_id": string
    details?: string[],
    until?: boolean
}

export type EducationDataType = {
    id?: number | string
    "edu_type_id": string,
    "education_name": string,
    "faculty_name": string,
    "specialty_name": string,
    "start_year": string,
    "stop_year": string | null
    details?: string[]
    until?: boolean
}

export type WorkType = {
    "id": number,
    "name": string
}

export type DrivingExperienceType = string

export type LanguageType = {
    "id": number,
    "name": string
}

export type LanguageLevelType = {
    "id": number,
    "name": string
}

export type PersonalQualityType = {
    name: string
    value: string
}

export type SocialMediaType = {
    "id": number,
    "img_path": string
    "name": string
}

export type HobbyType = {
    "children": HobbyType[],
    "id": number,
    "img_path": string
    "name": string
}

export type CVList = {
    "about": string
    "active": boolean,
    "address": string
    "position_name": string
    "avatar": null,
    "created_at": null,
    "deleted_at": null,
    "driving_experience": string[]
    "email": string
    "has_car": boolean,
    "id": number,
    "native_language_id": number,
    "person_pin": string
    "personal_qualities": string[]
    "salary": string
    "updated_at": null,
    "work_type_id": string
    "education_histories": {
        "edu_type_id": string
        "education_name": string
        "faculty_name": string
        "specialty_name": string
        "start_year": string
        "stop_year": string
    }[],
    "hobbies": number[],
    "kodp_nskz": null,
    "kodp_pn": null,
    "languages": {
        "language_id": number,
        "level_id": number
    }[],
    "social_medias": {
        "link": string
        "social_media_id": number
    }[],
    "work_histories": {
        "company_name": string
        "company_tin": string | null,
        "date_start": string
        "date_stop": string
        "position": string
        "work_type_id": string
    }[]
}