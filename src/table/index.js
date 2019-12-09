import view from '../view/index'
import { getElementRect, getClass } from '../util/element'
import d3 from '../d3'
import Axis from '../graph/axis'

class Table {
  constructor (target, options = {}) {
    this._treeData = options.treeData || []

    this._target = target

    this.options = options

    this._init()
  }

  _init () {
    this._initTableHeader()
    this._initTableBody()
    this._bindEvent()
  }

  render () {
    this._renderRect()
    this.renderHeaderAxis()
  }

  _initTableHeader () {
    const tableHeader = view.createTableHeader(this._target)
    tableHeader
      .attr('style', 'height: 30px;')
    const { leftCol, rightCol } = view.createTableRow(tableHeader)
    leftCol.text('header-left-col')

    this._rightCol = rightCol
    this._initRightHeader()
  }

  _initRightHeader () {
    const svg = this._rightCol
      .append('svg')
      .classed(getClass('header-axis'), true)
      .attr('height', this.options.table.rowHeight)
      .attr('width', '100%')

    this._headerAxis = new Axis(svg)

    this._headerAxis
      .tickSize(3)
      .tickFormat((d) => `${d}ms`)
  }

  _initTableBody () {
    this._tableBody = view.createTableBody(this._target)

    const allNodes = []
    const allRows = []

    this._treeData.forEach((root) => {
      root.eachBefore((node) => {
        const { leftCol, row } = view.createTableRow(this._tableBody)

        row.attr('style', `height: ${this.options.table.rowHeight}px`)

        leftCol
          .attr('style', `padding-left: ${this.options.table.paddingLeft * node.depth}%`)

        view
          .createSpan(leftCol)
          .text(node.data.label)

        allNodes.push(node)
        allRows.push(row)
      })
    })

    this._allRows = allRows
    this._allNodes = allNodes
  }

  /**
   * 首次绘制rect
   */
  _renderRect () {
    const rectTool = this._layupRect()

    const rectEls = this._tableBody
      .selectAll(`.${getClass('table-right-col')}`)
      .data(this._allNodes)
      .append('svg')
      .attr('width', '100%')
      .attr('height', this.options.table.rowHeight)
      .append('rect')
      .call(rectTool)

    rectEls
      .exit()
      .remove()
  }

  /**
   * d3 call函数，调整绘制rect的比例尺
   */
  _layupRect (domain) {
    const [minStartTime, maxEndTime] = this.options.timeRange

    const rowWidth = getElementRect(this._allRows[0].node()).width

    const xScale = d3
      .scaleLinear()
      .domain(domain || [minStartTime, maxEndTime]).range([0, rowWidth])

    const that = this

    return function draw (selection) {
      selection
        .attr('x', (node) => xScale(node.data.startTime))
        .attr('y', that.options.table.rowHeight / 2 - that.options.table.rectHeight / 2)
        .attr('width', (node) => (`${xScale(node.data.endTime) - xScale(node.data.startTime)}`))
        .attr('height', that.options.table.rectHeight)
    }
  }

  /**
   * 重置rect的位置跟宽度
   */
  resetRectWidth (domain) {
    const rectTool = this._layupRect(domain)

    this._tableBody
      .selectAll(`.${getClass('table-right-col')}`)
      .select('rect')
      .call(rectTool)
  }

  renderHeaderAxis (domain) {
    const [minStartTime, maxEndTime] = this.options.timeRange

    const SVG_WIDTH = getElementRect(this._rightCol.node()).width

    this._headerAxis
      .domain(domain ? domain.map((i) => parseInt(i, 10)) : [minStartTime, maxEndTime])
      .range(SVG_WIDTH)
      .render()
  }


  _bindEvent () {
    d3
      .select(window)
      .on('resize.table', () => {
        this.resetRectWidth()
        this.renderHeaderAxis()
      })
  }

  destory () {
    d3
      .select(window)
      .on('resize.table', null)
  }
}

export default Table
