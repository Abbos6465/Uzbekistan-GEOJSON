import axiosInstance from "@/api/axiosInstance";

type DiplomaApiType = {
    "degree_id": number,
    "degree_name": string
    "diploma_given_date": string
    "diploma_number": string
    "diploma_serial":string
    "diploma_serial_id": number,
    "diploma_type_id": number,
    "diploma_type_name": string
    "edu_duration_id": number,
    "edu_duration_name": string
    "edu_finishing_date": string
    "edu_form_id": number,
    "edu_form_name": string
    "edu_starting_date": string
    "edu_type_id": number,
    "edu_type_name": string
    "id": number,
    "institution_id": number,
    "institution_name": string
    "institution_old_name": string
    "institution_old_name_id": number,
    "institution_type_id": number,
    "institution_type_name": string
    "mhe_errors": null,
    "mhe_status": null,
    "reg_number": null,
    "speciality_id": number,
    "speciality_name": string
    "status_id": number,
    "status_name": string
}

type ForeignDiplomaType = {
    "application_number": string
    "birth_date": string
    "certificate_number": string
    "certificate_seria": string
    "country": string
    "degree": string
    "diploma": string
    "diploma_given_date": string
    "education_finished_year": number,
    "education_started_year": number,
    "f_name": string
    "faculty": string
    "m_name": string
    "otm_name": string
    "passport_diploma": string
    "passport_now": null,
    "pin": string
    "reg_number": string
    "s_name": string
    "status": number,
    "status_name": string
}

const DiplomaCertificatesApi = {
    async getDiplomaApi(): Promise<DiplomaApiType[]> {
        const {data} = await axiosInstance.get('/api/v1/otm/diploma-list');
        if(data.result.data) {

            const modifiedForeignDiplomas: DiplomaApiType[] = data.result.data.foreign_diplomas.map((item: ForeignDiplomaType) => {
                return {
                    id: item.application_number,
                    degree_name: item.degree,
                    institution_name: item.otm_name,
                    speciality_name: item.faculty,
                    edu_starting_date: item.education_started_year,
                    edu_finishing_date: item.education_finished_year,
                    diploma_serial: item.certificate_seria,
                    diploma_number: item.certificate_number,
                    diploma_given_date: item.diploma_given_date,
                    status_name: item.status_name
                }
            })

            return [...modifiedForeignDiplomas, ...data.result.data.uz_diplomas];
        }

        return [];
    },

    async getCertificateApi() {
        const {data} = await axiosInstance.get('/api/v1/otm/certifications-list')
        return data.result.data;
    }
}

export default DiplomaCertificatesApi;