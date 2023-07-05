<template>
  <div class="page flex flex-col" v-show="showTimeline">
    <section class="flex-1">
      <header class="h-25 flex items-center justify-between text-white px-10">
        <div>课时1: Spring in Action preference</div>
        <div class="bg-blue w-15 h-10 leading-10 text-center">预览</div>
      </header>
      <main class="w-full h-[calc(100%-100px)] flex">
        <div class="w-8/10 h-full">
          <VideoPlayer ref="player" @ready="initTimeline" @timeupdate="onTimeupdate" @end="onEnd" />
        </div>
        <aside class="w-2/10 h-full">
          <div class="bg-blue w-25 h-10 leading-10" @click="newQuestion">新增弹题</div>
          <div class="p-2 text-white">
            当前弹题的视频时间戳是: {{ duration }} - {{ currentTime }}
          </div>
        </aside>
      </main>
    </section>
    <section ref="timeline" class="timeline w-full h-1.5/10 overflow-x-hidden flex flex-col">
      <div class="timeline-scales h-8.5 flex items-center text-white">
        <div class="timeline-scale" v-for="timeline in timelineScales">{{ timeline }}</div>
      </div>
      <div class="timeline-events flex items-center relative my-4 flex-1">
        <div class="timeline-event" v-for="timeline in timelineScales"></div>
        <div
          class="timeline-event !border-l-blue-500 absolute top-0 bottom-0 !border-l-solid px-2"
          :style="{ left: question.position + 'px' }"
          v-for="question in questions">
          {{ question }}
        </div>
        <div
          class="timeline-ruler absolute top-0 bottom-0 left-0 cursor-pointer"
          :style="{ transform: 'translateX(' + rulerTransformX + 'px)' }"
          @mousedown.prevent.stop="onMousedown"
          id="timelineRuler"
          ref="timelineRuler">
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
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import VideoPlayer from '@/components/VideoPlayer.vue'
import { throttle } from 'lodash-es'

dayjs.extend(utc)
// console.log(dayjs.utc().seconds(30))
const timeline = ref()
const timelineRuler = ref()
const player = ref()
const duration = ref(0)
const playerStatus = ref('pause')

onMounted(() => {
  timelineScales.value = []
})

const currentTime = ref(0)
const questions = ref([])
const newQuestion = () => {
  currentTime.value = player.value.getCurrentTime()
  const clientRect = timelineRuler.value.getBoundingClientRect()
  console.log(clientRect.left)
  questions.value.push({
    position: Math.ceil(clientRect.left)
  })

  //   const singleTimeline = duration.value / timelineScaleCont
  //   const singleTimelineWidth = (timeline.value.offsetWidth - 40) / timelineScaleCont //40是 timeline-events 两边的padding
  //   const TransformX = Math.max(
  //     rulerTransformX.value,
  //     Math.ceil((singleTimelineWidth * currentTime.value) / singleTimeline)
  //   )
}
const rulerTransformX = ref(14)
const showTimeline = ref(false)
const timelineScales = ref([])
const timelineScaleCont = 10
const playEnd = ref(false)
const initTimeline = (val) => {
  if (showTimeline.value) {
    console.warn('player already initialized', val)
    return
  }
  duration.value = val
  for (let index = 0; index < timelineScaleCont; index++) {
    timelineScales.value.push(formatTimeScale(index))
  }
  showTimeline.value = true
}
const onTimeupdate = () => {
  //计算当前拖动的位置对应的进度时间
  const currentTime = player.value.getCurrentTime()
  const singleTimeline = duration.value / timelineScaleCont
  const singleTimelineWidth = (timeline.value.offsetWidth - 40) / timelineScaleCont //40是 timeline-events 两边的padding
  const TransformX = Math.max(
    rulerTransformX.value,
    Math.ceil((singleTimelineWidth * currentTime) / singleTimeline)
  )
  rulerTransformX.value = TransformX
  if (playEnd.value) {
    //reset rule position
    if (player.value.getStatus() === 'playing') {
      playEnd.value = false
      rulerTransformX.value = 14
    }
  }
  //   console.log((singleTimelineWidth * currentTime) / singleTimeline) ///Math.ceil(( / singleTimelineWidth) * singleTimeline)
  //   console.log(singleTimeline, singleTimelineWidth, currentTime)
}

const onEnd = () => {
  playEnd.value = true
  console.log('received play end event')
}
const formatTimeScale = (index) => {
  const timeline = Math.ceil((duration.value / timelineScaleCont) * (index + 1))
  const format = timeline < 60 * 60 ? 'mm:ss' : 'HH:mm:ss'
  return dayjs.unix(timeline).utc().format(format)
}
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
  const onMouseMove = throttle((e) => {
    //如果当前视频正在播放，则停止播放，
    if (player.value.getStatus() === 'playing') {
      playerStatus.value = player.value.getStatus()
      player.value.pause()
    }
    const timelineWith = timeline.value.offsetWidth
    let clientX = e.clientX
    //防止刻度尺超出窗口
    if (clientX >= timelineWith - 12) clientX = timelineWith - 12
    rulerTransformX.value = clientX
  }, 100)
  //鼠标抬起时卸载注册的 移动和抬起事件，防止重复注册
  const onMouseUp = (e) => {
    unRegisterResizeEvent()

    //计算当前拖动的位置对应的进度时间
    const singleTimeline = duration.value / timelineScaleCont
    const singleTimelineWidth = (timeline.value.offsetWidth - 40) / timelineScaleCont //40是 timeline-events 两边的padding
    const seek = Math.ceil((rulerTransformX.value / singleTimelineWidth) * singleTimeline)
    //设置进度条
    player.value.seek(seek)
    //如果之前手动暂停了播放器，则重新播放
    if (playerStatus.value === 'playing') {
      player.value.play()
      playerStatus.value = player.value.getStatus()
    }
    console.log(120, player.value.getStatus())
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
    border-bottom: 1px solid #32333c;
    padding: 0 20px;
    .timeline-scale {
      user-select: none;
      height: 30px;
      line-height: 30px;
      border-left: 1px solid #32333c;
      @apply flex-1  pl-2 self-stretch;
    }
  }
  .timeline-events {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 0 20px;
    position: relative;
    .timeline-event {
      border-left: 1px dashed #c5c5c7;
      @apply flex-1 pl-2 self-stretch;
    }
  }
  .timeline-ruler {
    transition: all 0.2s linear 0s;
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
