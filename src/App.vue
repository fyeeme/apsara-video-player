<template>
  <div class="page">
    <section class="h-8.5/10">
      <header class="h-25 flex items-center justify-between text-white px-10">
        <div>课时1: Spring in Action preference</div>
        <div class="bg-blue w-15 h-10 leading-10 text-center">预览</div>
      </header>
      <main class="w-full h-[calc(100%-100px)] flex">
        <div class="w-8/10 h-full">
          <VideoPlayer ref="player" />
        </div>
        <aside class="w-2/10 h-full">
          <div class="bg-blue w-25 h-10 leading-10" @click="newQuestion">新增弹题</div>
          <div class="p-2 text-white">
            当前弹题的视频时间戳是: {{ duration }} - {{ currentTime }}
          </div>
        </aside>
      </main>
    </section>
    <section ref="timeline" class="timeline w-full h-1.5/10 overflow-x-hidden">
      <div class="timeline-scales h-8.5 flex items-center text-white">
        <div class="timeline-scale">00:00</div>
        <div class="timeline-scale">00:30</div>
        <div class="timeline-scale">01:00</div>
        <div class="timeline-scale">01:30</div>
        <div class="timeline-scale">02:00</div>
        <div class="timeline-scale">02:30</div>
      </div>
      <div class="timeline-events flex items-center relative">
        <div class="timeline-event"></div>
        <div class="timeline-event"></div>
        <div class="timeline-event"></div>
        <div class="timeline-event"></div>
        <div class="timeline-event"></div>
        <div class="timeline-event"></div>
        <div
          class="timeline-ruler absolute top-0 bottom-0 left-0 cursor-pointer"
          :style="{ transform: 'translateX(' + rulerTransformX + 'px)' }"
          @mousedown.prevent.stop="onMousedown"
          id="timelineRuler">
          <svg
            width="14"
            height="10"
            xmlns="http://www.w3.org/2000/svg"
            class="timeline-ruler-head">
            <path
              d="M12.5.5H.5v4.266L6.181 9.5h.638L12.5 4.766V.5z"
              fill="#FFF"
              fill-rule="nonzero"
              stroke="#FFF"></path>
          </svg>
          <div class="timeline-ruler-line"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import VideoPlayer from '@/components/VideoPlayer.vue'

const timeline = ref()
const player = ref()
const duration = ref(0)
onMounted(() => {})

const currentTime = ref(0)
const newQuestion = () => {
  currentTime.value = player.value.getCurrentTime()
}
const rulerTransformX = ref(0)

//register mouse down event， 这里可以优化改方法，将其抽象为通用的逻辑，通过穿参数执行具体的业务逻辑
const onMousedown = () => {
  //注册鼠标移动和抬起的事件
  const registerResizeEvent = () => {
    document.addEventListener('mousemove', onMouseMove, true)
    document.addEventListener('mouseup', onMouseUp, true)
  }
  //
  const unRegisterResizeEvent = () => {
    document.removeEventListener('mousemove', onMouseMove, true)
    document.removeEventListener('mouseup', onMouseUp, true)
  }
  //获取移动的水平距离，调整时间刻度尺的位置
  const onMouseMove = (e) => {
    console.log('onMouseMove', e)
    const timelineWith = timeline.value.offsetWidth
    let clientX = e.clientX
    if (clientX >= timelineWith - 12) clientX = timelineWith - 12
    rulerTransformX.value = clientX
  }
  //鼠标抬起时卸载注册的 移动和抬起事件，防止重复注册
  const onMouseUp = (e) => {
    unRegisterResizeEvent()
    //设置进度条
    player.value.seek(rulerTransformX.value / 10)
    //获取视频总时长
    if (!duration.value) {
      duration.value = player.value.getDuration()
    }
    console.log('onMouseUp', e)
  }
  registerResizeEvent()
}
</script>

<style lang="less" scoped>
.page {
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.85);
  .timeline-scales {
    .timeline-scale {
      user-select: none;
      height: 30px;
      line-height: 30px;
      border-left: 1px solid #32333c;
      @apply w-45  pl-2 self-stretch;
    }
  }
  .timeline-events {
    height: calc(100% - 30px);
    background-color: rgba(255, 255, 255, 0.1);
    .timeline-event {
      border-left: 1px dashed #c5c5c7;
      @apply w-45 pl-2 self-stretch;
    }
  }
  .timeline-ruler {
    //     transition: all 0.2s linear 0s;
    .timeline-ruler-head {
      position: absolute;
    }
    .timeline-ruler-line {
      width: 1px;
      background: #fff;
      inset: 0;
      height: 100%;
      left: 6px;
    }
  }
}
</style>
