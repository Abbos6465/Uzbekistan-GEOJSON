import { reactive, ref } from "vue";
import { generateRandomID } from "@/utils/helper";

interface IToast {
  id: string,
  text: string,
  type: string
}

const DURATION = ref(4000)
const items: IToast[] = reactive([])

export default function() {
  const toast = {
    success: (text: string, duration: number = 0) => {
      return init(text, duration, 'success')
    },
    error: (text: string, duration: number = 0) => {
      return init(text, duration, 'error')
    },
    loading: (text: string, duration: number = 0) => {
      return init(text, duration, 'loading')
    }
  }

  function init (text: string, duration: number, type: string) {
    const id = generateRandomID();

    items.push({ id, text, type });

    deleteFunction(id);

    if(duration) DURATION.value = duration;

    return id;
  }

  function deleteFunction (id: string) {
    setTimeout(() => {
      const itemCollections = document.querySelectorAll('.app-toast__item');
      const foundedItem = [...itemCollections].find(i => i.id === id);

      if(foundedItem?.attributes.isHovered && +foundedItem?.attributes.isHovered.value) return deleteFunction(id);

      const index = items.findIndex(item => item.id === id)
      items.splice(index, 1)
    }, DURATION.value)
  }

  return {
    toast, items
  }
}