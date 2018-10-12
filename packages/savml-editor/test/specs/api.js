import test from 'ava'
import {expect} from 'chai'
import {shallow} from '@vue/test-utils'
import {ucfirst, lcfirst, log, App} from '../../src'

test('simple', async (t) => {
  expect(ucfirst('ab')).to.eql('Ab')
  expect(lcfirst('CD')).to.eql('cD')
  const msg = 'new message'
  const wrapper = shallow(App, {
    propsData: { msg }
  })
  expect(wrapper.text()).to.eql(msg)
  t.pass()
})
