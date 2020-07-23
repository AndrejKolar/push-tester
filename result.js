const checkResult = (result) => {
  result.message.forEach((message) => {
    if (message.error === null) {
      console.log("Push message sent successfuly!");
    } else {
      console.error("Error sending push message");
    }
    console.error(message);
  });
};

// run

const check = (results) => {
  results.forEach((result) => {
    checkResult(result);
  });
};

exports.check = check;
