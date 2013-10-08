var box = {};

onmessage = function (evt) {
    var code = evt.data.code,
        name = evt.data.name,
        tests = evt.data.tests;

    try {
        eval(code);

        var fun = box[name];
        if (!fun) {
            throw 'Function ' + name + ' not defined on box';
        }

        tests.forEach(function(test) {
            var stringCall = constructFunctionCall(name, test.param);
            sendAssertion(stringCall, fun(test.param), test.result);
        });
    }
    catch (e) {
        postMessage({
            type : 'error',
            message : e.toString()
        });
    }

    postMessage({
        type : 'finish',
        message : 'Tests finished'
    });

    function sendAssertion (form, result, expected) {
        var resp;

        if (equal(result, expected)) {
            resp = {
                type : 'pass',
                message : form + ' === ' + expected
            };
        }
        else {
            resp = {
                type : 'fail',
                message : form +
                    ' expected ' + str(expected) +
                    ', got ' + str(result)
            };
        }

        postMessage(resp);

        //horrible way to show arrays nicely
        function str (val) {
            if (!Array.isArray(val)) {
                return val;
            }
            return '[' + val.map(str) + ']';
        }
    }
};

//loose equality
function equal (left, right) {
    if (left === right || Object(left) === Object(right)) {
        return true;
    }

    //arrays
    if (Array.isArray(left)) {
        if (!Array.isArray(right) || left.length !== right.length) {
            return false;
        }

        return left.every(function (item, idx) {
            return equal(item, right[idx]);
        });
    }

    //now, this is not a generic solution, this is tailored for the questions.
    // we will only deal with primitives (and their objects) and arrays.
    // so, we cheat.
    return false;
}

function constructFunctionCall (name, param) {
    return name + '(' + JSON.stringify(param) + ')';
}
