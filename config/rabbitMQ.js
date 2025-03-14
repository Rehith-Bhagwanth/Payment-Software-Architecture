const amqp = require("amqplib/callback_api");

const publishToQueue = (event) => {
  amqp.connect(process.env.RABBITMQ_URL, (err, connection) => {
    if (err) {
      console.error("Failed to connect to RabbitMQ:", err);
      return;
    }

    connection.createChannel((err, channel) => {
      if (err) {
        console.error("Failed to create channel:", err);
        return;
      }

      const queue = "stripe-events";
      const msg = JSON.stringify(event);

      channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });

      console.log("Event sent to RabbitMQ:", msg);

      setTimeout(() => {
        connection.close();
      }, 500);
    });
  });
};

module.exports = publishToQueue;
