import { defineStore } from "pinia";
import CVApi from "@/pages/CV/api";
import type { WorkType, CVList, PersonalQualityType } from "@/pages/CV/types";
import CommonApi from "@/api/commonApi";
import useLoading from "@/composables/useLoading";

type StateType = {
    workTypes: WorkType[]
    cvList: CVList[]
    selectedCV: CVList | null
    personalQualities: PersonalQualityType[]
}

export const useCVStore = defineStore('cv', {
    state: (): StateType => ({
        workTypes: [],
        cvList: [],
        selectedCV: null,
        personalQualities: []
    }),
    actions: {
        async getCVsList() {
            const {changeIsRequestLoading} = useLoading();

            changeIsRequestLoading('getCVsList', true);
            this.cvList = await CommonApi
                .getCVsApi()
                .finally(() => {
                    changeIsRequestLoading('getCVsList', false);
                });
        },

        async getWorkTypes() {
            if(this.workTypes.length) return;

            this.workTypes = await CVApi.getWorkTypesApi();
        },

        async getPersonalQualities() {
            if(this.personalQualities.length) return;

            this.personalQualities = await CVApi.getPersonalQualitiesApi();
        },

        getAppropriateWorkTypeName(id: number | string): string  {
            return this.workTypes.find(i => +i.id === +id)?.name ?? '';
        },

        selectCV(id: string | number) {
            const foundCV = this.cvList.find(cv => cv.id === id);
            if(foundCV) this.selectedCV = foundCV;
        }
    },

    getters: {
        activeCV(state): CVList | null {
            if(!state.cvList.length) return null;

            return state.cvList.find(cv => cv.active)!;
        },

        getSelectedCV(state): CVList | null {
            if(!state.selectedCV) return this.activeCV;

            return state.selectedCV;
        }
    }
})