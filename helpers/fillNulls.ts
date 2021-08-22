export default (reqBody) => {
  let body = {};
  Object.keys(reqBody).map((key) => {
    if (reqBody[key]) {
      body[key] = `${reqBody[key]}`;
    } else {
      body[key] = '';
    }
  });
  return body;
};
