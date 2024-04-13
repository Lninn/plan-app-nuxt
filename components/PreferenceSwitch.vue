<template>
  <el-select
    v-model="$colorMode.preference"
    style="width:150px;margin-inline-end:8px;"
  >
    <el-option
      label="System"
      value="system"
    />
    <el-option
      label="Light"
      value="light"
    />
    <el-option
      label="Dark"
      value="dark"
    />
  </el-select>
</template>

<script setup>
const colorMode = useColorMode()

console.log(colorMode.preference)
</script>
