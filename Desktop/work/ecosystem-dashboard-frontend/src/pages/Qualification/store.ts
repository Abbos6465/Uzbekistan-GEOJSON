import {defineStore} from "pinia";
import QualificationApi from "@/pages/Qualification/api";
import useToast from "@/components/UI/AppToast/useToast";

const {toast} = useToast();

type QualificationStoreType = {
    courses: [],
    current_direction: {} | null
}

export const useQualificationStore = defineStore("Qualification", {
    state: (): QualificationStoreType => ({
        courses: [],
        current_direction: null
    }),

    actions: {
        async saveRateModule(params = {}) {
            return new Promise((resolve, reject) => {
                QualificationApi.saveRateModule(params)
                    .then(res => {
                        toast.success("Muvaffaqqiyatli baholandi")
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
        },

        async getMyCourses(params = {}) {
            return new Promise((resolve, reject) => {
                QualificationApi.getMyCoursesApi(params)
                    .then(res => {
                        this.courses = res.courses;
                        this.current_direction = res.current_direction;
                        resolve(res);
                    }).catch(err=>{
                    console.log(err);
                })
            })
        }
    }
})