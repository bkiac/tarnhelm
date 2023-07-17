import Redis from "ioredis"
import {config} from "../../config"

export const redis = new Redis(config.get("redis").url)
