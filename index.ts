/*
 * index.ts
 */


import * as mqtt from 'mqtt';


// this is the callback function for message reception from
// an MQTT subscription. The callback receives the topic string
// and a raw buffer of data. We need to convert the buffer into
// a string that can then be converted into a JSON object that matches
// the originally published payload. 
// 
// Process the payload as you see fit (e.g. insert data into a database,
// save into a file, etc.)

async function processMessageReceived (t:string, m:Buffer)
{
    let payload:any = JSON.parse (m.toString());
    console.log (`topic ${t} has random number ${payload.value}`);
}



async function main()
{
    console.log ("Hello from MQTT subscribing test application.");

    // connect to broker

    let url:string = 'mqtt://127.0.0.1:1883';
    const mqttClient:mqtt.MqttClient = await mqtt.connectAsync(url);
    console.log ("connected to MQTT broker at ", url);

    // make request to subcribe to the topic of choice

    let topic:string = "mqttpub/randomNumber";
    mqttClient.subscribe (topic);
    console.log ("subscribed to topic: ", topic);

    // set up handler to process subcription messages

    mqttClient.on ('message', (topic, message) => processMessageReceived(topic,message));
    console.log ("set up message handler for subscribed topic");

    // support shutting down the connection if the microservice is terminated

    const shutdown = async() => {
        console.log ("disconnecting from MQTT broker");
        await mqttClient.endAsync();
        process.exit(0);
    }

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    console.log ("ready to run");
}


main();