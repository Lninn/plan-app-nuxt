<template>
  <el-select
    v-model="$colorMode.preference"
    style="width:150px;margin-inline-end:8px;"
  >
    <el-option value="system">
      System
    </el-option>
    <el-option value="light">
      Light
    </el-option>
    <el-option value="dark">
      Dark
    </el-option>
  </el-select>
</template>
