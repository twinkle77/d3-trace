import './assets/style.less'
import data from './data'

import view from './view/index'
import Axis from './graph/axis'
import Bar from './graph/bar'
import Brush from './graph/brush'

import { getElementRect } from './util/element'

const target = document.body

const {
  mainWrapper,
  graphWrapper,
} = view.createContainer(target)

/**
 * 插入画布
 */
const svg = view
  .createSvg(graphWrapper)

/**
 * 初始化axis图
 */
const axis = new Axis(svg)

axis
  .tickSize(0)
  .domain([1, 2])

/**
 * 初始化bar图
 */
const bar = new Bar(svg, {
  data,
  offset: {
    top: 20,
    left: 0,
  },
})

/**
 * 初始化刷子
 */
const brush = new Brush(svg, {
  data,
  offset: {
    top: 20,
    left: 0,
  },
})

// setTimeout(() => {
//   const SVG_WIDTH = getElementRect(mainWrapper.node()).width
//   console.log('timeout', SVG_WIDTH)
// }, 2000)

function setup () {
  /**
   * 以target节点的宽度做为svg的宽度
   */
  const SVG_WIDTH = getElementRect(mainWrapper.node()).width

  axis
    .range(SVG_WIDTH)
    .render()
  const AXIS_HEIGHT = axis.getChartHeight()

  bar
    .setChartWidth(SVG_WIDTH)
    .render()
  const BAR_TOTOL_HEIGHT = bar.getChartHeight()


  brush
    .setBrushView({
      brushWidth: SVG_WIDTH,
      brushHeight: BAR_TOTOL_HEIGHT,
    })
    .render()

  /** axis图 和 graph图 渲染完成后再设置svg的长度 */
  svg
    .attr('width', SVG_WIDTH)
    .attr('height', AXIS_HEIGHT + BAR_TOTOL_HEIGHT)
}

setup()

window.addEventListener('resize', () => {
  setup()
})

/**
 * 刷子
 */

// function brushHandler () {
//   console.log('brushHandler')
//   console.log(event.selection)
//   console.log(event.selection.map(xScale.invert))
// }

// const brushInstance = brushX()
//   .extent([[0, 0], [1000, miniHeight]])
//   // .on('brush', brushHandler)
//   .on('end', brushHandler)

// miniG.append('g')
//   .attr('transform', `translate(${maxTextWidth}, 0)`)
//   .attr('class', 'x brush')
//   .attr('width', 1000)
//   .call(brushInstance)
//   .selectAll('rect')

/**  render header start */
const headerWrapper = mainWrapper.append('div')
  .classed('view-header', true)
/**  render header end */

function renderRow (container) {
  container
    .classed('trace-row', true)

  const leftCol = container
    .append('div')
    .classed('trace-left-col', true)
    // .text('table-left')

  const rightCol = container
    .append('div')
    .classed('trace-right-col', true)
  return {
    leftCol,
    rightCol,
  }
}

// const { leftCol, rightCol } = renderRow(headerWrapper)

// const headerAxisWrapper = rightCol
//   .append('svg')
//   .attr('width', '100%')
//   .attr('height', '100%')

// const headerAxis = new Axis(headerAxisWrapper)

// headerAxis
//   .tickSize(0)
//   .domain([1, 2])
//   .range(1000)
//   .render()

/** render body start */

function renderBody (spans) {
  for (let i = 0; i < spans.length; i++) {
    const { leftCol, rightCol } = renderRow(
      mainWrapper.append('div'),
    )

    leftCol
      .classed('left-col-span', true)

    leftCol


    const btnWrapper = leftCol
      .append('div')

    btnWrapper
      .append('button')
      .text('^')

    btnWrapper
      .append('a')
      .text(spans[i].label)
      .attr('style', `margin-left: ${spans[i].deep * 40}px `)

    if (spans[i].children && spans[i].children.length) {
      renderBody(spans[i].children)
    }
  }
}

// renderBody(data)

export default {
  Axis,
}
