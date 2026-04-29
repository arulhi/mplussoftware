/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.LoginRequest = (function() {

    /**
     * Properties of a LoginRequest.
     * @exports ILoginRequest
     * @interface ILoginRequest
     * @property {string|null} [username] LoginRequest username
     * @property {string|null} [password] LoginRequest password
     */

    /**
     * Constructs a new LoginRequest.
     * @exports LoginRequest
     * @classdesc Represents a LoginRequest.
     * @implements ILoginRequest
     * @constructor
     * @param {ILoginRequest=} [properties] Properties to set
     */
    function LoginRequest(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LoginRequest username.
     * @member {string} username
     * @memberof LoginRequest
     * @instance
     */
    LoginRequest.prototype.username = "";

    /**
     * LoginRequest password.
     * @member {string} password
     * @memberof LoginRequest
     * @instance
     */
    LoginRequest.prototype.password = "";

    /**
     * Creates a new LoginRequest instance using the specified properties.
     * @function create
     * @memberof LoginRequest
     * @static
     * @param {ILoginRequest=} [properties] Properties to set
     * @returns {LoginRequest} LoginRequest instance
     */
    LoginRequest.create = function create(properties) {
        return new LoginRequest(properties);
    };

    /**
     * Encodes the specified LoginRequest message. Does not implicitly {@link LoginRequest.verify|verify} messages.
     * @function encode
     * @memberof LoginRequest
     * @static
     * @param {ILoginRequest} message LoginRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LoginRequest.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.username != null && Object.hasOwnProperty.call(message, "username"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.username);
        if (message.password != null && Object.hasOwnProperty.call(message, "password"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.password);
        return writer;
    };

    /**
     * Encodes the specified LoginRequest message, length delimited. Does not implicitly {@link LoginRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LoginRequest
     * @static
     * @param {ILoginRequest} message LoginRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LoginRequest.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LoginRequest message from the specified reader or buffer.
     * @function decode
     * @memberof LoginRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LoginRequest} LoginRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LoginRequest.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LoginRequest();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.username = reader.string();
                    break;
                }
            case 2: {
                    message.password = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a LoginRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LoginRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LoginRequest} LoginRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LoginRequest.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LoginRequest message.
     * @function verify
     * @memberof LoginRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LoginRequest.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.username != null && message.hasOwnProperty("username"))
            if (!$util.isString(message.username))
                return "username: string expected";
        if (message.password != null && message.hasOwnProperty("password"))
            if (!$util.isString(message.password))
                return "password: string expected";
        return null;
    };

    /**
     * Creates a LoginRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LoginRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LoginRequest} LoginRequest
     */
    LoginRequest.fromObject = function fromObject(object) {
        if (object instanceof $root.LoginRequest)
            return object;
        var message = new $root.LoginRequest();
        if (object.username != null)
            message.username = String(object.username);
        if (object.password != null)
            message.password = String(object.password);
        return message;
    };

    /**
     * Creates a plain object from a LoginRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LoginRequest
     * @static
     * @param {LoginRequest} message LoginRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LoginRequest.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.username = "";
            object.password = "";
        }
        if (message.username != null && message.hasOwnProperty("username"))
            object.username = message.username;
        if (message.password != null && message.hasOwnProperty("password"))
            object.password = message.password;
        return object;
    };

    /**
     * Converts this LoginRequest to JSON.
     * @function toJSON
     * @memberof LoginRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LoginRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for LoginRequest
     * @function getTypeUrl
     * @memberof LoginRequest
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    LoginRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/LoginRequest";
    };

    return LoginRequest;
})();

$root.LoginResponse = (function() {

    /**
     * Properties of a LoginResponse.
     * @exports ILoginResponse
     * @interface ILoginResponse
     * @property {string|null} [accessToken] LoginResponse accessToken
     * @property {string|null} [refreshToken] LoginResponse refreshToken
     * @property {string|null} [tokenType] LoginResponse tokenType
     */

    /**
     * Constructs a new LoginResponse.
     * @exports LoginResponse
     * @classdesc Represents a LoginResponse.
     * @implements ILoginResponse
     * @constructor
     * @param {ILoginResponse=} [properties] Properties to set
     */
    function LoginResponse(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LoginResponse accessToken.
     * @member {string} accessToken
     * @memberof LoginResponse
     * @instance
     */
    LoginResponse.prototype.accessToken = "";

    /**
     * LoginResponse refreshToken.
     * @member {string} refreshToken
     * @memberof LoginResponse
     * @instance
     */
    LoginResponse.prototype.refreshToken = "";

    /**
     * LoginResponse tokenType.
     * @member {string} tokenType
     * @memberof LoginResponse
     * @instance
     */
    LoginResponse.prototype.tokenType = "";

    /**
     * Creates a new LoginResponse instance using the specified properties.
     * @function create
     * @memberof LoginResponse
     * @static
     * @param {ILoginResponse=} [properties] Properties to set
     * @returns {LoginResponse} LoginResponse instance
     */
    LoginResponse.create = function create(properties) {
        return new LoginResponse(properties);
    };

    /**
     * Encodes the specified LoginResponse message. Does not implicitly {@link LoginResponse.verify|verify} messages.
     * @function encode
     * @memberof LoginResponse
     * @static
     * @param {ILoginResponse} message LoginResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LoginResponse.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.accessToken != null && Object.hasOwnProperty.call(message, "accessToken"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.accessToken);
        if (message.refreshToken != null && Object.hasOwnProperty.call(message, "refreshToken"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.refreshToken);
        if (message.tokenType != null && Object.hasOwnProperty.call(message, "tokenType"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.tokenType);
        return writer;
    };

    /**
     * Encodes the specified LoginResponse message, length delimited. Does not implicitly {@link LoginResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LoginResponse
     * @static
     * @param {ILoginResponse} message LoginResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LoginResponse.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LoginResponse message from the specified reader or buffer.
     * @function decode
     * @memberof LoginResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LoginResponse} LoginResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LoginResponse.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LoginResponse();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.accessToken = reader.string();
                    break;
                }
            case 2: {
                    message.refreshToken = reader.string();
                    break;
                }
            case 3: {
                    message.tokenType = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a LoginResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LoginResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LoginResponse} LoginResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LoginResponse.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LoginResponse message.
     * @function verify
     * @memberof LoginResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LoginResponse.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.accessToken != null && message.hasOwnProperty("accessToken"))
            if (!$util.isString(message.accessToken))
                return "accessToken: string expected";
        if (message.refreshToken != null && message.hasOwnProperty("refreshToken"))
            if (!$util.isString(message.refreshToken))
                return "refreshToken: string expected";
        if (message.tokenType != null && message.hasOwnProperty("tokenType"))
            if (!$util.isString(message.tokenType))
                return "tokenType: string expected";
        return null;
    };

    /**
     * Creates a LoginResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LoginResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LoginResponse} LoginResponse
     */
    LoginResponse.fromObject = function fromObject(object) {
        if (object instanceof $root.LoginResponse)
            return object;
        var message = new $root.LoginResponse();
        if (object.accessToken != null)
            message.accessToken = String(object.accessToken);
        if (object.refreshToken != null)
            message.refreshToken = String(object.refreshToken);
        if (object.tokenType != null)
            message.tokenType = String(object.tokenType);
        return message;
    };

    /**
     * Creates a plain object from a LoginResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LoginResponse
     * @static
     * @param {LoginResponse} message LoginResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LoginResponse.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.accessToken = "";
            object.refreshToken = "";
            object.tokenType = "";
        }
        if (message.accessToken != null && message.hasOwnProperty("accessToken"))
            object.accessToken = message.accessToken;
        if (message.refreshToken != null && message.hasOwnProperty("refreshToken"))
            object.refreshToken = message.refreshToken;
        if (message.tokenType != null && message.hasOwnProperty("tokenType"))
            object.tokenType = message.tokenType;
        return object;
    };

    /**
     * Converts this LoginResponse to JSON.
     * @function toJSON
     * @memberof LoginResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LoginResponse.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for LoginResponse
     * @function getTypeUrl
     * @memberof LoginResponse
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    LoginResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/LoginResponse";
    };

    return LoginResponse;
})();

$root.AuthService = (function() {

    /**
     * Constructs a new AuthService service.
     * @exports AuthService
     * @classdesc Represents an AuthService
     * @extends $protobuf.rpc.Service
     * @constructor
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     */
    function AuthService(rpcImpl, requestDelimited, responseDelimited) {
        $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
    }

    (AuthService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = AuthService;

    /**
     * Creates new AuthService service using the specified rpc implementation.
     * @function create
     * @memberof AuthService
     * @static
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     * @returns {AuthService} RPC service. Useful where requests and/or responses are streamed.
     */
    AuthService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
        return new this(rpcImpl, requestDelimited, responseDelimited);
    };

    /**
     * Callback as used by {@link AuthService#login}.
     * @memberof AuthService
     * @typedef LoginCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {LoginResponse} [response] LoginResponse
     */

    /**
     * Calls Login.
     * @function login
     * @memberof AuthService
     * @instance
     * @param {ILoginRequest} request LoginRequest message or plain object
     * @param {AuthService.LoginCallback} callback Node-style callback called with the error, if any, and LoginResponse
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(AuthService.prototype.login = function login(request, callback) {
        return this.rpcCall(login, $root.LoginRequest, $root.LoginResponse, request, callback);
    }, "name", { value: "Login" });

    /**
     * Calls Login.
     * @function login
     * @memberof AuthService
     * @instance
     * @param {ILoginRequest} request LoginRequest message or plain object
     * @returns {Promise<LoginResponse>} Promise
     * @variation 2
     */

    return AuthService;
})();

module.exports = $root;
