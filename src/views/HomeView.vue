<script setup lang="ts"></script>

<template>
  <div style="border: 1px solid red; width: 80px">
    <div style="width: 80px">
      <!-- 未超出 -->
      <AppTooltip content="一段文本" />
    </div>
    <div style="width: 80px; margin-top: 24px">
      <!-- 单行超出 -->
      <AppTooltip content="一段挺长挺长的文本" />
    </div>
    <div style="width: 80px; margin-top: 24px">
      <!-- 多行超出 -->
      <AppTooltip :lines="2" content="一段挺长挺长的文本一段挺长挺长的文本" />
    </div>
    <div style="width: 80px; margin-top: 24px">
      <!-- tip富文本 -->
      <AppTooltip :lines="2" content="一段挺长挺长的文本一段挺长挺长的文本">
        <template #tooltipContent>
          <div>甚至<b>可以</b><span style="color: red">带点花样</span></div>
        </template>
      </AppTooltip>
    </div>
    <div style="width: 80px; margin-top: 24px">
      <!-- content富文本 -->
      <AppTooltip :lines="2" content="使用插槽也不会有什么问题">
        <span>这段<b style="color: red; margin: 8px">文文本本</b>将会超出两行的长度</span>
      </AppTooltip>
    </div>
  </div>
</template>

<style lang="scss"></style>
