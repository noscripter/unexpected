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

        expect(childExpect.assertions, 'to have keys',
               'foo',
               'bar');
    });

    it('makes the assertion available to the parent expect', function () {
        childExpect.exportAssertion('<string> to foo', function (expect, subject) {
            expect(subject, 'to equal', 'foo');
        });

        parentExpect('foo', 'to foo');
    });

    it('binds the assertion to the child expect', function () {
        childExpect.addType({
            name: 'yadda',
            identify: function (obj) {
                return /^yadda/.test(obj);
            }
        });
        childExpect.exportAssertion('<yadda> to foo', function (expect, subject) {
            expect(subject, 'to contain', 'foo');
        });
        parentExpect('yaddafoo', 'to foo');
    });
});
