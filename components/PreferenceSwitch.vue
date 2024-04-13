<template>
  <el-select v-model="$colorMode.preference">
    <el-option value="system">
      System
    </el-option>
    <el-option value="light">
      Light
    </el-option>
    <el-option value="dark">
      Dark
    </el-option>
    <el-option value="sepia">
      Sepia
    </el-option>
  </el-select>
</template>

<style>
body {
  background-color: #fff;
  color: rgba(0,0,0,0.8);
}
.dark-mode body {
  background-color: #091a28;
  color: #ebf4f1;
}
.sepia-mode body {
  background-color: #f1e7d0;
  color: #433422;
}
</style>
