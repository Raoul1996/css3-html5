'use strict'

class ImageZoomer {
  constructor () {
    this.element = document.querySelector('.zoomer')
    this.target = document.querySelector('.target')
    this.canvas = document.querySelector('.zoomer__canvas')
    this.ctx = this.canvas.getContext('2d')

    this.onStart = this.onStart.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onEnd = this.onEnd.bind(this)
    this.update = this.update.bind(this)
    this.onResize = this.onResize.bind(this)

    this.targetBCR = null
    this.zoomed = 0
    this.targetZoomed = 0

    this.x = 0
    this.y = 0
    this.trackingTouch = false
    this.scheduledUpdate = false

    this.initCanvas()
    this.addEventListeners()
    this.onResize()
    requestAnimationFrame(this.update)

  }

  initCanvas () {
    const width = 128
    const height = 128
    const dPR = window.devicePixelRatio || 1

    this.canvas.width = width * dPR
    this.canvas.height = height * dPR

    this.canvas.style.width = `${width}px`
    this.canvas.style.height = `${height}px`

    this.ctx.scale(dPR, dPR)
  }
onResize() {
    this.targetBCR = this.target.getBoundingClientRect()
}
  onStart (evt) {
    if (evt.target !== this.target) return
    this.x = evt.pageX || evt.touches[0].pageX
    this.y = evt.pageY || evt.touches[0].pageY

    // evt.preventDefault()
    this.trackingTouch = true

    this.targetZoomed = 1
  }

  onMove (evt) {
    if (!this.trackingTouch) return
    this.x = evt.pageX || evt.touches[0].pageX
    this.y = evt.pageY || evt.touches[0].pageY
  }

  onEnd () {
    this.trackingTouch = false

    this.targetZoomed = 0
    // console.log('haha')
  }

  update () {
    const TAU = Math.PI * 2
    const MAX_RADIUS = 46
    const radius = this.zoomed * MAX_RADIUS

    const targetX = (this.x - this.targetBCR.left) / this.targetBCR.width;
    const targetY = (this.y - this.targetBCR.top) / this.targetBCR.height;
    console.log(targetX,targetY)
    this.ctx.shadowColor = 'rgba(0,0,0,.4)'
    this.ctx.shadowBlur = 12
    this.ctx.shadowOffsetY = 8

    this.ctx.clearRect(0, 0, 128, 128)
    this.ctx.fillStyle = 'rgba(0,0,0,.1)'
    this.ctx.beginPath()
    this.ctx.arc(64, 116 - (radius + 1), radius + 1, 0, TAU)
    this.ctx.closePath()
    this.ctx.fill()

    this.ctx.save()
    this.ctx.arc(64, 116 - radius, radius, 0, TAU)
    this.ctx.clip()
    this.ctx.drawImage(this.target, -targetX, -targetY)
    this.ctx.restore()

    this.element.style.transform = `translate(${this.x}px,${this.y}px)`

    this.zoomed += (this.targetZoomed - this.zoomed) / 5
    this.trackingTouch = false
    requestAnimationFrame(this.update)

  }

  addEventListeners () {
    document.addEventListener('touchstart', this.onStart)
    document.addEventListener('touchmove', this.onMove)
    document.addEventListener('touchend', this.onEnd)
    window.addEventListener('resize',this.onResize)
  }

  removeEventListeners () {
    document.removeEventListener('touchstart', this.onStart)
    document.removeEventListener('touchmove', this.onMove)
    document.removeEventListener('touchend', this.onEnd)
    window.removeEventListener('resize',this.onResize)
  }
}

window.addEventListener('load', () => {
  new ImageZoomer()
})