<script setup>
import QualificationApi from "@/pages/Qualification/api";
import {useI18n} from "vue-i18n";
import {onMounted, ref, watch} from "vue";
import useToast from "@/components/UI/AppToast/useToast";
import "leaflet/dist/leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import coor from "./coor";
import ElementLoader from "@/pages/Qualification/components/Map/ElementLoader.vue";

const {t, locale} = useI18n();
const {toast} = useToast();
const emit = defineEmits(['selectOrganization']);
const props = defineProps(['form']);

const isLoading = ref(true);
const organizations = ref([]);
const organizationLayers = ref([]);
const osm = ref(
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    })
);
const geoJson = ref(L.geoJSON(coor));
const markerClusterGroup = ref(
    L.markerClusterGroup({
      iconCreateFunction: function (cluster) {
        let childCount = cluster.getChildCount();
        let style = {
          color: '',
          backgroundColor: '',
          boxShadow: ''
        };

        if (childCount < 10) {
          style.backgroundColor = '#008000d1'
          style.color = 'white'
          style.boxShadow = '0 0 0px 6px #00800059;'
        } else if (childCount < 100) {
          style.boxShadow = '0 0 0px 6px rgba(0, 70, 184, 0.3)'
          style.color = 'white'
          style.backgroundColor = '#0046B8'
        }

        return L.divIcon({
          html:
              '<div class="my-cluster" style="color: ' +
              style.color +
              '; background-color: ' +
              style.backgroundColor +
              '; box-shadow: ' +
              style.boxShadow +
              ';">' +
              childCount +
              '</div>'
        })
      }
    })
);
const map = ref(null);
const center = ref([39.767968, 64.421725]);
const markerIcon = ref(L.icon({
  iconUrl: "/img/leaflet/marker-icon-2x.png",
  iconSize: [25, 41]
}));

function organizationDataHandler(fetchOrganizations) {

  fetchOrganizations = fetchOrganizations.filter(e => e.address_longitude && e.address_latitude);

  organizations.value = fetchOrganizations;

  organizations.value.map((e) => {
    fetchOrganization(Number(e.tin));
  });

  setTimeout(() => {
    isLoading.value = false;
  }, 1000)
}

function getMapCountOrganizations(params = {}) {
  isLoading.value = true;
  QualificationApi.mapCountOrganizations(params)
      .then(res => {
        organizationDataHandler(res);
      })
      .catch(err => {
        isLoading.value = false;
        mapAnimateHandler();
        console.log(err)
      });
}

function fetchOrganization(tin = null) {
  QualificationApi.showByOrganization(tin)
      .then(res => {
        organizations.value = organizations.value.map(e => {
          if (e.id == res.id) {
            e.PaidCourseStudentCount = res.PaidCourseStudentCount;
          }
          return e;
        });
        markerClusterHandler();
      }).catch(err => {
    console.log(err);
    return;
  })
}

function markerClusterHandler() {

  organizationLayers.value = [];
  markerClusterGroup.value.clearLayers();

  organizations.value.forEach(e => {
    const coor = [Number(e.address_latitude), Number(e.address_longitude)]
    const title = `
        ${e.name ? `
        <div class="popup-title">
            ${e.name}
        </div>
        ` : ''}
        ${e.address ? `
        <div class="popup-el">
        ${t('common.address')}
            :
            ${e.address}
        </div>
        ` : ''}
        ${e.address_latitude && e.address_longitude ? `
        <div class="popup-el">
           ${t('common.coor')}
        :
            ${e.address_latitude} , ${e.address_longitude}
        </div>
        ` : ''}
        ${e.PaidCourseStudentCount ? `
        <div class="popup-el">
           ${t('qualification.TrainedByStudents')}
        :
           ${e.PaidCourseStudentCount}
        </div>` : ''}
        ${e.phone ? `
        <div class="popup-el">
        ${t('qualification.phone')}
        :
            <span class="popul-phone">
                ${e.phone}
            </span>
        </div>` : ''}
        `;


    const marker = L.marker(coor, {icon: markerIcon.value}).bindPopup(title)

    marker.on('mouseover', function () {
      this.openPopup();
    });

    marker.on('mouseout', function () {
      this.closePopup();
    });

    marker.on('click', function () {
      if (!props.form?.tin) {
        isEmitOrganization.value = true;
        emit('selectOrganization', e)

        setTimeout(()=> {
          isEmitOrganization.value = false;
        },1000)
      }
    });

    L.Popup.prototype._animateZoom = function (e) {
      if (!this._map) {
        return
      }
      let pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center),
          anchor = this._getAnchor()
      L.DomUtil.setPosition(this._container, pos.add(anchor))
    }

    organizationLayers.value.push(marker)
  })
  markerClusterGroup.value.addLayers(organizationLayers.value)
  mapAnimateHandler();
}

const isEmitOrganization = ref(false);

function updateMapHandler(zoom) {
  map.value.scrollWheelZoom.enable();

  map.value.removeLayer(markerClusterGroup.value);
  map.value.addLayer(markerClusterGroup.value);

  if (props.form.coor.length > 0) {
    map.value.setView(props.form.coor, zoom);
  }
}

function getLocationHandler() {

  navigator.geolocation.getCurrentPosition(
      position => {

        const title = "Ваше местоположение";
        const coor = [position.coords.latitude, position.coords.longitude];

        map.value.setView(coor, 13);

        const marker = L.marker(coor, {icon: markerIcon.value}).bindPopup(title).addTo(map.value).openPopup();

        marker.on('mouseover', function (e) {
          this.openPopup();
        });

        marker.on('mouseout', function (e) {
          this.closePopup();
        });
      }
  )
}

function mapAnimateHandler() {
  map.value.invalidateSize(false);
  L.Util.requestAnimFrame(map.value.invalidateSize, map.value, !1, map.value._container);
}

function mapHandler() {
  if (map.value) {
    map.value.remove();
  }

  map.value = L.map('map', {
    center: center.value,
    zoom: 5.5,
    minZoom: 4,
    zoomControl: true,
    layers: [osm.value, markerClusterGroup.value, geoJson.value]
  });
}

onMounted(async () => {
  if (props.form?.region_id) {
    await getMapCountOrganizations({region_id: props.form.region_id});
  } else if (props.form?.city_soato) {
    await getMapCountOrganizations({city_soato: props.form.city_soato});
  } else if (props.form?.tin) {
    await getMapCountOrganizations({tin: props.form.tin});
  } else {
    await getMapCountOrganizations();
  }

  mapHandler();
});

watch(() => isLoading.value, (newValue) => {
  mapAnimateHandler();
});

watch(() => props?.form?.region_id, (newValue) => {
  if (newValue && !isEmitOrganization.value) {
    console.log(newValue);
    getMapCountOrganizations({region_id: newValue});
    updateMapHandler(7);
  }
});

watch(() => props?.form?.city_soato, (newValue) => {
  if (newValue && !isEmitOrganization.value) {
    getMapCountOrganizations({city_soato: newValue});

    updateMapHandler(8);
  }
});

watch(() => props?.form?.tin, (newValue) => {
  if (newValue && !isEmitOrganization.value) {
    getMapCountOrganizations({tin: newValue});
    updateMapHandler(13);
  }
});

</script>

<template>
  <ElementLoader v-if="isLoading" class="my-map_wrapper"/>
  <div
      class="my-map_wrapper"
      v-show="!isLoading"
  >
    <button
        class="get-location_btn"
        @click="getLocationHandler"
    >
      <svg data-src="/img/icons/get-location.svg"></svg>
    </button>
    <div
        id="map"
        class="my-map"
    >
    </div>
  </div>
</template>

<style lang="scss">
.my-map_wrapper {
  position: relative;
  width: 100%;
  height: 350px;

  .get-location_btn {
    cursor: pointer;
    position: absolute;
    z-index: 1000;
    right: 10px;
    top: 10px;
    border-radius: 10px;
    border: none;
    background-color: #FFF;
    padding: 7px;
    width: 32px;
    height: 32px;

    img {
      width: 20px;
      height: 20px;
      background: #FFF !important;
    }
  }

  .my-map {
    width: 100%;
    height: 100%;
    z-index: 0;
    top: 0;
    border-radius: 10px;

    .my-cluster {
      width: 35px;
      height: 35px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      font: 12px Helvetica Neue, Arial, Helvetica, sans-serif;
      border-radius: 50%;
    }

    .leaflet-control-attribution {
      display: none;
    }

    .leaflet-div-icon {
      background: none;
      border: none;
    }

    .popup-title {
      color: #0046b8;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    .popul-el {
      color: #07274b;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    .popul-phone {
      color: #0046b8;
    }
  }
}
</style>