<script
    setup
    lang="ts"
>
import { computed, onMounted, ref, watch } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";
import { generateRandomID } from "@/utils/helper";

type PropsType = {
  title?: string
  headers: {
    key: string
    title: string
  }[]
  items: any[]
  itemValue: string | number
  loading?: boolean
  collapsable?: boolean
  collapsed?: (number | string)[]
}

const props = defineProps<PropsType>();
const emit = defineEmits(['update:collapsed'])

const id = generateRandomID();
const isOpen = ref(false);
const dataTable = ref<HTMLDivElement | null>(null);
const expanded = ref<(string | number)[]>([]);
const expandContent = ref<HTMLDivElement | null>(null);
const expandChildren = ref<any[]>([]);

const computedCollapsedItems = computed({
  get() {
    return props.collapsed
  },
  set(newValue) {
    emit('update:collapsed', newValue)
  }
})

function toggleExpandContent(index: number, id: number | string, children: any[]) {
  const trList = [...dataTable.value!.getElementsByClassName('expansion-data-table__tr')];
  const selectedTr = trList[index];
  const nextSibling = selectedTr.nextSibling;

  if (!expanded.value.includes(id)) {
    expandChildren.value = children;
    expanded.value = [id];

    trList.forEach((i, idx) => {
      if (idx !== index) {
        i.nextSibling.style.height = '0px'
      }
    })

    setTimeout(() => {
      nextSibling.appendChild(expandContent.value)
      nextSibling!.style.height = expandContent.value?.offsetHeight + 'px'
    })
  } else {
    expanded.value = [];
    expandChildren.value = [];
    nextSibling!.style.height = 0 + 'px';
  }

}

function closeTable() {
  if(!dataTable.value) return;

  const table = <HTMLElement>dataTable.value!.getElementsByClassName('expansion-data-table')[0];
  const tableWrapperHeight = table.getElementsByClassName('v-table__wrapper')[0].getBoundingClientRect().height;

  table.style.height = headerHeight() + tableWrapperHeight + 'px'
  table.style.height = headerHeight() + 'px';

  isOpen.value = false;
}

function openTable() {
  computedCollapsedItems.value = [];

  const table = dataTable.value!.getElementsByClassName('expansion-data-table')[0];
  const tableWrapperHeight = table.getElementsByClassName('v-table__wrapper')[0].getBoundingClientRect().height;

  table.style.height = headerHeight() + tableWrapperHeight + 'px';
  setTimeout(() => {
    table.style.height = '';
  }, 300)

  computedCollapsedItems.value = [id];
  isOpen.value = true;
}

function headerHeight() {
  isOpen.value = false;
  return dataTable.value!
      .getElementsByClassName('expansion-data-table__header')[0]
      .getBoundingClientRect().height;
}

function toggleTable() {
  if (!isOpen.value) {
    openTable()
  } else {
    closeTable();
    if (computedCollapsedItems.value) computedCollapsedItems.value = [];
  }
}

onMounted(() => {
  if (props.collapsable) {
    setTimeout(() => {
      closeTable()
    }, 300)
  }
})

watch(() => props.collapsed, () => {
  if (!props.collapsed?.includes(id)) closeTable()
})

</script>

<template>
  <div
      ref="dataTable"
      class="position-relative"
  >
    <v-data-table
        v-model:expanded="expanded"
        :items="items"
        :headers="headers"
        :item-value="itemValue"
        :loading="loading ? '#2988F5' : false"
        class="rounded-lg expansion-data-table"
    >

      <template
          v-if="title"
          v-slot:top="item"
      >
        <v-toolbar
            height="fit-content"
            class="expansion-data-table__header rounded-t-lg pa-4"
            color="#fff"
        >
          <div class="mr-10">
            <h2 class="expansion-data-table__title">
              <slot name="title"/>
            </h2>
            <h4 class="block-title--20">{{ title }}</h4>
          </div>

          <div class="d-flex justify-end ml-auto">
            <v-btn
                v-if="collapsable"
                height="46px"
                variant="flat"
                color="rgba(41, 136, 245, 0.15)"
                class="no-uppercase mr-4 rounded-lg"
                style="color: #2988F5;"
                @click="toggleTable"
            >
              {{ $t('common.more') }}

              <svg
                  data-src="/img/icons/arrow-up.svg"
                  style="color: #2988F5; width: 11px; height: 16px; transition: transform .3s"
                  :class="['ml-2', {
                    'rotate-180-on-active': !isOpen
                  }]"
              />
            </v-btn>

            <slot
                name="top-button"
                v-bind="item?.items[0].raw"
            />
          </div>

        </v-toolbar>
      </template>

      <template #item="{item, columns, toggleExpand, isExpanded}">
        <tr class="expansion-data-table__tr">
          <slot
              name="body-td"
              v-bind="{item, columns}"
          />
          <td v-if="item.raw.children?.length">
            <v-btn
                icon
                width="40px"
                height="40px"
                elevation="0"
                style="border-radius: 10px; box-shadow: 0 4px 9px 0 rgba(0, 0, 0, 0.05)!important;"
                @click="toggleExpandContent(item.index, item.raw.id, item.raw.children)"
            >
              <svg
                  data-src="/img/icons/chevron-bottom.svg"
                  style="color: #2988F5; width: 15px; height: 7px; transition: transform .3s"
                  :class="{'rotate-180-on-active': isExpanded(item)}"
              />
            </v-btn>
          </td>
        </tr>
        <div/>
      </template>

      <template #headers/>
      <template #bottom/>
    </v-data-table>

    <div
        ref="expandContent"
        class="expansion-data-table__expand-content"
    >
      <div>
        <table
            class="w-100"
            style="border-spacing: 0"
        >
          <tbody>
          <tr
              v-for="(child, index) in expandChildren"
              :key="index"
          >
            <slot
                name="expand-td"
                v-bind="child"
            />
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.expansion-data-table {
  transition: height .3s;
  border: 1px solid $stroke-color;
  box-shadow: 0px 4px 9px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;

  .v-table__wrapper {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  &__title {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: $soft-color;
    margin-bottom: 12px;
  }

  &__expand-content {
    position: absolute;
    width: 100%;
    transition: top .3s;
    opacity: 1;

    td {
      min-height: 72px;
      padding: 15px 20px;
      border-bottom: 1px solid #E5E7EB;
      position: relative;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;

      &:first-child {
        padding-left: 0;

        div {
          display: flex;
          align-items: center;

          &:before {
            content: '';
            height: 35px;
            width: 1px;
            background-color: $dark-grey;
            margin: 0 34px 0 25px;
          }

          &:after {
            position: absolute;
            content: '';
            height: 1px;
            width: 14px;
            background-color: $dark-gray;
            left: 25px;
            top: calc(50% + 17px);
            transform: translateY(-50%);
          }
        }
      }
    }
  }

  &__tr {
    td {
      border-top: 1px solid $stroke-color !important;
      border-bottom: 1px solid $stroke-color !important;
      background-color: #FAFAFB !important;
      padding: 13px 32px !important;
      position: relative;
      z-index: 1;

      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: calc(100% - 26px);
        width: 1px;
        background-color: $stroke-color;
      }

      &:first-child {
        padding-left: 61px !important;

        &:before {
          left: 15px;
        }

        &:after {
          content: '';
          position: absolute;
          width: 14px;
          height: 1px;
          background-color: $blue-color;
          top: 50%;
          left: 16px;
          transform: translateY(-50%);
        }
      }
    }

    &:nth-last-child(2) {
      td {
        border-bottom: 0 !important;
      }
    }
  }

  tbody {
    > div {
      height: 0;
      transition: height .3s;
    }
  }
}
</style>