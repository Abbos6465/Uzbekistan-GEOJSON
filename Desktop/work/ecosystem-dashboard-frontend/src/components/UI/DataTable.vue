<script
    setup
    lang="ts"
>
import { VDataTable } from "vuetify/labs/VDataTable";
import { computed, onMounted, ref, useSlots } from "vue";
import {useI18n} from "vue-i18n";

type PropsType = {
  items: any[]
  headers: any[]
  loading?: boolean
  noDataMessage?: string
  maxHeight?: string
  headerFixed?: boolean
}

const props = defineProps<PropsType>()

const slots = useSlots();

const dataTable = ref<HTMLElement | null>(null);

const {t} = useI18n();

const computedHeader = computed(() => {
  if(!props.headers) return;

  return props.headers.map(item => {
    if(typeof item === 'string') {
      item = {
        key: item,
        title: item
      }
    }

    item.sortable = false;

    return item;
  })
})

function insertDivAfterHeader() {
  const table = dataTable.value?.getElementsByTagName('table')[0];
  const header = dataTable.value?.getElementsByTagName('thead')[0];
  const newDiv = document.createElement('div');
  newDiv.className = 'mb-5'

  if(!header) return;
  table?.insertBefore(newDiv, header.nextSibling)
}

onMounted(() => {
  setTimeout(() => {
    insertDivAfterHeader()
  })

  if(props.maxHeight) {
    if(dataTable.value) {
      const tableWrapper: HTMLDivElement | null = dataTable.value.querySelector('.v-table__wrapper');

      if(tableWrapper) {
        tableWrapper.style.maxHeight = props.maxHeight;
        tableWrapper.style.marginTop = `75px`;

        const tbody = tableWrapper.querySelector('tbody tr');
        const thead = tableWrapper.querySelectorAll('thead th');
        if(tbody) {
          [...tbody.children].forEach((child, index) => {
            thead[index].style.width = getComputedStyle(child).width;
          })
        }
      }
    }
  }
})
</script>

<template>
  <div
      :class="['data-table', {
        'data-table--fixed': headerFixed
      }]"
      ref="dataTable"
  >
    <v-data-table
        v-model:items-per-page="items.length"
        :items="items"
        :headers="computedHeader"
        :sortable="false"
        :loading="loading ? '#2988F5' : false"
        class="rounded-lg"
    >
      <template
          v-for="slot in Object.keys(slots)"
          v-slot:[`item.${slot}`]="{item}"
      >
        <slot
            :name="slot"
            v-bind="item"
        />
      </template>

      <template #bottom/>

      <template #no-data>
        <slot
            v-if="Object.keys(slots).includes('no-data')"
            name="no-data"
        />

        <template v-else>
          {{ noDataMessage ? noDataMessage : t('main.empty') }}
        </template>
      </template>
    </v-data-table>
  </div>
</template>

<style lang="scss">
.data-table {

  &--fixed {
    position: relative;

    .v-table__wrapper {
      overflow-y: auto;
    }

    table > div {
      display: none;
    }

    thead {
      position: absolute;
      top: -70px;
      width: 100%;
    }
  }

  .v-table__wrapper {
    border-radius: 0;
  }

  .v-data-table .v-table__wrapper > table {
    > thead > tr th {
      background: $stroke-color;
      border-bottom: none;
      height: 47px;
      padding: 15px;
      border-right: 1px solid rgba(53, 123, 211, 0.17);
      color: $black-color;

      &:first-child {
        border-radius: 10px 0 0 10px;
      }

      &:last-child {
        border-radius: 0 10px 10px 0;
        border-right: none;
      }
    }

    tbody > tr {
      > td {
        background: #FAFAFB;
        border: 1px solid $stroke-color;
        border-right: 0;
        padding: 15px;
        font-size: 16px;
        vertical-align: middle;
        > * {
          //@include text-ellipsis(2);
        }

        &:last-child {
          border-right: 1px solid $stroke-color;
        }
      }

      &:first-child {
        td {
          &:first-child {
            border-top-left-radius: 10px;
          }

          &:last-child {
            border-top-right-radius: 10px;
          }
        }
      }

      &:last-child {
        td {
          &:first-child {
            border-bottom-left-radius: 10px;
          }

          &:last-child {
            border-bottom-right-radius: 10px;
          }
        }
      }
    }
  }
}
</style>