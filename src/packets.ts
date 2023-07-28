/*
 * OP CODES
 */

/*
 * we export code so that webpack can directly resolve them
 */

export enum Packets {
    REG_CANVAS_OP = 0xA0,
    REG_CHUNK_OP = 0xA1,
    DEREG_CHUNK_OP = 0xA2,
    REG_MCHUNKS_OP = 0xA3,
    DEREG_MCHUNKS_OP = 0xA4,
    CHANGE_ME_OP = 0xA6,
    ONLINE_COUNTER_OP = 0xA7,
    PING_OP = 0xB0,
    PIXEL_UPDATE_OP = 0xC1,
    COOLDOWN_OP = 0xC2,
    PIXEL_RETURN_OP = 0xC3,
    CHUNK_UPDATE_MB_OP = 0xC4,
    PIXEL_UPDATE_MB_OP = 0xC5,
    CAPTCHA_RETURN_OP = 0xC6
}