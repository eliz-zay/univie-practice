import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';

function toBuffer(payload: any): Buffer {
    return Buffer.from(JSON.stringify(payload));
}

function parseRpcMessage(msg: amqp.ConsumeMessage): {
    payload: any;
    correlationId: string;
    replyTo: string;
    headers: MsgHeaders;
} {
    const payload = JSON.parse(msg.content.toString());
    const { correlationId, headers, replyTo } = msg.properties;

    return { payload, correlationId, replyTo, headers: headers as MsgHeaders };
}

function parseExchangeMessage(msg: amqp.ConsumeMessage): {
    routingKey: string;
    payload: any;
} {
    const payload = JSON.parse(msg.content.toString());
    const routingKey = msg.fields.routingKey;

    return { payload, routingKey };
}

/**
 * success = true => message contains successful response
 * success = false => see error code, message contains error message
 */
interface MsgHeaders {
    success: boolean;
    errorCode?: number;
}

interface RpcResponse {
    payload: any;
    success: boolean;
    errorCode?: number;
}

export class QueueManager {
    private static channel: amqp.Channel;
    private static callResolvers: Map<string, (response: RpcResponse) => void> = new Map();

    static setChannel(channel: amqp.Channel): void {
        QueueManager.channel = channel;
    }

    /**
     * Set up gateway consume from queueBaseName:response queue.
     * Automatically resolves respective calls.
     * 
     * @param queue queue name: microservice_name:endpoint_name
     */
    static async setUpRpcCallerConsume(queue: string): Promise<void> {
        QueueManager.channel.consume(queue, (msgRaw) => {
            if (!msgRaw) {
                throw Error('Empty message');
            }
            
            QueueManager.channel.ack(msgRaw);

            const { payload, correlationId, headers } = parseRpcMessage(msgRaw);
            const { errorCode, success } = headers;

            console.log(` [x] consumed ${queue}: ${correlationId}`);
            
            const callResolver = QueueManager.callResolvers.get(correlationId);

            if (callResolver) {
                callResolver({ payload, success, errorCode });
            } else {
                console.log(`Unknown uuid: ${correlationId}`);
            }

        });
    }

    /**
     * Set up service consume (from queue), response sent to message replyTo
     * 
     * @param queue queue name: microservice_name:endpoint_name
     */
    static async setUpConsume(
        queue: string,
        endpointHandler: (payload: any) => Promise<any>
    ): Promise<void> {
        QueueManager.channel.consume(queue, async (msgRaw) => {
            if (!msgRaw) {
                throw Error('Empty message');
            }

            QueueManager.channel.ack(msgRaw);

            const { payload, correlationId, replyTo } = parseRpcMessage(msgRaw);
            console.log(` [x] consumed ${queue}: ${correlationId}`);

            let response: any;
            let headers: MsgHeaders;

            try {
                response = await endpointHandler(payload);
                if (!response && response!= 0) {
                    response = { success: true };
                }
                
                headers = { success: true };
            } catch (err) {
                response = err.message ?? 'Unknown error';
                headers = { success: false, errorCode: err.errorCode ?? 500 };
            }
            
            QueueManager.channel.sendToQueue(
              replyTo,
              toBuffer(response),
              { correlationId, headers }
            );
        });
    }

    static async callRpcWithReplyTo(queue: string, replyTo: string, msgPayload: any): Promise<RpcResponse> {
        const correlationId = uuidv4();

        const promise = new Promise((resolve, reject) => {
            setTimeout(() => { reject('Timeout'); }, 5000);

            QueueManager.callResolvers.set(correlationId, resolve);
        });

        QueueManager.channel.sendToQueue(
            queue,
            toBuffer(msgPayload),
            { correlationId, replyTo }
        );

        console.log(` [x] sent to ${queue}: ${correlationId}`);

        return promise as Promise<RpcResponse>;
    }


    /**
     * Opens both request and response queues
     * 
     * @param queue
     */
    static async assertQueue(queue: string): Promise<void> {
        if (!this.channel) {
            throw "Channel must be set first!"
        }
        
        await this.channel.assertQueue(queue);
    }


    /**
     * Creates a topic Exchange
     *
     * @param exchangeBaseName exchange name: bookmarks
     * @returns
     */
    static async setUpTopicExchange(exchangeBaseName: string): Promise<void> {
        await this.channel.assertExchange(exchangeBaseName, 'topic', {
            durable: true
        });
    }

    /**
     * Sends messages to a topic Exchange with an topickey
     *
     * @param exchangeName exchange name
     * @param topicKey: topic key: create
     * @param msgPayload: message to send
     * @returns
     */
    static async publishToTopicExchange(exchangeName: string, topicKey: string, msgPayload: any) {
        console.log(" [x] Sent Topic Message %s:'%s'", topicKey, msgPayload);
        this.channel.publish(exchangeName, topicKey, toBuffer(msgPayload));
    }


    /**
     * Consumes all the messages specified in the handle from the given exchange per queue
     *
     * @param exchangeName exchange name
     * @param queueName queue name: must be unique for every service (but the same for services of the same type) for example use env.SERVICE_NAME
     * @param handles: array of callback key objects. Use this to define the bacllbacks for every topic create/delete/update... like [{topicKey:'delete', callback: (x) => console.log(x)}]
     * @returns
     */
    static async consumeTopicExchange(
        exchangeName: string, queueName: string, handlers: { topicKey: string, callback: (payload: any) => Promise<void> }[]
    ): Promise<void> {
        const q = await this.channel.assertQueue(queueName, {
            exclusive: false
        });

        handlers.forEach(h => {
            this.channel.bindQueue(q.queue, exchangeName, h.topicKey);
        });

        this.channel.consume(q.queue, async (msgRaw) => {
            if (!msgRaw) {
                throw Error('Empty message');
            }

            QueueManager.channel.ack(msgRaw);

            const { routingKey, payload } = parseExchangeMessage(msgRaw);
            console.log(" [x] Got Topic Message %s:'%s'", routingKey, JSON.stringify(payload));

            const handle = handlers.find((x) => x.topicKey === routingKey);
            if (handle) {
                await handle.callback(payload);
            }
        });
    }
}
