var random = require('./random'),
    should = require('should');


describe('Random', function(){
    describe('Using Min and Max', function() {
        var iteration = 3000;

        it('should return a random number if no range is supplied when called asynchronously', function(done) {
            var i, j=0;
            for (i=0; i < iteration; i++) {
                random.getRandomInt(function(err, value) {
                    if (err) {throw err;}
                    value.should.be.a('number');
                    if (++j === iteration) {done();}
                });
            }
        });

        it('should return a random number greater then min when called asynchronously', function(done){
            var i, j=0;
            for (i=0; i < iteration; i++) {
                random.getRandomInt(20, 100, function(err, value) {
                    if (err) {throw err;}
                    value.should.be.a('number');
                    value.should.be.within(20, 100);
                    if (++j === iteration) {done();}
                });
            }
        });

        it('should return a random number if no range is supplied when called synchronously', function(done) {
            var i, j=0, value;
            for (i=0; i < iteration; i++) {
                value = random.getRandomInt();
                value.should.be.a('number');
                if (++j === iteration) {done();}
            }
        });

        it('should return a random number greater then min when called synchronously', function(done){
            var i, j=0, value;
            for (i=0; i < iteration; i++) {
                value = random.getRandomInt(20, 100);
                value.should.be.a('number');
                value.should.be.within(20, 100);
                if (++j === iteration) {done();}
            }
        });
    })
})