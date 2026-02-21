module.exports = {
    default: {
        requireModule: ['ts-node/register'],
        require: ['steps/**/*.ts', 'support/**/*.ts'],
        paths: ['features/**/*.feature'],
        format: ['progress', 'json:reports/cucumber-report.json'],
        publishQuiet: true
    }
};
