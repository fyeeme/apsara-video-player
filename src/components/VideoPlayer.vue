<template>
  <div id="J_prismPlayer"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import '@/lib/aliplayercomponents-1.0.9.min.js'
onMounted(() => {
  //init script
  initPlayerSdkStyle()
  initPlayerSdkScript()
})

const player = ref()

const initPlayerSdk = () => {
  player.value = new Aliplayer(
    {
      id: 'J_prismPlayer',
      source: '//player.alicdn.com/video/editor.mp4',
      //       cover: 'https://img.alicdn.com/tps/TB1EXIhOFXXXXcIaXXXXXXXXXXX-760-340.jpg', //设置封面会导致在拖动进度条时，无法看到进度条的位置改动
      width: '100%',
      height: '100%',
      autoplay: false,
      isLive: false,
      controlBarVisibility: 'always',
      progressMarkers: [
        {
          offset: 30,
          isCustomized: true,
          coverUrl:
            'https://alivc-demo-vod.aliyuncs.com/image/cover/9A3F562E595E4764AD1DD546FA52C6E5-6-2.png',
          title: 'test title',
          describe: 'test string'
        },
        {
          offset: 50,
          isCustomized: true,
          coverUrl:
            'https://alivc-demo-vod.aliyuncs.com/image/cover/1E7F402241CD4C0F94AD2BBB5CCC3EC7-6-2.png',
          title: 'test title',
          describe: 'test string'
        },
        {
          offset: 150,
          isCustomized: true,
          coverUrl:
            'https://alivc-demo-vod.aliyuncs.com/image/cover/553AEA01161342C8A2B1756E83B69B5B-6-2.png',
          title: 'test title',
          describe: 'test string'
        },
        {
          offset: 120,
          isCustomized: true,
          coverUrl:
            'https://alivc-demo-vod.aliyuncs.com/image/cover/553AEA01161342C8A2B1756E83B69B5B-6-2.png',
          title: 'test title',
          describe: 'test string'
        }
      ],
      components: [
        {
          name: 'ProgressComponent',
          type: AliPlayerComponent.ProgressComponent
        }
      ]
    },
    (player) => {
      console.log('The player is created.')
    }
  )
  //used for debug mode
  window.player = player.value
}
const seek = (time) => player.value.seek(time)
const getCurrentTime = () => player.value.getCurrentTime()
const getDuration = () => player.value.getDuration()
const pause = () => player.value.pause()

defineExpose({ seek, pause, getCurrentTime, getDuration })
const initPlayerSdkScript = () => {
  const script = document.createElement('script')
  script.setAttribute('charset', 'utf-8')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', 'https://g.alicdn.com/de/prismplayer/2.15.2/aliplayer-h5-min.js')
  document.body.appendChild(script)
  script.addEventListener('load', () => {
    console.log('player sdk loaded')
    initPlayerSdk()
  })
}

const initPlayerSdkStyle = () => {
  const style = document.createElement('link')
  style.setAttribute('rel', 'stylesheet')
  style.setAttribute('type', 'text/css')
  style.setAttribute(
    'href',
    'https://g.alicdn.com/de/prismplayer/2.15.2/skins/default/aliplayer-min.css'
  )
  document.head.appendChild(style)
}
</script>

<style lang="less" scoped>
.page {
  #J_prismPlayer {
    width: 65%;
    height: 80%;
  }
}
</style>
