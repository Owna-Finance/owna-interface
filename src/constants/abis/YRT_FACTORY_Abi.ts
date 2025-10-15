export const YRT_FACTORY_ABI = [
  // Constructor
  {
    inputs: [{ internalType: "address", name: "_defaultUnderlying", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },

  // Errors
  { inputs: [], name: "AccessControlBadConfirmation", type: "error" },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "bytes32", name: "neededRole", type: "bytes32" },
    ],
    name: "AccessControlUnauthorizedAccount",
    type: "error",
  },
  { inputs: [], name: "EnforcedPause", type: "error" },
  { inputs: [], name: "EnforcedPause", type: "error" },
  { inputs: [], name: "InvalidAddress", type: "error" },
  { inputs: [], name: "InvalidAmount", type: "error" },
  { inputs: [], name: "InvalidDuration", type: "error" },
  { inputs: [], name: "InvalidName", type: "error" },
  { inputs: [], name: "InvalidPrice", type: "error" },
  { inputs: [], name: "NotActive", type: "error" },
  { inputs: [], name: "NotAuthorized", type: "error" },
  { inputs: [], name: "NotSeriesAdmin", type: "error" },
  { inputs: [], name: "SnapshotAlreadyTaken", type: "error" },
  { inputs: [], name: "SnapshotNotTaken", type: "error" },
  { inputs: [], name: "ZeroAddress", type: "error" },

  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "seriesId", type: "uint256" },
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "seriesAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "propertyName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "initialSupply",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "underlyingToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "slug",
        type: "string",
      },
    ],
    name: "SeriesCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "seriesId", type: "uint256" },
      {
        indexed: true,
        internalType: "uint256",
        name: "periodId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maturityDate",
        type: "uint256",
      },
    ],
    name: "PeriodStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "seriesId", type: "uint256" },
      {
        indexed: true,
        internalType: "uint256",
        name: "periodId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "YieldDeposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "seriesId", type: "uint256" },
      {
        indexed: true,
        internalType: "uint256",
        name: "periodId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "YieldClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "seriesId", type: "uint256" },
      {
        indexed: true,
        internalType: "uint256",
        name: "periodId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "SnapshotTriggered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "seriesId", type: "uint256" },
    ],
    name: "SeriesDeactivated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "seriesId", type: "uint256" },
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "paymentAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "underlyingToken",
        type: "address",
      },
    ],
    name: "TokenPurchased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "seriesId", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "oldPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newPrice",
        type: "uint256",
      },
    ],
    name: "TokenPriceUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "seriesId", type: "uint256" },
      {
        indexed: false,
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    name: "DirectBuyStatusChanged",
    type: "event",
  },

  // View Functions - Getters
  {
    inputs: [],
    name: "ADMIN_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MANAGER_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DISTRIBUTOR_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "seriesCounter",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "defaultUnderlying",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllSeriesIds",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
    ],
    name: "seriesInfo",
    outputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "address", name: "underlyingToken", type: "address" },
      { internalType: "address", name: "seriesAdmin", type: "address" },
      { internalType: "string", name: "propertyName", type: "string" },
      { internalType: "uint96", name: "createdAt", type: "uint96" },
      { internalType: "uint96", name: "initialSupply", type: "uint96" },
      { internalType: "bool", name: "isActive", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
    ],
    name: "seriesSlug",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_slug", type: "string" },
    ],
    name: "slugToSeriesId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_tokenAddress", type: "address" },
    ],
    name: "tokenToSeriesId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
      { internalType: "uint256", name: "_periodId", type: "uint256" },
    ],
    name: "periodInfo",
    outputs: [
      { internalType: "uint96", name: "maturityDate", type: "uint96" },
      { internalType: "uint96", name: "startedAt", type: "uint96" },
      { internalType: "uint128", name: "totalYield", type: "uint128" },
      { internalType: "uint128", name: "yieldClaimed", type: "uint128" },
      { internalType: "bool", name: "isActive", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
    ],
    name: "tokenPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
    ],
    name: "directBuyEnabled",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
    ],
    name: "totalTokensSold",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
    ],
    name: "getSeriesAdmin",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_tokenAddress", type: "address" },
    ],
    name: "getSeriesIdByToken",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_slug", type: "string" },
    ],
    name: "getSeriesIdBySlug",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
    ],
    name: "getSeriesInfoWithSlug",
    outputs: [
      {
        components: [
          { internalType: "address", name: "tokenAddress", type: "address" },
          { internalType: "address", name: "underlyingToken", type: "address" },
          { internalType: "address", name: "seriesAdmin", type: "address" },
          { internalType: "string", name: "propertyName", type: "string" },
          { internalType: "uint96", name: "createdAt", type: "uint96" },
          { internalType: "uint96", name: "initialSupply", type: "uint96" },
          { internalType: "bool", name: "isActive", type: "bool" },
        ],
        internalType: "struct YRTFactory.SeriesInfo",
        name: "info",
        type: "tuple",
      },
      { internalType: "string", name: "slug", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
      { internalType: "uint256", name: "_periodId", type: "uint256" },
      { internalType: "address", name: "_user", type: "address" },
    ],
    name: "hasUserClaimedYieldForPeriod",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
    name: "getRoleAdmin",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "hasRole",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },

  // Write Functions - Admin
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_symbol", type: "string" },
      { internalType: "string", name: "_propertyName", type: "string" },
      { internalType: "uint256", name: "_initialSupply", type: "uint256" },
      { internalType: "address", name: "_underlyingToken", type: "address" },
      { internalType: "uint256", name: "_tokenPrice", type: "uint256" },
      { internalType: "uint256", name: "_fundraisingDuration", type: "uint256" },
    ],
    name: "createSeries",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
      { internalType: "uint256", name: "_durationInSeconds", type: "uint256" },
    ],
    name: "startNewPeriod",
    outputs: [{ internalType: "uint256", name: "periodId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "mintTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
      { internalType: "uint256", name: "_tokenAmount", type: "uint256" },
    ],
    name: "buyToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
      { internalType: "uint256", name: "_periodId", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "depositYield",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
      { internalType: "uint256", name: "_periodId", type: "uint256" },
    ],
    name: "triggerSnapshotForPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
      { internalType: "uint256", name: "_periodId", type: "uint256" },
      { internalType: "address[]", name: "_accounts", type: "address[]" },
    ],
    name: "batchRecordSnapshotForPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
      { internalType: "uint256", name: "_periodId", type: "uint256" },
      { internalType: "address", name: "_holder", type: "address" },
    ],
    name: "distributeYieldToHolder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
      { internalType: "uint256", name: "_newPrice", type: "uint256" },
    ],
    name: "setTokenPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
      { internalType: "bool", name: "_enabled", type: "bool" },
    ],
    name: "setDirectBuyEnabled",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
    ],
    name: "deactivateSeries",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_seriesId", type: "uint256" },
      { internalType: "address", name: "_newAdmin", type: "address" },
    ],
    name: "transferSeriesAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_newUnderlying", type: "address" },
    ],
    name: "setDefaultUnderlying",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "callerConfirmation", type: "address" },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];