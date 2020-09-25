<template>
  <div class="show-page">
    <div class="grid-container" :style="gridStyle" v-if="images.length">
      <div class="grid-item" v-for="item in images" :key="item.key" :style="imageStyle(item.area)">
        <img :src="item.url + '@compress680'" :alt="item.name" :srcset="srcset(item.url)" :sizes="sizes">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowPage",
  data() {
    return {
      gridCol: null,
      gridRow: null,
      ratio: 1.77,
      images: [],
      areas: [],
      title: "",
    }
  },
  computed: {
    imageHeight() {
      if (!this.gridCol) return 0
      let innerWidth = window.innerWidth - (10 * (this.gridCol + 1))
      let itemWidth = parseFloat(innerWidth / this.gridCol).toFixed(4)
      return parseFloat(itemWidth / this.ratio).toFixed(4)
    },
    gridStyle() {
      let rows = this.areas.map(item => item.join(' '))
      let areas = ""
      rows.forEach(item => { areas += `'${item}'` })
      return {
        gridTemplateAreas: areas,
        gridAutoRows: `${this.imageHeight}px`,
        gridTemplateRows: `repeat(${this.gridRow}, ${this.imageHeight}px)`,
        gridTemplateColumns: `repeat(${this.gridCol}, 1fr)`,
      }
    },
    sizes() {
      return `
        (max-width: 768px) 240px,
        (max-width: 1200px) 460px,
        680px
      `
    },
    srcset() {
      return function (url) {
        return `
          ${url}@compress240 240w,
          ${url}@compress460 460w,
          ${url}@compress680 680w
        `
      }
    },
    imageStyle() {
      return function(area) {
        return area ? { gridArea: area } : {}
      }
    }
  },
  mounted() {
    this.findList()
  },
  methods: {
    findList() {
      let ajax = new XMLHttpRequest()
      ajax.onerror = error => {
        console.log(error)
      }
      ajax.onloadend = () => {
        let data    = JSON.parse(ajax.response)
        let gridCol = Number(data.gridCol)
        let gridRow = Number(data.gridRow)
        let ratio   = parseFloat(data.ratio) || 1.77

        if (data.images.length < 1) return
        if (isNaN(gridCol) || isNaN(gridRow)) return

        this.gridCol  = gridCol
        this.gridRow  = gridRow
        this.ratio    = ratio
        this.images   = data.images
        this.areas    = data.areas
        this.title    = data.title
      }
      ajax.open('GET', 'https://qiniu.miiiku.xyz/works/demo.json?t=' + Date.now())
      ajax.send()
    }
  }
}
</script>

<style lang="css" scoped>
.grid-container {
  display: grid;
  gap: 10px;
  padding: 10px;
}

.grid-item {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2);
}

.grid-item img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>