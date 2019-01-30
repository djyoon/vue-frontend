<template>
    <div class="market__chart">
        <div class="market__chartzone">
            <div class="tradingview-widget-container">
                <TVChartContainer style="height:100%;" :symbol="market_id" />
            </div>
        </div>
    </div>
</template>

<script src="./trade-chart.js"></script>
