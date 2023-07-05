// 销毁timer
import {ref,onUnmounted} from 'vue'
export const timerDestroy = ()=>{

  let timer =ref(null)
 
  onUnmounted(()=>{
    clearInterval(timer.value)
  })
}
