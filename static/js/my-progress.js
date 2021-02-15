;(function() {
  const templateString = `
    <style>
      .bg {
        width: 300px;
        height: 30px;
        border-radius: 15px;
        box-shadow: 0 0 4px 0 #2db7f5 inset;
        overflow: hidden;
      }
      .bar {
        height: 30px;
        width: 0;
        line-height: 30px;
        border-radius: 15px;
        box-shadow: 1px 0 2px 0 #2db7f5;
        background-color: #2db7f5;
        text-align: center;
        font-size: 14px;
        box-sizing: border-box;
        transition: width .3s ease-in-out;
      }

      .bar .text {
        color: #fff;
      }
    </style>

    <div class="bg">
      <div class="bar">
        <slot class="text" name="text"></slot>
      </div>
    </div>
  `

  const template = document.createElement('template')
  template.id = 'my-progress-template'
  template.innerHTML = templateString

  /**
   * 进度条组件构造函数
   * 继承HTMLElement
   */
  class MyProgress extends HTMLElement {
    // 注意⚠️，attributeChangedCallback回调需要添加此方法，返回要监听变动的属性
    static get observedAttributes() {
      return ['value']
    }

    constructor(...args) {
      super(...args)
      this.init()
    }

    init() {
      // let template = document.getElementById('my-progress-template')
      const shadow = this.attachShadow({ mode: 'open' })
      shadow.appendChild(template.content.cloneNode(true))
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'value') {
        const root = this.shadowRoot
        const bar = root.querySelector('.bar')
        let number = +newValue
        if (number > 1 || number < 0) {
          bar.style.width = 0
          throw new Error('progress value must between 0 and 1')
        }
        bar.style.width = number * 100 + '%'
      }
    }
  }
  // 注册组件
  if (!customElements.get('my-progress')) {
    customElements.define('my-progress', MyProgress)
    console.log('注册my-progress组件')
  }

  function initPlugin() {
    customElements.whenDefined('my-progress').then(() => {
      const mountPoint = document.getElementById('my-progress-mount')
      if (!mountPoint) {
        return
      }
      const myProgress = document.createElement('my-progress')
      const progressText = document.createElement('span')
      progressText.slot = 'text'

      myProgress.appendChild(progressText)

      mountPoint.appendChild(myProgress)
      console.log('挂载my-progress')
      // 控制器部分
      const rangeInput = document.getElementById('range-btn')
      // const myProgress = document.getElementById('my-progress')
      // const progressText = document.getElementById('progress-text')
      myProgress.setAttribute('value', rangeInput.value)
      progressText.innerText = (+rangeInput.value * 100).toFixed(0) + '%'
      rangeInput.addEventListener('input', e => {
        myProgress.setAttribute('value', e.target.value)
        progressText.innerText = (+e.target.value * 100).toFixed(0) + '%'
      })
    })
  }

  if (document.readyState === 'complete') {
    initPlugin()
  }

  window.addEventListener('load', () => {
    initPlugin()
  })
})()
