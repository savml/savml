import test from 'ava'

import {ContextLoader, FileLoader} from '../dist'

test(async t => {
	let ctxLoader = new ContextLoader()
	let fileLoader = new FileLoader([
		__dirname + '/fixtures/contract'
	])
	ctxLoader.addLoader(fileLoader)
	let res = await ctxLoader.fetch("com.savml.service.account")
	t.is(typeof res, 'object')

	res = await ctxLoader.fetch("com.savml.web.app")
	t.is(typeof res, "object")
	t.is(res.deps.length > 0, true)
})
