/*
 * @Author: zcx
 * @Date: 2022-08-05 10:13:12
 * @LastEditTime: 2022-10-09 15:16:42
 * @LastEditors: liz
 * @Description:
 * @FilePath: \jnks-drone\src\mixins\AutoPlay.js
 */
// 销毁timer
// 自动播放chart
import { onUnmounted } from 'vue'
export const autoPlay = (chart, size, tips = true, milliseconds = 2500) => {
  let timer = null
  let index = -1
  chart.on('mouseover', (e) => {
    e.dataIndex !== index &&
      chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: index,
      })
  })
  timer = setInterval(() => {
    chart.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: index,
    })

    index = (index + 1) % size

    chart.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: index,
    })
    tips &&
      chart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: index,
      })
  }, milliseconds)
  onUnmounted(() => {
    clearInterval(timer.value)
  })
}
