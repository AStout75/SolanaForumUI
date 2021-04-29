/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */
const hw = require("./hello_world.js");

// test('Test EstablishConnection', async () => {
//     const ret = await hw.establishConnection();
//   });

// test('Test EstablishPayer', async () => {
//     const ret = await hw.establishConnection();
//     const ret1 = await hw.establishPayer();
//   });

test('Test sending post', async () => {
  console.error = jest.fn()
  const ret = await hw.establishConnection();
  const ret1 = await hw.establishPayer();
  const ret2 = await hw.loadProgram();
  const t = await hw.sayHello("jest test");
}, 10000);