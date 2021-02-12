import './clock.scss'
const updateMilliseconds = 50
const clock = {
  container: null,
  display:false,
  hands:{
    hour:null,
    minute:null,
    second: null
  },
  updateInterval:null,
  set: function() {
    
    const date = new Date()

    const hours = ((date.getHours() + 11) % 12 + 1)
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const ms = date.getMilliseconds()
    
    const minute = (minutes * 6) + (seconds / 10);
    const hour = (hours * 30) + (minutes / 2);
    const second = (updateMilliseconds === 1000) ? (seconds * 6) : ((seconds * 6) + (6*(ms/1000)))
    this.hands.hour.style.transform = `translate(-50%, -100%) rotate(${hour}deg)`
    this.hands.minute.style.transform = `translate(-50%, -100%) rotate(${minute}deg)`
    this.hands.second.style.transform = `translate(-50%, -100%) rotate(${second}deg)`
  },
  show:function(onHide) {
    this.onHide = onHide
    if (!this.container) {
      const hours = []
      for(let h = 1; h<=12; h++) {
        hours.push(h)
      }
      this.container = document.createElement('div')
      this.container.innerHTML = `<div class="dial">
        <div class="wrap">
    <span class="hour"></span>
    <span class="minute"></span>
    <span class="second"></span>
    <span class="dot"></span>
    ${hours.map(h => `<span class="tick" hour='${h}'></span>`).join("")}
  </div>
  </div>`
      this.container.classList.add('clock')
      this.container.addEventListener("click",() => {
        this.hide()
      })
      document.body.append(this.container)
      setTimeout(() => {
        this.hands.hour = this.container.querySelector('.hour')
        this.hands.minute = this.container.querySelector('.minute')
        this.hands.second = this.container.querySelector('.second')
        this.set()
        clearInterval(this.updateInterval)
        this.updateInterval = setInterval(() => {
          this.set()
        },updateMilliseconds)
      })
    }else{
      
        clearInterval(this.updateInterval)
        this.updateInterval = setInterval(() => {
          this.set()
        },updateMilliseconds)
    }
      setTimeout(() => {
        this.container.classList.add('show')
        this.display = true
      })
  },
  hide:function() {
    if (this.container) {
        this.container.classList.remove('show')
        this.display = false
        clearInterval(this.updateInterval)
        this.onHide()
    }
  }
}
export default clock