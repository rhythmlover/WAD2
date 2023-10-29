<template>
  <div>
    <!-- <h2 style="text-align: center">{{ header }}</h2> -->
      <Doughnut :data="chartData" :options="chartOptions" ></Doughnut>
  </div>
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  props: ['data', 'labels', 'backgroundColors'], // Define props to receive data

  data() {
    return {
      header: 'Sector Allocation of Portfolio',
      chartData: {
        labels: this.labels, // Use props directly
        datasets: [
          {
            backgroundColor: this.backgroundColors, // Use props directly
            data: this.data // Use props directly
          }
        ],
        hoverOffset: 4
      },
      chartOptions: {
        responsive: true
      }
    }
  },

  components: {
    Doughnut
  }
}
</script> 
