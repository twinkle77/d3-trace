import {
  axisTop,
  axisRight,
  axisBottom,
  axisLeft,
} from 'd3-axis'
import d3 from '../d3'
import { getClass } from '../util/element'


/**
 * 坐标轴的朝向
 */
const POSITION = {
  TOP: d3.axisTop,
  RIGHT: d3.axisRight,
  BOTTOM: d3.axisBottom,
  LEFT: d3.axisLeft,
}

/**
 * 功能：
 * 1. 支持渲染各种方向的坐标轴
 * 2. 支持只渲染数值
 * 3. 支持重渲染
 */
class Axis {
  constructor (selection, options = {}) {
    this._selection = selection

    this._offset = options.offset || {
      top: 0, left: 0, right: 0, bottom: 0,
    }

    this._scaleFn = d3.scaleLinear()

    this._posFn = POSITION.TOP

    this._ticksCount = 5
    this._tickSize = 5
    this._tickPaddding = 3

    this._format = d3.format(options.format || '.1f')
  }

  domain (min, max) {
    if (!arguments.length) return this._scaleFn.domain()
    this._scaleFn.domain(arguments.length > 1 ? [min, max] : min)
    return this
  }

  range (axisWidth) {
    if (!arguments.length) return this._scaleFn.range()
    this._scaleFn.range([0, axisWidth - this._offset.left - this._offset.right])

    return this
  }

  ticks (number) {
    if (!arguments.length) return this._ticksCount
    this._ticksCount = number
    return this
  }

  tickSize (size) {
    if (!arguments.length) return this._tickSize
    this._tickSize = size
    return this
  }

  position (pos) {
    if (!arguments.length) return this._posFn
    this._posFn = POSITION[pos.toUpperCase()]
    return this
  }

  scale (fn) {
    if (!arguments.length) return this._scaleFn
    this._scaleFn = fn
    return this
  }

  tickPadding (padding) {
    if (!arguments.length) return this._tickPaddding
    this._tickPaddding = padding
    return this
  }

  tickFormat (formatFn) {
    if (!arguments.length) return this._format
    this._format = formatFn
    return this
  }

  render () {
    const axis = d3.axisTop()
      .scale(this._scaleFn)
      .ticks(this._ticksCount)
      .tickSize(this._tickSize)
      .tickPadding(this._tickPaddding)
      .tickFormat(this._format)

    this._selection
      .append('g')
      .classed(getClass('axis-container'), true)
      .attr('transform', () => `translate(${20 || this._offset.left}, ${20 || this._offset.top})`)
      .call(axis)
  }

  destory () {
    return this
  }
}

export default Axis
