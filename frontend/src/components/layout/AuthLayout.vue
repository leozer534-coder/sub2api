<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
    <!-- Background -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-100 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950"
    ></div>

    <!-- Background texture -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        class="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"
      ></div>
      <div class="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary-100/60 to-transparent dark:from-primary-950/30"></div>
    </div>

    <!-- Content Container -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="mb-8 text-center">
        <!-- Custom Logo or Default Logo -->
        <template v-if="settingsLoaded">
          <div
            class="mb-4 inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl shadow-lg shadow-primary-500/30"
          >
            <img :src="siteLogo || '/logo.png'" alt="Logo" class="h-full w-full object-contain" />
          </div>
          <h1 class="text-gradient mb-2 text-3xl font-bold">
            {{ siteName }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-dark-400">
            {{ siteSubtitle }}
          </p>
        </template>
      </div>

      <!-- Card Container -->
      <div class="card-glass rounded-2xl p-8 shadow-glass">
        <slot />
      </div>

      <!-- Footer Links -->
      <div class="mt-6 text-center text-sm">
        <slot name="footer" />
      </div>

      <!-- Copyright -->
      <div class="mt-8 text-center text-xs text-gray-400 dark:text-dark-500">
        <div>&copy; {{ currentYear }} {{ siteName }}. 保留所有权利。</div>
        <div class="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <router-link
            v-for="link in legalLinks"
            :key="link.id"
            :to="`/legal/${link.id}`"
            class="transition-colors hover:text-primary-600 dark:hover:text-primary-300"
          >
            {{ link.title }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores'
import { sanitizeUrl } from '@/utils/url'
import {
  businessBrand,
  buildBusinessLegalDocuments,
  resolveBusinessSiteName,
  resolveBusinessSiteSubtitle,
} from '@/config/businessBrand'

const appStore = useAppStore()

const siteName = computed(() => resolveBusinessSiteName(appStore.siteName))
const siteLogo = computed(() => sanitizeUrl(appStore.siteLogo || '', { allowRelative: true, allowDataUrl: true }))
const siteSubtitle = computed(() => resolveBusinessSiteSubtitle(appStore.cachedPublicSettings?.site_subtitle || businessBrand.subtitle))
const settingsLoaded = computed(() => appStore.publicSettingsLoaded)
const legalLinks = computed(() =>
  buildBusinessLegalDocuments(siteName.value, appStore.contactInfo)
    .filter((doc) => ['terms', 'usage-policy', 'privacy-policy', 'refund-policy'].includes(doc.id))
    .map((doc) => ({ id: doc.id, title: doc.title }))
)

const currentYear = computed(() => new Date().getFullYear())

onMounted(() => {
  appStore.fetchPublicSettings()
})
</script>

<style scoped>
.text-gradient {
  @apply bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent;
}
</style>
