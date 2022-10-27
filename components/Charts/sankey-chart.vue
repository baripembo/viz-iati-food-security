<template>
  <div>
    <div class="badges">
      <div>
        <b-badge variant="dark">
          Provider Org
        </b-badge>
        <b-badge
          v-b-tooltip.hover
          class="info-icon p-0"
          variant="dark"
          pill
          :title="tooltips['sankeyProviderLabel']">
          ?
        </b-badge>
      </div>
      <div>
        <b-badge v-if="maxNodeDepth>1" variant="dark">
          Reporting Org
        </b-badge>
      </div>
      <div>
        <b-badge variant="dark">
          Receiver Org
        </b-badge>
        <b-badge
          v-b-tooltip.hover
          class="info-icon p-0"
          variant="dark"
          pill
          :title="tooltips['sankeyReceiverLabel']">
          ?
        </b-badge>
      </div>
    </div>
    <div id="sankeyChart" ref="sankeyChart">
      <svg :width="width" :height="height">
        <pattern
          id="diagonalHatch"
          width="10"
          height="10"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="10" style="stroke:black; stroke-width:1" />
        </pattern>
        <g>
          <rect
            v-for="(node) in nodes"
            v-bind="nodes"
            :key="node.index"
            :x="node.x0"
            :y="isNaN(node.y0) ? 0 : node.y0"
            :height="isNaN(node.y1) || isNaN(node.y0) ? 0 : Math.max(node.y1 - node.y0, 0)"
            :width="node.x1-node.x0"
            :fill="node.name=='» (unspecified org)' ? 'url(#diagonalHatch)': color(node)"
            class="node" />
        </g>
        <g>
          <g
            v-for="(link) in links"
            v-bind="links"
            :id="`link-${link.index}`"
            :key="link.index"
            :class="selectedLink == link.index ? 'link linkHover' : 'link'"
            style="mix-blend-mode: multiply;">
            <linearGradient
              :id="`${link.index}-gradient`"
              :x1="link.source.x1"
              :x2="link.target.x0"
              gradientUnits="userSpaceOnUse">
              <stop
                :stop-color="color(link.source)"
                offset="0%" />
              <stop
                :stop-color="color(link.target)"
                offset="100%" />
            </linearGradient>
            <path
              :d="sankeyLinkPaths(link)"
              :stroke="`url(#${link.index}-gradient)`"
              :stroke-width="Math.max(1, link.width)"
              @mouseover="mouseoverLink(link.index)"
              @mouseleave="mouseleaveLink(link.index)"
            />
          </g>
        </g>
        <g font-family="sans-serif" font-size="12">
          <text
            v-for="(node) in nodes"
            v-bind="nodes"
            :key="node.index"
            :x="node.x0 < width / 2 ? node.x1 + 6 : node.x0 - 6"
            :y="isNaN(node.y1) || isNaN(node.y1) ? 0 : (node.y1 + node.y0) / 2"
            :text-anchor="node.x0 < width / 2 ? 'start' : 'end'"
            dy="0.35em">
            {{ truncate(node.name) }}
            <title>{{ node.name }}</title>
          </text>
        </g>
        <g font-family="sans-serif" font-size="12">
          <g
            v-for="(link) in links"
            v-bind="links"
            :key="`${link.index}-label`"
            :style="selectedLink == link.index ? 'display: block;' : 'display: none;'"
            class="linkText"
            @mouseover="mouseoverLink(link.index)"
            @mouseleave="mouseleaveLink(link.index)">
            <text
              :x="labelXPosition(link)"
              :y="isNaN(link.y0) || isNaN(link.y1) ? 0 : labelYPosition(link)"
              :width="link.width"
              dy="0.35em"
              :text-anchor="labelAnchor(link)">
              USD {{ numberFormatter(link.value) }}
            </text>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>
<style lang='scss'>
.badges {
  display: flex;
  justify-content: space-between;
}
#sankeyChart {
  height: 400px;
  width: 100%;
}
.node rect {
  cursor: move;
  fill-opacity: .9;
  shape-rendering: crispEdges;
}
.node text {
  pointer-events: none;
  text-shadow: 0 1px 0 #fff;
}
.link {
  fill: none;
  stroke: #000;
  stroke-opacity: .3;
}
.linkHover {
  stroke-opacity: .5;
}
.linkText {
  fill: #000000;
  text-shadow: 1px 1px 3px #ffffff;
  cursor: default;
}
</style>
<script>
import { select as d3Select } from 'd3-selection'
import { sankey as d3Sankey, sankeyLinkHorizontal as d3SsankeyLinkHorizontal } from 'd3-sankey'
import numeral from 'numeral'
export default {
  name: 'SankeyChart',
  props: ['chartData'],
  data () {
    return {
      maximumVisibleItems: 10,
      chart: null,
      width: 10,
      height: 10,
      selectedLink: null,
      colors: ['#418FDE', '#E56A54', '#ECA154', '#E2E868', '#A4D65E', '#71DBD4', '#9063CD', '#D3BC8D', '#82B5E9', '#EFA497', '#F4C799', '#C6E69B', '#AEEAE6', '#418FDE', '#E56A54', '#ECA154', '#E2E868', '#A4D65E', '#71DBD4', '#9063CD', '#D3BC8D', '#82B5E9', '#EFA497', '#F4C799']
    }
  },
  computed: {
    tooltips () {
      return this.$store.state.tooltips
    },
    nodes () {
      return this.sankey.nodes
    },
    links () {
      return this.sankey.links
    },
    maxNodeDepth () {
      const depths = this.sankey.nodes.map(n => n.depth)
      return Math.max(...depths)
    },
    sankey () {
      const nodes = this.chartData.nodes
      const links = this.chartData.links
      const sankey = d3Sankey()
        .nodeId(d => d.name)
        .nodeWidth(20)
        .nodePadding(8)
        .extent([[1, 5], [this.width - 1, this.height - 10]])
      return sankey({
        nodes: nodes.map(d => Object.assign({}, d)),
        links: links.map(d => Object.assign({}, d))
      })
    },
    sankeyLinkPaths () {
      return d3SsankeyLinkHorizontal()
    }
  },
  mounted () {
    this.makeChart()
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  methods: {
    truncate (str) {
      if (str.length > 50) {
        str = str.substr(0, 50) + '...'
      }
      return str
    },
    mouseoverLink (index) {
      this.selectedLink = index
    },
    mouseleaveLink (index) {
      this.selectedLink = null
    },
    sankeyLinkPath (d) {
      return this.sankeyLinkPaths(d)
    },
    numberFormatter (value) {
      if (value === 0) { return '0' }
      return value
        ? numeral(value).format('$0,0')
        : ''
    },
    labelXPosition (link) {
      if (this.maxNodeDepth < 2) {
        return link.source.x1 + (link.target.x0 - link.source.x1) / 2
      } else {
        return link.source.x1 > this.width / 2 ? link.source.x1 + 6 : link.target.x0 - 6
      }
    },
    labelYPosition (link) {
      if (this.maxNodeDepth < 2) {
        return (link.y1 + link.y0) / 2
      } else {
        const isRight = link.source.x1 > this.width / 2
        let yPos = isRight ? link.y0 : link.y1
        // dont overlap with org name
        yPos = (Math.abs(yPos - this.height / 2) < 15 && isRight) ? yPos - 15 : yPos
        return yPos
      }
    },
    labelAnchor (link) {
      if (this.maxNodeDepth < 2) {
        return 'middle'
      } else {
        return link.source.x1 > this.width / 2 ? 'start' : 'end'
      }
    },
    color (d) {
      if (d.name === '» (unspecified org)') { return '#999' }
      return this.colors[d.index]
    },
    makeChart () {
      d3Select('#sankeyChart')
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
    },
    onResize () {
      this.width = this.$el.offsetWidth
      this.height = 500
    }
  }
}
</script>
