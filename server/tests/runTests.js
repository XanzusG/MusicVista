#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const TEST_TYPES = {
  UNIT: 'unit',
  INTEGRATION: 'integration',
  ALL: 'all',
  WATCH: 'watch',
  COVERAGE: 'coverage',
};

const runCommand = (command, description) => {
  console.log(`\n🚀 ${description}...`);
  console.log(`📋 Command: ${command}`);
  
  try {
    const output = execSync(command, { 
      stdio: 'inherit', 
      cwd: path.resolve(__dirname, '..') 
    });
    console.log(`\n✅ ${description} completed successfully!`);
    return true;
  } catch (error) {
    console.error(`\n❌ ${description} failed!`);
    console.error(error.message);
    return false;
  }
};

const main = () => {
  const args = process.argv.slice(2);
  const testType = args[0] || TEST_TYPES.ALL;

  console.log('🧪 MusicVista Backend Test Runner\n');

  switch (testType) {
    case TEST_TYPES.UNIT:
      runCommand('npm run test:unit', 'Running Unit Tests');
      break;
      
    case TEST_TYPES.INTEGRATION:
      runCommand('npm run test:integration', 'Running Integration Tests');
      break;
      
    case TEST_TYPES.WATCH:
      runCommand('npm run test:watch', 'Running Tests in Watch Mode');
      break;
      
    case TEST_TYPES.COVERAGE:
      runCommand('npm run test:coverage', 'Running Tests with Coverage');
      console.log('\n📊 Coverage report generated in coverage/ directory');
      break;
      
    case TEST_TYPES.ALL:
      console.log('🔍 Running all tests...\n');
      
      const unitSuccess = runCommand('npm run test:unit', 'Unit Tests');
      const integrationSuccess = runCommand('npm run test:integration', 'Integration Tests');
      
      if (unitSuccess && integrationSuccess) {
        console.log('\n🎉 All tests passed!');
        runCommand('npm run test:coverage', 'Generating Coverage Report');
      } else {
        console.log('\n💥 Some tests failed!');
        process.exit(1);
      }
      break;
      
    default:
      console.log('❓ Unknown test type. Available options:');
      Object.values(TEST_TYPES).forEach(type => {
        console.log(`  - ${type}`);
      });
      console.log('\nUsage: node tests/runTests.js [unit|integration|all|watch|coverage]');
      process.exit(1);
  }
};

main();