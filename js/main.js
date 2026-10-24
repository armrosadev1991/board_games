// Global variables
var scatterChart,
    yearChart,
    lineChart,
    bubbleChart,
    radialChart;
var filteredData = {};
var topData = {};
var variable_chosen = "top_mechanic_idx";
var minvalue = 1960;
var maxvalue = 2018;
var selectedClickedMechs = new Set();
var selectedClickedCat = new Set();

//Event listeners
d3.selectAll("#var-selectx").on("change", function () {
    scatterChart.wrangleData();
})

d3.selectAll("#var-selecty").on("change", function () {
    scatterChart.wrangleData();
})
d3.selectAll("#mechs_cat").on("change", function () {
    variable_chosen = d3.select('#mechs_cat')
        .property('value');
    bubbleChart.wrangleData();
})

d3.selectAll('button').on('click', function () {
    d3.selectAll('g.node')
        .each(function (d) {
            d3.select(this).selectAll('#data')
                    .style('stroke-width', '0px');
            });
    selectedClickedMechs.clear();
    selectedClickedCat.clear();

    scatterChart.wrangleData();
    radialChart.wrangleData();

})


d3.selectAll('#scattervalues').on("change", function () {
    minvalue = Number(document.getElementById('labelleft').innerHTML);
    maxvalue = Number(document.getElementById('labelright').innerHTML);
    scatterChart.wrangleData();
    lineChart.wrangleData();
    bubbleChart.wrangleData();
    radialChart.wrangleData();
})

function filterDataRange(data) {
    return data.filter(d => {
        return (
            d.year > 1960 &&
            d.year <= 2018
        );
    });
}

// Add timeout fallback in case data never loads
setTimeout(function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
        console.error('Timeout: Data took too long to load');
        loadingOverlay.innerHTML = '<div class="loader-content"><p style="color: #ff6b6b; font-size: 16px;">Error: Could not load data.<br>Please check the browser console for details.</p></div>';
    }
}, 10000); // 10 second timeout

console.log('Starting to load board games data...');
d3.json('data/board_games_mechs_cats.json').then(res => {
    console.log('Data loaded successfully:', res ? 'Yes' : 'No');
    console.log('Number of records:', res ? res.length : 0);

    filteredData = res;

    console.log('Initializing charts...');
    try {
        scatterChart = new ScatterChart("#scatterchart");
        yearChart = new YearChart('#eventhandler');
        lineChart = new LineChart('#my_dataviz');
        bubbleChart = new BubbleChart('#bubble');
        radialChart = new RadialChart('#radial-struc');
        console.log('Charts initialized successfully');
    } catch (chartError) {
        console.error('Error initializing charts:', chartError);
    }

    d3.selectAll('g.node')
        .each(function (d) {

            d3.select(this).selectAll('#data').on('click', function (d) {
                d3.select(this)
                    .style('stroke', 'white')
                    .style('stroke-width', '8px');

                if (variable_chosen == "top_mechanic_idx") {
                    selectedClickedMechs.add(d.key);
                    scatterChart.wrangleData();
                    radialChart.wrangleData();
                }
                else if (variable_chosen == "top_category_idx") {
                    selectedClickedCat.add(d.key);
                    scatterChart.wrangleData();
                    radialChart.wrangleData();
                }
            });
        });

    // Hide loading overlay after data loads and charts are initialized
    console.log('Hiding loading overlay...');
    setTimeout(function() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
            console.log('Loading overlay hidden');
        }
    }, 800);

}).catch(error => {
    console.error('Error loading board games data:', error);
    console.error('Error details:', error.message);
    console.error('Current URL:', window.location.href);
    console.error('Attempted data path:', window.location.origin + window.location.pathname + 'data/board_games_mechs_cats.json');

    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.innerHTML = '<div class="loader-content"><p style="color: #ff6b6b; font-size: 16px;">Error loading data:<br>' + error.message + '<br><br>Check browser console (F12) for details.</p></div>';
    }
});
