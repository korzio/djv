var Measured = require('measured');
var stats = {
    generatedNonRefFunctions: new Measured.Counter(),
    generatedFunctionsUsed: new Measured.Counter(),
    generatedFunctions: [],
    visits: {},
    expressionEvaluated: new Measured.Counter(),
    expressions: {}
};

process.stats = stats;

module.exports = {
    stats: stats,
    print: function(flag){
        if(flag === false) {
            return;
        }

        //*****//
        console.info('generatedNonRefFunctions', stats.generatedNonRefFunctions.toJSON());
        console.info('generatedFunctionsUsed', stats.generatedFunctionsUsed.toJSON());
        console.info('expressionEvaluated', stats.expressionEvaluated.toJSON());
        var expressions = Object.keys(stats.expressions).map(function(key){
            return { count: stats.expressions[key].toJSON(), key : key };
        }).sort(function compareNumbers(b, a) {
        return a.count - b.count;
        });
        console.info('expressions', expressions);

        var visits = Object.keys(stats.visits).map(function(key){
            return { count: stats.visits[key].toJSON(), key : key };
        }).sort(function compareNumbers(b, a) {
        return a.count - b.count;
        });
        console.info('visits', visits);
        var generatedFunctions = stats.generatedFunctions.sort((a,b) => a.time < b.time ? 1: (a.time === b.time ? 0 : -1));

        console.info('generatedFunctions', generatedFunctions.slice(0, 20));
        //*****//
    }
};