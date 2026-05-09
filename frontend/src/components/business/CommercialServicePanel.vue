<template>
  <section class="card border-primary-100 bg-white p-5 dark:border-primary-900/40 dark:bg-dark-900">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0">
        <p class="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-300">
          {{ businessBrand.productLine }}
        </p>
        <h2 class="mt-2 text-lg font-semibold text-gray-950 dark:text-white">
          {{ siteName }} 服务中心
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-dark-300">
          稳定接入主流 AI 模型，按套餐或余额管理用量，适合个人开发者和小团队长期使用。
        </p>
      </div>
      <div
        v-if="contactInfo"
        class="rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-800 dark:bg-primary-500/10 dark:text-primary-200"
      >
        {{ contactInfo }}
      </div>
    </div>

    <div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <button
        v-if="paymentEnabled"
        type="button"
        class="service-action"
        @click="router.push('/purchase')"
      >
        <Icon name="creditCard" size="md" class="text-primary-600 dark:text-primary-300" />
        <span>
          <span class="service-action-title">充值/订阅</span>
          <span class="service-action-desc">余额与套餐</span>
        </span>
      </button>

      <button type="button" class="service-action" @click="router.push('/keys')">
        <Icon name="key" size="md" class="text-primary-600 dark:text-primary-300" />
        <span>
          <span class="service-action-title">API 密钥</span>
          <span class="service-action-desc">创建调用凭证</span>
        </span>
      </button>

      <button type="button" class="service-action" @click="router.push('/legal/usage-policy')">
        <Icon name="shield" size="md" class="text-primary-600 dark:text-primary-300" />
        <span>
          <span class="service-action-title">使用规则</span>
          <span class="service-action-desc">风控与限制</span>
        </span>
      </button>

      <button type="button" class="service-action" @click="router.push('/legal/refund-policy')">
        <Icon name="document" size="md" class="text-primary-600 dark:text-primary-300" />
        <span>
          <span class="service-action-title">退款说明</span>
          <span class="service-action-desc">订单处理规则</span>
        </span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '@/components/icons/Icon.vue'
import { useAppStore } from '@/stores/app'
import { businessBrand, resolveBusinessSiteName } from '@/config/businessBrand'

const router = useRouter()
const appStore = useAppStore()

const siteName = computed(() => resolveBusinessSiteName(appStore.siteName))
const contactInfo = computed(() => appStore.contactInfo)
const paymentEnabled = computed(() => appStore.cachedPublicSettings?.payment_enabled === true)
</script>

<style scoped>
.service-action {
  @apply flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left transition hover:border-primary-200 hover:bg-primary-50 dark:border-dark-700 dark:bg-dark-800/70 dark:hover:border-primary-800 dark:hover:bg-primary-950/30;
}

.service-action-title {
  @apply block text-sm font-semibold text-gray-900 dark:text-white;
}

.service-action-desc {
  @apply mt-0.5 block text-xs text-gray-500 dark:text-dark-400;
}
</style>
