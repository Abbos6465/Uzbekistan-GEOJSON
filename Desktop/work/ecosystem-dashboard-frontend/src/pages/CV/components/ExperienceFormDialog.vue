<script
    setup
    lang="ts"
>
import { computed, ref, watch } from "vue";
import { Dialog } from "@/components/UI";

type PropsType = {
  isOpen: boolean
  formData: any,
  index: number | null
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:isOpen', 'reset', 'submit']);

const form = ref(props.formData);

const computedIsOpenDialog = computed({
  get() {
    return props.isOpen
  },
  set(newValue) {
    if(!newValue) emit('reset');
    emit('update:isOpen', newValue);
  }
})

function submit() {
  if(form.value.until) {
    const keys = Object.keys(form.value);
    if(keys.includes('date_stop')) form.value.date_stop = null;
    if(keys.includes('stop_year')) form.value.stop_year = null;
  }

  delete form.value.until;
  emit('submit', form.value);
  computedIsOpenDialog.value = false;
}

watch(() => props.formData, (newValue) => {
  if(newValue) {
    form.value = JSON.parse(JSON.stringify(newValue));
  }
})

</script>

<template>
  <Dialog
      v-model="computedIsOpenDialog"
      width="1500px"
  >
    <template #title>
      <slot name="title"/>
    </template>

    <v-container
        class="px-0 pb-0"
        style="max-width: unset"
    >
      <v-row>
        <slot
            name="content"
            v-bind="{form}"
        />
      </v-row>

      <v-btn
          height="46px"
          class="v-btn--primary rounded-lg no-uppercase ml-auto d-flex mt-5"
          @click="submit"
      >
        {{ index === null ? $t('common.add') : $t('cabinet.save') }}
      </v-btn>
    </v-container>
  </Dialog>
</template>