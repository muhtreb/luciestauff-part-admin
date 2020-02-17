<template>
  <div>
    <SettingForm :setting="setting"></SettingForm>
  </div>
</template>

<script>
import SettingForm from '@/components/SettingForm'
export default {
  components: { SettingForm },
  async asyncData({ route, app }) {
    const response = await app.$settingRepository.getSettingByKey(
      route.params.key
    )
    return {
      setting: response.data
    }
  }
}
</script>
