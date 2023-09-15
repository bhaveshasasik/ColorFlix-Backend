import { RedisCommandArgument } from '@node-redis/client/dist/lib/commands';
import { createClient } from 'redis';

const client = createClient();

const DEFAULT_EXPIRATION = 3600;
client.connect();
client.on('error', (err: Error) => console.log('Redis Client Error', err));

/**
 * If the key is found in cache, return the data
 * Otherwise, it will get the new data returned by the callback function and set it to the key
 */
function getOrSetCache(key: String, cb: CallableFunction) {
    return new Promise((resolve, reject) => {
        client.get(key as RedisCommandArgument)
            .then(async (data) => {
                if (data != null) return resolve(JSON.parse(data));
                const newData = await cb();
                client.setEx(key as RedisCommandArgument, DEFAULT_EXPIRATION, JSON.stringify(newData));
                resolve(newData);
            })
            .catch((err: Error) => {
                console.log('Redis cache issue:', err.message);
                reject(err);
            })
    });
}

const redisClient = {
    getOrSetCache
}

export default redisClient;
