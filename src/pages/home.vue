<template>
  <div class="p-4">
    <!-- 设置封面，效果，也可以不设置，简单一些 -->
    <!-- <video
      ref="player"
      :poster="getPoster(skip)"
      :src="video"
      class="w-1/2 aspect-video object-cover"></video> -->
    <video
      ref="player"
      :src="video"
      class="w-1/2 aspect-video object-cover"
      preload="metadata"></video>
    <div @click="togglePlay" class="p-2 my-2 w-40 bg-slate-500 text-white rounded cursor-pointer">
      播放/暂停
    </div>
    <div class="flex">
      <div @click="skipTo(1)" class="p-2 mr-2 bg-slate-500 text-white rounded cursor-pointer">
        第一小节
      </div>
      <div @click="skipTo(2)" class="p-2 mr-2 bg-slate-500 text-white rounded cursor-pointer">
        第一小节
      </div>
      <div @click="skipTo(3)" class="p-2 mr-2 bg-slate-500 text-white rounded cursor-pointer">
        第一小节
      </div>
      <div @click="skipTo(4)" class="p-2 mr-2 bg-slate-500 text-white rounded cursor-pointer">
        第一小节
      </div>
      {{ skip }}
    </div>
  </div>
</template>

<script setup>
import video from '@/assets/25930_1688531594.mp4'

import { onMounted } from 'vue'
import { ref } from 'vue'

const player = ref()
const skip = ref(1)
const skipTo = (val) => {
  //
  skip.value = val
  console.log(player)

  if (!player.value.paused) {
    player.value.pause()
  }
  //模拟设置进度，按照实际逻辑提前计算每个点的播放位置
  player.value.currentTime = val * 15
}
const togglePlay = () => {
  if (player.value.paused) {
    player.value.play()
  } else {
    player.value.pause()
  }
}

const getPoster = (name) => new URL(`../assets/img/poster-${name}.jpg`, import.meta.url).href
onMounted(() => {
  player.value.addEventListener('canplay', (event) => {
    //获取到 视频时长， player.value.duration
    console.log('Video can start, but not sure it will play through.', event, player.value.duration)
  })
})
</script>

<style lang="less" scoped></style>
