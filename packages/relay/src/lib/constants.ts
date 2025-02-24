/* -
 *
 * Hedera JSON RPC Relay
 *
 * Copyright (C) 2022-2024 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { ConfigService } from '@hashgraph/json-rpc-config-service/dist/services';
import { BigNumber } from 'bignumber.js';

enum CACHE_KEY {
  ACCOUNT = 'account',
  ETH_BLOCK_NUMBER = 'eth_block_number',
  ETH_CALL = 'eth_call',
  ETH_GET_BALANCE = 'eth_get_balance',
  ETH_GET_BLOCK_BY_HASH = 'eth_getBlockByHash',
  ETH_GET_BLOCK_BY_NUMBER = 'eth_getBlockByNumber',
  ETH_GET_TRANSACTION_COUNT_BY_HASH = 'eth_getBlockTransactionCountByHash',
  ETH_GET_TRANSACTION_COUNT_BY_NUMBER = 'eth_getBlockTransactionCountByNumber',
  ETH_GET_TRANSACTION_COUNT = 'eth_getTransactionCount',
  ETH_GET_TRANSACTION_RECEIPT = 'eth_getTransactionReceipt',
  FEE_HISTORY = 'fee_history',
  FILTER = 'filter',
  GAS_PRICE = 'gas_price',
  NETWORK_FEES = 'network_fees',
  GET_BLOCK = 'getBlock',
  GET_CONTRACT = 'getContract',
  GET_CONTRACT_RESULT = 'getContractResult',
  GET_TINYBAR_GAS_FEE = 'getTinyBarGasFee',
  RESOLVE_ENTITY_TYPE = 'resolveEntityType',
  SYNTHETIC_LOG_TRANSACTION_HASH = 'syntheticLogTransactionHash',
  FILTERID = 'filterId',
  CURRENT_NETWORK_EXCHANGE_RATE = 'currentNetworkExchangeRate',
}

enum CACHE_TTL {
  HALF_HOUR = 1_800_000,
  ONE_HOUR = 3_600_000,
  ONE_DAY = 86_400_000,
}

enum ORDER {
  ASC = 'asc',
  DESC = 'desc',
}

export enum TracerType {
  // Call tracer tracks all the call frames executed during a transaction
  CallTracer = 'callTracer',
  // Opcode logger executes a transaction and emits the opcodes  and context at every step
  OpcodeLogger = 'opcodeLogger',
}

export enum CallType {
  CREATE = 'CREATE',
  CALL = 'CALL',
}

// HTS create function selectors taken from https://github.com/hashgraph/hedera-smart-contracts/tree/main/contracts/system-contracts/hedera-token-service
const CREATE_NON_FUNGIBLE_TOKEN_FUNCTION_SELECTOR_V1 = '0x9dc711e0';
const CREATE_NON_FUNGIBLE_TOKEN_FUNCTION_SELECTOR_V2 = '0x9c89bb35';
const CREATE_NON_FUNGIBLE_TOKEN_FUNCTION_SELECTOR_V3 = '0xea83f293';
const CREATE_NON_FUNGIBLE_WITH_CUSTOM_FEES_TOKEN_FUNCTION_SELECTOR_V1 = '0x5bc7c0e6';
const CREATE_NON_FUNGIBLE_WITH_CUSTOM_FEES_TOKEN_FUNCTION_SELECTOR_V2 = '0x45733969';
const CREATE_NON_FUNGIBLE_WITH_CUSTOM_FEES_TOKEN_FUNCTION_SELECTOR_V3 = '0xabb54eb5';
const CREATE_FUNGIBLE_TOKEN_FUNCTION_SELECTOR_V1 = '0x27d97be3';
const CREATE_FUNGIBLE_TOKEN_FUNCTION_SELECTOR_V2 = '0xc23baeb6';
const CREATE_FUNGIBLE_TOKEN_FUNCTION_SELECTOR_V3 = '0x0fb65bf3';
const CREATE_FUNGIBLE_TOKEN_WITH_CUSTOM_FEES_FUNCTION_SELECTOR_V1 = '0xef2d1098';
const CREATE_FUNGIBLE_TOKEN_WITH_CUSTOM_FEES_FUNCTION_SELECTOR_V2 = '0xb937581a';
const CREATE_FUNGIBLE_TOKEN_WITH_CUSTOM_FEES_FUNCTION_SELECTOR_V3 = '0x2af0c59a';

export default {
  HBAR_TO_TINYBAR_COEF: 100_000_000,
  TINYBAR_TO_WEIBAR_COEF: 10_000_000_000,
  TOTAL_SUPPLY_TINYBARS: 5_000_000_000_000_000_000,
  // 131072 bytes are 128kbytes
  SEND_RAW_TRANSACTION_SIZE_LIMIT: ConfigService.get('SEND_RAW_TRANSACTION_SIZE_LIMIT')
    ? // @ts-ignore
      parseInt(ConfigService.get('SEND_RAW_TRANSACTION_SIZE_LIMIT'))
    : 131072,

  CACHE_KEY,
  CACHE_TTL,
  CACHE_MAX: 1000,
  DEFAULT_TINY_BAR_GAS: 72, // (853454 / 1000) * (1 / 12)
  ETH_FUNCTIONALITY_CODE: 84,
  DEFAULT_ETH_GET_LOGS_BLOCK_RANGE_LIMIT: 1000,
  EXCHANGE_RATE_FILE_ID: '0.0.112',
  FEE_SCHEDULE_FILE_ID: '0.0.111',

  TYPE_CONTRACT: 'contract',
  TYPE_ACCOUNT: 'account',
  TYPE_TOKEN: 'token',

  DEFAULT_FEE_HISTORY_MAX_RESULTS: 10,
  ORDER,

  BLOCK_GAS_LIMIT: 30_000_000,
  MAX_GAS_PER_SEC: 15_000_000,
  CONTRACT_CALL_GAS_LIMIT: 50_000_000,
  ISTANBUL_TX_DATA_NON_ZERO_COST: 16,
  TX_BASE_COST: 21_000,
  MIN_TX_HOLLOW_ACCOUNT_CREATION_GAS: 587_000,
  TX_CONTRACT_CALL_AVERAGE_GAS: 500_000,
  TX_DEFAULT_GAS_DEFAULT: 400_000,
  TX_CREATE_EXTRA: 32_000,
  TX_DATA_ZERO_COST: 4,
  REQUEST_ID_STRING: `Request ID: `,
  BALANCES_UPDATE_INTERVAL: 900, // 15 minutes
  MAX_MIRROR_NODE_PAGINATION: 20,
  MIRROR_NODE_QUERY_LIMIT: 100,
  NEXT_LINK_PREFIX: '/api/v1/',
  QUERY_COST_INCREMENTATION_STEP: 1.1,

  ETH_CALL_CACHE_TTL_DEFAULT: 200,
  ETH_BLOCK_NUMBER_CACHE_TTL_MS_DEFAULT: 1000,
  ETH_GET_BALANCE_CACHE_TTL_MS_DEFAULT: 1000,
  ETH_GET_TRANSACTION_COUNT_CACHE_TTL: 500,
  ETH_GET_BLOCK_BY_RESULTS_BATCH_SIZE: 25,
  DEFAULT_SYNTHETIC_LOG_CACHE_TTL: `${CACHE_TTL.ONE_DAY}`,
  ETH_GET_GAS_PRICE_CACHE_TTL_MS_DEFAULT: `${CACHE_TTL.HALF_HOUR}`,

  TRANSACTION_ID_REGEX: /\d{1}\.\d{1}\.\d{1,10}\@\d{1,10}\.\d{1,9}/,

  LONG_ZERO_PREFIX: '0x000000000000',
  CHAIN_IDS: {
    mainnet: 0x127,
    testnet: 0x128,
    previewnet: 0x129,
  },

  // block ranges
  MAX_BLOCK_RANGE: 5,
  ETH_GET_TRANSACTION_COUNT_MAX_BLOCK_RANGE: 1000,
  BLOCK_HASH_REGEX: '^0[xX][a-fA-F0-9]',

  DEFAULT_RATE_LIMIT: {
    TIER_1: 100,
    TIER_2: 800,
    TIER_3: 1600,
    DURATION: 60000,
  },

  // @ts-ignore
  HBAR_RATE_LIMIT_DURATION: parseInt(ConfigService.get('HBAR_RATE_LIMIT_DURATION') || '86400000'), // 1 day
  // @ts-ignore
  // The logical OR operator || returns the first truthy value and 0 is falsy.
  // The nullish coalescing operator ?? falls back to the default value when the left-hand operand is null or undefined, not when it's 0 or any other falsy value.
  HBAR_RATE_LIMIT_TOTAL: BigNumber(ConfigService.get('HBAR_RATE_LIMIT_TINYBAR') ?? '800000000000'), // 8000 HBARs
  // @ts-ignore
  HBAR_RATE_LIMIT_BASIC: BigNumber(ConfigService.get('HBAR_RATE_LIMIT_BASIC') || '1120000000'), // 11.2 HBARs
  // @ts-ignore
  HBAR_RATE_LIMIT_EXTENDED: BigNumber(ConfigService.get('HBAR_RATE_LIMIT_EXTENDED') || '3200000000'), // 32 HBARs
  // @ts-ignore
  HBAR_RATE_LIMIT_PRIVILEGED: BigNumber(ConfigService.get('HBAR_RATE_LIMIT_PRIVILEGED') || '8000000000'), // 80 HBARs
  // @ts-ignore
  GAS_PRICE_TINY_BAR_BUFFER: parseInt(ConfigService.get('GAS_PRICE_TINY_BAR_BUFFER') || '10000000000'),
  WEB_SOCKET_PORT: ConfigService.get('WEB_SOCKET_PORT') || 8546,
  WEB_SOCKET_HTTP_PORT: ConfigService.get('WEB_SOCKET_HTTP_PORT') || 8547,

  RELAY_PORT: ConfigService.get('SERVER_PORT') || 7546,
  RELAY_HOST: ConfigService.get('SERVER_HOST') || 'localhost',

  FUNCTION_SELECTOR_CHAR_LENGTH: 10,
  MIRROR_NODE_RETRY_DELAY_DEFAULT: 2000,
  MIRROR_NODE_REQUEST_RETRY_COUNT_DEFAULT: 10,
  BASE_HEX_REGEX: '^0[xX][a-fA-F0-9]',

  TRANSACTION_RESULT_STATUS: {
    WRONG_NONCE: 'WRONG_NONCE',
  },

  PRECHECK_STATUS_ERROR_STATUS_CODES: {
    INVALID_CONTRACT_ID: 16,
    CONTRACT_DELETED: 66,
  },

  FILTER: {
    TYPE: {
      NEW_BLOCK: 'newBlock',
      LOG: 'log',
      PENDING_TRANSACTION: 'pendingTransaction',
    },
    // @ts-ignore
    TTL: parseInt(ConfigService.get('FILTER_TTL') || '300000'), // default is 5 minutes
  },

  METHODS: {
    ETH_SUBSCRIBE: 'eth_subscribe',
    ETH_UNSUBSCRIBE: 'eth_unsubscribe',
    ETH_CHAIN_ID: 'eth_chainId',
    ETH_SEND_RAW_TRANSACTION: 'eth_sendRawTransaction',
  },

  SUBSCRIBE_EVENTS: {
    LOGS: 'logs',
    NEW_HEADS: 'newHeads',
    NEW_PENDING_TRANSACTIONS: 'newPendingTransactions',
  },

  SUCCESS: 'SUCCESS',

  // @source: Related constants below can be found at https://github.com/Arachnid/deterministic-deployment-proxy?tab=readme-ov-file#latest-outputs
  DETERMINISTIC_DEPLOYER_TRANSACTION:
    '0xf8a58085174876e800830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf31ba02222222222222222222222222222222222222222222222222222222222222222a02222222222222222222222222222222222222222222222222222222222222222',
  DETERMINISTIC_DEPLOYMENT_SIGNER: '0x3fab184622dc19b6109349b94811493bf2a45362',
  DETERMINISTIC_PROXY_CONTRACT: '0x4e59b44847b379578588920ca78fbf26c0b4956c',

  // computed hash of an empty Trie object
  DEFAULT_ROOT_HASH: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',

  MASKED_IP_ADDRESS: 'xxx.xxx.xxx.xxx',
  HTS_CREATE_FUNCTIONS_SELECTORS: [
    CREATE_FUNGIBLE_TOKEN_FUNCTION_SELECTOR_V1,
    CREATE_FUNGIBLE_TOKEN_FUNCTION_SELECTOR_V2,
    CREATE_FUNGIBLE_TOKEN_FUNCTION_SELECTOR_V3,
    CREATE_FUNGIBLE_TOKEN_WITH_CUSTOM_FEES_FUNCTION_SELECTOR_V1,
    CREATE_FUNGIBLE_TOKEN_WITH_CUSTOM_FEES_FUNCTION_SELECTOR_V2,
    CREATE_FUNGIBLE_TOKEN_WITH_CUSTOM_FEES_FUNCTION_SELECTOR_V3,
    CREATE_NON_FUNGIBLE_TOKEN_FUNCTION_SELECTOR_V1,
    CREATE_NON_FUNGIBLE_TOKEN_FUNCTION_SELECTOR_V2,
    CREATE_NON_FUNGIBLE_TOKEN_FUNCTION_SELECTOR_V3,
    CREATE_NON_FUNGIBLE_WITH_CUSTOM_FEES_TOKEN_FUNCTION_SELECTOR_V1,
    CREATE_NON_FUNGIBLE_WITH_CUSTOM_FEES_TOKEN_FUNCTION_SELECTOR_V2,
    CREATE_NON_FUNGIBLE_WITH_CUSTOM_FEES_TOKEN_FUNCTION_SELECTOR_V3,
  ],

  // The fee is calculated via the fee calculator: https://docs.hedera.com/hedera/networks/mainnet/fees
  // The maximum fileAppendChunkSize is currently set to 5KB by default; therefore, the estimated fees for FileCreate below are based on a file size of 5KB.
  // FILE_APPEND_BASE_FEE & FILE_APPEND_RATE_PER_BYTE are calculated based on data colelction from the fee calculator:
  // - 0 bytes = 3.9 cents
  // - 100 bytes = 4.01 cents = 3.9 + (100 * 0.0011)
  // - 500 bytes = 4.45 cents = 3.9 + (500 * 0.0011)
  // - 1000 bytes = 5.01 cents = 3.9 + (1000 * 0.0011)
  // - 5120 bytes = 9.53 cents = 3.9 + (5120 * 0.0011)
  // final equation: cost_in_cents = base_cost + (bytes × rate_per_byte)
  NETWORK_FEES_IN_CENTS: {
    TRANSACTION_GET_RECORD: 0.01,
    FILE_CREATE_PER_5_KB: 9.51,
    FILE_APPEND_PER_5_KB: 9.55,
    FILE_APPEND_BASE_FEE: 3.9,
    FILE_APPEND_RATE_PER_BYTE: 0.0011,
  },

  EVENTS: {
    EXECUTE_TRANSACTION: 'execute_transaction',
    EXECUTE_QUERY: 'execute_query',
  },

  EXECUTION_MODE: {
    QUERY: `QUERY`,
    RECORD: `RECORD`,
    TRANSACTION: `TRANSACTION`,
  },
};
