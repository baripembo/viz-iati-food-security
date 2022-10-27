<template>
  <div>
    <div class="scroll-list-container">
      <div class="scroll-list mt-3">
        <b-table borderless small class="summary-table mr-5 mb-0" :fields="tableFields" :items="items">
          <template #cell(color)="data">
            <div class="color-key" :style="data.index<5 ? 'background-color: ' + colors[data.index] : 'background-color: ' + colors[5]" />
          </template>
          <template #cell(item)="data">
            <abbr :title="data.item.item">{{ data.item.item | truncate(20, '...') }}</abbr>
          </template>
        </b-table>
      </div>
      <div class="scroll-list-overlay" />
    </div>
    <div class="scroll-list-footer mt-2">
      <span class="small text-muted">{{ lastUpdatedDate }} | IATI</span>
      <span>(USD)</span>
    </div>
  </div>
</template>
<style lang='scss'>
  .summary-table {
    font-size: 14px;
    thead {
      display: none;
    }
    td {
      padding: 0 8px 0 0;
      vertical-align: middle;
      &:last-child {
        padding-right: 0;
        text-align: right;
      }
    }
  }
  .color-key {
    height: 12px;
    width: 12px;
  }
  .scroll-list-container {
    position: relative;
  }
  .scroll-list {
    height: 170px;
    max-width: 273px;
    overflow-y: scroll;
    .list-breakdown {
      color: #888;
      padding-left: 10px;
    }
  }
  .scroll-list-overlay {
    background: rgb(255,255,255);
    background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%);
    bottom: 0;
    height: 30px;
    pointer-events: none;
    position: absolute;
    width: 100%;
  }
  .scroll-list-footer {
    display: flex;
    font-size: 14px;
    justify-content: space-between;
  }
</style>
<script>
export default {
  name: 'RankedList',
  components: {},
  filters: {
    truncate (text, length, suffix) {
      if (text.length > length) {
        return text.substring(0, length) + suffix
      } else {
        return text
      }
    }
  },
  props: [
    'items',
    'colors',
    'lastUpdatedDate'
  ],
  data () {
    return {
      tableFields: [
        { key: 'color', label: 'Color' },
        'item',
        'value'
      ]
    }
  }
}
</script>
