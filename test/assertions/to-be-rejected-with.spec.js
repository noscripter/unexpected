/*global expect*/
describe('to be rejected with assertion', function () {
    it('should succeed if the response is rejected with a reason satisfying the argument', function () {
        return expect(new Promise(function (resolve, reject) {
            setTimeout(function () {
                reject(new Error('OMG!'));
            }, 0);
        }), 'to be rejected with', new Error('OMG!'));
    });

    it('should provide the rejection reason as the fulfillment value', function () {
        return expect(expect.promise.reject(new Error('foo')), 'to be rejected with', 'foo').then(function (reason) {
            expect(reason, 'to have message', 'foo');
        });
    });

    it('should support matching the error message against a regular expression', function () {
        return expect(new Promise(function (resolve, reject) {
            setTimeout(function () {
                reject(new Error('OMG!'));
            }, 0);
        }), 'to be rejected with', /MG/);
    });

    it('should support matching the error message of an UnexpectedError against a regular expression', function () {
        return expect(new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    expect(false, 'to be truthy');
                } catch (err) {
                    reject(err);
                }
            }, 0);
        }), 'to be rejected with', /to be/);
    });

    it('should fail if the promise is rejected with a reason that does not satisfy the argument', function () {
        return expect(
            expect(new Promise(function (resolve, reject) {
                setTimeout(function () {
                    reject(new Error('OMG!'));
                }, 1);
            }), 'to be rejected with', new Error('foobar')),
            'to be rejected with',
            "expected Promise to be rejected with Error('foobar')\n" +
                "  expected Error('OMG!') to satisfy Error('foobar')\n" +
                "\n" +
                "  Error({\n" +
                "    message: 'OMG!' // should equal 'foobar'\n" +
                "                    //\n" +
                "                    // -OMG!\n" +
                "                    // +foobar\n" +
                "  })"
        );
    });

    describe('when passed a function as the subject', function () {
        it('should fail if the function returns a promise that is rejected with the wrong reason', function () {
            expect(function () {
                return expect(function () {
                    return expect.promise.reject(new Error('foo'));
                }, 'to be rejected with', new Error('bar'));
            }, 'to throw',
                "expected\n" +
                "function () {\n" +
                "  return expect.promise.reject(new Error('foo'));\n" +
                "}\n" +
                "to be rejected with Error('bar')\n" +
                "  expected Promise (rejected) => Error('foo')\n" +
                "  to be rejected with error satisfying Error('bar')\n" +
                "    expected Error('foo') to satisfy Error('bar')\n" +
                "\n" +
                "    Error({\n" +
                "      message: 'foo' // should equal 'bar'\n" +
                "                     //\n" +
                "                     // -foo\n" +
                "                     // +bar\n" +
                "    })"
            );
        });

        it('should use the stack of the rejection reason when failing', function () {
            return expect(function () {
                return expect(function () {
                    return expect.promise(function () {
                        (function thisIsImportant() {
                            throw new Error('argh');
                        }());
                    });
                }, 'to be rejected with', 'foobar');
            }, 'to error', function (err) {
                expect(err.stack, 'to match', /thisIsImportant/);
            });
        });
    });

    describe('with another promise library', function () {
        it('should use the stack of the rejection reason when failing', function () {
            return expect(function () {
                return expect(function () {
                    return new Promise(function (resolve, reject) {
                        (function thisIsImportant() {
                            throw new Error('argh');
                        }());
                    });
                }, 'to be rejected with', 'foobar');
            }, 'to error', function (err) {
                expect(err.stack, 'to match', /thisIsImportant/);
            });
        });
    });
});
