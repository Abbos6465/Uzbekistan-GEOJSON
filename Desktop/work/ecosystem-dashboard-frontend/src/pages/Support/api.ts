import axiosInstance from "@/api/axiosInstance";

const SupportApi = {
    async postQuestion(payload: string) {
        return await axiosInstance
            .post('api/v1/ecosys/question', {q: payload})
            .then(({data}) => data.result.data);
    }
}

export default SupportApi;