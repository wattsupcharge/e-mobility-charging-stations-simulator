<template>
  <Modal :visibility="props.isVisible">
    <div class="card-info">vendor: {{ props.stationInfo.chargePointVendor }}</div>
  </Modal>
</template>

<script setup lang="ts">
import type { ChargingStationInfo } from '@/types'
import Modal from '@/components/Modal.vue'

const props = defineProps<{
  stationInfo: ChargingStationInfo
  isVisible: boolean
}>()
</script>

<style>
.card-info {
  background-color: white;
  padding: 15px;
}
</style>
