import d3 from '../d3'
import { getClass } from '../util/element'

export default class Bar {
  constructor (svg, options) {
    this._svg = svg
    this._options = Object.assign(this.defaultOptions, options)
    this._init()
  }

  _init () {
    const {
      barHeight, margin, data = [],
    } = this._options


    const chartHeight = (barHeight + margin * 2) * data.length
    this.chartHeight = chartHeight

    const lineCount = data.length + 1


    this._yScale = d3.scaleLinear().domain([0, lineCount]).range([0, chartHeight])


    const { offset } = this._options

    this._container = this._svg
      .append('g')
      .classed(getClass('bar-container'), true)
      .attr('transform', `translate(${offset.left}, ${offset.top})`)
  }

  /**
   * 线条绘制
   */
  _drawLines () {
    const { data, chartWidth } = this._options

    const lineClassName = getClass('bar-line')

    const lineEls = this._container
      .selectAll(`.${lineClassName}`)
      .data(data)

    lineEls
      .enter()
      .append('line')
      .classed(lineClassName, true)
      .merge(lineEls)
      .attr('x1', 0)
      .attr('y1', (_, index) => this._yScale(index))
      .attr('x2', chartWidth)
      .attr('y2', (_, index) => this._yScale(index))
      .attr('stroke', 'lightgray')

    lineEls
      .exit()
      .remove()
  }

  /**
   * 矩形绘制
   */
  _drawRects () {

  }

  // eslint-disable-next-line class-methods-use-this
  _drawText () {
    /*
    this.miniG.append('g')
      .selectAll('.ctext')
      .data(data)
      .enter()
      .append('text')
      .classed('ctext', true)
      .text((d) => d.label)
      .attr('x', -10)
      .attr('y', (d, index) => yScale(index + 1 + 0.5))
      .attr('dy', '0.5ex')
      .attr('text-anchor', 'start')
      .attr('style', 'font-size: 12px;')
      .each(function computeWidth (n) {
        n.textWidth = this.getComputedTextLength()
      })
    */
  }

  /** 计算x轴的比例尺 */
  _computeXscale () {
    const [minStartTime, maxEndTime] = this._getTimeRange()

    const { chartWidth } = this._options
    this._xScale = d3.scaleLinear().domain([minStartTime, maxEndTime]).range([0, chartWidth])
  }

  render ({ chartWidth }) {
    this._options.chartWidth = chartWidth
    this._computeXscale()
    this._drawLines()
    this._drawRects()
  }

  _getTimeRange () {
    const { data } = this._options
    return [
      d3.min(data, (d) => d.startTime),
      d3.max(data, (d) => d.endTime),
    ]
  }

  get defaultOptions () {
    return {
      barHeight: 12,
      margin: 4,
      chartWidth: 1000,
      offset: {
        top: 20,
        left: 20,
      },
    }
  }
}
