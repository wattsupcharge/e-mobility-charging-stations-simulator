<template>
  <tr v-for="(connector, index) in getConnectors()" class="cs-table__row">
    <CSConnector
      :hash-id="getHashId()"
      :connector="connector"
      :connector-id="index + 1"
      :transaction-id="connector.transactionId"
      :id-tag="props.idTag"
    />
    <td class="cs-table__name-col">{{ getId() }}</td>
    <td class="cs-table__started-col">{{ getStarted() }}</td>
    <td class="cs-table__wsState-col">{{ getWsState() }}</td>
    <td class="cs-table__registration-status-col">{{ getRegistrationStatus() }}</td>
    <td class="cs-table__vendor-col">{{ getVendor() }}</td>
    <td class="cs-table__model-col">{{ getModel() }}</td>
    <td class="cs-table__firmware-col">{{ getFirmwareVersion() }}</td>
  </tr>
</template>

<script setup lang="ts">
// import { reactive } from 'vue'
import CSConnector from './CSConnector.vue'
import type { ChargingStationData, ChargingStationInfo, ConnectorStatus } from '@/types'
import { ifUndefined } from '@/composables/Utils'

const props = defineProps<{
  chargingStation: ChargingStationData
  idTag: string
}>()

// type State = {
//   isTagModalVisible: boolean
//   idTag: string
// }

// const state: State = reactive({
//   isTagModalVisible: false,
//   idTag: ''
// })

function getConnectors(): ConnectorStatus[] {
  if (Array.isArray(props.chargingStation.evses) && props.chargingStation.evses.length > 0) {
    const connectorsStatus: ConnectorStatus[] = []
    for (const [evseId, evseStatus] of props.chargingStation.evses.entries()) {
      if (evseId > 0 && Array.isArray(evseStatus.connectors) && evseStatus.connectors.length > 0) {
        for (const connectorStatus of evseStatus.connectors) {
          connectorsStatus.push(connectorStatus)
        }
      }
    }
    return connectorsStatus
  }
  return props.chargingStation.connectors?.slice(1)
}
function getInfo(): ChargingStationInfo {
  return props.chargingStation.stationInfo
}
function getHashId(): string {
  return getInfo().hashId
}
function getId(): string {
  return ifUndefined<string>(getInfo().chargingStationId, 'Ø')
}
function getModel(): string {
  return getInfo().chargePointModel
}
function getVendor(): string {
  return getInfo().chargePointVendor
}
function getFirmwareVersion(): string {
  return ifUndefined<string>(getInfo().firmwareVersion, 'Ø')
}
function getStarted(): string {
  return props.chargingStation.started === true ? 'Yes' : 'No'
}
function getWsState(): string {
  switch (props.chargingStation?.wsState) {
    case WebSocket.CONNECTING:
      return 'Connecting'
    case WebSocket.OPEN:
      return 'Open'
    case WebSocket.CLOSING:
      return 'Closing'
    case WebSocket.CLOSED:
      return 'Closed'
    default:
      return 'Ø'
  }
}
function getRegistrationStatus(): string {
  return props.chargingStation?.bootNotificationResponse?.status ?? 'Ø'
}
// function showTagModal(): void {
//   state.isTagModalVisible = true
// }
// function hideTagModal(): void {
//   state.isTagModalVisible = false
// }
</script>
