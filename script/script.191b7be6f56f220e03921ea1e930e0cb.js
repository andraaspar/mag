/// <reference path='IEventCallback.ts'/>
var illa;
(function (illa) {
    var EventCallbackReg = (function () {
        function EventCallbackReg(callback, thisObj) {
            this.callback = callback;
            this.thisObj = thisObj;
        }
        return EventCallbackReg;
    })();
    illa.EventCallbackReg = EventCallbackReg;
})(illa || (illa = {}));
/// <reference path='IEventCallback.ts'/>
/// <reference path='EventCallbackReg.ts'/>
/// <reference path='IEventHandler.ts'/>
var illa;
(function (illa) {
    var Event = (function () {
        function Event(type, target) {
            this.type = type;
            this.target = target;
            this.isPropagationStopped = false;
            this.isImmediatePropagationStopped = false;
        }
        Event.prototype.dispatch = function () {
            this.processHandler(this.target);
        };
        Event.prototype.processHandler = function (handler) {
            this.currentTarget = handler;
            var callbackRegs = handler.getCallbackRegsByType(this.type).slice(0);
            for (var i = 0, n = callbackRegs.length; i < n; i++) {
                var callbackReg = callbackRegs[i];
                callbackReg.callback.call(callbackReg.thisObj, this);
                if (this.isImmediatePropagationStopped)
                    break;
            }
            if (!this.isPropagationStopped) {
                var parentHandler = handler.getEventParent();
                if (parentHandler)
                    this.processHandler(parentHandler);
            }
        };
        Event.prototype.getType = function () {
            return this.type;
        };
        Event.prototype.getTarget = function () {
            return this.target;
        };
        Event.prototype.getCurrentTarget = function () {
            return this.currentTarget;
        };
        Event.prototype.setIsPropagationStopped = function (flag) {
            this.isPropagationStopped = flag;
        };
        Event.prototype.getIsPropagationStopped = function () {
            return this.isPropagationStopped;
        };
        Event.prototype.setStopImmediatePropagation = function (flag) {
            this.isImmediatePropagationStopped = flag;
        };
        Event.prototype.getIsImmediatePropagationStopped = function () {
            return this.isImmediatePropagationStopped;
        };
        return Event;
    })();
    illa.Event = Event;
})(illa || (illa = {}));
/// <reference path='IEventHandler.ts'/>
var illa;
(function (illa) {
    var EventHandler = (function () {
        function EventHandler() {
            this.callbacksByType = {};
        }
        EventHandler.prototype.getCallbackRegsByType = function (type) {
            var result = this.callbacksByType[type];
            if (!illa.isArray(result))
                result = [];
            return result;
        };
        EventHandler.prototype.getEventParent = function () {
            return null;
        };
        EventHandler.prototype.addEventCallback = function (type, cb, thisObj) {
            var reg = new illa.EventCallbackReg(cb, thisObj);
            if (illa.isArray(this.callbacksByType[type])) {
                this.removeEventCallback(type, cb, thisObj);
                this.callbacksByType[type].push(reg);
            }
            else {
                this.callbacksByType[type] = [reg];
            }
        };
        EventHandler.prototype.removeEventCallback = function (type, cb, thisObj) {
            var callbacks = this.callbacksByType[type];
            if (illa.isArray(callbacks)) {
                for (var i = 0, n = callbacks.length; i < n; i++) {
                    var callback = callbacks[i];
                    if (callback.callback === cb && callback.thisObj === thisObj) {
                        callbacks.splice(i, 1);
                        break;
                    }
                }
            }
        };
        EventHandler.prototype.removeAllEventCallbacks = function () {
            this.callbacksByType = {};
        };
        return EventHandler;
    })();
    illa.EventHandler = EventHandler;
})(illa || (illa = {}));
var illa;
(function (illa) {
    /**
     * A reference to the global object.
     * This is the window in a browser, and the global in node.
     */
    illa.GLOBAL = (function () {
        return this;
    })();
    illa.classByType = (function () {
        var classes = 'Boolean Number String Function Array Date RegExp Object Error'.split(' ');
        var result = {};
        for (var i = 0, n = classes.length; i < n; i++) {
            result['[object ' + classes[i] + ']'] = classes[i].toLowerCase();
        }
        return result;
    })();
    /**
     * Returns true if the value is a string primitive.
     */
    function isString(v) {
        return typeof v == 'string';
    }
    illa.isString = isString;
    /**
     * Returns true if the value is a boolean primitive.
     */
    function isBoolean(v) {
        return typeof v == 'boolean';
    }
    illa.isBoolean = isBoolean;
    /**
     * Returns true if the value is a number primitive.
     */
    function isNumber(v) {
        return typeof v == 'number';
    }
    illa.isNumber = isNumber;
    /**
     * Returns true if the value is a function.
     */
    function isFunction(v) {
        return typeof v == 'function';
    }
    illa.isFunction = isFunction;
    /**
     * Returns true if the value is an array.
     * Array subclasses are not recognized as arrays.
     */
    function isArray(v) {
        return illa.getType(v) == 'array';
    }
    illa.isArray = isArray;
    if (Array.isArray)
        illa.isArray = Array.isArray;
    /**
     * Returns true if the value is undefined.
     */
    function isUndefined(v) {
        return typeof v == 'undefined';
    }
    illa.isUndefined = isUndefined;
    /**
     * Returns true if the value is null.
     */
    function isNull(v) {
        return v === null;
    }
    illa.isNull = isNull;
    /**
     * Returns true if the value is undefined or null.
     */
    function isUndefinedOrNull(v) {
        return typeof v == 'undefined' || v === null;
    }
    illa.isUndefinedOrNull = isUndefinedOrNull;
    /**
     * Returns true if the value is an object and not null. Includes functions.
     */
    function isObjectNotNull(v) {
        var t = typeof v;
        return t == 'object' && v !== null || t == 'function';
    }
    illa.isObjectNotNull = isObjectNotNull;
    /**
     * Returns the type of value.
     */
    function getType(v) {
        var result = '';
        if (v == null) {
            result = v + '';
        }
        else {
            result = typeof v;
            if (result == 'object' || result == 'function') {
                result = illa.classByType[illa.classByType.toString.call(v)] || 'object';
            }
        }
        return result;
    }
    illa.getType = getType;
    /**
     * Returns the value if ‘instanceof’ is true for the given constructor.
     */
    function as(c, v) {
        return v instanceof c ? v : null;
    }
    illa.as = as;
    /**
     * Binds a function to a ‘this’ context.
     * No argument binding allows us to keep function type safety.
     */
    function bind(fn, obj) {
        if (!fn)
            throw 'No function.';
        return function () {
            return fn.apply(obj, arguments);
        };
    }
    illa.bind = bind;
    /**
     * Binds a function to a ‘this’ context, and also prepends the specified arguments
     * This is not type safe because of argument binding.
     */
    function partial(fn, obj) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (!fn)
            throw 'No function.';
        return function () {
            return fn.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
        };
    }
    illa.partial = partial;
    if (Function.prototype.bind) {
        illa.bind = illa.partial = function (fn, obj) {
            return fn.call.apply(fn.bind, arguments);
        };
    }
})(illa || (illa = {}));
/// <reference path='_module.ts'/>
var illa;
(function (illa) {
    var ObjectUtil = (function () {
        function ObjectUtil() {
        }
        ObjectUtil.getKeys = function (obj) {
            var result = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    result.push(key);
                }
            }
            return result;
        };
        ObjectUtil.getKeyOfValue = function (obj, value) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key) && obj[key] === value) {
                    return key;
                }
            }
            return '';
        };
        ObjectUtil.getKeysOfValue = function (obj, value) {
            var result = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key) && obj[key] === value) {
                    result.push(key);
                }
            }
            return result;
        };
        return ObjectUtil;
    })();
    illa.ObjectUtil = ObjectUtil;
})(illa || (illa = {}));
var adat;
(function (adat) {
    var IndexDescriptor = (function () {
        function IndexDescriptor(keyPath, isUnique, isMultiEntry) {
            if (isUnique === void 0) { isUnique = false; }
            if (isMultiEntry === void 0) { isMultiEntry = false; }
            this.keyPath = keyPath;
            this.isUnique = isUnique;
            this.isMultiEntry = isMultiEntry;
        }
        IndexDescriptor.prototype.applyTo = function (objectStore, name, prev) {
            if (!this.getEquals(prev)) {
                if (prev) {
                    this.removeFrom(objectStore, name);
                }
                objectStore.createIndex(name, this.getKeyPath(), { unique: this.getIsUnique(), multiEntry: this.getIsMultiEntry() });
            }
        };
        IndexDescriptor.prototype.removeFrom = function (objectStore, name) {
            objectStore.deleteIndex(name);
        };
        IndexDescriptor.prototype.getEquals = function (other) {
            var result = false;
            if (other instanceof IndexDescriptor && this.getKeyPath() === other.getKeyPath() && this.getIsUnique() === other.getIsUnique() && this.getIsMultiEntry() === other.getIsMultiEntry()) {
                result = true;
            }
            return result;
        };
        IndexDescriptor.prototype.getKeyPath = function () {
            return this.keyPath;
        };
        IndexDescriptor.prototype.getIsUnique = function () {
            return this.isUnique;
        };
        IndexDescriptor.prototype.getIsMultiEntry = function () {
            return this.isMultiEntry;
        };
        return IndexDescriptor;
    })();
    adat.IndexDescriptor = IndexDescriptor;
})(adat || (adat = {}));
/// <reference path='../../lib/illa/ObjectUtil.ts'/>
/// <reference path='IndexDescriptor.ts'/>
var adat;
(function (adat) {
    var ObjectStoreDescriptor = (function () {
        function ObjectStoreDescriptor(keyPath, autoIncrement, indexDescriptors) {
            if (keyPath === void 0) { keyPath = ''; }
            if (autoIncrement === void 0) { autoIncrement = false; }
            if (indexDescriptors === void 0) { indexDescriptors = {}; }
            this.keyPath = keyPath;
            this.autoIncrement = autoIncrement;
            this.indexDescriptors = indexDescriptors;
        }
        ObjectStoreDescriptor.prototype.applyTo = function (transaction, database, name, prev) {
            if (prev && !this.getPropertiesEqual(prev)) {
                var objectStore = transaction.objectStore(name);
                this.applyIndexDescriptors(objectStore, prev);
            }
            else {
                if (prev) {
                    prev.removeFrom(database, name);
                }
                var objectStore = database.createObjectStore(name, { keyPath: this.getKeyPath(), autoIncrement: this.getAutoIncrement() });
                this.applyIndexDescriptors(objectStore, null);
            }
        };
        ObjectStoreDescriptor.prototype.removeFrom = function (database, name) {
            database.deleteObjectStore(name);
        };
        ObjectStoreDescriptor.prototype.getPropertiesEqual = function (other) {
            var result = false;
            if (other instanceof ObjectStoreDescriptor && this.getKeyPath() == other.getKeyPath() && this.getAutoIncrement() == other.getAutoIncrement()) {
                result = true;
            }
            return result;
        };
        ObjectStoreDescriptor.prototype.applyIndexDescriptors = function (objectStore, prev) {
            for (var key in this.indexDescriptors) {
                if (this.indexDescriptors.hasOwnProperty(key)) {
                    var newIndexD = this.indexDescriptors[key];
                    var prevIndexD = null;
                    if (prev && prev.indexDescriptors.hasOwnProperty(key)) {
                        prevIndexD = prev.indexDescriptors[key];
                    }
                    newIndexD.applyTo(objectStore, key, prevIndexD);
                }
            }
            if (prev) {
                for (var key in prev.indexDescriptors) {
                    if (prev.indexDescriptors.hasOwnProperty(key)) {
                        var prevIndexD = prev.indexDescriptors[key];
                        if (!this.indexDescriptors.hasOwnProperty(key)) {
                            prevIndexD.removeFrom(objectStore, key);
                        }
                    }
                }
            }
        };
        ObjectStoreDescriptor.prototype.getKeyPath = function () {
            return this.keyPath;
        };
        ObjectStoreDescriptor.prototype.getAutoIncrement = function () {
            return this.autoIncrement;
        };
        ObjectStoreDescriptor.prototype.getIndexDescriptors = function () {
            return this.indexDescriptors;
        };
        return ObjectStoreDescriptor;
    })();
    adat.ObjectStoreDescriptor = ObjectStoreDescriptor;
})(adat || (adat = {}));
/// <reference path='ObjectStoreDescriptor.ts'/>
var adat;
(function (adat) {
    var VersionDescriptor = (function () {
        function VersionDescriptor(objectStoreDescriptors) {
            this.objectStoreDescriptors = objectStoreDescriptors;
        }
        VersionDescriptor.prototype.applyTo = function (transaction, database, prev) {
            for (var key in this.objectStoreDescriptors) {
                if (this.objectStoreDescriptors.hasOwnProperty(key)) {
                    var osd = this.objectStoreDescriptors[key];
                    var prevOSD = prev ? prev.getObjectStoreDescriptors()[key] || null : null;
                    osd.applyTo(transaction, database, key, prevOSD);
                }
            }
            if (prev) {
                for (var key in prev.objectStoreDescriptors) {
                    if (prev.objectStoreDescriptors.hasOwnProperty(key) && !this.objectStoreDescriptors.hasOwnProperty(key)) {
                        var osd = this.objectStoreDescriptors[key];
                        osd.removeFrom(database, key);
                    }
                }
            }
        };
        VersionDescriptor.prototype.getObjectStoreDescriptors = function () {
            return this.objectStoreDescriptors;
        };
        return VersionDescriptor;
    })();
    adat.VersionDescriptor = VersionDescriptor;
})(adat || (adat = {}));
/// <reference path='../../lib/illa/Event.ts'/>
/// <reference path='../../lib/illa/EventHandler.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='VersionDescriptor.ts'/>
var adat;
(function (adat) {
    var Database = (function (_super) {
        __extends(Database, _super);
        function Database(name, versionDescriptors) {
            _super.call(this);
            this.name = name;
            this.versionDescriptors = versionDescriptors;
            this.isOpen = false;
        }
        Database.prototype.open = function () {
            if (!Database.isSupported()) {
                illa.Log.warn(this.name, 'IndexedDB not supported.');
                new illa.Event(Database.EVENT_NOT_SUPPORTED, this).dispatch();
                return;
            }
            this.openRequest = indexedDB.open(this.getName(), this.getVersion());
            this.openRequest.onblocked = illa.bind(this.onBlocked, this);
            this.openRequest.onerror = illa.bind(this.onOpenError, this);
            this.openRequest.onupgradeneeded = illa.bind(this.onUpgradeNeeded, this);
            this.openRequest.onsuccess = illa.bind(this.onOpenSuccess, this);
        };
        Database.prototype.initDatabase = function () {
            if (!this.database) {
                this.database = this.openRequest.result;
                this.database.onerror = illa.bind(this.onDatabaseError, this);
                this.database.onabort = illa.bind(this.onDatabaseAbort, this);
            }
        };
        Database.prototype.onBlocked = function (e) {
            illa.Log.warn(this.name, 'Database upgrade blocked, waiting for other instances...');
            new illa.Event(Database.EVENT_BLOCKED, this).dispatch();
        };
        Database.prototype.onOpenError = function (e) {
            illa.Log.error(this.name, 'Could not open database.');
            new illa.Event(Database.EVENT_OPEN_ERROR, this).dispatch();
        };
        Database.prototype.onUpgradeNeeded = function (e) {
            illa.Log.info(this.name, 'Upgrading database...');
            if (e.newVersion > this.getVersion()) {
                throw this.name + ' Invalid database version: ' + e.newVersion;
            }
            var transaction = this.openRequest.transaction;
            transaction.onabort = illa.bind(this.onUpgradeTransactionAbort, this);
            transaction.onerror = illa.bind(this.onUpgradeTransactionError, this);
            this.initDatabase();
            for (var version = 1, n = this.versionDescriptors.length; version <= n; version++) {
                var newVersion = this.getVersionDescriptor(version);
                if (e.oldVersion < version) {
                    var prevVersion = version > 1 ? this.getVersionDescriptor(version - 1) : null;
                    newVersion.applyTo(transaction, this.database, prevVersion);
                }
            }
        };
        Database.prototype.onOpenSuccess = function (e) {
            illa.Log.info(this.name, 'Database opened successfully.');
            this.isOpen = true;
            this.initDatabase();
            new illa.Event(Database.EVENT_OPEN_SUCCESS, this).dispatch();
        };
        Database.prototype.onUpgradeTransactionAbort = function (e) {
            illa.Log.warn(this.name, 'Aborted upgrade transaction.');
        };
        Database.prototype.onUpgradeTransactionError = function (e) {
            illa.Log.error(this.name, 'Upgrade transaction error:', e.message);
        };
        Database.prototype.onDatabaseError = function (e) {
            illa.Log.error(this.name, 'Database error:', e.message);
            new illa.Event(Database.EVENT_ERROR, this).dispatch();
        };
        Database.prototype.onDatabaseAbort = function (e) {
            illa.Log.warn(this.name, 'Aborted on database.');
            new illa.Event(Database.EVENT_ABORT, this).dispatch();
        };
        Database.isSupported = function () {
            return !!illa.GLOBAL.indexedDB;
        };
        Database.deleteDatabase = function (name) {
            if (this.isSupported()) {
                indexedDB.deleteDatabase(name);
            }
        };
        /**
         * Helper for TypeScript 1.0.1, which has incorrect definition of IDBKeyRange.
         */
        Database.getIDBKeyRange = function () {
            return illa.GLOBAL.IDBKeyRange;
        };
        Database.prototype.getName = function () {
            return this.name;
        };
        Database.prototype.getVersionDescriptors = function () {
            return this.versionDescriptors;
        };
        Database.prototype.getVersionDescriptor = function (version) {
            return this.versionDescriptors[version - 1];
        };
        Database.prototype.getCurrentVersionDescriptor = function () {
            return this.getVersionDescriptor(this.getVersion());
        };
        Database.prototype.getVersion = function () {
            return this.getVersionDescriptors().length;
        };
        Database.prototype.getIDBDatabase = function () {
            return this.database;
        };
        Database.prototype.getIsOpen = function () {
            return this.isOpen;
        };
        Database.EVENT_BLOCKED = 'adat_Database_EVENT_BLOCKED';
        Database.EVENT_NOT_SUPPORTED = 'adat_Database_EVENT_NOT_SUPPORTED';
        Database.EVENT_OPEN_ERROR = 'adat_Database_EVENT_OPEN_ERROR';
        Database.EVENT_OPEN_SUCCESS = 'adat_Database_EVENT_OPEN_SUCCESS';
        Database.EVENT_ERROR = 'adat_Database_EVENT_ERROR';
        Database.EVENT_ABORT = 'adat_Database_EVENT_ABORT';
        return Database;
    })(illa.EventHandler);
    adat.Database = Database;
})(adat || (adat = {}));
var illa;
(function (illa) {
    var ArrayUtil = (function () {
        function ArrayUtil() {
        }
        ArrayUtil.indexOf = function (a, v, fromIndex) {
            if (Array.prototype.indexOf) {
                return Array.prototype.indexOf.call(a, v, fromIndex);
            }
            else {
                var length = a.length;
                if (fromIndex == null) {
                    fromIndex = 0;
                }
                else if (fromIndex < 0) {
                    fromIndex = Math.max(0, length + fromIndex);
                }
                for (var i = fromIndex; i < length; i++) {
                    if (a[i] === v) {
                        return i;
                    }
                }
            }
            return -1;
        };
        ArrayUtil.removeFirst = function (a, v) {
            var i = this.indexOf(a, v);
            var removed = i >= 0;
            if (removed) {
                a.splice(i, 1)[0];
            }
            return removed;
        };
        ArrayUtil.removeAll = function (a, v) {
            var removed = false;
            for (var i = a.length - 1; i >= 0; i--) {
                if (a[i] === v) {
                    a.splice(i, 1);
                    removed = true;
                }
            }
            return removed;
        };
        return ArrayUtil;
    })();
    illa.ArrayUtil = ArrayUtil;
})(illa || (illa = {}));
var adat;
(function (adat) {
    (function (TransactionMode) {
        TransactionMode[TransactionMode["READONLY"] = 0] = "READONLY";
        TransactionMode[TransactionMode["READWRITE"] = 1] = "READWRITE";
    })(adat.TransactionMode || (adat.TransactionMode = {}));
    var TransactionMode = adat.TransactionMode;
})(adat || (adat = {}));
/// <reference path='../../lib/illa/ArrayUtil.ts'/>
/// <reference path='../../lib/illa/EventHandler.ts'/>
/// <reference path='TransactionMode.ts'/>
var adat;
(function (adat) {
    var Request = (function (_super) {
        __extends(Request, _super);
        function Request(objectStoreDescriptor) {
            _super.call(this);
            this.objectStoreDescriptor = objectStoreDescriptor;
            this.name = '';
        }
        Request.prototype.processInternal = function (objectStore) {
            throw 'Unimplemented.';
        };
        Request.prototype.getTypeName = function () {
            throw 'Unimplemented.';
        };
        Request.prototype.getMode = function () {
            throw 'Unimplemented.';
        };
        Request.prototype.process = function (objectStore) {
            this.requests = this.processInternal(objectStore);
            for (var i = 0, n = this.requests.length; i < n; i++) {
                var request = this.requests[i];
                request.onerror = illa.bind(this.onError, this);
                request.onsuccess = illa.bind(this.onSuccess, this);
            }
        };
        Request.prototype.onError = function (e) {
            illa.Log.error(this.name, this.getTypeName(), this.getIDBRequestID(e.target), e.message);
        };
        Request.prototype.onSuccess = function (e) {
            illa.Log.infoIf(this.name, this.getTypeName(), this.getIDBRequestID(e.target), 'Successful.');
        };
        Request.prototype.getIDBRequestID = function (request) {
            return illa.ArrayUtil.indexOf(this.requests, request);
        };
        Request.prototype.getObjectStoreDescriptor = function () {
            return this.objectStoreDescriptor;
        };
        Request.prototype.setName = function (value) {
            this.name = value;
            return this;
        };
        Request.prototype.getName = function () {
            return this.name;
        };
        Request.prototype.getRequests = function () {
            return this.requests;
        };
        Request.prototype.getRequest = function (id) {
            return this.requests[id];
        };
        Request.EVENT_SUCCESS = 'adat_Request_EVENT_SUCCESS';
        return Request;
    })(illa.EventHandler);
    adat.Request = Request;
})(adat || (adat = {}));
/// <reference path='Request.ts'/>
var adat;
(function (adat) {
    var RequestAdd = (function (_super) {
        __extends(RequestAdd, _super);
        function RequestAdd(objectStoreDescriptor, value, key) {
            _super.call(this, objectStoreDescriptor);
            this.value = value;
            this.key = key;
        }
        RequestAdd.prototype.processInternal = function (objectStore) {
            return [objectStore.add(this.value, this.key)];
        };
        RequestAdd.prototype.getTypeName = function () {
            return 'Add';
        };
        RequestAdd.prototype.getMode = function () {
            return 1 /* READWRITE */;
        };
        return RequestAdd;
    })(adat.Request);
    adat.RequestAdd = RequestAdd;
})(adat || (adat = {}));
var adat;
(function (adat) {
    (function (CursorDirection) {
        CursorDirection[CursorDirection["NEXT"] = 0] = "NEXT";
        CursorDirection[CursorDirection["PREV"] = 1] = "PREV";
        CursorDirection[CursorDirection["NEXTUNIQUE"] = 2] = "NEXTUNIQUE";
        CursorDirection[CursorDirection["PREVUNIQUE"] = 3] = "PREVUNIQUE";
    })(adat.CursorDirection || (adat.CursorDirection = {}));
    var CursorDirection = adat.CursorDirection;
})(adat || (adat = {}));
/// <reference path='../../lib/illa/ObjectUtil.ts'/>
/// <reference path='Request.ts'/>
var adat;
(function (adat) {
    var RequestIndex = (function (_super) {
        __extends(RequestIndex, _super);
        function RequestIndex(objectStoreDescriptor, indexDescriptor) {
            _super.call(this, objectStoreDescriptor);
            this.indexDescriptor = indexDescriptor;
        }
        RequestIndex.prototype.getIndexFromObjectStore = function (objectStore) {
            var indexName = illa.ObjectUtil.getKeyOfValue(this.getObjectStoreDescriptor().getIndexDescriptors(), this.indexDescriptor);
            return objectStore.index(indexName);
        };
        return RequestIndex;
    })(adat.Request);
    adat.RequestIndex = RequestIndex;
})(adat || (adat = {}));
/// <reference path='../../lib/illa/_module.ts'/>
/// <reference path='CursorDirection.ts'/>
/// <reference path='RequestIndex.ts'/>
var adat;
(function (adat) {
    var RequestIndexCursor = (function (_super) {
        __extends(RequestIndexCursor, _super);
        function RequestIndexCursor(objectStoreDescriptor, indexDescriptor, onResult, range, direction) {
            if (direction === void 0) { direction = 0 /* NEXT */; }
            _super.call(this, objectStoreDescriptor, indexDescriptor);
            this.onResult = onResult;
            this.range = range;
            this.direction = direction;
            this.result = [];
        }
        RequestIndexCursor.prototype.processInternal = function (objectStore) {
            return [this.getIndexFromObjectStore(objectStore).openCursor(this.range, adat.CursorDirection[this.direction].toLowerCase())];
        };
        RequestIndexCursor.prototype.onSuccess = function (e) {
            var cursor = e.target.result;
            if (cursor) {
                if (illa.isUndefinedOrNull(this.resultFilter) || this.resultFilter(cursor.key, cursor.value)) {
                    this.result.push(cursor.value);
                }
                cursor.continue();
            }
            else {
                _super.prototype.onSuccess.call(this, e);
                this.onResult(this.result);
            }
        };
        RequestIndexCursor.prototype.getTypeName = function () {
            return 'IndexCursor';
        };
        RequestIndexCursor.prototype.getMode = function () {
            return 0 /* READONLY */;
        };
        RequestIndexCursor.prototype.getResultFilter = function () {
            return this.resultFilter;
        };
        RequestIndexCursor.prototype.setResultFilter = function (value) {
            this.resultFilter = value;
            return this;
        };
        return RequestIndexCursor;
    })(adat.RequestIndex);
    adat.RequestIndexCursor = RequestIndexCursor;
})(adat || (adat = {}));
/// <reference path='../../lib/illa/_module.ts'/>
/// <reference path='RequestIndex.ts'/>
var adat;
(function (adat) {
    var RequestIndexGet = (function (_super) {
        __extends(RequestIndexGet, _super);
        function RequestIndexGet(objectStoreDescriptor, indexDescriptor, onResult, key) {
            _super.call(this, objectStoreDescriptor, indexDescriptor);
            this.onResult = onResult;
            this.key = key;
        }
        RequestIndexGet.prototype.processInternal = function (objectStore) {
            return [this.getIndexFromObjectStore(objectStore).get(this.key)];
        };
        RequestIndexGet.prototype.onSuccess = function (e) {
            _super.prototype.onSuccess.call(this, e);
            this.onResult(e.target.result);
        };
        RequestIndexGet.prototype.getTypeName = function () {
            return 'IndexGet';
        };
        RequestIndexGet.prototype.getMode = function () {
            return 0 /* READONLY */;
        };
        return RequestIndexGet;
    })(adat.RequestIndex);
    adat.RequestIndexGet = RequestIndexGet;
})(adat || (adat = {}));
/// <reference path='../../lib/illa/EventHandler.ts'/>
/// <reference path='Database.ts'/>
/// <reference path='Request.ts'/>
/// <reference path='TransactionMode.ts'/>
var adat;
(function (adat) {
    var Transaction = (function (_super) {
        __extends(Transaction, _super);
        function Transaction(database, requests, mode) {
            _super.call(this);
            this.database = database;
            this.requests = requests;
            this.mode = mode;
            this.name = '';
        }
        Transaction.prototype.process = function () {
            if (this.database.getIsOpen()) {
                this.processInternal();
            }
            else {
                this.database.open();
                this.database.addEventCallback(adat.Database.EVENT_OPEN_SUCCESS, this.processInternal, this);
            }
            return this;
        };
        Transaction.prototype.processInternal = function () {
            if (!this.transaction) {
                this.transaction = this.database.getIDBDatabase().transaction(this.getObjectStoreNames(), Transaction.getModeValue(this.getMode()));
                this.transaction.onabort = illa.bind(this.onAbort, this);
                this.transaction.onerror = illa.bind(this.onError, this);
                this.transaction.oncomplete = illa.bind(this.onComplete, this);
            }
            for (var i = 0, n = this.requests.length; i < n; i++) {
                var request = this.requests[i];
                var objectStoreName = illa.ObjectUtil.getKeyOfValue(this.database.getCurrentVersionDescriptor().getObjectStoreDescriptors(), request.getObjectStoreDescriptor());
                request.process(this.transaction.objectStore(objectStoreName));
            }
        };
        Transaction.prototype.getObjectStoreNames = function () {
            var result = [];
            var osds = [];
            for (var i = 0, n = this.requests.length; i < n; i++) {
                var osd = this.requests[i].getObjectStoreDescriptor();
                if (illa.ArrayUtil.indexOf(osds, osd) == -1) {
                    osds.push(osd);
                    result.push(illa.ObjectUtil.getKeyOfValue(this.database.getCurrentVersionDescriptor().getObjectStoreDescriptors(), osd));
                }
            }
            return result;
        };
        Transaction.prototype.getMode = function () {
            if (illa.isUndefinedOrNull(this.mode)) {
                return this.getModeFromRequests();
            }
            else {
                return this.mode;
            }
        };
        Transaction.prototype.getModeFromRequests = function () {
            var result = 0 /* READONLY */;
            for (var i = 0, n = this.requests.length; i < n; i++) {
                var mode = this.requests[i].getMode();
                if (mode > result) {
                    result = mode;
                    break;
                }
            }
            return result;
        };
        Transaction.getModeValue = function (mode) {
            switch (mode) {
                case 0 /* READONLY */:
                    return 'readonly';
                case 1 /* READWRITE */:
                    return 'readwrite';
            }
            return '';
        };
        Transaction.prototype.onAbort = function (e) {
            illa.Log.warn('Aborted transaction.');
            new illa.Event(Transaction.EVENT_ABORT, this).dispatch();
        };
        Transaction.prototype.onError = function (e) {
            illa.Log.error('Transaction error:', e.message);
            new illa.Event(Transaction.EVENT_ERROR, this).dispatch();
        };
        Transaction.prototype.onComplete = function (e) {
            illa.Log.infoIf(this.name, 'Transaction complete.');
            new illa.Event(Transaction.EVENT_COMPLETE, this).dispatch();
        };
        Transaction.prototype.getDatabase = function () {
            return this.database;
        };
        Transaction.prototype.getRequests = function () {
            return this.requests;
        };
        Transaction.prototype.setRequests = function (value) {
            this.requests = value;
            return this;
        };
        Transaction.prototype.getIDBTransaction = function () {
            return this.transaction;
        };
        Transaction.prototype.setName = function (value) {
            this.name = value;
            return this;
        };
        Transaction.prototype.getName = function () {
            return this.name;
        };
        Transaction.EVENT_ABORT = 'adat_Transaction_EVENT_ABORT';
        Transaction.EVENT_ERROR = 'adat_Transaction_EVENT_ERROR';
        Transaction.EVENT_COMPLETE = 'adat_Transaction_EVENT_COMPLETE';
        return Transaction;
    })(illa.EventHandler);
    adat.Transaction = Transaction;
})(adat || (adat = {}));
var illa;
(function (illa) {
    var NumberUtil = (function () {
        function NumberUtil() {
        }
        NumberUtil.toStringNoLetters = function (num) {
            var result = '';
            if (!isNaN(num) && isFinite(num)) {
                if (Math.abs(num) < 1.0) {
                    var e = parseInt(num.toString().split('e-')[1]);
                    if (e) {
                        num *= Math.pow(10, e - 1);
                        result = '0.' + (new Array(e)).join('0') + num.toString().substring(2);
                    }
                    else {
                        result = num + '';
                    }
                }
                else {
                    var e = parseInt(num.toString().split('+')[1]);
                    if (e > 20) {
                        e -= 20;
                        num /= Math.pow(10, e);
                        result = num + (new Array(e + 1)).join('0');
                    }
                    else {
                        result = num + '';
                    }
                }
            }
            return result;
        };
        return NumberUtil;
    })();
    illa.NumberUtil = NumberUtil;
})(illa || (illa = {}));
var illa;
(function (illa) {
    var StringUtil = (function () {
        function StringUtil() {
        }
        StringUtil.escapeHTML = function (str) {
            return str.replace(/[&<>"']/g, function (s) {
                return StringUtil.CHAR_TO_HTML[s];
            });
        };
        StringUtil.castNicely = function (str) {
            return str == null ? '' : String(str);
        };
        StringUtil.trim = function (str) {
            return str.replace(/^\s+|\s+$/g, '');
        };
        StringUtil.escapeRegExp = function (str) {
            return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        };
        StringUtil.CHAR_TO_HTML = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;' // IE8 does not support &apos;
        };
        return StringUtil;
    })();
    illa.StringUtil = StringUtil;
})(illa || (illa = {}));
/// <reference path='_module.ts'/>
/// <reference path='NumberUtil.ts'/>
/// <reference path='StringUtil.ts'/>
var illa;
(function (illa) {
    var Arrkup = (function () {
        function Arrkup(source, allowRaw) {
            if (allowRaw === void 0) { allowRaw = true; }
            this.source = source;
            this.allowRaw = allowRaw;
        }
        Arrkup.prototype.createString = function () {
            return this.processArrkup(this.getSource());
        };
        Arrkup.prototype.processArrkup = function (source) {
            var result = '';
            if (illa.isArray(source)) {
                var sourceArr = source;
                if (illa.isString(sourceArr[0])) {
                    result = this.processTag(sourceArr);
                }
                else if (illa.isArray(sourceArr[0])) {
                    result = this.processGroup(sourceArr);
                }
                else if (illa.isNull(sourceArr[0])) {
                    if (this.getAllowRaw()) {
                        result = this.processRaw(sourceArr);
                    }
                }
            }
            else {
                result = this.processNonArrkup(source);
            }
            return result;
        };
        Arrkup.prototype.processTag = function (source) {
            var tagName = source[0];
            var isSelfClosing = tagName.charAt(tagName.length - 1) == '/';
            if (isSelfClosing)
                tagName = tagName.slice(0, -1);
            var result = '<' + tagName;
            var hasAttributes = illa.isObjectNotNull(source[1]) && !illa.isArray(source[1]);
            if (hasAttributes)
                result += this.processAttributes(source[1]);
            var contentIndex = hasAttributes ? 2 : 1;
            if (isSelfClosing) {
                result += '/>';
            }
            else {
                result += '>';
                result += this.processChildren(source, contentIndex);
                result += '</' + tagName + '>';
            }
            return result;
        };
        Arrkup.prototype.processGroup = function (source) {
            return this.processChildren(source, 0);
        };
        Arrkup.prototype.processRaw = function (source) {
            var result = '';
            for (var i = 1, n = source.length; i < n; i++) {
                result += source[i] + '';
            }
            return result;
        };
        Arrkup.prototype.processNonArrkup = function (source) {
            return illa.StringUtil.escapeHTML(source + '');
        };
        Arrkup.prototype.processAttributes = function (rawProps) {
            var result = '';
            for (var prop in rawProps) {
                if (rawProps.hasOwnProperty(prop)) {
                    result += this.processAttribute(prop, rawProps[prop]);
                }
            }
            return result;
        };
        Arrkup.prototype.processAttribute = function (key, value) {
            var result = '';
            if (key) {
                if (illa.isNumber(value)) {
                    value = illa.NumberUtil.toStringNoLetters(value);
                }
                if (illa.isString(value)) {
                    result = ' ' + key + '="' + illa.StringUtil.escapeHTML(value) + '"';
                }
                else if (illa.isBoolean(value)) {
                    if (value) {
                        result += ' ' + key;
                    }
                }
            }
            return result;
        };
        Arrkup.prototype.processChildren = function (rawChildren, startIndex) {
            var result = '';
            for (var i = startIndex, n = rawChildren.length; i < n; i++) {
                result += this.processArrkup(rawChildren[i]);
            }
            return result;
        };
        Arrkup.prototype.getSource = function () {
            return this.source;
        };
        Arrkup.prototype.setSource = function (value) {
            this.source = value;
        };
        Arrkup.prototype.getAllowRaw = function () {
            return this.allowRaw;
        };
        Arrkup.prototype.setAllowRaw = function (flag) {
            this.allowRaw = flag;
        };
        Arrkup.createString = function (source, allowRaw) {
            if (allowRaw === void 0) { allowRaw = true; }
            return new Arrkup(source, allowRaw).createString();
        };
        return Arrkup;
    })();
    illa.Arrkup = Arrkup;
})(illa || (illa = {}));
/// <reference path='_module.ts'/>
var illa;
(function (illa) {
    var Log = (function () {
        function Log() {
        }
        Log.log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var console = illa.GLOBAL.console;
            if (console && console.log) {
                if (console.log.apply) {
                    console.log.apply(console, args);
                }
                else {
                    console.log(args.join(' '));
                }
            }
        };
        Log.info = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var console = illa.GLOBAL.console;
            if (console && console.info) {
                if (console.info.apply) {
                    console.info.apply(console, args);
                }
                else {
                    console.info(args.join(' '));
                }
            }
            else {
                Log.log.apply(this, args);
            }
        };
        Log.warn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var console = illa.GLOBAL.console;
            if (console && console.warn) {
                if (console.warn.apply) {
                    console.warn.apply(console, args);
                }
                else {
                    console.warn(args.join(' '));
                }
            }
            else {
                Log.log.apply(this, args);
            }
        };
        Log.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var console = illa.GLOBAL.console;
            if (console && console.error) {
                if (console.error.apply) {
                    console.error.apply(console, args);
                }
                else {
                    console.error(args.join(' '));
                }
            }
            else {
                Log.log.apply(this, args);
            }
        };
        Log.logIf = function (test) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (test) {
                Log.log.apply(this, [test].concat(args));
            }
        };
        Log.infoIf = function (test) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (test) {
                Log.info.apply(this, [test].concat(args));
            }
        };
        Log.warnIf = function (test) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (test) {
                Log.warn.apply(this, [test].concat(args));
            }
        };
        Log.errorIf = function (test) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (test) {
                Log.error.apply(this, [test].concat(args));
            }
        };
        return Log;
    })();
    illa.Log = Log;
})(illa || (illa = {}));
/// <reference path='IAJAXSettingsBeforeSendFunction.ts'/>
/// <reference path='IAJAXSettingsCompleteFunction.ts'/>
/// <reference path='IAJAXSettingsContentsObject.ts'/>
/// <reference path='IAJAXSettingsDataFilterFunction.ts'/>
/// <reference path='IAJAXSettingsXHRFunction.ts'/>
/// <reference path='IXHRDoneFunction.ts'/>
/// <reference path='IXHRFailFunction.ts'/>
/// <reference path='IAJAXTransportCompleteFunction.ts'/>
/// <reference path='IAJAXTransportObject.ts'/>
/// <reference path='ICSSHookObject.ts'/>
/// <reference path='IEvent.ts'/>
/// <reference path='IPromise.ts'/>
/// <reference path='IPromise.ts'/>
/// <reference path='IPromise.ts'/>
/// <reference path='IAnimationOptions.ts'/>
/// <reference path='ITween.ts'/>
/// <reference path='IAnimationDoneFunction.ts'/>
/// <reference path='IAnimationProgressFunction.ts'/>
/// <reference path='IAnimationStartFunction.ts'/>
/// <reference path='IAnimationStepFunction.ts'/>
/// <reference path='ISpecialEasingObject.ts'/>
/// <reference path='IPositionObject.ts'/>
/// <reference path='IEvent.ts'/>
/// <reference path='IEventHandler.ts'/>
/// <reference path='IAddClassFunction.ts'/>
/// <reference path='IAJAXCompleteFunction.ts'/>
/// <reference path='IAJAXErrorFunction.ts'/>
/// <reference path='IAJAXSuccessFunction.ts'/>
/// <reference path='IAnimationOptions.ts'/>
/// <reference path='IAppendFunction.ts'/>
/// <reference path='IAttrFunction.ts'/>
/// <reference path='IClassToggleFunction.ts'/>
/// <reference path='ICSSFunction.ts'/>
/// <reference path='ICSSObject.ts'/>
/// <reference path='IEachFunction.ts'/>
/// <reference path='IHTMLFunction.ts'/>
/// <reference path='IIsFunction.ts'/>
/// <reference path='ILoadCompleteFunction.ts'/>
/// <reference path='IOffsetFunction.ts'/>
/// <reference path='IOnEventsObject.ts'/>
/// <reference path='IQueueCallbackFunction.ts'/>
/// <reference path='IReplaceWithFunction.ts'/>
/// <reference path='ISizeFunction.ts'/>
/// <reference path='ITextFunction.ts'/>
/// <reference path='IValFunction.ts'/>
/// <reference path='IWidthFunction.ts'/>
/// <reference path='IWrapFunction.ts'/>
/// <reference path='IEventHandler.ts'/>
/// <reference path='IEventHandler.ts'/>
/// <reference path='IStaticEventSpecialHandleObject.ts'/>
/// <reference path='IStaticEventSpecialSetupFunction.ts'/>
/// <reference path='IStaticEventSpecialTeardownFunction.ts'/>
/// <reference path='IStaticEventSpecialAddFunction.ts'/>
/// <reference path='IStaticEventSpecialAddFunction.ts'/>
/// <reference path='IEventHandler.ts'/>
/// <reference path='IStaticEventSpecialObject.ts'/>
/// <reference path='IStaticEventSpecial.ts'/>
/// <reference path='IXHRAlwaysFunction.ts'/>
/// <reference path='IXHRDoneFunction.ts'/>
/// <reference path='IXHRFailFunction.ts'/>
/// <reference path='IAJAXSettings.ts'/>
/// <reference path='IAJAXPrefilterFunction.ts'/>
/// <reference path='IAJAXTransportHandler.ts'/>
/// <reference path='ICallbacks.ts'/>
/// <reference path='ICSSHooksObject.ts'/>
/// <reference path='IDeferred.ts'/>
/// <reference path='IDeferredBeforeStartFunction.ts'/>
/// <reference path='IEachFunction.ts'/>
/// <reference path='IEachPropertyFunction.ts'/>
/// <reference path='IEventConstructor.ts'/>
/// <reference path='IFXObject.ts'/>
/// <reference path='IGetSuccessFunction.ts'/>
/// <reference path='IGrepFunction.ts'/>
/// <reference path='IInstance.ts'/>
/// <reference path='IMapFunction.ts'/>
/// <reference path='IStaticEvent.ts'/>
/// <reference path='IXHR.ts'/>
var mag;
(function (mag) {
    var data;
    (function (data) {
        var Word = (function () {
            function Word(other) {
                this.lang1 = '';
                this.lang2 = '';
                this.lang1Count = 0;
                this.lang2Count = 0;
                if (other) {
                    for (var i in other) {
                        if (other.hasOwnProperty(i)) {
                            this[i] = other[i];
                        }
                    }
                }
            }
            return Word;
        })();
        data.Word = Word;
    })(data = mag.data || (mag.data = {}));
})(mag || (mag = {}));
/// <reference path='Word.ts'/>
var mag;
(function (mag) {
    var data;
    (function (data) {
        var Wordlist = (function () {
            function Wordlist(other) {
                this.name = '';
                this.lang1Name = '';
                this.lang2Name = '';
                this.words = [];
                if (other) {
                    for (var i in other) {
                        if (other.hasOwnProperty(i)) {
                            this[i] = other[i];
                        }
                    }
                }
            }
            return Wordlist;
        })();
        data.Wordlist = Wordlist;
    })(data = mag.data || (mag.data = {}));
})(mag || (mag = {}));
/// <reference path='Request.ts'/>
var adat;
(function (adat) {
    var RequestDelete = (function (_super) {
        __extends(RequestDelete, _super);
        function RequestDelete(objectStoreDescriptor, key) {
            _super.call(this, objectStoreDescriptor);
            this.key = key;
        }
        RequestDelete.prototype.processInternal = function (objectStore) {
            return [objectStore.delete(this.key)];
        };
        RequestDelete.prototype.getTypeName = function () {
            return 'Delete';
        };
        RequestDelete.prototype.getMode = function () {
            return 1 /* READWRITE */;
        };
        return RequestDelete;
    })(adat.Request);
    adat.RequestDelete = RequestDelete;
})(adat || (adat = {}));
/// <reference path='Request.ts'/>
var adat;
(function (adat) {
    var RequestPut = (function (_super) {
        __extends(RequestPut, _super);
        function RequestPut(objectStoreDescriptor, value, key) {
            _super.call(this, objectStoreDescriptor);
            this.value = value;
            this.key = key;
        }
        RequestPut.prototype.processInternal = function (objectStore) {
            return [objectStore.put(this.value, this.key)];
        };
        RequestPut.prototype.getTypeName = function () {
            return 'Put';
        };
        RequestPut.prototype.getMode = function () {
            return 1 /* READWRITE */;
        };
        return RequestPut;
    })(adat.Request);
    adat.RequestPut = RequestPut;
})(adat || (adat = {}));
var mag;
(function (mag) {
    var util;
    (function (util) {
        var StringUtil = (function () {
            function StringUtil() {
            }
            StringUtil.removeDoubleSpaces = function (s) {
                return s.replace(/\s{2,}/, ' ');
            };
            return StringUtil;
        })();
        util.StringUtil = StringUtil;
    })(util = mag.util || (mag.util = {}));
})(mag || (mag = {}));
var mag;
(function (mag) {
    var util;
    (function (util) {
        var WordlistOptionRenderer = (function () {
            function WordlistOptionRenderer() {
            }
            WordlistOptionRenderer.getArrkup = function () {
                var wordlists = mag.Main.getInstance().getWordlists();
                var arrkup = [['option', { value: 'NaN' }, 'Válassz egy listát...']];
                for (var i = 0, n = wordlists.length; i < n; i++) {
                    var wordlist = wordlists[i];
                    arrkup.push(['option', { value: wordlist.id }, wordlist.name + ' (' + wordlist.lang1Name + ', ' + wordlist.lang2Name + ')']);
                }
                return arrkup;
            };
            return WordlistOptionRenderer;
        })();
        util.WordlistOptionRenderer = WordlistOptionRenderer;
    })(util = mag.util || (mag.util = {}));
})(mag || (mag = {}));
/// <reference path='../util/WordlistOptionRenderer.ts'/>
var mag;
(function (mag) {
    var ui;
    (function (ui) {
        var WordlistSelectorForm = (function (_super) {
            __extends(WordlistSelectorForm, _super);
            function WordlistSelectorForm(selectorId) {
                _super.call(this);
                this.selector = jQuery(selectorId);
                this.selector.on('change', illa.bind(this.onSelected, this));
                mag.Main.getInstance().addEventCallback(mag.Main.EVENT_WORDLISTS_LOAD_START, this.onWordlistsLoadStart, this);
                mag.Main.getInstance().addEventCallback(mag.Main.EVENT_WORDLISTS_LOADED, this.onWordlistsLoaded, this);
                mag.Main.getInstance().addEventCallback(mag.Main.EVENT_SELECTED_WORDLIST_CHANGED, this.onSelectedWordlistChanged, this);
            }
            WordlistSelectorForm.prototype.onWordlistsLoadStart = function (e) {
                this.selector.prop('disabled', true);
            };
            WordlistSelectorForm.prototype.onWordlistsLoaded = function (e) {
                this.selector.html(illa.Arrkup.createString(mag.util.WordlistOptionRenderer.getArrkup()));
                this.selector.prop('disabled', false);
                this.selector.val(mag.Main.getInstance().getSelectedWordlistId() + '');
            };
            WordlistSelectorForm.prototype.onSelected = function (e) {
                mag.Main.getInstance().setSelectedWordistId(Number(this.selector.val()));
            };
            WordlistSelectorForm.prototype.onSelectedWordlistChanged = function (e) {
                this.selector.val(mag.Main.getInstance().getSelectedWordlistId() + '');
            };
            WordlistSelectorForm.prototype.getSelector = function () {
                return this.selector;
            };
            return WordlistSelectorForm;
        })(illa.EventHandler);
        ui.WordlistSelectorForm = WordlistSelectorForm;
    })(ui = mag.ui || (mag.ui = {}));
})(mag || (mag = {}));
/// <reference path='../../../lib/adat/RequestDelete.ts'/>
/// <reference path='../../../lib/adat/RequestPut.ts'/>
/// <reference path='../util/StringUtil.ts'/>
/// <reference path='../util/WordlistOptionRenderer.ts'/>
/// <reference path='WordlistSelectorForm.ts'/>
var mag;
(function (mag) {
    var ui;
    (function (ui) {
        var EditWordlistForm = (function (_super) {
            __extends(EditWordlistForm, _super);
            function EditWordlistForm() {
                _super.call(this, '#list-select');
                this.renameNotifications = new ui.Notifications(jQuery('#notifications-rename'));
                this.renameListNameIn = jQuery('#rename-list-name-in');
                this.renameListButton = jQuery('#rename-list-button');
                this.renameLang1NameIn = jQuery('#rename-lang1-name-in');
                this.renameLang1Button = jQuery('#rename-lang1-button');
                this.renameLang2NameIn = jQuery('#rename-lang2-name-in');
                this.renameLang2Button = jQuery('#rename-lang2-button');
                this.deleteNotifications = new ui.Notifications(jQuery('#notifications-delete'));
                this.deleteListConfirm = jQuery('#delete-list-confirm');
                this.deleteListButton = jQuery('#delete-list-button');
                this.deleteListButtonGroup = jQuery('#delete-list-button-group');
                this.addWordNotifications = new ui.Notifications(jQuery('#notifications-add-word'));
                this.addWord1InLabel = jQuery('#add-word-1-in-label');
                this.addWord1In = jQuery('#add-word-1-in');
                this.addWord2InLabel = jQuery('#add-word-2-in-label');
                this.addWord2In = jQuery('#add-word-2-in');
                this.addWordButton = jQuery('#add-word-button');
                this.editWordsNotifications = new ui.Notifications(jQuery('#notifications-edit-words'));
                this.editWordsSelectAll = jQuery('#edit-words-select-all');
                this.editWordsLang1Th = jQuery('#edit-words-lang-1-th');
                this.editWordsLang2Th = jQuery('#edit-words-lang-2-th');
                this.editWordsTbody = jQuery('#edit-words-tbody');
                this.saveWordsButton = jQuery('#save-words');
                this.deleteWordsButton = jQuery('#delete-words');
                this.renameListButton.on('click', illa.bind(this.onListRenameRequested, this));
                this.renameLang1Button.on('click', illa.partial(this.onLangRenameRequested, this, true));
                this.renameLang2Button.on('click', illa.partial(this.onLangRenameRequested, this, false));
                this.deleteListConfirm.on('change', illa.bind(this.onDeleteListConfirmChanged, this));
                this.deleteListButton.on('click', illa.bind(this.onDeleteListRequested, this));
                this.addWord1In.on('keyup', illa.bind(this.onAddWordInKeyUp, this));
                this.addWord2In.on('keyup', illa.bind(this.onAddWordInKeyUp, this));
                this.addWordButton.on('click', illa.bind(this.onAddWordRequested, this));
                this.saveWordsButton.on('click', illa.bind(this.onEditWordsSaveRequested, this));
                this.editWordsSelectAll.on('change', illa.bind(this.onEditWordsSelectAllChanged, this));
                this.deleteWordsButton.on('click', illa.bind(this.onDeleteWordsRequested, this));
            }
            EditWordlistForm.prototype.onWordlistsLoaded = function (e) {
                _super.prototype.onWordlistsLoaded.call(this, e);
                this.updateFormOnSelectionChanged();
            };
            EditWordlistForm.prototype.onSelectedWordlistChanged = function (e) {
                _super.prototype.onSelectedWordlistChanged.call(this, e);
                this.updateFormOnSelectionChanged();
            };
            EditWordlistForm.prototype.updateFormOnSelectionChanged = function () {
                var wordlist = mag.Main.getInstance().getSelectedWordlist() || new mag.data.Wordlist();
                this.renameNotifications.removeAll();
                this.editWordsNotifications.removeAll();
                this.addWordNotifications.removeAll();
                this.deleteNotifications.removeAll();
                this.renameListNameIn.val(wordlist.name);
                this.renameLang1NameIn.val(wordlist.lang1Name);
                this.renameLang2NameIn.val(wordlist.lang2Name);
                this.deleteListConfirm.prop('checked', false);
                this.deleteListButtonGroup.hide();
                this.addWord1InLabel.text(wordlist.lang1Name);
                this.addWord2InLabel.text(wordlist.lang2Name);
                this.editWordsSelectAll.prop('checked', false);
                this.editWordsLang1Th.text(wordlist.lang1Name);
                this.editWordsLang2Th.text(wordlist.lang2Name);
                this.renderWords();
            };
            EditWordlistForm.prototype.onListRenameRequested = function (e) {
                e.preventDefault();
                this.renameNotifications.removeAll();
                var wordlist = mag.Main.getInstance().getSelectedWordlist();
                if (!wordlist) {
                    this.renameNotifications.warning('Válassz listát előbb!');
                    return;
                }
                var newName = illa.StringUtil.trim(this.renameListNameIn.val());
                if (newName == wordlist.name) {
                    this.renameNotifications.warning('Hát igen, ez a neve.');
                    return;
                }
                if (!newName) {
                    this.renameNotifications.error('Kérlek adj nevet a szólistának!');
                    return;
                }
                wordlist = new mag.data.Wordlist(wordlist);
                wordlist.name = newName;
                this.renameTransaction = new adat.Transaction(mag.Main.getDatabase(), [
                    new adat.RequestIndexGet(mag.Main.getDBWordlistsDesc(), mag.Main.getDBWordlistsNameIndexDesc(), illa.partial(this.onListNameChecked, this, wordlist), newName)
                ], 1 /* READWRITE */);
                this.renameTransaction.process();
            };
            EditWordlistForm.prototype.onListNameChecked = function (wordlist, conflictingWordlist) {
                if (conflictingWordlist) {
                    this.renameNotifications.error('Ez a listanév már foglalt.');
                    return;
                }
                this.renameTransaction.setRequests([
                    new adat.RequestPut(mag.Main.getDBWordlistsDesc(), wordlist)
                ]);
                this.renameTransaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, this.onListRenamed, this);
                this.renameTransaction.addEventCallback(adat.Transaction.EVENT_ERROR, this.onListRenameError, this);
                this.renameTransaction.process();
            };
            EditWordlistForm.prototype.onListRenameError = function (e) {
                this.renameNotifications.error('Hiba történt, nem tudtam átnevezni!');
                mag.Main.getInstance().refreshWordlists();
            };
            EditWordlistForm.prototype.onListRenamed = function (e) {
                this.renameNotifications.success('Rendben, átneveztem!');
                mag.Main.getInstance().refreshWordlists();
            };
            EditWordlistForm.prototype.onLangRenameRequested = function (isFirstLang, e) {
                e.preventDefault();
                this.renameNotifications.removeAll();
                var wordlist = mag.Main.getInstance().getSelectedWordlist();
                if (!wordlist) {
                    this.renameNotifications.warning('Válassz listát előbb!');
                    return;
                }
                var newName;
                if (isFirstLang) {
                    newName = illa.StringUtil.trim(this.renameLang1NameIn.val());
                }
                else {
                    newName = illa.StringUtil.trim(this.renameLang2NameIn.val());
                }
                var oldName;
                if (isFirstLang) {
                    oldName = wordlist.lang1Name;
                }
                else {
                    oldName = wordlist.lang2Name;
                }
                if (newName == oldName) {
                    this.renameNotifications.warning('Hát igen, ez a neve.');
                    return;
                }
                if (!newName) {
                    this.renameNotifications.error('Kérlek adj nevet a nyelvnek!');
                    return;
                }
                wordlist = new mag.data.Wordlist(wordlist);
                if (isFirstLang) {
                    wordlist.lang1Name = newName;
                }
                else {
                    wordlist.lang2Name = newName;
                }
                this.renameTransaction = new adat.Transaction(mag.Main.getDatabase(), [
                    new adat.RequestPut(mag.Main.getDBWordlistsDesc(), wordlist)
                ], 1 /* READWRITE */);
                this.renameTransaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, this.onListRenamed, this);
                this.renameTransaction.addEventCallback(adat.Transaction.EVENT_ERROR, this.onListRenameError, this);
                this.renameTransaction.process();
            };
            EditWordlistForm.prototype.onDeleteListConfirmChanged = function (e) {
                this.deleteListButtonGroup.toggle(this.deleteListConfirm.prop('checked'));
            };
            EditWordlistForm.prototype.onDeleteListRequested = function (e) {
                e.preventDefault();
                this.deleteNotifications.removeAll();
                var list = mag.Main.getInstance().getSelectedWordlist();
                if (!list) {
                    this.deleteNotifications.error('Válassz listát előbb!');
                    return;
                }
                this.deleteTransaction = new adat.Transaction(mag.Main.getDatabase(), [
                    new adat.RequestDelete(mag.Main.getDBWordlistsDesc(), list.id)
                ]);
                this.deleteTransaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, this.onListDeleted, this);
                this.deleteTransaction.addEventCallback(adat.Transaction.EVENT_ERROR, this.onListDeleteError, this);
                this.deleteTransaction.process();
            };
            EditWordlistForm.prototype.onListDeleteError = function (e) {
                this.deleteNotifications.error('Hiba történt, nem tudtam törölni!');
                mag.Main.getInstance().refreshWordlists();
            };
            EditWordlistForm.prototype.onListDeleted = function (e) {
                this.deleteNotifications.success('Rendben, töröltem!');
                mag.Main.getInstance().refreshWordlists();
            };
            EditWordlistForm.prototype.onAddWordInKeyUp = function (e) {
                if (e.which == 13) {
                    this.onAddWordRequested();
                }
            };
            EditWordlistForm.prototype.onAddWordRequested = function (e) {
                this.addWordNotifications.removeAll();
                var wordlist = mag.Main.getInstance().getSelectedWordlist();
                if (!wordlist) {
                    this.addWordNotifications.warning('Válassz listát előbb!');
                    return;
                }
                var newWord = new mag.data.Word();
                newWord.lang1 = illa.StringUtil.trim(this.addWord1In.val());
                newWord.lang2 = illa.StringUtil.trim(this.addWord2In.val());
                newWord.lang1Count = mag.Main.PRACTICE_COUNT_DEFAULT;
                newWord.lang2Count = mag.Main.PRACTICE_COUNT_DEFAULT;
                if (!newWord.lang1 || !newWord.lang2) {
                    this.addWordNotifications.error('Kérlek add meg mindkét szót!');
                    return;
                }
                this.checkNewWordAndReportCollisions(wordlist, newWord, NaN, this.addWordNotifications);
                wordlist.words.push(newWord);
                this.addWordTransaction = new adat.Transaction(mag.Main.getDatabase(), [
                    new adat.RequestPut(mag.Main.getDBWordlistsDesc(), wordlist)
                ]);
                this.addWordTransaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, this.onWordAdded, this);
                this.addWordTransaction.addEventCallback(adat.Transaction.EVENT_ERROR, this.onAddWordError, this);
                this.addWordTransaction.process();
            };
            EditWordlistForm.prototype.onAddWordError = function (e) {
                this.addWordNotifications.error('Hiba történt, nem tudtam hozzáadni!');
                mag.Main.getInstance().refreshWordlists();
            };
            EditWordlistForm.prototype.onWordAdded = function (e) {
                this.addWordNotifications.success('Rendben, hozzáadtam!');
                this.addWord1In.val('').focus();
                this.addWord2In.val('');
                mag.Main.getInstance().refreshWordlists();
            };
            EditWordlistForm.prototype.renderWords = function () {
                var wordlist = mag.Main.getInstance().getSelectedWordlist() || new mag.data.Wordlist();
                var arrkup = [];
                for (var i = 0, n = wordlist.words.length; i < n; i++) {
                    var word = wordlist.words[i];
                    arrkup.push(['tr', { id: 'edit-word-' + (i + 1), 'data-edit-word-id': i }, ['td', ['div', { 'class': 'mag-cell-content-min' }, ['p', { 'class': 'form-control-static' }, ['input/', { 'type': 'checkbox', 'data-edit-word-selected': true }]]]], ['td', { 'class': 'mag-cell-min' }, ['p', { 'class': 'form-control-static' }, i + 1 + '']], ['td', { 'class': 'mag-cell-half' }, ['input/', { type: 'text', 'class': 'form-control', value: word.lang1, 'data-edit-word-lang1-in': true }]], ['td', { 'class': 'mag-cell-min' }, ['input/', { type: 'number', 'class': 'form-control', value: word.lang1Count, min: 0, max: 9, step: 1, pattern: '[0-9]{1,1}', 'data-edit-word-lang1-count-in': true }]], ['td', { 'class': 'mag-cell-half' }, ['input/', { type: 'text', 'class': 'form-control', value: word.lang2, 'data-edit-word-lang2-in': true }]], ['td', { 'class': 'mag-cell-min' }, ['input/', { type: 'number', 'class': 'form-control', value: word.lang2Count, min: 0, max: 9, step: 1, pattern: '[0-9]{1,1}', 'data-edit-word-lang2-count-in': true }]]]);
                }
                this.editWordsTbody.html(illa.Arrkup.createString(arrkup));
            };
            EditWordlistForm.prototype.checkNewWordAndReportCollisions = function (wordlist, newWord, skipId, notifications) {
                for (var i = 0, n = wordlist.words.length; i < n; i++) {
                    if (i == skipId)
                        continue;
                    var existingWord = wordlist.words[i];
                    if (existingWord.lang1 == newWord.lang1 || existingWord.lang2 == newWord.lang2) {
                        if (existingWord.lang1Count || existingWord.lang2Count) {
                            notifications.warning(['span', 'Ütközést találtam a következő tanulnivaló szóval: ', ['a', { href: '#edit-word-' + (i + 1) }, (i + 1) + ': ' + existingWord.lang1 + ' – ' + existingWord.lang2 + '.']]);
                        }
                        else {
                            notifications.message(['span', 'Ütközést találtam a következő szóval: ', ['b', { href: '#edit-word-' + (i + 1) }, (i + 1) + ': ' + existingWord.lang1 + ' – ' + existingWord.lang2 + '.']]);
                        }
                    }
                }
            };
            EditWordlistForm.prototype.getRowFromTarget = function (targetJq) {
                return targetJq.closest('tr[data-edit-word-id]');
            };
            EditWordlistForm.prototype.getWordIdFromRow = function (row) {
                return row.data('edit-word-id');
            };
            EditWordlistForm.prototype.getNewWordFromRow = function (row) {
                var newWord = new mag.data.Word();
                newWord.lang1 = mag.util.StringUtil.removeDoubleSpaces(illa.StringUtil.trim(row.find('input[data-edit-word-lang1-in]').val()));
                newWord.lang2 = mag.util.StringUtil.removeDoubleSpaces(illa.StringUtil.trim(row.find('input[data-edit-word-lang2-in]').val()));
                newWord.lang1Count = parseInt(row.find('input[data-edit-word-lang1-count-in]').val());
                newWord.lang2Count = parseInt(row.find('input[data-edit-word-lang2-count-in]').val());
                return newWord;
            };
            EditWordlistForm.prototype.onEditWordsSaveRequested = function (e) {
                e.preventDefault();
                this.editWordsNotifications.removeAll();
                var wordlist = mag.Main.getInstance().getSelectedWordlist();
                if (!wordlist) {
                    this.editWordsNotifications.warning('Válassz listát előbb!');
                    return;
                }
                var rows = this.editWordsTbody.children('tr[data-edit-word-id]');
                for (var i = 0, n = rows.length; i < n; i++) {
                    var row = rows.eq(i);
                    var id = this.getWordIdFromRow(row);
                    var newWord = this.getNewWordFromRow(row);
                    if (!newWord.lang1 || !newWord.lang2 || isNaN(newWord.lang1Count) || isNaN(newWord.lang2Count)) {
                        row.addClass('danger');
                        this.editWordsNotifications.error([[], 'Kérlek tölts ki minden mezőt a ', ['a', { href: '#edit-word-' + (i + 1) }, i + 1 + '. sorban!']]);
                        return;
                    }
                    this.checkNewWordAndReportCollisions(wordlist, newWord, id, this.editWordsNotifications);
                    wordlist.words.splice(id, 1, newWord);
                }
                this.editWordsTransaction = new adat.Transaction(mag.Main.getDatabase(), [
                    new adat.RequestPut(mag.Main.getDBWordlistsDesc(), wordlist)
                ]);
                this.editWordsTransaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, illa.partial(this.onWordsEdited, this, id), this);
                this.editWordsTransaction.addEventCallback(adat.Transaction.EVENT_ERROR, illa.partial(this.onEditWordsError, this, id), this);
                this.editWordsTransaction.process();
            };
            EditWordlistForm.prototype.onEditWordsError = function (id, e) {
                this.editWordsNotifications.error('Hiba történt, nem tudtam menteni!');
                mag.Main.getInstance().refreshWordlists();
            };
            EditWordlistForm.prototype.onWordsEdited = function (id, e) {
                this.editWordsNotifications.success('Rendben, mentettem!');
                mag.Main.getInstance().refreshWordlists();
            };
            EditWordlistForm.prototype.onEditWordsSelectAllChanged = function (e) {
                this.editWordsTbody.find('input[data-edit-word-selected]').prop('checked', jQuery(e.target).prop('checked'));
            };
            EditWordlistForm.prototype.onDeleteWordsRequested = function (e) {
                this.editWordsNotifications.removeAll();
                var checkedBoxes = this.editWordsTbody.find('input[data-edit-word-selected]:checked');
                var wordlist = mag.Main.getInstance().getSelectedWordlist();
                if (!wordlist) {
                    this.editWordsNotifications.error('Válassz listát előbb!');
                    return;
                }
                for (var i = checkedBoxes.length - 1; i >= 0; i--) {
                    var checkedBox = checkedBoxes.eq(i);
                    var row = this.getRowFromTarget(checkedBox);
                    var id = this.getWordIdFromRow(row);
                    wordlist.words.splice(id, 1);
                }
                this.deleteWordsTransaction = new adat.Transaction(mag.Main.getDatabase(), [
                    new adat.RequestPut(mag.Main.getDBWordlistsDesc(), wordlist)
                ]);
                this.deleteWordsTransaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, this.onWordsDeleted, this);
                this.deleteWordsTransaction.addEventCallback(adat.Transaction.EVENT_ERROR, this.onDeleteWordsError, this);
                this.deleteWordsTransaction.process();
            };
            EditWordlistForm.prototype.onDeleteWordsError = function (e) {
                this.editWordsNotifications.error('Hiba történt, nem tudtam törölni!');
                mag.Main.getInstance().refreshWordlists();
            };
            EditWordlistForm.prototype.onWordsDeleted = function (e) {
                this.editWordsNotifications.success('Rendben, töröltem!');
                mag.Main.getInstance().refreshWordlists();
            };
            return EditWordlistForm;
        })(ui.WordlistSelectorForm);
        ui.EditWordlistForm = EditWordlistForm;
    })(ui = mag.ui || (mag.ui = {}));
})(mag || (mag = {}));
var mag;
(function (mag) {
    var data;
    (function (data) {
        var Question = (function () {
            function Question() {
                this.isAnswered = false;
            }
            return Question;
        })();
        data.Question = Question;
    })(data = mag.data || (mag.data = {}));
})(mag || (mag = {}));
/// <reference path='Question.ts'/>
var mag;
(function (mag) {
    var data;
    (function (data) {
        var QuestionList = (function () {
            function QuestionList() {
                this.currentQuestionId = -1;
                this.questions = [];
            }
            return QuestionList;
        })();
        data.QuestionList = QuestionList;
    })(data = mag.data || (mag.data = {}));
})(mag || (mag = {}));
/// <reference path='../data/QuestionList.ts'/>
/// <reference path='../util/StringUtil.ts'/>
/// <reference path='../util/WordlistOptionRenderer.ts'/>
/// <reference path='WordlistSelectorForm.ts'/>
var mag;
(function (mag) {
    var ui;
    (function (ui) {
        (function (LearningFormState) {
            LearningFormState[LearningFormState["NO_STATE"] = 0] = "NO_STATE";
            LearningFormState[LearningFormState["NOT_STARTED"] = 1] = "NOT_STARTED";
            LearningFormState[LearningFormState["STARTED"] = 2] = "STARTED";
        })(ui.LearningFormState || (ui.LearningFormState = {}));
        var LearningFormState = ui.LearningFormState;
        var LearningForm = (function (_super) {
            __extends(LearningForm, _super);
            function LearningForm() {
                _super.call(this, '#learning-list-select');
                this.resultsSection = jQuery('#results');
                this.resultsQuestionCountOut = jQuery('#results-question-count');
                this.resultsCorrectAnswersCountOut = jQuery('#results-correct-answers-count');
                this.resultsFailedAnswersCountOut = jQuery('#results-failed-answers-count');
                this.resultsPercentOut = jQuery('#results-percent');
                this.resultsTextOut = jQuery('#results-text');
                this.resultsDropCountOut = jQuery('#results-drop-count');
                this.resultsRemainingCountOut = jQuery('#results-remaining-count');
                this.startLearningSection = jQuery('#start-learning');
                this.notificationsStartLearning = new ui.Notifications(jQuery('#notifications-start-learning'));
                this.startLearningButton = jQuery('#start-learning-button');
                this.learningSection = jQuery('#learning');
                this.learningListNameOut = jQuery('#learning-list-name-out');
                this.learningLang1InLabel = jQuery('#learning-lang1-in-label');
                this.learningLang1Static = jQuery('#learning-lang1-static');
                this.learningLang1In = jQuery('#learning-lang1-in');
                this.learningLang1Ok = jQuery('#learning-lang1-ok');
                this.learningLang2InLabel = jQuery('#learning-lang2-in-label');
                this.learningLang2Static = jQuery('#learning-lang2-static');
                this.learningLang2In = jQuery('#learning-lang2-in');
                this.learningLang2Ok = jQuery('#learning-lang2-ok');
                this.learningOkButton = jQuery('#learning-ok-button');
                this.learningDontKnowButton = jQuery('#learning-dont-know-button');
                this.learningQuitButton = jQuery('#learning-quit-button');
                this.learningProgressBar = jQuery('#learning-progress-bar');
                this.state = 0 /* NO_STATE */;
                this.percent = NaN;
                this.dropCount = NaN;
                this.remainingCount = NaN;
                this.correctAnswersCount = NaN;
                this.failedAnswersCount = NaN;
                this.startLearningButton.on('click', illa.bind(this.onStartLearningButtonClicked, this));
                this.learningQuitButton.on('click', illa.bind(this.onLearningQuitButtonClicked, this));
                this.learningLang1In.on('input', illa.bind(this.onInputChanged, this));
                this.learningLang2In.on('input', illa.bind(this.onInputChanged, this));
                this.learningLang1In.on('keyup', illa.bind(this.onInputKeyUp, this));
                this.learningLang2In.on('keyup', illa.bind(this.onInputKeyUp, this));
                this.learningOkButton.on('click', illa.bind(this.onOkClicked, this));
                this.learningDontKnowButton.on('click', illa.bind(this.onDontKnowClicked, this));
            }
            LearningForm.prototype.showRemainingCountNotification = function () {
                this.remainingCount = this.calculateRemainingCount();
                var wordlist = mag.Main.getInstance().getSelectedWordlist();
                if (!isNaN(this.remainingCount) && wordlist.words.length) {
                    if (this.remainingCount) {
                        this.notificationsStartLearning.message('Maradt még %1% szavam, vágjunk bele!'.replace(/%1%/g, this.remainingCount + ''));
                    }
                    else {
                        this.notificationsStartLearning.success('Nincs egy szavam se, mindent megtanultál!');
                    }
                }
            };
            LearningForm.prototype.onWordlistsLoaded = function (e) {
                _super.prototype.onWordlistsLoaded.call(this, e);
                this.notificationsStartLearning.removeAll();
                this.showRemainingCountNotification();
                this.setState(1 /* NOT_STARTED */);
            };
            LearningForm.prototype.onSelectedWordlistChanged = function (e) {
                _super.prototype.onSelectedWordlistChanged.call(this, e);
                this.notificationsStartLearning.removeAll();
                this.showRemainingCountNotification();
                this.setState(1 /* NOT_STARTED */);
            };
            LearningForm.prototype.onSelected = function (e) {
                _super.prototype.onSelected.call(this, e);
                this.notificationsStartLearning.removeAll();
                this.showRemainingCountNotification();
            };
            LearningForm.prototype.getState = function () {
                return this.state;
            };
            LearningForm.prototype.setState = function (value) {
                if (this.state == value)
                    return;
                this.state = value;
                this.notificationsStartLearning.removeAll();
                switch (value) {
                    case 1 /* NOT_STARTED */:
                        this.showRemainingCountNotification();
                        this.resultsSection.toggle(!isNaN(this.percent));
                        this.resultsQuestionCountOut.text(this.getQuestionCount());
                        this.resultsCorrectAnswersCountOut.text(this.correctAnswersCount);
                        this.resultsFailedAnswersCountOut.text(this.failedAnswersCount);
                        this.resultsPercentOut.text(this.percent + '%');
                        this.resultsTextOut.text(this.getResultsText(this.percent));
                        this.resultsDropCountOut.text(this.dropCount);
                        this.resultsRemainingCountOut.text(this.remainingCount);
                        this.startLearningSection.show();
                        this.learningSection.hide();
                        break;
                    case 2 /* STARTED */:
                        this.resultsSection.hide();
                        this.startLearningSection.hide();
                        this.learningSection.show();
                        var wordlist = mag.Main.getInstance().getSelectedWordlist();
                        this.learningListNameOut.text(wordlist.name);
                        this.learningLang1InLabel.text(wordlist.lang1Name);
                        this.learningLang2InLabel.text(wordlist.lang2Name);
                        this.correctAnswersCount = 0;
                        this.questionList = this.createQuestionList();
                        this.renderNextQuestion();
                        break;
                }
                new illa.Event(LearningForm.EVENT_STATE_CHANGED, this).dispatch();
            };
            LearningForm.prototype.onStartLearningButtonClicked = function (e) {
                if (mag.Main.getInstance().getSelectedWordlist()) {
                    this.setState(2 /* STARTED */);
                }
                else {
                    this.notificationsStartLearning.error('Válassz egy szólistát előbb!');
                }
            };
            LearningForm.prototype.onLearningQuitButtonClicked = function (e) {
                this.percent = NaN;
                this.setState(1 /* NOT_STARTED */);
                this.notificationsStartLearning.warning('Félbehagytad a tanulást!');
            };
            LearningForm.prototype.createQuestionList = function () {
                var result = new mag.data.QuestionList();
                var wordlist = mag.Main.getInstance().getSelectedWordlist();
                var questions = [];
                for (var i = 0, n = wordlist.words.length; i < n; i++) {
                    var word = wordlist.words[i];
                    if (word.lang1Count) {
                        var question = new mag.data.Question();
                        question.wordId = i;
                        question.isLang1 = true;
                        question.question = word.lang2;
                        question.answer = word.lang1;
                        questions.push(question);
                    }
                    if (word.lang2Count) {
                        var question = new mag.data.Question();
                        question.wordId = i;
                        question.isLang1 = false;
                        question.question = word.lang1;
                        question.answer = word.lang2;
                        questions.push(question);
                    }
                }
                while (questions.length) {
                    var index = Math.floor(Math.random() * questions.length);
                    result.questions.push(questions.splice(index, 1)[0]);
                }
                return result;
            };
            LearningForm.prototype.renderNextQuestion = function () {
                var question = this.questionList.questions[++this.questionList.currentQuestionId];
                if (question) {
                    this.learningLang1In.toggle(question.isLang1).val('');
                    this.learningLang2In.toggle(!question.isLang1).val('');
                    this.learningLang1Static.toggle(!question.isLang1).text(question.question);
                    this.learningLang2Static.toggle(question.isLang1).text(question.question);
                    var progressPercent = Math.round((this.questionList.currentQuestionId + 1) / this.questionList.questions.length * 100);
                    this.learningProgressBar.css('width', progressPercent + '%').text(progressPercent + '%').attr('aria-valuenow', progressPercent);
                    this.onInputChanged();
                    this.getCurrentInput().focus();
                }
                else {
                    this.onEndReached();
                }
            };
            LearningForm.prototype.onInputChanged = function (e) {
                this.isCorrect = mag.util.StringUtil.removeDoubleSpaces(illa.StringUtil.trim(this.getCurrentInput().val())) === this.getCurrentQuestion().answer;
                this.getCurrentOk().toggle(this.isCorrect);
                this.getOtherOk().hide();
                this.getCurrentFormGroup().toggleClass('has-success', this.isCorrect);
                this.getOtherFormGroup().removeClass('has-success');
                this.learningOkButton.prop('disabled', !this.isCorrect);
                this.learningDontKnowButton.prop('disabled', this.isCorrect);
            };
            LearningForm.prototype.onInputKeyUp = function (e) {
                if (this.isCorrect) {
                    if (e.which === 13) {
                        this.onOkClicked();
                    }
                }
            };
            LearningForm.prototype.onOkClicked = function (e) {
                var question = this.getCurrentQuestion();
                if (!question.isAnswered) {
                    question.isAnswered = true;
                    question.isCorrect = true;
                }
                this.renderNextQuestion();
            };
            LearningForm.prototype.onDontKnowClicked = function (e) {
                var question = this.getCurrentQuestion();
                question.isAnswered = true;
                question.isCorrect = false;
                this.getCurrentInput().val(question.answer);
                this.onInputChanged();
            };
            LearningForm.prototype.onEndReached = function () {
                this.dropCount = 0;
                this.correctAnswersCount = 0;
                var wordlist = mag.Main.getInstance().getSelectedWordlist();
                for (var i = this.questionList.questions.length - 1; i >= 0; i--) {
                    var question = this.questionList.questions[i];
                    var word = wordlist.words[question.wordId];
                    if (question.isCorrect) {
                        this.correctAnswersCount++;
                        if (question.isLang1) {
                            if (--word.lang1Count == 0) {
                                this.dropCount++;
                            }
                        }
                        else {
                            if (--word.lang2Count == 0) {
                                this.dropCount++;
                            }
                        }
                    }
                    else {
                        if (question.isLang1) {
                            word.lang1Count = Math.min(word.lang1Count + 1, mag.Main.PRACTICE_COUNT_MAX);
                        }
                        else {
                            word.lang2Count = Math.min(word.lang2Count + 1, mag.Main.PRACTICE_COUNT_MAX);
                        }
                    }
                }
                this.failedAnswersCount = this.questionList.questions.length - this.correctAnswersCount;
                this.remainingCount = this.questionList.questions.length - this.dropCount;
                this.percent = Math.round(this.correctAnswersCount / this.questionList.questions.length * 100);
                this.saveWordlistTransaction = new adat.Transaction(mag.Main.getDatabase(), [
                    new adat.RequestPut(mag.Main.getDBWordlistsDesc(), wordlist)
                ]);
                this.saveWordlistTransaction.addEventCallback(adat.Transaction.EVENT_ERROR, this.onErrorSavingWordlist, this);
                this.saveWordlistTransaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, this.onWordlistSaved, this);
                this.saveWordlistTransaction.process();
            };
            LearningForm.prototype.calculateRemainingCount = function () {
                var result = NaN;
                var wordlist = mag.Main.getInstance().getSelectedWordlist();
                if (wordlist) {
                    result = 0;
                    for (var i = wordlist.words.length - 1; i >= 0; i--) {
                        var word = wordlist.words[i];
                        if (word.lang1Count)
                            result++;
                        if (word.lang2Count)
                            result++;
                    }
                }
                return result;
            };
            LearningForm.prototype.getResultsText = function (percent) {
                if (percent == 100) {
                    return 'Tökéletes! Nagyon ügyes voltál!';
                }
                else if (percent >= 95) {
                    return 'Ez igen! Nagyon ügyes voltál!';
                }
                else if (percent >= 90) {
                    return 'Nagyon szép eredmény!';
                }
                else if (percent >= 80) {
                    return 'Szép eredmény!';
                }
                else if (percent >= 70) {
                    return 'Jól megy, csak így tovább!';
                }
                else if (percent >= 60) {
                    return 'Egész jó, folytasd csak!';
                }
                else if (percent >= 50) {
                    return 'A fele megvolt, na mégegyszer!';
                }
                else if (percent >= 40) {
                    return 'Csak egy kicsi kellett volna a feléhez! Próbáld újra!';
                }
                else if (percent >= 30) {
                    return 'A harmada megvan! Próbáld újra!';
                }
                else if (percent >= 20) {
                    return 'Kezdetnek megteszi. Próbáld újra!';
                }
                else if (percent >= 10) {
                    return 'Ne csüggedj, próbáld újra!';
                }
                else if (percent > 0) {
                    return 'Párat azért eltaláltál. Próbáld újra!';
                }
                else {
                    return 'Minden kezdet nehéz... Próbáld meg újra!';
                }
            };
            LearningForm.prototype.onErrorSavingWordlist = function (e) {
                this.setState(1 /* NOT_STARTED */);
                this.notificationsStartLearning.error('Hiba történt! Nem tudtam lementeni a szólistát!');
            };
            LearningForm.prototype.onWordlistSaved = function (e) {
                mag.Main.getInstance().refreshWordlists();
            };
            LearningForm.prototype.getQuestionCount = function () {
                return this.questionList ? this.questionList.questions.length : 0;
            };
            LearningForm.prototype.getCurrentQuestion = function () {
                return this.questionList ? this.questionList.questions[this.questionList.currentQuestionId] : null;
            };
            LearningForm.prototype.getCurrentInput = function () {
                return this.getCurrentQuestion().isLang1 ? this.learningLang1In : this.learningLang2In;
            };
            LearningForm.prototype.getOtherInput = function () {
                return this.getCurrentQuestion().isLang1 ? this.learningLang2In : this.learningLang1In;
            };
            LearningForm.prototype.getCurrentFormGroup = function () {
                return this.getCurrentInput().closest('.form-group');
            };
            LearningForm.prototype.getOtherFormGroup = function () {
                return this.getOtherInput().closest('.form-group');
            };
            LearningForm.prototype.getCurrentOk = function () {
                return this.getCurrentQuestion().isLang1 ? this.learningLang1Ok : this.learningLang2Ok;
            };
            LearningForm.prototype.getOtherOk = function () {
                return this.getCurrentQuestion().isLang1 ? this.learningLang2Ok : this.learningLang1Ok;
            };
            LearningForm.EVENT_STATE_CHANGED = 'mag_ui_LearningForm_EVENT_STATE_CHANGED';
            return LearningForm;
        })(ui.WordlistSelectorForm);
        ui.LearningForm = LearningForm;
    })(ui = mag.ui || (mag.ui = {}));
})(mag || (mag = {}));
var mag;
(function (mag) {
    var ui;
    (function (ui) {
        (function (MainTabIndex) {
            MainTabIndex[MainTabIndex["START"] = 0] = "START";
            MainTabIndex[MainTabIndex["WORDLIST"] = 1] = "WORDLIST";
            MainTabIndex[MainTabIndex["LEARN"] = 2] = "LEARN";
        })(ui.MainTabIndex || (ui.MainTabIndex = {}));
        var MainTabIndex = ui.MainTabIndex;
        var MainTabs = (function () {
            function MainTabs() {
                this.startTab = jQuery('#tab-start');
                this.wordlistTab = jQuery('#tab-wordlist');
                this.learnTab = jQuery('#tab-learn');
                this.startTabPane = jQuery('#tab-pane-start');
                this.wordlistTabPane = jQuery('#tab-pane-wordlist');
                this.learnTabPane = jQuery('#tab-pane-learn');
                this.allTabs = this.startTab.add(this.wordlistTab).add(this.learnTab);
                this.allTabs.on('click', illa.bind(this.onTabClicked, this));
                this.allTabPanes = this.startTabPane.add(this.wordlistTabPane).add(this.learnTabPane);
            }
            MainTabs.prototype.getTabCount = function () {
                return this.allTabs.length;
            };
            MainTabs.prototype.getActiveTabId = function () {
                return this.allTabs.index(this.allTabs.filter('.active'));
            };
            MainTabs.prototype.setActiveTabId = function (value) {
                var tab = this.allTabs.eq(value);
                if (tab.hasClass('disabled') || tab.hasClass('active')) {
                    return;
                }
                this.allTabs.removeClass('active').eq(value).addClass('active');
                this.allTabPanes.hide().eq(value).show();
            };
            MainTabs.prototype.disableInactiveTabs = function () {
                this.allTabs.not('.active').addClass('disabled');
            };
            MainTabs.prototype.enableAllTabs = function () {
                this.allTabs.removeClass('disabled');
            };
            MainTabs.prototype.onTabClicked = function (e) {
                e.preventDefault();
                this.setActiveTabId(this.allTabs.index(e.currentTarget));
            };
            return MainTabs;
        })();
        ui.MainTabs = MainTabs;
    })(ui = mag.ui || (mag.ui = {}));
})(mag || (mag = {}));
var mag;
(function (mag) {
    var ui;
    (function (ui) {
        var NewWordlistForm = (function (_super) {
            __extends(NewWordlistForm, _super);
            function NewWordlistForm() {
                _super.call(this);
                this.notifications = new ui.Notifications(jQuery('#notifications-new-wordlist'));
                this.nameIn = jQuery('#new-wordlist-name-in');
                this.lang1NameIn = jQuery('#new-wordlist-lang1-name-in');
                this.lang2NameIn = jQuery('#new-wordlist-lang2-name-in');
                this.submitButton = jQuery('#create-new-wordlist');
                this.submitButton.on('click', illa.bind(this.onSubmitButtonClicked, this));
            }
            NewWordlistForm.prototype.onSubmitButtonClicked = function (e) {
                e.preventDefault();
                this.notifications.removeAll();
                this.newList = new mag.data.Wordlist();
                this.newList.name = illa.StringUtil.trim(this.nameIn.val());
                this.newList.lang1Name = illa.StringUtil.trim(this.lang1NameIn.val());
                this.newList.lang2Name = illa.StringUtil.trim(this.lang2NameIn.val());
                if (!this.newList.name) {
                    this.notifications.error('Kérlek adj nevet a szólistának!');
                    return;
                }
                if (!this.newList.lang1Name) {
                    this.notifications.error('Kérlek adj nevet az egyik nyelvnek!');
                    return;
                }
                if (!this.newList.lang2Name) {
                    this.notifications.error('Kérlek adj nevet a másik nyelvnek!');
                    return;
                }
                this.notifications.message('Kérlek várj...', 'time');
                this.submitButton.prop('disabled', true);
                this.transaction = new adat.Transaction(mag.Main.getDatabase(), [
                    new adat.RequestIndexGet(mag.Main.getDBWordlistsDesc(), mag.Main.getDBWordlistsNameIndexDesc(), illa.bind(this.onExistingListRetrieved, this), this.newList.name)
                ], 1 /* READWRITE */);
                this.transaction.process();
            };
            NewWordlistForm.prototype.onExistingListRetrieved = function (existingList) {
                if (existingList) {
                    this.notifications.removeAll();
                    this.notifications.error('Egy lista ezzel a névvel már létezik!');
                    this.submitButton.prop('disabled', false);
                    return;
                }
                this.transaction.setRequests([
                    new adat.RequestAdd(mag.Main.getDBWordlistsDesc(), this.newList)
                ]);
                this.transaction.addEventCallback(adat.Transaction.EVENT_COMPLETE, this.onNewListAdded, this);
                this.transaction.process();
            };
            NewWordlistForm.prototype.onNewListAdded = function (e) {
                this.nameIn.val('');
                this.lang1NameIn.val('');
                this.lang2NameIn.val('');
                this.notifications.removeAll();
                this.notifications.success('Létrehoztam az új listát!');
                this.submitButton.prop('disabled', false);
                new illa.Event(NewWordlistForm.EVENT_NEW_WORDLIST_CREATED, this).dispatch();
            };
            NewWordlistForm.EVENT_NEW_WORDLIST_CREATED = 'mag_ui_NewWordlistForm_EVENT_NEW_WORDLIST_CREATED';
            return NewWordlistForm;
        })(illa.EventHandler);
        ui.NewWordlistForm = NewWordlistForm;
    })(ui = mag.ui || (mag.ui = {}));
})(mag || (mag = {}));
var mag;
(function (mag) {
    var ui;
    (function (ui) {
        var Notifications = (function () {
            function Notifications(container) {
                this.container = container;
            }
            Notifications.prototype.message = function (arrkup, icon, alertType) {
                if (icon === void 0) { icon = ''; }
                if (alertType === void 0) { alertType = 'info'; }
                var result = jQuery(illa.Arrkup.createString(['div', { 'class': 'alert alert-' + alertType, role: 'alert' }, (icon ? ['span', { 'class': 'glyphicon glyphicon-' + icon }] : ''), ' ', arrkup])).appendTo(this.container);
                result.find('a').addClass('alert-link');
                return result;
            };
            Notifications.prototype.warning = function (arrkup, icon) {
                if (icon === void 0) { icon = ''; }
                return this.message(arrkup, icon, 'warning');
            };
            Notifications.prototype.error = function (arrkup, icon) {
                if (icon === void 0) { icon = 'warning-sign'; }
                return this.message(arrkup, icon, 'danger');
            };
            Notifications.prototype.success = function (arrkup, icon) {
                if (icon === void 0) { icon = 'ok'; }
                return this.message(arrkup, icon, 'success');
            };
            Notifications.prototype.removeAll = function () {
                this.container.empty();
            };
            return Notifications;
        })();
        ui.Notifications = Notifications;
    })(ui = mag.ui || (mag.ui = {}));
})(mag || (mag = {}));
/// <reference path='../../lib/adat/Database.ts'/>
/// <reference path='../../lib/adat/RequestAdd.ts'/>
/// <reference path='../../lib/adat/RequestIndexCursor.ts'/>
/// <reference path='../../lib/adat/RequestIndexGet.ts'/>
/// <reference path='../../lib/adat/Transaction.ts'/>
/// <reference path='../../lib/illa/_module.ts'/>
/// <reference path='../../lib/illa/Arrkup.ts'/>
/// <reference path='../../lib/illa/EventHandler.ts'/>
/// <reference path='../../lib/illa/Log.ts'/>
/// <reference path='../../lib/jQuery.d.ts'/>
/// <reference path='data/Wordlist.ts'/>
/// <reference path='ui/EditWordlistForm.ts'/>
/// <reference path='ui/LearningForm.ts'/>
/// <reference path='ui/MainTabs.ts'/>
/// <reference path='ui/NewWordlistForm.ts'/>
/// <reference path='ui/Notifications.ts'/>
var mag;
(function (mag) {
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            _super.call(this);
            this.hasNewVersion = false;
            this.hasUpdateError = false;
            this.debugModeEnabled = window.location.hash == '#debug';
            this.wordlists = [];
            if (this.debugModeEnabled) {
                illa.Log.info('Debug mode enabled.');
            }
            this.supportsAppCache = !!window.applicationCache;
            jQuery(window).on('load', illa.bind(this.onWindowLoaded, this));
        }
        Main.prototype.onWindowLoaded = function () {
            illa.Log.info('DOM loaded.');
            this.mainTabs = new mag.ui.MainTabs();
            this.startNotifications = new mag.ui.Notifications(jQuery('#notifications-start'));
            if (this.supportsAppCache) {
                this.startNotifications.message('Kérlek várj, amíg teljesen betöltődöm...', 'time');
                window.applicationCache.addEventListener('cached', illa.bind(this.onCached, this));
                window.applicationCache.addEventListener('noupdate', illa.bind(this.onCached, this));
                window.applicationCache.addEventListener('updateready', illa.bind(this.onUpdateReady, this));
                window.applicationCache.addEventListener('error', illa.bind(this.onCached, this));
            }
            else {
                this.onAfterCache();
            }
        };
        Main.prototype.onCached = function (e) {
            this.onAfterCache();
        };
        Main.prototype.onNoUpdate = function (e) {
            this.onAfterCache();
        };
        Main.prototype.onUpdateReady = function (e) {
            //			this.hasNewVersion = true;
            //			this.onAfterCache();
            window.location.reload();
        };
        Main.prototype.onError = function (e) {
            this.hasUpdateError = true;
            this.onAfterCache();
        };
        Main.prototype.onAfterCache = function () {
            //			if (this.debugModeEnabled) {
            //				adat.Database.deleteDatabase('mag');
            //			}
            this.startNotifications.message('Szükségem lesz egy böngésző adatbázisra...', 'floppy-disk');
            this.database = new adat.Database('mag', [
                new adat.VersionDescriptor({
                    wordlists: this.dbWordlistsDesc = new adat.ObjectStoreDescriptor('id', true, {
                        nameIndex: this.dbWordlistsNameIndexDesc = new adat.IndexDescriptor('name', true)
                    })
                })
            ]);
            this.database.addEventCallback(adat.Database.EVENT_NOT_SUPPORTED, this.onDatabaseNotSupported, this);
            this.database.addEventCallback(adat.Database.EVENT_BLOCKED, this.onDatabaseBlocked, this);
            this.database.addEventCallback(adat.Database.EVENT_OPEN_ERROR, this.onDatabaseNotSupported, this);
            this.database.addEventCallback(adat.Database.EVENT_OPEN_SUCCESS, this.onDatabaseOpenSuccess, this);
            this.database.open();
        };
        Main.prototype.onDatabaseNotSupported = function (e) {
            this.startNotifications.error('Böngésző adatbázis nélkül nem működöm!');
        };
        Main.prototype.onDatabaseBlocked = function (e) {
            this.startNotifications.warning('Várok az adatbázisra... esetleg nyitva vagyok kétszer is?', 'time');
        };
        Main.prototype.onDatabaseOpenSuccess = function (e) {
            this.startNotifications.removeAll();
            if (this.hasNewVersion) {
                this.startNotifications.message(['span', 'Letöltöttem egy új verziómat, ', ['a', { onclick: 'window.location.reload()', href: '' }, 'kattints ide'], ' hogy elindítsd!'], 'gift');
            }
            else if (this.hasUpdateError) {
                this.startNotifications.error(['span', 'Jaj, nem tudtam letölteni az új verziómat! ', ['a', { onclick: 'window.location.reload()', href: '' }, 'Kattints ide'], ' hogy újra próbálhassam!']);
            }
            if (this.supportsAppCache) {
                this.startNotifications.warning('Internet nélkül is működöm! Jelölj be kedvencnek!', 'star');
            }
            else {
                this.startNotifications.error('Ez a böngésző nem támogatja az internet nélküli módot!');
            }
            this.newWordlistForm = new mag.ui.NewWordlistForm();
            this.newWordlistForm.addEventCallback(mag.ui.NewWordlistForm.EVENT_NEW_WORDLIST_CREATED, this.onNewWordlistCreated, this);
            this.editWordlistForm = new mag.ui.EditWordlistForm();
            this.learningForm = new mag.ui.LearningForm();
            this.learningForm.addEventCallback(mag.ui.LearningForm.EVENT_STATE_CHANGED, this.onLearningFormStateChanged, this);
            this.addEventCallback(Main.EVENT_WORDLISTS_LOADED, this.onInitWordlistsRefreshed, this);
            this.refreshWordlists();
        };
        Main.prototype.onInitWordlistsRefreshed = function (e) {
            this.removeEventCallback(Main.EVENT_WORDLISTS_LOADED, this.onInitWordlistsRefreshed, this);
            window.location.hash = '';
            this.mainTabs.enableAllTabs();
            this.startNotifications.success([
                ['span', 'Kész vagyok a használatra! Kattints a ', ['em', 'szófelvétel'], ' fülre hogy kialakítsd a saját szólistádat, azután a ', ['em', 'tanulás'], ' fülre, hogy megtanuld!']
            ]);
        };
        Main.prototype.onNewWordlistCreated = function (e) {
            this.refreshWordlists();
        };
        Main.prototype.refreshWordlists = function () {
            new illa.Event(Main.EVENT_WORDLISTS_LOAD_START, this).dispatch();
            this.loadListsTransaction = new adat.Transaction(mag.Main.getDatabase(), [
                new adat.RequestIndexCursor(mag.Main.getDBWordlistsDesc(), mag.Main.getDBWordlistsNameIndexDesc(), illa.bind(this.onWordlistsReceived, this))
            ]);
            this.loadListsTransaction.process();
        };
        Main.prototype.onWordlistsReceived = function (wordlists) {
            this.wordlists = wordlists;
            var selectedWordlist = this.getSelectedWordlist();
            if (!selectedWordlist) {
                this.setSelectedWordistId(NaN);
            }
            new illa.Event(Main.EVENT_WORDLISTS_LOADED, this).dispatch();
        };
        Main.prototype.setSelectedWordistId = function (id) {
            if (!isNaN(id)) {
                window.localStorage[Main.LS_KEY_SELECTION_ID] = id + '';
            }
            else {
                delete window.localStorage[Main.LS_KEY_SELECTION_ID];
            }
            new illa.Event(Main.EVENT_SELECTED_WORDLIST_CHANGED, this).dispatch();
        };
        Main.prototype.getSelectedWordlistId = function () {
            return Number(window.localStorage[Main.LS_KEY_SELECTION_ID]);
        };
        Main.prototype.getSelectedWordlist = function () {
            var result = null;
            var id = this.getSelectedWordlistId();
            if (!isNaN(id)) {
                for (var i = 0, n = this.wordlists.length; i < n; i++) {
                    var wordlist = this.wordlists[i];
                    if (wordlist.id == id) {
                        result = wordlist;
                        break;
                    }
                }
            }
            return result;
        };
        Main.prototype.getWordlists = function () {
            return this.wordlists;
        };
        Main.prototype.onLearningFormStateChanged = function (e) {
            if (this.mainTabs.getActiveTabId() === 2 /* LEARN */) {
                switch (this.learningForm.getState()) {
                    case 1 /* NOT_STARTED */:
                        this.mainTabs.enableAllTabs();
                        break;
                    case 2 /* STARTED */:
                        this.mainTabs.disableInactiveTabs();
                        break;
                }
            }
        };
        Main.getInstance = function () {
            return this.instance;
        };
        Main.getDatabase = function () {
            return this.getInstance().database;
        };
        Main.getDBWordlistsDesc = function () {
            return this.getInstance().dbWordlistsDesc;
        };
        Main.getDBWordlistsNameIndexDesc = function () {
            return this.getInstance().dbWordlistsNameIndexDesc;
        };
        Main.LS_KEY_SELECTION_ID = 'mag_Main_selectedWordlistId';
        Main.EVENT_WORDLISTS_LOAD_START = 'mag_Main_EVENT_WORDLISTS_LOAD_START';
        Main.EVENT_WORDLISTS_LOADED = 'mag_Main_EVENT_WORDLISTS_LOADED';
        Main.EVENT_SELECTED_WORDLIST_CHANGED = 'mag_Main_EVENT_SELECTED_WORDLIST_CHANGED';
        Main.PRACTICE_COUNT_DEFAULT = 1;
        Main.PRACTICE_COUNT_MAX = 3;
        Main.instance = new Main();
        return Main;
    })(illa.EventHandler);
    mag.Main = Main;
})(mag || (mag = {}));
