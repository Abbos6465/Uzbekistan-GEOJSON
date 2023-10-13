<script
    setup
    lang="ts"
>
import type { ContactDocType } from "@/pages/MyJob/types";
import { useI18n } from "vue-i18n";

type PropsType = {
  data: ContactDocType | null
}

defineProps<PropsType>();

const { locale } = useI18n();
</script>

<template>
  <div
      v-if="data"
      class="d-flex flex-column"
  >
    <h3
        align="center"
        class="mt-4 text-uppercase"
    >
      {{ $t('laborActivity.contractNumber') }}<br/>№ {{ $t('my-job.INNPP') }}
    </h3>
    <p class="clearFix">
      <strong class="left">
        {{ data.contract_date }}
      </strong>
    </p>
    <p>
      <strong>{{ data.company.name }}</strong> в лице
      <span>
        <strong>{{ $t(`contracts.employerType.${ data.contract_data?.employer_type }`) }}</strong>
      </span>
      &thinsp;<strong>{{ data.contract_data?.employer_name }}</strong>, действующего на основании
      <span>
        <strong>{{ $t(`contracts.actingBasis.${ data.contract_data?.acting_basis }`) }}</strong>
      </span>, именуемый в дальнейшем "Работодатель", с одной стороны и
      <strong v-if="data.individ">
        {{ data.individ.person_name }} {{ data.individ.person_surname }}
        {{ data.individ.person_patronymic }}
      </strong>, именуемый в дальнейшем "Работник", с другой стороны, заключили
      настоящий трудовой договор о нижеследующим:
    </p>
    <h3
        align="center"
        class="mb-3 mt-5"
    >
      1. ОБЩЕЕ ПОЛОЖЕНИЕ
    </h3>
    <table>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>1.1.</strong>
        </td>
        <td>
          <p>
            Работник
            <strong v-if="data.individ">
              {{ data.individ.person_name }} {{ data.individ.person_surname }}
              {{ data.individ.person_patronymic }}
            </strong>
            начиная с
            <strong>{{ data.contract_data?.date_start ?? "" }}</strong>
            принимается на работу в
            <strong>{{ data.company?.name }}</strong> на должность
            <strong>
              {{ locale === 'ru' ? data.position_name_ru : data.position_name }}
            </strong>
          </p>
        </td>
      </tr>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>1.2.</strong></td>
        <td>
          <p>
            Место работы Работника:
            <strong>
              {{ locale === 'ru' ? data.structure_name_ru : data.structure_name }}
            </strong>
          </p>
        </td>
      </tr>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>1.3.</strong>
        </td>
        <td>
          <p v-if="data.contract_data?.generalPosition.perpetualContract">
            Срок трудового договора: <strong>Белгиланмаган</strong>
          </p>
          <p v-else>
            Срок трудового договора:
            <strong>
              {{ data.contract_data?.generalPosition.limitationOfContract ?? '' }}
            </strong>
          </p>
        </td>
      </tr>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>1.4.</strong>
        </td>
        <td>
          <p>
            Испытательный срок:
            <strong>
              {{ data.contract_data?.trial_period }} месяц
            </strong
            >
          </p>
        </td>
      </tr>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>1.5.</strong>
        </td>
        <td>
          <p>
            Дата заключения договора:
            <strong>
              {{ data.contract_date }}
            </strong>
          </p>
        </td>
      </tr>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>1.6.</strong>
        </td>
        <td>
          <p>
            <strong>Работник</strong> будет выполнят работу на основании
            к прилагаемому настоящему договору функциональных
            обязанностей, тарифно-квалификационной характеристики
            должности (работы) в соответствии законодательством.
          </p>
        </td>
      </tr>
      <tr
          v-if="data.contract_data && data.contract_data[1]"
          v-for="data in data.contract_data[1]"
      >
        <td
            width="40"
            valign="top"
        >
          <strong>{{ data.id }}</strong>
        </td>
        <td>
          <p>{{ data.text }}</p>
        </td>
      </tr>
    </table>
    <h3
        align="center"
        class="mb-3 mt-4"
    >
      2. ПРАВА И ОБЯЗАННОСТИ
    </h3>
    <table>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>2.1.</strong>
        </td>
        <td>
          <p>Обязанности Работодателя:</p>
          <table>
            <tr>
              <td
                  width="40"
                  valign="top"
              >
                <strong>2.1.1.</strong>
              </td>
              <td>
                <p>
                  Организовать труд Работников, создавать условия труда,
                  предусмотренных законодательством, ознакомить
                  функциональными обязанностями, правилами внутреннего
                  трудового распорядка, этического поведения, охраны
                  труда и техники безопасности, о нераспространения
                  служебных тайн, коллективным договорам и другими
                  локальными документами.
                </p>
              </td>
            </tr>
            <tr>
              <td
                  width="40"
                  valign="top"
              >
                <strong>2.1.2.</strong>
              </td>
              <td>
                <p>Своевременно выплачивать заработную плату.</p>
              </td>
            </tr>
            <tr>
              <td
                  width="40"
                  valign="top"
              >
                <strong>2.1.3.</strong>
              </td>
              <td>
                <p>
                  Создавать условия для безопасного и эффективного
                  труда, обучение, инструктирование безопасным условиям
                  труда Работника.
                </p>
              </td>
            </tr>
            <tr>
              <td
                  width="40"
                  valign="top"
              >
                <strong>2.1.4.</strong>
              </td>
              <td>
                <p>
                  Оборудовать рабочего места в соответствии с правилами
                  охраны труда и техники безопасности.
                </p>
              </td>
            </tr>
            <tr
                v-if="data.contract_data && data.contract_data[2.1]"
                v-for="data in data.contract_data[2.1]"
            >
              <td
                  width="40"
                  valign="top"
              >
                <strong>{{ data.id }}</strong>
              </td>
              <td>
                <p>{{ data.text }}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <table>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>2.2.</strong>
        </td>
        <td>
          <p>Обязанности Работника:</p>
          <table>
            <tr>
              <td
                  width="40"
                  valign="top"
              >
                <strong>2.2.1.</strong>
              </td>
              <td>
                <p>
                  Соблюдать трудовую дисциплину, правила внутреннего
                  трудового распорядка и этического поведения.
                </p>
              </td>
            </tr>
            <tr>
              <td
                  width="40"
                  valign="top"
              >
                <strong>2.2.2.</strong>
              </td>
              <td>
                <p>
                  Своевременно и точно выполнять законные распоряжения
                  Работодателя.
                </p>
              </td>
            </tr>
            <tr>
              <td
                  width="40"
                  valign="top"
              >
                <strong>2.2.3.</strong>
              </td>
              <td>
                <p>
                  Систематически повышать свою профессиональную
                  квалификацию организованными учебными центрами, также
                  изучать нормативно-правовые акты для совершенствования
                  своих практических и теоретических знаний.
                </p>
              </td>
            </tr>
            <tr>
              <td
                  width="40"
                  valign="top"
              >
                <strong>2.2.4.</strong>
              </td>
              <td>
                <p>
                  Выполнять своевременно и добросовестно возложенные
                  задачи, и должностные обязанности в соответствии с
                  настоящим трудовым договором.
                </p>
              </td>
            </tr>
            <tr>
              <td
                  width="40"
                  valign="top"
              >
                <strong>2.2.5.</strong>
              </td>
              <td>
                <p>
                  Соблюдать требования по охране труда, техники
                  безопасности и противопожарной безопасности.
                </p>
              </td>
            </tr>
            <tr
                v-if="data.contract_data && data.contract_data[2.2]"
                v-for="data in data.contract_data[2.2]"
            >
              <td
                  width="40"
                  valign="top"
              >
                <strong>{{ data.id }}</strong>
              </td>
              <td>
                <p>{{ data.text }}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <h3
        align="center"
        class="mb-3 mt-5"
    >
      3. РАБОЧЕЕ ВРЕМЯ И ВРЕМЯ ОТДЫХА
    </h3>
    <table>
      <tr>
        <td
            width="40"
            valign="top"
        ><strong>3.1.</strong></td>
        <td>
          <p>
            Режим рабочего времени:
            <strong>
              {{ data.contract_data?.working_hour_start }}
              -
              {{ data.contract_data?.working_hour_end }}
            </strong
            >
          </p>
        </td>
      </tr>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>3.2.</strong>
        </td>
        <td>
          <p>
            В соответствии с законодательством Работник с его согласия
            может привлекаться на работу в выходные и праздничные дни.
          </p>
        </td>
      </tr>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>3.3.</strong>
        </td>
        <td>
          <p>
            В соответствии с законодательством Работник с его согласия
            может привлекаться на работу в выходные и праздничные дни.
          </p>
        </td>
      </tr>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>3.4.</strong>
        </td>
        <td>
          <p>
            Работнику (в соответствии с графиком отпусков)
            устанавливается ежегодный основной отпуск не менее
            <strong>{{ data.contract_data?.annual_leave_days }}</strong>
            рабочих дней и оплачиваемых дополнительных
            <strong>{{ data.contract_data?.additional_paid_leave_days }}</strong>
            рабочих дней.
          </p>
        </td>
      </tr>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>3.5.</strong>
        </td>
        <td>
          <p>
            По соглашению между Работником и Работодателем может быть
            предоставлен отпуск без сохранения заработной платы, но не
            может быть в общей сложности превышать трех месяцев в
            течение двенадцатимесячного периода.
          </p>
        </td>
      </tr>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>3.6.</strong>
        </td>
        <td>
          <p>
            Работник имеет право получать другие отпуска в соответствии
            с законодательством Республики Узбекистан в установленном
            порядке.
          </p>
        </td>
      </tr>
      <tr
          v-if="data.contract_data && data.contract_data[3]"
          v-for="data in data.contract_data[3]"
      >
        <td
            width="40"
            valign="top"
        >
          <strong>{{ data.id }}</strong>
        </td>
        <td>
          <p>{{ data.text }}</p>
        </td>
      </tr>
    </table>
    <h3
        align="center"
        class="mb-3 mt-5"
    >
      4. ОПЛАТА ТРУДА
    </h3>
    <table>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>4.1.</strong>
        </td>
        <td>
          <p>
            Работнику за выполнение должностных обязанностей ,
            предусмотренных настоящим трудовым договором устанавливается
            заработная плата:
            <strong>{{ data.salary }}</strong> в
            соответствии со штатным расписанием, надбавка к заработной
            плате, дополнительные выплаты и вознаграждения, а также
            другие виды поощрений в соответствии с действующим
            законодательством, коллективным договором и рамках других
            локальных документов.
            <em>
              Примечание: При изменении минимального размера заработной
              платы в соответствии с законодательством Республики
              Узбекистан, перерасчет ежемесячной оплаты труда
              производится без внесения изменения в трудовой
              договор.
            </em>
          </p>
        </td>
      </tr>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>4.2.</strong>
        </td>
        <td>
          <p>
            Работнику заработная плата выплачивается ежемесячно не реже
            {{ data.contract_data?.payment_times }} раз.
          </p>
        </td>
      </tr>
      <tr
          v-if="data.contract_data && data.contract_data[4]"
          v-for="data in data.contract_data[4]"
      >
        <td
            width="40"
            valign="top"
        >
          <strong>{{ data.id }}</strong>
        </td>
        <td>
          <p>{{ data.text }}</p>
        </td>
      </tr>
    </table>
    <h3
        align="center"
        class="mb-3 mt-5"
    >
      5. СЛУЖЕБНЫЕ КОМАНДИРОВКИ
    </h3>
    <table>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>5.1.</strong>
        </td>
        <td>
          <p>
            Работодатель в связи с служебной необходимостью может
            направить Работника в служебную командировку.
          </p>
        </td>
      </tr>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>5.2.</strong>
        </td>
        <td>
          <p>
            Работнику расходы по служебной командировке выплачивается
            Работодателем в рамках законодательства, Работник по итогам
            служебной командировки обязан в течение трех дней
            представить Работодателю документы обосновывающие служебную
            командировку и отчеты.
          </p>
        </td>
      </tr>
      <tr
          v-if="data.contract_data && data.contract_data[5]"
          v-for="data in data.contract_data[5]"
      >
        <td
            width="40"
            valign="top"
        >
          <strong>{{ data.id }}</strong>
        </td>
        <td>
          <p>{{ data.text }}</p>
        </td>
      </tr>
    </table>
    <h3
        align="center"
        class="mb-3 mt-5"
    >
      6. ПРЕКРАЩЕНИЕ ТРУДОВОГО ДОГОВОРА
    </h3>
    <table>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>6.1.</strong>
        </td>
        <td>
          <p>
            Трудовой договор с Работником может быть прекращен на
            основании статей 87, 89, 97, 99, 100 101, 102, 103, 105, 106
            Трудового кодекса Республики Узбекистан.
          </p>
        </td>
      </tr>
    </table>
    <h3
        align="center"
        class="mb-3 mt-5"
    >
      7. ТРУДОВЫЕ СПОРЫ
    </h3>
    <table>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>7.1.</strong>
        </td>
        <td>
          <p>
            Трудовые споры разрешаются в порядке, установленном
            законодательством Республики Узбекистан. Порядок
            рассмотрения трудовых споров осуществляется в рамках
            Трудового кодекса Республики Узбекистан.
          </p>
        </td>
      </tr>
      <tr
          v-if="data.contract_data && data.contract_data[7]"
          v-for="data in data.contract_data[7]"
      >
        <td
            width="40"
            valign="top"
        >
          <strong>{{ data.id }}</strong>
        </td>
        <td>
          <p>{{ data.text }}</p>
        </td>
      </tr>
    </table>
    <h3
        align="center"
        class="mb-3 mt-5"
    >
      8. ДРУГИЕ УСЛОВИЯ ДОГОВОРА
    </h3>
    <table>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>8.1.</strong>
        </td>
        <td>
          <p>
            Трудовая деятельность Работника подлежит социальному
            страхованию. Виды и условия социального страхования
            Работника осуществляется Работодателем в соответствии с
            законодательством Республики Узбекистан.
          </p>
        </td>
      </tr>

      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>8.2.</strong>
        </td>
        <td>
          <p>
            В целях оценки выполнения Работником его функциональных
            обязанностей периодически будет проводится аттестация в
            соответствие с законодательством на основании установленных
            требований Положения об аттестации. По результатам
            аттестации если Работник признан не соответствующим
            занимаемой должности;
          </p>
          <p>
            с ним в установленном порядке будет прекращен трудовой
            договор на основании статьи 100 (часть вторая) Трудового
            кодекса;
          </p>
          <p>
            или будет предложена другая работа по специальности,
            требующая меньшую квалификацию, при отсутствии таковой
            другая работа, имеющаяся в организации, с внесением
            изменений в трудовой договор на основании и в порядке статей
            92 и 96 Трудового кодекса Республики Узбекистан.
          </p>
        </td>
      </tr>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>8.3.</strong>
        </td>
        <td>
          <p>
            Стороны имеют другие права и обязанности в соответствии с
            законодательством Республики Узбекистан.
          </p>
        </td>
      </tr>
      <tr>
        <td
            width="40"
            valign="top"
        >
          <strong>8.4.</strong>
        </td>
        <td>
          <p>
            Трудовой договор заключается в двух экземплярах, по одному
            экземпляру для каждой из сторон, имеющих одинаковую
            юридическую силу и вступает в силу со дня его подписания.
          </p>
        </td>
      </tr>
      <tr
          v-if="data.contract_data && data.contract_data[8]"
          v-for="data in data.contract_data[8]"
      >
        <td
            width="40"
            valign="top"
        >
          <strong>{{ data.id }}</strong>
        </td>
        <td>
          <p>{{ data.text }}</p>
        </td>
      </tr>
    </table>
    <div>
      <div class="d-flex flex-wrap mt-4">
        <div class="w-50 mb-3 pr-4">
          <h3 class="mb-2">
            <strong>Работодатель:</strong>
          </h3>
          <div class="mb-3 contract-doc__td">
            <div>
              Наименование организации:
              <strong>{{ data.company.name }}</strong>
            </div>
            <div>
              Почтовый адрес:
              <strong>
                {{ data.company.profile_data.actual_address }}
              </strong>
            </div>
            <div>
              Ф.И.О.:
              <strong>
                {{ data.contract_data?.employer_name }}
              </strong>
            </div>
            <div>
              Должность:
              <span>
                <strong>{{ $t(`contracts.employerType.${ data.contract_data?.employer_type }`) }}</strong>
              </span>
            </div>
            <div>
              Дата:
              <strong>{{ data.contract_date }}</strong>
            </div>
            <!-- <div>Подпись:</div> -->
          </div>
        </div>
        <div class="w-50 pl-4">
          <h3 class="mb-2">
            <strong>Работник:</strong>
          </h3>
          <div class="mb-3 contract-doc__td">
            <div>
              Ф.И.О.:
              <strong v-if="data.individ">
                {{ data.individ.person_surname }} {{ data.individ.person_name }}
                {{ data.individ.person_patronymic }}
              </strong>
            </div>
            <div>
              Адрес:
              <strong>{{ data.individ.residential_address }}</strong>
            </div>
            <div>
              ПИНФЛ:
              <strong>{{ data.person_pin }}</strong>
            </div>
            <div>
              Паспорт:
              <strong>{{ data.person_passport }}</strong>
            </div
            >
            <!-- <div
              >ИНН: <strong>546879125</strong></div
            > -->
            <div>Телефон (моб):
              <strong>+{{ data.individ.mobile_phone }}</strong>
            </div>
            <div>
              Дата:
              <strong>{{ data.contract_date }}</strong>
            </div
            >
            <!-- <div>Подпись:</div> -->
          </div>
          <!-- <div valign="top">
            <p class="mb-2">Подпись:</p>
            <p><b>Код подтверждения Работника:</b></p>
            <div class="row">
              <div class="col-xl-3 col-4 mb-2">
                <input
                  type="text"
                  disabled="disabled"
                  value="+998"
                  class="form-control form-control-sm text-center"
                />
              </div>
              <div class="col-xl-5 col-8 mb-2">
                <input
                  type="text"
                  class="form-control form-control-sm"
                />
              </div>
              <div class="col-xl-4 col-12 text-xl-center text-end mb-2">
                <a href="#" class="btn btn-primary btn-sm"
                  ><span class="text-nowrap">Отправить код</span></a
                >
              </div>
            </div>
            <p>
              <em
                >Внимание: согласно Закону, за достоверность внесенных
                данных при оформление электронного трудового договора,
                ответственность несет Работодатель. Убедитесь, что
                указанный номер телефона принадлежит Работнику.</em
              >
            </p>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style
    scoped
    lang="scss"
>
.contract-doc {
  &__td {
    border: 1px solid #e9ebec;

    > div {
      padding: 11px 16px;
      border-bottom: 1px solid #e9ebec;
    }
  }
}
</style>