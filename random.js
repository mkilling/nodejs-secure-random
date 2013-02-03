var Buffer  = require('buffer').Buffer,
    crypto  = require('crypto'),
    assert  = require('assert'),
    MaxUInt = 4294967295;


function _parseArgs(arg_array) {
    var is_range, has_callback;
    is_range = arg_array.length >= 2;
    has_callback = typeof arg_array[arg_array.length-1] === 'function';

    return {
        cb:  has_callback ? arg_array[arg_array.length-1] : undefined,
        min: is_range ? arg_array[0] : undefined,
        max: is_range ? arg_array[1] : undefined
    };
}

/** Map random int to the range so that an even distrobution of results is possible
 *
 * Using this method ensures an even distrobution of as opposed to the modulo
 * technique is is biased.
 *
 * @see http://mathoverflow.net/questions/35556/skewing-the-distribution-of-random-values-over-a-range
 * for an explaination of the modulo issue.
 */
function _mapToRange(min, max, randUInt) {
    var result_range = (max + 1) - min,
        factor = result_range / MaxUInt;

    return ((randUInt * factor) + min) >> 0; // bitshifting by zero equates to Math.floor, albeit faster.
}

function convertBufferToInt(args, buf) {
    var rand_int,
        unsigned_int = Buffer(buf).readUInt32LE(0);

    if (args.min !== undefined) {
        assert(args.max !== undefined && args.min < args.max);
        rand_int = _mapToRange(args.min, args.max, unsigned_int);
    } else {
        rand_int = unsigned_int;
    }

    return rand_int;
}

function asyncGetRandomInt(args) {
    crypto.randomBytes(8, function(err, bytes_slow_buf) {
        var unsigned_int, rand_int;
        if (err) {
            return args.cb(err);
        } else {
            args.cb(null, convertBufferToInt(args, bytes_slow_buf));
        }
    });
}

function syncGetRandomInt(args) {
    var bytes_slow_buf = crypto.randomBytes(8);
    return convertBufferToInt(args, bytes_slow_buf);
}

/*** Returns a random unsigned Int ***
     Returns the random int returned by nodes crypto library
*/
exports.getRandomInt = function(min, max, callback) {
    var args = _parseArgs(arguments), unsigned_int, rand_int;
    if (typeof args.cb === 'function') {
        asyncGetRandomInt(args);
    } else {
        return syncGetRandomInt(args);
    }
};
