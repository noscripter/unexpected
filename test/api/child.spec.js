/*global expect*/
describe('#child', function () {
    var parentExpect;
    var childExpect;
    beforeEach(function () {
        parentExpect = expect.clone();
        childExpect = parentExpect.child();
    });

    it('should have access to assertions defined in the parent after the child was created', function () {
        parentExpect.addAssertion('<string> to foo', function (expect, subject) {
            expect(subject, 'to equal', 'foo');
        });
        childExpect('foo', 'to foo');
    });

    it('should prefer an assertion defined in the child, even if it was added before an identically named one in the parent', function () {
        childExpect.addAssertion('<string> to foo', function (expect, subject) {
            expect(subject, 'to equal', 'foo');
        });
        parentExpect.addAssertion('<string> to foo', function (expect, subject) {
            expect.fail('Wrong one!');
        });
        childExpect('foo', 'to foo');
    });

    it('should have access to identically named assertions with different type signatures in child and parent', function () {
        childExpect.addAssertion('<string> to foo', function (expect, subject) {
            expect.errorMode = 'nested';
            expect(subject, 'to equal', 'foo');
            expect(subject.length, 'to foo');
        });
        parentExpect.addAssertion('<number> to foo', function (expect, subject) {
            expect(subject, 'to equal', 3);
        });
        childExpect('foo', 'to foo');
    });

    it('should have access to styles defined in the parent after the child was created', function () {
        parentExpect.addStyle('yadda', function () {
            this.text('yaddafoo');
        });
        expect(childExpect.createOutput('text').yadda().toString(), 'to equal', 'yaddafoo');
    });

    it('should prefer a style defined in the child, even if it was added before an identically named one in the parent', function () {
        childExpect.addStyle('yadda', function () {
            this.text('yaddagood');
        });
        parentExpect.addStyle('yadda', function () {
            this.text('yaddabad');
        });
        expect(childExpect.createOutput('text').yadda().toString(), 'to equal', 'yaddagood');
    });

    it('should have access to types defined in the parent after the child was created', function () {
        parentExpect.addType({
            name: 'yadda',
            identify: function (obj) {
                return /^yadda/.test(obj);
            }
        });
        childExpect.addAssertion('<yadda> to foo', function (expect, subject) {
            expect(subject, 'to contain', 'foo');
        });
        childExpect('yaddafoo', 'to foo');
    });

    it('should have access to types defined in the parent after the child was created, also in the wrapped expect', function () {
        parentExpect.addType({
            name: 'yadda',
            identify: function (obj) {
                return /^yadda/.test(obj);
            }
        });
        childExpect.addAssertion('<yadda> to bar', function (expect, subject) {
            expect(subject, 'to contain', 'bar');
        });
        childExpect.addAssertion('<yadda> to foobar', function (expect, subject) {
            expect(subject, 'to bar');
            expect(subject, 'to contain', 'foo');
        });
        childExpect('yaddafoobar', 'to foobar');
    });

    it('should prefer a style defined in the child, even if it was added before an identically named one in the parent', function () {
        childExpect.addStyle('yadda', function () {
            this.text('yaddagood');
        });
        parentExpect.addStyle('yadda', function () {
            this.text('yaddabad');
        });
        expect(childExpect.createOutput('text').yadda().toString(), 'to equal', 'yaddagood');
    });

    it('should allow installing an identically named plugin', function () {
        parentExpect.use({
            name: 'foo',
            version: '1.2.3',
            installInto: function () {}
        });
        childExpect.use({
            name: 'foo',
            version: '4.5.6',
            installInto: function () {}
        });
    });
});
