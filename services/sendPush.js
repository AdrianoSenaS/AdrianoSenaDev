async function sendPush(token, title, body, data = {}) {
   const message = {
    to: token,
    sound: 'default',
    title: title,
    body: body,
    data: { someData: data },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

module.exports = { sendPush };