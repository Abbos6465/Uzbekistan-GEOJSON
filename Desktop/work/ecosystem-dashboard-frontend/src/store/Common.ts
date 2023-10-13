import { defineStore } from "pinia";
import api from "@/api/commonApi";
import commonApi from "@/api/commonApi";
import type {
    DiplomaType,
    ProfileInfoType,
    VacanciesType,
    WorkBookSingleType,
    WomenServicesType,
    YouthListType,
    NotificationsType
} from "@/types";
import useLoading from "@/composables/useLoading";
import { useI18n } from "vue-i18n";
import DiplomaCertificatesApi from "@/pages/DiplomaCertificates/api";
import CVApi from "@/pages/CV/api";
import type { LanguageLevelType, LanguageType } from "@/pages/CV/types";
import CommonApi from "@/api/commonApi";
import axiosInstance from "@/api/axiosInstance";

type StoreState = {
    profilePhoto: string,
    currentJobs: CurrentJobsType[]
    selectedJob: string
    vacancies: VacanciesType[] | []
    womenServices: WomenServicesType[] | []
    youthList: YouthListType[] | []
    profileInfo: ProfileInfoType | null
    relatives: RelativeType[]
    currentWorkbook: {
        organization: string,
        positions: WorkBookSingleType[]
    }[]
    historyWorkBook: {
        organization: string,
        positions: WorkBookSingleType[]
    }[]
    diplomas: DiplomaType[]
    languages: LanguageType[]
    languageLevels: LanguageLevelType[]
    notifications: {
        list: NotificationsType[],
        paginate: {
            "count"?: number
            "current_page"?: number
            "last_page"?: number
            "per_page"?: number
            "total"?: number
            "total_pages"?: number
        }
    }
    loadedImages: any
}
type RelativeType = {
    order: number
    fullName: string
    relativeType: number
    birthDate: string
    birthPlace: string
    workAndPosition: string
    address: string
    gender: 'male' | 'female'
}
type CurrentJobsType = {
    "company_name": string
    "experience": {
        "months": number,
        "years": number
    },
    "company_tin": string
    "position": CurrentJobsPosition[]
}
type CurrentJobsPosition = {
    "company_tin": string
    "position_name": string
    "position_name_ru": string
    work_type: number
}

export const useCommonStore = defineStore('Common', {
    state: (): StoreState => ({
        profilePhoto: '',
        currentJobs: [],
        selectedJob: '',
        vacancies: [],
        womenServices: [],
        youthList: [],
        profileInfo: null,
        relatives: [],
        currentWorkbook: [],
        historyWorkBook: [],
        diplomas: [],
        languages: [],
        languageLevels: [],
        notifications: {
            list: [],
            paginate: {
                current_page: 1
            }
        },
        loadedImages: {}
    }),

    getters: {
        computedActiveJob(): CurrentJobsType | null {
            if(!this.selectedJob || !this.currentJobs) return null;

            const foundedJob = this.currentJobs.find((item: CurrentJobsType) => item.company_tin === this.selectedJob);
            return foundedJob ?? null;
        },

        computedPositions(): string {
            if(!this.currentJobs.length) return '';

            const {locale} = useI18n();
            const positions: CurrentJobsPosition[] = [];

            this.currentJobs.forEach(job => positions.push(...job.position));

            const positionNames: string[] = positions.map(i => locale.value === 'ru' ? i.position_name_ru : i.position_name);

            return positionNames.join(', ');
        }
    },

    actions: {
        async getProfilePhoto() {
            const {changeIsRequestLoading, isRequestLoading} = useLoading();

            if(this.profilePhoto || isRequestLoading('getProfilePhotoApi')) return;

            changeIsRequestLoading('getProfilePhotoApi', true);

            await api
                .getProfilePhotoApi()
                .then((data) => {
                    this.profilePhoto = data;
                    changeIsRequestLoading('getProfilePhotoApi', false);
                })
        },

        async getProfileInfo() {
            const data = await api.getProfileInfoApi();

            this.profileInfo = {
                address: data.data.soliq?.address,
                documentId: data.data.document,
                name: data.person_name,
                surname: data.person_surname,
                patronymic: data.person_patronymic,
                fullName: `${ data.person_surname } ${ data.person_name } ${ data.person_patronymic }`,
                nationality: data.data.nationality,
                birthdate: data.birth_date,
                birthCountry: data.data.birth_country,
                birthCity: data.data.birth_place,
                citizenship: data.data.citizenship,
                gender: data.person_sex ? 'male' : 'female',
                pin: data.person_pin,
                tin: data.person_tin,
                documentFrom: data.data.date_begin_document,
                documentUntil: data.data.date_end_document,
                documentGivenFrom: data.data.doc_give_place
            }
        },

        async getVacancies() {
            const {changeIsRequestLoading} = useLoading();
            changeIsRequestLoading('getVacancies', true);

            this.vacancies = await api
                .getVacanciesApi()
                .finally(() => {
                    changeIsRequestLoading('getVacancies', false);
                });
        },

        async getEmoduleService() {
            this.womenServices = await api.getEmoduleWomenServiceApi();
        },

        async getYouthLeader() {
            this.youthList = await api.getYouthLeaderApi();
        },

        async getCurrentJobsList(params: any = {}) {
            const {changeIsRequestLoading, isRequestLoading} = useLoading();

            if(isRequestLoading('getCurrentJobsList') || this.currentJobs.length) return;

            changeIsRequestLoading('getCurrentJobsList', true);
            this.currentJobs = await api
                .getCurrentJobsListApi(params)
                .finally(() => {
                    changeIsRequestLoading('getCurrentJobsList', false);
                });

            if (!this.currentJobs?.length || this.selectedJob) return;
            this.currentJobs.forEach(i => {
                const foundedItem = i.position.find(p => p.work_type === 1);
                if(foundedItem) this.selectedJob = foundedItem.company_tin
            })
        },

        async getRelatives() {
            const {changeIsRequestLoading} = useLoading();

            changeIsRequestLoading('getRelatives', true)
            await commonApi
                .getRelativesApi()
                .then((response) => {
                    if(!response) return;

                    this.relatives = response.map((item, index) => {
                        const modifiedItem: RelativeType = {
                            order: index + 1,
                            fullName: `${item.profile.surname_latin} ${item.profile.name_latin} ${item.profile.patronym_latin}`,
                            relativeType: item.relative_type,
                            birthDate: item.profile.birth_date,
                            birthPlace: item.profile.birth_place,
                            workAndPosition: item.currentposition?.company_name,
                            address: item.profile.address,
                            gender: +item.profile.sex === 1 ? 'male' : 'female'
                        }

                        return modifiedItem;
                    })
                })
                .finally(() => {
                    changeIsRequestLoading('getRelatives', false)
                });
        },

        async getWorkbook() {
            const { changeIsRequestLoading } = useLoading();

            changeIsRequestLoading('getWorkbook', true);
            const { actives, history } = await commonApi
                .getWorkbookApi()
                .finally(() => {
                    changeIsRequestLoading('getWorkbook', false);
                });

            this.currentWorkbook = this.childrenDistribution(actives);
            this.historyWorkBook = this.childrenDistribution(history);
        },

        async getDiplomas() {
            const { changeIsRequestLoading } = useLoading();
            changeIsRequestLoading('getDiplomaApi', true);

            await DiplomaCertificatesApi
                .getDiplomaApi()
                .then((data) => {
                    if(!data) return;

                    this.diplomas = data.map((item, index) => {
                        return {
                            order: index + 1,
                            degree_name: item.degree_name,
                            institution_name: item.institution_name,
                            speciality_name: item.speciality_name,
                            edu_starting_date: item.edu_starting_date,
                            edu_finishing_date: item.edu_finishing_date,
                            diploma_given_date: item.diploma_given_date,
                            diploma_serial: `${ item.diploma_serial }${ item.diploma_number }`,
                            status_name: item.status_name
                        };
                    });
                })
                .finally(() => {
                    changeIsRequestLoading('getDiplomaApi', false);
                })
        },

        async getLanguages() {
            if(this.languages.length) return;

            this.languages = await CVApi.getLanguagesApi();
        },

        async getLanguageLevels() {
            if(this.languageLevels.length) return;

            this.languageLevels = await CVApi.getLanguageLevelsApi();
        },

        async getNotifications(page: number = 1) {
            const { changeIsRequestLoading, isRequestLoading } = useLoading();
            if(isRequestLoading('getNotifications')) return;

            changeIsRequestLoading('getNotifications', true);
            await CommonApi
                .getNotificationsApi(page)
                .then((data) => {
                    if(data.paginate.current_page === this.notifications.paginate.current_page || data.paginate.current_page === 1) {
                        this.notifications = {
                            list: data.list,
                            paginate: data.paginate
                        }
                    }

                    else {
                        this.notifications = {
                            list: [
                                ...this.notifications.list,
                                ...data.list
                            ],
                            paginate: data.paginate
                        }
                    }
                })
                .finally(() => {
                    changeIsRequestLoading('getNotifications', false);
                    document.addEventListener("visibilitychange", () => {
                        if (!document.hidden) {
                            this.getNotifications();
                        }
                    });
                });
        },

        async getImage(href: string) {
            if(!Object.keys(this.loadedImages).includes(href)) {
                return await axiosInstance
                    .get(href)
                    .then(({data}) => {
                        this.loadedImages[href] = data;
                        return data;
                    })
            }
            else {
                return this.loadedImages[href];
            }
        },

        getAppropriateLangName(id: string | number): string {
            if(!this.languages.length) return '';

            return this.languages.find(i => +i.id === +id)?.name ?? '';
        },

        childrenDistribution(workbook: WorkBookSingleType[][]) {
            return workbook
                .map(item => {
                    return {
                        organization: item[0].actual_company_name,
                        positions: item
                    }
                })
                .map(item => {
                    const employment = item.positions.find(i => i.transaction_type_id === 1);

                    if (employment) {
                        employment.children = item.positions.filter(i => i.transaction_type_id !== 1)

                        item.positions = [employment];
                    }

                    return item;
                })
        },

        changeSelectedJob(jobTin: string) {
            this.selectedJob = jobTin
        }
    }
})