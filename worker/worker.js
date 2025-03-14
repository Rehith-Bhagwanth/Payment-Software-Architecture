require("dotenv").config();
const amqp = require("amqplib/callback_api");
const handlePaymentSuccess = require("../events/paymentSuccess");
const handlePaymentFailure = require("../events/paymentFailure");
const handleRefund = require("../events/paymentRefund");
const connectDB = require("../config/db");

const MAX_RETRIES = 3;

const processEventFromQueue = async () => {
  await connectDB();

  amqp.connect(process.env.RABBITMQ_URL, function (err, connection) {
    if (err) {
      console.error("Failed to connect to RabbitMQ:", err);
      return;
    }

    console.log("Connected to RabbitMQ");

    connection.createChannel(function (err, channel) {
      if (err) {
        console.error("Failed to create channel:", err);
        return;
      }

      const queue = "stripe-events";
      const retryQueue = "stripe-events-retry";
      const dlq = "stripe-events-dlq";

      channel.assertQueue(queue, { durable: true });
      channel.assertQueue(retryQueue, { durable: true });
      channel.assertQueue(dlq, { durable: true });

      console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

      channel.consume(queue, function (msg) {
        if (msg === null) {
          console.log("Consumer canceled by server");
          return;
        }

        let event;
        try {
          event = JSON.parse(msg.content.toString());
          console.log("Received Event from Queue:", event.type);
        } catch (error) {
          console.error("Invalid JSON received:", error.message);
          moveToDLQ(channel, msg, dlq);
          return;
        }

        let retryCount = msg.properties.headers["x-retry-count"] || 0;

        try {
          switch (event.type) {
            case "payment_intent.succeeded":
              handlePaymentSuccess(event);
              break;
            case "payment_intent.payment_failed":
              handlePaymentFailure(event);
              break;
            case "refund.created":
              handleRefund(event);
              break;
            default:
              console.log("Unhandled event type:", event.type);
          }

          channel.ack(msg);
        } catch (error) {
          console.error(`Error processing event: ${error.message}`);

          if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`Retrying message (${retryCount}/${MAX_RETRIES})...`);
            retryMessage(channel, msg, retryQueue, retryCount);
          } else {
            console.log("Max retries reached. Moving message to DLQ.");
            moveToDLQ(channel, msg, dlq);
          }
        }
      });
    });
  });
};

function retryMessage(channel, msg, retryQueue, retryCount) {
  channel.sendToQueue(retryQueue, msg.content, {
    persistent: true,
    headers: { "x-retry-count": retryCount },
  });
  channel.ack(msg);
}

function moveToDLQ(channel, msg, dlq) {
  channel.sendToQueue(dlq, msg.content, { persistent: true });
  channel.ack(msg);
}

process.on("SIGINT", () => {
  console.log("Shutting down gracefully...");
  process.exit();
});

processEventFromQueue();
