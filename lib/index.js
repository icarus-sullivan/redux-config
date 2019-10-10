"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineConfigReducers = exports.createConfigReducer = exports.createConstants = exports.createConfigActions = exports.InvocationType = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var InvocationType = {
  SYNC: 'sync',
  ASYNC: 'async'
};
exports.InvocationType = InvocationType;

var createAsyncAction = function createAsyncAction(_ref) {
  var type = _ref.type,
      errorPayload = _ref.errorPayload,
      dispatch = _ref.dispatch,
      fn = _ref.fn;
  return (
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var res,
          _args = arguments;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              dispatch({
                type: "".concat(type, "_REQUESTED")
              });
              _context.next = 4;
              return fn.apply(void 0, _args);

            case 4:
              res = _context.sent;
              dispatch({
                type: "".concat(type, "_RECEIVED"),
                payload: res
              });
              _context.next = 11;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](0);
              dispatch({
                type: "".concat(type, "_FAILED"),
                payload: errorPayload || _context.t0
              });

            case 11:
              _context.prev = 11;
              dispatch({
                type: "".concat(type, "_DONE")
              });
              return _context.finish(11);

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 8, 11, 14]]);
    }))
  );
};

var createAction = function createAction(_ref3) {
  var type = _ref3.type,
      dispatch = _ref3.dispatch;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return dispatch({
      type: type,
      payload: args.length === 1 ? args[0] : args
    });
  };
};

var createConfigActions = function createConfigActions(obj) {
  return function (dispatch) {
    return Object.entries(obj).reduce(function (a, _ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          key = _ref5[0],
          value = _ref5[1];

      var _value$invocationType = value.invocationType,
          invocationType = _value$invocationType === void 0 ? InvocationType.SYNC : _value$invocationType;

      var mergeDispatch = _objectSpread({}, value, {
        dispatch: dispatch
      });

      if (invocationType === InvocationType.SYNC) {
        a[key] = createAction(mergeDispatch);
      } else if (invocationType === InvocationType.ASYNC) {
        a[key] = createAsyncAction(mergeDispatch);
      }

      return a;
    }, {});
  };
};

exports.createConfigActions = createConfigActions;

var createConstants = function createConstants(_ref6) {
  var _ref6$invocationType = _ref6.invocationType,
      invocationType = _ref6$invocationType === void 0 ? InvocationTypes.SYNC : _ref6$invocationType,
      scope = _ref6.scope,
      _ref6$verbs = _ref6.verbs,
      verbs = _ref6$verbs === void 0 ? [] : _ref6$verbs;
  return verbs.reduce(function (a, b) {
    var SCOPE = scope.toUpperCase();
    var VERB = b.toUpperCase();
    a["".concat(SCOPE, "_").concat(VERB)] = "@".concat(SCOPE, "/").concat(VERB);

    if (invocationType === InvocationType.ASYNC) {
      a["".concat(SCOPE, "_").concat(VERB, "_REQUESTED")] = "@".concat(SCOPE, "/").concat(VERB, "_REQUESTED");
      a["".concat(SCOPE, "_").concat(VERB, "_RECEIVED")] = "@".concat(SCOPE, "/").concat(VERB, "_RECEIVED");
      a["".concat(SCOPE, "_").concat(VERB, "_FAILED")] = "@".concat(SCOPE, "/").concat(VERB, "_FAILED");
      a["".concat(SCOPE, "_").concat(VERB, "_DONE")] = "@".concat(SCOPE, "/").concat(VERB, "_DONE");
    }

    return a;
  }, {});
};

exports.createConstants = createConstants;

var createConfigReducer = function createConfigReducer(config) {
  return function (state, _ref7) {
    var type = _ref7.type,
        payload = _ref7.payload;
    var handler = config[type];

    if (handler) {
      return handler(state, payload);
    }

    return state;
  };
};

exports.createConfigReducer = createConfigReducer;

var combineConfigReducers = function combineConfigReducers() {
  for (var _len2 = arguments.length, config = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    config[_key2] = arguments[_key2];
  }

  var mergedConfigs = config.reduce(function (a, b) {
    return _objectSpread({}, a, {}, b);
  }, {});
  return function (state, _ref8) {
    var type = _ref8.type,
        payload = _ref8.payload;
    var handler = mergedConfigs[type];

    if (handler) {
      return handler(state, payload);
    }

    return state;
  };
};

exports.combineConfigReducers = combineConfigReducers;