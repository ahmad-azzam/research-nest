const { parentPort, workerData } = require('worker_threads');

const testData = [];

for (
  let index = workerData.startIndex;
  index < workerData.finishIndex;
  index++
) {
  const dataResponse = workerData.response[index];

  testData.push({
    country: dataResponse[8].toString(),
    full_name: `${dataResponse[1]} ${dataResponse[2]} ${dataResponse[3]}`,
    gender: dataResponse[0].toString(),
  });
}

parentPort.postMessage(testData);
