/*global expect*/
describe('exportAssertion', function () {
    var parentExpect;
    var childExpect;
    beforeEach(function () {
        parentExpect = expect.clone();
        childExpect = parentExpect.child();
    });

    it('is chainable', function () {
        childExpect.exportAssertion('foo', function () {})
            .exportAssertion('bar', function () {});

        expect(parentExpect.assertions, 'to have keys',
               'foo',
               'bar');
    });

    it('makes the assertion available to the parent expect', function () {
        childExpect.exportAssertion('<string> to foo', function (expect, subject) {
            expect(subject, 'to equal', 'foo');
        });

        parentExpect('foo', 'to foo');
    });

    it('binds the assertion to the child expect so custom types are available', function () {
        childExpect.addType({
            name: 'yadda',
            identify: function (obj) {
                return /^yadda/.test(obj);
            },
            inspect: function (value, depth, output, inspect) {
                output.text('>>').text(value).text('<<');
            }
        });
        childExpect.addAssertion('<yadda> to foo', function (expect, subject) {
            expect(subject, 'to contain', 'foo');
        });
        childExpect.exportAssertion('<string> to be silly', function (expect, subject) {
            expect(subject, 'to foo');
        });
        parentExpect('yaddafoo', 'to be silly');

        expect(function () {
            parentExpect('yaddafo', 'to be silly');
        }, 'to throw',
            'expected >>yaddafo<< to be silly\n' +
            '\n' +
            'yaddafo\n' +
            '     ^^'
        );
    });
});
