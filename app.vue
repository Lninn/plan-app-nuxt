<script setup lang="ts">
const size = 'default' as const
</script>

<template>
  <el-config-provider :size="size">
    <AppContainer>
      <AppHeader />
      <PageContainer>
        <NuxtPage />
      </PageContainer>
    </AppContainer>
  </el-config-provider>
</template>

<style>
@import "~/styles/main.css";
</style>
