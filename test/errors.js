'use strict'

const describe = require('mocha').describe
const expect = require('chai').expect
const it = require('mocha').it
const jo = require('../src/main.js')
const path = require('path')

require('chai').should()

describe('errors', function() {
  it('Should return an error if the orientation is 1', function(done) {
    jo.rotate(path.join(__dirname, '/samples/image_1.jpg'), {}, function(error, buffer) {
      error.should.have.property('code').equal(jo.errors.correct_orientation)
      Buffer.isBuffer(buffer).should.be.ok
      done()
    })
  })

  it('Should return an error if the image does not exist', function(done) {
    jo.rotate('foo.jpg', {}, function(error, buffer, orientation) {
      error.should.have.property('code').equal(jo.errors.read_file)
      expect(buffer).to.equal(null)
      expect(orientation).to.equal(null)
      done()
    })
  })

  it('Should return an error if the file is not an image', function(done) {
    jo.rotate(path.join(__dirname, '/samples/textfile.md'), {}, function(error, buffer, orientation) {
      error.should.have.property('code').equal(jo.errors.read_exif)
      expect(buffer).to.equal(null)
      expect(orientation).to.equal(null)
      done()
    })
  })

  it('Should return an error if the path is not a string/buffer', function(done) {
    jo.rotate(['foo'], {}, function(error, buffer, orientation) {
      error.should.have.property('code').equal(jo.errors.read_file)
      expect(buffer).to.equal(null)
      expect(orientation).to.equal(null)
      done()
    })
  })

  it('Should work if `options` is not an object', function(done) {
    jo.rotate(path.join(__dirname, '/samples/image_2.jpg'), 'options', function(error, buffer, orientation) {
      expect(error).to.equal(null)
      Buffer.isBuffer(buffer).should.be.ok
      expect(orientation).to.equal(2)
      done()
    })
  })

  it('Should return an error if the image has no orientation tag', function(done) {
    jo.rotate(path.join(__dirname, '/samples/image_no_orientation.jpg'), {}, function(error, buffer, orientation) {
      error.should.have.property('code').equal(jo.errors.no_orientation)
      Buffer.isBuffer(buffer).should.be.ok
      expect(orientation).to.equal(null)
      done()
    })
  })

  it('Should return an error if the image has an unknown orientation tag', function(done) {
    jo.rotate(path.join(__dirname, '/samples/image_unknown_orientation.jpg'), {}, function(error, buffer, orientation) {
      error.should.have.property('code').equal(jo.errors.unknown_orientation)
      Buffer.isBuffer(buffer).should.be.ok
      expect(orientation).to.equal(null)
      done()
    })
  })
})
