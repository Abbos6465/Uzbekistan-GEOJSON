import axiosInstance from "@/api/axiosInstance";
import { useCommonStore } from "@/store/Common";
import type {
  NotificationsType,
  TotalStatsType,
  WorkbookPrintApiType,
  WorkBookSingleType,
} from "@/types";

type VacanciesApiType = {
  active: boolean;
  additional_info: null;
  belong_argos: boolean;
  code_gs: string;
  company_name: string;
  company_oked: string;
  company_profile_name: string;
  company_soato_code: string;
  company_soato_code4: string;
  company_soogu: string;
  company_tin: string;
  created_at: number;
  date_start: number;
  date_stop: number;
  full_text: string;
  hide_salary: boolean;
  id: number;
  kodp_pn: string;
  manually: boolean;
  position_conditions: string;
  position_duties: string;
  position_id: number;
  position_kodp_pn: string;
  position_kodp_type: string;
  position_mark_surcharge: boolean;
  position_name: string;
  position_name_ru: string;
  position_rank: null;
  position_rate: string;
  position_rate_coefficient: null;
  position_requirements: string;
  position_salary: null;
  position_salary_manually: null;
  position_type: null;
  structure_id: number;
  structure_name: string;
  structure_name_ru: string;
  transaction_id: null;
  updated_at: number;
  vacancy_address: null;
  vacancy_immediately: boolean;
  vacancy_soato_code: string;
};
type WomenServicesType = {
  service_name: string;
  start_date: string;
  end_date: string | null;
  status: string | null;
};

type YouthListType = {
  child_help_type_id: number | null;
  child_help_type_name: string | null;
  help_date: string;
  help_type_id: number;
  help_type_name: string;
  helped_date: string | null;
  pin: number;
};
type WorkbookProfileType = {
  birth_date: string;
  data: {
    birth_country: string;
    birth_country_id: string;
    birth_date: string;
    birth_place: string;
    citizenship: string;
    citizenship_id: string;
    date_begin_document: string;
    date_end_document: string;
    doc_give_place: string;
    doc_give_place_id: string;
    document: string;
    livestatus: string;
    name_engl: string;
    name_latin: string;
    nationality: string;
    nationality_id: string;
    patronym_latin: string;
    pin: string;
    sex: string;
    soliq: {
      address: string;
      birth_date: string;
      error: number;
      gender: string;
      name: string;
      ns10_code_id: string;
      ns11_code_id: string;
      patronymic: string;
      surname: string;
      tin_gov: string;
      tin_soliq: string;
    };
    surname_engl: string;
    surname_latin: string;
  };
  person_name: string;
  person_patronymic: string;
  person_pin: string;
  person_sex: boolean;
  person_surname: string;
  person_tin: string;
};
type RelativesApiType = {
  currentposition: {
    company_name: string;
    company_oked: string;
    company_profile_name: string;
    company_soato_code: string;
    company_soogu: string;
    company_tin: string;
    contract_date: string;
    contract_number: string;
    contract_salary: null;
    date_start: string;
    date_stop: string;
    error_id: null;
    id: number;
    kodp_nskz_code: string;
    kodp_personal_category: string;
    kodp_pn: string;
    kodp_type: string;
    order_article: null;
    order_date: string;
    order_number: string;
    parent_id: null;
    person_pin: string;
    person_tin: string;
    position_name: string;
    structure_name: string;
  };
  id: number;
  person_id: number;
  person_sex: number;
  profile: {
    address: string;
    address_soato: number;
    birth_country: string;
    birth_date: string;
    birth_place: string;
    id: number;
    manually: number;
    name_latin: string;
    patronym_latin: string;
    pension: null;
    person_passport: string;
    person_pin: string;
    person_tin: string;
    sex: number;
    surname_latin: string;
  };
  relative_person_id: number;
  relative_person_sex: number;
  relative_type: number;
  relative_type_name: string;
};
type WorkBookApiType = {
  actives: WorkBookSingleType[][];
  history: WorkBookSingleType[][];
};
type UploadedFileType = {
  file_name: string;
  path: string;
};

export default {
  async getProfilePhotoApi() {
    return await axiosInstance
      .post("api/v1/workbook/person-photo")
      .then(({ data }) => {
        return data.result.data;
      });
  },

  async getProfileInfoApi(): Promise<WorkbookProfileType> {
    return await axiosInstance
      .get("api/v1/workbook/profile")
      .then(({ data }) => data.result.data);
  },

  async getRelativesApi(): Promise<RelativesApiType[]> {
    return await axiosInstance
      .get("api/v1/relatives/")
      .then(({ data }) => data.result.data);
  },

  async getWorkbookApi(): Promise<WorkBookApiType> {
    return await axiosInstance
      .get("api/v1/workbook/")
      .then(({ data }) => data.result.data);
  },

  async getWorkbookPrintApi(): Promise<WorkbookPrintApiType[]> {
    const { data } = await axiosInstance.get("api/v1/workbook/workbook-print");
    return data.result.data.workbook;
  },

  async getWorkbookDownloadApi() {
    const { data } = await axiosInstance.get(
      "api/v1/workbook/workbook-download"
    );
    return data.result.data;
  },

  async getCVDownloadApi() {
    const { data } = await axiosInstance.get("api/v1/workbook/cv-download");
    return data.result.data;
  },

  async getCurrentJobsListApi(params?: any) {
    const { data } = await axiosInstance.get(
      "api/v1/workbook/active-positions",
      { params }
    );
    return data.result.data.map((item: any) => {
      item.company_tin = item.position[0].company_tin;

      return item;
    });
  },

  async getReferenceDownloadApi() {
    const CommonStore = useCommonStore();

    const { data } = await axiosInstance.get(
      "api/v1/workbook/reference-download",
      {
        params: {
          company_tin: CommonStore.computedActiveJob?.company_tin,
        },
      }
    );
    return data.result.data;
  },

  async getVacanciesApi(): Promise<VacanciesApiType[]> {
    const { data } = await axiosInstance.get("api/v1/vacancies/similar/list");
    return data.result.data;
  },
  async getEmoduleWomenServiceApi(): Promise<WomenServicesType[]> {
    const { data } = await axiosInstance.get(
      "api/v1/cabinet/resources/emodule-woman/case-service"
    );
    return data.result.data?.data ?? [];
  },
  async getYouthLeaderApi(): Promise<YouthListType[]> {
    const { data } = await axiosInstance.get(
      "api/v1/cabinet/resources/youth-notebook/citizen/emp-program"
    );
    return data.result.data;
  },
  async uploadFileApi(payload: FormData): Promise<UploadedFileType> {
    return await axiosInstance
      .post("api/v1/cabinet/file", payload)
      .then(({ data }) => data.result.data);
  },

  async getCVsApi() {
    return await axiosInstance
      .get("api/v1/cabinet/my-resumes")
      .then(({ data }) => data.result.data);
  },

  async getTotalStatsApi(): Promise<TotalStatsType> {
    return await axiosInstance
      .get("api/v1/workbook/data-number/total")
      .then(({ data }) => data.result.data);
  },

  async postFCMTokenApi(token: string) {
    return await axiosInstance
        .post("api/v1/cabinet/fms-token", {fcm_token: token})
        .then(({ data }) => data.result.data);
  },

  async getNotificationsApi(page: number): Promise<NotificationsType[]> {
    return await axiosInstance
        .get('api/v1/cabinet/notifications', {
          params: {
            page,
            per_page: 25,
            order: 'desc'
          }
        })
        .then(({data}) => data.result.data);
  },

  async updateNotificationAsReadApi(id: string | number): Promise<NotificationsType[]> {
    return await axiosInstance.put(`api/v1/cabinet/notifications/${id}/read`);
  }
};
