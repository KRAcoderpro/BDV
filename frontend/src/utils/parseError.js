export function parseError(prefix, err) {
  let message = prefix;

//   if (err.reason) {
//     message += `: ${err.reason}`;
//   } else if (err.error?.message) {
//     message += `: ${err.error.message}`;
//   } else if (err.message) {
//     const match = err.message.match(/reverted.*?"([^"]+)"/);
//     if (match) {
//       message += `: ${match[1]}`;
//     } else {
//       const short = err.message.split('(')[0].trim();
//       message += `: ${short}`;
//     }
//   }

  return err.message;
}
