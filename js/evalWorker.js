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

        if (result === expected) {
            resp = {
                type : 'pass',
                message : form + ' === ' + expected
            };
        }
        else {
            resp = {
                type : 'fail',
                message : form + ' expected ' + expected + ', got ' + result
            };
        }

        postMessage(resp);
    }
};

function constructFunctionCall (name, param) {
    return name + '(' + param + ')';
}
